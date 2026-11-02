using System.Security.Cryptography;
using Microsoft.Extensions.Caching.Memory;

namespace AmitVermaDigital.Services;

public interface IAdminAuthService
{
    bool IsConfigured { get; }
    string? AdminEmail { get; }
    bool IsLockedOut(string clientIp, out TimeSpan? remainingTime);
    Task<(bool Success, string? ErrorMessage, bool IsLockedOut)> ValidateCredentialsAsync(string usernameOrEmail, string password, string clientIp);
    string HashPassword(string password);
    bool VerifyPassword(string password, string hashedPassword);
}

public class AdminAuthService : IAdminAuthService
{
    private readonly IConfiguration _configuration;
    private readonly IMemoryCache _cache;
    private readonly ILogger<AdminAuthService> _logger;

    private readonly string? _adminEmail;
    private readonly string? _passwordHash;
    private const int MaxFailedAttempts = 5;
    private static readonly TimeSpan LockoutDuration = TimeSpan.FromMinutes(15);
    private const int Iterations = 100_000;
    private const int SaltSize = 16;
    private const int KeySize = 32;

    public bool IsConfigured => !string.IsNullOrWhiteSpace(_adminEmail) && !string.IsNullOrWhiteSpace(_passwordHash);
    public string? AdminEmail => _adminEmail;

    public AdminAuthService(
        IConfiguration configuration,
        IMemoryCache cache,
        ILogger<AdminAuthService> logger)
    {
        _configuration = configuration;
        _cache = cache;
        _logger = logger;

        // Retrieve ADMIN_EMAIL from env var -> config -> user secrets
        _adminEmail = Environment.GetEnvironmentVariable("ADMIN_EMAIL")
                      ?? _configuration["ADMIN_EMAIL"]
                      ?? _configuration["AdminSetup:Email"];

        if (!string.IsNullOrWhiteSpace(_adminEmail))
        {
            _adminEmail = _adminEmail.Trim().ToLowerInvariant();
        }

        // Retrieve ADMIN_PASSWORD from env var -> config -> user secrets
        var rawPassword = Environment.GetEnvironmentVariable("ADMIN_PASSWORD")
                          ?? _configuration["ADMIN_PASSWORD"]
                          ?? _configuration["AdminSetup:Password"];

        if (!string.IsNullOrWhiteSpace(rawPassword))
        {
            // Immediately compute PBKDF2 hash so plaintext password is never retained in memory
            _passwordHash = HashPassword(rawPassword.Trim());
            _logger.LogInformation("Administrator credentials successfully configured for {Email}.", _adminEmail);
        }
        else
        {
            _passwordHash = null;
            _logger.LogWarning("ADMIN_PASSWORD is not set. Admin portal logins will be disabled until configured.");
        }
    }

    public bool IsLockedOut(string clientIp, out TimeSpan? remainingTime)
    {
        remainingTime = null;
        var lockoutKey = GetLockoutKey(clientIp);
        if (_cache.TryGetValue(lockoutKey, out DateTime lockoutUntil))
        {
            var remaining = lockoutUntil - DateTime.UtcNow;
            if (remaining > TimeSpan.Zero)
            {
                remainingTime = remaining;
                return true;
            }
            _cache.Remove(lockoutKey);
        }
        return false;
    }

