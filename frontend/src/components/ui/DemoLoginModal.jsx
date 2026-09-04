import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthDataContext } from '../../context/AuthContext.jsx';
import { UserDataContext } from '../../context/UserContext.jsx';

const DemoLoginModal = ({ demoType, setDemoModal }) => {
  const { serverUrl } = useContext(AuthDataContext);
  const { setUserData } = useContext(UserDataContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const isRecruiter = demoType === 'recruiter';

  const handleDemoLogin = async () => {
    // Map demo accounts based on role selected
    const email = isRecruiter ? 'demorecruiter@gmail.com' : 'democandidate@gmail.com';
    const password = '12345678'; 

    try {
      setLoading(true);
      const result = await axios.post(
        `${serverUrl}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      setUserData(result.data.user);
      setDemoModal(null);
      navigate('/home');
    } catch (e) {
      console.error('Demo login failed:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => !loading && setDemoModal(null)}
      />

      {/* Modal box */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                      bg-white rounded-2xl shadow-xl z-50 p-6 w-[80%] max-w-[320px] 
                      flex flex-col gap-4">
        
        <h2 className="text-lg font-semibold text-gray-800">
          Explore as {isRecruiter ? 'Recruiter' : 'Candidate'}
        </h2>
        
        <p className="text-gray-500 text-sm">
          Are you sure you want to log in with a demo {demoType} account? It lets you do a test drive of the platform without creating an account. Please note that any changes made in demo mode will not be saved.
        </p>

        <div className="flex gap-3 justify-end mt-2">
          <button
            disabled={loading}
            onClick={() => setDemoModal(null)}
            className="px-4 py-2 rounded-lg border border-gray-200 
                       text-gray-600 hover:bg-gray-50 text-sm disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button
            disabled={loading}
            onClick={handleDemoLogin}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white 
                       hover:bg-emerald-700 text-sm font-medium flex items-center justify-center min-w-[80px] disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Continue'}
          </button>
        </div>
      </div>
    </>
  );
};

export default DemoLoginModal;