const token = AppSession.getToken();
if (!token) window.location.href = "index.html";

// ── Toast ─────────────────────────────────────────────────
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

// ── Load Student Info ─────────────────────────────────────
async function loadProfile() {
  try {
    const data = await AppSession.authenticatedRequest("/auth/profile", {
      method: "GET",
    });
    document.getElementById("studentName").textContent = data.name;
    document.getElementById("studentId").textContent   = data.studentId;
  } catch (err) {
    if (err.status === 401) return;
  }
}

// ── Load Enrollments ──────────────────────────────────────
async function loadEnrollments() {
  try {
    const data  = await AppSession.authenticatedRequest("/enrollments", {
      method: "GET",
    });
    renderStats(data);
    renderTable(data);
  } catch (err) {
    if (err.status === 401) return;
    document.getElementById("enrollmentsContainer").innerHTML =
      `<p class="empty-state"><h3>Failed to load enrollments.</h3></p>`;
  }
}

function renderStats(enrollments) {
  const totalCredits = enrollments.reduce((sum, e) => sum + (e.course?.credits || 0), 0);
  document.getElementById("enrollmentStats").innerHTML = `
    <div class="stat-card">
      <div class="stat-number">${enrollments.length}</div>
      <div class="stat-label">Courses Enrolled</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${totalCredits}</div>
      <div class="stat-label">Total Credits</div>
    </div>
    <div class="stat-card">
      <div class="stat-number">${5 - enrollments.length < 0 ? 0 : 5 - enrollments.length}</div>
      <div class="stat-label">Slots Remaining</div>
    </div>`;
}

function renderTable(enrollments) {
  const container = document.getElementById("enrollmentsContainer");

  if (!enrollments.length) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>No courses enrolled yet.</h3>
        <p>Browse available courses and register for this semester.</p>
        <a href="courses.html" class="btn btn-primary" style="margin-top:1rem;display:inline-block">Browse Courses</a>
      </div>`;
    return;
  }

  const rows = enrollments.map((e) => {
    const course = e.course;
    const date   = new Date(e.enrolledAt).toLocaleDateString("en-IN", {
      year: "numeric", month: "short", day: "numeric",
    });
    return `
      <tr id="row-${e._id}">
        <td><strong>${course.courseCode}</strong></td>
        <td>${course.title}</td>
        <td>${course.instructor}</td>
        <td>${course.schedule}</td>
        <td>${course.credits}</td>
        <td>${date}</td>
        <td>
          <button class="btn btn-danger" style="padding:.35rem .8rem;font-size:.8rem"
            onclick="dropCourse('${e._id}', '${course.title}', this)">
            Drop
          </button>
        </td>
      </tr>`;
  }).join("");

  container.innerHTML = `
    <div class="enrollments-table-wrap">
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Course Title</th>
            <th>Instructor</th>
            <th>Schedule</th>
            <th>Credits</th>
            <th>Enrolled On</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

// ── Drop Course ───────────────────────────────────────────
async function dropCourse(enrollmentId, courseTitle, btn) {
  if (!confirm(`Drop "${courseTitle}"? This cannot be undone.`)) return;

  btn.disabled = true;
  btn.textContent = "Dropping...";

  try {
    await AppSession.authenticatedRequest(`/enrollments/${enrollmentId}`, {
      method: "DELETE",
    });

    document.getElementById(`row-${enrollmentId}`)?.remove();
    toast(`Dropped "${courseTitle}" successfully.`, "success");
    loadEnrollments(); // refresh stats
  } catch (err) {
    if (err.status === 401) return;
    toast(err.message, "error");
    btn.disabled = false;
    btn.textContent = "Drop";
  }
}

function logout() {
  AppSession.logout();
}

loadProfile();
loadEnrollments();
