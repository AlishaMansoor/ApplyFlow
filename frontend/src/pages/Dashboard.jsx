import React from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
    const navigate = useNavigate();
    return (
        <div className="w-full h-screen flex justify-center items-center ">
            <div className=' max-w-md w-[80%] h-[350px] flex flex-col justify-start p-8 bg-white rounded-lg shadow-xl gap-4 '>
                <div className='p-2 font-semibold text-lg'>Still in Building State</div>
                <button className="mt-auto bg-emerald-500 ml-2 rounded-md p-1 bottom-0 font-semibold " onClick={() => navigate('/home')}>Back to Home</button>
            </div>
        </div>

    )
}

export default Dashboard
