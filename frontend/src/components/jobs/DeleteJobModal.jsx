import React from 'react'
import axios from 'axios';
import {toast} from 'react-toastify';
import {useNavigate} from 'react-router-dom';
import { AuthDataContext } from '../../context/AuthContext';
import { UserDataContext } from '../../context/UserContext';

function DeleteJobModal( {setDeleteModal,jobId}) {
const { serverUrl } = React.useContext(AuthDataContext);

  const navigate = useNavigate();

  const confirmDelete = async ( jobId ) => {
    try {
      await axios.delete(`${serverUrl}/api/job/${jobId}`, { withCredentials: true });
      toast.success("Job Deleted Successfully.")
      navigate(-1);
    } catch (e) {
      console.error("Error deleting job:", e.response?.data);
    }
  }

  return (
    <>
      {/* background freeze overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => setDeleteModal(false)}  // click outside to close
      />

      {/* modal box */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                      bg-white rounded-2xl shadow-xl z-50 p-6 w-[80%] max-w-[320px] 
                      flex flex-col gap-4">
        
        <h2 className="text-lg font-semibold text-gray-800">Delete Job</h2>
        <p className="text-gray-500 text-sm">Are you sure you want to delete this job?</p>

        <div className="flex gap-3 justify-end mt-2">
          <button
            onClick={() => setDeleteModal(false)}
            className="px-4 py-2 rounded-lg border border-gray-200 
                       text-gray-600 hover:bg-gray-50 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={()=>confirmDelete(jobId)}
            className="px-4 py-2 rounded-lg bg-red-500 text-white 
                       hover:bg-red-600 text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </>
  )
}
export default  DeleteJobModal
