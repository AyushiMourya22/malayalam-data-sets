import React from 'react'
import { Link } from 'react-router-dom'
import img from "../bg.png"
export const Home = () => {
    return (
        <div className='h-screen bg-gradient-to-r from-[#2c5034] to-[#29b98e] flex justify-center    items-center '>
            <div className="w-1/2 flex justify-center items-center">
                <img src={img} alt="" srcset="" />
            </div>
            <div className='w-1/3 flex justify-center items-center flex-col'>
                <div className='text-[400%] my-[5%] font-bold  text-white '>
                    Annotate your data faster than ever
                </div>
                <div className='flex text-center space-x-10'>
                    <Link to={"/adminlogin"} className=' w-72 border-green-700 border-2  rounded-xl hover:no-underline text-[120%] font-bold bg-white  text-green-700 hover:bg-green-700 hover:text-white px-[8%] py-[4%]'>Admin Login</Link>
                    <Link to={"/login"} className=' w-72 border-green-700 border-2 bg-white rounded-xl text-[120%] hover:no-underline font-bold text-green-700 hover:bg-green-700 hover:text-white px-[8%] py-[4%]'>User Login</Link>
                </div>
            </div>
        </div>
    )
}
