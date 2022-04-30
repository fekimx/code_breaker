import React from 'react';
import { useState, useEffect } from "react";
import useSWR from 'swr';
import {useSelector} from "react-redux";
import { useNavigate } from "react-router";
import axiosService, {fetcher} from "../utils/axios";
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';

var count = 0;
function TeacherAssignmentTable(){
    const [displayData, updateDisplayData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);
    const [totalPosts, setTotalPosts] = useState([]);


    const account = useSelector((state) => state.auth.account);
    const userId = account?.id;
    const history = useNavigate();

    const user = useSWR(`/api/user/${userId}/`, fetcher);

    // change page
    const paginate = (pageNumber) => {
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
        axiosService.get(`/api/teacher/assignment/`, {})
        .then((response) => {
            count=0
            const indexOfLastPost = currentPage * postsPerPage
            const indexOfFirstPost = indexOfLastPost - postsPerPage
            const paginatedDisplayData = response.data.slice(indexOfFirstPost, indexOfLastPost)
            setTotalPosts(response.data.length)
            const newDisplayData = paginatedDisplayData.map((assignment) => {
                count++
                // Right now this just grabs the ID of the first question and puts that in a link
                //probably need to change that
                const link = `/assignment?id=${assignment.id}`;
                return(
                    <tr key={assignment.name}>
                        <td>{assignment.name}</td>
                        <td>{assignment.active 
                        ? <Link to={{pathname: link }} replace>Start</Link>
                        : <i class="inactive">Inactive</i>}
                        </td>  
                        <td>Progress</td>  
                    </tr>
                )
            });
            updateDisplayData(newDisplayData);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    const data = { classCode: "", teacherId: account?.id, fetchLatestClasses: fetchLatestClasses};

    useEffect(() => {
        fetchLatestClasses(currentPage);
    }, []);

    return(
        <div>

            <table className="table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Link</th>
                        <th>Progress</th>
                    </tr>
                </thead>
                <tbody>
                    { displayData }
                </tbody>
            </table>
            <div>
                <Pagination currentPage = {currentPage} postsPerPage={postsPerPage} totalPosts={totalPosts} paginate={paginate} />
            </div>
            <button onClick={()=>history("/teacherCreateAssignment")}>Create an Assignment</button>
        </div>
    )
}
 
 export default TeacherAssignmentTable;