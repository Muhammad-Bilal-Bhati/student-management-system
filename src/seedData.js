import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

// Firebase configuration for seeding (using actual values for Node.js)
const firebaseConfig = {
  apiKey: "AIzaSyBQoTCBZQW6cddo1SbK8cSJf5L1ukGaq8Q",
  authDomain: "student-management-main.firebaseapp.com",
  projectId: "student-management-main",
  storageBucket: "student-management-main.firebasestorage.app",
  messagingSenderId: "315639000400",
  appId: "1:315639000400:web:3924bd099ce9c6608f9055"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Dummy students data
const dummyStudents = [
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
    total: 141,
    percentage: 88.13,
    grade: "A",
    createdAt: new Date("2024-01-15")
  },
  {
    name: "Bob Smith",
    email: "bob.smith@example.com",
    studentId: "STU002",
    class: "Class 10",
    marks: {
      quiz: 28,
      assignment: 30,
      midterm: 26,
      final: 29
    },
    total: 113,
    percentage: 70.63,
    grade: "B",
    createdAt: new Date("2024-01-16")
  },
  {
    name: "Carol Davis",
    email: "carol.davis@example.com",
    studentId: "STU003",
    class: "Class 9",
    marks: {
      quiz: 32,
      assignment: 35,
      midterm: 30,
      final: 33
    },
    total: 130,
    percentage: 81.25,
    grade: "A",
    createdAt: new Date("2024-01-17")
  },
  {
    name: "David Wilson",
    email: "david.wilson@example.com",
    studentId: "STU004",
    class: "Class 11",
    marks: {
      quiz: 22,
      assignment: 25,
      midterm: 20,
      final: 23
    },
    total: 90,
    percentage: 56.25,
    grade: "D",
    createdAt: new Date("2024-01-18")
  },
  {
    name: "Emma Brown",
    email: "emma.brown@example.com",
    studentId: "STU005",
    class: "Class 12",
    marks: {
      quiz: 37,
      assignment: 39,
      midterm: 35,
      final: 38
    },
    total: 149,
    percentage: 93.13,
    grade: "A",
    createdAt: new Date("2024-01-19")
  },
  {
    name: "Frank Miller",
    email: "frank.miller@example.com",
    studentId: "STU006",
    class: "Class 10",
    marks: {
      quiz: 25,
      assignment: 27,
      midterm: 24,
      final: 26
    },
    total: 102,
    percentage: 63.75,
    grade: "C",
    createdAt: new Date("2024-01-20")
  },
  {
    name: "Grace Taylor",
    email: "grace.taylor@example.com",
    studentId: "STU007",
    class: "Class 9",
    marks: {
      quiz: 30,
      assignment: 32,
      midterm: 28,
      final: 31
    },
    total: 121,
    percentage: 75.63,
    grade: "B",
    createdAt: new Date("2024-01-21")
  },
  {
    name: "Henry Anderson",
    email: "henry.anderson@example.com",
    studentId: "STU008",
    class: "Class 11",
    marks: {
      quiz: 18,
      assignment: 20,
      midterm: 16,
      final: 19
    },
    total: 73,
    percentage: 45.63,
    grade: "F",
    createdAt: new Date("2024-01-22")
  },
  {
    name: "Ivy Chen",
    email: "ivy.chen@example.com",
    studentId: "STU009",
    class: "Class 12",
    marks: {
      quiz: 33,
      assignment: 36,
      midterm: 31,
      final: 34
    },
    total: 134,
    percentage: 83.75,
    grade: "A",
    createdAt: new Date("2024-01-23")
  },
  {
    name: "Jack Thompson",
    email: "jack.thompson@example.com",
    studentId: "STU010",
    class: "Class 10",
    marks: {
      quiz: 26,
      assignment: 28,
      midterm: 25,
      final: 27
    },
    total: 106,
    percentage: 66.25,
    grade: "C",
    createdAt: new Date("2024-01-24")
  },
  {
    name: "Kelly Martinez",
    email: "kelly.martinez@example.com",
    studentId: "STU011",
    class: "Class 9",
    marks: {
      quiz: 29,
      assignment: 31,
      midterm: 27,
      final: 30
    },
    total: 117,
    percentage: 73.13,
    grade: "B",
    createdAt: new Date("2024-01-25")
  },
  {
    name: "Liam Rodriguez",
    email: "liam.rodriguez@example.com",
    studentId: "STU012",
    class: "Class 11",
    marks: {
      quiz: 21,
      assignment: 23,
      midterm: 19,
      final: 22
    },
    total: 85,
    percentage: 53.13,
    grade: "D",
    createdAt: new Date("2024-01-26")
  },
  {
    name: "Mia Garcia",
    email: "mia.garcia@example.com",
    studentId: "STU013",
    class: "Class 12",
    marks: {
      quiz: 36,
      assignment: 37,
      midterm: 34,
      final: 35
    },
    total: 142,
    percentage: 88.75,
    grade: "A",
    createdAt: new Date("2024-01-27")
  },
  {
    name: "Noah Lee",
    email: "noah.lee@example.com",
    studentId: "STU014",
    class: "Class 10",
    marks: {
      quiz: 24,
      assignment: 26,
      midterm: 23,
      final: 25
    },
    total: 98,
    percentage: 61.25,
    grade: "C",
    createdAt: new Date("2024-01-28")
  },
  {
    name: "Olivia White",
    email: "olivia.white@example.com",
    studentId: "STU015",
    class: "Class 9",
    marks: {
      quiz: 31,
      assignment: 33,
      midterm: 29,
      final: 32
    },
    total: 125,
    percentage: 78.13,
    grade: "B",
    createdAt: new Date("2024-01-29")
  }
];

