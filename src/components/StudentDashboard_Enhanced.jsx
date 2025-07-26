import React, { useState, useEffect } from 'react';
import { useUser, UserButton } from '@clerk/clerk-react';
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
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const { user } = useUser();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchStudentData();
  }, [user]);

  const fetchStudentData = async () => {
    try {
      if (!user?.emailAddresses?.[0]?.emailAddress) {
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, 'students'), 
        where('email', '==', user.emailAddresses[0].emailAddress)
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

  const getGradeInfo = (grade) => {
    switch (grade) {
      case 'A': 
        return { 
          color: 'from-green-500 to-emerald-500', 
          bgColor: 'bg-green-50', 
          textColor: 'text-green-700',
          icon: Trophy,
          message: 'Excellent Performance!'
        };
      case 'B': 
        return { 
          color: 'from-blue-500 to-indigo-500', 
          bgColor: 'bg-blue-50', 
          textColor: 'text-blue-700',
          icon: Medal,
          message: 'Good Performance!'
        };
      case 'C': 
        return { 
          color: 'from-yellow-500 to-orange-500', 
          bgColor: 'bg-yellow-50', 
          textColor: 'text-yellow-700',
          icon: Star,
          message: 'Satisfactory Performance'
        };
      case 'D': 
        return { 
          color: 'from-orange-500 to-red-500', 
          bgColor: 'bg-orange-50', 
          textColor: 'text-orange-700',
          icon: AlertCircle,
          message: 'Needs Improvement'
        };
      default: 
        return { 
          color: 'from-red-500 to-red-600', 
          bgColor: 'bg-red-50', 
          textColor: 'text-red-700',
          icon: XCircle,
          message: 'Requires Attention'
        };
    }
  };

  const getPerformanceLevel = (percentage) => {
    if (percentage >= 90) return { level: 'Outstanding', color: 'text-green-600', icon: Trophy };
    if (percentage >= 80) return { level: 'Excellent', color: 'text-blue-600', icon: Medal };
    if (percentage >= 70) return { level: 'Good', color: 'text-indigo-600', icon: Star };
    if (percentage >= 60) return { level: 'Satisfactory', color: 'text-yellow-600', icon: CheckCircle };
    if (percentage >= 50) return { level: 'Needs Work', color: 'text-orange-600', icon: AlertCircle };
    return { level: 'Critical', color: 'text-red-600', icon: XCircle };
  };

  const downloadReport = () => {
    if (!studentData) return;
    
    const reportContent = `
STUDENT PERFORMANCE REPORT
===========================

Student Information:
- Name: ${studentData.name}
- Student ID: ${studentData.studentId}
- Class: ${studentData.class}
- Email: ${studentData.email}

Academic Performance:
- Quiz Score: ${studentData.marks?.quiz || 0}/40
- Assignment Score: ${studentData.marks?.assignment || 0}/40
- Midterm Score: ${studentData.marks?.midterm || 0}/40
- Final Score: ${studentData.marks?.final || 0}/40
- Total Score: ${studentData.total || 0}/160
- Percentage: ${studentData.percentage || 0}%
- Grade: ${studentData.grade || 'F'}

Generated on: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${studentData.name}_Performance_Report.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Report downloaded successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white/70 backdrop-blur-sm p-12 rounded-3xl shadow-xl border border-white/20">
          <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center mb-6">
            <User className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Student Record Not Found</h2>
          <p className="text-gray-600 mb-6 max-w-md">
            We couldn't find your student record in our system. Please contact your teacher to get enrolled.
          </p>
          <div className="text-sm text-gray-500">
            Logged in as: {user?.emailAddresses?.[0]?.emailAddress}
          </div>
        </div>
      </div>
    );
  }

  const gradeInfo = getGradeInfo(studentData.grade);
  const performanceLevel = getPerformanceLevel(studentData.percentage || 0);
  const IconComponent = gradeInfo.icon;
  const PerformanceIcon = performanceLevel.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-75"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  EduManage
                </span>
                <div className="text-sm text-gray-500 font-medium">Student Portal</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  {studentData.name}
                </div>
                <div className="text-xs text-gray-500">ID: {studentData.studentId}</div>
              </div>
              <UserButton />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {studentData.name}! 📚
          </h1>
          <p className="text-lg text-gray-600">
            Track your academic progress and achievements
          </p>
        </div>

        {/* Grade Overview Card */}
        <div className="mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            <div className={`bg-gradient-to-r ${gradeInfo.color} p-8 text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 p-4 rounded-2xl">
                    <IconComponent className="w-12 h-12" />
                  </div>
                  <div>
                    <div className="text-6xl font-bold mb-2">{studentData.grade || 'F'}</div>
                    <div className="text-xl opacity-90">{gradeInfo.message}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">{studentData.percentage || 0}%</div>
                  <div className="text-lg opacity-90">Overall Score</div>
                  <div className="mt-2 flex items-center text-sm">
                    <PerformanceIcon className="w-4 h-4 mr-1" />
                    <span>{performanceLevel.level}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{studentData.marks?.quiz || 0}/40</div>
                  <div className="text-gray-600 font-medium">Quiz Score</div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${((studentData.marks?.quiz || 0) / 40) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{studentData.marks?.assignment || 0}/40</div>
                  <div className="text-gray-600 font-medium">Assignment</div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${((studentData.marks?.assignment || 0) / 40) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{studentData.marks?.midterm || 0}/40</div>
                  <div className="text-gray-600 font-medium">Midterm</div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${((studentData.marks?.midterm || 0) / 40) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{studentData.marks?.final || 0}/40</div>
                  <div className="text-gray-600 font-medium">Final Exam</div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${((studentData.marks?.final || 0) / 40) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>Overview</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics</span>
                </div>
              </button>
            </nav>
          </div>

          {activeTab === 'overview' && (
            <div className="p-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Student Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-blue-600" />
                      Student Information
                    </h3>
                    <div className="bg-gray-50/50 rounded-xl p-6 space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Full Name:</span>
                        <span className="text-gray-900 font-semibold">{studentData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Student ID:</span>
                        <span className="text-gray-900 font-semibold">{studentData.studentId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Class:</span>
                        <span className="text-gray-900 font-semibold">{studentData.class}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Email:</span>
                        <span className="text-gray-900 font-semibold">{studentData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Enrollment Date:</span>
                        <span className="text-gray-900 font-semibold">
                          {studentData.createdAt ? new Date(studentData.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Academic Summary */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                      Academic Summary
                    </h3>
                    <div className="bg-gray-50/50 rounded-xl p-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                          <div className="text-2xl font-bold text-blue-600">{studentData.total || 0}</div>
                          <div className="text-sm text-gray-600">Total Score</div>
                          <div className="text-xs text-gray-500">out of 160</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                          <div className={`text-2xl font-bold ${gradeInfo.textColor}`}>{studentData.grade || 'F'}</div>
                          <div className="text-sm text-gray-600">Final Grade</div>
                          <div className="text-xs text-gray-500">Current semester</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Insights */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                      Performance Insights
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Strengths */}
                      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                        <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                          <Trophy className="w-4 h-4 mr-2" />
                          Strengths
                        </h4>
                        <div className="space-y-2">
                          {Object.entries(studentData.marks || {}).map(([subject, score]) => {
                            const percentage = (score / 40) * 100;
                            if (percentage >= 75) {
                              return (
                                <div key={subject} className="flex justify-between text-sm">
                                  <span className="capitalize text-green-700">{subject}</span>
                                  <span className="font-medium text-green-800">{percentage.toFixed(0)}%</span>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>

                      {/* Areas for Improvement */}
                      <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                        <h4 className="font-semibold text-orange-800 mb-3 flex items-center">
                          <Target className="w-4 h-4 mr-2" />
                          Areas for Improvement
                        </h4>
                        <div className="space-y-2">
                          {Object.entries(studentData.marks || {}).map(([subject, score]) => {
                            const percentage = (score / 40) * 100;
                            if (percentage < 60) {
                              return (
                                <div key={subject} className="flex justify-between text-sm">
                                  <span className="capitalize text-orange-700">{subject}</span>
                                  <span className="font-medium text-orange-800">{percentage.toFixed(0)}%</span>
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>

                      {/* Study Recommendations */}
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                        <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Study Recommendations
                        </h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          {(studentData.percentage || 0) < 60 && (
                            <li>• Focus on fundamental concepts and practice regularly</li>
                          )}
                          {(studentData.percentage || 0) >= 60 && (studentData.percentage || 0) < 80 && (
                            <li>• Work on advanced problems to improve understanding</li>
                          )}
                          {(studentData.percentage || 0) >= 80 && (
                            <li>• Continue excellent work and help peers in study groups</li>
                          )}
                          <li>• Review class notes daily and ask questions when unclear</li>
                          <li>• Create a study schedule and stick to it consistently</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-center space-x-4">
                <button
                  onClick={downloadReport}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Report</span>
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className="bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>View Analytics</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="p-8">
              <StudentAnalytics studentData={studentData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
