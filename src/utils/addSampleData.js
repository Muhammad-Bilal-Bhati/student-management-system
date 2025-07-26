// Simple function to add sample student data
// This can be called from your React app once Firestore is enabled

import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

export const addSampleStudents = async () => {
  const sampleStudents = [
    {
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      studentId: "STU001",
      class: "Class 10",
      marks: {
        quiz: 35,
        assignment: 38,
        midterm: 32,
        final: 36
      },
      percentage: 88.75,
      grade: "A"
    },
    {
      name: "Bob Smith",
      email: "bob.smith@example.com",
      studentId: "STU002",
      class: "Class 11",
      marks: {
        quiz: 28,
        assignment: 32,
        midterm: 25,
        final: 30
      },
      percentage: 71.875,
      grade: "B"
    },
    {
      name: "Carol Davis",
      email: "carol.davis@example.com",
      studentId: "STU003",
      class: "Class 12",
      marks: {
        quiz: 40,
        assignment: 38,
        midterm: 35,
        final: 38
      },
      percentage: 94.375,
      grade: "A"
    },
    {
      name: "David Wilson",
      email: "david.wilson@example.com",
      studentId: "STU004",
      class: "Class 9",
      marks: {
        quiz: 22,
        assignment: 25,
        midterm: 20,
        final: 23
      },
      percentage: 56.25,
      grade: "D"
    },
    {
      name: "Emma Brown",
      email: "emma.brown@example.com",
      studentId: "STU005",
      class: "Class 10",
      marks: {
        quiz: 32,
        assignment: 35,
        midterm: 30,
        final: 33
      },
      percentage: 81.25,
      grade: "A"
    }
  ];

  try {
    for (const student of sampleStudents) {
      await addDoc(collection(db, 'students'), student);
      console.log(`Added student: ${student.name}`);
    }
    console.log('All sample students added successfully!');
    return { success: true, message: 'Sample data added successfully!' };
  } catch (error) {
    console.error('Error adding sample students:', error);
    return { success: false, error: error.message };
  }
};
