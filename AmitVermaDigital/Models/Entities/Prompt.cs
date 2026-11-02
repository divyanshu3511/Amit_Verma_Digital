using System.ComponentModel.DataAnnotations;

namespace AmitVermaDigital.Models.Entities;

public enum PromptStatus
{
    Draft,
    Live,
    Scheduled,
    Expired
}

public class Prompt
{
    public int Id { get; set; }

    [Required]
    [StringLength(150, MinimumLength = 3)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [StringLength(160)]
    public string Slug { get; set; } = string.Empty;

    [StringLength(500)]
    public string Description { get; set; } = string.Empty;

    [Required]
    [StringLength(60)]
    public string Category { get; set; } = string.Empty;

    [StringLength(300)]
    public string? Keywords { get; set; }

    [Required]
    public string PromptText { get; set; } = string.Empty;

    public bool IsPublished { get; set; }
    public bool IsFeatured { get; set; }

    public DateTime? StartsAtUtc { get; set; }
    public DateTime? EndsAtUtc { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;

    public ICollection<PromptInstruction> Instructions { get; set; } = new List<PromptInstruction>();

    public bool IsCurrentlyLive(DateTime utcNow)
    {
        if (!IsPublished) return false;
        if (StartsAtUtc.HasValue && StartsAtUtc.Value > utcNow) return false;
        if (EndsAtUtc.HasValue && EndsAtUtc.Value <= utcNow) return false;
        return true;
    }

    public PromptStatus GetStatus(DateTime utcNow)
    {
        if (!IsPublished)
            return PromptStatus.Draft;

        if (StartsAtUtc.HasValue && StartsAtUtc.Value > utcNow)
            return PromptStatus.Scheduled;

        if (EndsAtUtc.HasValue && EndsAtUtc.Value <= utcNow)
            return PromptStatus.Expired;

        return PromptStatus.Live;
    }
}
