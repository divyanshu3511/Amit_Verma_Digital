using AmitVermaDigital.Models.Entities;
using AmitVermaDigital.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AmitVermaDigital.Areas.Admin.Controllers;

[Area("Admin")]
[Authorize(Roles = "Admin")]
public class VideosController : Controller
{
    private readonly ISiteSettingService _settingService;

    public VideosController(ISiteSettingService settingService)
    {
        _settingService = settingService;
    }

    [HttpGet]
    public async Task<IActionResult> Index()
    {
        var videos = await _settingService.GetAllVideosAsync();
        return View(videos);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Save(FeaturedVideo video)
    {
        if (string.IsNullOrWhiteSpace(video.Title) || string.IsNullOrWhiteSpace(video.VideoUrlOrId))
        {
            TempData["ErrorMessage"] = "Video title and YouTube URL or ID are required.";
            return RedirectToAction(nameof(Index));
        }

        await _settingService.SaveVideoAsync(video);
        TempData["SuccessMessage"] = "Featured video saved successfully.";
        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(int id)
    {
        await _settingService.DeleteVideoAsync(id);
        TempData["SuccessMessage"] = "Featured video removed.";
        return RedirectToAction(nameof(Index));
    }
}
