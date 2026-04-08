let allCourses    = [];
let enrolledIds   = new Set();

// ── Auth Guard ────────────────────────────────────────────
const token = AppSession.getToken();
if (!token) window.location.href = "index.html";

// ── Toast Notification ────────────────────────────────────
function toast(msg, type = "success") {
  let el = document.getElementById("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.className = `show ${type}`;
  setTimeout(() => el.classList.remove("show"), 3000);
}

// ── Load Enrolled IDs ─────────────────────────────────────
async function loadEnrolledIds() {
  const data = await AppSession.authenticatedRequest("/enrollments", {
    method: "GET",
  });
  enrolledIds = new Set(data.map((e) => e.course._id));
}

// ── Fetch & Render Courses ────────────────────────────────
async function loadCourses() {
  try {
    await loadEnrolledIds();
    allCourses  = await AppSession.authenticatedRequest("/courses", {
      method: "GET",
    });
    renderCourses(allCourses);
  } catch (err) {
    if (err.status === 401) return;
    document.getElementById("coursesContainer").innerHTML =
      `<p class="empty-state"><h3>Failed to load courses.</h3>Check your connection.</p>`;
  }
}

function renderCourses(courses) {
  const container = document.getElementById("coursesContainer");
  if (!courses.length) {
    container.innerHTML = `<div class="empty-state"><h3>No courses found.</h3><p>Try adjusting your search.</p></div>`;
    return;
  }

  const cards = courses.map((c) => {
    const pct      = Math.round((c.enrolled / c.capacity) * 100);
    const isFull   = c.enrolled >= c.capacity;
    const isEnrolled = enrolledIds.has(c._id);
    const fillClass = pct >= 100 ? "full" : pct >= 75 ? "warn" : "";

    let btnHtml;
    if (isEnrolled) {
      btnHtml = `<button class="btn btn-outline" style="color:var(--success);border-color:var(--success)" disabled>✓ Enrolled</button>`;
    } else if (isFull) {
      btnHtml = `<button class="btn btn-danger" disabled>Course Full</button>`;
    } else {
      btnHtml = `<button class="btn btn-success" onclick="enroll('${c._id}', this)">Enroll Now</button>`;
    }

    return `
      <div class="course-card" id="card-${c._id}">
        <div class="course-card-header">
          <span class="course-code">${c.courseCode}</span>
          <span class="course-credits">${c.credits} Credits</span>
        </div>
        <div class="course-title">${c.title}</div>
        <div class="course-info">
          <span>👤 ${c.instructor}</span>
          <span>🏛️ ${c.department}</span>
          <span>🕐 ${c.schedule}</span>
          ${c.description ? `<span>📝 ${c.description}</span>` : ""}
        </div>
        <div>
          <div class="capacity-bar">
            <div class="capacity-fill ${fillClass}" style="width:${pct}%"></div>
          </div>
          <p class="capacity-text">${c.enrolled}/${c.capacity} seats filled</p>
        </div>
        ${btnHtml}
      </div>`;
  }).join("");

  container.innerHTML = `<div class="courses-grid">${cards}</div>`;
}

// ── Enroll Action ─────────────────────────────────────────
async function enroll(courseId, btn) {
  btn.disabled = true;
  btn.textContent = "Enrolling...";

  try {
    await AppSession.authenticatedRequest("/enrollments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    });

    enrolledIds.add(courseId);
    toast("Successfully enrolled! ✓", "success");
    // Update button in place
    btn.className = "btn btn-outline";
    btn.style.cssText = "color:var(--success);border-color:var(--success)";
    btn.textContent = "✓ Enrolled";
  } catch (err) {
    if (err.status === 401) return;
    toast(err.message, "error");
    btn.disabled = false;
    btn.textContent = "Enroll Now";
  }
}

// ── Filter / Search ───────────────────────────────────────
function filterCourses() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const dept   = document.getElementById("deptFilter").value;

  const filtered = allCourses.filter((c) => {
    const matchSearch =
      !search ||
      c.title.toLowerCase().includes(search) ||
      c.courseCode.toLowerCase().includes(search) ||
      c.instructor.toLowerCase().includes(search);
    const matchDept = !dept || c.department === dept;
    return matchSearch && matchDept;
  });

  renderCourses(filtered);
}

function logout() {
  AppSession.logout();
}

loadCourses();
