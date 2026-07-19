import { useContext, useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthDataContext } from '../context/AuthContext.jsx';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { LuBriefcaseBusiness } from "react-icons/lu";

const ResetPassword = () => {
  const { serverUrl } = useContext(AuthDataContext);
  const { token } = useParams(); // Extracts the :token part from route URL
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const resetPasswordHandler = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setSuccessMessage("");

      if (!password.trim() || !confirmPassword.trim()) {
        setError("Both fields are required.");
        return;
      }

      if (password.length < 8) {
      return setError("Password must be at least 8 characters long.");
    }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      setLoading(true);


      const bodyData = { password, confirmPassword };
   
      const result = await axios.put(`${serverUrl}/api/auth/reset-password/${token}`, bodyData);
      
      setSuccessMessage(result.data.message || "Password updated successfully!");
      setPassword("");
      setConfirmPassword("");
      
      // Automatically route back to sign-in page after 3 seconds of success visualization
      

    } catch (err) {
      console.log("Backend Reset Error:", err.response);
      setError(err.response?.data?.message || "Reset request failed or link expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex justify-start items-center flex-col gap-[30px] bg-[white]">
      {/* Header layout matching Login page brand asset */}
      <div className="w-full h-[80px] bg-[#f2f1f1] flex items-center px-5 ">
        <div className="flex items-center gap-2">
          <LuBriefcaseBusiness className="text-emerald-600 w-6 h-6" />
          <span className="font-bold text-xl text-slate-800">
            Apply<span className="text-emerald-600">Flow</span>
          </span>
        </div>
      </div>

      <form onSubmit={resetPasswordHandler} noValidate className='bg-[#ffffff] w-[80%] h-[80%] max-w-[400px] flex flex-col items-center justify-center p-10 rounded-2xl md:shadow-[10px_10px_10px_0px_rgba(0,0,0,0.2)] shadow-[gray] text-gray-600 '>
        <h1 className='text-2xl font-semibold mt-4 text-center leading-tight'>Update Password</h1>
        <p className="text-sm text-gray-400 text-center mb-6 mt-1">Please enter and retype your new account credentials.</p>

        {/* New Password input */}
        <div className="relative w-full mb-3">
          <input type={showPassword ? "text" : "password"} placeholder='New Password' required className='w-[100%] border-2 border-gray-500 text-[18px] p-1.5 rounded-md' value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="button" className="absolute right-3 top-3 cursor-pointer" onClick={() => setShowPassword(!showPassword)} > 
            {showPassword ? <FaEye className='text-emerald-600' /> : <FaEyeSlash className='text-emerald-600' />} 
          </button>
        </div>

        {/* Retype/Confirm password input */}
        <div className="relative w-full mb-2">
          <input type={showConfirmPassword ? "text" : "password"} placeholder='Confirm New Password' required className='w-[100%] border-2 border-gray-500 text-[18px] p-1.5 rounded-md' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          <button type="button" className="absolute right-3 top-3 cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)} > 
            {showConfirmPassword ? <FaEye className='text-emerald-600' /> : <FaEyeSlash className='text-emerald-600' />} 
          </button>
        </div>

        <button type='submit' disabled={loading || successMessage} className='w-full bg-emerald-600 text-white text-lg mt-6 p-2 rounded-full disabled:bg-gray-400'>
          {loading ? "Updating..." : "Save New Password"}
        </button>

        {error && <p className="w-full text-red-500 text-sm mt-3 text-center">*{error}</p>}
        {successMessage && (
          <div className="w-full text-center mt-3">
            <p className="text-emerald-600 font-semibold text-sm">{successMessage}</p>
            <p className="text-xs text-gray-400 mt-1">Redirecting to sign in page...</p>
          </div>
        )}

        <p className='text-center mt-6 text-sm'>Remembered credentials? <Link to='/login' className='text-emerald-600 hover:underline'>Back to Login</Link></p>
      </form>
    </div>
  );
};

export default ResetPassword;