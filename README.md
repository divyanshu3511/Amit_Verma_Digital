# Amit Verma Digital 2.0 — Production ASP.NET Core MVC Platform

A complete, production-grade web platform and AI Prompt Library for digital creator **Amit Verma Digital 2.0** (Lucknow, UP, India — 39K+ community). Built using **ASP.NET Core MVC with C# on .NET 10**, **Neon PostgreSQL Free** with **Entity Framework Core 10 (Npgsql)**, a simplified **Single-Admin Cookie Authentication** system with modern PBKDF2 cryptographic password hashing, and Bootstrap 5 with a custom dark-navy glassmorphism design system.

---

## 🌟 Key Features

### 1. High-Performance Creator Homepage (`/`)
- **Design System**: Deep navy backgrounds (`#080C14`, `#0F172A`), electric blue & cyan accents (`#0F4CFF`, `#38BDF8`), vibrant yellow (`#FFD700`), and neon pink (`#FF2E6E`) with subtle dotted grid textures and glassmorphic cards.
- **Creator Imagery**: Utilizes real brand assets (Profile badge, wide cover banner, and portrait photo) with responsive aspect ratios and floating follower badges.
- **Hero Section**: Verified creator badge, location indicator (*Lucknow, Uttar Pradesh, India*), customizable follower counter display, and CTA buttons.
- **Creator Story / About**: Highlights Amit Verma's monetization milestones ($106+ payout proofs, 39K+ community), Facebook criteria unlock guidance, and mission statement.
- **8 Core Expertise Cards**: Facebook Reels Tips, Facebook Page Growth, Content Creation, Monetization Education, Hashtag Strategy, Engagement Improvement, Video Creation Tips, and AI Prompts.
- **Featured Prompt Reel**: Real-time database-driven prompts with instant copy buttons and modals.
- **Featured Video Showcase**: Embedded responsive YouTube video players configurable through the admin dashboard.
- **Social Media Links**: Configurable Facebook, Instagram, YouTube, and LinkedIn links.
- **Working Contact Form**: Validated server-side with honeypot bot trap and PostgreSQL persistence.
- **SEO & Legal**: Open Graph meta tags, Twitter card tags, `robots.txt`, `sitemap.xml`, and comprehensive Privacy Policy and Terms of Service.

### 2. Discoverable Prompt Library (`/Prompts`)
- **Discovery Engine**: Search prompts by title, description, category, and keywords.
- **Category Filter Pills**: Filter dynamically by Facebook Reels, Page Growth, Monetization, AI Prompts, Hook Strategy, etc.
- **Sort Control**: Order by Newest, Featured First, or Oldest.
- **Bilingual Interface**: Seamless Hindi (हिन्दी) and English language switcher that translates interface labels while preserving prompt content.
- **1-Click Copy Controls**:
  - `Copy Prompt`: Copies the prompt body.
  - `Copy Instructions`: Copies ordered step-by-step instructions.
  - `Copy Both`: Copies combined prompt and instructions.
  - Toast notification confirmation with checkmark.
- **Dedicated Details Page (`/Prompts/Details/{slug}`)**: Permanent canonical URLs for social sharing and bookmarking.

### 3. Simplified, High-Security Admin Dashboard (`/Admin`)
- **Single-Admin Authentication**: ASP.NET Core Identity removed in favor of a lean, hardened cookie authentication architecture (`CookieAuthenticationDefaults.AuthenticationScheme`).
- **Cryptographic Security**:
  - Admin credentials (`ADMIN_EMAIL`, `ADMIN_PASSWORD`) are loaded via environment variables or user secrets.
  - Configured password is immediately hashed into memory using **PBKDF2** (HMAC-SHA256, 100,000 iterations, 16-byte cryptographically secure salt, 32-byte key). Plaintext passwords are never stored in the database, configuration, or memory.
  - Constant-time verification (`CryptographicOperations.FixedTimeEquals`) protects against timing attacks.
  - In-memory rate limiting and account lockout (5 failed attempts trigger an automatic 15-minute lockout per IP).
  - Safe failure when unconfigured: If `ADMIN_EMAIL` or `ADMIN_PASSWORD` is unset, login fails safely with an informative configuration message and no secrets leaked.
