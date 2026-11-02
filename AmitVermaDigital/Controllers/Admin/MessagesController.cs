using AmitVermaDigital.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AmitVermaDigital.Areas.Admin.Controllers;

[Area("Admin")]
[Authorize(Roles = "Admin")]
public class MessagesController : Controller
{
    private readonly IContactService _contactService;
    private readonly ITimezoneService _timezoneService;

    public MessagesController(IContactService contactService, ITimezoneService timezoneService)
    {
        _contactService = contactService;
        _timezoneService = timezoneService;
    }

    [HttpGet]
    public async Task<IActionResult> Index()
    {
        var messages = await _contactService.GetMessagesAsync();
        ViewBag.TimezoneService = _timezoneService;
        return View(messages);
    }

    [HttpGet]
    public async Task<IActionResult> Details(int id)
    {
        var message = await _contactService.GetMessageByIdAsync(id);
        if (message == null)
        {
            TempData["ErrorMessage"] = "Message not found.";
            return RedirectToAction(nameof(Index));
        }

        // Mark as read
        await _contactService.MarkAsReadAsync(id);

        ViewBag.TimezoneService = _timezoneService;
        return View(message);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(int id)
    {
        await _contactService.DeleteMessageAsync(id);
        TempData["SuccessMessage"] = "Message deleted successfully.";
        return RedirectToAction(nameof(Index));
    }
}
