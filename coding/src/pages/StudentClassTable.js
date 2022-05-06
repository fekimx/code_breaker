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
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);
    const [totalPosts, setTotalPosts] = useState([]);


    const account = useSelector((state) => state.auth.account);
    const userId = account?.id;

    const user = useSWR(`/api/user/${userId}/`, fetcher);

    // change page

    const paginate = (pageNumber) => {
        console.log("OK", currentPage)
        if (pageNumber == "back" && currentPage != 1){
            setCurrentPage(currentPage-1)
            fetchLatestClasses(currentPage -1);
        } else if (pageNumber == "forward" && currentPage != Math.ceil(totalPosts/postsPerPage)){
            setCurrentPage(currentPage+1)
            fetchLatestClasses(currentPage + 1);
        } else if (pageNumber != "back" && pageNumber != "forward"){
            setCurrentPage(pageNumber)
            fetchLatestClasses(pageNumber);
        } 
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

    const data = { classCode: "", userId: account?.id, fetchLatestClasses: fetchLatestClasses, paginate: paginate };

    useEffect(() => {
        fetchLatestClasses(currentPage);
    }, []);

    return(
        <div>

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
                <Pagination currentPage = {currentPage} postsPerPage={postsPerPage} totalPosts={totalPosts} paginate={paginate} />
            </div>
            <br /><br />
            <ClassCodeForm data={data} />
        </div>
    )
}
 
 export default StudentClassTable;