- **Server-Side Route Protection**: Server-side authorization policy (`[Authorize(Roles = "Admin")]`) protects every admin controller and action. Unauthenticated requests automatically redirect to `/Account/Login?ReturnUrl=%2FAdmin`.
- **Live Database KPI Metrics**: Calculates real-time counts for Total Prompts, Live (Active), Scheduled (Future), Draft (Unpublished), Expired, and Unread Inquiries.
- **Prompt Management**:
  - Create, Edit, and Delete prompts with confirmation modal.
  - Unique slug validation and auto-generation.
  - Live publishing and featured status toggles.
  - **Dynamic Step-by-Step Instructions**: Add, edit, remove, and reorder steps up/down with sort order saved in a normalized PostgreSQL table with cascade deletion.
- **Timezone-Aware Scheduling (IST)**:
  - Admin inputs Start and End times in **India Standard Time (Asia/Kolkata, UTC+5:30)**.
  - Converted and stored in UTC in PostgreSQL.
  - Strict server-side visibility enforcement: Non-live prompts (drafts, future-scheduled, or expired) are **never** exposed to public visitors or direct URLs.
- **Site Settings & Ad Management**:
  - Manage brand name, tagline, category, location, and follower count display.
  - Upload profile avatars, cover banners, and portrait images directly to `wwwroot/images/uploads/`.
  - Configure social links and direct contact details.
  - **Up to Two Optional Ad Slots**: Disabled by default. Can be enabled with image URL, target URL, and alt text.
- **Featured Video Manager**: Add, reorder, and remove YouTube videos using full URLs or 11-char IDs.
- **Contact Inquiries Inbox**: View inquiries with sender details, IP address, timestamp in IST, mark as read, reply via mailto link, and delete.

---

## 🛠️ Technology Stack & Architecture

