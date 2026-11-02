using AmitVermaDigital.Models.ViewModels;
using AmitVermaDigital.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AmitVermaDigital.Areas.Admin.Controllers;

[Area("Admin")]
[Authorize(Roles = "Admin")]
public class DashboardController : Controller
{
    private readonly IPromptService _promptService;
    private readonly IContactService _contactService;
    private readonly ISiteSettingService _settingService;

    public DashboardController(
        IPromptService promptService,
        IContactService contactService,
        ISiteSettingService settingService)
    {
        _promptService = promptService;
        _contactService = contactService;
        _settingService = settingService;
    }

    public async Task<IActionResult> Index()
    {
        var counts = await _promptService.GetPromptCountsAsync();
        var unreadCount = await _contactService.GetUnreadCountAsync();
        var recentPrompts = (await _promptService.GetAllPromptsForAdminAsync()).Take(5).ToList();
        var recentMessages = (await _contactService.GetMessagesAsync()).Take(5).ToList();
        var settings = await _settingService.GetSettingsAsync();

        var vm = new AdminDashboardViewModel
        {
            TotalPrompts = counts.Total,
            LivePrompts = counts.Live,
            ScheduledPrompts = counts.Scheduled,
            DraftPrompts = counts.Draft,
            ExpiredPrompts = counts.Expired,
            UnreadMessages = unreadCount,
            RecentPrompts = recentPrompts,
            RecentMessages = recentMessages,
            Settings = settings
        };

        return View(vm);
    }
}
