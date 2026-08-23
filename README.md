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

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Website-111827?style=for-the-badge)](#)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-111827?style=for-the-badge\&logo=github)](#)
[![License](https://img.shields.io/badge/License-MIT-111827?style=for-the-badge)](LICENSE)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=for-the-badge\&logo=javascript\&logoColor=111111)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-111827?style=for-the-badge\&logo=github)](https://pages.github.com/)

</p>

---

## ✦ About

**Username Checker** is an open-source web application designed to make username discovery faster and easier.

Instead of manually opening dozens of platforms and searching for the same username repeatedly, enter a username once and get a centralized overview of where that username appears to be:

* 🟢 **Available**
* 🔴 **Taken**
* 🟡 **Unknown / Unable to verify**

The project focuses on **accuracy, transparency, performance, privacy, and premium UI design**.

> **One username. Multiple platforms. One clean search.**

---

## 🚀 What Can You Check?

Username Checker is designed to cover multiple areas of the internet.

### 🌐 Social

Instagram · TikTok · X · Reddit · Facebook · Snapchat · Pinterest

### 🎮 Gaming

Minecraft · Roblox · Steam · Twitch

### 💻 Developer

GitHub · GitLab · Dev.to · Stack Overflow · CodePen

### 🎨 Creator

Behance · Dribbble · Vimeo · SoundCloud

### 💬 Community

Discord · Telegram · Mastodon · Bluesky

The platform architecture is modular, allowing additional services to be added over time.

---

# 🔍 How It Works

Enter a username such as:

```text
a24f
```

Username Checker validates the input and begins checking supported platforms independently.

```text
                 USERNAME
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
             RESULT DASHBOARD
```

Each platform is checked independently.

If one platform fails, the rest of the scan continues.

---

# 📊 Result System

Username Checker deliberately uses three states.

|      Status      | Meaning                                     |
| :--------------: | ------------------------------------------- |
| 🟢 **Available** | No matching public profile was detected     |
|   🔴 **Taken**   | A matching public profile was detected      |
|  🟡 **Unknown**  | The platform could not be reliably verified |

### ⚠️ Important

**Unknown does NOT mean Available.**

This distinction is extremely important because many websites prevent automated browser requests.

---

# 🧠 Accuracy First

Username availability sounds simple, but modern platforms can make automated verification difficult.

Platforms may use:

* CORS restrictions
* authentication
* rate limiting
* anti-bot protection
* Cloudflare or similar systems
* dynamic profile pages
* private APIs
* regional restrictions
* username reservation systems

Because of this, Username Checker follows one core principle:

> ### Never turn a failed request into a fake "Available" result.

If a platform cannot be reliably verified, it is reported as:

```text
? UNKNOWN
```

rather than incorrectly reporting:

```text
✓ AVAILABLE
```

This makes the application more transparent and trustworthy.

---

# ✨ Premium Interface

Username Checker is intentionally designed to avoid the typical cheap utility-site appearance.

The interface focuses on:

* refined typography
* deep graphite surfaces
* subtle navy tones
* layered depth
* sophisticated cards
* soft shadows
* subtle glass effects
* interactive backgrounds
* 3D-inspired depth
* smooth transitions
* responsive layouts
* professional micro-interactions

The goal:

> **Utility underneath. Product experience on top.**

---

# 🌌 Interactive Visual System

The website uses subtle visual movement rather than overwhelming effects.

Possible effects include:

* interactive background elements
* mouse-responsive depth
* scroll-based transitions
* 3D-inspired objects
* animated result cards
* progressive scan animations
* subtle particle systems

The visual layer should remain secondary to the actual checker.

No excessive neon.

No distracting animations.

No giant glowing objects covering the interface.

---

# 📱 Responsive by Design

Username Checker is designed for:

* 🖥️ Desktop
* 💻 Laptop
* 📱 Mobile
* 📟 Tablet

The interface adapts to different screen sizes while preserving the same visual hierarchy.

Mobile layouts are intentionally designed rather than simply shrinking desktop components.

---

# 🔐 Privacy

Username Checker is designed around minimal data handling.

The interface does not require:

* ❌ Passwords
* ❌ Social-media credentials
* ❌ Account access
* ❌ Unnecessary personal information

Where technically possible, checks are performed directly from the browser.

The project does not require users to create an account just to check a username.

---

# ⚡ Performance

Performance is treated as a feature.

The project aims to:

* minimize unnecessary dependencies
* avoid large frameworks
* keep animations efficient
* handle platform failures independently
* avoid blocking the main interface
* reduce visual effects on weaker devices
* respect `prefers-reduced-motion`

If advanced 3D/WebGL effects are used, they should gracefully degrade when unavailable.

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
* Local browser functionality

### Deployment

* GitHub Pages

The project intentionally avoids unnecessary frontend framework complexity.

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

The structure is intentionally simple so the project can be understood and modified easily.

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

This makes it possible to add new platforms without rewriting the entire application.

Each platform should:

1. Validate the username appropriately.
2. Perform its own check.
3. Handle failures independently.
4. Return a consistent status.
5. Never treat network failure as availability.
6. Provide manual verification when automated checking is unavailable.

---

# 🖥️ Product Preview

Once the website is running, replace the preview below with an actual screenshot of the application.

```text
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  Username Checker                         GitHub  About  │
│                                                          │
│                 Find Your Username                       │
│                    Everywhere.                           │
│                                                          │
│       Check your username across the platforms           │
│                  that matter.                            │
│                                                          │
│       ┌───────────────────────────────┐ ┌───────────┐    │
│       │ Enter a username...            │ │  CHECK    │    │
│       └───────────────────────────────┘ └───────────┘    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

# 📈 Results Dashboard

Example result layout:

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

* empty usernames
* invalid usernames
* unsupported characters
* usernames that are too long
* network failures
* CORS restrictions
* platform timeouts
* rate limits
* unavailable services

A single platform failure should never crash the application.

---

# ♿ Accessibility

The project aims to support:

* semantic HTML
* keyboard navigation
* visible focus states
* accessible buttons
* ARIA labels where required
* sufficient contrast
* readable typography
* reduced-motion preferences
* meaningful alternative text

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

# 🌐 GitHub Pages

Username Checker is designed to work with GitHub Pages.

### Deployment

1. Push the repository to GitHub.

2. Open:

```text
Repository
→ Settings
→ Pages
```

3. Select:

```text
Source: Deploy from a branch
Branch: main
Folder: / (root)
```

4. Click **Save**.

5. GitHub will generate your public website URL.

No server is required for the static frontend.

---

# 💻 Run Locally

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/username-checker.git
```

Enter the directory:

```bash
cd username-checker
```

Then open the project using your preferred local development server.

For VS Code, **Live Server** is an easy option.

---

# 🤝 Contributing

Contributions are welcome.

You can contribute by:

* adding new platforms
* improving platform detection
* fixing bugs
* improving accessibility
* improving performance
* improving the interface
* improving documentation

Example:

```bash
git checkout -b feature/new-platform

git add .

git commit -m "Add new platform checker"

git push origin feature/new-platform
```

Then open a Pull Request.

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

Never submit passwords, authentication tokens, or private account information.

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

# ⭐ Support

If you find Username Checker useful:

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

**Username Checker**

*Built for developers. Built for creators. Built for the web.*

</p>
