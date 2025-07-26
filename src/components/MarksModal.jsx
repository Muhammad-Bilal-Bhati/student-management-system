import React, { useState, useEffect } from 'react';
import { X, BookOpen, Award, BarChart3, GraduationCap, Save, Calculator, Trophy, Target } from 'lucide-react';

const MarksModal = ({ student, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    quiz: 0,
    assignment: 0,
    midterm: 0,
    final: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (student && student.marks) {
      setFormData({
        quiz: student.marks.quiz || 0,
        assignment: student.marks.assignment || 0,
        midterm: student.marks.midterm || 0,
        final: student.marks.final || 0
      });
    }
  }, [student]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const numericData = {
        quiz: Number(formData.quiz),
        assignment: Number(formData.assignment),
        midterm: Number(formData.midterm),
        final: Number(formData.final)
      };
      await onSave(numericData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numValue = Math.min(40, Math.max(0, Number(value) || 0));
    setFormData({
      ...formData,
      [name]: numValue
    });
  };

  const total = formData.quiz + formData.assignment + formData.midterm + formData.final;
  const percentage = ((total / 160) * 100).toFixed(1);

  const getGrade = (percentage) => {
    if (percentage >= 80) return { grade: 'A', color: 'from-green-500 to-emerald-500', textColor: 'text-green-700' };
    if (percentage >= 70) return { grade: 'B', color: 'from-blue-500 to-indigo-500', textColor: 'text-blue-700' };
    if (percentage >= 60) return { grade: 'C', color: 'from-yellow-500 to-orange-500', textColor: 'text-yellow-700' };
    if (percentage >= 50) return { grade: 'D', color: 'from-orange-500 to-red-500', textColor: 'text-orange-700' };
    return { grade: 'F', color: 'from-red-500 to-red-600', textColor: 'text-red-700' };
  };

  const gradeInfo = getGrade(percentage);

  const subjects = [
    { 
      key: 'quiz', 
      label: 'Quiz', 
      icon: BookOpen, 
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    { 
      key: 'assignment', 
      label: 'Assignment', 
      icon: Award, 
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    { 
      key: 'midterm', 
      label: 'Midterm', 
      icon: BarChart3, 
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    { 
      key: 'final', 
      label: 'Final Exam', 
      icon: GraduationCap, 
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-2xl transform animate-slideUp border border-white/20 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative overflow-hidden rounded-t-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
          <div className="relative flex items-center justify-between p-6 text-white">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-xl">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Update Marks</h2>
                <p className="text-sm opacity-90">
                  {student?.name} - {student?.studentId}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Grade Preview */}
          <div className={`bg-gradient-to-r ${gradeInfo.color} rounded-2xl p-6 text-white`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-xl">
                  <Trophy className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-3xl font-bold">{gradeInfo.grade}</div>
                  <div className="text-sm opacity-90">Current Grade</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{percentage}%</div>
                <div className="text-sm opacity-90">{total}/160 Total</div>
              </div>
            </div>
            
            <div className="mt-4 bg-white/20 rounded-lg p-3">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{percentage}%</span>
              </div>
              <div className="bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Marks Input */}
          <div className="grid md:grid-cols-2 gap-6">
            {subjects.map((subject) => {
              const IconComponent = subject.icon;
              const percentage = ((formData[subject.key] / 40) * 100).toFixed(0);
              
              return (
                <div key={subject.key} className={`${subject.bgColor} border ${subject.borderColor} rounded-2xl p-6`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`bg-gradient-to-r ${subject.color} p-2 rounded-lg`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700">
                          {subject.label}
                        </label>
                        <div className="text-xs text-gray-500">Out of 40 marks</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {formData[subject.key]}/40
                      </div>
                      <div className="text-xs text-gray-500">{percentage}%</div>
                    </div>
                  </div>
                  
                  <input
                    type="number"
                    name={subject.key}
                    value={formData[subject.key]}
                    onChange={handleChange}
                    min="0"
                    max="40"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/70 backdrop-blur-sm transition-all duration-200 text-center text-lg font-semibold"
                    placeholder="0"
                  />
                  
                  <div className="mt-3 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${subject.color} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{total}</div>
              <div className="text-sm text-gray-600">Total Score</div>
              <div className="text-xs text-gray-500">out of 160</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{percentage}%</div>
              <div className="text-sm text-gray-600">Percentage</div>
              <div className="text-xs text-gray-500">Overall</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <div className={`text-2xl font-bold ${gradeInfo.textColor}`}>{gradeInfo.grade}</div>
              <div className="text-sm text-gray-600">Grade</div>
              <div className="text-xs text-gray-500">Current</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {formData.quiz + formData.assignment + formData.midterm + formData.final > 0 ? 
                  Math.round(((formData.quiz + formData.assignment + formData.midterm + formData.final) / 4)) : 0}
              </div>
              <div className="text-sm text-gray-600">Average</div>
              <div className="text-xs text-gray-500">per subject</div>
            </div>
          </div>

          {/* Performance Insights */}
          {total > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
              <h4 className="font-bold text-blue-800 mb-3 flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Performance Insights
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold text-blue-700 mb-2">Strongest Areas:</h5>
                  <div className="space-y-1">
                    {subjects
                      .filter(subject => ((formData[subject.key] / 40) * 100) >= 75)
                      .map(subject => (
                        <div key={subject.key} className="text-sm text-green-700">
                          • {subject.label} ({((formData[subject.key] / 40) * 100).toFixed(0)}%)
                        </div>
                      ))
                    }
                    {subjects.filter(subject => ((formData[subject.key] / 40) * 100) >= 75).length === 0 && (
                      <div className="text-sm text-gray-600">No subjects above 75% yet</div>
                    )}
                  </div>
                </div>
                <div>
                  <h5 className="font-semibold text-orange-700 mb-2">Needs Improvement:</h5>
                  <div className="space-y-1">
                    {subjects
                      .filter(subject => ((formData[subject.key] / 40) * 100) < 60)
                      .map(subject => (
                        <div key={subject.key} className="text-sm text-orange-700">
                          • {subject.label} ({((formData[subject.key] / 40) * 100).toFixed(0)}%)
                        </div>
                      ))
                    }
                    {subjects.filter(subject => ((formData[subject.key] / 40) * 100) < 60).length === 0 && (
                      <div className="text-sm text-gray-600">All subjects performing well!</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update Marks</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MarksModal;
