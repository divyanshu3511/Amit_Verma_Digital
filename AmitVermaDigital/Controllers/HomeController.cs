using AmitVermaDigital.Models;
using AmitVermaDigital.Models.ViewModels;
using AmitVermaDigital.Services;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace AmitVermaDigital.Controllers;

public class HomeController : Controller
{
    private readonly ISiteSettingService _settingService;
    private readonly IPromptService _promptService;

    public HomeController(ISiteSettingService settingService, IPromptService promptService)
    {
        _settingService = settingService;
        _promptService = promptService;
    }

    public async Task<IActionResult> Index()
    {
        var settings = await _settingService.GetSettingsAsync();
        var featuredPrompts = await _promptService.GetFeaturedLivePromptsAsync(3);
        var featuredVideos = await _settingService.GetActiveVideosAsync();

        var vm = new HomeViewModel
        {
            Settings = settings,
            FeaturedPrompts = featuredPrompts,
            FeaturedVideos = featuredVideos,
            ContactForm = new ContactFormViewModel()
        };

        return View(vm);
    }

    [Route("privacy")]
    public async Task<IActionResult> Privacy()
    {
        var settings = await _settingService.GetSettingsAsync();
        ViewBag.Settings = settings;
        return View();
    }

    [Route("terms")]
    public async Task<IActionResult> Terms()
    {
        var settings = await _settingService.GetSettingsAsync();
        ViewBag.Settings = settings;
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
