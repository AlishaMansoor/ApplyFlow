import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthDataContext } from '../../context/AuthContext.jsx';
import {UserDataContext} from '../../context/UserContext.jsx';

const DeleteResumeModal = ({ setDeleteResumeModal }) => {
  const { serverUrl } = React.useContext(AuthDataContext);
  const {setUserData} = React.useContext(UserDataContext);
  const [success, setSuccess] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const confirmDeleteResume = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      await axios.delete(serverUrl+'/api/user/deleteresume', { withCredentials: true });
      setUserData((prev) => ({ ...prev, resume: null })); // Clear user data in context
      setSuccess("Resume deleted successfully!");
      setTimeout(()=> navigate(-1), 2000);
    } catch (e) {
      console.error("Delete resume failed:", e);
      setError("Failed to delete resume.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* background freeze overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => setDeleteResumeModal(false)}  // click outside to close
      />

      {/* modal box */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                      bg-white rounded-2xl shadow-xl z-50 p-6 w-[80%] max-w-[320px] 
                      flex flex-col gap-4">
        
        <h2 className="text-lg font-semibold text-gray-800">Delete Resume</h2>
        <p className="text-gray-500 text-sm">Are you sure you want to delete your current resume?</p>

        <div className="flex gap-3 justify-end mt-2">
          <button
            onClick={() => setDeleteResumeModal(false)}
            className="px-4 py-2 rounded-lg border border-gray-200 
                       text-gray-600 hover:bg-gray-50 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={confirmDeleteResume}
            className="px-4 py-2 rounded-lg bg-red-500 text-white 
                       hover:bg-red-600 text-sm"
          >
            {loading?"deleting...":"Delete Resume"}
          </button>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-emerald-500 text-sm">{success}</p>}
        </div>
      </div>
    </>
  )
}

export default DeleteResumeModal;