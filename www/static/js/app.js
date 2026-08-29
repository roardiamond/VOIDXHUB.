// ---------- API wrapper ----------

const VX = (() => {
  const TOKEN_KEY = "voidxhub_token";
  const USER_KEY = "voidxhub_user";

  function getToken() { return localStorage.getItem(TOKEN_KEY); }
  function getUser() {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
  function setSession(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
  function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  function apiUrl(path) {
    const base = (window.VX_CONFIG && window.VX_CONFIG.API_BASE_URL) || "";
    return base ? base.replace(/\/$/, "") + path : path;
  }

  async function api(method, path, data) {
    const headers = { "Content-Type": "application/json" };
    const token = getToken();
    if (token) headers["Authorization"] = "Bearer " + token;
    const res = await fetch(apiUrl(path), {
      method,
      headers,
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });
    let body = null;
    try { body = await res.json(); } catch (e) { /* no body */ }
    if (!res.ok) {
      const err = new Error((body && body.error) || "Something went wrong");
      err.status = res.status;
      err.body = body;
      throw err;
    }
    return body;
  }

  return {
    get: (path) => api("GET", path),
    post: (path, data) => api("POST", path, data),
    patch: (path, data) => api("PATCH", path, data),
    del: (path) => api("DELETE", path),
    getToken, getUser, setSession, clearSession,
  };
})();

// ---------- Formatting helpers ----------

function fmtMoney(n) {
  if (!n) return "Free";
  return "₹" + Number(n).toLocaleString("en-IN");
}

function fmtDate(iso) {
  if (!iso) return "TBA";
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleString("en-IN", {
    day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
  });
}

function statusBadge(status) {
  const map = { upcoming: "Upcoming", live: "Live", completed: "Completed" };
  return `<span class="badge badge-${status}">${map[status] || status}</span>`;
}

function paymentBadge(status) {
  const map = { pending: "Pending", verified: "Verified", rejected: "Rejected" };
  return `<span class="badge badge-${status}">${map[status] || status}</span>`;
}

function slotBarHtml(filled, total, ticks) {
  ticks = ticks || Math.min(total, 24);
  const filledTicks = Math.round((filled / Math.max(total, 1)) * ticks);
  let spans = "";
  for (let i = 0; i < ticks; i++) {
    spans += `<span class="${i < filledTicks ? "filled" : ""}"></span>`;
  }
  return `<div class="slot-bar">${spans}</div>`;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str == null ? "" : String(str);
  return div.innerHTML;
}

const EMBLEM_PALETTE = [
  "#7b5cff", "#33f5d5", "#ff9640", "#ff5470", "#5cc8ff", "#c46bff",
];

function emblemColor(name) {
  let hash = 0;
  const s = String(name || "");
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  return EMBLEM_PALETTE[hash % EMBLEM_PALETTE.length];
}

// ---------- Nav / footer (path-aware for /www) ----------

function vx(path) {
  return (typeof window.vxUrl === "function") ? window.vxUrl(path) : path;
}

function renderNav(activePage) {
  const user = VX.getUser();
  const el = document.getElementById("site-nav");
  if (!el) return;

  const links = [
    { href: vx("/index.html"), label: "Home", key: "home" },
    { href: vx("/tournaments.html"), label: "Tournaments", key: "tournaments" },
    { href: vx("/leaderboard.html"), label: "Leaderboard", key: "leaderboard" },
  ];
  if (user) links.push({ href: vx("/dashboard.html"), label: "Dashboard", key: "dashboard" });
  if (user && user.role === "admin") links.push({ href: vx("/admin.html"), label: "Admin", key: "admin" });

  const linksHtml = links.map(
    (l) => `<a href="${l.href}" class="${l.key === activePage ? "active" : ""}">${l.label}</a>`
  ).join("");

  const ctaHtml = user
    ? `<span class="mono" style="font-size:13px;color:var(--fog-dim)">@${escapeHtml(user.username)}</span>
       <button class="btn btn-ghost btn-sm" id="nav-logout">Log out</button>`
    : `<a href="${vx("/login.html")}" class="btn btn-ghost btn-sm">Log in</a>
       <a href="${vx("/register.html")}" class="btn btn-primary btn-sm">Sign up</a>`;

  const brandName = (window.VX_CONFIG && window.VX_CONFIG.APP_NAME) || "VOIDXHUB";

  el.innerHTML = `
    <div class="wrap">
      <a href="${vx("/index.html")}" class="brand">${escapeHtml(brandName)}</a>
      <div class="nav-links">${linksHtml}</div>
      <div class="nav-cta">${ctaHtml}</div>
    </div>`;

  const logoutBtn = document.getElementById("nav-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      VX.clearSession();
      window.location.href = vx("/index.html");
    });
  }
}

function renderFooter() {
  const el = document.getElementById("site-footer");
  if (!el) return;
  el.innerHTML = `
    <div class="wrap site-footer">
      <span>© ${new Date().getFullYear()} VOIDXHUB · voidxhub.in</span>
      <span>Entry fees are non-refundable once a slot is confirmed.</span>
    </div>`;
}

function requireAuth() {
  if (!VX.getToken()) {
    window.location.href = vx("/login.html") + "?next=" + encodeURIComponent(window.location.pathname);
    return false;
  }
  return true;
}

function requireAdmin() {
  const user = VX.getUser();
  if (!VX.getToken() || !user || user.role !== "admin") {
    window.location.href = vx("/login.html");
    return false;
  }
  return true;
}

document.addEventListener("DOMContentLoaded", () => {
  renderFooter();
});
