# Campaign Manager Platform

A full-stack platform for managing influencer campaigns.  
Built with **Next.js**, **tRPC**, **Supabase**, and **Drizzle ORM**.

Managers can register, add influencers, generate invite links, and assign them to campaigns.  
Influencers can onboard via the invite link and view their assigned campaigns.

---

## 📑 Table of Contents
- [Project Setup](#project-setup)
- [Supabase Configuration](#supabase-configuration)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Getting Started (Human-Friendly)](#getting-started-human-friendly)

---

## 🚀 Project Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mohammad-soqar/campaignmanagement.git
   cd campaignmanagement
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Setup environment variables**  
   Copy `.env.example` into `.env.local` and fill in your Supabase keys.

4. **Database setup**  
   The app uses Supabase (Postgres) with Drizzle ORM migrations.  
   Run:
   ```bash
   npm run db:push
   ```
   This will push your schema to Supabase.

5. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

---

## ⚙️ Supabase Configuration

1. Create a **Supabase project** at [https://supabase.com](https://supabase.com).
2. Enable **Email/Password Authentication**.
3. Copy your **Project URL** and **DATABASEURL** (Transaction pooler) and **Anon Key** (for client) + **Service Role Key** (for server).
4. Create the following tables (via migrations or manually):
   - `profiles` (user profiles: userId, role, status, fullName, …)
   - `influencers` (influencer roster, owned by managers)
   - `campaigns` (campaigns created by managers)
   - `campaignInfluencers` (link table: campaigns ↔ influencers)
   - `influencerInvites` (tokens for onboarding via invite link)

---

## 🔑 Environment Variables

Create a file named `.env.local` in your project root with:

```env
DATABASE_URL="postgresql://postgres.eycpcticwxjncuetgdaa:<YOURPASSWORD>@aws-1-eu-central-1.pooler.supabase.com:6543/postgres"
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# optional: Next.js config
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

⚠️ Do **not** share your Service Role Key publicly. Only use it in server code.

---

## 📜 Scripts

- **Run dev server**  
  ```bash
  npm run dev
  ```
  Runs both frontend (Next.js) and backend (tRPC API routes).
  
- **Database push**  
  ```bash
  npm run db:push
  ```

---

## 🎯 Getting Started (Human-Friendly)

### For Managers (the people running campaigns)

1. **Create your manager account**
   - Open the app and click **Register**.
   - Enter your display name + email + password.  
   - You’ll land in your dashboard as a **Manager**.

2. **Add influencers to your roster**
   - Go to **Influencers**.
   - Click **Add Influencer**, fill in their basic details (platform, handle, profile URL, follower count, engagement rate, optional avatar, and contact email).
   - After saving, you can generate an **Onboarding Link** for that influencer:
     - Click **Create link** on the influencer card.
     - A unique link appears (and you can copy it).  
     - Send this link directly to the influencer (WhatsApp, email, DM — your choice).

3. **Invite flow (what happens with the link)**
   - The **Onboarding Link** lets the influencer set a password and activate their account.
   - Because you created the roster and issued the invite, they’re **approved automatically**.
   - No extra approval step is needed; they can log in right away.

4. **Create a campaign**
   - Go to **Campaigns** → **Create**.
   - Give it a title, description (optional), budget, and start/end dates.

5. **Assign influencers to a campaign**
   - Open the campaign details page.
   - Use the **Select influencer** dropdown to add people from your roster.
   - They’re now officially **assigned** to that campaign.

---

### For Influencers (the people receiving invites)

1. **Get your invite link**
   - Your manager will send you a unique **Onboarding Link**.

2. **Set your password**
   - Open the link, confirm your email (pre-filled), and choose a password.
   - Your account is created and **approved** automatically.

3. **Log in**
   - Go to the app’s **Login** page and sign in with your email + password.

4. **See your campaigns**
   - Open **My Campaigns** to view all campaigns you’ve been assigned to:
     - See the title, dates, and description.
     - If something’s missing, contact your manager.

---

### Quick Tips
- **Managers** control the roster and campaigns.  
- **Influencers** only see campaigns assigned to them.  
- The **Onboarding Link** is one-time and time-limited. If it expires, managers can generate a new one.  
- Editing influencer details (handle, followers, etc.) is done by the **Manager** in the roster.  
