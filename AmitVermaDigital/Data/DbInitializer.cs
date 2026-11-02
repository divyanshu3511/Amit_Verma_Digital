using AmitVermaDigital.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace AmitVermaDigital.Data;

public static class DbInitializer
{
    public static async Task InitializeAsync(
        ApplicationDbContext context,
        ILogger logger)
    {
        // 1. Apply pending EF Core PostgreSQL migrations safely
        bool migrationSuccessful = true;
        try
        {
            if (context.Database.IsRelational())
            {
                logger.LogInformation("Checking and applying pending database migrations...");
                await context.Database.MigrateAsync();
                logger.LogInformation("Database schema verified and up-to-date.");
            }
        }
        catch (Exception ex)
        {
            migrationSuccessful = false;
            logger.LogWarning(ex, "Could not apply database migrations at startup. Verify your connection string (ConnectionStrings__DefaultConnection) or run migrations manually via 'dotnet ef database update'.");
        }

        if (!migrationSuccessful)
        {
            logger.LogWarning("Skipping initial data seeding because database connection could not be established. Ensure your PostgreSQL connection string is set.");
            return;
        }

        // 2. Ensure SiteSettings row exists
        try
        {
            if (!await context.SiteSettings.AnyAsync())
            {
                context.SiteSettings.Add(new SiteSetting
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
                    UpdatedAtUtc = DateTime.UtcNow
                });
                await context.SaveChangesAsync();
                logger.LogInformation("Initialized default SiteSettings.");
            }
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Could not check or seed SiteSettings.");
        }

        // 3. Seed Featured Videos if empty
        try
        {
            if (!await context.FeaturedVideos.AnyAsync())
            {
                context.FeaturedVideos.AddRange(
                    new FeaturedVideo
                    {
                        Title = "Facebook Criteria Unlock & Monetization Guide",
                        Description = "Learn how to hit 5,000 followers and 60,000 watch minutes fast using organic Reels strategies.",
                        VideoUrlOrId = "dQw4w9WgXcQ",
                        SortOrder = 1,
                        IsActive = true,
                        CreatedAtUtc = DateTime.UtcNow
                    },
                    new FeaturedVideo
                    {
                        Title = "Viral Reels Algorithm Secrets 2026",
                        Description = "Step-by-step breakdown of how Facebook's recommendation algorithm distributes short videos.",
                        VideoUrlOrId = "jNQXAC9IVRw",
                        SortOrder = 2,
                        IsActive = true,
                        CreatedAtUtc = DateTime.UtcNow
                    }
                );
                await context.SaveChangesAsync();
                logger.LogInformation("Seeded default Featured Videos.");
            }
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Could not check or seed FeaturedVideos.");
        }

