// =========================================================
// VOIDXHUB TOURNAMENTS — App configuration
// This is the ONE file to edit when you deploy or rebrand.
// =========================================================

window.VX_CONFIG = {
  // Full HTTPS URL of your backend API, no trailing slash.
  // In the browser build (running from the same Flask server) this can stay
  // empty — requests will just hit relative paths like /api/... on the same
  // origin. For the packaged Android/iOS app, the app bundle is loaded from
  // a local/app origin, so this MUST point at your real, publicly hosted
  // backend, e.g. "https://api.yourdomain.com".
  API_BASE_URL: "https://voidxhub-backend.onrender.com",

  // Shown in the nav bar and browser tab titles.
  APP_NAME: "VOIDXHUB",

  // Used on the login/register pages and footer.
  SUPPORT_EMAIL: "support@voidxhub.in",
};
