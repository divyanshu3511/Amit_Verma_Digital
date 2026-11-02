using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace AmitVermaDigital.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate_PostgreSql : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ContactMessages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Subject = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    Message = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    IpAddress = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    IsRead = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContactMessages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FeaturedVideos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    VideoUrlOrId = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FeaturedVideos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Prompts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Slug = table.Column<string>(type: "character varying(160)", maxLength: 160, nullable: false),
                    Description = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Category = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: false),
                    Keywords = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    PromptText = table.Column<string>(type: "text", nullable: false),
                    IsPublished = table.Column<bool>(type: "boolean", nullable: false),
                    IsFeatured = table.Column<bool>(type: "boolean", nullable: false),
                    StartsAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    EndsAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Prompts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SiteSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    BrandName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Tagline = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    Positioning = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    HeroHeadline = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    HeroHeadlineHi = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    HeroDescription = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    HeroDescriptionHi = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    Category = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Location = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    FollowerCountDisplay = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    LogoPath = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    AvatarPath = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    CoverImagePath = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    PortraitImagePath = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    FacebookPageUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    InstagramUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    YouTubeChannelUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    LinkedInUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    ContactEmail = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    WhatsAppNumber = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    BusinessNote = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    AboutTitle = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    AboutExperience = table.Column<string>(type: "text", nullable: false),
                    AboutMission = table.Column<string>(type: "text", nullable: false),
                    AdSlot1Enabled = table.Column<bool>(type: "boolean", nullable: false),
                    AdSlot1ImageUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    AdSlot1TargetUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    AdSlot1AltText = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    AdSlot2Enabled = table.Column<bool>(type: "boolean", nullable: false),
                    AdSlot2ImageUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    AdSlot2TargetUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    AdSlot2AltText = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SiteSettings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PromptInstructions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PromptId = table.Column<int>(type: "integer", nullable: false),
                    InstructionText = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    SortOrder = table.Column<int>(type: "integer", nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PromptInstructions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PromptInstructions_Prompts_PromptId",
                        column: x => x.PromptId,
                        principalTable: "Prompts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "SiteSettings",
                columns: new[] { "Id", "AboutExperience", "AboutMission", "AboutTitle", "AdSlot1AltText", "AdSlot1Enabled", "AdSlot1ImageUrl", "AdSlot1TargetUrl", "AdSlot2AltText", "AdSlot2Enabled", "AdSlot2ImageUrl", "AdSlot2TargetUrl", "AvatarPath", "BrandName", "BusinessNote", "Category", "ContactEmail", "CoverImagePath", "FacebookPageUrl", "FollowerCountDisplay", "HeroDescription", "HeroDescriptionHi", "HeroHeadline", "HeroHeadlineHi", "InstagramUrl", "LinkedInUrl", "Location", "LogoPath", "PortraitImagePath", "Positioning", "Tagline", "UpdatedAtUtc", "WhatsAppNumber", "YouTubeChannelUrl" },
                values: new object[] { 1, "Based in Lucknow, Uttar Pradesh, Amit Verma is a dedicated digital creator who has empowered thousands of creators to unlock Facebook monetization, expand Reels reach, and craft high-retention content. With proven monetization milestones ($106+ payout proofs, 39K+ community), Amit provides practical, step-by-step guidance tailored for real organic growth.", "Democratizing content creation by providing actionable video blueprints, algorithmic growth strategies, and ready-to-use AI prompts that save creators hours every week.", "Empowering Creators to Monetize and Scale", "Featured Partner", false, null, null, "Sponsored Resource", false, null, null, "/images/avatar.png", "Amit Verma Digital 2.0", "Open for creator collaborations, Facebook growth consulting, and speaking inquiries.", "Digital Creator", "amitvermadigital2.0@gmail.com", "/images/cover.jpg", "https://www.facebook.com", "39K", "Discover practical tips, creator resources, and ready-to-use AI prompts to improve your content workflow and social media growth.", "Reels Viral Tips | More Views | Monetization | Step by Step Guide. अपने कंटेंट वर्कफ़्लो और सोशल मीडिया ग्रोथ को बेहतर बनाने के लिए तैयार AI प्रॉम्प्ट्स।", "Grow Your Content.\nExpand Your Reach.", "Facebook पर Grow करें अपना Content", "https://www.instagram.com", "https://www.linkedin.com", "Lucknow, Uttar Pradesh, India", "/images/logo.png", "/images/portrait.jpg", "Followers Increase | Reels Viral Tips", "Helping Creators Grow Faster", new DateTime(2026, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc), "", "https://www.youtube.com" });

            migrationBuilder.CreateIndex(
                name: "IX_ContactMessages_CreatedAtUtc",
                table: "ContactMessages",
                column: "CreatedAtUtc");

            migrationBuilder.CreateIndex(
                name: "IX_ContactMessages_IsRead",
                table: "ContactMessages",
                column: "IsRead");

            migrationBuilder.CreateIndex(
                name: "IX_FeaturedVideos_IsActive_SortOrder",
                table: "FeaturedVideos",
                columns: new[] { "IsActive", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_PromptInstructions_PromptId_SortOrder",
                table: "PromptInstructions",
                columns: new[] { "PromptId", "SortOrder" });

            migrationBuilder.CreateIndex(
                name: "IX_Prompts_Category",
                table: "Prompts",
                column: "Category");

            migrationBuilder.CreateIndex(
                name: "IX_Prompts_IsFeatured",
                table: "Prompts",
                column: "IsFeatured");

            migrationBuilder.CreateIndex(
                name: "IX_Prompts_IsPublished_StartsAtUtc_EndsAtUtc",
                table: "Prompts",
                columns: new[] { "IsPublished", "StartsAtUtc", "EndsAtUtc" });

            migrationBuilder.CreateIndex(
                name: "IX_Prompts_Slug",
                table: "Prompts",
                column: "Slug",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContactMessages");

            migrationBuilder.DropTable(
                name: "FeaturedVideos");

            migrationBuilder.DropTable(
                name: "PromptInstructions");

            migrationBuilder.DropTable(
                name: "SiteSettings");

            migrationBuilder.DropTable(
                name: "Prompts");
        }
    }
}
