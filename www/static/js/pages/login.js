// Page script for login.html.

renderNav("");
document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const alertEl = document.getElementById("alert");
  alertEl.innerHTML = "";
  try {
    const res = await VX.post("/api/auth/login", { username: fd.get("identifier"), password: fd.get("password") });
    VX.setSession(res.token, res.user);
    const next = new URLSearchParams(window.location.search).get("next");
    // Fix: use vxPath so it works under /www/ and root
    if (next) {
      window.location.href = next;
    } else if (res.user && res.user.role === "admin") {
      window.location.href = vxPath("/admin.html");
    } else {
      window.location.href = vxPath("/dashboard.html");
    }
  } catch (err) {
    alertEl.innerHTML = `<div class="alert alert-error">${escapeHtml(err.message)}</div>`;
  }
});
