using AmitVermaDigital.Models.Entities;

namespace AmitVermaDigital.Models.ViewModels;

public class HomeViewModel
{
    public SiteSetting Settings { get; set; } = new();
    public List<Prompt> FeaturedPrompts { get; set; } = new();
    public List<FeaturedVideo> FeaturedVideos { get; set; } = new();
    public ContactFormViewModel ContactForm { get; set; } = new();
}
