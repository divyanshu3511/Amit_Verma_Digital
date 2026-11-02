namespace AmitVermaDigital.Services;

public interface ITimezoneService
{
    TimeZoneInfo IstTimeZone { get; }
    DateTime ConvertUtcToIst(DateTime utcDateTime);
    DateTime ConvertIstToUtc(DateTime istDateTime);
    string FormatIst(DateTime? utcDateTime, string format = "dd MMM yyyy, hh:mm tt");
}

public class TimezoneService : ITimezoneService
{
    public TimeZoneInfo IstTimeZone { get; }

    public TimezoneService()
    {
        try
        {
            // Windows ID
            IstTimeZone = TimeZoneInfo.FindSystemTimeZoneById("India Standard Time");
        }
        catch
        {
            try
            {
                // IANA / Linux ID
                IstTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Asia/Kolkata");
            }
            catch
            {
                // Fallback to UTC+05:30
                IstTimeZone = TimeZoneInfo.CreateCustomTimeZone("IST", TimeSpan.FromHours(5.5), "India Standard Time", "IST");
            }
        }
    }

    public DateTime ConvertUtcToIst(DateTime utcDateTime)
    {
        var utc = DateTime.SpecifyKind(utcDateTime, DateTimeKind.Utc);
        return TimeZoneInfo.ConvertTimeFromUtc(utc, IstTimeZone);
    }

    public DateTime ConvertIstToUtc(DateTime istDateTime)
    {
        var unspecified = DateTime.SpecifyKind(istDateTime, DateTimeKind.Unspecified);
        return TimeZoneInfo.ConvertTimeToUtc(unspecified, IstTimeZone);
    }

    public string FormatIst(DateTime? utcDateTime, string format = "dd MMM yyyy, hh:mm tt")
    {
        if (!utcDateTime.HasValue) return "—";
        var ist = ConvertUtcToIst(utcDateTime.Value);
        return $"{ist.ToString(format)} IST";
    }
}
