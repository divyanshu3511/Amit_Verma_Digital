using AmitVermaDigital.Models.ViewModels;
using AmitVermaDigital.Services;
using Microsoft.AspNetCore.Mvc;

namespace AmitVermaDigital.Controllers;

[Route("[controller]")]
public class PromptsController : Controller
{
    private readonly IPromptService _promptService;
    private readonly ISiteSettingService _settingService;

    public PromptsController(IPromptService promptService, ISiteSettingService settingService)
    {
        _promptService = promptService;
        _settingService = settingService;
    }

    [HttpGet("")]
    [HttpGet("Index")]
    public async Task<IActionResult> Index(string? search, string? category, string? sort = "newest", string? lang = null)
    {
        // Language handling: query param > cookie > default "en"
        var currentLang = lang;
        if (string.IsNullOrWhiteSpace(currentLang))
        {
            Request.Cookies.TryGetValue("Preferred_Lang", out currentLang);
        }
        if (string.IsNullOrWhiteSpace(currentLang) || (currentLang != "hi" && currentLang != "en"))
        {
            currentLang = "en";
        }

        Response.Cookies.Append("Preferred_Lang", currentLang, new CookieOptions
        {
            Expires = DateTimeOffset.UtcNow.AddYears(1),
            SameSite = SameSiteMode.Lax,
            HttpOnly = false
        });

        var settings = await _settingService.GetSettingsAsync();
        var prompts = await _promptService.GetLivePromptsAsync(search, category, sort);
        var categories = await _promptService.GetCategoriesAsync();

        var vm = new PromptLibraryViewModel
        {
            Prompts = prompts,
            Categories = categories,
            SelectedCategory = category,
            SearchTerm = search,
            SortBy = sort ?? "newest",
            Settings = settings,
            CurrentLang = currentLang
        };

        return View(vm);
    }

    [HttpGet("Details/{idOrSlug}")]
    public async Task<IActionResult> Details(string idOrSlug, string? lang = null)
    {
        if (string.IsNullOrWhiteSpace(idOrSlug))
        {
            return NotFound();
        }

        var prompt = await _promptService.GetLivePromptByIdOrSlugAsync(idOrSlug);
        if (prompt == null)
        {
            return NotFound();
        }

        var currentLang = lang;
        if (string.IsNullOrWhiteSpace(currentLang))
        {
            Request.Cookies.TryGetValue("Preferred_Lang", out currentLang);
        }
        if (string.IsNullOrWhiteSpace(currentLang) || (currentLang != "hi" && currentLang != "en"))
        {
            currentLang = "en";
        }

        var settings = await _settingService.GetSettingsAsync();
        var related = await _promptService.GetLivePromptsAsync(null, prompt.Category, "featured");
        related = related.Where(p => p.Id != prompt.Id).Take(3).ToList();

        var vm = new PromptDetailViewModel
        {
            Prompt = prompt,
            RelatedPrompts = related,
            Settings = settings,
            CurrentLang = currentLang
        };

        return View(vm);
    }
}
