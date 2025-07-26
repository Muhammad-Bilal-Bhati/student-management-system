import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { TrendingUp, Target, Award, BookOpen } from 'lucide-react';

const StudentAnalytics = ({ studentData }) => {
  if (!studentData || !studentData.marks) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <BarChart className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
        <p className="text-gray-500">Analytics will appear here once marks are recorded.</p>
      </div>
    );
  }

  const { marks, percentage = 0, grade = 'F' } = studentData;
  
  // Prepare data for charts
  const subjectData = [
    { subject: 'Quiz', score: marks.quiz || 0, maxScore: 40, percentage: ((marks.quiz || 0) / 40) * 100 },
    { subject: 'Assignment', score: marks.assignment || 0, maxScore: 40, percentage: ((marks.assignment || 0) / 40) * 100 },
    { subject: 'Midterm', score: marks.midterm || 0, maxScore: 40, percentage: ((marks.midterm || 0) / 40) * 100 },
    { subject: 'Final', score: marks.final || 0, maxScore: 40, percentage: ((marks.final || 0) / 40) * 100 }
  ];

  const performanceData = [
    { name: 'Current Performance', value: percentage },
    { name: 'Remaining', value: 100 - percentage }
  ];

  const gradeDistribution = [
    { grade: 'A', threshold: 80, achieved: percentage >= 80 },
    { grade: 'B', threshold: 70, achieved: percentage >= 70 && percentage < 80 },
    { grade: 'C', threshold: 60, achieved: percentage >= 60 && percentage < 70 },
    { grade: 'D', threshold: 50, achieved: percentage >= 50 && percentage < 60 },
    { grade: 'F', threshold: 0, achieved: percentage < 50 }
  ];

  const progressData = [
    { assessment: 'Quiz', target: 75, actual: ((marks.quiz || 0) / 40) * 100 },
    { assessment: 'Assignment', target: 80, actual: ((marks.assignment || 0) / 40) * 100 },
    { assessment: 'Midterm', target: 70, actual: ((marks.midterm || 0) / 40) * 100 },
    { assessment: 'Final', target: 75, actual: ((marks.final || 0) / 40) * 100 }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
  const PIE_COLORS = ['#3b82f6', '#e5e7eb'];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Performance Analytics</h2>
        <p className="text-gray-600">Detailed insights into academic performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Overall Score</p>
              <p className="text-2xl font-bold text-blue-900">{percentage.toFixed(1)}%</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Current Grade</p>
              <p className="text-2xl font-bold text-green-900">{grade}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-xl">
              <Award className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Total Points</p>
              <p className="text-2xl font-bold text-purple-900">{(marks.quiz || 0) + (marks.assignment || 0) + (marks.midterm || 0) + (marks.final || 0)}/160</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-xl">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Best Subject</p>
              <p className="text-2xl font-bold text-orange-900">
                {subjectData.reduce((best, current) => 
                  current.percentage > best.percentage ? current : best
                ).subject}
              </p>
            </div>
            <div className="bg-orange-500 p-3 rounded-xl">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Subject Performance Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="subject" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }} 
              />
              <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={performanceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                startAngle={90}
                endAngle={450}
                paddingAngle={5}
                dataKey="value"
              >
                {performanceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center mt-4">
            <p className="text-2xl font-bold text-gray-900">{percentage.toFixed(1)}%</p>
            <p className="text-sm text-gray-600">Current Performance</p>
          </div>
        </div>

        {/* Progress vs Target */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress vs Target</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="assessment" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }} 
              />
              <Area type="monotone" dataKey="target" stackId="1" stroke="#ef4444" fill="#fef2f2" />
              <Area type="monotone" dataKey="actual" stackId="2" stroke="#10b981" fill="#ecfdf5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Grade Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Breakdown</h3>
          <div className="space-y-4">
            {gradeDistribution.map((item, index) => (
              <div key={item.grade} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white ${
                    item.achieved ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    {item.grade}
                  </div>
                  <span className="font-medium text-gray-700">Grade {item.grade}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-600">≥{item.threshold}%</span>
                  {item.achieved && (
                    <div className="text-xs text-green-600 font-medium">✓ Achieved</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Performance Insights</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Strengths</h4>
            <ul className="space-y-1">
              {subjectData
                .filter(subject => subject.percentage >= 75)
                .map(subject => (
                  <li key={subject.subject} className="text-sm text-green-700">
                    • {subject.subject}: {subject.percentage.toFixed(0)}% (Excellent)
                  </li>
                ))
              }
              {subjectData.filter(subject => subject.percentage >= 75).length === 0 && (
                <li className="text-sm text-gray-600">Focus on improving all subjects</li>
              )}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">Areas for Improvement</h4>
            <ul className="space-y-1">
              {subjectData
                .filter(subject => subject.percentage < 60)
                .map(subject => (
                  <li key={subject.subject} className="text-sm text-orange-700">
                    • {subject.subject}: {subject.percentage.toFixed(0)}% (Needs work)
                  </li>
                ))
              }
              {subjectData.filter(subject => subject.percentage < 60).length === 0 && (
                <li className="text-sm text-green-600">All subjects performing well!</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAnalytics;
