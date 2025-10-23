auth.onAuthStateChanged(async (user) => {
  if (!user) window.location.href = "login.html";

  const list = document.getElementById("teacherAppointments");
  
  // Real-time updates for appointments
  db.collection("appointments")
    .where("teacherId", "==", user.uid)
    .onSnapshot(async (snapshot) => {
      list.innerHTML = "";

      if (snapshot.empty) {
        const li = document.createElement("li");
        li.textContent = "No Appointments";
        list.appendChild(li);
        return;
      }

      for (const doc of snapshot.docs) {
        const data = doc.data();
        const li = document.createElement("li");

        // Fetch student details
        const studentDoc = await db.collection("students")
          .doc(data.studentId)
          .get();
        
        const studentData = studentDoc.data();
        const studentName = studentData ? studentData.name : "Unknown Student";
        const studentEmail = studentData ? studentData.email : "No email";
        
        // Format the time
        const appointmentTime = new Date(data.time).toLocaleString();

        // Create appointment card
        li.innerHTML = `
          <div class="appointment-card">
            <p><strong>Student:</strong> ${studentName} (${studentEmail})</p>
            <p><strong>Time:</strong> ${appointmentTime}</p>
            <p><strong>Status:</strong> ${data.status}</p>
            ${data.status === 'Pending' ? 
              `<button class="complete-btn" data-id="${doc.id}">Mark as Completed</button>` 
              : ''
            }
          </div>
        `;
        list.appendChild(li);
      }
    });

  // Handle status change
  list.addEventListener('click', async (e) => {
    if (e.target.classList.contains('complete-btn')) {
      const appointmentId = e.target.dataset.id;
      try {
        await db.collection('appointments')
          .doc(appointmentId)
          .update({
            status: 'Completed',
            completedAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        // Button will be removed automatically by the snapshot listener
      } catch (error) {
        console.error('Error updating appointment:', error);
        alert('Failed to update appointment status');
      }
    }
  });
});

// Add this CSS to your stylesheet
const style = document.createElement('style');
style.textContent = `
  .appointment-card {
    border: 1px solid #ddd;
    padding: 15px;
    margin: 10px 0;
    border-radius: 4px;
    background: white;
  }
  .appointment-card p {
    margin: 5px 0;
  }
  .complete-btn {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
  }
  .complete-btn:hover {
    background-color: #45a049;
  }
`;
document.head.appendChild(style);
