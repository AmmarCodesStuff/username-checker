# 🔎 Username Checker

<p align="center">
  <img src="./assets/hero-preview.png" alt="Username Checker — Premium username discovery platform" width="100%">
</p>

<p align="center">
  <strong>Discover your username across the web.</strong>
</p>

<p align="center">
  A modern, privacy-conscious username discovery tool for social media, gaming, developer, creator, and community platforms.
</p>

<p align="center">

<a href="https://github.com/AmmarCodesStuff/username-checker">
<img src="https://img.shields.io/badge/GitHub-AmmarCodesStuff-111827?style=for-the-badge&logo=github" alt="GitHub">
</a>
<a href="https://github.com/AmmarCodesStuff/username-checker">
<img src="https://img.shields.io/github/stars/AmmarCodesStuff/username-checker?style=for-the-badge&logo=github&label=Stars" alt="GitHub Stars">
</a>
<a href="https://github.com/AmmarCodesStuff/username-checker/blob/main/LICENSE">
<img src="https://img.shields.io/badge/License-MIT-111827?style=for-the-badge" alt="MIT License">
</a>
<a href="https://pages.github.com/">
<img src="https://img.shields.io/badge/Deploy-GitHub%20Pages-111827?style=for-the-badge&logo=github" alt="GitHub Pages">
</a>

</p>

---

## ✦ About

**Username Checker** is an open-source web application designed to make username discovery faster, easier, and more transparent.

Instead of manually opening dozens of websites and searching for the same username repeatedly, enter a username once and get a centralized overview of where that username appears to be:

* 🟢 **Available**
* 🔴 **Taken**
* 🟡 **Unknown / Unable to verify**

The project combines a premium interface with a modular platform-checking system designed to work with a static GitHub Pages deployment.

> **One username. Multiple platforms. One clean search.**

---

## 🚀 Why Username Checker?

Your username is part of your digital identity.

Whether you're:

* 🎮 Creating a gaming identity
* 💻 Building a developer brand
* 🎨 Starting a creator account
* 📱 Choosing a social-media handle
* 🚀 Launching a project
* 🌐 Building a personal brand
* 🔍 Researching username availability

Username Checker gives you a single place to investigate where a username may already exist.

---

# 🔍 How It Works

Enter a username such as:

```text
a24f
```

Username Checker validates the input and begins checking supported platforms independently.

```text
                 ┌──────────────────┐
                 │     USERNAME      │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │    VALIDATION    │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │ PLATFORM SCANNER │
                 └────────┬─────────┘
                          │
                 ┌────────┼────────┐
                 ▼        ▼        ▼
             AVAILABLE  TAKEN    UNKNOWN
                 │        │        │
                 └────────┼────────┘
                          ▼
                 ┌──────────────────┐
                 │ RESULT DASHBOARD │
                 └──────────────────┘
```

Each platform is handled independently.

If one platform cannot be checked, it should not prevent other platforms from being analyzed.

---

# 📊 Result System

Username Checker deliberately uses three result states.

|      Status      | Meaning                                     |
| :--------------: | ------------------------------------------- |
| 🟢 **Available** | No matching public profile was detected     |
|   🔴 **Taken**   | A matching public profile was detected      |
|  🟡 **Unknown**  | The platform could not be reliably verified |

### ⚠️ Important

**Unknown does NOT mean Available.**

This distinction is essential because many platforms prevent automated browser requests.

---

# 🌐 Supported Platform Categories

Username Checker is designed to support a broad range of platforms.

### 📱 Social

`Instagram` · `TikTok` · `X` · `Reddit` · `Facebook` · `Snapchat` · `Pinterest`

### 🎮 Gaming

`Minecraft` · `Roblox` · `Steam` · `Twitch`

### 💻 Developer

`GitHub` · `GitLab` · `Dev.to` · `Stack Overflow` · `CodePen`

### 🎨 Creator

`Behance` · `Dribbble` · `Vimeo` · `SoundCloud`

### 💬 Community

`Discord` · `Telegram` · `Mastodon` · `Bluesky`

The platform architecture is modular, allowing additional services to be added without rebuilding the entire application.

---

# ✨ Premium Interface

Username Checker is intentionally designed to avoid the typical cheap utility-site appearance.

The interface focuses on:

* Refined typography
* Deep graphite surfaces
* Subtle navy tones
* Layered depth
* Sophisticated cards
* Soft shadows
* Subtle glass effects
* Interactive backgrounds
* 3D-inspired depth
* Smooth transitions
* Responsive layouts
* Professional micro-interactions

The design philosophy is:

> **Utility underneath. Product experience on top.**

---

# 🌌 Interactive Visual System

The interface uses subtle visual movement rather than overwhelming effects.

Possible effects include:

