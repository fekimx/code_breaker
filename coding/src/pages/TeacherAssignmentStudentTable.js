import React, {useRef} from 'react';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { useState, useEffect } from "react";
import axiosService from "../utils/axios";
import Pagination from '../components/Pagination';


function TeacherAssignmentStudentTable() {
    const [displayData, updateDisplayData] = useState([]);
    const [currentPage] = useState(1);
    const [postsPerPage] = useState(5);
    const [totalPosts, setTotalPosts] = useState([]);

    // change page
    const paginate = (pageNumber) => {
        fetchLatestStudents(pageNumber);
    }


    const fetchLatestStudents = (currentPage) => {

        axiosService.get(`/api/assignmentStudents/?assignmentId=${window.location.href.charAt( window.location.href.length - 1 )}`, {})
        .then((response) => {
            // Get current items
            const indexOfLastPost = currentPage * postsPerPage
            const indexOfFirstPost = indexOfLastPost - postsPerPage
            const paginatedDisplayData = response.data.slice(indexOfFirstPost, indexOfLastPost)
            setTotalPosts(response.data.length)
            const newDisplayData = paginatedDisplayData.map((assignmentStudents) => {

                return(
                    <tr key={assignmentStudents.id}>
                        <td>{assignmentStudents.id}</td>
                        <td>{assignmentStudents.username}</td>
                        <td>{assignmentStudents.progress}%</td>
                    </tr>
                )
            });
            updateDisplayData(newDisplayData);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    useEffect(() => {
        fetchLatestStudents(currentPage);
    }, []);
 
    return(
        <div>
            <ReactHTMLTableToExcel
                id="test-table-xls-button"
                className="download-table-xls-button"
                table="student_table"
                filename="Students list"
                sheet="Students"
                buttonText="Export as XLS"
            />
            
            <table className="table-striped" id="student_table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Username</th>
                        <th>Progress</th>
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
 
 export default TeacherAssignmentStudentTable;