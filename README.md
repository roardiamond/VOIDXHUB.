<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:05050a,30:1a0033,70:7c3aed,100:05050a&height=200&section=header&text=VOIDXHUB&fontSize=68&fontColor=67e8f9&animation=twinkling&fontAlignY=38&desc=Undetectable%20%E2%80%A2%20Powerful%20%E2%80%A2%20Premium&descAlignY=58&descSize=16" alt="VOIDXHUB"/>
</div>

<br>

<div align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=20&duration=2800&pause=900&color=C084FC&center=true&vCenter=true&width=720&lines=Premium+Tools+%26+Tournament+Ecosystem;Live+on+voidxhub.in;Built+for+winners.+Designed+for+the+elite." alt="Typing" />
</div>

<br>

<div align="center">
  <a href="https://voidxhub.in"><img src="https://img.shields.io/badge/LIVE-voidxhub.in-67e8f9?style=for-the-badge&logo=google-chrome&logoColor=white" /></a>
  &nbsp;
  <img src="https://img.shields.io/badge/Status-Production-7c3aed?style=for-the-badge" />
  &nbsp;
  <img src="https://img.shields.io/badge/Stack-HTML%20%7C%20JS%20%7C%20Python-a855f7?style=for-the-badge" />
  &nbsp;
  <img src="https://img.shields.io/badge/Security-Hardened-0d0d1a?style=for-the-badge&logo=hackthebox&logoColor=white" />
</div>

---

### What is VOIDXHUB?

```diff
+ Platform     : Underground premium tools hub + live scrims
+ Domain       : https://voidxhub.in
+ Stack        : Static web (GitHub Pages) + Flask API (Render)
+ Auth         : JWT + server-side admin verification
+ Focus        : Clean UI • Secure flows • Production-ready
```

**VOIDXHUB** is the core public face of the ecosystem — neon dark UI, premium tools catalog, account flows, and tournament lobby under `/www`.

Built by **YashXChi** for players who don’t settle for average.

---

### Features

| Module | What it does |
|--------|----------------|
| **Landing** | Orbitron neon hero, particles, tools + community CTAs |
| **Tools hub** | Device / game selection + shop pages |
| **Tournaments** | List, register, dashboard under `/www` |
| **Admin panel** | Create tournaments — **gated** (client + API check) |
| **Auth** | Login / register with secure redirects |
| **CI/CD** | GitHub Actions → Pages deploy + PHP/Python/Node checks |

---

### Tech

<p align="center">
  <img src="https://skillicons.dev/icons?i=html,css,js,python,flask,git,github,linux" />
</p>

- **Frontend:** HTML · Tailwind (CDN) · Anime.js · Orbitron  
- **Hosting:** GitHub Pages · Custom domain `voidxhub.in`  
- **Backend:** [voidxhub-backend](https://github.com/roardiamond/voidxhub-backend) (Flask · JWT · SQLite)  
- **CI:** `.github/workflows` — deploy + lint checks on every `main` push  

---

### Live map

| URL | Purpose |
|-----|---------|
| [voidxhub.in](https://voidxhub.in) | Main landing |
| [voidxhub.in/www](https://voidxhub.in/www/) | Tournaments hub |
| [voidxhub.in/www/login.html](https://voidxhub.in/www/login.html) | Auth |
| API | `https://voidxhub-backend.onrender.com` |

---

### Related repos

| Repo | Role |
|------|------|
| [voidxhub-backend](https://github.com/roardiamond/voidxhub-backend) | JWT auth · tournaments · admin · orders |
| [voidxhub-tournaments-web](https://github.com/roardiamond/voidxhub-tournaments-web) | Tournaments web + admin source |
| Profile | [roardiamond](https://github.com/roardiamond) |

---

### Local run

```bash
git clone https://github.com/roardiamond/VOIDXHUB.git
cd VOIDXHUB
# static site — open index.html or:
npx serve .
```

Backend (separate):

```bash
cd voidxhub-backend
pip install -r requirements.txt
python seed.py
python app.py
```

---

### Security notes

- Admin UI **does not** trust localStorage alone — server `/api/admin/*` must accept the JWT  
- Fake role spoof → session cleared → forced login  
- CORS locked to `voidxhub.in` + Capacitor origins  

---

<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:05050a,50:7c3aed,100:05050a&height=100&section=footer" alt="Footer"/>
</div>

<p align="center">
  <b>Built by YashXChi • Powered by Kali energy • Shipping production software</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Crafted%20by-YashXChi-0d0d1a?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Live-voidxhub.in-7c3aed?style=for-the-badge" />
</p>
