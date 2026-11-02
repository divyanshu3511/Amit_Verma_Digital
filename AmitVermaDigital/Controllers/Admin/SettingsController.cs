using AmitVermaDigital.Models.ViewModels;
using AmitVermaDigital.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AmitVermaDigital.Areas.Admin.Controllers;

[Area("Admin")]
[Authorize(Roles = "Admin")]
public class SettingsController : Controller
{
    private readonly ISiteSettingService _settingService;
    private readonly IWebHostEnvironment _env;

    public SettingsController(ISiteSettingService settingService, IWebHostEnvironment env)
    {
        _settingService = settingService;
        _env = env;
    }

    [HttpGet]
    public async Task<IActionResult> Index()
    {
        var settings = await _settingService.GetSettingsAsync();

        var vm = new SiteSettingViewModel
        {
            Id = settings.Id,
            BrandName = settings.BrandName,
            Tagline = settings.Tagline,
            Positioning = settings.Positioning,
            HeroHeadline = settings.HeroHeadline,
            HeroHeadlineHi = settings.HeroHeadlineHi,
            HeroDescription = settings.HeroDescription,
            HeroDescriptionHi = settings.HeroDescriptionHi,
            Category = settings.Category,
            Location = settings.Location,
            FollowerCountDisplay = settings.FollowerCountDisplay,
            LogoPath = settings.LogoPath,
            AvatarPath = settings.AvatarPath,
            CoverImagePath = settings.CoverImagePath,
            PortraitImagePath = settings.PortraitImagePath,
            FacebookPageUrl = settings.FacebookPageUrl,
            InstagramUrl = settings.InstagramUrl,
            YouTubeChannelUrl = settings.YouTubeChannelUrl,
            LinkedInUrl = settings.LinkedInUrl,
            ContactEmail = settings.ContactEmail,
            WhatsAppNumber = settings.WhatsAppNumber,
            BusinessNote = settings.BusinessNote,
            AboutTitle = settings.AboutTitle,
            AboutExperience = settings.AboutExperience,
            AboutMission = settings.AboutMission,
            AdSlot1Enabled = settings.AdSlot1Enabled,
            AdSlot1ImageUrl = settings.AdSlot1ImageUrl,
            AdSlot1TargetUrl = settings.AdSlot1TargetUrl,
            AdSlot1AltText = settings.AdSlot1AltText,
            AdSlot2Enabled = settings.AdSlot2Enabled,
            AdSlot2ImageUrl = settings.AdSlot2ImageUrl,
            AdSlot2TargetUrl = settings.AdSlot2TargetUrl,
            AdSlot2AltText = settings.AdSlot2AltText
        };

        return View(vm);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Index(SiteSettingViewModel model)
    {
        if (!ModelState.IsValid)
        {
            return View(model);
        }

        var settings = await _settingService.GetSettingsAsync();

        // Handle uploaded image files
        var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
        var uploadDir = Path.Combine(webRoot, "images", "uploads");
        if (!Directory.Exists(uploadDir))
        {
            Directory.CreateDirectory(uploadDir);
        }

        if (model.NewAvatarFile != null && model.NewAvatarFile.Length > 0)
        {
            var ext = Path.GetExtension(model.NewAvatarFile.FileName).ToLowerInvariant();
            if (new[] { ".png", ".jpg", ".jpeg", ".webp" }.Contains(ext))
            {
                var fileName = $"avatar_{Guid.NewGuid():N}{ext}";
                var filePath = Path.Combine(uploadDir, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await model.NewAvatarFile.CopyToAsync(stream);
                }
                settings.AvatarPath = $"/images/uploads/{fileName}";
                settings.LogoPath = settings.AvatarPath;
            }
        }
        else if (!string.IsNullOrWhiteSpace(model.AvatarPath))
        {
            settings.AvatarPath = model.AvatarPath.Trim();
            settings.LogoPath = model.LogoPath.Trim();
        }

        if (model.NewCoverFile != null && model.NewCoverFile.Length > 0)
        {
            var ext = Path.GetExtension(model.NewCoverFile.FileName).ToLowerInvariant();
            if (new[] { ".png", ".jpg", ".jpeg", ".webp" }.Contains(ext))
            {
                var fileName = $"cover_{Guid.NewGuid():N}{ext}";
                var filePath = Path.Combine(uploadDir, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await model.NewCoverFile.CopyToAsync(stream);
                }
                settings.CoverImagePath = $"/images/uploads/{fileName}";
            }
        }
        else if (!string.IsNullOrWhiteSpace(model.CoverImagePath))
        {
            settings.CoverImagePath = model.CoverImagePath.Trim();
        }

        if (model.NewPortraitFile != null && model.NewPortraitFile.Length > 0)
        {
            var ext = Path.GetExtension(model.NewPortraitFile.FileName).ToLowerInvariant();
            if (new[] { ".png", ".jpg", ".jpeg", ".webp" }.Contains(ext))
            {
                var fileName = $"portrait_{Guid.NewGuid():N}{ext}";
                var filePath = Path.Combine(uploadDir, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await model.NewPortraitFile.CopyToAsync(stream);
                }
                settings.PortraitImagePath = $"/images/uploads/{fileName}";
            }
        }
        else if (!string.IsNullOrWhiteSpace(model.PortraitImagePath))
        {
            settings.PortraitImagePath = model.PortraitImagePath.Trim();
        }

        settings.BrandName = model.BrandName.Trim();
        settings.Tagline = model.Tagline.Trim();
        settings.Positioning = model.Positioning?.Trim() ?? string.Empty;
        settings.HeroHeadline = model.HeroHeadline.Trim();
        settings.HeroHeadlineHi = model.HeroHeadlineHi?.Trim() ?? string.Empty;
        settings.HeroDescription = model.HeroDescription.Trim();
        settings.HeroDescriptionHi = model.HeroDescriptionHi?.Trim() ?? string.Empty;
        settings.Category = model.Category?.Trim() ?? "Digital Creator";
        settings.Location = model.Location?.Trim() ?? "Lucknow, Uttar Pradesh, India";
        settings.FollowerCountDisplay = model.FollowerCountDisplay?.Trim() ?? "39K";

        settings.FacebookPageUrl = model.FacebookPageUrl?.Trim();
        settings.InstagramUrl = model.InstagramUrl?.Trim();
        settings.YouTubeChannelUrl = model.YouTubeChannelUrl?.Trim();
        settings.LinkedInUrl = model.LinkedInUrl?.Trim();

        settings.ContactEmail = model.ContactEmail?.Trim();
        settings.WhatsAppNumber = model.WhatsAppNumber?.Trim();
        settings.BusinessNote = model.BusinessNote?.Trim();

        settings.AboutTitle = model.AboutTitle?.Trim() ?? string.Empty;
        settings.AboutExperience = model.AboutExperience?.Trim() ?? string.Empty;
        settings.AboutMission = model.AboutMission?.Trim() ?? string.Empty;

        // Ad Slots
        settings.AdSlot1Enabled = model.AdSlot1Enabled;
        settings.AdSlot1ImageUrl = model.AdSlot1ImageUrl?.Trim();
        settings.AdSlot1TargetUrl = model.AdSlot1TargetUrl?.Trim();
        settings.AdSlot1AltText = model.AdSlot1AltText?.Trim();

        settings.AdSlot2Enabled = model.AdSlot2Enabled;
        settings.AdSlot2ImageUrl = model.AdSlot2ImageUrl?.Trim();
        settings.AdSlot2TargetUrl = model.AdSlot2TargetUrl?.Trim();
        settings.AdSlot2AltText = model.AdSlot2AltText?.Trim();

        await _settingService.UpdateSettingsAsync(settings);

        TempData["SuccessMessage"] = "Site settings have been saved successfully.";
        return RedirectToAction(nameof(Index));
    }
}