* Interactive background elements
* Mouse-responsive depth
* Scroll-based transitions
* 3D-inspired objects
* Animated result cards
* Progressive scan animations
* Subtle particle systems
* Smooth section reveals

The visual layer should remain secondary to the actual checker.

### Design principles

❌ No excessive neon
❌ No distracting animations
❌ No giant glowing objects
❌ No generic template appearance

✅ Premium
✅ Minimal
✅ Fast
✅ Modern
✅ Professional

---

# 🔐 Privacy First

Username Checker is designed around minimal data handling.

The interface does not require:

* ❌ Passwords
* ❌ Social-media credentials
* ❌ Account access
* ❌ Unnecessary personal information

Where technically possible, checks are performed directly from the browser.

The project does not require users to create an account simply to check a username.

---

# 🧠 Accuracy & Transparency

Username availability sounds simple, but modern platforms can make automated verification difficult.

Platforms may use:

* CORS restrictions
* Authentication
* Rate limiting
* Anti-bot protection
* Cloud protection
* Dynamic profile pages
* Private APIs
* Regional restrictions
* Username reservation systems

Because of this, Username Checker follows one core principle:

> ## Never turn a failed request into a fake "Available" result.

If a platform cannot be reliably verified, it should return:

```text
? UNKNOWN
```

rather than incorrectly reporting:

```text
✓ AVAILABLE
```

This makes the application more trustworthy.

---

# ⚡ Performance

Performance is treated as a feature.

The project aims to:

* Minimize unnecessary dependencies
* Avoid large frontend frameworks
* Keep animations efficient
* Handle platform failures independently
* Avoid blocking the main interface
* Reduce visual effects on weaker devices
* Respect `prefers-reduced-motion`
* Keep the initial page lightweight

If advanced 3D/WebGL effects are used, they should gracefully degrade when unavailable.

---

# 📱 Responsive Design

Username Checker is designed for:

* 🖥️ Desktop
* 💻 Laptop
* 📱 Mobile
* 📟 Tablet

The interface should remain visually consistent across different screen sizes.

Mobile layouts are intentionally designed rather than simply shrinking the desktop version.

---

# 🛠️ Technology

<p align="center">
  <img src="https://skillicons.dev/icons?i=html,css,js,github" alt="HTML CSS JavaScript GitHub">
</p>

### Core

* HTML5
* CSS3
* Vanilla JavaScript

### Browser APIs

* Fetch API
* Intersection Observer
* Web APIs
* DOM APIs

### Deployment

* GitHub Pages

The project intentionally avoids unnecessary framework complexity.

---

# 📁 Project Structure

```text
username-checker/
│
├── index.html
├── style.css
├── script.js
├── README.md
├── LICENSE
│
└── assets/
    ├── hero-preview.png
    └── favicon.svg
```

Simple.

Portable.

GitHub Pages friendly.

---

# 🧩 Platform Architecture

Platforms should be represented through a centralized configuration system.

Example:

```javascript
{
    name: "GitHub",
    category: "Developer",
    icon: "...",

    profileUrl: username =>
        `https://github.com/${username}`,

    check: async username => {
        // Platform-specific verification
    }
}
```

This architecture makes it possible to add new platforms without rewriting the entire application.

Each platform should:

1. Validate the username appropriately.
2. Perform its own check.
3. Handle failures independently.
4. Return a consistent status.
5. Never treat network failure as availability.
6. Provide manual verification when automated checking is unavailable.

---

# 🖥️ Product Preview

The recommended hero image is stored locally in the repository:

```text
assets/hero-preview.png
```

This keeps the README independent from random external stock images.

The hero artwork should represent the actual Username Checker product and use:

* Premium dark UI
* Username search interface
* Platform cards
* Available/Taken/Unknown states
* Subtle 3D depth
* Professional typography
* No excessive neon
* No generic stock photography

---

# 📊 Example Results

Example username:

```text
a24f
```

Possible interface:

```text
                    a24f

        ┌──────────┬──────────┬──────────┐
        │    18    │     9    │     4    │
        │ AVAILABLE│  TAKEN   │ UNKNOWN  │
        └──────────┴──────────┴──────────┘


 ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
 │     GitHub     │ │   Instagram    │ │     TikTok     │
 │                │ │                │ │                │
 │  ✓ Available   │ │  ● Taken       │ │  ? Unknown     │
 │                │ │                │ │                │
 │  View Profile  │ │  View Profile  │ │  Verify →      │
 └────────────────┘ └────────────────┘ └────────────────┘
