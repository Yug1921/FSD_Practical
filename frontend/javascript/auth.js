// ── Tab Switcher ──────────────────────────────────────────
function switchTab(tab, button) {
  document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
  document.querySelectorAll(".auth-form").forEach((f) => f.classList.add("hidden"));
  document.querySelector(`#${tab}Form`).classList.remove("hidden");
  if (button) {
    button.classList.add("active");
  }
}

// ── Validation Helpers ────────────────────────────────────
function setError(inputId, errorId, msg) {
  const input = document.getElementById(inputId);
  const err   = document.getElementById(errorId);
  if (msg) { input.classList.add("invalid"); err.textContent = msg; }
  else      { input.classList.remove("invalid"); err.textContent = ""; }
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── Login ─────────────────────────────────────────────────
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email    = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const btn = document.getElementById("loginBtnText");
  let valid = true;

  document.getElementById("loginError").textContent = "";

  if (!validateEmail(email)) {
    setError("loginEmail", "loginEmailError", "Enter a valid email address.");
    valid = false;
  } else setError("loginEmail", "loginEmailError", "");

  if (password.length < 6) {
    setError("loginPassword", "loginPasswordError", "Password must be at least 6 characters.");
    valid = false;
  } else setError("loginPassword", "loginPasswordError", "");

  if (!valid) return;

  const submitButton = btn.closest("button");
  submitButton.disabled = true;
  btn.textContent = "Logging in...";

  try {
    const data = await AppSession.request("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    AppSession.setSession(data);
    window.location.href = "dashboard.html";
  } catch (err) {
    document.getElementById("loginError").textContent = err.message || "Login failed.";
  } finally {
    btn.textContent = "Login";
    submitButton.disabled = false;
  }
});

// ── Register ──────────────────────────────────────────────
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name     = document.getElementById("regName").value.trim();
  const email    = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value;
  const confirm  = document.getElementById("regConfirm").value;
  const btn = document.getElementById("registerBtnText");
  let valid = true;

  document.getElementById("registerError").textContent = "";
  document.getElementById("registerSuccess").textContent = "";

  if (name.length < 2) {
    setError("regName", "regNameError", "Name must be at least 2 characters.");
    valid = false;
  } else setError("regName", "regNameError", "");

  if (!validateEmail(email)) {
    setError("regEmail", "regEmailError", "Enter a valid email address.");
    valid = false;
  } else setError("regEmail", "regEmailError", "");

  if (password.length < 6) {
    setError("regPassword", "regPasswordError", "Password must be at least 6 characters.");
    valid = false;
  } else setError("regPassword", "regPasswordError", "");

  if (password !== confirm) {
    setError("regConfirm", "regConfirmError", "Passwords do not match.");
    valid = false;
  } else setError("regConfirm", "regConfirmError", "");

  if (!valid) return;

  const submitButton = btn.closest("button");
  submitButton.disabled = true;
  btn.textContent = "Creating account...";

  try {
    await AppSession.request("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    document.getElementById("registerSuccess").textContent =
      "Account created! Redirecting to login...";
    e.target.reset();
    setTimeout(() => switchTab("login", document.querySelectorAll(".tab-btn")[0]), 1500);
  } catch (err) {
    document.getElementById("registerError").textContent = err.message || "Registration failed.";
  } finally {
    btn.textContent = "Create Account";
    submitButton.disabled = false;
  }
});

// Redirect only if the stored session is still valid
(async () => {
  if (AppSession.getToken() && (await AppSession.verifySession())) {
    window.location.href = "dashboard.html";
  }
})();
