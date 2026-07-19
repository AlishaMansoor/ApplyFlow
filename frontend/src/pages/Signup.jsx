import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios'
import { AuthDataContext } from '../context/AuthContext.jsx'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext.jsx';
import { LuBriefcaseBusiness } from "react-icons/lu";

const Signup = () => {
  const navigate = useNavigate();
  const { setUserData } = React.useContext(UserDataContext);
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("candidate");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { serverUrl } = React.useContext(AuthDataContext);


  //function for validating form data before sending to backend
  const validateForm = () => {
    if (!firstName.trim()) return "First Name is mandatory";
    if (!lastName.trim()) return "Last Name is mandatory";
    if (!userName.trim()) return "User Name is mandatory";
    if (!email.trim()) return "Email is mandatory";
    if (!password.trim()) return "Password is mandatory";
    if (password.length < 6) return "Password must be at least 6 characters long";
    if (!userType) return "Please select a user type";


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email format";


    if (!password.trim()) return "Password is mandatory";
    if (password.length < 6) return "Password must be at least 6 characters long";


    return null; // no error
  };

  const handleSignup = async (e) => {

    e.preventDefault();
    setError("");        // clear old errors
    setLoading(true);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const data = { firstName, lastName, userName, email, password, userType };
      let userdata = await axios.post(serverUrl + "/api/auth/signup", data, { withCredentials: true })
      console.log("SIGNUP SUCCESS:", userdata.data);
      setUserData(userdata.data.user);
      navigate('/home');
    } catch (err) {
      // console.log("Backend error:", err.response);
      setError(err.response?.data?.message || "Signup failed.Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='w-full h-screen flex justify-start items-center flex-col gap-[30px] bg-[white]'>
      <div className='w-full bg-[#f2f1f1] h-[80px] flex items-center px-5 '>
        <div className="flex items-center gap-2">
          <LuBriefcaseBusiness className="text-emerald-600 w-6 h-6" />
          <span className="font-bold text-xl text-slate-800">
            Apply<span className="text-emerald-600">Flow</span>
          </span>
        </div>
      </div>

      <form noValidate className=' bg-[white] w-[80%] h-[80%] max-w-[400px] flex flex-col items-center justify-center p-10 rounded-2xl md:shadow-[10px_10px_20px_rgba(0,0,0,0.2)] text-gray-600 ' onSubmit={handleSignup} >
        <h1 className='text-3xl font-semibold mt-6 mb-6'>Sign Up</h1>
        <input type='text' placeholder='First Name' className='w-[100%] border-2 focus:outline-none focus:border-2-gray-700 border-gray-500 text-[17px] mb-2 p-1.5 rounded-md ' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        <input type='text' placeholder='Last Name' className='w-[100%] border-2 focus:outline-none focus:border-2-gray-700 border-gray-500 text-[17px] mb-2 p-1.5 rounded-md' value={lastName} onChange={(e) => setLastName(e.target.value)} />
        <input type='text' placeholder='UserName' className='w-[100%] border-2 focus:outline-none focus:border-2-gray-700 border-gray-500 text-[17px] mb-2 p-1.5 rounded-md' value={userName} onChange={(e) => setUserName(e.target.value)} />
        <input type='email' placeholder='Email' className='w-[100%] border-2 focus:outline-none focus:border-2-gray-700 border-gray-500  text-[17px]  mb-2 p-1.5 rounded-md' value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="relative w-full">
          <input type={showPassword ? "text" : "password"} placeholder='Password' required className='w-[100%] border-2 border-gray-500  text-[17px] mb-2 p-1.5   rounded-md' value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="button" className="absolute right-3 top-3 cursor-pointer" onClick={() => setShowPassword(!showPassword)} > {showPassword ? <FaEye className='text-emerald-600' /> : <FaEyeSlash className='text-emerald-600' />} </button>
        </div>
        <p className="w-full ml-3 mt-3 italic">You are :</p>
        
        <div className='w-full flex items-center gap-8 mt-1 ml-3'>

          <div className="gap-2 flex items-center">
            <input type="radio" id='candidate' name='userType' value="candidate" checked={userType === "candidate"} onChange={(e) => setUserType(e.target.value)} className='w-4 h-4' required />
            {/* here candidate is not defined as variable like value={firstName} etc because it is just a string value to be sent to backend to identify user type */}
            <label htmlFor='candidate' className='text-md text-gray-600 italic'>Candidate</label>
          </div>

          <div className="gap-2 flex items-center">
            <input type="radio" id='recruiter' name='userType' value="recruiter" checked={userType === "recruiter"} onChange={(e) => setUserType(e.target.value)} className='w-4 h-4' required />
            <label htmlFor='recruiter' className='text-md text-gray-600 italic'>Recruiter</label>
          </div>

        </div>
        {error && <p className=' w-full text-red-500 text-md mt-2 ml-3'>*{error}</p>}
        <button type='submit' disabled={loading} className='w-full bg-emerald-600 text-white text-lg font-semibold mt-8 p-2 rounded-full'  >{loading ? "Signing Up..." : "Sign Up"}</button>
        <p className='text-center mt-3'>Already have an account? <Link to="/login" className="text-emerald-600 underline">Sign in</Link></p>
      </form>



    </div>
  )
}

export default Signup
