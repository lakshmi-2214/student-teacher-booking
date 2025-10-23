# Student-Teacher Booking System

A web-based appointment booking system that allows students to schedule meetings with teachers. Built with HTML, CSS, JavaScript, and Firebase.

Live demo: [https://student-teacher-booking-4e97a.firebaseapp.com/](https://student-teacher-booking-4e97a.firebaseapp.com/)

## Features

### For Students
- Create and manage student accounts
- View available teachers
- Book appointments with preferred teachers
- Add purpose/message for appointments
- Track appointment status (Pending/Completed)
- View appointment history

### For Teachers
- Dedicated teacher dashboard
- View upcoming and past appointments
- Student contact information
- Mark appointments as completed
- Real-time appointment updates

### For Administrators
- Approve/reject teacher registrations
- Manage student accounts
- Delete or restore user accounts
- Monitor system activity

## Technology Stack

- Frontend: HTML5, CSS3, JavaScript
- Backend: Firebase
  - Authentication
  - Firestore Database
  - Hosting
- Deployment: GitHub Actions

## Project Structure

```
student-teacher-booking/
├── assets/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── admin.js
│       ├── auth.js
│       ├── firebase-config.js
│       ├── student.js
│       └── teacher.js
├── index.html
├── login.html
├── register.html
├── student.html
├── teacher.html
├── admin.html
└── 404.html
```

## Setup & Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/student-teacher-booking.git
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a Firebase project
   - Update `firebase-config.js` with your credentials
   - Enable Authentication and Firestore

4. Run locally:
```bash
firebase serve
```

5. Deploy:
```bash
npm run build
firebase deploy
```

## Usage

1. **Student Flow**:
   - Register as student
   - Browse available teachers
   - Book appointments
   - Track appointment status

2. **Teacher Flow**:
   - Register as teacher
   - Wait for admin approval
   - Manage appointments
   - Mark appointments complete

3. **Admin Flow**:
   - Access admin panel
   - Approve teacher accounts
   - Manage user accounts
   - Monitor system

## Security

- Firebase Authentication for user management
- Role-based access control
- Admin approval required for teacher accounts
- Secure database rules

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.