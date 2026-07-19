import axios from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthDataContext } from '../../context/AuthContext.jsx';
import { UserDataContext } from '../../context/UserContext.jsx';

const DeleteApplicationModal = ({ setDeleteModal, applicationId, deleteApplication }) => {
  const { serverUrl } = React.useContext(AuthDataContext);

  //  const deleteApplication = async (applicationid) => {
  //         try {
  //             const response = await axios.delete(serverUrl + '/api/application/delete/'+applicationid, { withCredentials: true })
  //             setApplication(prev=> prev.filter(a=>a._id !== applicationid));
  //         } catch (e) {
  //             console.error("Error withdrawing application:", e);
  //         }
  //     }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setDeleteModal(false)} />

      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                      bg-white rounded-2xl shadow-xl z-50 p-6 w-[80%] max-w-[320px] 
                      flex flex-col gap-4">

        <h2 className="text-lg font-semibold text-gray-800">Withdraw Application</h2>
        <p className="text-gray-500 text-sm">Are you sure you want to withdraw this application?</p>

        <div className="flex gap-3 justify-end mt-2">
          <button
            onClick={() => setDeleteModal(false)}
            className="px-4 py-2 rounded-lg border border-gray-200 
                       text-gray-600 hover:bg-gray-50 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => { deleteApplication(applicationId); setDeleteModal(false); }}
            className="px-4 py-2 rounded-lg bg-red-500 text-white 
                       hover:bg-red-600 text-sm"
          >
            Withdraw
          </button>
        </div>

      </div>
    </>
  )
}

export default DeleteApplicationModal;