        // 4. Seed Demonstration Prompts if empty
        try
        {
            if (!await context.Prompts.AnyAsync())
            {
                var p1 = new Prompt
                {
                    Title = "Facebook Reels Viral Script & Retention Blueprint",
                    Slug = "facebook-reels-viral-script-blueprint",
                    Category = "Facebook Reels",
                    Description = "A high-retention 30-45 second script formula optimized for the Facebook Reels recommendation algorithm.",
                    Keywords = "facebook reels, viral hook, video script, retention, algorithm",
                    PromptText = @"Act as an elite short-form video strategist and viral scriptwriter for Facebook Reels.

Your goal is to write a high-retention, 35-45 second script for a video about: [INSERT TOPIC HERE].
Target Audience: Aspiring digital creators and social media professionals in India.

Follow this exact high-converting Reels architecture:
1. THE 3-SECOND VISUAL & AUDIO HOOK:
   - Provide 3 bold, contrarian opening lines that halt scrolling immediately.
   - Describe a clear visual action (e.g. pointing to screen, holding up phone, rapid zoom).

2. THE AGITATION & RELATABILITY (Seconds 3 to 12):
   - Highlight the common frustration or mistake creators make regarding [TOPIC].
   - Use conversational Hindi/English (Hinglish) or plain modern English.

3. THE CORE SOLUTION / THE 3 GOLDEN NUGGETS (Seconds 12 to 32):
   - Bullet 1: The fastest tweak they can make today.
   - Bullet 2: The tool or setting to enable right now.
   - Bullet 3: The secret pitfall to strictly avoid.

4. CALL TO ACTION & OPEN LOOP (Seconds 32 to 40):
   - Strong reason to save this Reel for future reference.
   - Pinned comment prompt to provoke discussion and trigger algorithmic boost.",
                    IsPublished = true,
                    IsFeatured = true,
                    StartsAtUtc = DateTime.UtcNow.AddDays(-10),
                    EndsAtUtc = null,
                    CreatedAtUtc = DateTime.UtcNow.AddDays(-10),
                    UpdatedAtUtc = DateTime.UtcNow.AddDays(-10),
                    Instructions = new List<PromptInstruction>
                    {
                        new() { SortOrder = 1, InstructionText = "Replace [INSERT TOPIC HERE] with your specific video idea (e.g., 'How to get in-stream ads approval' or 'Best camera settings for Reels')." },
                        new() { SortOrder = 2, InstructionText = "Paste the prompt into ChatGPT, Claude, or Gemini to generate 3 tailored script variations." },
                        new() { SortOrder = 3, InstructionText = "Record using good front lighting and practice the opening hook so it takes under 3 seconds." },
                        new() { SortOrder = 4, InstructionText = "Add clean on-screen auto-captions with highlighted keywords for maximum muted viewer retention." }
                    }
                };

                var p2 = new Prompt
                {
                    Title = "Facebook Page Criteria 60,000 Minutes Unlock Masterplan",
                    Slug = "facebook-page-criteria-unlock-masterplan",
                    Category = "Facebook Page Growth",
                    Description = "Generate a customized 30-day content calendar designed to hit 5,000 followers and 60,000 eligible minutes.",
                    Keywords = "facebook page growth, 60k minutes, in-stream ads criteria, followers, calendar",
                    PromptText = @"Act as a senior Facebook Page growth consultant.

I want to unlock Facebook In-Stream Ads monetization for my page in the [YOUR NICHE] category.
My current follower count is [CURRENT FOLLOWERS] and I currently have [CURRENT WATCH MINUTES] minutes.

Generate an aggressive, 30-day organic growth schedule covering:
1. Daily Reels posting schedule (times, formats, and audio selection strategy).
2. Weekly long-form video schedule (5 to 8 minutes each) structured to maximize 1-minute and 3-minute average watch times.
3. Collaborative cross-sharing and Facebook Groups engagement tactics that do not trigger spam penalties.
4. Professional Dashboard audit checklist to maintain 100% 'Page Recommendation: Recommended' status.",
                    IsPublished = true,
                    IsFeatured = true,
                    StartsAtUtc = DateTime.UtcNow.AddDays(-8),
                    EndsAtUtc = null,
                    CreatedAtUtc = DateTime.UtcNow.AddDays(-8),
                    UpdatedAtUtc = DateTime.UtcNow.AddDays(-8),
                    Instructions = new List<PromptInstruction>
                    {
                        new() { SortOrder = 1, InstructionText = "Fill in your niche, current follower count, and current watch minutes in the placeholders." },
                        new() { SortOrder = 2, InstructionText = "Generate the 30-day roadmap and schedule your content batches on Meta Business Suite." },
                        new() { SortOrder = 3, InstructionText = "Review your Meta Creator Studio analytics every Sunday to double down on the top 2 performing formats." }
                    }
                };

                var p3 = new Prompt
                {
                    Title = "Magnetic 3-Second Viral Hook Vault Generator",
                    Slug = "magnetic-3-second-viral-hook-vault",
                    Category = "AI Prompts for Creators",
                    Description = "Generate 15 high-converting psychological hooks categorized by curiosity, shock value, and transformation.",
                    Keywords = "viral hooks, psychological hooks, watch time, short form video, ai prompt",
                    PromptText = @"Act as a viral content psychologist.

Generate 15 irresistible, scroll-stopping 3-second video hooks for a Reel about: [TOPIC].

Divide the hooks into 3 psychological buckets (5 hooks each):
Category A: The Harsh Reality / Pattern Interrupt (e.g. 'Stop doing X if you want Y')
Category B: The Insider Secret / Curiosity Loop (e.g. 'The 1 hidden Facebook setting 99% of creators missed')
Category C: The Fast Transformation (e.g. 'How I went from 0 to 39K followers in 60 days without spending 1 rupee')

For each hook, provide:
1. The exact spoken words.
2. The recommended on-screen text overlay (under 6 words).
3. The recommended b-roll or visual gesture to pair with it.",
                    IsPublished = true,
                    IsFeatured = true,
                    StartsAtUtc = DateTime.UtcNow.AddDays(-6),
                    EndsAtUtc = null,
                    CreatedAtUtc = DateTime.UtcNow.AddDays(-6),
                    UpdatedAtUtc = DateTime.UtcNow.AddDays(-6),
                    Instructions = new List<PromptInstruction>
                    {
                        new() { SortOrder = 1, InstructionText = "Enter your video topic in [TOPIC] and run the prompt." },
                        new() { SortOrder = 2, InstructionText = "Pick the top 2 hooks from Category A or B for your A/B testing batch." },
                        new() { SortOrder = 3, InstructionText = "Ensure the spoken hook finishes before the 3.5-second mark of your video." }
                    }
                };

                var p4 = new Prompt
                {
                    Title = "High-CPM Facebook In-Stream Ads Video Structurer",
                    Slug = "high-cpm-facebook-in-stream-ads-structurer",
                    Category = "Monetization Education",
                    Description = "Architect 3-to-5 minute long-form Facebook videos engineered for optimal mid-roll ad placement and maximum payout.",
                    Keywords = "monetization, in-stream ads, payout, high cpm, facebook earnings",
                    PromptText = @"Act as a Facebook Monetization & Ad Placement Architect.

I am creating a 4-to-6 minute video on: [TOPIC].
I want to maximize ad impressions and viewer retention so that Facebook inserts mid-roll in-stream ads naturally without causing viewers to drop off.

Please provide:
1. Minute 0:00 - 0:30: High-stakes teaser establishing the payout or transformative result.
2. Minute 0:30 - 1:30: Core demonstration part 1 with a subtle cliffhanger right before the 1:00 mark.
3. Minute 1:30 - 2:30: Core demonstration part 2 leading into the primary mid-roll ad cue at Minute 2:00.
4. Minute 2:30 - 3:30: The unexpected bonus tip that rewards viewers who stayed past the mid-roll ad.
5. Minute 3:30 - End: Closing summary and clear invitation to follow for daily creator growth tips.",
                    IsPublished = true,
                    IsFeatured = false,
                    StartsAtUtc = DateTime.UtcNow.AddDays(-4),
                    EndsAtUtc = null,
                    CreatedAtUtc = DateTime.UtcNow.AddDays(-4),
                    UpdatedAtUtc = DateTime.UtcNow.AddDays(-4),
                    Instructions = new List<PromptInstruction>
                    {
                        new() { SortOrder = 1, InstructionText = "Ensure your video duration is at least 3 minutes and 15 seconds to be eligible for mid-roll placement." },
                        new() { SortOrder = 2, InstructionText = "Place the biggest reveal of your tutorial immediately after the 2-minute mark to keep viewers watching through the ad." }
                    }
                };

                var p5 = new Prompt
                {
                    Title = "Bilingual Hinglish Facebook Post & Hashtag Engine",
                    Slug = "bilingual-hinglish-facebook-post-hashtag-engine",
                    Category = "Hashtag Strategy",
                    Description = "Craft culturally resonant, engaging Hinglish captions with laser-targeted hashtags for the Indian creator market.",
                    Keywords = "hinglish, hashtag strategy, facebook reach, hindi creator, lucknow",
                    PromptText = @"Act as an expert Indian social media copywriter specializing in Facebook page viral reach.

Write a bilingual (natural Hinglish) Facebook post caption based on this takeaway: [INSERT MAIN LESSON].

Structure:
- Catchy Hook line with relevant emoji.
- 3 short, punchy paragraphs explaining the concept in conversational Hindi + English words that Indian creators love.
- 3 actionable bullet points.
- Question prompt to spark comments in the discussion section.
- Exactly 7 hashtags: 2 broad (#FacebookTips, #DigitalCreator), 3 niche-specific, and 2 community-driven tags (#AmitVermaDigital, #CreatorGrowthIndia).",
                    IsPublished = true,
                    IsFeatured = false,
                    StartsAtUtc = DateTime.UtcNow.AddDays(-2),
                    EndsAtUtc = null,
                    CreatedAtUtc = DateTime.UtcNow.AddDays(-2),
                    UpdatedAtUtc = DateTime.UtcNow.AddDays(-2),
                    Instructions = new List<PromptInstruction>
                    {
                        new() { SortOrder = 1, InstructionText = "Paste your raw lesson or Reel summary into [INSERT MAIN LESSON]." },
                        new() { SortOrder = 2, InstructionText = "Copy the Hinglish caption into your Meta Business Suite post composer." },
                        new() { SortOrder = 3, InstructionText = "Pin the engagement question as the top comment right after posting." }
                    }
                };

                var p6 = new Prompt
                {
                    Title = "Algorithmic Engagement & Discussion Booster",
                    Slug = "algorithmic-engagement-discussion-booster",
                    Category = "Engagement Improvement",
                    Description = "Generate 10 debate-worthy questions and interactive community polls to skyrocket page comments and algorithmic velocity.",
                    Keywords = "engagement improvement, comments booster, facebook algorithm, viral poll",
                    PromptText = @"Act as an online community engagement specialist.

My Facebook page is about [NICHE / TOPIC].
Generate:
1. Five debate-sparking opinion questions that creators have strong, contrasting feelings about (e.g. 'Should you boost posts or rely 100% on organic Reels?').
2. Three interactive A/B comparison posts (e.g. 'Option A vs Option B: Which one doubled your views?').
3. Two 'Drop your page link and I will review it' post formats engineered to generate 500+ genuine creator comments.",
                    IsPublished = true,
                    IsFeatured = false,
                    StartsAtUtc = DateTime.UtcNow.AddDays(-1),
                    EndsAtUtc = null,
                    CreatedAtUtc = DateTime.UtcNow.AddDays(-1),
                    UpdatedAtUtc = DateTime.UtcNow.AddDays(-1),
                    Instructions = new List<PromptInstruction>
                    {
                        new() { SortOrder = 1, InstructionText = "Select 1 question format per week for your Friday engagement post." },
                        new() { SortOrder = 2, InstructionText = "Reply to every comment received within the first 60 minutes to double the algorithmic distribution." }
                    }
                };

                context.Prompts.AddRange(p1, p2, p3, p4, p5, p6);
                await context.SaveChangesAsync();
                logger.LogInformation("Seeded demonstration creator prompts with instructions.");
            }
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Could not check or seed Prompts.");
        }
    }
}