    public async Task<(bool Success, string? ErrorMessage, bool IsLockedOut)> ValidateCredentialsAsync(
        string usernameOrEmail,
        string password,
        string clientIp)
    {
        await Task.CompletedTask; // Keep async signature

        // 1. Check if configured
        if (!IsConfigured || string.IsNullOrEmpty(_adminEmail) || string.IsNullOrEmpty(_passwordHash))
        {
            _logger.LogError("Login attempted, but ADMIN_EMAIL or ADMIN_PASSWORD is not configured on the server.");
            return (false, "Administrator access is not configured on this server. Please configure ADMIN_EMAIL and ADMIN_PASSWORD in environment variables or configuration.", false);
        }

        // 2. Check Lockout
        if (IsLockedOut(clientIp, out var remainingTime))
        {
            var minutes = Math.Max(1, (int)Math.Ceiling(remainingTime!.Value.TotalMinutes));
            _logger.LogWarning("Login attempt rejected due to active lockout from IP {Ip}.", clientIp);
            return (false, $"Account temporarily locked due to excessive failed attempts. Please try again in {minutes} minute(s).", true);
        }

        // 3. Verify Username / Email
        var normalizedInput = usernameOrEmail?.Trim().ToLowerInvariant() ?? string.Empty;
        bool emailMatches = ConstantTimeEquals(normalizedInput, _adminEmail);

        // 4. Verify Password using PBKDF2 and constant-time check
        bool passwordMatches = false;
        if (!string.IsNullOrEmpty(password))
        {
            passwordMatches = VerifyPassword(password, _passwordHash);
        }

        if (emailMatches && passwordMatches)
        {
            // Reset failed counter
            ResetFailedAttempts(clientIp);
            _logger.LogInformation("Administrator successfully authenticated from IP {Ip}.", clientIp);
            return (true, null, false);
        }

        // 5. Record Failed Attempt
        int currentFails = RecordFailedAttempt(clientIp);
        _logger.LogWarning("Failed login attempt {Attempt}/{Max} from IP {Ip}.", currentFails, MaxFailedAttempts, clientIp);

        if (currentFails >= MaxFailedAttempts)
        {
            return (false, "Too many failed login attempts. This access point has been locked for 15 minutes.", true);
        }

        int attemptsLeft = MaxFailedAttempts - currentFails;
        return (false, $"Invalid credentials. {attemptsLeft} attempt(s) remaining before temporary lockout.", false);
    }

    private int RecordFailedAttempt(string clientIp)
    {
        var failsKey = GetFailsKey(clientIp);
        int fails = _cache.GetOrCreate(failsKey, entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = LockoutDuration;
            return 0;
        }) + 1;

        _cache.Set(failsKey, fails, LockoutDuration);

        if (fails >= MaxFailedAttempts)
        {
            var lockoutKey = GetLockoutKey(clientIp);
            _cache.Set(lockoutKey, DateTime.UtcNow.Add(LockoutDuration), LockoutDuration);
            _cache.Remove(failsKey);
        }

        return fails;
    }

    private void ResetFailedAttempts(string clientIp)
    {
        _cache.Remove(GetFailsKey(clientIp));
        _cache.Remove(GetLockoutKey(clientIp));
    }

    private static string GetFailsKey(string ip) => $"admin_fails_{ip}";
    private static string GetLockoutKey(string ip) => $"admin_lockout_{ip}";

    public string HashPassword(string password)
    {
        byte[] salt = RandomNumberGenerator.GetBytes(SaltSize);
        byte[] key = Rfc2898DeriveBytes.Pbkdf2(
            password,
            salt,
            Iterations,
            HashAlgorithmName.SHA256,
            KeySize);

        return $"PBKDF2${Iterations}${Convert.ToBase64String(salt)}${Convert.ToBase64String(key)}";
    }

    public bool VerifyPassword(string password, string hashedPassword)
    {
        if (string.IsNullOrWhiteSpace(hashedPassword) || string.IsNullOrWhiteSpace(password))
            return false;

        var parts = hashedPassword.Split('$');
        if (parts.Length != 4 || parts[0] != "PBKDF2")
            return false;

        if (!int.TryParse(parts[1], out int iterations))
            return false;

        byte[] salt;
        byte[] expectedKey;
        try
        {
            salt = Convert.FromBase64String(parts[2]);
            expectedKey = Convert.FromBase64String(parts[3]);
        }
        catch
        {
            return false;
        }

        byte[] actualKey = Rfc2898DeriveBytes.Pbkdf2(
            password,
            salt,
            iterations,
            HashAlgorithmName.SHA256,
            expectedKey.Length);

        return CryptographicOperations.FixedTimeEquals(actualKey, expectedKey);
    }

    private static bool ConstantTimeEquals(string a, string b)
    {
        byte[] bytesA = System.Text.Encoding.UTF8.GetBytes(a);
        byte[] bytesB = System.Text.Encoding.UTF8.GetBytes(b);
        if (bytesA.Length != bytesB.Length)
            return false;

        return CryptographicOperations.FixedTimeEquals(bytesA, bytesB);
    }
}
