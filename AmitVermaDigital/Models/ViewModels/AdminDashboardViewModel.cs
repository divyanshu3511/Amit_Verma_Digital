using AmitVermaDigital.Models.Entities;

namespace AmitVermaDigital.Models.ViewModels;

public class AdminDashboardViewModel
{
    public int TotalPrompts { get; set; }
    public int LivePrompts { get; set; }
    public int ScheduledPrompts { get; set; }
    public int DraftPrompts { get; set; }
    public int ExpiredPrompts { get; set; }
    public int UnreadMessages { get; set; }

    public List<Prompt> RecentPrompts { get; set; } = new();
    public List<ContactMessage> RecentMessages { get; set; } = new();
    public SiteSetting Settings { get; set; } = new();
}
