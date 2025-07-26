import React, { useState } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Users, Trash2, Plus, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const SampleDataManager = ({ onDataAdded }) => {
  const { user, userRole } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const getSampleStudents = () => {
    const baseStudents = [
      {
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        studentId: "STU001",
        class: "Class 10",
        marks: { quiz: 35, assignment: 38, midterm: 32, final: 36 },
        percentage: 88.75,
        grade: "A"
      },
      {
        name: "Bob Smith",
        email: "bob.smith@example.com",
        studentId: "STU002",
        class: "Class 11",
        marks: { quiz: 28, assignment: 32, midterm: 25, final: 30 },
        percentage: 71.875,
        grade: "B"
      },
      {
        name: "Carol Davis",
        email: "carol.davis@example.com",
        studentId: "STU003",
        class: "Class 12",
        marks: { quiz: 40, assignment: 38, midterm: 35, final: 38 },
        percentage: 94.375,
        grade: "A"
      },
      {
        name: "David Wilson",
        email: "david.wilson@example.com",
        studentId: "STU004",
        class: "Class 9",
        marks: { quiz: 22, assignment: 25, midterm: 20, final: 23 },
        percentage: 56.25,
        grade: "D"
      },
      {
        name: "Emma Brown",
        email: "emma.brown@example.com",
        studentId: "STU005",
        class: "Class 10",
        marks: { quiz: 32, assignment: 35, midterm: 30, final: 33 },
        percentage: 81.25,
        grade: "A"
      },
      {
        name: "Frank Miller",
        email: "frank.miller@example.com",
        studentId: "STU006",
        class: "Class 11",
        marks: { quiz: 18, assignment: 20, midterm: 15, final: 19 },
        percentage: 45.0,
        grade: "F"
      },
      {
        name: "Grace Lee",
        email: "grace.lee@example.com",
        studentId: "STU007",
        class: "Class 12",
        marks: { quiz: 37, assignment: 40, midterm: 34, final: 39 },
        percentage: 93.75,
        grade: "A"
      }
    ];

    // Add current user as a student if they're not a teacher
    if (user && user.email) {
      
      if (userRole !== 'teacher') {
        const currentUserStudent = {
          name: user.displayName || "Current User",
          email: user.email,
          studentId: "STU999",
          class: "Class 11",
          marks: { quiz: 36, assignment: 39, midterm: 34, final: 37 },
          percentage: 91.25,
          grade: "A"
        };
        
        baseStudents.push(currentUserStudent);
      }
    }

    return baseStudents;
  };

  const addSampleData = async () => {
    setIsAdding(true);
    try {
      const sampleStudents = getSampleStudents();
      let successCount = 0;
      for (const student of sampleStudents) {
        try {
          await addDoc(collection(db, 'students'), student);
          successCount++;
          console.log(`✅ Added: ${student.name}`);
        } catch (error) {
          console.error(`❌ Failed to add ${student.name}:`, error);
          if (error.code === 'permission-denied') {
            toast.error('Permission denied! Please update Firestore rules first.');
            break; // Stop trying if permissions are wrong
          }
        }
      }
      
      if (successCount > 0) {
        toast.success(`Successfully added ${successCount}/${sampleStudents.length} students!`);
        if (onDataAdded) onDataAdded();
      } else if (successCount === 0) {
        toast.error('No data added. Check Firestore rules and try again.');
      }
    } catch (error) {
      console.error('Error adding sample data:', error);
      if (error.code === 'permission-denied') {
        toast.error('Permission denied! Update your Firestore security rules.');
      } else {
        toast.error('Failed to add sample data: ' + error.message);
      }
    } finally {
      setIsAdding(false);
    }
  };

  const clearAllData = async () => {
    if (!window.confirm('Are you sure you want to delete all student data? This cannot be undone.')) {
      return;
    }

    setIsClearing(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'students'));
      let deleteCount = 0;
      
      for (const docSnapshot of querySnapshot.docs) {
        try {
          await deleteDoc(doc(db, 'students', docSnapshot.id));
          deleteCount++;
        } catch (error) {
          console.error(`Failed to delete document ${docSnapshot.id}:`, error);
        }
      }

      if (deleteCount > 0) {
        toast.success(`Successfully deleted ${deleteCount} students`);
        if (onDataAdded) onDataAdded();
      } else {
        toast.error('No data to delete or permission denied');
      }
    } catch (error) {
      console.error('Error clearing data:', error);
      toast.error('Failed to clear data');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-blue-500 p-3 rounded-xl">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-blue-900">Sample Data Manager</h3>
          <p className="text-blue-700 text-sm">Add test data to get started quickly</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <p className="text-amber-800 text-sm font-medium">Setup Required</p>
            <p className="text-amber-700 text-xs mt-1">
              1. Go to Firebase Console → Firestore → Rules<br/>
              2. Set rule: allow read, write: if true;<br/>
              3. Click PUBLISH button
            </p>
            <a 
              href="https://console.firebase.google.com/project/student-management-main/firestore/rules" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800 underline mt-1 inline-block"
            >
              → Open Firestore Rules
            </a>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={addSampleData}
          disabled={isAdding}
          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Adding...' : 'Add Sample Data'}</span>
        </button>

        <button
          onClick={clearAllData}
          disabled={isClearing}
          className="bg-red-600 text-white px-4 py-3 rounded-xl hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="w-4 h-4" />
          <span>{isClearing ? 'Clearing...' : 'Clear All'}</span>
        </button>
      </div>

      <div className="mt-4 text-xs text-blue-600">
        Sample data includes {getSampleStudents().length} students with varied performance levels for testing analytics.
        {user && userRole !== 'teacher' && (
          <span className="block mt-1 text-green-600 font-medium">
            ✅ Your account will be included as a student
          </span>
        )}
      </div>
    </div>
  );
};

export default SampleDataManager;
