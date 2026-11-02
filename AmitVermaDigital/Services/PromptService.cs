using AmitVermaDigital.Data;
using AmitVermaDigital.Models.Entities;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace AmitVermaDigital.Services;

public interface IPromptService
{
    // Public Discovery
    Task<List<Prompt>> GetLivePromptsAsync(string? search = null, string? category = null, string? sort = null);
    Task<List<Prompt>> GetFeaturedLivePromptsAsync(int take = 3);
    Task<Prompt?> GetLivePromptByIdOrSlugAsync(string idOrSlug);
    Task<List<string>> GetCategoriesAsync();

    // Admin Operations
    Task<List<Prompt>> GetAllPromptsForAdminAsync(string? search = null, string? category = null, string? statusFilter = null);
    Task<Prompt?> GetPromptWithInstructionsByIdAsync(int id);
    Task<bool> SlugExistsAsync(string slug, int? excludeId = null);
    string GenerateSlug(string title);
    Task<Prompt> CreatePromptAsync(Prompt prompt, IList<string>? instructions);
    Task<Prompt> UpdatePromptAsync(Prompt prompt, IList<string>? instructions);
    Task<bool> DeletePromptAsync(int id);
    Task<bool> TogglePublishAsync(int id);
    Task<bool> ToggleFeatureAsync(int id);
    Task<(int Total, int Live, int Scheduled, int Draft, int Expired)> GetPromptCountsAsync();
}

public class PromptService : IPromptService
{
    private readonly ApplicationDbContext _db;

    public PromptService(ApplicationDbContext db)
    {
        _db = db;
    }

    public async Task<List<Prompt>> GetLivePromptsAsync(string? search = null, string? category = null, string? sort = null)
    {
        try
        {
            var nowUtc = DateTime.UtcNow;

            var query = _db.Prompts
                .AsNoTracking()
                .Include(p => p.Instructions.OrderBy(i => i.SortOrder))
                .Where(p => p.IsPublished
                            && (!p.StartsAtUtc.HasValue || p.StartsAtUtc.Value <= nowUtc)
                            && (!p.EndsAtUtc.HasValue || p.EndsAtUtc.Value > nowUtc));

            if (!string.IsNullOrWhiteSpace(search))
            {
                var term = search.Trim().ToLower();
                query = query.Where(p => p.Title.ToLower().Contains(term)
                                      || p.Description.ToLower().Contains(term)
                                      || p.Category.ToLower().Contains(term)
                                      || (p.Keywords != null && p.Keywords.ToLower().Contains(term)));
            }

            if (!string.IsNullOrWhiteSpace(category) && !category.Equals("All", StringComparison.OrdinalIgnoreCase))
            {
                query = query.Where(p => p.Category == category);
            }

            query = sort switch
            {
                "featured" => query.OrderByDescending(p => p.IsFeatured).ThenByDescending(p => p.UpdatedAtUtc),
                "oldest" => query.OrderBy(p => p.CreatedAtUtc),
                _ => query.OrderByDescending(p => p.IsFeatured).ThenByDescending(p => p.CreatedAtUtc)
            };

            return await query.ToListAsync();
        }
        catch
        {
            return new List<Prompt>();
        }
    }

    public async Task<List<Prompt>> GetFeaturedLivePromptsAsync(int take = 3)
    {
        try
        {
            var nowUtc = DateTime.UtcNow;

            return await _db.Prompts
                .AsNoTracking()
                .Include(p => p.Instructions.OrderBy(i => i.SortOrder))
                .Where(p => p.IsPublished
                            && (!p.StartsAtUtc.HasValue || p.StartsAtUtc.Value <= nowUtc)
                            && (!p.EndsAtUtc.HasValue || p.EndsAtUtc.Value > nowUtc))
                .OrderByDescending(p => p.IsFeatured)
                .ThenByDescending(p => p.UpdatedAtUtc)
                .Take(take)
                .ToListAsync();
        }
        catch
        {
            return new List<Prompt>();
        }
    }