// Function to clear existing data
async function clearExistingData() {
  console.log('🗑️  Clearing existing student data...');
  try {
    const querySnapshot = await getDocs(collection(db, 'students'));
    const deletePromises = querySnapshot.docs.map(docSnapshot => 
      deleteDoc(doc(db, 'students', docSnapshot.id))
    );
    await Promise.all(deletePromises);
    console.log(`✅ Cleared ${querySnapshot.docs.length} existing records`);
  } catch (error) {
    console.error('❌ Error clearing data:', error);
  }
}

// Function to add dummy data
async function addDummyData() {
  console.log('📊 Adding dummy student data to Firebase...');
  try {
    const addPromises = dummyStudents.map(student => 
      addDoc(collection(db, 'students'), student)
    );
    
    await Promise.all(addPromises);
    console.log(`✅ Successfully added ${dummyStudents.length} students to Firebase!`);
    
    // Log summary statistics
    const totalStudents = dummyStudents.length;
    const averageScore = dummyStudents.reduce((sum, student) => sum + student.percentage, 0) / totalStudents;
    const gradeDistribution = dummyStudents.reduce((acc, student) => {
      acc[student.grade] = (acc[student.grade] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n📈 Summary Statistics:');
    console.log(`Total Students: ${totalStudents}`);
    console.log(`Average Score: ${averageScore.toFixed(2)}%`);
    console.log('Grade Distribution:', gradeDistribution);
    
    console.log('\n🎓 Students by Class:');
    const classCounts = dummyStudents.reduce((acc, student) => {
      acc[student.class] = (acc[student.class] || 0) + 1;
      return acc;
    }, {});
    Object.entries(classCounts).forEach(([className, count]) => {
      console.log(`${className}: ${count} students`);
    });
    
  } catch (error) {
    console.error('❌ Error adding dummy data:', error);
  }
}

// Main function
async function seedDatabase() {
  console.log('🚀 Starting database seeding process...\n');
  
  await clearExistingData();
  console.log(''); // Empty line for better formatting
  await addDummyData();
  
  console.log('\n🎉 Database seeding completed successfully!');
  console.log('You can now test the application with realistic student data.');
}

// Run the seeding process
seedDatabase().catch(console.error);
