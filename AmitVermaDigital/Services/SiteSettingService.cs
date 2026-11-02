using AmitVermaDigital.Data;
using AmitVermaDigital.Models.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace AmitVermaDigital.Services;

public interface ISiteSettingService
{
    Task<SiteSetting> GetSettingsAsync();
    Task UpdateSettingsAsync(SiteSetting settings);
    Task<List<FeaturedVideo>> GetActiveVideosAsync();
    Task<List<FeaturedVideo>> GetAllVideosAsync();
    Task<FeaturedVideo?> GetVideoByIdAsync(int id);
    Task SaveVideoAsync(FeaturedVideo video);
    Task DeleteVideoAsync(int id);
}

public class SiteSettingService : ISiteSettingService
{
    private readonly ApplicationDbContext _db;
    private readonly IMemoryCache _cache;
    private const string CacheKey = "SiteSettings_Active";

    public SiteSettingService(ApplicationDbContext db, IMemoryCache cache)
    {
        _db = db;
        _cache = cache;
    }

    public async Task<SiteSetting> GetSettingsAsync()
    {
        if (_cache.TryGetValue(CacheKey, out SiteSetting? cached) && cached != null)
        {
            return cached;
        }

        try
        {
            var settings = await _db.SiteSettings.FirstOrDefaultAsync(s => s.Id == 1);
            if (settings == null)
            {
                settings = new SiteSetting { Id = 1 };
                _db.SiteSettings.Add(settings);
                await _db.SaveChangesAsync();
            }

            _cache.Set(CacheKey, settings, TimeSpan.FromMinutes(5));
            return settings;
        }
        catch
        {
            var fallback = new SiteSetting { Id = 1 };
            _cache.Set(CacheKey, fallback, TimeSpan.FromSeconds(30));
            return fallback;
        }
    }

    public async Task UpdateSettingsAsync(SiteSetting settings)
    {
        settings.UpdatedAtUtc = DateTime.UtcNow;
        _db.SiteSettings.Update(settings);
        await _db.SaveChangesAsync();
        _cache.Remove(CacheKey);
    }

    public async Task<List<FeaturedVideo>> GetActiveVideosAsync()
    {
        try
        {
            return await _db.FeaturedVideos
                .AsNoTracking()
                .Where(v => v.IsActive)
                .OrderBy(v => v.SortOrder)
                .ThenByDescending(v => v.CreatedAtUtc)
                .ToListAsync();
        }
        catch
        {
            return new List<FeaturedVideo>();
        }
    }

    public async Task<List<FeaturedVideo>> GetAllVideosAsync()
    {
        try
        {
            return await _db.FeaturedVideos
                .AsNoTracking()
                .OrderBy(v => v.SortOrder)
                .ThenByDescending(v => v.CreatedAtUtc)
                .ToListAsync();
        }
        catch
        {
            return new List<FeaturedVideo>();
        }
    }

    public async Task<FeaturedVideo?> GetVideoByIdAsync(int id)
    {
        return await _db.FeaturedVideos.FindAsync(id);
    }

    public async Task SaveVideoAsync(FeaturedVideo video)
    {
        if (video.Id == 0)
        {
            video.CreatedAtUtc = DateTime.UtcNow;
            _db.FeaturedVideos.Add(video);
        }
        else
        {
            _db.FeaturedVideos.Update(video);
        }
        await _db.SaveChangesAsync();
    }

    public async Task DeleteVideoAsync(int id)
    {
        var item = await _db.FeaturedVideos.FindAsync(id);
        if (item != null)
        {
            _db.FeaturedVideos.Remove(item);
            await _db.SaveChangesAsync();
        }
    }
}
