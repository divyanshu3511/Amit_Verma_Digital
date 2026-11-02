using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AmitVermaDigital.Models.Entities;

public class PromptInstruction
{
    public int Id { get; set; }

    [Required]
    public int PromptId { get; set; }

    [ForeignKey(nameof(PromptId))]
    public Prompt? Prompt { get; set; }

    [Required]
    [StringLength(1000, MinimumLength = 1)]
    public string InstructionText { get; set; } = string.Empty;

    public int SortOrder { get; set; }

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
}
