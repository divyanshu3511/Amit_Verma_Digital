using System.ComponentModel.DataAnnotations;

namespace AmitVermaDigital.Models.Entities;

public class SiteSetting
{
    public int Id { get; set; } = 1;

    [Required]
    [StringLength(100)]
    public string BrandName { get; set; } = "Amit Verma Digital 2.0";

    [Required]
    [StringLength(150)]
    public string Tagline { get; set; } = "Helping Creators Grow Faster";

    [StringLength(150)]
    public string Positioning { get; set; } = "Followers Increase | Reels Viral Tips";

    [Required]
    [StringLength(200)]
    public string HeroHeadline { get; set; } = "Grow Your Content.\nExpand Your Reach.";

    [StringLength(200)]
    public string HeroHeadlineHi { get; set; } = "Facebook पर Grow करें अपना Content";

    [Required]
    [StringLength(1000)]
    public string HeroDescription { get; set; } = "Discover practical tips, creator resources, and ready-to-use AI prompts to improve your content workflow and social media growth.";

    [StringLength(1000)]
    public string HeroDescriptionHi { get; set; } = "Reels Viral Tips | More Views | Monetization | Step by Step Guide. अपने कंटेंट वर्कफ़्लो और सोशल मीडिया ग्रोथ को बेहतर बनाने के लिए तैयार AI प्रॉम्प्ट्स।";

    [StringLength(100)]
    public string Category { get; set; } = "Digital Creator";

    [StringLength(150)]
    public string Location { get; set; } = "Lucknow, Uttar Pradesh, India";

    [StringLength(50)]
    public string FollowerCountDisplay { get; set; } = "39K";

    [StringLength(300)]
    public string LogoPath { get; set; } = "/images/logo.png";

    [StringLength(300)]
    public string AvatarPath { get; set; } = "/images/avatar.png";

    [StringLength(300)]
    public string CoverImagePath { get; set; } = "/images/cover.jpg";

    [StringLength(300)]
    public string PortraitImagePath { get; set; } = "/images/portrait.jpg";

    [StringLength(500)]
    public string? FacebookPageUrl { get; set; } = "https://facebook.com";

    [StringLength(500)]
    public string? InstagramUrl { get; set; } = "https://instagram.com";

    [StringLength(500)]
    public string? YouTubeChannelUrl { get; set; } = "https://youtube.com";

    [StringLength(500)]
    public string? LinkedInUrl { get; set; } = "https://linkedin.com";

    [EmailAddress]
    [StringLength(200)]
    public string? ContactEmail { get; set; } = "amitvermadigital2.0@gmail.com";

    [StringLength(50)]
    public string? WhatsAppNumber { get; set; }

    [StringLength(500)]
    public string? BusinessNote { get; set; } = "Open for creator collaborations, Facebook growth consulting, and speaking inquiries.";

    [StringLength(200)]
    public string AboutTitle { get; set; } = "Empowering Creators to Monetize and Scale";

    public string AboutExperience { get; set; } = "Based in Lucknow, Uttar Pradesh, Amit Verma is a dedicated digital creator who has empowered thousands of creators to unlock Facebook monetization, expand Reels reach, and craft high-retention content. With proven monetization milestones ($106+ payout proofs, 39K+ community), Amit provides practical, step-by-step guidance tailored for real organic growth.";

    public string AboutMission { get; set; } = "Democratizing content creation by providing actionable video blueprints, algorithmic growth strategies, and ready-to-use AI prompts that save creators hours every week.";

    // Ad Slot 1 (Disabled by default)
    public bool AdSlot1Enabled { get; set; } = false;

    [StringLength(500)]
    public string? AdSlot1ImageUrl { get; set; }

    [StringLength(500)]
    public string? AdSlot1TargetUrl { get; set; }

    [StringLength(150)]
    public string? AdSlot1AltText { get; set; } = "Featured Partner";

    // Ad Slot 2 (Disabled by default)
    public bool AdSlot2Enabled { get; set; } = false;

    [StringLength(500)]
    public string? AdSlot2ImageUrl { get; set; }

    [StringLength(500)]
    public string? AdSlot2TargetUrl { get; set; }

    [StringLength(150)]
    public string? AdSlot2AltText { get; set; } = "Sponsored Resource";

    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;
}
