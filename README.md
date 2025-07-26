# Student Management System

A modern, comprehensive web-based student management system built with React.js, Tailwind CSS, Firebase Authentication, and Firebase Firestore.

## 🚀 Features

### 🎓 Teacher Dashboard
- **Student Management**: Add, edit, and delete student records with detailed validation
- **Grade Tracking**: Enter and update marks for quizzes, assignments, midterms, and finals
- **Analytics**: Visual insights with charts and performance statistics
- **Search & Filter**: Find students quickly by name, email, or ID
- **Automatic Grading**: Calculates total scores, percentages, and letter grades
- **Profile Management**: Update account information and passwords

### 👨‍🎓 Student Dashboard
- **Profile Overview**: View personal information and academic details
- **Grade Viewing**: See all marks and overall performance
- **Performance Tracking**: Monitor progress with visual indicators
- **Report Download**: Export academic report as text file

### 🔐 Authentication & Security
- **Role-based Access**: Separate interfaces for teachers and students
- **Firebase Authentication**: Secure signup/login with role selection
- **Protected Routes**: Ensures users only access appropriate features
- **Secure Firestore Rules**: Proper data access control

## 🛠️ Tech Stack

- **Frontend**: React.js with Vite
- **Styling**: Tailwind CSS v4
- **Authentication**: Firebase Auth (replaced Clerk)
- **Database**: Firebase Firestore
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Notifications**: React Hot Toast

## 📋 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd student-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your actual credentials:
   ```env
   # Clerk Authentication
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_your-clerk-publishable-key-here

   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your-firebase-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=your-app-id
   ```

4. **Configure Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Firestore Database
   - Set up authentication (optional - Clerk handles this)
   - Get your configuration details and update the `.env` file

5. **Configure Clerk**
   - Create a new application at [Clerk Dashboard](https://dashboard.clerk.dev)
   - Get your publishable key and update the `.env` file
   - Set up user metadata for roles (teacher/student)

6. **Start the development server**
   ```bash
   npm run dev
   ```

## Firebase Firestore Structure

```javascript
students: {
  studentId: {
    name: "John Doe",
    email: "john@student.com",
    studentId: "STU001",
    class: "BSCS",
    marks: {
      quiz: 18,        // out of 40
      assignment: 20,  // out of 25
      midterm: 40,     // out of 45
      final: 65        // out of 75
    },
    total: 143,          // out of 160
    percentage: 79.4,
    grade: "B+",
    createdAt: timestamp
  }
}
```

## User Roles

### Setting up User Roles in Clerk

1. **In Clerk Dashboard**:
   - Go to your application settings
   - Navigate to "User & Authentication" → "Metadata"
   - Add public metadata for users with role field

2. **For Teachers**:
   ```json
   {
     "role": "teacher"
   }
   ```

3. **For Students**:
   ```json
   {
     "role": "student"
   }
   ```

## Grading System

- **Quiz**: 40 points (25% weight)
- **Assignment**: 25 points (15.6% weight)
- **Midterm**: 45 points (28.1% weight)
- **Final**: 75 points (46.9% weight)
- **Total**: 160 points

### Grade Scale
- A: 80% and above
- B: 70% - 79%
- C: 60% - 69%
- D: 50% - 59%
- F: Below 50%

## Project Structure

```
src/
├── components/
│   ├── LandingPage.jsx      # Homepage with features
│   ├── TeacherDashboard.jsx # Teacher interface
│   ├── StudentDashboard.jsx # Student interface
│   ├── StudentModal.jsx     # Add/Edit student form
│   ├── MarksModal.jsx       # Update marks form
│   ├── AnalyticsChart.jsx   # Charts and statistics
│   ├── LoadingSpinner.jsx   # Loading component
│   └── SignInPage.jsx       # Authentication page
├── firebase.js              # Firebase configuration
├── App.jsx                  # Main app with routing
├── main.jsx                 # Entry point
└── index.css               # Global styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Initialize: `firebase init`
3. Build: `npm run build`
4. Deploy: `firebase deploy`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Support

For support, email support@yourdomain.com or create an issue in the repository.

---

Built with ❤️ using React.js, Tailwind CSS, Clerk, and Firebase.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
