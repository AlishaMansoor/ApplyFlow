import { Link } from 'react-router-dom'
import { useContext, useState } from 'react'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthDataContext } from '../context/AuthContext.jsx';
import { UserDataContext } from '../context/UserContext.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LuBriefcaseBusiness } from "react-icons/lu";
import { FaTimes } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';

const Login = () => {
  const { serverUrl } = useContext(AuthDataContext);
  const { setUserData } = useContext(UserDataContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot Password Modal State
  const [showModal, setShowModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalError, setModalError] = useState("");


  const loginhandler = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);

      if (!email.trim() || !password.trim()) {
        setLoading(false);
        alert("All fields are required");
        return;
      }
      let logindata = {
        email,
        password
      }
      const result = await axios.post(serverUrl + "/api/auth/login", logindata, { withCredentials: true })
      console.log("LOGIN SUCCESS:", result.data);
      setUserData(result.data.user);
      navigate('/home');
    }
    catch (err) {
      console.log("FULL ERROR Object:", err);
      console.log("Backend login error:", err.response);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }




  const forgotPasswordHandler = async (e) => {
    e.preventDefault();
    try {
      setModalError("");
      setModalMessage("");

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(forgotEmail.trim())) {
        console.log("entered email validation check!");
        return setModalError("Please enter a valid email address layout (e.g., name@domain.com).");
      }

      setModalLoading(true);

      if (!forgotEmail.trim()) {
        setModalLoading(false);
        setModalError("Please enter your email address.");
        return;
      }
      const result = await axios.post(`${serverUrl}/api/auth/forgot-password`, { email: forgotEmail });
      setModalMessage(result.data.message || "Reset link sent to your email!");
      setForgotEmail("");
    } catch (err) {
      console.log("Forgot Password Error:", err.response);
      setModalError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex justify-start items-center flex-col gap-[30px] bg-[white]">
      <div className="w-full h-[80px] bg-[#f2f1f1] flex items-center px-5 ">
        <div className="flex items-center gap-2">
          <LuBriefcaseBusiness className="text-emerald-600 w-6 h-6" />
          <span className="font-bold text-xl text-slate-800">
            Apply<span className="text-emerald-600">Flow</span>
          </span>
        </div>
      </div>
      <form onSubmit={loginhandler} noValidate className=' bg-[#ffffff] w-[80%] h-[80%] max-w-[400px] flex flex-col items-center justify-center p-10 rounded-2xl md:shadow-[10px_10px_10px_0px_rgba(0,0,0,0.2)] shadow-[gray] text-gray-600 ' >
        <h1 className='text-3xl font-semibold mt-6 mb-6 '>Sign In</h1>
        <input type='email' placeholder='Email' required className='w-[100%] border-2 border-gray-500 text-[18px] b mb-2 p-1.5 rounded-md' value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="relative w-full">
          <input type={showPassword ? "text" : "password"} placeholder='Password' required className='w-[100%] border-2 border-gray-500 text-[18px] mb-2 p-1.5   rounded-md' value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="button" className="absolute right-3 top-3 cursor-pointer" onClick={() => setShowPassword(!showPassword)} > {showPassword ? <FaEye className='text-emerald-600' /> : <FaEyeSlash className='text-emerald-600' />} </button>
        </div>
        {/* Forgot Password Link Trigger */}
        <div className="w-full flex justify-end mt-1">
          <button type="button" onClick={() => { setShowModal(true); setModalError(""); setModalMessage(""); }} className="text-emerald-600 text-sm hover:underline cursor-pointer">
            Forgot Password?
          </button>
        </div>
        <button type='submit' disabled={loading} className='w-full bg-emerald-600 text-white text-lg mt-8 p-2 rounded-full'>{loading ? "Signing In..." : "Sign In"}</button>
        {error && <p className=" w-full text-red-500 text-lg mt-2 ml-3">*{error}</p>}
        <p className='text-center mt-3'>Don't have an account? <Link to='/signup' className='text-emerald-600 text-decoration-underline'>Sign up</Link></p>
      </form>

      {showModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-[400px] px-5 py-6 rounded-2xl relative flex flex-col items-center shadow-lg text-gray-600">
            <button type="button" onClick={() => setShowModal(false)} className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 cursor-pointer text-xl">
              <RxCross2 className="text-gray-600 w-6 h-6"/>
            </button>

            <h2 className="text-xl font-semibold mb-4 mt-2">Reset Password</h2>
            <p className="text-sm text-gray-500 text-center mb-6">Enter your email address and we'll send you a link to reset your password.</p>

            <form onSubmit={forgotPasswordHandler} className="w-full flex flex-col items-center">
              <input type="email" placeholder="Email Address" required className="w-full border-2 border-gray-500 text-[18px] mb-4 p-1.5 rounded-md" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />

              <button type="submit" disabled={modalLoading} className="w-full mt-4 bg-emerald-600 text-white text-lg p-2  rounded-full transition-all">
                {modalLoading ? "Sending Link..." : "Send Reset Link"}
              </button>

              {modalError && <p className="w-full text-red-500 text-sm mt-3 text-center">*{modalError}</p>}
              {modalMessage && <p className="w-full text-emerald-600 font-medium text-sm mt-3 text-center">{modalMessage}</p>}
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default Login
