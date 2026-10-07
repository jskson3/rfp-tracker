# Turn on logins

About 10 minutes, all in the Supabase dashboard. Do this after the logins change is merged.

**How it works:** anyone can open the demo and try everything as a **guest**, but a guest's changes stay in their own browser and reset when they reload. Only **editors** (people you create an account for) can save to the shared database. The database itself enforces this with row level security, so nobody can get around it by editing the page.

## 1. Stop strangers from creating accounts

1. Open your project at https://supabase.com/dashboard.
2. In the left sidebar click **Authentication**, then **Sign In / Providers** (on some screens it is under **Configuration**).
3. Under **User Signups**, switch **Allow new users to sign up** off. Click **Save changes**.
4. Further down, check that **Email** is enabled (it is by default).

## 2. Create your editor account

1. Still in **Authentication**, click **Users**.
2. Click **Add user**, then **Create new user**.
3. Enter your email and a new password (save it in your password manager). Leave **Auto Confirm User** ticked, so no confirmation email is needed.
4. Click **Create user**.

Repeat for anyone else you want as an editor. You can delete a user here any time.

## 3. Update the security rules

1. In the left sidebar click **SQL Editor**, then **New query**.
2. Open [`setup.sql`](setup.sql) on GitHub, click **Copy raw file**, paste it in and click **Run**. You should see "Success. No rows returned". Your data is kept; only the rules change.

## 4. Check it works

1. Open https://jskson3.github.io/rfp-tracker . The badge at the top right says **Guest: changes stay in this browser**.
2. Click **Sign in to edit**, enter the email and password from step 2. The badge turns to **Saved to database** with a green dot.
3. Open the site in a private (incognito) window. You are a guest there. Change something, then reload: your change is gone, and the signed-in window never saw it.

## Good to know

- **Approvals still use the "Acting as" menu.** Signing in decides who may save; it doesn't yet decide which role you are. Roles linked to accounts can come later.
- **Emails stay private.** The audit log records the role, not your email, because every visitor can read the log.
- **The audit log can't be edited.** Editors can add log entries but not change or delete them. Deleting an RFP still removes its log entries.
- **Forgot your password?** In **Authentication > Users**, open your user's menu (three dots) and set a new one, or delete the user and create it again.
