import axios from 'axios'
import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'

export const AdminRegister = () => {
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [redirect, setredirect] = useState(false)

    const handleSubmit = async (ev) => {
        ev.preventDefault()
        try {
            const user = await axios.post("/admin/register", { name, email, password })
            if (user) {
                alert("Registration successful. Login to continue")
                setredirect(true)
            }
        } catch (e) {
            console.log(e)
        }
    }
    if (redirect)
        return <Navigate to={"/adminlogin"} />

    return (
        <div className="bg-gradient-to-r from-[#2c5034] to-[#29b98e] font-serif h-screen flex justify-center items-center">
            <div className="flex bg-white flex-col justify-center w-[25%] px-[2%] py-[2%] rounded-xl ">
                <div className="my-0">
                    {/* <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" /> */}
                    <h2 className=" text-center  font-bold leading-9 tracking-tight text-gray-900">Register</h2>
                </div>

                <div className="mt-[5%] ">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <h4 htmlFor="name" className="block  font-medium leading-6 text-gray-900">Name </h4>
                            <div className="mt-2">
                                <input onChange={(ev) => setName(ev.target.value)} id="name" name="name" type="text" autoComplete="name" required className="p-3 block w-full rounded-md  border-0  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600" />
                            </div>
                        </div>
                        <div>
                            <h4 htmlFor="email" className="block  font-medium leading-6 text-gray-900">Email address</h4>
                            <div className="mt-2">
                                <input onChange={(ev) => setEmail(ev.target.value)} id="email" name="email" type="email" autoComplete="email" required className="p-3 block w-full rounded-md  border-0  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600" />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <h4 htmlFor="password" className="block  font-medium leading-6 text-gray-900">Password</h4>
                            </div>
                            <div className="mt-2">
                                <input onChange={(ev) => setPassword(ev.target.value)} id="password" name="password" type="password" autoComplete="current-password" required className="p-3 block w-full rounded-md  border-0  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600" />
                            </div>
                        </div>

                        <div>
                            <button type="submit" className="flex w-full justify-center rounded-md bg-white  border-green-700 border-2 text-[120%] tracking-wider text-green-700 hover:bg-green-700 hover:text-white py-7 font-semibold leading-6  shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Register</button>
                        </div>
                    </form>
                    <h4 className="mt-10 text-center  text-gray-500">
                        Already a member?
                        <Link to="/adminlogin" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"> Sign in</Link>
                    </h4>


                </div>
            </div>
        </div>
    )
}
