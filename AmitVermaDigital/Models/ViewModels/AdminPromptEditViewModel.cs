using System.ComponentModel.DataAnnotations;

namespace AmitVermaDigital.Models.ViewModels;

public class AdminPromptEditViewModel : IValidatableObject
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Title is required (minimum 3 characters).")]
    [StringLength(150, MinimumLength = 3, ErrorMessage = "Title must be between 3 and 150 characters.")]
    public string Title { get; set; } = string.Empty;

    [StringLength(160, ErrorMessage = "Slug cannot exceed 160 characters.")]
    public string? Slug { get; set; }

    [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters.")]
    public string Description { get; set; } = string.Empty;

    [Required(ErrorMessage = "Category is required.")]
    [StringLength(60, ErrorMessage = "Category cannot exceed 60 characters.")]
    public string Category { get; set; } = "Facebook Reels";

    [StringLength(300, ErrorMessage = "Keywords cannot exceed 300 characters.")]
    public string? Keywords { get; set; }

    [Required(ErrorMessage = "Prompt text is required.")]
    public string PromptText { get; set; } = string.Empty;

    public bool IsPublished { get; set; } = true;
    public bool IsFeatured { get; set; } = false;

    // Dates in Indian Standard Time (IST) for easy Admin entry
    [Display(Name = "Start Time (IST)")]
    public DateTime? StartsAtIst { get; set; }

    [Display(Name = "End Time (IST)")]
    public DateTime? EndsAtIst { get; set; }

    // Dynamic ordered instruction steps
    public List<string> Instructions { get; set; } = new();

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (StartsAtIst.HasValue && EndsAtIst.HasValue)
        {
            if (EndsAtIst.Value <= StartsAtIst.Value)
            {
                yield return new ValidationResult("End time (IST) must be later than the Start time (IST).", new[] { nameof(EndsAtIst) });
            }
        }
    }
}
