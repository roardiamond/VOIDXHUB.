// =========================================================
// VOIDXHUB TOURNAMENTS — App configuration
// =========================================================

window.VX_CONFIG = {
  API_BASE_URL: "https://voidxhub-backend.onrender.com",
  APP_NAME: "VOIDXHUB",
  SUPPORT_EMAIL: "support@voidxhub.in",
};

// Auto-detect if we are under /www/ (GitHub Pages) or root (Flask / Capacitor)
(function () {
  var base = "";
  try {
    var p = location.pathname || "";
    if (p.indexOf("/www/") !== -1 || p === "/www" || p.indexOf("/www") === 0) {
      base = "/www";
    }
  } catch (e) {}
  window.VX_BASE = base;

  // Helper so links always work under /www or root
  window.vxUrl = function (path) {
    if (!path) return base || "/";
    if (path.charAt(0) !== "/") path = "/" + path;
    return base + path;
  };
})();
