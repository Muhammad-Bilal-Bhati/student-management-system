import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AnalyticsChart = ({ students }) => {
  // Prepare data for grade distribution
  const gradeDistribution = students.reduce((acc, student) => {
    const grade = student.grade || 'F';
    acc[grade] = (acc[grade] || 0) + 1;
    return acc;
  }, {});

  const gradeData = Object.entries(gradeDistribution).map(([grade, count]) => ({
    grade,
    count,
    percentage: ((count / students.length) * 100).toFixed(1)
  }));

  // Prepare data for marks comparison
  const marksData = students.map(student => ({
    name: student.name.split(' ')[0], // First name only for better display
    quiz: student.marks?.quiz || 0,
    assignment: student.marks?.assignment || 0,
    midterm: student.marks?.midterm || 0,
    final: student.marks?.final || 0,
    total: student.total || 0
  }));

  // Colors for pie chart
  const COLORS = {
    'A': '#10b981',
    'B': '#3b82f6',
    'C': '#f59e0b',
    'D': '#f97316',
    'F': '#ef4444'
  };

  const averageMarks = students.length > 0 ? {
    quiz: Math.round(students.reduce((acc, s) => acc + (s.marks?.quiz || 0), 0) / students.length),
    assignment: Math.round(students.reduce((acc, s) => acc + (s.marks?.assignment || 0), 0) / students.length),
    midterm: Math.round(students.reduce((acc, s) => acc + (s.marks?.midterm || 0), 0) / students.length),
    final: Math.round(students.reduce((acc, s) => acc + (s.marks?.final || 0), 0) / students.length),
  } : { quiz: 0, assignment: 0, midterm: 0, final: 0 };

  const averageData = [
    { component: 'Quiz', average: averageMarks.quiz, total: 40 },
    { component: 'Assignment', average: averageMarks.assignment, total: 25 },
    { component: 'Midterm', average: averageMarks.midterm, total: 45 },
    { component: 'Final', average: averageMarks.final, total: 75 }
  ];

  if (students.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <BarChart className="mx-auto h-16 w-16" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
        <p className="text-gray-500">Add students to view analytics and performance charts.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Grade Distribution */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h3>
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gradeData}
                  dataKey="count"
                  nameKey="grade"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ grade, percentage }) => `${grade}: ${percentage}%`}
                >
                  {gradeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.grade]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col justify-center">
            <div className="space-y-3">
              {gradeData.map((grade) => (
                <div key={grade.grade} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded mr-3"
                      style={{ backgroundColor: COLORS[grade.grade] }}
                    ></div>
                    <span className="font-medium">Grade {grade.grade}</span>
                  </div>
                  <span className="text-gray-600">{grade.count} students ({grade.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Average Performance by Component */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Performance by Component</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={averageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="component" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="average" fill="#3b82f6" name="Average Score" />
            <Bar dataKey="total" fill="#e5e7eb" name="Total Possible" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Individual Student Performance */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Individual Student Performance</h3>
        <div className="overflow-x-auto">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={marksData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quiz" stackId="a" fill="#10b981" name="Quiz" />
              <Bar dataKey="assignment" stackId="a" fill="#3b82f6" name="Assignment" />
              <Bar dataKey="midterm" stackId="a" fill="#f59e0b" name="Midterm" />
              <Bar dataKey="final" stackId="a" fill="#8b5cf6" name="Final" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Statistics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-500 uppercase">Highest Score</h4>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {Math.max(...students.map(s => s.total || 0))}/160
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-500 uppercase">Lowest Score</h4>
          <p className="text-2xl font-bold text-red-600 mt-2">
            {Math.min(...students.map(s => s.total || 0))}/160
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-500 uppercase">Pass Rate</h4>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            {Math.round((students.filter(s => (s.percentage || 0) >= 50).length / students.length) * 100)}%
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-500 uppercase">Class Average</h4>
          <p className="text-2xl font-bold text-purple-600 mt-2">
            {Math.round(students.reduce((acc, s) => acc + (s.percentage || 0), 0) / students.length)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;
