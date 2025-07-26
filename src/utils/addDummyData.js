import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

const dummyStudents = [
  {
    name: "Alice Johnson",
    studentId: "STD001",
    email: "alice.johnson@example.com",
    class: "Computer Science A",
    marks: {
      quiz: 35,
      assignment: 38,
      midterm: 36,
      final: 39
    }
  },
  {
    name: "Bob Smith",
    studentId: "STD002", 
    email: "bob.smith@example.com",
    class: "Computer Science A",
    marks: {
      quiz: 28,
      assignment: 32,
      midterm: 30,
      final: 25
    }
  },
  {
    name: "Carol Williams",
    studentId: "STD003",
    email: "carol.williams@example.com", 
    class: "Computer Science B",
    marks: {
      quiz: 40,
      assignment: 40,
      midterm: 38,
      final: 40
    }
  },
  {
    name: "David Brown",
    studentId: "STD004",
    email: "david.brown@example.com",
    class: "Computer Science B", 
    marks: {
      quiz: 22,
      assignment: 25,
      midterm: 28,
      final: 30
    }
  },
  {
    name: "Eva Davis",
    studentId: "STD005",
    email: "eva.davis@example.com",
    class: "Computer Science A",
    marks: {
      quiz: 33,
      assignment: 35,
      midterm: 32,
      final: 34
    }
  },
  {
    name: "Frank Miller",
    studentId: "STD006", 
    email: "frank.miller@example.com",
    class: "Computer Science C",
    marks: {
      quiz: 18,
      assignment: 20,
      midterm: 22,
      final: 25
    }
  },
  {
    name: "Grace Wilson",
    studentId: "STD007",
    email: "grace.wilson@example.com",
    class: "Computer Science C",
    marks: {
      quiz: 38,
      assignment: 37,
      midterm: 35,
      final: 38
    }
  },
  {
    name: "Henry Taylor",
    studentId: "STD008",
    email: "henry.taylor@example.com", 
    class: "Computer Science B",
    marks: {
      quiz: 31,
      assignment: 29,
      midterm: 33,
      final: 32
    }
  },
  {
    name: "Isabella Garcia",
    studentId: "STD009",
    email: "isabella.garcia@example.com",
    class: "Computer Science A", 
    marks: {
      quiz: 39,
      assignment: 40,
      midterm: 40,
      final: 39
    }
  },
  {
    name: "Jack Anderson",
    studentId: "STD010",
    email: "jack.anderson@example.com",
    class: "Computer Science C",
    marks: {
      quiz: 15,
      assignment: 18,
      midterm: 20,
      final: 22
    }
  }
];

// Calculate grade based on percentage
const calculateGrade = (percentage) => {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
};

// Add calculated fields to student data
const processStudentData = (student) => {
  const { quiz, assignment, midterm, final } = student.marks;
  const total = quiz + assignment + midterm + final;
  const percentage = Math.round((total / 160) * 100 * 100) / 100; // Round to 2 decimal places
  const grade = calculateGrade(percentage);
  
  return {
    ...student,
    total,
    percentage,
    grade,
    createdAt: new Date()
  };
};

export const addDummyStudents = async () => {
  try {
    console.log('Adding dummy students to Firebase...');
    
    // Check if students already exist
    const studentsRef = collection(db, 'students');
    const existingStudents = await getDocs(studentsRef);
    
    if (existingStudents.size > 0) {
      console.log('Students already exist in database. Skipping dummy data creation.');
      return { success: false, message: 'Students already exist' };
    }
    
    // Add each student to Firestore
    const addPromises = dummyStudents.map(async (student) => {
      const processedStudent = processStudentData(student);
      
      // Check if student with this email already exists
      const q = query(studentsRef, where('email', '==', student.email));
      const existingStudent = await getDocs(q);
      
      if (existingStudent.empty) {
        const docRef = await addDoc(studentsRef, processedStudent);
        console.log(`Added student ${student.name} with ID: ${docRef.id}`);
        return { success: true, studentId: docRef.id, name: student.name };
      } else {
        console.log(`Student ${student.name} already exists, skipping...`);
        return { success: false, name: student.name, message: 'Already exists' };
      }
    });
    
    const results = await Promise.all(addPromises);
    const successCount = results.filter(r => r.success).length;
    
    console.log(`Successfully added ${successCount} students to Firebase!`);
    return { 
      success: true, 
      message: `Added ${successCount} students`, 
      results 
    };
    
  } catch (error) {
    console.error('Error adding dummy students:', error);
    return { 
      success: false, 
      message: 'Failed to add students', 
      error: error.message 
    };
  }
};

// Function to clear all students (for testing)
export const clearAllStudents = async () => {
  try {
    const studentsRef = collection(db, 'students');
    const snapshot = await getDocs(studentsRef);
    
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    console.log('All students cleared from database');
    return { success: true, message: 'All students cleared' };
  } catch (error) {
    console.error('Error clearing students:', error);
    return { success: false, message: 'Failed to clear students', error: error.message };
  }
};
