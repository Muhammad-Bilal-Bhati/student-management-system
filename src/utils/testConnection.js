import { db } from '../firebase.js';
import { collection, addDoc } from 'firebase/firestore';

// Test function to verify Firebase connection
export const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    
    // Try to add a test document (we'll delete it immediately)
    const testDoc = await addDoc(collection(db, 'test'), {
      message: 'Connection test',
      timestamp: new Date()
    });
    
    console.log('✅ Firebase connection successful!');
    console.log('Test document ID:', testDoc.id);
    
    return { success: true, message: 'Firebase connected successfully' };
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return { success: false, error: error.message };
  }
};

// Test function to verify environment variables
export const testEnvironmentVariables = () => {
  const requiredVars = [
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_STORAGE_BUCKET',
    'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_APP_ID'
  ];

  const missing = [];
  const present = [];

  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      present.push(varName);
    } else {
      missing.push(varName);
    }
  });

  console.log('Environment Variables Check:');
  console.log('✅ Present:', present);
  if (missing.length > 0) {
    console.log('❌ Missing:', missing);
  }

  return {
    allPresent: missing.length === 0,
    present,
    missing
  };
};
