# Turn on AI drafting (Gemini)

About 10 minutes. Free. You need your Google account and your Vercel login.

**How it works:** on any RFP, the **Ask the ... agent (Gemini)** button sends only that RFP's intake answers and current stage to a small piece of server code on Vercel ([`draft.js`](draft.js)). The server builds the prompt for that stage's AI agent ([`agents.js`](../agents.js)), calls Google Gemini with a secret key, and sends back the draft. The key never appears in the page, so visitors can't see or copy it.

## 1. Get a free Gemini key

1. Go to https://aistudio.google.com/apikey and sign in with your Google account.
2. Accept the terms if asked, then click **Create API key**. If asked for a project, pick the default one or let it create one.
3. Copy the key (a long string). Keep it private: don't paste it in chat, in GitHub or anywhere else but Vercel.

**Do not add billing** to this Google project. Without billing it stays on the free tier, so the worst a stranger could do is use up the daily free quota. It can never cost you money.

## 2. Add the key to Vercel

1. Open https://vercel.com, click your **rfp-tracker** project, then **Settings** > **Environment Variables**.
2. **Key:** `GEMINI_API_KEY`. **Value:** paste your key. Leave all environments ticked. Click **Save**.
3. Go to the **Deployments** tab. On the top deployment, click the three dots (**...**) and then **Redeploy**. New settings only take effect after a redeploy.

## 3. Check it works

1. Open https://rfp-tracker-swart.vercel.app, then go to **RFP register** and open any RFP.
2. Click the **Ask the ... agent (Gemini)** button. After a few seconds, a draft appears. What it drafts depends on the stage: the Intake agent checks the request, the Requirements agent drafts requirements, and so on.
3. The same button works on the GitHub Pages copy, because it calls the Vercel server too.

## Good to know

- **Sample data only.** Google may use what you send on the free tier to improve its products. This app holds only made-up data, so that's fine. Never use it with real company or customer details.
- **If the free quota runs out**, the app says so. Try again a minute later, or the next day for the daily limit.
- **Changing the model:** it uses `gemini-3.5-flash-lite` by default. To try another free model, add a second environment variable `GEMINI_MODEL` (for example `gemini-3.8-flash`) and redeploy.
- **Turning it off:** delete the `GEMINI_API_KEY` variable and redeploy. The button then says AI isn't switched on, and the "Copy AI prompt" button still works.
