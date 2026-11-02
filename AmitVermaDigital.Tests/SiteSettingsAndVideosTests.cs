using AmitVermaDigital.Data;
using AmitVermaDigital.Models.Entities;
using AmitVermaDigital.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace AmitVermaDigital.Tests;

public class SiteSettingsAndVideosTests
{
    private ApplicationDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task SiteSettingService_ReturnsDefaultAndSavesUpdates()
    {
        // Arrange
        using var db = CreateInMemoryDbContext();
        var cache = new MemoryCache(new MemoryCacheOptions());
        var service = new SiteSettingService(db, cache);

        // Act
        var settings = await service.GetSettingsAsync();

        // Assert
        Assert.NotNull(settings);
        Assert.Equal("Amit Verma Digital 2.0", settings.BrandName);
        Assert.Equal("39K", settings.FollowerCountDisplay);

        // Update follower count
        settings.FollowerCountDisplay = "45K";
        await service.UpdateSettingsAsync(settings);

        var updated = await service.GetSettingsAsync();
        Assert.Equal("45K", updated.FollowerCountDisplay);
    }

    [Theory]
    [InlineData("dQw4w9WgXcQ", "dQw4w9WgXcQ")]
    [InlineData("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "dQw4w9WgXcQ")]
    [InlineData("https://youtu.be/dQw4w9WgXcQ", "dQw4w9WgXcQ")]
    [InlineData("https://www.youtube.com/embed/dQw4w9WgXcQ", "dQw4w9WgXcQ")]
    [InlineData("https://www.youtube.com/shorts/dQw4w9WgXcQ", "dQw4w9WgXcQ")]
    [InlineData("invalid-url-with-no-id", null)]
    public void FeaturedVideo_ExtractsYouTubeIdCorrectly(string input, string? expectedId)
    {
        var video = new FeaturedVideo
        {
            Title = "Test Video",
            VideoUrlOrId = input
        };

        var extracted = video.GetYouTubeVideoId();
        Assert.Equal(expectedId, extracted);
    }
}
