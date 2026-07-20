import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthDataContext } from '../../context/AuthContext.jsx'
import { UserDataContext } from '../../context/UserContext.jsx';
import { IoArrowForward } from 'react-icons/io5';
import { RxCross2 } from 'react-icons/rx';


function InviteModal({ setInviteModal, receiverId }) {
  const { serverUrl } = React.useContext(AuthDataContext);
  const { userData } = React.useContext(UserDataContext);
  const [jobs, setJobs] = React.useState([]);
  const [selectedJob, setSelectedJob] = React.useState(null);
  const [success, setSuccess] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  

  // fetching jobs of the recruiter
  React.useEffect(() => {
    const fetchjobs = async () => {
      try {
        const result = await axios.get(serverUrl + '/api/job/getmyjobs', { withCredentials: true });
        setJobs(result.data.jobs ?? []);
      } catch (e) {
        console.error("Error fetching jobs:", e.response?.data?.message);
      }
    }
    fetchjobs();

  }, []);

  const handleCancel = () => {
    setSelectedJob(null);
    setInviteModal(false);
  }


  const handleInvite = async () => {
    if (!selectedJob) {
      toast.error("Please select a job first");
      return;
    }
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const result = await axios.post(`${serverUrl}/api/invite/${receiverId}`, { jobId: selectedJob._id }, { withCredentials: true });
      console.log("Invite sent:", result.data);
      setSuccess("Invite sent successfully!");
      setTimeout(() => {
        setInviteModal(false);
      }, 1500)
    } catch (e) {
      const message = e.response?.data?.message;
      if (e.response?.status === 400) {
        setError(message); // "Invite already sent for this job"
      } else {
        setError("Failed to send invite. Try again.");
      }
      console.error("Error in sending invite", e.response?.data?.message || e.message);
    } finally {
      setLoading(false);
    }

  }


  return (
    <div className="w-full flex justify-center items-center h-screen fixed inset-0 bg-black/50 z-50">
      <div className="bg-white rounded-xl h-auto w-[90%] md:max-w-md p-6 flex flex-col gap-4">

        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-800">Select Job to Invite</h2>
          <RxCross2
            onClick={handleCancel}
            className="w-5 h-5 cursor-pointer text-gray-500 hover:text-gray-700"
          />
        </div>

        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
          {jobs.map((job, index) => (
            <div
              key={job._id || index}
              onClick={() => setSelectedJob(job)}
              className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer
                ${selectedJob?._id === job._id
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:bg-gray-50'}`}
            >
              <div className="flex flex-col flex-1">
                <h3 className="text-sm font-medium text-gray-800">
                  {userData?.organization?.organizationName}
                </h3>
                <h4 className="text-xs text-gray-500">{job.title}</h4>
              </div>
              <IoArrowForward
                onClick={(e) => {
                  e.stopPropagation(); // prevent selecting job when clicking arrow
                  navigate(`/job/recruiter/${job._id}`);
                }}
                className="text-gray-400 hover:text-gray-600"
              />
            </div>
          ))}
        </div>

        {selectedJob && (
          <p className="text-sm text-gray-500 italic">
            {`Inviting to apply for ${selectedJob.title} at ${userData?.organization?.organizationName}`}
          </p>
        )}

        {error && <p className="text-sm text-red-500 break-words">{error}</p>}
        {success && <p className="text-sm text-emerald-500">{success}</p>}

        <div className="flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
        <button
  onClick={handleInvite}
  disabled={!selectedJob || loading}
  className="relative min-w-[110px] h-9 px-4 py-2 bg-blue-500 text-white font-medium rounded-lg text-sm 
             hover:bg-blue-600 active:bg-blue-700
             disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500
             transition-all duration-200 ease-in-out
             flex items-center justify-center"
>
  {loading ? (
    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
  ) : (
    "Send Invite"
  )}
</button>
        </div>

      </div>
    </div>
  )
}

export default InviteModal
