// Utility functions for the Student Management System

export const calculateGrade = (percentage) => {
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
};

export const calculateTotal = (marks) => {
  const { quiz = 0, assignment = 0, midterm = 0, final = 0 } = marks;
  return quiz + assignment + midterm + final;
};

export const calculatePercentage = (total, maxTotal = 160) => {
  return Math.round((total / maxTotal) * 100 * 100) / 100; // Round to 2 decimal places
};

export const getGradeColor = (grade) => {
  switch (grade) {
    case 'A': return 'text-green-600 bg-green-100';
    case 'B': return 'text-blue-600 bg-blue-100';
    case 'C': return 'text-yellow-600 bg-yellow-100';
    case 'D': return 'text-orange-600 bg-orange-100';
    default: return 'text-red-600 bg-red-100';
  }
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const validateMarks = (marks) => {
  const { quiz, assignment, midterm, final } = marks;
  
  if (quiz < 0 || quiz > 40) return 'Quiz marks must be between 0 and 40';
  if (assignment < 0 || assignment > 25) return 'Assignment marks must be between 0 and 25';
  if (midterm < 0 || midterm > 45) return 'Midterm marks must be between 0 and 45';
  if (final < 0 || final > 75) return 'Final marks must be between 0 and 75';
  
  return null; // No errors
};

export const exportToCSV = (students) => {
  const headers = ['Name', 'Student ID', 'Email', 'Class', 'Quiz', 'Assignment', 'Midterm', 'Final', 'Total', 'Percentage', 'Grade'];
  const csvContent = [
    headers.join(','),
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
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `students_data_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
