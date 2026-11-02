using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace AmitVermaDigital.Models.Entities;

public class FeaturedVideo
{
    public int Id { get; set; }

    [Required]
    [StringLength(150)]
    public string Title { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }

    [Required]
    [StringLength(500)]
    public string VideoUrlOrId { get; set; } = string.Empty;

    public int SortOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public string? GetYouTubeVideoId()
    {
        if (string.IsNullOrWhiteSpace(VideoUrlOrId))
            return null;

        var input = VideoUrlOrId.Trim();

        // If it's already an 11-character alphanumeric string
        if (Regex.IsMatch(input, @"^[A-Za-z0-9_-]{11}$"))
            return input;

        // youtu.be/<id>
        var matchShort = Regex.Match(input, @"youtu\.be/([A-Za-z0-9_-]{11})");
        if (matchShort.Success)
            return matchShort.Groups[1].Value;

        // youtube.com/watch?v=<id>
        var matchWatch = Regex.Match(input, @"[?&]v=([A-Za-z0-9_-]{11})");
        if (matchWatch.Success)
            return matchWatch.Groups[1].Value;

        // youtube.com/embed/<id> or /shorts/<id>
        var matchEmbed = Regex.Match(input, @"youtube\.com/(?:embed|shorts|live)/([A-Za-z0-9_-]{11})");
        if (matchEmbed.Success)
            return matchEmbed.Groups[1].Value;

        return null;
    }
}
