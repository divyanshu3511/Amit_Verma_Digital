using System.ComponentModel.DataAnnotations;

namespace AmitVermaDigital.Models.ViewModels;

public class ContactFormViewModel
{
    [Required(ErrorMessage = "Please provide your name.")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Name must be between 2 and 100 characters.")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Please provide your email address.")]
    [EmailAddress(ErrorMessage = "Please enter a valid email address.")]
    [StringLength(150)]
    public string Email { get; set; } = string.Empty;

    [StringLength(200)]
    public string? Subject { get; set; }

    [Required(ErrorMessage = "Please write your message.")]
    [StringLength(4000, MinimumLength = 10, ErrorMessage = "Message must be at least 10 characters.")]
    public string Message { get; set; } = string.Empty;

    // Honeypot field: Must remain empty. If filled, bots detected.
    public string? Website { get; set; }
}
