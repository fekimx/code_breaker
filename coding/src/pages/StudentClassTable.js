import React from 'react';
import axiosService from "../utils/axios";
import { useState, useEffect } from "react";
import useSWR from 'swr';
import {useSelector} from "react-redux";
import {fetcher} from "../utils/axios";
import ClassCodeForm from './ClassCodeForm';
import Pagination from '../components/Pagination';

function StudentClassTable(){

    const [displayData, updateDisplayData] = useState([]);
    const [currentPage] = useState(1);
    const [postsPerPage] = useState(5);
    const [totalPosts, setTotalPosts] = useState([]);


    const account = useSelector((state) => state.auth.account);
    const userId = account?.id;

    const user = useSWR(`/api/user/${userId}/`, fetcher);

    // change page
    const paginate = (pageNumber) => {
        fetchLatestStudents(pageNumber);
    }

    const fetchLatestClasses = (currentPage) => {
        axiosService.get(`/api/studentClass/?studentId=` + account?.id, {})
        .then((response) => {
            // Get current items
            const indexOfLastPost = currentPage * postsPerPage
            const indexOfFirstPost = indexOfLastPost - postsPerPage
            const paginatedDisplayData = response.data.slice(indexOfFirstPost, indexOfLastPost)
            setTotalPosts(response.data.length)
            const newDisplayData = paginatedDisplayData.map((studentClass) => {
                               
                return(
                    <tr key={studentClass.name}>
                        <td>{studentClass.name}</td>
                        <td>{studentClass.secretKey}</td>
                        <td>
                            {studentClass.assignments.length}    
                        </td>
                    </tr>
                )
            });
            updateDisplayData(newDisplayData);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    const data = { classCode: "", userId: account?.id, fetchLatestClasses: fetchLatestClasses};

    useEffect(() => {
        fetchLatestClasses(currentPage);
    }, []);

    return(
        <div>
            <ClassCodeForm data={data} />
            <table className="table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Secret Key</th>
                        <th>Assignments</th>
                    </tr>
                </thead>
                <tbody>
                    { displayData }
                </tbody>
            </table>
            <div>
                <Pagination postsPerPage={postsPerPage} totalPosts={totalPosts} paginate={paginate} />
            </div>
        </div>
    )
}
 
 export default StudentClassTable;