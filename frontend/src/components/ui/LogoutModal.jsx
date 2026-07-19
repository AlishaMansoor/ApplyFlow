import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthDataContext } from '../../context/AuthContext.jsx';
import {UserDataContext} from '../../context/UserContext.jsx';

const LogoutModal = ({ setLogoutModal }) => {
  const { serverUrl } = React.useContext(AuthDataContext);
  const {setUserData} = React.useContext(UserDataContext);
  const navigate = useNavigate();

  const confirmLogout = async () => {
    try {
      await axios.post(serverUrl + '/api/auth/logout', {}, { withCredentials: true });
      setUserData(null); // Clear user data in context
      navigate('/login');
    } catch (e) {
      console.error("Logout failed:", e);
    }
  }

  return (
    <>
      {/* background freeze overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => setLogoutModal(false)}  // click outside to close
      />

      {/* modal box */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                      bg-white rounded-2xl shadow-xl z-50 p-6 w-[80%] max-w-[320px] 
                      flex flex-col gap-4">
        
        <h2 className="text-lg font-semibold text-gray-800">Logout</h2>
        <p className="text-gray-500 text-sm">Are you sure you want to logout?</p>

        <div className="flex gap-3 justify-end mt-2">
          <button
            onClick={() => setLogoutModal(false)}
            className="px-4 py-2 rounded-lg border border-gray-200 
                       text-gray-600 hover:bg-gray-50 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={confirmLogout}
            className="px-4 py-2 rounded-lg bg-red-500 text-white 
                       hover:bg-red-600 text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </>
  )
}

export default LogoutModal;