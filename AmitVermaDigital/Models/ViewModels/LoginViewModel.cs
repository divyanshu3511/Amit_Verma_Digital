using System.ComponentModel.DataAnnotations;

namespace AmitVermaDigital.Models.ViewModels;

public class LoginViewModel
{
    [Required(ErrorMessage = "Username or Email is required.")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required.")]
    [DataType(DataType.Password)]
    public string Password { get; set; } = string.Empty;

    public bool RememberMe { get; set; }

    public string? ReturnUrl { get; set; }
}
