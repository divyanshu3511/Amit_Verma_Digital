using AmitVermaDigital.Services;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging.Abstractions;

namespace AmitVermaDigital.Tests;

public class AdminAuthServiceTests
{
    private (AdminAuthService Service, IMemoryCache Cache) CreateService(
        string? email = "admin@example.com",
        string? password = "SecurePassword123!")
    {
        var inMemorySettings = new Dictionary<string, string?>();
        if (email != null) inMemorySettings["ADMIN_EMAIL"] = email;
        if (password != null) inMemorySettings["ADMIN_PASSWORD"] = password;

        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(inMemorySettings)
            .Build();

        var cache = new MemoryCache(new MemoryCacheOptions());
        var logger = NullLogger<AdminAuthService>.Instance;

        var service = new AdminAuthService(configuration, cache, logger);
        return (service, cache);
    }

    [Fact]
    public void IsConfigured_ReturnsTrue_WhenCredentialsProvided()
    {
        var (service, _) = CreateService("admin@example.com", "SecurePassword123!");
        Assert.True(service.IsConfigured);
        Assert.Equal("admin@example.com", service.AdminEmail);
    }

    [Theory]
    [InlineData(null, "SecurePassword123!")]
    [InlineData("admin@example.com", null)]
    [InlineData("", "SecurePassword123!")]
    [InlineData("admin@example.com", "")]
    [InlineData("   ", "   ")]
    public void IsConfigured_ReturnsFalse_WhenCredentialsMissing(string? email, string? password)
    {
        var (service, _) = CreateService(email, password);
        Assert.False(service.IsConfigured);
    }

    [Fact]
    public async Task ValidateCredentials_FailsSafely_WhenNotConfigured()
    {
        var (service, _) = CreateService(null, null);

        var result = await service.ValidateCredentialsAsync("admin@example.com", "any-pass", "127.0.0.1");

        Assert.False(result.Success);
        Assert.False(result.IsLockedOut);
        Assert.Contains("not configured", result.ErrorMessage);
    }

    [Fact]
    public void HashPassword_ProducesValidPbkdf2Hash()
    {
        var (service, _) = CreateService();
        var hash = service.HashPassword("TestPass123!");

        Assert.NotNull(hash);
        Assert.StartsWith("PBKDF2$100000$", hash);
        var parts = hash.Split('$');
        Assert.Equal(4, parts.Length);
        Assert.Equal("100000", parts[1]);
        Assert.NotEmpty(parts[2]); // Salt
        Assert.NotEmpty(parts[3]); // Key
    }

    [Fact]
    public void VerifyPassword_ValidatesMatchingPassword()
    {
        var (service, _) = CreateService();
        var hash = service.HashPassword("CorrectPassword!");

        Assert.True(service.VerifyPassword("CorrectPassword!", hash));
        Assert.False(service.VerifyPassword("WrongPassword!", hash));
        Assert.False(service.VerifyPassword("", hash));
        Assert.False(service.VerifyPassword("CorrectPassword!", "invalid-hash"));
    }

    [Fact]
    public async Task ValidateCredentials_Succeeds_WithValidCredentials()
    {
        var (service, _) = CreateService("admin@domain.com", "MasterPassword99!");

        var result = await service.ValidateCredentialsAsync("admin@domain.com", "MasterPassword99!", "192.168.1.10");

        Assert.True(result.Success);
        Assert.Null(result.ErrorMessage);
        Assert.False(result.IsLockedOut);
    }

    [Fact]
    public async Task ValidateCredentials_IsCaseInsensitive_ForEmail()
    {
        var (service, _) = CreateService("Admin@Domain.Com", "MasterPassword99!");

        var result = await service.ValidateCredentialsAsync("ADMIN@DOMAIN.COM", "MasterPassword99!", "192.168.1.11");

        Assert.True(result.Success);
    }

    [Fact]
    public async Task ValidateCredentials_LocksOut_After5FailedAttempts()
    {
        var (service, _) = CreateService("admin@domain.com", "CorrectPassword1!");
        var ip = "10.0.0.99";

        // Attempts 1 to 4 should fail but not lock out
        for (int i = 1; i <= 4; i++)
        {
            var attempt = await service.ValidateCredentialsAsync("admin@domain.com", "WrongPassword", ip);
            Assert.False(attempt.Success);
            Assert.False(attempt.IsLockedOut);
            Assert.Contains($"{5 - i} attempt(s) remaining", attempt.ErrorMessage);
        }

        // 5th attempt must trigger lockout
        var fifthAttempt = await service.ValidateCredentialsAsync("admin@domain.com", "WrongPassword", ip);
        Assert.False(fifthAttempt.Success);
        Assert.True(fifthAttempt.IsLockedOut);
        Assert.Contains("locked for 15 minutes", fifthAttempt.ErrorMessage);

        // Immediate subsequent attempt (even with correct password) must be rejected due to lockout
        var lockedAttempt = await service.ValidateCredentialsAsync("admin@domain.com", "CorrectPassword1!", ip);
        Assert.False(lockedAttempt.Success);
        Assert.True(lockedAttempt.IsLockedOut);
        Assert.Contains("Account temporarily locked", lockedAttempt.ErrorMessage);
    }

    [Fact]
    public async Task SuccessfulLogin_ResetsFailedAttemptCounter()
    {
        var (service, _) = CreateService("admin@domain.com", "CorrectPassword1!");
        var ip = "10.0.0.100";

        // 2 failed attempts
        await service.ValidateCredentialsAsync("admin@domain.com", "WrongPassword", ip);
        await service.ValidateCredentialsAsync("admin@domain.com", "WrongPassword", ip);

        // Successful login
        var success = await service.ValidateCredentialsAsync("admin@domain.com", "CorrectPassword1!", ip);
        Assert.True(success.Success);

        // Next failure should start counting from 1 again (4 remaining)
        var failure = await service.ValidateCredentialsAsync("admin@domain.com", "WrongPassword", ip);
        Assert.False(failure.Success);
        Assert.Contains("4 attempt(s) remaining", failure.ErrorMessage);
    }
}
