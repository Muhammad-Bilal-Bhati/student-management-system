import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  User, 
  Mail, 
  Hash, 
  BookOpen, 
  Award, 
  BarChart3, 
  GraduationCap,
  TrendingUp,
  Download,
  Trophy,
  Medal,
  Star,
  Target,
  Clock,
  Calendar,
  Eye,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  XCircle,
  Bell,
  Settings
} from 'lucide-react';
import StudentAnalytics from './StudentAnalytics';
import QuickStudentCreator from './QuickStudentCreator';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, [user]);

  const fetchStudentData = async () => {
    try {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, 'students'), 
        where('email', '==', user.email)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        setStudentData({ id: doc.id, ...doc.data() });
      } else {
        toast.error('Student record not found. Please contact your teacher.');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching student data:', error);
      toast.error('Failed to fetch student data');
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-100';
      case 'B': return 'text-blue-600 bg-blue-100';
      case 'C': return 'text-yellow-600 bg-yellow-100';
      case 'D': return 'text-orange-600 bg-orange-100';
      default: return 'text-red-600 bg-red-100';
    }
  };

  const getPerformanceMessage = (percentage) => {
    if (percentage >= 80) return "Excellent performance! Keep up the great work!";
    if (percentage >= 70) return "Good job! You're doing well.";
    if (percentage >= 60) return "Satisfactory performance. There's room for improvement.";
    if (percentage >= 50) return "You're passing, but consider studying harder.";
    return "Your performance needs significant improvement. Please seek help from your teacher.";
  };

  const downloadReport = () => {
    if (!studentData) return;
    
    // Create a simple text report
    const report = `
STUDENT PERFORMANCE REPORT
========================

Student Information:
- Name: ${studentData.name}
- Student ID: ${studentData.studentId}
- Email: ${studentData.email}
- Class: ${studentData.class}

Academic Performance:
- Quiz: ${studentData.marks?.quiz || 0}/40
- Assignment: ${studentData.marks?.assignment || 0}/25
- Midterm: ${studentData.marks?.midterm || 0}/45
- Final: ${studentData.marks?.final || 0}/75

Overall Performance:
- Total Score: ${studentData.total || 0}/160
- Percentage: ${studentData.percentage || 0}%
- Grade: ${studentData.grade || 'F'}

Generated on: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${studentData.name}_Report.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Report downloaded successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <GraduationCap className="w-8 h-8 text-primary-600 mr-2" />
                <span className="text-xl font-bold text-gray-900">EduManage</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {user?.displayName || 'Student'}</span>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
              <User className="mx-auto h-16 w-16 text-gray-400" />
              <h2 className="mt-4 text-2xl font-bold text-gray-900">Student Record Not Found</h2>
              <p className="mt-2 text-gray-600">
                Your student record hasn't been created yet. You can create one instantly or contact your teacher.
              </p>
            </div>

            <QuickStudentCreator onStudentAdded={fetchStudentData} />

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Need help? Contact your teacher to add your information to the system.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <GraduationCap className="w-8 h-8 text-primary-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">EduManage</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {studentData.name}</span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600 mt-2">View your academic performance and progress</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">{studentData.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Hash className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Student ID</p>
                    <p className="font-medium text-gray-900">{studentData.studentId}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{studentData.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <BookOpen className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Class</p>
                    <p className="font-medium text-gray-900">{studentData.class}</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={downloadReport}
                className="w-full mt-6 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </button>
            </div>
          </div>

          {/* Performance Section */}
          <div className="lg:col-span-2">
            {/* Overall Performance Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Overall Performance</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <BarChart3 className="w-8 h-8 text-primary-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{studentData.total || 0}/160</p>
                  <p className="text-gray-600">Total Score</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{studentData.percentage || 0}%</p>
                  <p className="text-gray-600">Percentage</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <Award className="w-8 h-8 text-yellow-600" />
                  </div>
                  <span className={`text-2xl font-bold inline-flex px-3 py-1 rounded-full ${getGradeColor(studentData.grade)}`}>
                    {studentData.grade || 'F'}
                  </span>
                  <p className="text-gray-600 mt-1">Grade</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 text-center">
                  {getPerformanceMessage(studentData.percentage || 0)}
                </p>
              </div>
            </div>

            {/* Detailed Marks */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Detailed Marks</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-lg p-2 mr-3">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Quiz</p>
                      <p className="text-sm text-gray-500">Weekly assessments</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">{studentData.marks?.quiz || 0}/40</p>
                    <p className="text-sm text-gray-500">
                      {Math.round(((studentData.marks?.quiz || 0) / 40) * 100)}%
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-green-100 rounded-lg p-2 mr-3">
                      <Award className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Assignment</p>
                      <p className="text-sm text-gray-500">Project work</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">{studentData.marks?.assignment || 0}/25</p>
                    <p className="text-sm text-gray-500">
                      {Math.round(((studentData.marks?.assignment || 0) / 25) * 100)}%
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-yellow-100 rounded-lg p-2 mr-3">
                      <BarChart3 className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Midterm</p>
                      <p className="text-sm text-gray-500">Mid-semester exam</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">{studentData.marks?.midterm || 0}/45</p>
                    <p className="text-sm text-gray-500">
                      {Math.round(((studentData.marks?.midterm || 0) / 45) * 100)}%
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-purple-100 rounded-lg p-2 mr-3">
                      <GraduationCap className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Final Exam</p>
                      <p className="text-sm text-gray-500">End-semester exam</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">{studentData.marks?.final || 0}/75</p>
                    <p className="text-sm text-gray-500">
                      {Math.round(((studentData.marks?.final || 0) / 75) * 100)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
