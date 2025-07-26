import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserPlus, Mail, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const QuickStudentCreator = ({ onStudentAdded }) => {
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);

  const createCurrentUserAsStudent = async () => {
    if (!user || !user.email) {
      toast.error('User information not available');
      return;
    }

    setIsCreating(true);
    try {
      const studentData = {
        name: user.displayName || "Student",
        email: user.email,
        studentId: `STU${Date.now().toString().slice(-6)}`, // Generate unique ID
        class: "Class 11",
        marks: {
          quiz: 0,
          assignment: 0,
          midterm: 0,
          final: 0
        },
        percentage: 0,
        grade: "F"
      };

      await addDoc(collection(db, 'students'), studentData);
      toast.success('Successfully created your student record!');
      if (onStudentAdded) onStudentAdded();
    } catch (error) {
      console.error('Error creating student record:', error);
      if (error.code === 'permission-denied') {
        toast.error('Permission denied! Please update Firestore rules first.');
      } else {
        toast.error('Failed to create student record: ' + error.message);
      }
    } finally {
      setIsCreating(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-green-500 p-3 rounded-xl">
          <UserPlus className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-green-900">Quick Student Setup</h3>
          <p className="text-green-700 text-sm">Create your student record instantly</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-green-200 mb-4">
        <div className="flex items-center space-x-3 mb-2">
          <User className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-700">
            <strong>Name:</strong> {user.displayName || "Student"}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <Mail className="w-4 h-4 text-gray-600" />
          <span className="text-sm text-gray-700">
            <strong>Email:</strong> {user.email}
          </span>
        </div>
      </div>

      <button
        onClick={createCurrentUserAsStudent}
        disabled={isCreating}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <UserPlus className="w-4 h-4" />
        <span>{isCreating ? 'Creating...' : 'Create My Student Record'}</span>
      </button>

      <div className="mt-3 text-xs text-green-600">
        This will create a student record with your current account details.
      </div>
    </div>
  );
};

export default QuickStudentCreator;
