import React from 'react'
import { UserDataContext } from '../../context/UserContext.jsx'
import { AuthDataContext } from '../../context/AuthContext.jsx';
import { IoLocationOutline } from 'react-icons/io5'
import { FaCheck } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import axios from 'axios';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

function CreateJobModal({ setCreateJobOpen }) {
  const { userData } = React.useContext(UserDataContext);
  const { serverUrl } = React.useContext(AuthDataContext);

  const [title, setTitle] = React.useState('');
  const [experience, setExperience] = React.useState('');
  const [skill, setSkill] = React.useState('');
  const [skillArray, setSkillArray] = React.useState([]);
  const [description, setDescription] = React.useState('');
  const [salaryRange, setSalaryRange] = React.useState({
    min: '0',
    max: '0',
    currency: 'INR'
  });
  const [jobType, setJobType] = React.useState('Full-time');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);


  const addSkill = () => {
    if (!skill.trim()) return;
    console.log("previous", skillArray);
    if (skillArray.map(a => a.toLowerCase()).includes(skill.trim().toLowerCase())) {
      toast.error("Skill already added");
      return;
    }

    setSkillArray([...skillArray, skill.trim()]);
    console.log(skillArray);
    setSkill('');
  }


  const removeSkill = (indextodelete) => {
    setSkillArray(skillArray.filter((_, i) => i !== indextodelete));
  };

  const handleJobPost = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      setSuccess(null);
      setError(null);
      if (!title) {
        setError("Job role is mandatory.");
        return;
      }
      if (!experience) {
        setError("Experience is mandatory.");
        return;
      }
      if (skillArray.length == 0) {
        setError("Atleast one skill is required.");
        return;
      }
      if (!jobType) {
        setError("Select Job Type");
        return;
      }
      if (!salaryRange.min || !salaryRange.max || Number(salaryRange.min) === 0 || Number(salaryRange.max) === 0) {
        setError("fill out the salary range");
        return;
      }
      if (salaryRange.min == salaryRange.max) {
        setError("Minimum salary and Maximum salary should differ!");
        return;
      }
      if (Number(salaryRange.min) > Number(salaryRange.max)) {
        setError("Invalid salary, Minimum salary should be less than Maximum salary");
        return;
      }
      if(!description){
        setError("PRovide descriotion for the job.");
        return;
      }

      const result = await axios.post(`${serverUrl}/api/job/createjob`, {
        title,
        experience,
        skillsRequired: skillArray,
        description,
        salaryRange: {
          min: Number(salaryRange.min),
          max: Number(salaryRange.max),
          currency: salaryRange.currency
        },
        jobType,
        companyName: userData.organization.organizationName,
        location: userData.location
      }, { withCredentials: true });
      console.log(result.data);
      setSuccess("Job posted successfully!");
      toast.success("Job posted successfully!");
      setTimeout(() => { setCreateJobOpen(false) }, 2500);
    } catch (e) {
      console.error("Error posting job:", e);
      console.error("Backend message:", e?.response?.data);
      setError("Failed to post job.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div>

      </div>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="bg-white relative max-h-[90vh] overflow-y-auto w-[90%] md:max-w-3xl p-6 rounded-xl shadow-xl flex flex-col gap-4"
        >
          <button onClick={() => setCreateJobOpen(false)}
            className="absolute right-2 top-3 text-gray-600 hover:text-gray-800 ">
            <RxCross2 className="w-7 h-7" />
          </button>

          <h2 className="text-lg font-semibold text-gray-700 mb-1">Post a job</h2>
          <div className="flex flex-col  gap-2 p-1 rounded">
            <div className="flex items-center gap-2 font-medium text-gray-600">
              {userData.companyLogo ? (
                <img src={userData.companyLogo} alt="company logo" className="w-10 h-10 rounded-full border-2 border-emerald-500" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                  {userData?.organization?.organizationName?.charAt(0)}
                </div>
              )}
              <span className='font-semibold inline-block'> {userData.organization.organizationName}</span>
            </div>
            <div className="flex items-center gap-2 pl-1 text-sm font-medium text-gray-500">
              <IoLocationOutline className='w-5 h-5 text-gray-500 ' />
              <span>{userData?.location}</span>
            </div>
          </div>

          <form onSubmit={handleJobPost} className="flex flex-col gap-2">

            <div className="flex flex-col gap-1">
              <label className='font-medium text-sm text-gray-500'>Job Title*</label>
              <input type="text" name="title" placeholder="Role" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full focus:outline-none focus:border-gray-400 border-2 border-gray-300 rounded-lg p-2 mb-4" />
            </div>

            <div>
              <label className='font-medium text-sm text-gray-500'>Experience*</label>
              <input type="number" name="experience" min={0} max={20} placeholder='0/1/2/3....Years Of Experience' value={experience} onChange={(e) => setExperience(e.target.value)} className="w-full border-2 focus:outline-none focus:border-gray-400 border-gray-300 rounded-lg p-2 mb-4" />
            </div>

            <div>
              <label className='font-medium text-sm text-gray-500'>Skills Required*</label>
              <div className='p-0 relative'>
                <input type="text" name='skill' placeholder='React / JavaScript / Node.js / DSA' value={skill} onChange={(e) => setSkill(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} className="w-full  border-2 focus:outline-none focus:border-gray-400 border-gray-300 rounded-lg p-2 mb-4" />
                <button type='button' onClick={() => { addSkill() }} className="absolute right-3 top-1 w-8 h-8  flex items-center justify-center hover:text-emerald-700">
                  <FaCheck className='bg-white text-emerald-600' />
                </button>
              </div>
            </div>

            {skillArray.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-1">
                {skillArray.map((a, index) => (
                  <div key={index} className="flex items-center bg-emerald-100 text-emerald-800 px-3 py-1 text-sm rounded-xl font-medium">
                    {a}
                    <button type="button" onClick={() => removeSkill(index)}
                      className="text-red-400 hover:text-red-600 ml-1">
                      <RxCross2 className="w-4 h-4" />
                    </button>
                  </div>
                )
                )}
              </div>
            )}

            <div>
              <label className='font-medium text-sm text-gray-500'>Job Type</label>
              <select name="jobType" value={jobType} placeholder="Select Type"
                onChange={(e) => setJobType(e.target.value)} className="w-full border-2 focus:outline-none focus:border-gray-400 border-gray-300 rounded-lg text-gray-400 p-2 mb-4">
                {/* <option value="">Select type</option> */}
                <option value="Remote">Remote</option>
                <option value="Full-time">Full-time</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <fieldset>
                <h3 className='font-medium text-base text-gray-500'>Salary</h3>
                <div className="flex flex-col md:flex gap-2">

                  <div>
                    <label htmlFor="minimumsalary" className='font-medium text-sm text-gray-500'>Min</label>
                    <input type="number" min={0} value={salaryRange.min} onChange={(e) => setSalaryRange({ ...salaryRange, min: e.target.value })} className="w-full border-2 focus:outline-none focus:border-gray-400 border-gray-300 rounded-lg p-2 mb-4" />
                  </div>
                  <div>
                    <label htmlFor="maximumsalary" className='font-medium text-sm text-gray-500'>Max</label>
                    <input type="number" value={salaryRange.max} onChange={(e) => setSalaryRange({ ...salaryRange, max: e.target.value })} className="w-full border-2 focus:outline-none focus:border-gray-400 border-gray-300 rounded-lg p-2 mb-4" />
                  </div>
                  <div>
                    <label htmlFor="currency" className='font-medium text-sm text-gray-500'>Currency</label>
                    <select value={salaryRange.currency} onChange={(e) => setSalaryRange({ ...salaryRange, currency: e.target.value })} className="w-full border-2 focus:outline-none focus:border-gray-400 border-gray-300 rounded-lg text-gray-400 p-2 mb-4">
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>

                </div>
                {/* live preview */}
                {salaryRange.min && salaryRange.max && (
                  <p className="text-xs text-emerald-600">
                    {salaryRange.currency} {Number(salaryRange.min).toLocaleString()} - {Number(salaryRange.max).toLocaleString()} per year
                  </p>
                )}
              </fieldset>
            </div>

            <div className='mt-2'>
              <label className='font-medium text-gray-700'>Job Description</label>
              <textarea name="description" placeholder='Describe the role, responsibilities and requirements...' value={description} onChange={(e) => setDescription(e.target.value)} rows={8} className="w-full border-2 focus:outline-none focus:border-gray-400 border-gray-300 rounded-lg p-2 mb-4" />
            </div>
          {error && <div className="bg-white text-red-500 p-2 rounded">*{error}</div>}
          {success && <div className="bg-white text-green-700 p-2 rounded">{success}</div>}

            <button type="submit" disabled={loading} className='right-0 rounded-full text-base font-medium bg-emerald-500 hover:bg-emerald-600 px-4 text-gray-900 py-2'>
              {loading ? "Posting..." : "Post Job"}</button>
          </form>

        </motion.div>
      </div >
    </>
  )
}


export default CreateJobModal
