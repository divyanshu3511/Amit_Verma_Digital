using AmitVermaDigital.Data;
using AmitVermaDigital.Models.Entities;
using AmitVermaDigital.Services;
using Microsoft.EntityFrameworkCore;

namespace AmitVermaDigital.Tests;

public class PromptSchedulingTests
{
    private ApplicationDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task GetLivePromptsAsync_ExcludesDraftFutureAndExpiredPrompts()
    {
        // Arrange
        using var db = CreateInMemoryDbContext();
        var promptService = new PromptService(db);
        var now = DateTime.UtcNow;

        var livePrompt = new Prompt
        {
            Title = "Live Prompt",
            Slug = "live-prompt",
            Category = "Facebook Reels",
            PromptText = "Live content",
            IsPublished = true,
            StartsAtUtc = now.AddDays(-1),
            EndsAtUtc = now.AddDays(1)
        };

        var draftPrompt = new Prompt
        {
            Title = "Draft Prompt",
            Slug = "draft-prompt",
            Category = "Facebook Reels",
            PromptText = "Draft content",
            IsPublished = false // Unpublished
        };

        var futureScheduledPrompt = new Prompt
        {
            Title = "Future Prompt",
            Slug = "future-prompt",
            Category = "Facebook Reels",
            PromptText = "Future content",
            IsPublished = true,
            StartsAtUtc = now.AddDays(2) // Future
        };

        var expiredPrompt = new Prompt
        {
            Title = "Expired Prompt",
            Slug = "expired-prompt",
            Category = "Facebook Reels",
            PromptText = "Expired content",
            IsPublished = true,
            StartsAtUtc = now.AddDays(-5),
            EndsAtUtc = now.AddHours(-1) // Expired
        };

        db.Prompts.AddRange(livePrompt, draftPrompt, futureScheduledPrompt, expiredPrompt);
        await db.SaveChangesAsync();

        // Act
        var livePrompts = await promptService.GetLivePromptsAsync();

        // Assert
        Assert.Single(livePrompts);
        Assert.Equal("Live Prompt", livePrompts[0].Title);

        // Verify Direct Access via Slug or ID is blocked for non-live
        var fetchFuture = await promptService.GetLivePromptByIdOrSlugAsync("future-prompt");
        var fetchExpired = await promptService.GetLivePromptByIdOrSlugAsync("expired-prompt");
        var fetchDraft = await promptService.GetLivePromptByIdOrSlugAsync("draft-prompt");

        Assert.Null(fetchFuture);
        Assert.Null(fetchExpired);
        Assert.Null(fetchDraft);
    }

    [Fact]
    public void PromptStatus_IsCalculatedCorrectlyBasedOnUtcTime()
    {
        var now = DateTime.UtcNow;

        var draft = new Prompt { IsPublished = false };
        Assert.Equal(PromptStatus.Draft, draft.GetStatus(now));

        var scheduled = new Prompt { IsPublished = true, StartsAtUtc = now.AddHours(2) };
        Assert.Equal(PromptStatus.Scheduled, scheduled.GetStatus(now));

        var expired = new Prompt { IsPublished = true, EndsAtUtc = now.AddHours(-1) };
        Assert.Equal(PromptStatus.Expired, expired.GetStatus(now));

        var live = new Prompt { IsPublished = true, StartsAtUtc = now.AddHours(-1), EndsAtUtc = now.AddHours(2) };
        Assert.Equal(PromptStatus.Live, live.GetStatus(now));
    }
}
