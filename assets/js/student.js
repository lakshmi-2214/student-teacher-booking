auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "login.html?role=student";
    return;
  }

  const select = document.getElementById("teacherSelect");
  const bookBtn = document.getElementById("bookBtn");
  const timeInput = document.getElementById("appointmentTime");
  const messageInput = document.getElementById("message");
  const list = document.getElementById("appointmentsList");

  // -----------------------------
  // Load teachers into dropdown
  // -----------------------------
  try {
    const teachersSnap = await db.collection("teachers").get();
    select.innerHTML = "";

    if (teachersSnap.empty) {
      const opt = document.createElement("option");
      opt.textContent = "No teachers found";
      opt.disabled = true;
      opt.selected = true;
      select.appendChild(opt);

      bookBtn.disabled = true;
      timeInput.disabled = true;
      messageInput.disabled = true;
    } else {
      teachersSnap.forEach((doc) => {
        const data = doc.data();
        const opt = document.createElement("option");
        opt.value = doc.id;
        opt.textContent = `${data.name || "Unnamed"} (${data.department || "Dept"})`;
        select.appendChild(opt);
      });
    }
  } catch (err) {
    console.error("Error loading teachers:", err);
  }

  // -----------------------------
  // Handle appointment booking
  // -----------------------------
  bookBtn.addEventListener("click", async () => {
    const teacherId = select.value;
    const time = timeInput.value;
    const msg = messageInput.value.trim();

    if (!teacherId || !time || !msg) {
      alert("Please select teacher, time, and enter a message.");
      return;
    }

    try {
      await db.collection("appointments").add({
        studentId: user.uid,
        teacherId,
        time,
        msg,
        status: "Pending",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      alert("Appointment booked successfully!");
      timeInput.value = "";
      messageInput.value = "";
    } catch (err) {
      console.error("Error booking appointment:", err);
      alert("Failed to book appointment. Please try again.");
    }
  });

  // -----------------------------
  // Listen to student's appointments (no orderBy first)
  // -----------------------------
  db.collection("appointments")
    .where("studentId", "==", user.uid)
    .onSnapshot(async (snapshot) => {
      list.innerHTML = "";

      if (snapshot.empty) {
        const li = document.createElement("li");
        li.textContent = "No appointments found.";
        list.appendChild(li);
        return;
      }

      // Sort manually by createdAt (because some documents might not have it yet)
      const sortedDocs = snapshot.docs.sort((a, b) => {
        const aTime = a.data().createdAt ? a.data().createdAt.toMillis() : 0;
        const bTime = b.data().createdAt ? b.data().createdAt.toMillis() : 0;
        return bTime - aTime;
      });

      for (const doc of sortedDocs) {
        const data = doc.data();
        let teacherName = "Unknown Teacher";
        try {
          const teacherDoc = await db.collection("teachers").doc(data.teacherId).get();
          if (teacherDoc.exists) teacherName = teacherDoc.data().name || teacherName;
        } catch (err) {
          console.error("Error fetching teacher:", err);
        }

        const li = document.createElement("li");
        li.innerHTML = `
          <div style="padding:8px 0; border-bottom:1px solid #ddd;">
            <strong>Teacher:</strong> ${teacherName}<br>
            <strong>Time:</strong> ${new Date(data.time).toLocaleString()}<br>
            <strong>Purpose:</strong> ${data.msg}<br>
            <strong>Status:</strong> <span style="color:${
              data.status === "Pending"
                ? "#e67e22"
                : data.status === "Approved"
                ? "green"
                : "red"
            }">${data.status}</span>
          </div>
        `;
        list.appendChild(li);
      }
    });
});
