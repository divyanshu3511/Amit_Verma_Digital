using AmitVermaDigital.Models.Entities;

namespace AmitVermaDigital.Models.ViewModels;

public class PromptLibraryViewModel
{
    public List<Prompt> Prompts { get; set; } = new();
    public List<string> Categories { get; set; } = new();
    public string? SelectedCategory { get; set; }
    public string? SearchTerm { get; set; }
    public string SortBy { get; set; } = "newest";
    public SiteSetting Settings { get; set; } = new();
    public string CurrentLang { get; set; } = "en"; // "en" or "hi"
}

public class PromptDetailViewModel
{
    public Prompt Prompt { get; set; } = new();
    public List<Prompt> RelatedPrompts { get; set; } = new();
    public SiteSetting Settings { get; set; } = new();
    public string CurrentLang { get; set; } = "en";
}
