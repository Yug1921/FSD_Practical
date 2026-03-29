const API = "http://localhost:5000/api";

// ── Tab Switcher ──────────────────────────────────────────
function switchTab(tab) {
  document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
  document.querySelectorAll(".auth-form").forEach((f) => f.classList.add("hidden"));
  document.querySelector(`#${tab}Form`).classList.remove("hidden");
  event.target.classList.add("active");
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
  let valid = true;

  if (!validateEmail(email)) {
    setError("loginEmail", "loginEmailError", "Enter a valid email address.");
    valid = false;
  } else setError("loginEmail", "loginEmailError", "");

  if (password.length < 6) {
    setError("loginPassword", "loginPasswordError", "Password must be at least 6 characters.");
    valid = false;
  } else setError("loginPassword", "loginPasswordError", "");

  if (!valid) return;

  const btn = document.getElementById("loginBtnText");
  btn.textContent = "Logging in...";

  try {
    const res  = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    localStorage.setItem("token",   data.token);
    localStorage.setItem("student", JSON.stringify(data));
    window.location.href = "dashboard.html";
  } catch (err) {
    document.getElementById("loginError").textContent = err.message;
    btn.textContent = "Login";
  }
});

// ── Register ──────────────────────────────────────────────
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name     = document.getElementById("regName").value.trim();
  const email    = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value;
  const confirm  = document.getElementById("regConfirm").value;
  let valid = true;

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

  const btn = document.getElementById("registerBtnText");
  btn.textContent = "Creating account...";

  try {
    const res  = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    document.getElementById("registerSuccess").textContent =
      "Account created! Redirecting to login...";
    setTimeout(() => switchTab("login"), 1500);
  } catch (err) {
    document.getElementById("registerError").textContent = err.message;
    btn.textContent = "Create Account";
  }
});

// Redirect if already logged in
if (localStorage.getItem("token")) {
  window.location.href = "dashboard.html";
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}
