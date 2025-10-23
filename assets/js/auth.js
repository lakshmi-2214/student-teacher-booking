// Handle Registration
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Match IDs with HTML
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const name = document.getElementById("name").value.trim();
        const role = document.getElementById("roleField").value;

        try {
            // Create auth account
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Create user document based on role
            const userData = {
                name: name,
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                approved: false  // Set approved to false by default
            };

            await db.collection(role + "s").doc(user.uid).set(userData);

            // Sign out the user after registration
            await auth.signOut();

            alert("Registration successful! Please login to continue.");
            window.location.href = "index.html";  // Redirect to index.html
            
        } catch (error) {
            console.error("Registration error:", error);
            alert(error.message || "Registration failed. Please try again.");
        }
    });
}

// Handle Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;
        const roleParam = new URLSearchParams(window.location.search).get("role") || "student";

        try {
            const cred = await auth.signInWithEmailAndPassword(email, password);
            const uid = cred.user.uid;

            // Determine collection based on role
            const collectionName = roleParam + "s"; // students, teachers, or admins

            const docSnap = await db.collection(collectionName).doc(uid).get();

            if (!docSnap.exists) {
                alert(`Account not found in ${roleParam} database. Please check your role.`);
                await auth.signOut();
                return;
            }

            const data = docSnap.data();

            // Check if account is deleted
            if (data.deleted === true) {
                const message = roleParam === "teacher" 
                    ? "Your teacher account has been deleted by admin. Please contact administrator."
                    : "Your student account has been deleted by admin. Please contact administrator.";
                alert(message);
                await auth.signOut();
                return;
            }

            // Check approval status for both students and teachers
            if (data.approved === false) {
                const message = roleParam === "teacher" 
                    ? "Your teacher account is pending admin approval. Please try again later."
                    : "Your student account is pending admin approval. Please try again later.";
                alert(message);
                await auth.signOut();
                return;
            }

            // Redirect based on role
            if (roleParam === "teacher") {
                window.location.href = "teacher.html";
            } else if (roleParam === "admin") {
                window.location.href = "admin.html";
            } else {
                window.location.href = "student.html";
            }
        } catch (err) {
            console.error("Login error:", err);
            alert(err.message || "Login failed. Please try again.");
        }
    });
}
