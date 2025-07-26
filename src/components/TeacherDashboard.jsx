import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { 
  Users, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  BookOpen, 
  BarChart3, 
  GraduationCap,
  User,
  Mail,
  Hash,
  TrendingUp,
  Award,
  Target,
  Download,
  Filter,
  SortAsc,
  Eye,
  Settings,
  Bell
} from 'lucide-react';
import StudentModal from './StudentModal';
import MarksModal from './MarksModal';
import AnalyticsChart from './AnalyticsChart';
import SampleDataManager from './SampleDataManager';
import QuickStudentCreator from './QuickStudentCreator';
import { addSampleStudents } from '../utils/addSampleData';
import toast from 'react-hot-toast';

const TeacherDashboard = () => {
  const { user, logout } = useAuth();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showMarksModal, setShowMarksModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('students');
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    // Filter and sort students
    let filtered = students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterBy === 'all' || 
                           (filterBy === 'passing' && (student.percentage || 0) >= 50) ||
                           (filterBy === 'failing' && (student.percentage || 0) < 50) ||
                           (filterBy === 'excellent' && (student.percentage || 0) >= 80);
      
      return matchesSearch && matchesFilter;
    });

    // Sort students
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'percentage':
          return (b.percentage || 0) - (a.percentage || 0);
        case 'total':
          return (b.total || 0) - (a.total || 0);
        case 'studentId':
          return a.studentId.localeCompare(b.studentId);
        default:
          return 0;
      }
    });

    setFilteredStudents(filtered);
  }, [students, searchTerm, sortBy, filterBy]);

  const fetchStudents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'students'));
      const studentsData = [];
      querySnapshot.forEach((doc) => {
        studentsData.push({ id: doc.id, ...doc.data() });
      });
      setStudents(studentsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students');
      setLoading(false);
    }
  };

  const handleAddSampleData = async () => {
    try {
      const result = await addSampleStudents();
      if (result.success) {
        toast.success('Sample data added successfully!');
        fetchStudents(); // Refresh the student list
      } else {
        toast.error(`Failed to add sample data: ${result.error}`);
      }
    } catch (error) {
      console.error('Error adding sample data:', error);
      toast.error('Failed to add sample data');
    }
  };

  const handleAddStudent = async (studentData) => {
    try {
      const docRef = await addDoc(collection(db, 'students'), {
        ...studentData,
        marks: {
          quiz: 0,
          assignment: 0,
          midterm: 0,
          final: 0
        },
        total: 0,
        percentage: 0,
        grade: 'F',
        createdAt: new Date()
      });
      toast.success('Student added successfully!');
      fetchStudents();
      setShowStudentModal(false);
    } catch (error) {
      console.error('Error adding student:', error);
      toast.error('Failed to add student');
    }
  };

  const handleUpdateStudent = async (studentData) => {
    try {
      const studentRef = doc(db, 'students', selectedStudent.id);
      await updateDoc(studentRef, studentData);
      toast.success('Student updated successfully!');
      fetchStudents();
      setShowStudentModal(false);
      setSelectedStudent(null);
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error('Failed to update student');
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await deleteDoc(doc(db, 'students', studentId));
        toast.success('Student deleted successfully!');
        fetchStudents();
      } catch (error) {
        console.error('Error deleting student:', error);
        toast.error('Failed to delete student');
      }
    }
  };

  const handleUpdateMarks = async (marksData) => {
    try {
      const { quiz, assignment, midterm, final } = marksData;
      const total = quiz + assignment + midterm + final;
      const percentage = (total / 160) * 100;
      
      let grade = 'F';
      if (percentage >= 80) grade = 'A';
      else if (percentage >= 70) grade = 'B';
      else if (percentage >= 60) grade = 'C';
      else if (percentage >= 50) grade = 'D';

      const studentRef = doc(db, 'students', selectedStudent.id);
      await updateDoc(studentRef, {
        marks: marksData,
        total,
        percentage: parseFloat(percentage.toFixed(2)),
        grade
      });
      
      toast.success('Marks updated successfully!');
      fetchStudents();
      setShowMarksModal(false);
      setSelectedStudent(null);
    } catch (error) {
      console.error('Error updating marks:', error);
      toast.error('Failed to update marks');
    }
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'text-green-700 bg-green-100 border-green-200';
      case 'B': return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'C': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'D': return 'text-orange-700 bg-orange-100 border-orange-200';
      default: return 'text-red-700 bg-red-100 border-red-200';
    }
  };

  const exportData = () => {
    const csvContent = [
      ['Name', 'Student ID', 'Email', 'Class', 'Quiz', 'Assignment', 'Midterm', 'Final', 'Total', 'Percentage', 'Grade'],
      ...students.map(student => [
        student.name,
        student.studentId,
        student.email,
        student.class,
        student.marks?.quiz || 0,
        student.marks?.assignment || 0,
        student.marks?.midterm || 0,
        student.marks?.final || 0,
        student.total || 0,
        student.percentage || 0,
        student.grade || 'F'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `students_data_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const passingStudents = students.filter(s => (s.percentage || 0) >= 50).length;
  const averageScore = students.length > 0 ? 
    Math.round(students.reduce((acc, s) => acc + (s.percentage || 0), 0) / students.length) : 0;
  const topPerformer = students.reduce((top, student) => 
    (student.percentage || 0) > (top.percentage || 0) ? student : top, { percentage: 0 });

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
                <div className="text-sm text-gray-500 font-medium">Teacher Portal</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.displayName || 'Teacher'}
                  </div>
                  <div className="text-xs text-gray-500">Administrator</div>
                </div>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName || 'Teacher'}! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Here's what's happening with your students today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{students.length}</p>
                <p className="text-gray-600 font-medium">Total Students</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl">
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>+12% from last month</span>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{passingStudents}</p>
                <p className="text-gray-600 font-medium">Passing Students</p>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl">
                <Award className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <Target className="w-4 h-4 mr-1" />
              <span>{students.length > 0 ? Math.round((passingStudents / students.length) * 100) : 0}% pass rate</span>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{averageScore}%</p>
                <p className="text-gray-600 font-medium">Class Average</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-blue-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>Above national average</span>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{students.filter(s => s.grade === 'A').length}</p>
                <p className="text-gray-600 font-medium">A Grade Students</p>
              </div>
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-3 rounded-xl">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
            </div>
            {topPerformer.name && (
              <div className="mt-4 text-sm text-gray-600">
                <span>Top: {topPerformer.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('students')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'students'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Students ({students.length})</span>
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

          {activeTab === 'students' && (
            <div className="p-6">
              {/* Controls */}
              <div className="flex flex-col lg:flex-row justify-between items-center mb-6 space-y-4 lg:space-y-0">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 w-full sm:w-80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <select
                      value={filterBy}
                      onChange={(e) => setFilterBy(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm"
                    >
                      <option value="all">All Students</option>
                      <option value="passing">Passing (≥50%)</option>
                      <option value="failing">Failing (&lt;50%)</option>
                      <option value="excellent">Excellent (≥80%)</option>
                    </select>
                    
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm"
                    >
                      <option value="name">Sort by Name</option>
                      <option value="percentage">Sort by Percentage</option>
                      <option value="total">Sort by Total Score</option>
                      <option value="studentId">Sort by Student ID</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={exportData}
                    className="bg-gray-600 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition-colors flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                  {students.length === 0 && (
                    <button
                      onClick={handleAddSampleData}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
                    >
                      <Users className="w-4 h-4" />
                      <span>Add Sample Data</span>
                    </button>
                  )}
                  <button
                    onClick={() => setShowStudentModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Student</span>
                  </button>
                </div>
              </div>

              {/* Students Table */}
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student ID
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Class
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Score
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Percentage
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Grade
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white/30 divide-y divide-gray-200">
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-white/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-12 w-12">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                                  <span className="text-white font-bold text-lg">
                                    {student.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                <div className="text-sm text-gray-500 flex items-center">
                                  <Mail className="w-3 h-3 mr-1" />
                                  {student.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900">
                              <Hash className="w-4 h-4 mr-1 text-gray-400" />
                              {student.studentId}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {student.class}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            {student.total || 0}/160
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                                <div 
                                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${Math.min((student.percentage || 0), 100)}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-900">{student.percentage || 0}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getGradeColor(student.grade)}`}>
                              {student.grade || 'F'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedStudent(student);
                                  setShowMarksModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                title="Update Marks"
                              >
                                <BookOpen className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedStudent(student);
                                  setShowStudentModal(true);
                                }}
                                className="text-yellow-600 hover:text-yellow-900 p-2 rounded-lg hover:bg-yellow-50 transition-colors"
                                title="Edit Student"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteStudent(student.id)}
                                className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                                title="Delete Student"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {filteredStudents.length === 0 && !searchTerm && filterBy === 'all' && (
                <div className="space-y-8">
                  <div className="text-center py-12">
                    <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center mb-6">
                      <Users className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No students found</h3>
                    <p className="text-gray-500 mb-6">Get started by adding sample data or creating your first student.</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <SampleDataManager onDataAdded={fetchStudents} />
                    <QuickStudentCreator onStudentAdded={fetchStudents} />
                  </div>

                  <div className="text-center">
                    <p className="text-gray-500 mb-4">Or add students manually</p>
                    <button
                      onClick={() => setShowStudentModal(true)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Add Your First Student
                    </button>
                  </div>
                </div>
              )}

              {filteredStudents.length === 0 && (searchTerm || filterBy !== 'all') && (
                <div className="text-center py-16">
                  <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center mb-6">
                    <Users className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No students found</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your search terms or filters.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="p-6">
              <AnalyticsChart students={students} />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showStudentModal && (
        <StudentModal
          student={selectedStudent}
          onSave={selectedStudent ? handleUpdateStudent : handleAddStudent}
          onClose={() => {
            setShowStudentModal(false);
            setSelectedStudent(null);
          }}
        />
      )}

      {showMarksModal && selectedStudent && (
        <MarksModal
          student={selectedStudent}
          onSave={handleUpdateMarks}
          onClose={() => {
            setShowMarksModal(false);
            setSelectedStudent(null);
          }}
        />
      )}
    </div>
  );
};

export default TeacherDashboard;
