# 🔥 Firebase Setup Guide

## Quick Setup for Sample Data

### Step 1: Enable Firestore API
1. Visit: https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=student-management-main
2. Click **"ENABLE"** button
3. Wait 2-3 minutes for the API to activate

### Step 2: Configure Firestore Security Rules
1. Go to: https://console.firebase.google.com/project/student-management-main/firestore/rules
2. Replace the existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Development rules - allow all reads/writes
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Click **"Publish"**

### Step 3: Initialize Firestore Database
1. Go to: https://console.firebase.google.com/project/student-management-main/firestore/data
2. Click **"Create database"** if prompted
3. Choose **"Start in test mode"**
4. Select your preferred location

### Step 4: Add Sample Data via App
1. Start your development server: `npm run dev`
2. Log in as a teacher
3. Click **"Add Sample Data"** button in the dashboard
4. Enjoy testing with realistic student data!

## Manual Data Entry (Alternative)

If the automatic method doesn't work, add data manually:

1. Go to Firestore Data: https://console.firebase.google.com/project/student-management-main/firestore/data
2. Click **"Start collection"**
3. Collection ID: `students`
4. Add documents with this structure:

```json
{
  "name": "Alice Johnson",
  "email": "alice.johnson@example.com", 
  "studentId": "STU001",
  "class": "Class 10",
  "marks": {
    "quiz": 35,
    "assignment": 38,
    "midterm": 32,
    "final": 36
  },
  "percentage": 88.75,
  "grade": "A"
}
```

## 🚨 Important Security Note

The rules above are for **DEVELOPMENT ONLY**. For production, use more secure rules like:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /students/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Troubleshooting

### Permission Denied Errors
- ✅ Check that Firestore API is enabled
- ✅ Verify security rules allow writes
- ✅ Make sure you're authenticated

### API Not Enabled Error
- ✅ Visit the API console link above
- ✅ Wait a few minutes after enabling
- ✅ Try refreshing your app

### No Data Showing
- ✅ Check browser console for errors
- ✅ Verify Firebase config in `.env.local`
- ✅ Make sure collection name is `students`

## Features Included in Sample Data

- 📊 **8 Students** with varied performance levels
- 📈 **Complete grade distribution** (A, B, C, D, F grades)
- 🎯 **Realistic marks** for Quiz, Assignment, Midterm, Final
- 📱 **Different classes** (9, 10, 11, 12)
- 🔄 **Automatic percentage calculation**

Perfect for testing the analytics dashboard and all app features!
