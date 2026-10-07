# Connect the RFP Tracker to Supabase

About 15 minutes. You need a GitHub login and nothing else. Supabase's free plan is enough.

## 1. Create the Supabase project

1. Go to https://supabase.com and click **Start your project**.
2. Click **Continue with GitHub** and approve. This makes your Supabase account.
3. If asked to create an organization: name it anything (for example your name), type **Personal**, plan **Free**. Click **Create organization**.
4. On **Create a new project**:
   - **Project name:** `rfp-tracker`
   - **Database password:** click **Generate a password**, then save it in your password manager. You won't need it for the app, but keep it.
   - **Region:** **Canada (Central)**.
   - Leave everything else as it is (keep **Enable Data API** switched on if you see it).
5. Click **Create new project** and wait a minute or two until the dashboard loads.

## 2. Create the tables

1. In the left sidebar, click **SQL Editor**.
2. Click **New query** (or the **+** button).
3. Open [`setup.sql`](setup.sql) in this folder on GitHub, click the **Copy raw file** button (two overlapping squares, top right of the file), and paste it into the editor.
4. Click **Run** (bottom right). You should see "Success. No rows returned".
5. Check it worked: in the left sidebar click **Table Editor**. You should see two tables, `rfps` and `activity_log`, both empty.

## 3. Copy the two values the app needs

1. Click **Connect** at the top of the page (or go to **Project Settings**, then **API Keys** and **Data API**).
2. Copy the **Project URL**. It looks like `https://abcdefghijkl.supabase.co`.
3. Copy the **Publishable key**. It starts with `sb_publishable_`. If you only see older keys, copy the one labelled **anon public** instead (a long string starting with `eyJ`).

**Never copy or share the `secret` key or the `service_role` key.** Those can bypass all security. The app does not need them.

## 4. Connect the app

Send both values to Claude in the project thread, and Claude will add them to the app. Or do it yourself:

1. On GitHub, open `index.html` and click the pencil icon (**Edit this file**).
2. Find these two lines near the start of the script (press Ctrl+F and search for `SUPABASE_URL`):
   ```js
   const SUPABASE_URL = "";
   const SUPABASE_KEY = "";
   ```
3. Paste your values between the quotes, click **Commit changes**, then **Commit changes** again.
4. Wait about a minute, then open https://jskson3.github.io/rfp-tracker . The badge at the top right should say **Saved to database** with a green dot. Your demo RFPs now appear in Supabase's **Table Editor**.

## Good to know

- **Is the publishable key safe to put in a public page?** Yes, it is designed for that. What it can do is decided by the row level security rules in `setup.sql`. For now they let any visitor read and change the demo data, which is fine because it is all made up. Logins come in a later step.
- **Free plan pauses after a week of no use.** If nobody opens the app for 7 days, Supabase pauses the project and emails you. Click **Restore project** in Supabase. Meanwhile the app keeps working from each visitor's browser copy and the badge says **Offline: saved in this browser**.
- **Reset to demo data** and **Delete all data** (on the Data & export screen) now act on the shared database, not just your browser.
