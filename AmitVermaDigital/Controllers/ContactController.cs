using AmitVermaDigital.Models.Entities;
using AmitVermaDigital.Models.ViewModels;
using AmitVermaDigital.Services;
using Microsoft.AspNetCore.Mvc;

namespace AmitVermaDigital.Controllers;

public class ContactController : Controller
{
    private readonly IContactService _contactService;

    public ContactController(IContactService contactService)
    {
        _contactService = contactService;
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Submit(ContactFormViewModel model)
    {
        // 1. Honeypot check (Bot detection)
        if (!string.IsNullOrWhiteSpace(model.Website))
        {
            // Silently pretend success to deceive spam bots without saving to DB
            if (Request.Headers["X-Requested-With"] == "XMLHttpRequest")
            {
                return Json(new { success = true, message = "Thank you! Your message has been received." });
            }
            TempData["SuccessMessage"] = "Thank you! Your message has been received.";
            return Redirect("/#contact");
        }

        // 2. Server-side validation
        if (!ModelState.IsValid)
        {
            if (Request.Headers["X-Requested-With"] == "XMLHttpRequest")
            {
                var errors = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList();
                return Json(new { success = false, message = "Please fix the form errors.", errors });
            }

            TempData["ErrorMessage"] = "Please fill in all required fields properly.";
            return Redirect("/#contact");
        }

        // 3. Save to database
        var message = new ContactMessage
        {
            Name = model.Name.Trim(),
            Email = model.Email.Trim().ToLowerInvariant(),
            Subject = model.Subject?.Trim(),
            Message = model.Message.Trim(),
            IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString(),
            CreatedAtUtc = DateTime.UtcNow,
            IsRead = false
        };

        await _contactService.SaveMessageAsync(message);

        if (Request.Headers["X-Requested-With"] == "XMLHttpRequest")
        {
            return Json(new { success = true, message = "Thank you! Your message has been sent to Amit Verma." });
        }

        TempData["SuccessMessage"] = "Thank you! Your message has been sent successfully. We will get back to you soon.";
        return Redirect("/#contact");
    }
}
