# Quick Setup Guide

## 1. Environment Variables

Create a `.env` file in the root directory with the following variables:

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

## 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Firestore Database
4. Set Firestore rules to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // For development only
    }
  }
}
```

5. Get your config from Project Settings > General > Your apps

## 3. Clerk Setup

1. Go to [Clerk Dashboard](https://dashboard.clerk.dev)
2. Create a new application
3. Configure the following:

### Authentication Methods
- Enable Email & Password
- Enable Social logins if desired (Google, GitHub, etc.)

### User Metadata
- Go to Users & Authentication > Metadata
- For role-based access, manually set public metadata for users:

**For Teacher Users:**
```json
{
  "role": "teacher"
}
```

**For Student Users:**
```json
{
  "role": "student"
}
```

### Environment Variables
- Copy the publishable key from the API Keys section

## 4. Test Data

### Sample Students for Testing

You can add these sample students for testing:

```javascript
// Teacher can add these students manually through the UI
[
  {
    name: "John Doe",
    email: "john@student.com",
    studentId: "STU001",
    class: "BSCS",
    marks: { quiz: 35, assignment: 20, midterm: 40, final: 65 }
  },
  {
    name: "Jane Smith",
    email: "jane@student.com", 
    studentId: "STU002",
    class: "BSIT",
    marks: { quiz: 38, assignment: 23, midterm: 42, final: 70 }
  },
  {
    name: "Mike Johnson",
    email: "mike@student.com",
    studentId: "STU003", 
    class: "BSCS",
    marks: { quiz: 30, assignment: 18, midterm: 35, final: 55 }
  }
]
```

## 5. User Account Setup

### Creating Test Accounts

1. **Teacher Account:**
   - Sign up with any email (e.g., teacher@test.com)
   - After signup, go to Clerk Dashboard
   - Find the user and add public metadata: `{"role": "teacher"}`

2. **Student Account:**
   - Sign up with student email that matches one in the database
   - Add public metadata: `{"role": "student"}`

## 6. Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 7. Testing the System

1. **As Teacher:**
   - Login with teacher account
   - Add students using the "Add Student" button
   - Enter marks by clicking the book icon next to each student
   - View analytics in the Analytics tab

2. **As Student:**
   - Login with student account (email must match a student record)
   - View grades and performance
   - Download report

## 8. Troubleshooting

### Common Issues:

1. **"Student record not found"**: Make sure the student's email in Firestore matches their Clerk account email

2. **Clerk authentication errors**: Verify your publishable key is correct and the domain is configured

3. **Firebase connection errors**: Check your Firebase config and ensure Firestore is enabled

4. **Build errors**: Make sure all dependencies are installed with `npm install`

### Development vs Production

- **Development**: Use test Firebase project and Clerk development keys
- **Production**: Use production Firebase project and Clerk production keys
- **Security**: Update Firestore rules for production use

## 9. Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Firebase Hosting
1. `npm run build`
2. `firebase init hosting`
3. `firebase deploy`

## 10. Next Steps

- Set up proper Firestore security rules
- Add email notifications for grade updates
- Implement file upload for assignments
- Add more detailed analytics
- Set up automated backups
