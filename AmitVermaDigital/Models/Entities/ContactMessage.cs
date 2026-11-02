using System.ComponentModel.DataAnnotations;

namespace AmitVermaDigital.Models.Entities;

public class ContactMessage
{
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(150)]
    public string Email { get; set; } = string.Empty;

    [StringLength(200)]
    public string? Subject { get; set; }

    [Required]
    [StringLength(4000, MinimumLength = 5)]
    public string Message { get; set; } = string.Empty;

    [StringLength(50)]
    public string? IpAddress { get; set; }

    public bool IsRead { get; set; } = false;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
}
