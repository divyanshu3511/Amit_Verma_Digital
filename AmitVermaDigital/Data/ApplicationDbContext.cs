using AmitVermaDigital.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace AmitVermaDigital.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Prompt> Prompts => Set<Prompt>();
    public DbSet<PromptInstruction> PromptInstructions => Set<PromptInstruction>();
    public DbSet<SiteSetting> SiteSettings => Set<SiteSetting>();
    public DbSet<FeaturedVideo> FeaturedVideos => Set<FeaturedVideo>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Prompt>(b =>
        {
            b.HasIndex(p => p.Slug).IsUnique();
            b.HasIndex(p => new { p.IsPublished, p.StartsAtUtc, p.EndsAtUtc });
            b.HasIndex(p => p.Category);
            b.HasIndex(p => p.IsFeatured);

            b.HasMany(p => p.Instructions)
                .WithOne(i => i.Prompt)
                .HasForeignKey(i => i.PromptId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        builder.Entity<PromptInstruction>(b =>
        {
            b.HasIndex(i => new { i.PromptId, i.SortOrder });
        });

        builder.Entity<FeaturedVideo>(b =>
        {
            b.HasIndex(v => new { v.IsActive, v.SortOrder });
        });

        builder.Entity<ContactMessage>(b =>
        {
            b.HasIndex(m => m.CreatedAtUtc);
            b.HasIndex(m => m.IsRead);
        });

        builder.Entity<SiteSetting>(b =>
        {
            b.HasData(new SiteSetting
            {
                Id = 1,
                BrandName = "Amit Verma Digital 2.0",
                Tagline = "Helping Creators Grow Faster",
                Positioning = "Followers Increase | Reels Viral Tips",
                HeroHeadline = "Grow Your Content.\nExpand Your Reach.",
                HeroHeadlineHi = "Facebook पर Grow करें अपना Content",
                HeroDescription = "Discover practical tips, creator resources, and ready-to-use AI prompts to improve your content workflow and social media growth.",
                HeroDescriptionHi = "Reels Viral Tips | More Views | Monetization | Step by Step Guide. अपने कंटेंट वर्कफ़्लो और सोशल मीडिया ग्रोथ को बेहतर बनाने के लिए तैयार AI प्रॉम्प्ट्स।",
                Category = "Digital Creator",
                Location = "Lucknow, Uttar Pradesh, India",
                FollowerCountDisplay = "39K",
                LogoPath = "/images/logo.png",
                AvatarPath = "/images/avatar.png",
                CoverImagePath = "/images/cover.jpg",
                PortraitImagePath = "/images/portrait.jpg",
                FacebookPageUrl = "https://www.facebook.com",
                InstagramUrl = "https://www.instagram.com",
                YouTubeChannelUrl = "https://www.youtube.com",
                LinkedInUrl = "https://www.linkedin.com",
                ContactEmail = "amitvermadigital2.0@gmail.com",
                WhatsAppNumber = "",
                BusinessNote = "Open for creator collaborations, Facebook growth consulting, and speaking inquiries.",
                AboutTitle = "Empowering Creators to Monetize and Scale",
                AboutExperience = "Based in Lucknow, Uttar Pradesh, Amit Verma is a dedicated digital creator who has empowered thousands of creators to unlock Facebook monetization, expand Reels reach, and craft high-retention content. With proven monetization milestones ($106+ payout proofs, 39K+ community), Amit provides practical, step-by-step guidance tailored for real organic growth.",
                AboutMission = "Democratizing content creation by providing actionable video blueprints, algorithmic growth strategies, and ready-to-use AI prompts that save creators hours every week.",
                AdSlot1Enabled = false,
                AdSlot2Enabled = false,
                UpdatedAtUtc = new DateTime(2026, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            });
        });
    }
}
