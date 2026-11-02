using AmitVermaDigital.Controllers;
using AmitVermaDigital.Data;
using AmitVermaDigital.Models.Entities;
using AmitVermaDigital.Models.ViewModels;
using AmitVermaDigital.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.EntityFrameworkCore;

namespace AmitVermaDigital.Tests;

public class DummyTempDataProvider : ITempDataProvider
{
    private readonly Dictionary<string, object> _data = new();
    public IDictionary<string, object> LoadTempData(HttpContext context) => _data;
    public void SaveTempData(HttpContext context, IDictionary<string, object> values)
    {
        foreach (var kvp in values) _data[kvp.Key] = kvp.Value;
    }
}

public class ContactFormTests
{
    private ApplicationDbContext CreateInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new ApplicationDbContext(options);
    }

    [Fact]
    public async Task ContactController_Honeypot_SilentlyRejectsBotsWithoutSaving()
    {
        // Arrange
        using var db = CreateInMemoryDbContext();
        var contactService = new ContactService(db);
        var httpContext = new DefaultHttpContext();
        var controller = new ContactController(contactService)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = httpContext
            },
            TempData = new TempDataDictionary(httpContext, new DummyTempDataProvider())
        };

        var botSubmission = new ContactFormViewModel
        {
            Name = "Bot Spammer",
            Email = "spammer@bot.com",
            Message = "Buy crypto now!",
            Website = "http://spam-link.com" // Honeypot filled!
        };

        // Act
        var result = await controller.Submit(botSubmission);

        // Assert
        Assert.IsType<RedirectResult>(result);
        var messagesInDb = await contactService.GetMessagesAsync();
        Assert.Empty(messagesInDb); // Bot trapped! Not saved!
    }

    [Fact]
    public async Task ContactController_ValidSubmission_SavesMessage()
    {
        // Arrange
        using var db = CreateInMemoryDbContext();
        var contactService = new ContactService(db);
        var httpContext = new DefaultHttpContext();
        var controller = new ContactController(contactService)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = httpContext
            },
            TempData = new TempDataDictionary(httpContext, new DummyTempDataProvider())
        };

        var validSubmission = new ContactFormViewModel
        {
            Name = "Rahul Sharma",
            Email = "rahul@example.com",
            Subject = "Facebook Page Consulting",
            Message = "Hi Amit, I would like guidance on unlocking my In-Stream ads criteria.",
            Website = "" // Honeypot clean
        };

        // Act
        var result = await controller.Submit(validSubmission);

        // Assert
        Assert.IsType<RedirectResult>(result);
        var messagesInDb = await contactService.GetMessagesAsync();
        Assert.Single(messagesInDb);
        Assert.Equal("Rahul Sharma", messagesInDb[0].Name);
        Assert.Equal("rahul@example.com", messagesInDb[0].Email);
        Assert.False(messagesInDb[0].IsRead);
    }
}
