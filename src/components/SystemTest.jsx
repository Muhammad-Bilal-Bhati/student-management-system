import React, { useState } from 'react';
import { testFirebaseConnection, testEnvironmentVariables } from '../utils/testConnection';
import { CheckCircle, XCircle, Play } from 'lucide-react';

const SystemTest = () => {
  const [firebaseTest, setFirebaseTest] = useState(null);
  const [envTest, setEnvTest] = useState(null);
  const [testing, setTesting] = useState(false);

  const runTests = async () => {
    setTesting(true);
    
    // Test environment variables
    const envResult = testEnvironmentVariables();
    setEnvTest(envResult);
    
    // Test Firebase connection
    const firebaseResult = await testFirebaseConnection();
    setFirebaseTest(firebaseResult);
    
    setTesting(false);
  };

  React.useEffect(() => {
    // Auto-run environment test on mount
    const envResult = testEnvironmentVariables();
    setEnvTest(envResult);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          System Configuration Test
        </h1>
        
        <div className="space-y-6">
          {/* Environment Variables Test */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">Environment Variables</h2>
              {envTest?.allPresent ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
            </div>
            
            {envTest && (
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  <strong>Status:</strong> {envTest.allPresent ? 'All variables present' : 'Missing variables'}
                </div>
                {envTest.missing.length > 0 && (
                  <div className="text-sm text-red-600">
                    <strong>Missing:</strong> {envTest.missing.join(', ')}
                  </div>
                )}
                <div className="text-sm text-green-600">
                  <strong>Found:</strong> {envTest.present.length} variables
                </div>
              </div>
            )}
          </div>

          {/* Firebase Connection Test */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">Firebase Connection</h2>
              {firebaseTest?.success === true ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : firebaseTest?.success === false ? (
                <XCircle className="w-6 h-6 text-red-600" />
              ) : (
                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
              )}
            </div>
            
            {firebaseTest && (
              <div className="text-sm text-gray-600">
                <strong>Status:</strong> {firebaseTest.success ? 'Connected successfully' : firebaseTest.error}
              </div>
            )}
            {!firebaseTest && (
              <div className="text-sm text-gray-500">
                Click "Run Tests" to test Firebase connection
              </div>
            )}
          </div>

          {/* Test Button */}
          <button
            onClick={runTests}
            disabled={testing}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {testing ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Run Connection Tests
              </>
            )}
          </button>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>1. Ensure all environment variables are present</li>
              <li>2. Test Firebase connection</li>
              <li>3. Set up Clerk authentication</li>
              <li>4. Create test user accounts</li>
              <li>5. Start using the application</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemTest;
