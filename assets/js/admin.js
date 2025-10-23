document.addEventListener("DOMContentLoaded", () => {
  const teacherList = document.getElementById("teacherList");
  const studentList = document.getElementById("studentList");

  if (!teacherList || !studentList) {
    console.error("List elements missing!");
    return;
  }

  // ========================
  // 🔹 TEACHER MANAGEMENT
  // ========================
  db.collection("teachers")
    .orderBy("createdAt", "desc")
    .onSnapshot((snapshot) => {
      teacherList.innerHTML = "";

      if (snapshot.empty) {
        teacherList.innerHTML = "<li>No teachers found.</li>";
        return;
      }

      snapshot.forEach((doc) => {
        const data = doc.data();
        const li = document.createElement("li");
        const name = data.name || "Unnamed";
        const email = data.email || "";
        const dept = data.department ? ` — ${data.department}` : "";
        const subj = data.subject ? ` (${data.subject})` : "";
        const approved = data.approved === true;
        const deleted = data.deleted === true;

        let statusText = deleted
          ? `<span class='status deleted'>Deleted</span>`
          : approved
          ? `<span class='status approved'>Approved</span>`
          : `<span class='status'>Pending Approval</span>`;

        let buttons = "";
        if (deleted) {
          buttons = `<button class="btn restoreBtn" data-type="teacher" data-id="${doc.id}">Restore</button>`;
        } else {
          if (!approved)
            buttons += `<button class="btn approveBtn" data-type="teacher" data-id="${doc.id}">Approve</button> `;
          buttons += `<button class="btn deleteBtn" data-type="teacher" data-id="${doc.id}">Delete</button>`;
        }

        li.innerHTML = `
          <div><strong>${name}</strong> (${email})${dept}${subj} ${statusText}</div>
          <div>${buttons}</div>
        `;
        teacherList.appendChild(li);
      });
    });

  // ========================
  // 🔹 STUDENT MANAGEMENT
  // ========================
  db.collection("students")
    .orderBy("createdAt", "desc")
    .onSnapshot((snapshot) => {
      studentList.innerHTML = "";

      if (snapshot.empty) {
        studentList.innerHTML = "<li>No students found.</li>";
        return;
      }

      snapshot.forEach((doc) => {
        const data = doc.data();
        const li = document.createElement("li");
        const name = data.name || "Unnamed Student";
        const email = data.email || "";
        const approved = data.approved === true;
        const deleted = data.deleted === true;

        let statusText = deleted
          ? `<span class='status deleted'>Deleted</span>`
          : approved
          ? `<span class='status approved'>Approved</span>`
          : `<span class='status'>Pending Approval</span>`;

        let buttons = "";
        if (deleted) {
          buttons = `<button class="btn restoreBtn" data-type="student" data-id="${doc.id}">Restore</button>`;
        } else {
          if (!approved)
            buttons += `<button class="btn approveBtn" data-type="student" data-id="${doc.id}">Approve</button> `;
          buttons += `<button class="btn deleteBtn" data-type="student" data-id="${doc.id}">Delete</button>`;
        }

        li.innerHTML = `
          <div><strong>${name}</strong> (${email}) ${statusText}</div>
          <div>${buttons}</div>
        `;
        studentList.appendChild(li);
      });
    });

  // ========================
  // 🔹 ACTION HANDLER (shared)
  // ========================
  document.body.addEventListener("click", async (e) => {
    const target = e.target;
    const id = target.dataset.id;
    const type = target.dataset.type;
    if (!id || !type) return;

    const colRef = db.collection(type === "teacher" ? "teachers" : "students");

    // ✅ Approve
    if (target.classList.contains("approveBtn")) {
      await colRef.doc(id).update({ approved: true, deleted: false });
      alert(`${type} approved successfully!`);
    }

    // 🗑️ Soft Delete
    if (target.classList.contains("deleteBtn")) {
      if (confirm(`Are you sure you want to delete this ${type}?`)) {
        await colRef.doc(id).update({ deleted: true, approved: false });
        alert(`${type} marked as deleted.`);
      }
    }

    // ♻️ Restore
    if (target.classList.contains("restoreBtn")) {
      await colRef.doc(id).update({ deleted: false, approved: true });
      alert(`${type} restored successfully!`);
    }
  });
});
