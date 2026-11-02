using AmitVermaDigital.Models.Entities;
using AmitVermaDigital.Models.ViewModels;
using AmitVermaDigital.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AmitVermaDigital.Areas.Admin.Controllers;

[Area("Admin")]
[Authorize(Roles = "Admin")]
public class PromptsController : Controller
{
    private readonly IPromptService _promptService;
    private readonly ITimezoneService _timezoneService;

    public PromptsController(IPromptService promptService, ITimezoneService timezoneService)
    {
        _promptService = promptService;
        _timezoneService = timezoneService;
    }

    public async Task<IActionResult> Index(string? search, string? category, string? status)
    {
        var prompts = await _promptService.GetAllPromptsForAdminAsync(search, category, status);
        var categories = await _promptService.GetCategoriesAsync();
        var counts = await _promptService.GetPromptCountsAsync();

        ViewBag.Search = search;
        ViewBag.Category = category;
        ViewBag.Status = status ?? "All";
        ViewBag.Categories = categories;
        ViewBag.Counts = counts;
        ViewBag.TimezoneService = _timezoneService;

        return View(prompts);
    }

    [HttpGet]
    public IActionResult Create()
    {
        var vm = new AdminPromptEditViewModel
        {
            IsPublished = true,
            Category = "Facebook Reels",
            Instructions = new List<string> { string.Empty }
        };
        return View(vm);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(AdminPromptEditViewModel model)
    {
        if (!ModelState.IsValid)
        {
            return View(model);
        }

        // Convert IST to UTC for database storage
        DateTime? startsAtUtc = model.StartsAtIst.HasValue
            ? _timezoneService.ConvertIstToUtc(model.StartsAtIst.Value)
            : null;

        DateTime? endsAtUtc = model.EndsAtIst.HasValue
            ? _timezoneService.ConvertIstToUtc(model.EndsAtIst.Value)
            : null;

        var prompt = new Prompt
        {
            Title = model.Title.Trim(),
            Slug = string.IsNullOrWhiteSpace(model.Slug) ? _promptService.GenerateSlug(model.Title) : model.Slug.Trim(),
            Description = model.Description?.Trim() ?? string.Empty,
            Category = model.Category.Trim(),
            Keywords = model.Keywords?.Trim(),
            PromptText = model.PromptText.Trim(),
            IsPublished = model.IsPublished,
            IsFeatured = model.IsFeatured,
            StartsAtUtc = startsAtUtc,
            EndsAtUtc = endsAtUtc
        };

        var filteredInstructions = model.Instructions?
            .Where(s => !string.IsNullOrWhiteSpace(s))
            .ToList() ?? new List<string>();

        await _promptService.CreatePromptAsync(prompt, filteredInstructions);

        TempData["SuccessMessage"] = $"Prompt '{prompt.Title}' created successfully.";
        return RedirectToAction(nameof(Index));
    }

    [HttpGet]
    public async Task<IActionResult> Edit(int id)
    {
        var prompt = await _promptService.GetPromptWithInstructionsByIdAsync(id);
        if (prompt == null)
        {
            TempData["ErrorMessage"] = "Prompt not found.";
            return RedirectToAction(nameof(Index));
        }

        var vm = new AdminPromptEditViewModel
        {
            Id = prompt.Id,
            Title = prompt.Title,
            Slug = prompt.Slug,
            Description = prompt.Description,
            Category = prompt.Category,
            Keywords = prompt.Keywords,
            PromptText = prompt.PromptText,
            IsPublished = prompt.IsPublished,
            IsFeatured = prompt.IsFeatured,
            StartsAtIst = prompt.StartsAtUtc.HasValue ? _timezoneService.ConvertUtcToIst(prompt.StartsAtUtc.Value) : null,
            EndsAtIst = prompt.EndsAtUtc.HasValue ? _timezoneService.ConvertUtcToIst(prompt.EndsAtUtc.Value) : null,
            Instructions = prompt.Instructions.OrderBy(i => i.SortOrder).Select(i => i.InstructionText).ToList()
        };

        if (!vm.Instructions.Any())
        {
            vm.Instructions.Add(string.Empty);
        }

        return View(vm);
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(AdminPromptEditViewModel model)
    {
        if (!ModelState.IsValid)
        {
            return View(model);
        }

        var prompt = await _promptService.GetPromptWithInstructionsByIdAsync(model.Id);
        if (prompt == null)
        {
            TempData["ErrorMessage"] = "Prompt not found.";
            return RedirectToAction(nameof(Index));
        }

        prompt.Title = model.Title.Trim();
        prompt.Slug = string.IsNullOrWhiteSpace(model.Slug) ? _promptService.GenerateSlug(model.Title) : model.Slug.Trim();
        prompt.Description = model.Description?.Trim() ?? string.Empty;
        prompt.Category = model.Category.Trim();
        prompt.Keywords = model.Keywords?.Trim();
        prompt.PromptText = model.PromptText.Trim();
        prompt.IsPublished = model.IsPublished;
        prompt.IsFeatured = model.IsFeatured;
        prompt.StartsAtUtc = model.StartsAtIst.HasValue ? _timezoneService.ConvertIstToUtc(model.StartsAtIst.Value) : null;
        prompt.EndsAtUtc = model.EndsAtIst.HasValue ? _timezoneService.ConvertIstToUtc(model.EndsAtIst.Value) : null;

        var filteredInstructions = model.Instructions?
            .Where(s => !string.IsNullOrWhiteSpace(s))
            .ToList() ?? new List<string>();

        await _promptService.UpdatePromptAsync(prompt, filteredInstructions);

        TempData["SuccessMessage"] = $"Prompt '{prompt.Title}' updated successfully.";
        return RedirectToAction(nameof(Index));
    }

    [HttpGet]
    public async Task<IActionResult> Delete(int id)
    {
        var prompt = await _promptService.GetPromptWithInstructionsByIdAsync(id);
        if (prompt == null)
        {
            TempData["ErrorMessage"] = "Prompt not found.";
            return RedirectToAction(nameof(Index));
        }

        ViewBag.TimezoneService = _timezoneService;
        return View(prompt);
    }

    [HttpPost]
    [ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(int id)
    {
        var deleted = await _promptService.DeletePromptAsync(id);
        if (deleted)
        {
            TempData["SuccessMessage"] = "Prompt deleted successfully.";
        }
        else
        {
            TempData["ErrorMessage"] = "Prompt could not be deleted.";
        }

        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> TogglePublish(int id)
    {
        var newState = await _promptService.TogglePublishAsync(id);
        return Json(new { success = true, isPublished = newState });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ToggleFeature(int id)
    {
        var newState = await _promptService.ToggleFeatureAsync(id);
        return Json(new { success = true, isFeatured = newState });
    }
}
