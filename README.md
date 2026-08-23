# Username-checker

Check whether a username appears to be available or already taken across a range of popular platforms — directly in your browser, with no backend and no account required.

**[Live demo →](#)** *(update this link once deployed to GitHub Pages)*

---

## What this is (and isn't)

Username-checker is a static HTML/CSS/JS site. For each platform it either:

- **Live-checks** it, by calling a public, CORS-enabled endpoint the platform itself exposes (e.g. GitHub's or GitLab's public API), or
- **Cannot check it**, because the platform blocks cross-origin browser requests, requires authentication, or has no public username-lookup endpoint — in which case the app is honest about that and gives you a one-click link to check manually.

This is a deliberate design decision. A browser-only, static site **cannot** reliably query most major platforms (Instagram, TikTok, X, LinkedIn, Steam, etc.) — they block it. Any tool that claims otherwise from pure client-side JavaScript is either lying to you or silently guessing. **Username-checker never reports "Available" unless a request actually succeeded and confirmed it.**

## Features

- 40 supported platforms across Developer, Social, Gaming, and Creative categories
- Real, live checks for platforms with public APIs (GitHub, GitLab, npm, Dev.to, Keybase, Mastodon, Bluesky)
- Transparent "Unable to verify" status — with the reason — for everything else
- Filter by status (Available / Taken / Unknown), category, or platform name
- Sort results by status or name
- Progressive, staggered result loading with live progress stats
- Subtle interactive particle background (pauses on hidden tabs, respects `prefers-reduced-motion`)
- Fully responsive, keyboard-navigable, and screen-reader friendly
- Zero dependencies, zero build step, zero backend

## Supported platforms

| Category | Platforms |
|---|---|
| **Developer** | GitHub*, GitLab*, npm*, Dev.to*, Keybase*, CodePen, Stack Overflow, HashNode, Replit, Product Hunt |
| **Social** | Instagram, TikTok, X / Twitter, Facebook, Reddit, Pinterest, Snapchat, LinkedIn, Telegram, Threads, Mastodon*, Bluesky* |
| **Gaming** | Steam, Minecraft, Roblox, Twitch, Xbox Gamertag, Chess.com, itch.io |
| **Creative** | Behance, Dribbble, Vimeo, SoundCloud, Spotify, Letterboxd, YouTube, Medium, 500px |

`*` = live, real-time check via a public API. All others are labeled **Unable to verify** and link out for a manual check.

## Limitations

- **CORS.** Most platforms don't send the headers required for a browser on a different origin to read their responses — this is a security feature of the web platform, not a bug here.
- **Live checks can still be wrong.** A username marked "Taken" a moment ago could be released; a suspended, renamed, or reserved account can produce a misleading result. Always verify anything important directly on the platform.
- **Rate limits.** Some of the live-checked APIs (GitHub in particular) apply per-IP rate limits to unauthenticated requests. If you check many usernames quickly, GitHub's result may itself fall back to "Unknown".
- **No guarantee of completeness.** This isn't an attempt to cover "every platform on the internet" — it's 40 popular ones, chosen for relevance and, where possible, technical feasibility.

## Deploying to GitHub Pages

1. Push this repository to GitHub.
2. Open the repository on GitHub and go to **Settings**.
3. In the sidebar, open **Pages**.
4. Under **Build and deployment**, set **Source** to "Deploy from a branch", choose the `main` branch and the `/ (root)` folder, then save.
5. GitHub will build and deploy the site — this can take a minute or two.
6. Open the generated GitHub Pages URL (shown at the top of the Pages settings page once deployment finishes).

No build tools, no `npm install`, no server — just static files.

## Project structure

```
username-checker/
│
├── index.html
├── style.css
├── script.js
├── README.md
│
└── assets/
    └── favicon.svg
```

`script.js` is organized into clearly separated sections: platform configuration, validation, the checking engine, DOM rendering, filter/sort wiring, scroll-reveal animation, and the background canvas.

## Adding a platform

Every platform is a single object in the `PLATFORMS` array near the top of `script.js`:

```js
{
  name: "GitHub",
  category: "developer",       // social | gaming | developer | creative
  icon: ICONS.code,             // reuse an existing icon or add a new one to ICONS
  type: "api",                  // "api" for a real check, "manual" otherwise
  url: u => `https://github.com/${u}`,
  check: apiCheckGitHub         // only required when type is "api"
}
```

To add a **live** check, write an `async` function that:

1. Calls a public, CORS-enabled endpoint for that platform.
2. Returns the string `"available"` or `"taken"`.
3. Throws on anything else — the app automatically converts any thrown error into an honest `"unknown"` result, so you never need to handle failure explicitly.

To add a **manual-only** entry (the honest default for platforms without a public browser-checkable endpoint), set `type: "manual"` and provide a short `reason` string explaining why it can't be checked automatically.

## Future backend / API possibilities

The architecture is intentionally modular so a backend can be dropped in later without touching the UI:

- Swap any `type: "manual"` platform to `type: "api"` and point `check` at your own server-side proxy (a small serverless function can bypass CORS entirely by making the request server-side).
- A batch endpoint could replace the per-platform `fetch` calls with a single request, if you want to reduce round-trips.
- Because every result already flows through the same `{ status, reason }` shape, the rendering, filtering, and stats code needs no changes either way.

## Privacy

- All checks run client-side, in your browser, sent directly from your device to each platform (or not sent at all, for manual-only platforms).
- This project has no backend and no database — nothing you search is logged, stored, or transmitted anywhere by this interface.
- No account, sign-in, or personal information is required to use it.

## License

Open source — use, modify, and redistribute freely. Add a `LICENSE` file (MIT is a reasonable default) before publishing if you need an explicit license.
