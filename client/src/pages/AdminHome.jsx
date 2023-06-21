import React, { useContext, useEffect, useState } from 'react'
import axios from "axios"
import 'bootstrap/dist/css/bootstrap.css';

import Pagination from "react-js-pagination";
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';


export const AdminHome = () => {
    const [csvFile, setCSVFile] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        console.log(file)
        setCSVFile(file);
    };

    // const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    const handleSubmit = (e) => {
        e.preventDefault();
        if (csvFile) {
            const formData = new FormData();
            formData.append('csvFile', csvFile);
            const url = '/admin/addData';
            axios({
                method: 'POST',
                url: url,
                headers: {
                    "Content-Type": 'multipart/form-data'
                },
                data: formData
            })
                .then(res => {
                    // getdata()
                    alert("Saved the file. Refresh to see changes")
                    console.log(res)
                })
                .catch(err => console.log(err));
        }
    }


    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const navigate = useNavigate()

    const fetchData = async (pageNumber) => {
        try {
            const response = await fetch(`/admin/getalldata?page=${pageNumber}`);

            const data = await response.json();
            setData(data.users);
            setTotalPages(data.pages);
            setLoading(false)
        } catch (error) {
            console.error("Error occurred while fetching data:", error);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const check = () => {
        if (!Cookies.get("admin")) {
            alert("Login First")
            navigate("/", { replace: true })
        }
    }

    const handleLogout = async () => {
        try {
            Cookies.remove("admin")
            await axios.post("/admin/logout")
            alert("Logout successful.")
            check()
        } catch (e) {
            console.log(e)
            navigate("/error")
        }
    }

    useEffect(() => {
        check()
        fetchData(currentPage);
    }, [currentPage]);

    return (
        <div className='bg-gradient-to-r from-[#2c5034] to-[#29b98e] px-[2%] py-[2%]'>
            <div className='text-center text-[200%] font-bold mb-[2%]'>Welcome Admin !</div>
            <div className='flex justify-between my-3'>
                <Link to="/" className='hover:scale-110  transition ease-in-out  border-green-700 border-2 bg-white rounded-xl text-[120%] hover:no-underline font-bold text-green-700 hover:bg-green-700 hover:text-white px-[4%] py-[1%] my-2 '>Home</Link>
                <button onClick={handleLogout} className='hover:scale-110border-green-700 border-2 bg-white rounded-xl text-[120%] hover:no-underline font-bold text-green-700 hover:bg-green-700 hover:text-white px-[4%] py-[1%] my-2'>Logout</button>
            </div>
            <div className='flex justify-center items-center'>
                <div className="bg-white rounded-2xl text-blue-900 w-1/2 p-[2%] py-[1%] ">
                    <div className='text-center text-[150%] font-bold py-[1%]'>Add File </div>
                    <form action="" onSubmit={handleSubmit} className='flex py-[2%]  justify-center items-center'>
                        <input type="file" name="csvFile" accept='.csv' onChange={handleFileChange} />
                        <button type='submit' className='px-[5%] py-[1%] border-green-700 border-2 bg-white rounded-xl text-[120%] hover:no-underline font-bold text-green-700 hover:bg-green-700 hover:text-white rounded-xl'>Submit</button>

                    </form>
                </div>
            </div>
            <div>
                <div className='text-center text-[150%] font-bold py-[2%]'>All Data </div>
                <div >
                    <div>
                        {loading ? "loading" :
                            <div>

                                <ul>{
                                    data.map((item) => {
                                        return (
                                            <li className='flex bg-white my-[1%] p-[1%] rounded-xl'>
                                                <div className='w-[5%] text-blue-900 font-bold'>{item.id}</div>
                                                <div className='w-[90%]'>{item.text}</div>
                                            </li>

                                        )
                                    })}
                                </ul>
                            </div>

                        }
                        <div className='flex justify-center items-center '>
                            <Pagination className="flex"
                                activePage={currentPage}
                                itemsCountPerPage={50}
                                totalItemsCount={totalPages * 50} // Assuming each page has 50 items
                                pageRangeDisplayed={10}
                                onChange={handlePageChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
