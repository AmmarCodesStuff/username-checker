/* ============================================================
   Username-checker — script.js
   Structure:
   1. Platform configuration
   2. Validation utilities
   3. Checking engine (real API checks + honest "unknown" fallback)
   4. Rendering / DOM
   5. Filtering & sorting
   6. Scroll reveal animations
   7. Background canvas (particle field)
   8. Init
   ============================================================ */

(function () {
  "use strict";

  /* ============================================================
     1. PLATFORM CONFIGURATION
     ------------------------------------------------------------
     type: "api"    -> we attempt a real, CORS-friendly request.
                        Any failure (network/CORS/timeout) resolves
                        to "unknown", never "available".
     type: "manual" -> platform cannot be reliably checked from a
                        static browser app. Always "unknown", with
                        a clear reason and a link to verify by hand.

     To add a platform: push a new object into PLATFORMS. That's it —
     everything else (rendering, filtering, stats) picks it up
     automatically.
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
    globe: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M3 12h18M12 3c2.5 2.5 3.8 5.6 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.6-3.8-9S9.5 5.5 12 3Z" stroke="currentColor" stroke-width="1.6"/></svg>'
  };

  const PLATFORMS = [
    // ---------- developer ----------
    { name: "GitHub", category: "developer", icon: ICONS.code, type: "api",
      url: u => `https://github.com/${u}`,
      check: apiCheckGitHub },
    { name: "GitLab", category: "developer", icon: ICONS.code, type: "api",
      url: u => `https://gitlab.com/${u}`,
      check: apiCheckGitLab },
    { name: "npm", category: "developer", icon: ICONS.code, type: "api",
      url: u => `https://www.npmjs.com/~${u}`,
      check: apiCheckNpm },
    { name: "Dev.to", category: "developer", icon: ICONS.write, type: "api",
      url: u => `https://dev.to/${u}`,
      check: apiCheckDevTo },
    { name: "Keybase", category: "developer", icon: ICONS.code, type: "api",
      url: u => `https://keybase.io/${u}`,
      check: apiCheckKeybase },
    { name: "CodePen", category: "developer", icon: ICONS.code, type: "manual",
      url: u => `https://codepen.io/${u}`, reason: "CodePen does not expose a public, CORS-enabled username lookup." },
    { name: "Stack Overflow", category: "developer", icon: ICONS.code, type: "manual",
      url: u => `https://stackoverflow.com/users/${u}`, reason: "Stack Overflow profiles are indexed by numeric ID, not username, so a direct lookup isn't reliable." },
    { name: "HashNode", category: "developer", icon: ICONS.write, type: "manual",
      url: u => `https://hashnode.com/@${u}`, reason: "No public, CORS-enabled endpoint is available for browser checks." },
    { name: "Replit", category: "developer", icon: ICONS.code, type: "manual",
      url: u => `https://replit.com/@${u}`, reason: "Replit blocks cross-origin profile requests." },
    { name: "Product Hunt", category: "developer", icon: ICONS.briefcase, type: "manual",
      url: u => `https://www.producthunt.com/@${u}`, reason: "Requires authenticated API access." },

    // ---------- social ----------
    { name: "Instagram", category: "social", icon: ICONS.camera, type: "manual",
      url: u => `https://instagram.com/${u}`, reason: "Instagram blocks unauthenticated cross-origin requests." },
    { name: "TikTok", category: "social", icon: ICONS.play, type: "manual",
      url: u => `https://www.tiktok.com/@${u}`, reason: "TikTok requires authentication and blocks automated checks." },
    { name: "X / Twitter", category: "social", icon: ICONS.chat, type: "manual",
      url: u => `https://x.com/${u}`, reason: "X's public API requires authentication for username lookups." },
    { name: "Facebook", category: "social", icon: ICONS.globe, type: "manual",
      url: u => `https://facebook.com/${u}`, reason: "Facebook blocks unauthenticated profile lookups." },
    { name: "Reddit", category: "social", icon: ICONS.chat, type: "manual",
      url: u => `https://reddit.com/user/${u}`, reason: "Reddit's public JSON endpoint blocks most cross-origin browser requests." },
    { name: "Pinterest", category: "social", icon: ICONS.camera, type: "manual",
      url: u => `https://pinterest.com/${u}`, reason: "No CORS-enabled public lookup is available." },
    { name: "Snapchat", category: "social", icon: ICONS.chat, type: "manual",
      url: u => `https://www.snapchat.com/add/${u}`, reason: "Snapchat does not expose public profile data to browsers." },
    { name: "LinkedIn", category: "social", icon: ICONS.briefcase, type: "manual",
      url: u => `https://www.linkedin.com/in/${u}`, reason: "LinkedIn requires authentication for any profile access." },
    { name: "Telegram", category: "social", icon: ICONS.chat, type: "manual",
      url: u => `https://t.me/${u}`, reason: "Telegram's web preview blocks cross-origin JavaScript requests." },
    { name: "Threads", category: "social", icon: ICONS.chat, type: "manual",
      url: u => `https://www.threads.net/@${u}`, reason: "Threads shares Instagram's authentication requirements." },
    { name: "Mastodon", category: "social", icon: ICONS.chat, type: "api",
      url: u => `https://mastodon.social/@${u}`,
      check: apiCheckMastodon },
    { name: "Bluesky", category: "social", icon: ICONS.chat, type: "api",
      url: u => `https://bsky.app/profile/${u}.bsky.social`,
      check: apiCheckBluesky },

    // ---------- gaming ----------
    { name: "Steam", category: "gaming", icon: ICONS.controller, type: "manual",
      url: u => `https://steamcommunity.com/id/${u}`, reason: "Steam's profile API requires a registered key and server-side calls." },
    { name: "Minecraft", category: "gaming", icon: ICONS.controller, type: "manual",
      url: u => `https://namemc.com/search?q=${u}`, reason: "Mojang's public lookup endpoint is deprecated and heavily rate-limited." },
    { name: "Roblox", category: "gaming", icon: ICONS.controller, type: "manual",
      url: u => `https://www.roblox.com/user.aspx?username=${u}`, reason: "Roblox's user API blocks unauthenticated cross-origin requests." },
    { name: "Twitch", category: "gaming", icon: ICONS.play, type: "manual",
      url: u => `https://twitch.tv/${u}`, reason: "Twitch's Helix API requires OAuth credentials." },
    { name: "Xbox Gamertag", category: "gaming", icon: ICONS.controller, type: "manual",
      url: u => `https://xboxgamertag.com/search/${u}`, reason: "Microsoft's gamertag API requires authentication." },
    { name: "Chess.com", category: "gaming", icon: ICONS.controller, type: "manual",
      url: u => `https://www.chess.com/member/${u}`, reason: "No CORS-enabled lookup is currently exposed." },
    { name: "itch.io", category: "gaming", icon: ICONS.controller, type: "manual",
      url: u => `https://${u}.itch.io`, reason: "itch.io does not provide a public browser-checkable endpoint." },

    // ---------- creative ----------
    { name: "Behance", category: "creative", icon: ICONS.palette, type: "manual",
      url: u => `https://www.behance.net/${u}`, reason: "Adobe's Behance API requires an authenticated key." },
    { name: "Dribbble", category: "creative", icon: ICONS.palette, type: "manual",
      url: u => `https://dribbble.com/${u}`, reason: "Dribbble blocks unauthenticated cross-origin lookups." },
    { name: "Vimeo", category: "creative", icon: ICONS.play, type: "manual",
      url: u => `https://vimeo.com/${u}`, reason: "Vimeo's API requires an access token." },
    { name: "SoundCloud", category: "creative", icon: ICONS.music, type: "manual",
      url: u => `https://soundcloud.com/${u}`, reason: "SoundCloud's API requires a registered client ID." },
    { name: "Spotify", category: "creative", icon: ICONS.music, type: "manual",
      url: u => `https://open.spotify.com/user/${u}`, reason: "Spotify profile data requires OAuth." },
    { name: "Letterboxd", category: "creative", icon: ICONS.play, type: "manual",
      url: u => `https://letterboxd.com/${u}`, reason: "No public CORS-enabled lookup is available." },
    { name: "YouTube", category: "creative", icon: ICONS.play, type: "manual",
      url: u => `https://www.youtube.com/@${u}`, reason: "YouTube's Data API requires an API key and quota." },
    { name: "Medium", category: "creative", icon: ICONS.write, type: "manual",
      url: u => `https://medium.com/@${u}`, reason: "Medium blocks unauthenticated cross-origin profile requests." },
    { name: "500px", category: "creative", icon: ICONS.camera, type: "manual",
      url: u => `https://500px.com/p/${u}`, reason: "500px's API requires a registered consumer key." }
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
     3. CHECKING ENGINE — real API checks
     ------------------------------------------------------------
     Every check function returns one of "available" | "taken" | "unknown".
     Any thrown error / network failure / CORS block is caught by the
     caller and mapped to "unknown" — never "available".
     ============================================================ */

  function withTimeout(promise, ms) {
    return Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms))
    ]);
  }

  async function apiCheckGitHub(username) {
    const res = await withTimeout(fetch(`https://api.github.com/users/${encodeURIComponent(username)}`), 7000);
    if (res.status === 404) return "available";
    if (res.ok) return "taken";
    throw new Error("unexpected status " + res.status);
  }

  async function apiCheckGitLab(username) {
    const res = await withTimeout(fetch(`https://gitlab.com/api/v4/users?username=${encodeURIComponent(username)}`), 7000);
    if (!res.ok) throw new Error("bad status");
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? "taken" : "available";
  }

  async function apiCheckNpm(username) {
    const res = await withTimeout(fetch(`https://registry.npmjs.org/-/user/org.couchdb.user:${encodeURIComponent(username)}`), 7000);
    if (res.status === 404) return "available";
    if (res.ok) return "taken";
    throw new Error("unexpected status " + res.status);
  }

  async function apiCheckDevTo(username) {
    const res = await withTimeout(fetch(`https://dev.to/api/users/by_username?url=${encodeURIComponent(username)}`), 7000);
    if (res.status === 404) return "available";
    if (res.ok) return "taken";
    throw new Error("unexpected status " + res.status);
  }

  async function apiCheckKeybase(username) {
    const res = await withTimeout(fetch(`https://keybase.io/_/api/1.0/user/lookup.json?username=${encodeURIComponent(username)}`), 7000);
    if (!res.ok) throw new Error("bad status");
    const data = await res.json();
    const found = data && data.them && ((Array.isArray(data.them) && data.them.length > 0) || (!Array.isArray(data.them) && data.them !== null));
    return found ? "taken" : "available";
  }

  async function apiCheckMastodon(username) {
    const res = await withTimeout(fetch(`https://mastodon.social/api/v1/accounts/lookup?acct=${encodeURIComponent(username)}`), 7000);
    if (res.status === 404) return "available";
    if (res.ok) return "taken";
    throw new Error("unexpected status " + res.status);
  }

  async function apiCheckBluesky(username) {
    const handle = username.includes(".") ? username : `${username}.bsky.social`;
    const res = await withTimeout(fetch(`https://public.api.bsky.app/xrpc/com.atproto.identity.resolveHandle?handle=${encodeURIComponent(handle)}`), 7000);
    if (res.status === 400 || res.status === 404) return "available";
    if (res.ok) return "taken";
    throw new Error("unexpected status " + res.status);
  }

  async function runCheck(platform, username) {
    if (platform.type !== "api") {
      return { status: "unknown", reason: platform.reason || "This platform can't be reliably checked from a browser." };
    }
    try {
      const status = await platform.check(username);
      return { status, reason: null };
    } catch (err) {
      return { status: "unknown", reason: "The request was blocked or timed out (CORS, network, or rate limit)." };
    }
  }

  /* ============================================================
     4. RENDERING
     ============================================================ */

  const els = {};

  function cacheEls() {
    els.form = document.getElementById("searchForm");
    els.input = document.getElementById("usernameInput");
    els.hint = document.getElementById("inputHint");
    els.checkBtn = document.getElementById("checkBtn");
    els.scanStatus = document.getElementById("scanStatus");
    els.scanStatusText = document.getElementById("scanStatusText");
    els.scanBarFill = document.getElementById("scanBarFill");
    els.dashboard = document.getElementById("resultsDashboard");
    els.placeholder = document.getElementById("checkerPlaceholder");
    els.resultUsername = document.getElementById("resultUsername");
    els.statTotal = document.getElementById("statTotal");
    els.statAvailable = document.getElementById("statAvailable");
    els.statTaken = document.getElementById("statTaken");
    els.statUnknown = document.getElementById("statUnknown");
    els.grid = document.getElementById("resultsGrid");
    els.emptyMsg = document.getElementById("emptyFilterMsg");
    els.platformFilter = document.getElementById("platformFilter");
    els.sortSelect = document.getElementById("sortSelect");
    els.platformCategories = document.getElementById("platformCategories");
    els.platformCount = document.getElementById("platformCount");
  }

  const STATUS_META = {
    available: { label: "Available", icon: "✓", class: "status-available" },
    taken: { label: "Taken", icon: "●", class: "status-taken" },
    unknown: { label: "Unable to verify", icon: "?", class: "status-unknown" },
    checking: { label: "Checking…", icon: "…", class: "status-checking" }
  };

  let currentResults = []; // { platform, status, reason, url }
  let activeStatusFilter = "all";
  let activeCategoryFilter = "all";

  function buildCard(entry, index) {
    const card = document.createElement("div");
    card.className = "result-card";
    card.style.animationDelay = Math.min(index * 28, 600) + "ms";
    card.dataset.status = entry.status;
    card.dataset.category = entry.platform.category;
    card.dataset.name = entry.platform.name.toLowerCase();

    const meta = STATUS_META[entry.status];
    const linkLabel = entry.status === "unknown" ? "Verify manually" : (entry.status === "taken" ? "View profile" : "Open " + entry.platform.name);

    card.innerHTML = `
      <div class="result-card-top">
        <span class="result-icon">${entry.platform.icon}</span>
        <div class="result-titles">
          <div class="result-platform">${escapeHtml(entry.platform.name)}</div>
          <div class="result-uname">${escapeHtml(entry.username)}</div>
        </div>
      </div>
      <span class="status-badge ${meta.class}">${meta.icon} ${meta.label}</span>
      <p class="result-explain">${escapeHtml(entry.reason || defaultExplain(entry.status, entry.platform))}</p>
      <div class="result-actions">
        <a class="btn btn-ghost" href="${entry.url}" target="_blank" rel="noopener">${linkLabel}</a>
      </div>
    `;
    return card;
  }

  function defaultExplain(status, platform) {
    if (status === "available") return `No public profile was found for this username on ${platform.name}.`;
    if (status === "taken") return `A public profile using this username already exists on ${platform.name}.`;
    return `${platform.name} can't be reliably checked from a browser-only app.`;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function updateStats() {
    const total = currentResults.length;
    const available = currentResults.filter(r => r.status === "available").length;
    const taken = currentResults.filter(r => r.status === "taken").length;
    const unknown = currentResults.filter(r => r.status === "unknown").length;
    animateCount(els.statTotal, total);
    animateCount(els.statAvailable, available);
    animateCount(els.statTaken, taken);
    animateCount(els.statUnknown, unknown);
  }

  function animateCount(el, target) {
    const current = parseInt(el.textContent, 10) || 0;
    if (current === target) return;
    el.textContent = target;
  }

  function renderGrid() {
    els.grid.innerHTML = "";
    let visibleCount = 0;
    const filterText = (els.platformFilter.value || "").toLowerCase().trim();

    let list = currentResults.slice();
    if (els.sortSelect.value === "status") {
      const order = { taken: 0, available: 1, unknown: 2, checking: 3 };
      list.sort((a, b) => order[a.status] - order[b.status]);
    } else if (els.sortSelect.value === "name") {
      list.sort((a, b) => a.platform.name.localeCompare(b.platform.name));
    }

    list.forEach((entry, i) => {
      const matchesStatus = activeStatusFilter === "all" || entry.status === activeStatusFilter;
      const matchesCategory = activeCategoryFilter === "all" || entry.platform.category === activeCategoryFilter;
      const matchesText = !filterText || entry.platform.name.toLowerCase().includes(filterText);
      const card = buildCard(entry, i);
      if (!(matchesStatus && matchesCategory && matchesText)) {
        card.classList.add("is-hidden");
      } else {
        visibleCount++;
      }
      els.grid.appendChild(card);
    });

    els.emptyMsg.hidden = visibleCount !== 0;
  }

  /* ============================================================
     Orchestration: run the scan
     ============================================================ */

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

    els.scanStatusText.textContent = `Checking ${total} platforms…`;
    els.scanBarFill.style.width = "0%";

    const CONCURRENCY = 6;
    const queue = PLATFORMS.slice();
    const results = [];

    async function worker() {
      while (queue.length) {
        const platform = queue.shift();
        const outcome = await runCheck(platform, username);
        if (myToken !== scanToken) return; // superseded by a newer search
        done++;
        results.push({
          platform,
          username,
          status: outcome.status,
          reason: outcome.reason,
          url: platform.url(username)
        });
        const pct = Math.round((done / total) * 100);
        els.scanBarFill.style.width = pct + "%";
        els.scanStatusText.textContent = `${done} checked · ${total - done} remaining`;
      }
    }

    const workers = Array.from({ length: CONCURRENCY }, worker);
    await Promise.all(workers);

    if (myToken !== scanToken) return;

    currentResults = results;
    els.scanStatus.hidden = true;
    els.dashboard.hidden = false;
    els.checkBtn.disabled = false;
    updateStats();
    renderGrid();
  }

  function resetFilterChips() {
    document.querySelectorAll(".filter-chip[data-filter]").forEach(chip => {
      chip.classList.toggle("is-active", chip.dataset.filter === "all");
    });
    document.querySelectorAll(".filter-chip[data-category]").forEach(chip => {
      chip.classList.toggle("is-active", chip.dataset.category === "all");
    });
  }

  /* ============================================================
     5. FILTER / SORT WIRING
     ============================================================ */

  function wireControls() {
    document.querySelectorAll(".filter-chip[data-filter]").forEach(chip => {
      chip.addEventListener("click", () => {
        document.querySelectorAll(".filter-chip[data-filter]").forEach(c => c.classList.remove("is-active"));
        chip.classList.add("is-active");
        activeStatusFilter = chip.dataset.filter;
        renderGrid();
      });
    });

    document.querySelectorAll(".filter-chip[data-category]").forEach(chip => {
      chip.addEventListener("click", () => {
        document.querySelectorAll(".filter-chip[data-category]").forEach(c => c.classList.remove("is-active"));
        chip.classList.add("is-active");
        activeCategoryFilter = chip.dataset.category;
        renderGrid();
      });
    });

    els.platformFilter.addEventListener("input", debounce(renderGrid, 150));
    els.sortSelect.addEventListener("change", renderGrid);
  }

  function debounce(fn, ms) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  }

  /* ============================================================
     Form wiring
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
      els.hint.textContent = "Letters, numbers, dots, underscores and hyphens · 2–30 characters";
      els.hint.classList.remove("is-error");
      performScan(result.value);
    });

    els.input.addEventListener("input", () => {
      if (els.hint.classList.contains("is-error")) {
        els.hint.textContent = "Letters, numbers, dots, underscores and hyphens · 2–30 characters";
        els.hint.classList.remove("is-error");
      }
    });
  }

  /* ============================================================
     Platforms directory section
     ============================================================ */

  function renderPlatformDirectory() {
    const categories = ["social", "gaming", "developer", "creative"];
    const labels = { social: "Social", gaming: "Gaming", developer: "Developer", creative: "Creative" };
    els.platformCategories.innerHTML = "";

    categories.forEach(cat => {
      const items = PLATFORMS.filter(p => p.category === cat);
      if (!items.length) return;
      const block = document.createElement("div");
      block.className = "platform-category";
      block.innerHTML = `
        <div class="platform-category-title">${labels[cat]}</div>
        <div class="platform-chip-row">
          ${items.map(p => `
            <span class="platform-chip">
              ${p.type === "api" ? '<span class="live-dot" title="Live check available"></span>' : ""}
              ${p.icon}
              <span>${escapeHtml(p.name)}</span>
            </span>
          `).join("")}
        </div>
      `;
      els.platformCategories.appendChild(block);
    });

    els.platformCount.textContent = PLATFORMS.length + "+";
  }

  /* ============================================================
     6. SCROLL REVEAL
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
     Header mobile nav
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
     7. BACKGROUND CANVAS — lightweight particle field
     ------------------------------------------------------------
     Subtle, low particle count, pauses on hidden tab, respects
     reduced-motion, and gracefully no-ops if canvas is unavailable.
     ============================================================ */

  function initBackground() {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas || !canvas.getContext) return;
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = canvas.getContext("2d");
    let w, h, dpr;
    let particles = [];
    let mouse = { x: 0, y: 0, active: false };
    let scrollY = 0;
    let rafId = null;
    let visible = true;

    const COUNT = window.innerWidth < 700 ? 34 : 60;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.width = window.innerWidth * dpr;
      h = canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    }

    function initParticles() {
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: (Math.random() * 1.4 + 0.5) * dpr,
        vx: (Math.random() - 0.5) * 0.12 * dpr,
        vy: (Math.random() - 0.5) * 0.12 * dpr,
        o: Math.random() * 0.5 + 0.15
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);

      const parallax = Math.min(scrollY * 0.04, 60) * dpr;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy - 0.02 * dpr;

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140 * dpr) {
            const force = (140 * dpr - dist) / (140 * dpr) * 0.04;
            p.x += dx * force;
            p.y += dy * force;
          }
        }

        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < -parallax) p.y = h + parallax;
        if (p.y > h + parallax) p.y = -parallax;

        ctx.beginPath();
        ctx.arc(p.x, p.y - parallax, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124,140,248,${p.o})`;
        ctx.fill();
      }

      // faint connecting lines for nearby particles
      ctx.lineWidth = 1 * dpr;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110 * dpr) {
            ctx.strokeStyle = `rgba(124,140,248,${0.08 * (1 - dist / (110 * dpr))})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y - parallax);
            ctx.lineTo(b.x, b.y - parallax);
            ctx.stroke();
          }
        }
      }
    }

    function loop() {
      if (!visible) return;
      draw();
      rafId = requestAnimationFrame(loop);
    }

    resize();
    initParticles();

    if (reduceMotion) {
      draw(); // static single frame
      return;
    }

    loop();

    window.addEventListener("resize", debounce(() => {
      resize();
      initParticles();
    }, 200));

    window.addEventListener("scroll", () => { scrollY = window.scrollY; }, { passive: true });

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX * dpr;
      mouse.y = e.clientY * dpr;
      mouse.active = true;
    }, { passive: true });

    window.addEventListener("mouseleave", () => { mouse.active = false; });

    document.addEventListener("visibilitychange", () => {
      visible = document.visibilityState === "visible";
      if (visible) loop();
      else if (rafId) cancelAnimationFrame(rafId);
    });
  }

  /* ============================================================
     8. INIT
     ============================================================ */

  document.addEventListener("DOMContentLoaded", () => {
    cacheEls();
    document.getElementById("year").textContent = new Date().getFullYear();
    wireNav();
    wireForm();
    wireControls();
    wireReveal();
    renderPlatformDirectory();
    initBackground();
  });
})();