    public async Task<Prompt?> GetLivePromptByIdOrSlugAsync(string idOrSlug)
    {
        try
        {
            var nowUtc = DateTime.UtcNow;
            bool isNumeric = int.TryParse(idOrSlug, out int id);

            var query = _db.Prompts
                .AsNoTracking()
                .Include(p => p.Instructions.OrderBy(i => i.SortOrder))
                .Where(p => p.IsPublished
                            && (!p.StartsAtUtc.HasValue || p.StartsAtUtc.Value <= nowUtc)
                            && (!p.EndsAtUtc.HasValue || p.EndsAtUtc.Value > nowUtc));

            if (isNumeric)
            {
                return await query.FirstOrDefaultAsync(p => p.Id == id || p.Slug == idOrSlug);
            }

            return await query.FirstOrDefaultAsync(p => p.Slug == idOrSlug);
        }
        catch
        {
            return null;
        }
    }

    public async Task<List<string>> GetCategoriesAsync()
    {
        try
        {
            var nowUtc = DateTime.UtcNow;
            return await _db.Prompts
                .AsNoTracking()
                .Where(p => p.IsPublished
                            && (!p.StartsAtUtc.HasValue || p.StartsAtUtc.Value <= nowUtc)
                            && (!p.EndsAtUtc.HasValue || p.EndsAtUtc.Value > nowUtc))
                .Select(p => p.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync();
        }
        catch
        {
            return new List<string>();
        }
    }

    // Admin Operations
    public async Task<List<Prompt>> GetAllPromptsForAdminAsync(string? search = null, string? category = null, string? statusFilter = null)
    {
        var query = _db.Prompts
            .AsNoTracking()
            .Include(p => p.Instructions.OrderBy(i => i.SortOrder))
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(p => p.Title.ToLower().Contains(term)
                                  || p.Description.ToLower().Contains(term)
                                  || p.Category.ToLower().Contains(term)
                                  || (p.Keywords != null && p.Keywords.ToLower().Contains(term)));
        }

        if (!string.IsNullOrWhiteSpace(category) && !category.Equals("All", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(p => p.Category == category);
        }

        var list = await query.OrderByDescending(p => p.UpdatedAtUtc).ToListAsync();
        var nowUtc = DateTime.UtcNow;

        if (!string.IsNullOrWhiteSpace(statusFilter) && !statusFilter.Equals("All", StringComparison.OrdinalIgnoreCase))
        {
            list = list.Where(p => p.GetStatus(nowUtc).ToString().Equals(statusFilter, StringComparison.OrdinalIgnoreCase)).ToList();
        }

        return list;
    }

    public async Task<Prompt?> GetPromptWithInstructionsByIdAsync(int id)
    {
        return await _db.Prompts
            .Include(p => p.Instructions.OrderBy(i => i.SortOrder))
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<bool> SlugExistsAsync(string slug, int? excludeId = null)
    {
        var normalized = slug.Trim().ToLower();
        return await _db.Prompts
            .AnyAsync(p => p.Slug.ToLower() == normalized && (!excludeId.HasValue || p.Id != excludeId.Value));
    }

    public string GenerateSlug(string title)
    {
        if (string.IsNullOrWhiteSpace(title)) return "prompt-" + Guid.NewGuid().ToString("N")[..8];
        var slug = title.Trim().ToLowerInvariant();
        // remove invalid characters
        slug = Regex.Replace(slug, @"[^a-z0-9\s-]", "");
        // convert multiple spaces into one space
        slug = Regex.Replace(slug, @"\s+", " ").Trim();
        // cut and trim
        slug = slug[..(Math.Min(slug.Length, 100))].Trim();
        // replace spaces with hyphens
        slug = Regex.Replace(slug, @"\s", "-");
        return string.IsNullOrWhiteSpace(slug) ? "prompt-" + Guid.NewGuid().ToString("N")[..8] : slug;
    }

    public async Task<Prompt> CreatePromptAsync(Prompt prompt, IList<string>? instructions)
    {
        prompt.CreatedAtUtc = DateTime.UtcNow;
        prompt.UpdatedAtUtc = DateTime.UtcNow;

        // Ensure unique slug
        if (string.IsNullOrWhiteSpace(prompt.Slug))
        {
            prompt.Slug = GenerateSlug(prompt.Title);
        }
        else
        {
            prompt.Slug = GenerateSlug(prompt.Slug);
        }

        int slugSuffix = 1;
        var baseSlug = prompt.Slug;
        while (await SlugExistsAsync(prompt.Slug))
        {
            prompt.Slug = $"{baseSlug}-{slugSuffix++}";
        }

        _db.Prompts.Add(prompt);
        await _db.SaveChangesAsync();

        if (instructions != null && instructions.Any())
        {
            int order = 1;
            foreach (var step in instructions.Where(s => !string.IsNullOrWhiteSpace(s)))
            {
                _db.PromptInstructions.Add(new PromptInstruction
                {
                    PromptId = prompt.Id,
                    InstructionText = step.Trim(),
                    SortOrder = order++,
                    CreatedAtUtc = DateTime.UtcNow,
                    UpdatedAtUtc = DateTime.UtcNow
                });
            }
            await _db.SaveChangesAsync();
        }

        return prompt;
    }

    public async Task<Prompt> UpdatePromptAsync(Prompt prompt, IList<string>? instructions)
    {
        prompt.UpdatedAtUtc = DateTime.UtcNow;

        // Verify slug uniqueness
        prompt.Slug = GenerateSlug(prompt.Slug);
        int slugSuffix = 1;
        var baseSlug = prompt.Slug;
        while (await SlugExistsAsync(prompt.Slug, prompt.Id))
        {
            prompt.Slug = $"{baseSlug}-{slugSuffix++}";
        }

        _db.Prompts.Update(prompt);

        // Update instructions
        var existingInstructions = await _db.PromptInstructions
            .Where(i => i.PromptId == prompt.Id)
            .ToListAsync();
        _db.PromptInstructions.RemoveRange(existingInstructions);

        if (instructions != null && instructions.Any())
        {
            int order = 1;
            foreach (var step in instructions.Where(s => !string.IsNullOrWhiteSpace(s)))
            {
                _db.PromptInstructions.Add(new PromptInstruction
                {
                    PromptId = prompt.Id,
                    InstructionText = step.Trim(),
                    SortOrder = order++,
                    CreatedAtUtc = DateTime.UtcNow,
                    UpdatedAtUtc = DateTime.UtcNow
                });
            }
        }

        await _db.SaveChangesAsync();
        return prompt;
    }

    public async Task<bool> DeletePromptAsync(int id)
    {
        var prompt = await _db.Prompts.FindAsync(id);
        if (prompt == null) return false;

        _db.Prompts.Remove(prompt);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> TogglePublishAsync(int id)
    {
        var prompt = await _db.Prompts.FindAsync(id);
        if (prompt == null) return false;

        prompt.IsPublished = !prompt.IsPublished;
        prompt.UpdatedAtUtc = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return prompt.IsPublished;
    }

    public async Task<bool> ToggleFeatureAsync(int id)
    {
        var prompt = await _db.Prompts.FindAsync(id);
        if (prompt == null) return false;

        prompt.IsFeatured = !prompt.IsFeatured;
        prompt.UpdatedAtUtc = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return prompt.IsFeatured;
    }

    public async Task<(int Total, int Live, int Scheduled, int Draft, int Expired)> GetPromptCountsAsync()
    {
        var nowUtc = DateTime.UtcNow;
        var prompts = await _db.Prompts.AsNoTracking().ToListAsync();

        int total = prompts.Count;
        int live = 0, scheduled = 0, draft = 0, expired = 0;

        foreach (var p in prompts)
        {
            var status = p.GetStatus(nowUtc);
            switch (status)
            {
                case PromptStatus.Live: live++; break;
                case PromptStatus.Scheduled: scheduled++; break;
                case PromptStatus.Draft: draft++; break;
                case PromptStatus.Expired: expired++; break;
            }
        }

        return (total, live, scheduled, draft, expired);
    }
}
