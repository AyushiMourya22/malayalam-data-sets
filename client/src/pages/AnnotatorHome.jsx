import React, { useState } from 'react'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';
import axios from 'axios';
export const AnnotatorHome = () => {
    const navigate = useNavigate()
    const check = () => {
        if (!Cookies.get("user")) {
            alert("Login First")
            navigate("/", { replace: true })
        }
    }

    const [loading, setLoading] = useState(true)
    const [alldata, setalldata] = useState([{ id: "", tamil: "", other: "" }])
    const [values, setValues] = useState()

    const handleLogout = async () => {
        try {
            Cookies.remove("user")
            await axios.post("/auth/logout")
            alert("Logout successful.")
            check()
        } catch (e) {
            console.log(e)
            navigate("/error")
        }
    }

    const [formData, setFormData] = useState([]);

    const handleChange = (tweetId, cat, v) => {
        const updatedData = formData.map((item) => {
            if (item.id === tweetId) {
                return { ...item, [cat]: v };
            }
            return item;
        });
        // console.log(updatedData)
        setFormData(updatedData);
    };


    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(5);
    const [display, setDisplay] = useState(false)
    const handleNext = async () => {
        // console.log(currentPage)
        setCurrentPage(prev => prev + 1)
        // console.log(currentPage)
        setDisplay(true)
        // await new Promise(resolve => setTimeout(resolve, 0))
        const indexOfLastRecord = (currentPage + 1) * recordsPerPage;
        const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
        const currentRecords = await values.slice(indexOfFirstRecord, indexOfLastRecord);
        // console.log(currentRecords)
        setalldata(currentRecords)
        setFormData(currentRecords.map(item => ({ id: item.id, tamil: "", other: "" })));
    }



    const handleSubmit = async (event) => {
        event.preventDefault();
        // console.log(formData)
        var flag = true
        formData.map((item) => {
            if (item.tamil === "") {
                flag = false
                // console.log(item)
            }

            else if (item.other === "") {
                flag = false
                // console.log(item)
            }
            else { flag = true }
            return item
        })
        if (flag === false) {
            alert("Fill all the fields")
        }
        else {
            await axios.post(`/auth/alldata/form`, { formData })
            alert("Submission done")
            const clearedFormData = formData.map(item => ({ id: "", tamil: "", other: "" }));
            setFormData(clearedFormData);
            handleNext()
            const formElement = event.target;
            formElement.reset();
        }

    }

    useEffect(() => {
        check()
        const getallData = async () => {
            try {
                const email = Cookies.get("user")
                // console.log(email)
                const data = await axios.get("/auth/alldata", { email })
                const value = data.data
                setValues(value)
                const indexOfLastRecord = currentPage * recordsPerPage;
                const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
                const currentRecords = await value.slice(indexOfFirstRecord, indexOfLastRecord);
                setalldata(currentRecords)
                setFormData(currentRecords.map(item => ({ id: item.id, tamil: "", other: "" })));
                setLoading(false)
            }
            catch (e) {
                console.log(e)
            }
        }
        getallData()
    }, [])
    return (
        <div className='bg-gradient-to-r from-[#2c5034] to-[#29b98e] px-[5%] py-[5%] font-serif'>
            <div className='text-center text-[250%] font-serif'>
                Welcome Annotator!
            </div>
            <div className='flex justify-between my-3'>
                <Link to="/" className='hover:scale-110  transition ease-in-out   text-[120%] border-green-700 border-2 bg-white rounded-xl  hover:no-underline font-bold text-green-700 hover:bg-green-700 hover:text-white px-[4%] py-[1%] my-2 '>Home</Link>
                <button onClick={handleLogout} className='hover:scale-110  transition ease-in-out      border-green-700 border-2 bg-white rounded-xl text-[120%] hover:no-underline font-bold text-green-700 hover:bg-green-700 hover:text-white px-[4%] py-[1%] my-2 '>Logout</button>
            </div>
            <div className=' py-5'>{loading ?
                <div className=' text-[200%] flex justify-center items-center text-center h-[71vh]'>
                    Fetching data ....
                </div> :
                <div>
                    <form action="" onSubmit={handleSubmit} className='mb-8'>
                        <ul>
                            {alldata.map((item) => {
                                const tamilValue = formData.find((data) => data.id === item.id)?.tamil || "";
                                const otherValue = formData.find((data) => data.id === item.id)?.other || "";
                                return (
                                    <li className='flex justify-between my-5 p-5 bg-white' key={item.id}>
                                        <div className='text-[120%] font-bold w-[5%]'>{item.id}</div>
                                        <div className='text-[120%] w-[50%]'>{item.text}</div>
                                        <div>
                                            <div className='text-[100%] flex space-x-2 border-2 bg-sky-100 p-1'>
                                                <div className='flex items-center'>
                                                    <input
                                                        id={item.id + "main2"}
                                                        className='m-0'
                                                        type="radio"
                                                        value="malayalam"
                                                        name={item.id + "main"}
                                                        checked={tamilValue === 'malayalam'}
                                                        onChange={() => handleChange(item.id, "tamil", 'malayalam')}
                                                    />
                                                    <label htmlFor={item.id + "main2"} className='m-0 cursor-pointer'>
                                                        Malayalam
                                                    </label>
                                                </div>
                                                <div className='flex items-center'>
                                                    <input
                                                        id={item.id + "main1"}
                                                        className='m-0'
                                                        type="radio"
                                                        value="nonmalayalam"
                                                        name={item.id + "main"}
                                                        checked={tamilValue === 'nonmalayalam'}
                                                        onChange={() => handleChange(item.id, "tamil", 'nonmalayalam')}
                                                    />
                                                    <label className='m-0 cursor-pointer' htmlFor={item.id + "main1"}>
                                                        Non Malayalam
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className='text-[100%] flex space-x-2 border-2 bg-sky-100 p-1'>
                                                <div className='flex items-center'>
                                                    <input
                                                        id={item.id + "subs1"}
                                                        className='m-0'
                                                        type="radio"
                                                        value="positive"
                                                        name={item.id + "subs"}
                                                        checked={otherValue === 'positive'}
                                                        onChange={() => handleChange(item.id, "other", 'positive')}
                                                    />
                                                    <label className='m-0 cursor-pointer' htmlFor={item.id + "subs1"}>
                                                        Positive
                                                    </label>
                                                </div>
                                                <div className='flex items-center'>
                                                    <input
                                                        id={item.id + "subs2"}
                                                        className='m-0'
                                                        type="radio"
                                                        value="negative"
                                                        name={item.id + "subs"}
                                                        checked={otherValue === 'negative'}
                                                        onChange={() => handleChange(item.id, "other", 'negative')}
                                                    />
                                                    <label className='m-0 cursor-pointer' htmlFor={item.id + "subs2"}>
                                                        Negative
                                                    </label>
                                                </div>
                                                <div className='flex items-center'>
                                                    <input
                                                        id={item.id + "subs3"}
                                                        className='m-0'
                                                        type="radio"
                                                        value="mix"
                                                        name={item.id + "subs"}
                                                        checked={otherValue === 'mix'}
                                                        onChange={() => handleChange(item.id, "other", 'mix')}
                                                    />
                                                    <label className='m-0 cursor-pointer' htmlFor={item.id + "subs3"}>
                                                        Mix
                                                    </label>
                                                </div>
                                                <div className='flex items-center'>
                                                    <input
                                                        id={item.id + "subs4"}
                                                        className='m-0'
                                                        type="radio"
                                                        value="unknown"
                                                        name={item.id + "subs"}
                                                        checked={otherValue === 'unknown'}
                                                        onChange={() => handleChange(item.id, "other", 'unknown')}
                                                    />
                                                    <label className='m-0 cursor-pointer' htmlFor={item.id + "subs4"}>
                                                        Unknown
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                        <div className='flex justify-center items-center'>
                            <button type="submit" className='hover:scale-110  transition ease-in-out  border-green-700 border-2 bg-white rounded-xl text-[120%] hover:no-underline font-bold text-green-700 hover:bg-green-700 hover:text-white px-[4%] py-[1%] '>Submit</button>
                        </div>
                    </form>
                </div>
            }
            </div>
        </div>
    )
}
