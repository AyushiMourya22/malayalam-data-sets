import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AdminContext } from '../AdminContext'
import Cookies from 'js-cookie'

export const AdminLogin = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()


    const handleSubmit = async (ev) => {
        ev.preventDefault()
        try {
            const user = await axios.post("/admin/login", { email, password })
            console.log(user)
            if (user) {
                alert("Login successful")
                const expirationDate = new Date();
                expirationDate.setTime(expirationDate.getTime() + (0.5 * 60 * 60 * 1000)); // 1/2 hour
                Cookies.set("admin", user.data.email, { expires: expirationDate });
                navigate("/adminhome", { replace: true })

            }
        } catch (e) {
            console.log(e)
            alert("Login failed")
        }
    }
    const check = () => {
        // console.log(Cookies.get("user"))
        if (Cookies.get("admin")) {
            alert("Admin already logged in. Redirecting now")
            navigate("/adminhome", { replace: true })
        }
    }
    useEffect(() => {
        check()
    }, [])


    return (
        <div className="bg-gradient-to-r from-[#2c5034] to-[#29b98e] w-full h-screen flex justify-center font-serif items-center">
            <div className="flex bg-white flex-col justify-center w-[25%] px-[2%] py-[2%] rounded-xl ">
                <div className="my-0">
                    {/* <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" /> */}
                    <h2 className=" text-center  font-bold leading-9 tracking-tight text-gray-900">Sign in as Admin</h2>
                </div>

                <div className="mt-[5%] ">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <h4 htmlFor="email" className="block  font-medium leading-6 text-gray-900">Email address</h4>
                            <div className="mt-2">
                                <input onChange={(e) => setEmail(e.target.value)} id="email" name="email" type="email" autoComplete="email" required className="p-3 block w-full rounded-md  border-0  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600" />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <h4 htmlFor="password" className="block font-medium leading-6 text-gray-900">Password</h4>
                            </div>
                            <div className="mt-2">
                                <input onChange={(e) => setPassword(e.target.value)} id="password" name="password" type="password" autoComplete="current-password" required className="p-3 block w-full rounded-md  border-0  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600" />
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="flex w-full justify-center rounded-md bg-white  border-green-700 border-2  text-green-700 hover:bg-green-700  hover:text-white py-7 font-semibold leading-6  shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 text-[120%] tracking-wider">Sign in</button>
                        </div>
                    </form>
                    <h4 className="mt-10 text-center text-gray-500">
                        Not an Admin?
                        <Link to="/adminregister" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"> Register Now</Link>
                    </h4>

                </div>
            </div>
        </div>
    )
}
