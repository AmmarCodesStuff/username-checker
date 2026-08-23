/* ============================================================
   Username-checker — script.js
   Sections:
   1.  Configuration (icons, platforms)
   2.  Validation
   3.  Platform-specific checkers (real, CORS-based verification)
   4.  Scan orchestration
   5.  Result normalization
   6.  UI rendering (category-grouped)
   7.  Filtering & sorting
   8.  Counters
   9.  Scroll-reveal animation
   10. Navigation
   11. Utilities
   12. Init
   ============================================================ */

(function () {
  "use strict";

  /* ============================================================
     1. CONFIGURATION
     ------------------------------------------------------------
     type: "api"    -> a real check runs against a public,
                        CORS-enabled endpoint. Any failure
                        (network / CORS / timeout / bad shape)
                        resolves to "unknown" — never "available".
     type: "manual" -> no reliable browser-side check exists.
                        Always "unknown" with a clear reason and
                        a canonical profile URL to verify by hand.
     ============================================================ */

  const ICONS = {
    generic: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M12 8v4l3 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    code: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none"><path d="M9 8l-4 4 4 4M15 8l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    camera: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none"><rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="13.5" r="3.3" stroke="currentColor" stroke-width="1.6"/><path d="M8 7l1.5-2.5h5L16 7" stroke="currentColor" stroke-width="1.6"/></svg>',
    play: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M10 8.5l6 3.5-6 3.5v-7Z" fill="currentColor"/></svg>',
    controller: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none"><rect x="2.5" y="8" width="19" height="9" rx="4" stroke="currentColor" stroke-width="1.6"/><path d="M8 10.5v4M6 12.5h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="16" cy="11" r="0.9" fill="currentColor"/><circle cx="18" cy="13" r="0.9" fill="currentColor"/></svg>',
    chat: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none"><path d="M4 5h16v11H8l-4 4V5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    music: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none"><path d="M9 18V5l11-2v13" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="6.5" cy="18" r="2.5" stroke="currentColor" stroke-width="1.6"/><circle cx="17.5" cy="16" r="2.5" stroke="currentColor" stroke-width="1.6"/></svg>',
    write: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none"><path d="M4 20l3.5-1L19 7.5a2 2 0 0 0 0-2.8l-.7-.7a2 2 0 0 0-2.8 0L4 15.5 3 20Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
    briefcase: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none"><rect x="3" y="8" width="18" height="12" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="1.6"/></svg>',
    palette: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none"><path d="M12 21a9 9 0 1 1 0-18 8 8 0 0 1 8 8c0 2-1.3 3-3 3h-2a2 2 0 0 0 0 4c0 1.6-1.3 3-3 3Z" stroke="currentColor" stroke-width="1.6"/></svg>',
    globe: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M3 12h18M12 3c2.5 2.5 3.8 5.6 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.6-3.8-9S9.5 5.5 12 3Z" stroke="currentColor" stroke-width="1.6"/></svg>',
    trophy: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none"><path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" stroke="currentColor" stroke-width="1.6"/><path d="M5 6H3v1a4 4 0 0 0 4 4M19 6h2v1a4 4 0 0 1-4 4" stroke="currentColor" stroke-width="1.6"/><path d="M12 13v3m-3 4h6m-3 0v-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    id: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.6"/><circle cx="9" cy="12" r="2" stroke="currentColor" stroke-width="1.6"/><path d="M14 10h5M14 14h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'
  };

  const CATEGORY_META = {
    social: { label: "Social", icon: ICONS.chat },
    gaming: { label: "Gaming", icon: ICONS.controller },
    developer: { label: "Developer", icon: ICONS.code },
    creative: { label: "Creative", icon: ICONS.palette },
    other: { label: "Other / Professional", icon: ICONS.id }
  };
  const CATEGORY_ORDER = ["social", "gaming", "developer", "creative", "other"];

  /* Each platform: { id, name, category, icon, type, url(username), check?, reason? } */
  const PLATFORMS = [
    // ---------------- SOCIAL ----------------
    { id: "instagram", name: "Instagram", category: "social", icon: ICONS.camera, type: "manual",
      url: u => `https://www.instagram.com/${encodeURIComponent(u)}/`,
      reason: "Instagram blocks unauthenticated cross-origin requests from browsers." },
    { id: "tiktok", name: "TikTok", category: "social", icon: ICONS.play, type: "manual",
      url: u => `https://www.tiktok.com/@${encodeURIComponent(u)}`,
      reason: "TikTok requires authentication and actively blocks automated checks." },
    { id: "facebook", name: "Facebook", category: "social", icon: ICONS.globe, type: "manual",
      url: u => `https://www.facebook.com/${encodeURIComponent(u)}`,
      reason: "Facebook blocks unauthenticated profile lookups from other origins." },
    { id: "x", name: "X / Twitter", category: "social", icon: ICONS.chat, type: "manual",
      url: u => `https://x.com/${encodeURIComponent(u)}`,
      reason: "X's public API requires authentication for username lookups." },
    { id: "youtube", name: "YouTube", category: "social", icon: ICONS.play, type: "manual",
      url: u => `https://www.youtube.com/@${encodeURIComponent(u)}`,
      reason: "YouTube's Data API requires a registered key and quota." },
    { id: "reddit", name: "Reddit", category: "social", icon: ICONS.chat, type: "manual",
      url: u => `https://www.reddit.com/user/${encodeURIComponent(u)}/`,
      reason: "Reddit's public JSON endpoint blocks most cross-origin browser requests." },
    { id: "snapchat", name: "Snapchat", category: "social", icon: ICONS.chat, type: "manual",
      url: u => `https://www.snapchat.com/add/${encodeURIComponent(u)}`,
      reason: "Snapchat does not expose public profile data to browsers." },
    { id: "pinterest", name: "Pinterest", category: "social", icon: ICONS.camera, type: "manual",
      url: u => `https://www.pinterest.com/${encodeURIComponent(u)}/`,
      reason: "No CORS-enabled public lookup is exposed." },
    { id: "linkedin", name: "LinkedIn", category: "social", icon: ICONS.briefcase, type: "manual",
      url: u => `https://www.linkedin.com/in/${encodeURIComponent(u)}`,
      reason: "LinkedIn requires authentication for any profile access." },
    { id: "telegram", name: "Telegram", category: "social", icon: ICONS.chat, type: "manual",
      url: u => `https://t.me/${encodeURIComponent(u)}`,
      reason: "Telegram's web preview blocks cross-origin JavaScript requests." },
    { id: "bluesky", name: "Bluesky", category: "social", icon: ICONS.chat, type: "api",
      url: u => `https://bsky.app/profile/${encodeURIComponent(u)}${u.includes(".") ? "" : ".bsky.social"}`,
      check: checkBluesky },
    { id: "mastodon", name: "Mastodon", category: "social", icon: ICONS.chat, type: "api",
      url: u => `https://mastodon.social/@${encodeURIComponent(u)}`,
      check: checkMastodon },
    { id: "threads", name: "Threads", category: "social", icon: ICONS.chat, type: "manual",
      url: u => `https://www.threads.net/@${encodeURIComponent(u)}`,
      reason: "Threads shares Instagram's authentication requirements." },
    { id: "medium", name: "Medium", category: "social", icon: ICONS.write, type: "manual",
      url: u => `https://medium.com/@${encodeURIComponent(u)}`,
      reason: "Medium blocks unauthenticated cross-origin profile requests." },

    // ---------------- GAMING ----------------
    { id: "twitch", name: "Twitch", category: "gaming", icon: ICONS.play, type: "manual",
      url: u => `https://www.twitch.tv/${encodeURIComponent(u)}`,
      reason: "Twitch's Helix API requires OAuth app credentials." },
    { id: "steam", name: "Steam", category: "gaming", icon: ICONS.controller, type: "manual",
      url: u => `https://steamcommunity.com/id/${encodeURIComponent(u)}`,
      reason: "Steam's profile API requires a registered key and server-side calls." },
    { id: "roblox", name: "Roblox", category: "gaming", icon: ICONS.controller, type: "manual",
      url: u => `https://www.roblox.com/user.aspx?username=${encodeURIComponent(u)}`,
      reason: "Roblox's user-lookup API blocks unauthenticated cross-origin requests." },
    { id: "minecraft", name: "Minecraft", category: "gaming", icon: ICONS.controller, type: "manual",
      url: u => `https://namemc.com/search?q=${encodeURIComponent(u)}`,
      reason: "Mojang's public name-lookup endpoint is deprecated and heavily rate-limited." },
    { id: "epic", name: "Epic Games", category: "gaming", icon: ICONS.controller, type: "manual",
      url: u => `https://www.epicgames.com/id/${encodeURIComponent(u)}`,
      reason: "Epic's account API requires authentication." },
    { id: "xbox", name: "Xbox", category: "gaming", icon: ICONS.controller, type: "manual",
      url: u => `https://xboxgamertag.com/search/${encodeURIComponent(u)}`,
      reason: "Microsoft's gamertag API requires authenticated app credentials." },
    { id: "playstation", name: "PlayStation", category: "gaming", icon: ICONS.controller, type: "manual",
      url: u => `https://psnprofiles.com/${encodeURIComponent(u)}`,
      reason: "Sony does not expose a public, CORS-enabled profile lookup." },
    { id: "battlenet", name: "Battle.net", category: "gaming", icon: ICONS.controller, type: "manual",
      url: u => `https://battle.net/`,
      reason: "Battle.net has no public per-username profile URL to check." },
    { id: "discord", name: "Discord", category: "gaming", icon: ICONS.chat, type: "manual",
      url: u => `https://discord.com/users/${encodeURIComponent(u)}`,
      reason: "Discord profiles are looked up by numeric ID, not username, and require a bot token." },
    { id: "itchio", name: "itch.io", category: "gaming", icon: ICONS.controller, type: "manual",
      url: u => `https://${encodeURIComponent(u)}.itch.io`,
      reason: "itch.io does not provide a public browser-checkable endpoint." },

    // ---------------- DEVELOPER ----------------
    { id: "github", name: "GitHub", category: "developer", icon: ICONS.code, type: "api",
      url: u => `https://github.com/${encodeURIComponent(u)}`,
      check: checkGitHub },
    { id: "gitlab", name: "GitLab", category: "developer", icon: ICONS.code, type: "api",
      url: u => `https://gitlab.com/${encodeURIComponent(u)}`,
      check: checkGitLab },
    { id: "bitbucket", name: "Bitbucket", category: "developer", icon: ICONS.code, type: "manual",
      url: u => `https://bitbucket.org/${encodeURIComponent(u)}/`,
      reason: "Bitbucket Cloud's public API does not reliably expose CORS headers for browser lookups." },
    { id: "devto", name: "Dev.to", category: "developer", icon: ICONS.write, type: "api",
      url: u => `https://dev.to/${encodeURIComponent(u)}`,
      check: checkDevTo },
    { id: "codepen", name: "CodePen", category: "developer", icon: ICONS.code, type: "manual",
      url: u => `https://codepen.io/${encodeURIComponent(u)}`,
      reason: "CodePen does not expose a public, CORS-enabled username lookup." },
    { id: "stackoverflow", name: "Stack Overflow", category: "developer", icon: ICONS.code, type: "api",
      url: u => `https://stackoverflow.com/users?tab=Reputation&filter=all&search=${encodeURIComponent(u)}`,
      check: checkStackExchange("stackoverflow") },
    { id: "stackexchange", name: "Stack Exchange", category: "developer", icon: ICONS.code, type: "api",
      url: u => `https://stackexchange.com/users?tab=reputation&filter=all&search=${encodeURIComponent(u)}`,
      check: checkStackExchange("stackexchange") },
    { id: "hackerrank", name: "HackerRank", category: "developer", icon: ICONS.trophy, type: "manual",
      url: u => `https://www.hackerrank.com/profile/${encodeURIComponent(u)}`,
      reason: "HackerRank does not expose a public, CORS-enabled profile check." },
    { id: "leetcode", name: "LeetCode", category: "developer", icon: ICONS.trophy, type: "manual",
      url: u => `https://leetcode.com/${encodeURIComponent(u)}/`,
      reason: "LeetCode's API requires POST requests and blocks cross-origin access." },
    { id: "kaggle", name: "Kaggle", category: "developer", icon: ICONS.trophy, type: "manual",
      url: u => `https://www.kaggle.com/${encodeURIComponent(u)}`,
      reason: "Kaggle requires authentication for profile API access." },
    { id: "codeberg", name: "Codeberg", category: "developer", icon: ICONS.code, type: "manual",
      url: u => `https://codeberg.org/${encodeURIComponent(u)}`,
      reason: "Codeberg's Gitea instance does not reliably send CORS headers for browser requests." },
    { id: "npm", name: "npm", category: "developer", icon: ICONS.code, type: "api",
      url: u => `https://www.npmjs.com/~${encodeURIComponent(u)}`,
      check: checkNpm },

    // ---------------- CREATIVE ----------------
    { id: "behance", name: "Behance", category: "creative", icon: ICONS.palette, type: "manual",
      url: u => `https://www.behance.net/${encodeURIComponent(u)}`,
      reason: "Adobe's Behance API requires an authenticated key." },
    { id: "dribbble", name: "Dribbble", category: "creative", icon: ICONS.palette, type: "manual",
      url: u => `https://dribbble.com/${encodeURIComponent(u)}`,
      reason: "Dribbble blocks unauthenticated cross-origin lookups." },
    { id: "vimeo", name: "Vimeo", category: "creative", icon: ICONS.play, type: "manual",
      url: u => `https://vimeo.com/${encodeURIComponent(u)}`,
      reason: "Vimeo's API requires an OAuth access token." },
    { id: "soundcloud", name: "SoundCloud", category: "creative", icon: ICONS.music, type: "manual",
      url: u => `https://soundcloud.com/${encodeURIComponent(u)}`,
      reason: "SoundCloud's API requires a registered client ID." },
    { id: "producthunt", name: "Product Hunt", category: "creative", icon: ICONS.briefcase, type: "manual",
      url: u => `https://www.producthunt.com/@${encodeURIComponent(u)}`,
      reason: "Product Hunt requires authenticated GraphQL API access." },
    { id: "letterboxd", name: "Letterboxd", category: "creative", icon: ICONS.play, type: "manual",
      url: u => `https://letterboxd.com/${encodeURIComponent(u)}/`,
      reason: "No public CORS-enabled lookup is available." },
    { id: "artstation", name: "ArtStation", category: "creative", icon: ICONS.palette, type: "manual",
      url: u => `https://www.artstation.com/${encodeURIComponent(u)}`,
      reason: "ArtStation blocks unauthenticated cross-origin profile requests." },
    { id: "flickr", name: "Flickr", category: "creative", icon: ICONS.camera, type: "manual",
      url: u => `https://www.flickr.com/people/${encodeURIComponent(u)}`,
      reason: "Flickr's API requires a registered application key." },

    // ---------------- OTHER / PROFESSIONAL ----------------
    { id: "keybase", name: "Keybase", category: "other", icon: ICONS.id, type: "api",
      url: u => `https://keybase.io/${encodeURIComponent(u)}`,
      check: checkKeybase },
    { id: "linktree", name: "Linktree", category: "other", icon: ICONS.globe, type: "manual",
      url: u => `https://linktr.ee/${encodeURIComponent(u)}`,
      reason: "Linktree does not expose a public, CORS-enabled username check." },
    { id: "gravatar", name: "Gravatar", category: "other", icon: ICONS.id, type: "manual",
      url: u => `https://gravatar.com/${encodeURIComponent(u)}`,
      reason: "Gravatar profile slugs aren't guaranteed to match the account username, so a positive/negative result can't be trusted." },
    { id: "aboutme", name: "About.me", category: "other", icon: ICONS.id, type: "manual",
      url: u => `https://about.me/${encodeURIComponent(u)}`,
      reason: "About.me does not expose a public, CORS-enabled lookup." }
  ];

  /* ============================================================
     2. VALIDATION
     ============================================================ */

  const USERNAME_PATTERN = /^[a-zA-Z0-9._-]{2,30}$/;

  function validateUsername(raw) {
    const value = (raw || "").trim();
    if (!value) return { ok: false, message: "Enter a username to check." };
    if (value.length < 2) return { ok: false, message: "Username must be at least 2 characters." };
    if (value.length > 30) return { ok: false, message: "Username must be 30 characters or fewer." };
    if (!USERNAME_PATTERN.test(value)) {
      return { ok: false, message: "Only letters, numbers, dots, underscores and hyphens are allowed." };
    }
    return { ok: true, value };
  }

  /* ============================================================
     3. PLATFORM-SPECIFIC CHECKERS
     ------------------------------------------------------------
     Each returns "available" | "taken", or throws. The caller
     (runCheck) converts ANY thrown error into "unknown" — a
     failed request is never treated as proof of availability.
     ============================================================ */

  function withTimeout(promise, ms) {
    return Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms))
    ]);
  }

  // GitHub REST API — public, CORS-enabled. 404 = no such user.
  async function checkGitHub(username) {
    const res = await withTimeout(fetch(`https://api.github.com/users/${encodeURIComponent(username)}`), 8000);
    if (res.status === 404) return "available";
    if (res.ok) return "taken";
    throw new Error("unexpected status " + res.status);
  }

  // GitLab REST API — public, CORS-enabled. Empty array = no match.
  async function checkGitLab(username) {
    const res = await withTimeout(fetch(`https://gitlab.com/api/v4/users?username=${encodeURIComponent(username)}`), 8000);
    if (!res.ok) throw new Error("bad status " + res.status);
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? "taken" : "available";
  }

  // npm registry user document — 404 if the account doesn't exist.
  async function checkNpm(username) {
    const res = await withTimeout(fetch(`https://registry.npmjs.org/-/user/org.couchdb.user:${encodeURIComponent(username)}`), 8000);
    if (res.status === 404) return "available";
    if (res.ok) return "taken";
    throw new Error("unexpected status " + res.status);
  }

  // Dev.to public API — 404 if the username isn't registered.
  async function checkDevTo(username) {
    const res = await withTimeout(fetch(`https://dev.to/api/users/by_username?url=${encodeURIComponent(username)}`), 8000);
    if (res.status === 404) return "available";
    if (res.ok) return "taken";
    throw new Error("unexpected status " + res.status);
  }

  // Keybase lookup API — public, used by their own web client cross-origin.
  async function checkKeybase(username) {
    const res = await withTimeout(fetch(`https://keybase.io/_/api/1.0/user/lookup.json?username=${encodeURIComponent(username)}`), 8000);
    if (!res.ok) throw new Error("bad status " + res.status);
    const data = await res.json();
    const found = !!(data && data.them && ((Array.isArray(data.them) && data.them.length > 0) || (!Array.isArray(data.them) && data.them !== null)));
    return found ? "taken" : "available";
  }

  // Mastodon (mastodon.social instance) account lookup API — public, CORS-enabled.
  async function checkMastodon(username) {
    const res = await withTimeout(fetch(`https://mastodon.social/api/v1/accounts/lookup?acct=${encodeURIComponent(username)}`), 8000);
    if (res.status === 404) return "available";
    if (res.ok) return "taken";
    throw new Error("unexpected status " + res.status);
  }

  // AT Protocol (Bluesky) public handle resolver — public, CORS-enabled.
  async function checkBluesky(username) {
    const handle = username.includes(".") ? username : `${username}.bsky.social`;
    const res = await withTimeout(fetch(`https://public.api.bsky.app/xrpc/com.atproto.identity.resolveHandle?handle=${encodeURIComponent(handle)}`), 8000);
    if (res.status === 400 || res.status === 404) return "available";
    if (res.ok) return "taken";
    throw new Error("unexpected status " + res.status);
  }

  // Stack Exchange API — public, CORS-enabled `filter=all` responses.
  // NOTE: matches by display name (inname), which is the closest reliable
  // public signal available; an exact-name match is treated as Taken.
  function checkStackExchange(site) {
    return async function (username) {
      const res = await withTimeout(
        fetch(`https://api.stackexchange.com/2.3/users?order=desc&sort=reputation&inname=${encodeURIComponent(username)}&site=${site === "stackexchange" ? "stackoverflow" : site}`),
        8000
      );
      if (!res.ok) throw new Error("bad status " + res.status);
      const data = await res.json();
      if (!data || !Array.isArray(data.items)) throw new Error("unexpected shape");
      const exact = data.items.some(item => (item.display_name || "").toLowerCase() === username.toLowerCase());
      return exact ? "taken" : "available";
    };
  }

  async function runCheck(platform, username) {
    if (platform.type !== "api") {
      return { status: "unknown", reason: platform.reason || "This platform can't be reliably checked from a browser." };
    }
    try {
      const status = await platform.check(username);
      return { status, reason: null };
    } catch (err) {
      return { status: "unknown", reason: "The request was blocked, rate-limited, or timed out (CORS/network)." };
    }
  }

  /* ============================================================
     4 + 5. SCAN ORCHESTRATION & RESULT NORMALIZATION
     ============================================================ */

  const els = {};

  function cacheEls() {
    els.form = document.getElementById("searchForm");
    els.input = document.getElementById("usernameInput");
    els.hint = document.getElementById("inputHint");
    els.checkBtn = document.getElementById("checkBtn");
    els.exampleChip = document.querySelector(".example-chip");

    els.scanStatus = document.getElementById("scanStatus");
    els.scanStatusText = document.getElementById("scanStatusText");
    els.scanBarFill = document.getElementById("scanBarFill");
    els.scanCategoryRow = document.getElementById("scanCategoryRow");

    els.dashboard = document.getElementById("resultsDashboard");
    els.placeholder = document.getElementById("checkerPlaceholder");
    els.resultUsername = document.getElementById("resultUsername");
    els.statTotal = document.getElementById("statTotal");
    els.statAvailable = document.getElementById("statAvailable");
    els.statTaken = document.getElementById("statTaken");
    els.statUnknown = document.getElementById("statUnknown");
    els.categoryResults = document.getElementById("categoryResults");
    els.emptyMsg = document.getElementById("emptyFilterMsg");
    els.platformFilter = document.getElementById("platformFilter");
    els.sortSelect = document.getElementById("sortSelect");

    els.platformCategories = document.getElementById("platformCategories");
    els.platformCount = document.getElementById("platformCount");
    els.platformCountEyebrow = document.getElementById("platformCountEyebrow");
  }

  const STATUS_META = {
    available: { label: "Available", icon: "✓", class: "status-available" },
    taken: { label: "Taken", icon: "●", class: "status-taken" },
    unknown: { label: "Unable to verify", icon: "?", class: "status-unknown" }
  };

  let currentResults = []; // { platform, username, status, reason, url }
  let activeStatusFilter = "all";
  let activeCategoryFilter = "all";
  let scanToken = 0;

  async function performScan(username) {
    const myToken = ++scanToken;

    els.placeholder.hidden = true;
    els.dashboard.hidden = true;
    els.scanStatus.hidden = false;
    els.checkBtn.disabled = true;

    els.resultUsername.textContent = username;
    currentResults = [];
    activeStatusFilter = "all";
    activeCategoryFilter = "all";
    resetFilterChips();

    const total = PLATFORMS.length;
    let done = 0;

    els.scanStatusText.textContent = "Preparing username scan…";
    els.scanBarFill.style.width = "0%";
    renderScanCategoryRow("pending");

    await sleep(250); // let "preparing" register before checks begin — not a fake result delay, purely UI pacing
    if (myToken !== scanToken) return;

    els.scanStatusText.textContent = `Checking ${total} platforms…`;

    const categoryDone = Object.fromEntries(CATEGORY_ORDER.map(c => [c, 0]));
    const categoryTotal = Object.fromEntries(CATEGORY_ORDER.map(c => [c, PLATFORMS.filter(p => p.category === c).length]));

    const CONCURRENCY = 6;
    const queue = PLATFORMS.slice();
    const results = [];

    async function worker() {
      while (queue.length) {
        const platform = queue.shift();
        const outcome = await runCheck(platform, username);
        if (myToken !== scanToken) return; // superseded by a newer search
        done++;
        categoryDone[platform.category]++;
        results.push({
          platform,
          username,
          status: outcome.status,
          reason: outcome.reason,
          url: platform.url(username)
        });
        const pct = Math.round((done / total) * 100);
        els.scanBarFill.style.width = pct + "%";
        els.scanStatusText.textContent = `${done} / ${total} checked`;
        renderScanCategoryRow(null, categoryDone, categoryTotal);
      }
    }

    const workers = Array.from({ length: CONCURRENCY }, worker);
    await Promise.all(workers);

    if (myToken !== scanToken) return;

    els.scanStatusText.textContent = "Scan complete";
    currentResults = results;
    await sleep(200);
    if (myToken !== scanToken) return;

    els.scanStatus.hidden = true;
    els.dashboard.hidden = false;
    els.checkBtn.disabled = false;
    updateStats();
    renderCategoryResults();
  }

  function renderScanCategoryRow(mode, categoryDone, categoryTotal) {
    els.scanCategoryRow.innerHTML = CATEGORY_ORDER.map(cat => {
      const meta = CATEGORY_META[cat];
      let stateClass = "";
      let text = "Waiting…";
      if (mode === "pending") {
        text = "Waiting…";
      } else if (categoryDone && categoryTotal) {
        const d = categoryDone[cat], t = categoryTotal[cat];
        if (t === 0) return "";
        if (d === 0) { text = "Waiting…"; }
        else if (d < t) { text = `Checking… ${d}/${t}`; stateClass = "is-active"; }
        else { text = `Done · ${t}/${t}`; stateClass = "is-done"; }
      }
      return `<span class="scan-category-pill ${stateClass}"><span class="cat-dot"></span>${meta.label}: ${text}</span>`;
    }).join("");
  }

  function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  function resetFilterChips() {
    document.querySelectorAll(".filter-chip[data-filter]").forEach(chip => {
      chip.classList.toggle("is-active", chip.dataset.filter === "all");
    });
    document.querySelectorAll(".filter-chip[data-category]").forEach(chip => {
      chip.classList.toggle("is-active", chip.dataset.category === "all");
    });
  }

  /* ============================================================
     6. RENDERING — category-grouped results
     ============================================================ */

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function defaultExplain(status, platform) {
    if (status === "available") return `${platform.name} reliably indicates that no public profile exists for this username.`;
    if (status === "taken") return `A public profile using this username was confirmed on ${platform.name}.`;
    return `${platform.name} can't be reliably checked from a browser-only app.`;
  }

  function buildCard(entry, index) {
    const card = document.createElement("div");
    card.className = "result-card";
    card.style.animationDelay = Math.min(index * 22, 500) + "ms";
    card.dataset.status = entry.status;
    card.dataset.category = entry.platform.category;
    card.dataset.name = entry.platform.name.toLowerCase();

    const meta = STATUS_META[entry.status];
    const linkLabel = entry.status === "unknown" ? "Check Manually" : (entry.status === "taken" ? "View Profile" : `Check ${entry.platform.name}`);
    const modeLabel = entry.platform.type === "api" ? "Automatic" : "Manual";

    card.innerHTML = `
      <div class="result-card-top">
        <span class="result-icon">${entry.platform.icon}</span>
        <div class="result-titles">
          <div class="result-platform">${escapeHtml(entry.platform.name)}</div>
          <div class="result-uname">${escapeHtml(entry.username)}</div>
        </div>
        <span class="result-mode">${modeLabel}</span>
      </div>
      <span class="status-badge ${meta.class}">${meta.icon} ${meta.label}</span>
      <p class="result-explain">${escapeHtml(entry.reason || defaultExplain(entry.status, entry.platform))}</p>
      <div class="result-actions">
        <a class="btn btn-ghost" href="${entry.url}" target="_blank" rel="noopener noreferrer">${linkLabel} →</a>
      </div>
    `;
    return card;
  }

  function updateStats() {
    const total = currentResults.length;
    const available = currentResults.filter(r => r.status === "available").length;
    const taken = currentResults.filter(r => r.status === "taken").length;
    const unknown = currentResults.filter(r => r.status === "unknown").length;
    els.statTotal.textContent = total;
    els.statAvailable.textContent = available;
    els.statTaken.textContent = taken;
    els.statUnknown.textContent = unknown;
  }

  function sortResults(list) {
    const sorted = list.slice();
    const val = els.sortSelect.value;
    if (val === "alpha") {
      sorted.sort((a, b) => a.platform.name.localeCompare(b.platform.name));
    } else if (val === "taken" || val === "available" || val === "unknown") {
      const order = { taken: ["taken", "available", "unknown"], available: ["available", "taken", "unknown"], unknown: ["unknown", "taken", "available"] }[val];
      sorted.sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status));
    }
    return sorted;
  }

  function renderCategoryResults() {
    els.categoryResults.innerHTML = "";
    const filterText = (els.platformFilter.value || "").toLowerCase().trim();
    let totalVisible = 0;

    CATEGORY_ORDER.forEach(cat => {
      const meta = CATEGORY_META[cat];
      const all = currentResults.filter(r => r.platform.category === cat);
      if (!all.length) return;

      const categoryMatchesFilter = activeCategoryFilter === "all" || activeCategoryFilter === cat;
      const list = sortResults(all);

      const block = document.createElement("div");
      block.className = "category-block";

      const taken = all.filter(r => r.status === "taken").length;
      const available = all.filter(r => r.status === "available").length;
      const unknown = all.filter(r => r.status === "unknown").length;

      const grid = document.createElement("div");
      grid.className = "results-grid";

      let visibleInCategory = 0;
      list.forEach((entry, i) => {
        const matchesStatus = activeStatusFilter === "all" || entry.status === activeStatusFilter;
        const matchesText = !filterText || entry.platform.name.toLowerCase().includes(filterText);
        const card = buildCard(entry, i);
        const isVisible = categoryMatchesFilter && matchesStatus && matchesText;
        if (!isVisible) card.classList.add("is-hidden");
        else { visibleInCategory++; totalVisible++; }
        grid.appendChild(card);
      });

      block.innerHTML = `
        <div class="category-block-head">
          <span class="category-block-title"><span class="cat-icon">${meta.icon}</span>${meta.label}</span>
          <span class="category-block-summary"><b>${taken}</b> taken · <b>${available}</b> available · <b>${unknown}</b> unknown</span>
        </div>
      `;
      block.appendChild(grid);
      if (visibleInCategory === 0) block.classList.add("is-empty");
      els.categoryResults.appendChild(block);
    });

    els.emptyMsg.hidden = totalVisible !== 0;
  }

  /* ============================================================
     7. FILTER / SORT WIRING
     ============================================================ */

  function wireControls() {
    document.querySelectorAll(".filter-chip[data-filter]").forEach(chip => {
      chip.addEventListener("click", () => {
        document.querySelectorAll(".filter-chip[data-filter]").forEach(c => c.classList.remove("is-active"));
        chip.classList.add("is-active");
        activeStatusFilter = chip.dataset.filter;
        renderCategoryResults();
      });
    });

    document.querySelectorAll(".filter-chip[data-category]").forEach(chip => {
      chip.addEventListener("click", () => {
        document.querySelectorAll(".filter-chip[data-category]").forEach(c => c.classList.remove("is-active"));
        chip.classList.add("is-active");
        activeCategoryFilter = chip.dataset.category;
        renderCategoryResults();
      });
    });

    els.platformFilter.addEventListener("input", debounce(renderCategoryResults, 150));
    els.sortSelect.addEventListener("change", renderCategoryResults);
  }

  function debounce(fn, ms) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  }

  /* ============================================================
     Form + example chip wiring
     ============================================================ */

  function wireForm() {
    els.form.addEventListener("submit", e => {
      e.preventDefault();
      const result = validateUsername(els.input.value);
      if (!result.ok) {
        els.hint.textContent = result.message;
        els.hint.classList.add("is-error");
        els.input.focus();
        return;
      }
      els.hint.textContent = "2–30 characters · letters, numbers, dots, underscores, hyphens";
      els.hint.classList.remove("is-error");
      performScan(result.value);
    });

    els.input.addEventListener("input", () => {
      if (els.hint.classList.contains("is-error")) {
        els.hint.textContent = "2–30 characters · letters, numbers, dots, underscores, hyphens";
        els.hint.classList.remove("is-error");
      }
    });

    if (els.exampleChip) {
      els.exampleChip.addEventListener("click", () => {
        els.input.value = els.exampleChip.dataset.example;
        els.input.focus();
        els.form.requestSubmit ? els.form.requestSubmit() : els.form.dispatchEvent(new Event("submit", { cancelable: true }));
      });
    }
  }

  /* ============================================================
     Platforms directory section
     ============================================================ */

  function renderPlatformDirectory() {
    els.platformCategories.innerHTML = "";

    CATEGORY_ORDER.forEach(cat => {
      const items = PLATFORMS.filter(p => p.category === cat);
      if (!items.length) return;
      const meta = CATEGORY_META[cat];
      const block = document.createElement("div");
      block.className = "platform-category";
      block.innerHTML = `
        <div class="platform-category-head">
          <span class="platform-category-title">${meta.label}</span>
          <span class="platform-category-count">${items.length} platforms</span>
        </div>
        <div class="platform-chip-row">
          ${items.map(p => `
            <span class="platform-chip" title="${p.type === "api" ? "Automatic live check" : "Manual verification"}">
              <span class="${p.type === "api" ? "live-dot" : "manual-dot"}"></span>
              ${p.icon}
              <span>${escapeHtml(p.name)}</span>
            </span>
          `).join("")}
        </div>
      `;
      els.platformCategories.appendChild(block);
    });

    els.platformCount.textContent = PLATFORMS.length;
    els.platformCountEyebrow.textContent = PLATFORMS.length;
  }

  /* ============================================================
     8. SCROLL REVEAL
     ============================================================ */

  function wireReveal() {
    const targets = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) {
      targets.forEach(t => t.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });
    targets.forEach(t => observer.observe(t));
  }

  /* ============================================================
     9. NAVIGATION
     ============================================================ */

  function wireNav() {
    const toggle = document.getElementById("navToggle");
    const mobileNav = document.getElementById("mobileNav");
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      mobileNav.classList.toggle("is-open", !open);
    });
    mobileNav.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        mobileNav.classList.remove("is-open");
      });
    });
  }

  /* ============================================================
     10. INIT
     ============================================================ */

  document.addEventListener("DOMContentLoaded", () => {
    cacheEls();
    document.getElementById("year").textContent = new Date().getFullYear();
    wireNav();
    wireForm();
    wireControls();
    wireReveal();
    renderPlatformDirectory();
  });
})();
