using System.ComponentModel.DataAnnotations;
using AmitVermaDigital.Models.Entities;

namespace AmitVermaDigital.Models.ViewModels;

public class SiteSettingViewModel : IValidatableObject
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

    public IFormFile? NewAvatarFile { get; set; }
    public IFormFile? NewCoverFile { get; set; }
    public IFormFile? NewPortraitFile { get; set; }

    [StringLength(500)]
    public string? FacebookPageUrl { get; set; }

    [StringLength(500)]
    public string? InstagramUrl { get; set; }

    [StringLength(500)]
    public string? YouTubeChannelUrl { get; set; }

    [StringLength(500)]
    public string? LinkedInUrl { get; set; }

    [EmailAddress]
    [StringLength(200)]
    public string? ContactEmail { get; set; }

    [StringLength(50)]
    public string? WhatsAppNumber { get; set; }

    [StringLength(500)]
    public string? BusinessNote { get; set; }

    [StringLength(200)]
    public string AboutTitle { get; set; } = "Empowering Creators to Monetize and Scale";

    public string AboutExperience { get; set; } = string.Empty;

    public string AboutMission { get; set; } = string.Empty;

    // Ad Slot 1
    public bool AdSlot1Enabled { get; set; } = false;

    [StringLength(500)]
    public string? AdSlot1ImageUrl { get; set; }

    [StringLength(500)]
    public string? AdSlot1TargetUrl { get; set; }

    [StringLength(150)]
    public string? AdSlot1AltText { get; set; }

    // Ad Slot 2
    public bool AdSlot2Enabled { get; set; } = false;

    [StringLength(500)]
    public string? AdSlot2ImageUrl { get; set; }

    [StringLength(500)]
    public string? AdSlot2TargetUrl { get; set; }

    [StringLength(150)]
    public string? AdSlot2AltText { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (AdSlot1Enabled)
        {
            if (string.IsNullOrWhiteSpace(AdSlot1ImageUrl))
                yield return new ValidationResult("Ad Slot 1 Image URL is required when enabled.", new[] { nameof(AdSlot1ImageUrl) });

            if (string.IsNullOrWhiteSpace(AdSlot1TargetUrl))
                yield return new ValidationResult("Ad Slot 1 Target URL is required when enabled.", new[] { nameof(AdSlot1TargetUrl) });
        }

        if (AdSlot2Enabled)
        {
            if (string.IsNullOrWhiteSpace(AdSlot2ImageUrl))
                yield return new ValidationResult("Ad Slot 2 Image URL is required when enabled.", new[] { nameof(AdSlot2ImageUrl) });

            if (string.IsNullOrWhiteSpace(AdSlot2TargetUrl))
                yield return new ValidationResult("Ad Slot 2 Target URL is required when enabled.", new[] { nameof(AdSlot2TargetUrl) });
        }
    }
}