| Component | Technology | Description |
|---|---|---|
| **Framework** | ASP.NET Core MVC (C#) on .NET 10 LTS | Thin controllers, strongly-typed viewmodels, async operations |
| **Database** | Neon PostgreSQL Free | Cloud-native serverless PostgreSQL |
| **ORM & Driver** | EF Core 10 + `Npgsql.EntityFrameworkCore.PostgreSQL` | Fully async database access and schema migrations |
| **Authentication** | Custom Cookie Authentication | Single-administrator, PBKDF2 hashing, IP lockout protection |
| **Frontend UI** | Bootstrap 5, Custom CSS (`theme.css`, `admin.css`), Vanilla JS | Dark-navy glassmorphism design system |
| **Fonts** | Google Fonts (*Manrope*, *Sora*, *Noto Sans Devanagari*) | Optimized typography and Indian creator branding |
| **Testing** | xUnit, EF Core InMemory, Microsoft.NET.Test.Sdk | 45 comprehensive automated tests |

---

## 🚀 Configuration & First-Admin Setup

### Step 1: Configure Environment Variables

The application reads its database connection and admin credentials from environment variables (recommended for production and cloud hosting) or from `appsettings.json` / user secrets for local development.

#### Environment Variables (Production & Cloud Hosting)
```bash
# Neon PostgreSQL Connection String (obtain from your Neon Console)
ConnectionStrings__DefaultConnection="Host=ep-xyz-123456.us-east-2.aws.neon.tech;Database=neondb;Username=neondb_owner;Password=your_neon_password;SSL Mode=Require;Trust Server Certificate=true"

# Administrator Login Credentials
ADMIN_EMAIL="admin@amitvermadigital.com"
ADMIN_PASSWORD="YourStrongAdminPassword2026!"
```

#### Local Development via `dotnet user-secrets` (Optional)
```bash
cd AmitVermaDigital
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=ep-xyz-123456.us-east-2.aws.neon.tech;Database=neondb;Username=neondb_owner;Password=your_neon_password;SSL Mode=Require;Trust Server Certificate=true"
dotnet user-secrets set "ADMIN_EMAIL" "admin@amitvermadigital.com"
dotnet user-secrets set "ADMIN_PASSWORD" "YourStrongAdminPassword2026!"
```

> **Security Note:** Real database passwords and admin passwords must never be committed to git repository files.

---

## 🗄️ Database Migrations

The database migrations are built specifically for PostgreSQL using `Npgsql.EntityFrameworkCore.PostgreSQL`.

### Applying Migrations

#### Option A: Automatic at Startup
The application automatically inspects and applies any pending migrations when it starts up via `DbInitializer.InitializeAsync(context, logger)`. If the connection is verified, it safely ensures default site settings and featured demo prompts exist without resetting or dropping any existing user content.

#### Option B: Manual CLI Command
To apply migrations manually using the .NET EF CLI:
```bash
dotnet ef database update --project AmitVermaDigital
```

To generate a new migration after entity changes:
```bash
dotnet ef migrations add <MigrationName> --project AmitVermaDigital
```

---

## 💻 Running Locally

### 1. Build the Solution
```bash
dotnet build AmitVermaDigital.sln
```

### 2. Run the Web Application
```bash
dotnet run --project AmitVermaDigital --urls "http://localhost:5000"
```

Open your browser to:
- **Public Homepage**: [http://localhost:5000](http://localhost:5000)
- **Prompt Library**: [http://localhost:5000/Prompts](http://localhost:5000/Prompts)
- **Admin Login**: [http://localhost:5000/Account/Login](http://localhost:5000/Account/Login)
- **Admin Dashboard**: [http://localhost:5000/Admin](http://localhost:5000/Admin) *(redirects to login if unauthenticated)*

---

## 🧪 Automated Testing

A comprehensive suite of **45 unit and integration tests** is included in `AmitVermaDigital.Tests`:

```bash
dotnet test AmitVermaDigital.sln
```

### What is Tested:
1. **Admin Authorization & Route Security (`SecurityAndAccessTests.cs`)**:
   - Every admin controller (`Dashboard`, `Prompts`, `Settings`, `Videos`, `Messages`) enforces `[Authorize(Roles = "Admin")]`.
   - No admin controller action allows anonymous access (`[AllowAnonymous]`).
   - Public registration endpoints (`Register`, `SignUp`) are completely absent.
   - Unauthenticated visitors accessing admin routes are redirected to login.
   - Authenticated admins accessing the login page are redirected to the dashboard.
   - Logout enforces `[Authorize]`, clears the auth cookie, and redirects home.
2. **Cryptographic Authentication & PBKDF2 (`AdminAuthServiceTests.cs`)**:
   - PBKDF2 hash format validation (`PBKDF2$100000$<salt>$<key>`).
   - Constant-time password verification with correct and incorrect passwords.
   - Case-insensitive email handling.
   - Account lockout triggered after exactly 5 failed attempts (15-minute lock).
   - Successful login resets the failed attempts counter.
   - Missing `ADMIN_EMAIL` or `ADMIN_PASSWORD` fails safely without leaking secrets.
3. **Prompt Discovery & IST Scheduling (`PromptSchedulingTests.cs`)**:
   - Active prompts within valid date windows are displayed.
   - Draft prompts, future scheduled prompts, and expired prompts are strictly excluded from public listing and direct URL access.
   - Status calculation (`Live`, `Draft`, `Scheduled`, `Expired`) matches UTC boundaries.
4. **Prompt Management & Step Reordering (`PromptManagementTests.cs`)**:
   - Creating prompts saves ordered step-by-step instructions.
   - Editing prompts reorders, updates, and deletes instruction steps with sequence preservation.
   - Deleting a prompt cascades and cleans up child instructions.
5. **Site Settings & YouTube Media (`SiteSettingsAndVideosTests.cs`)**:
   - Site settings persistence, in-memory caching, and follower counter updates.
   - YouTube ID parser tests across full URLs, shorts, embed URLs, and 11-char IDs.
6. **Contact Form & Anti-Spam (`ContactFormTests.cs`)**:
   - Valid inquiries save to the database.
   - Honeypot bot traps reject bot submissions silently without database pollution.

**Actual Test Output**:
```
Passed! - Failed: 0, Passed: 45, Skipped: 0, Total: 45, Duration: 1 s - AmitVermaDigital.Tests.dll (net10.0)
```
