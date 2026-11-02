import { Prompt } from '../models/prompt.model';

export const MOCK_PROMPTS: Prompt[] = [
  {
    id: 1,
    title: 'Facebook Reels Viral Script & Retention Blueprint',
    slug: 'facebook-reels-viral-script-blueprint',
    category: 'Facebook Reels',
    description: 'A high-retention 30-45 second script formula optimized for the Facebook Reels recommendation algorithm.',
    keywords: 'facebook reels, viral hook, video script, retention, algorithm',
    promptText: `Act as an elite short-form video strategist and viral scriptwriter for Facebook Reels.

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
   - Pinned comment prompt to provoke discussion and trigger algorithmic boost.`,
    isPublished: true,
    isFeatured: true,
    startsAtUtc: '2026-01-01T00:00:00Z',
    endsAtUtc: null,
    createdAtUtc: '2026-10-15T00:00:00Z',
    updatedAtUtc: '2026-10-15T00:00:00Z',
    instructions: [
      { id: 1, promptId: 1, sortOrder: 1, instructionText: 'Replace [INSERT TOPIC HERE] with your specific video idea (e.g., \'How to get in-stream ads approval\' or \'Best camera settings for Reels\').' },
      { id: 2, promptId: 1, sortOrder: 2, instructionText: 'Paste the prompt into ChatGPT, Claude, or Gemini to generate 3 tailored script variations.' },
      { id: 3, promptId: 1, sortOrder: 3, instructionText: 'Record using good front lighting and practice the opening hook so it takes under 3 seconds.' },
      { id: 4, promptId: 1, sortOrder: 4, instructionText: 'Add clean on-screen auto-captions with highlighted keywords for maximum muted viewer retention.' }
    ]
  },
  {
    id: 2,
    title: 'Facebook Page Criteria 60,000 Minutes Unlock Masterplan',
    slug: 'facebook-page-criteria-unlock-masterplan',
    category: 'Facebook Page Growth',
    description: 'Generate a customized 30-day content calendar designed to hit 5,000 followers and 60,000 eligible minutes.',
    keywords: 'facebook page growth, 60k minutes, in-stream ads criteria, followers, calendar',
    promptText: `Act as a senior Facebook Page growth consultant.

I want to unlock Facebook In-Stream Ads monetization for my page in the [YOUR NICHE] category.
My current follower count is [CURRENT FOLLOWERS] and I currently have [CURRENT WATCH MINUTES] minutes.

Generate an aggressive, 30-day organic growth schedule covering:
1. Daily Reels posting schedule (times, formats, and audio selection strategy).
2. Weekly long-form video schedule (5 to 8 minutes each) structured to maximize 1-minute and 3-minute average watch times.
3. Collaborative cross-sharing and Facebook Groups engagement tactics that do not trigger spam penalties.
4. Professional Dashboard audit checklist to maintain 100% 'Page Recommendation: Recommended' status.`,
    isPublished: true,
    isFeatured: true,
    startsAtUtc: '2026-01-01T00:00:00Z',
    endsAtUtc: null,
    createdAtUtc: '2026-10-16T00:00:00Z',
    updatedAtUtc: '2026-10-16T00:00:00Z',
    instructions: [
      { id: 5, promptId: 2, sortOrder: 1, instructionText: 'Fill in your niche, current follower count, and current watch minutes in the placeholders.' },
      { id: 6, promptId: 2, sortOrder: 2, instructionText: 'Generate the 30-day roadmap and schedule your content batches on Meta Business Suite.' },
      { id: 7, promptId: 2, sortOrder: 3, instructionText: 'Review your Meta Creator Studio analytics every Sunday to double down on the top 2 performing formats.' }
    ]
  },
  {
    id: 3,
    title: 'Magnetic 3-Second Viral Hook Vault Generator',
    slug: 'magnetic-3-second-viral-hook-vault',
    category: 'AI Prompts for Creators',
    description: 'Generate 15 high-converting psychological hooks categorized by curiosity, shock value, and transformation.',
    keywords: 'viral hooks, psychological hooks, watch time, short form video, ai prompt',
    promptText: `Act as a viral content psychologist.

Generate 15 irresistible, scroll-stopping 3-second video hooks for a Reel about: [TOPIC].

Divide the hooks into 3 psychological buckets (5 hooks each):
Category A: The Harsh Reality / Pattern Interrupt (e.g. 'Stop doing X if you want Y')
Category B: The Insider Secret / Curiosity Loop (e.g. 'The 1 hidden Facebook setting 99% of creators missed')
Category C: The Fast Transformation (e.g. 'How I went from 0 to 39K followers in 60 days without spending 1 rupee')

For each hook, provide:
1. The exact spoken words.
2. The recommended on-screen text overlay (under 6 words).
3. The recommended b-roll or visual gesture to pair with it.`,
    isPublished: true,
    isFeatured: true,
    startsAtUtc: '2026-01-01T00:00:00Z',
    endsAtUtc: null,
    createdAtUtc: '2026-10-18T00:00:00Z',
    updatedAtUtc: '2026-10-18T00:00:00Z',
    instructions: [
      { id: 8, promptId: 3, sortOrder: 1, instructionText: 'Enter your video topic in [TOPIC] and run the prompt.' },
      { id: 9, promptId: 3, sortOrder: 2, instructionText: 'Pick the top 2 hooks from Category A or B for your A/B testing batch.' },
      { id: 10, promptId: 3, sortOrder: 3, instructionText: 'Ensure the spoken hook finishes before the 3.5-second mark of your video.' }
    ]
  },
  {
    id: 4,
    title: 'High-CPM Facebook In-Stream Ads Video Structurer',
    slug: 'high-cpm-facebook-in-stream-ads-structurer',
    category: 'Monetization Education',
    description: 'Architect 3-to-5 minute long-form Facebook videos engineered for optimal mid-roll ad placement and maximum payout.',
    keywords: 'monetization, in-stream ads, payout, high cpm, facebook earnings',
    promptText: `Act as a Facebook Monetization & Ad Placement Architect.

I am creating a 4-to-6 minute video on: [TOPIC].
I want to maximize ad impressions and viewer retention so that Facebook inserts mid-roll in-stream ads naturally without causing viewers to drop off.

Please provide:
1. Minute 0:00 - 0:30: High-stakes teaser establishing the payout or transformative result.
2. Minute 0:30 - 1:30: Core demonstration part 1 with a subtle cliffhanger right before the 1:00 mark.
3. Minute 1:30 - 2:30: Core demonstration part 2 leading into the primary mid-roll ad cue at Minute 2:00.
4. Minute 2:30 - 3:30: The unexpected bonus tip that rewards viewers who stayed past the mid-roll ad.
5. Minute 3:30 - End: Closing summary and clear invitation to follow for daily creator growth tips.`,
    isPublished: true,
    isFeatured: false,
    startsAtUtc: '2026-01-01T00:00:00Z',
    endsAtUtc: null,
    createdAtUtc: '2026-10-20T00:00:00Z',
    updatedAtUtc: '2026-10-20T00:00:00Z',
    instructions: [
      { id: 11, promptId: 4, sortOrder: 1, instructionText: 'Ensure your video duration is at least 3 minutes and 15 seconds to be eligible for mid-roll placement.' },
      { id: 12, promptId: 4, sortOrder: 2, instructionText: 'Place the biggest reveal of your tutorial immediately after the 2-minute mark to keep viewers watching through the ad.' }
    ]
  },
  {
    id: 5,
    title: 'Bilingual Hinglish Facebook Post & Hashtag Engine',
    slug: 'bilingual-hinglish-facebook-post-hashtag-engine',
    category: 'Hashtag Strategy',
    description: 'Craft culturally resonant, engaging Hinglish captions with laser-targeted hashtags for the Indian creator market.',
    keywords: 'hinglish, hashtag strategy, facebook reach, hindi creator, lucknow',
    promptText: `Act as an expert Indian social media copywriter specializing in Facebook page viral reach.

Write a bilingual (natural Hinglish) Facebook post caption based on this takeaway: [INSERT MAIN LESSON].

Structure:
- Catchy Hook line with relevant emoji.
- 3 short, punchy paragraphs explaining the concept in conversational Hindi + English words that Indian creators love.
- 3 actionable bullet points.
- Question prompt to spark comments in the discussion section.
- Exactly 7 hashtags: 2 broad (#FacebookTips, #DigitalCreator), 3 niche-specific, and 2 community-driven tags (#AmitVermaDigital, #CreatorGrowthIndia).`,
    isPublished: true,
    isFeatured: false,
    startsAtUtc: '2026-01-01T00:00:00Z',
    endsAtUtc: null,
    createdAtUtc: '2026-10-22T00:00:00Z',
    updatedAtUtc: '2026-10-22T00:00:00Z',
    instructions: [
      { id: 13, promptId: 5, sortOrder: 1, instructionText: 'Paste your raw lesson or Reel summary into [INSERT MAIN LESSON].' },
      { id: 14, promptId: 5, sortOrder: 2, instructionText: 'Copy the Hinglish caption into your Meta Business Suite post composer.' },
      { id: 15, promptId: 5, sortOrder: 3, instructionText: 'Pin the engagement question as the top comment right after posting.' }
    ]
  },
  {
    id: 6,
    title: 'Algorithmic Engagement & Discussion Booster',
    slug: 'algorithmic-engagement-discussion-booster',
    category: 'Engagement Improvement',
    description: 'Generate 10 debate-worthy questions and interactive community polls to skyrocket page comments and algorithmic velocity.',
    keywords: 'engagement improvement, comments booster, facebook algorithm, viral poll',
    promptText: `Act as an online community engagement specialist.

My Facebook page is about [NICHE / TOPIC].
Generate:
1. Five debate-sparking opinion questions that creators have strong, contrasting feelings about (e.g. 'Should you boost posts or rely 100% on organic Reels?').
2. Three interactive A/B comparison posts (e.g. 'Option A vs Option B: Which one doubled your views?').
3. Two 'Drop your page link and I will review it' post formats engineered to generate 500+ genuine creator comments.`,
    isPublished: true,
    isFeatured: false,
    startsAtUtc: '2026-01-01T00:00:00Z',
    endsAtUtc: null,
    createdAtUtc: '2026-10-25T00:00:00Z',
    updatedAtUtc: '2026-10-25T00:00:00Z',
    instructions: [
      { id: 16, promptId: 6, sortOrder: 1, instructionText: 'Select 1 question format per week for your Friday engagement post.' },
      { id: 17, promptId: 6, sortOrder: 2, instructionText: 'Reply to every comment received within the first 60 minutes to double the algorithmic distribution.' }
    ]
  },
  {
    id: 7,
    title: 'Upcoming 2027 Monetization Blueprint (Draft)',
    slug: 'upcoming-2027-monetization-blueprint-draft',
    category: 'Monetization Education',
    description: 'Draft strategy guide for future Facebook monetization tier updates.',
    keywords: 'draft, monetization, 2027',
    promptText: 'Draft content for internal review...',
    isPublished: false, // Draft
    isFeatured: false,
    startsAtUtc: null,
    endsAtUtc: null,
    createdAtUtc: '2026-10-26T00:00:00Z',
    updatedAtUtc: '2026-10-26T00:00:00Z',
    instructions: []
  },
  {
    id: 8,
    title: 'New Year 2027 Growth Challenge (Scheduled)',
    slug: 'new-year-2027-growth-challenge',
    category: 'Facebook Page Growth',
    description: 'Scheduled prompt that will become live on Dec 31, 2026.',
    keywords: 'scheduled, new year, growth',
    promptText: 'Act as a New Year content growth strategist...',
    isPublished: true,
    isFeatured: false,
    startsAtUtc: '2026-12-31T18:30:00Z', // Future scheduled
    endsAtUtc: null,
    createdAtUtc: '2026-10-27T00:00:00Z',
    updatedAtUtc: '2026-10-27T00:00:00Z',
    instructions: []
  }
];
