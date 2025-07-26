import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const SignInPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center">
              <GraduationCap className="w-8 h-8 text-primary-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">EduManage</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Sign In Form */}
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
              <p className="text-gray-600 mt-2">Sign in to access your dashboard</p>
            </div>
            
            <SignIn 
              appearance={{
                elements: {
                  formButtonPrimary: "bg-primary-600 hover:bg-primary-700 text-white",
                  card: "shadow-none border-0",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "border-2 border-gray-200 hover:border-primary-600",
                  formFieldInput: "border-2 border-gray-200 focus:border-primary-600 focus:ring-primary-600",
                  footerActionLink: "text-primary-600 hover:text-primary-700"
                }
              }}
              redirectUrl="/dashboard"
            />
          </div>
          
          <div className="mt-6 text-center">
            <Link 
              to="/" 
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
