using AmitVermaDigital.Data;
using AmitVermaDigital.Models.Entities;
using AmitVermaDigital.Services;
using Microsoft.EntityFrameworkCore;

namespace AmitVermaDigital.Tests;

public class PromptManagementTests
{
    private ApplicationDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task CreatePromptAsync_SavesPromptAndOrderedInstructions()
    {
        // Arrange
        using var db = CreateInMemoryDbContext();
        var promptService = new PromptService(db);

        var prompt = new Prompt
        {
            Title = "Viral Hook Framework",
            Category = "Facebook Reels",
            PromptText = "Hook Prompt Text",
            IsPublished = true
        };

        var instructions = new List<string>
        {
            "Step 1: Open Meta Business Suite",
            "Step 2: Paste the hook prompt",
            "Step 3: Export 3 variations"
        };

        // Act
        var created = await promptService.CreatePromptAsync(prompt, instructions);

        // Assert
        Assert.True(created.Id > 0);
        Assert.Equal("viral-hook-framework", created.Slug);

        var saved = await promptService.GetPromptWithInstructionsByIdAsync(created.Id);
        Assert.NotNull(saved);
        Assert.Equal(3, saved.Instructions.Count);
        var ordered = saved.Instructions.OrderBy(i => i.SortOrder).ToList();
        Assert.Equal(1, ordered[0].SortOrder);
        Assert.Equal("Step 1: Open Meta Business Suite", ordered[0].InstructionText);
        Assert.Equal(2, ordered[1].SortOrder);
        Assert.Equal("Step 2: Paste the hook prompt", ordered[1].InstructionText);
        Assert.Equal(3, ordered[2].SortOrder);
        Assert.Equal("Step 3: Export 3 variations", ordered[2].InstructionText);
    }

    [Fact]
    public async Task UpdatePromptAsync_ReordersAndUpdatesInstructions()
    {
        // Arrange
        using var db = CreateInMemoryDbContext();
        var promptService = new PromptService(db);

        var prompt = new Prompt
        {
            Title = "Original Prompt",
            Category = "Content Creation",
            PromptText = "Original Text",
            IsPublished = true
        };

        await promptService.CreatePromptAsync(prompt, new[] { "Old Step 1", "Old Step 2" });

        // Act - Reorder/replace steps
        var newInstructions = new List<string> { "Reordered Step A", "Reordered Step B", "Newly Added Step C" };
        prompt.Title = "Updated Title";
        await promptService.UpdatePromptAsync(prompt, newInstructions);

        // Assert
        var reloaded = await promptService.GetPromptWithInstructionsByIdAsync(prompt.Id);
        Assert.NotNull(reloaded);
        Assert.Equal("Updated Title", reloaded.Title);
        Assert.Equal(3, reloaded.Instructions.Count);
        var list = reloaded.Instructions.OrderBy(i => i.SortOrder).ToList();
        Assert.Equal("Reordered Step A", list[0].InstructionText);
        Assert.Equal(1, list[0].SortOrder);
        Assert.Equal("Reordered Step B", list[1].InstructionText);
        Assert.Equal(2, list[1].SortOrder);
        Assert.Equal("Newly Added Step C", list[2].InstructionText);
        Assert.Equal(3, list[2].SortOrder);
    }

    [Fact]
    public async Task DeletePromptAsync_CascadesAndDeletesInstructions()
    {
        // Arrange
        using var db = CreateInMemoryDbContext();
        var promptService = new PromptService(db);

        var prompt = new Prompt
        {
            Title = "Prompt to Delete",
            Category = "Engagement",
            PromptText = "Some Text",
            IsPublished = true
        };

        await promptService.CreatePromptAsync(prompt, new[] { "Step 1", "Step 2" });

        // Act
        var deleted = await promptService.DeletePromptAsync(prompt.Id);

        // Assert
        Assert.True(deleted);
        var foundPrompt = await db.Prompts.FindAsync(prompt.Id);
        Assert.Null(foundPrompt);
        var foundInstructions = await db.PromptInstructions.Where(i => i.PromptId == prompt.Id).ToListAsync();
        Assert.Empty(foundInstructions);
    }
}