```

---

# 🧪 Error Handling

Username Checker should gracefully handle:

* Empty usernames
* Invalid usernames
* Unsupported characters
* Excessively long usernames
* Network failures
* CORS restrictions
* Platform timeouts
* Rate limits
* Unavailable services

A single platform failure should never crash the application.

---

# ♿ Accessibility

The project aims to support:

* Semantic HTML
* Keyboard navigation
* Visible focus states
* Accessible buttons
* ARIA labels where required
* Sufficient contrast
* Readable typography
* Reduced-motion preferences
* Meaningful alternative text

Accessibility should be considered during development rather than added at the end.

---

# 🗺️ Roadmap

## Phase 01 — Foundation

* [x] Premium landing page
* [x] Username input
* [x] Username validation
* [x] Result dashboard
* [x] Platform cards
* [x] Responsive layout
* [x] GitHub Pages support

## Phase 02 — Platform Expansion

* [ ] More social networks
* [ ] More gaming platforms
* [ ] More developer platforms
* [ ] More creator platforms
* [ ] Improved platform verification

## Phase 03 — Advanced Verification

* [ ] Optional backend
* [ ] API integrations
* [ ] Platform-specific APIs
* [ ] Better rate-limit handling
* [ ] Improved verification accuracy

## Phase 04 — Advanced Features

* [ ] Bulk username checking
* [ ] Username comparison
* [ ] Export results
* [ ] Shareable reports
* [ ] Developer API
* [ ] Custom platform integrations

---

# 🌐 GitHub Pages Deployment

Username Checker is designed to work with GitHub Pages.

### 1. Clone the Repository

```bash
git clone https://github.com/AmmarCodesStuff/username-checker.git
```

### 2. Enter the Project

```bash
cd username-checker
```

### 3. Push to GitHub

If you're creating your own fork:

```bash
git remote set-url origin https://github.com/AmmarCodesStuff/username-checker.git
```

### 4. Enable GitHub Pages

Open:

```text
Repository
→ Settings
→ Pages
```

Select:

```text
Source: Deploy from a branch
Branch: main
Folder: / (root)
```

Click **Save**.

GitHub will generate the public website.

---

# 💻 Run Locally

Clone the repository:

```bash
git clone https://github.com/AmmarCodesStuff/username-checker.git
```

Enter the directory:

```bash
cd username-checker
```

For the best development experience, run the project through a local development server.

For VS Code users, **Live Server** is an easy option.

---

# 🧪 Development Checklist

Before submitting changes, verify:

```text
✓ Username validation
✓ Empty input handling
✓ Invalid character handling
✓ Loading states
✓ Platform error handling
✓ Available status
✓ Taken status
✓ Unknown status
✓ Result filtering
✓ Category filtering
✓ Mobile layout
✓ Keyboard navigation
✓ Reduced-motion support
✓ No console errors
✓ No broken links
```

---

# 🤝 Contributing

Contributions are welcome.

You can contribute by:

* Adding new platforms
* Improving platform detection
* Fixing bugs
* Improving accessibility
* Improving performance
* Improving the interface
* Improving documentation

### Create a Branch

```bash
git checkout -b feature/new-platform
```

### Make Your Changes

```bash
git add .
```

### Commit

```bash
git commit -m "Add new platform checker"
```

### Push

```bash
git push origin feature/new-platform
```

Then open a Pull Request.

Please keep contributions focused, readable, and tested.

---

# 🐛 Bug Reports

When opening an issue, provide:

* Browser
* Operating system
* Platform affected
* Username tested
* Expected result
* Actual result
* Console errors if available

Never submit:

* Passwords
* Authentication tokens
* Private account information
* API secrets

---

# ⚠️ Disclaimer

Username Checker is an independent open-source project.

It is not affiliated with, sponsored by, or endorsed by any platform it checks.

All platform names, logos, trademarks, and intellectual property belong to their respective owners.

Availability results are informational and may differ from the final result shown by a platform's own registration system.

---

# 📜 License

Username Checker is released under the **MIT License**.

See [`LICENSE`](LICENSE) for the complete license.

---

# 👨‍💻 Author

Created and maintained by **[AmmarCodesStuff](https://github.com/AmmarCodesStuff)**.

Building modern tools for developers, creators, gamers, and the open web.

<p align="center">
  <a href="https://github.com/AmmarCodesStuff">
    <img src="https://img.shields.io/badge/GitHub-AmmarCodesStuff-111827?style=for-the-badge&logo=github" alt="AmmarCodesStuff GitHub">
  </a>
</p>

---

# ⭐ Support the Project

If Username Checker is useful to you:

⭐ **Star the repository**

🍴 **Fork the project**

🐛 **Report bugs**

💡 **Suggest platforms**

🔧 **Submit improvements**

Every contribution helps the project grow.

---

<p align="center">

## 🔎 One Username.

## 🌐 Multiple Platforms.

## 🚀 One Search.

### Username Checker

**Built for developers. Built for creators. Built for the web.**

<br>

Created by **[AmmarCodesStuff](https://github.com/AmmarCodesStuff)**

</p>
