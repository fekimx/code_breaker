import React, {useRef} from 'react';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { useState, useEffect } from "react";
import axiosService from "../utils/axios";
import Pagination from '../components/Pagination';

function TeacherStudentTable() {
    const [displayData, updateDisplayData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);
    const [totalPosts, setTotalPosts] = useState([]);


    // change page
    
    const paginate = (pageNumber) => {
        console.log("OK", currentPage)
        if (pageNumber == "back" && currentPage != 1){
            setCurrentPage(currentPage-1)
            fetchLatestStudents(currentPage -1);
        } else if (pageNumber == "forward" && currentPage != Math.ceil(totalPosts/postsPerPage)){
            setCurrentPage(currentPage+1)
            fetchLatestStudents(currentPage + 1);
        } else if (pageNumber != "back" && pageNumber != "forward"){
            setCurrentPage(pageNumber)
            fetchLatestStudents(pageNumber);
        } 
    }

    const fetchLatestStudents = (currentPage) => {
        axiosService.get(`/api/students/`, {})
        .then((response) => {
            // Get current items
            const indexOfLastPost = currentPage * postsPerPage
            const indexOfFirstPost = indexOfLastPost - postsPerPage
            //const currentPosts = displayData.slice(indexOfFirstPost, indexOfLastPost)
            const paginatedDisplayData = response.data.slice(indexOfFirstPost, indexOfLastPost)
            setTotalPosts(response.data.length)
            const newDisplayData = paginatedDisplayData.map((student) => {
                return(
                    <tr key={student.id}>
                        <td>{student.id}</td>
                        <td>{student.username}</td>
                        <td>{student.email}</td>
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

            
            <table className="table-striped" id="student_table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Username</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    { displayData }
                </tbody>
            </table>
            <div>
                <Pagination currentPage = {currentPage} postsPerPage={postsPerPage} totalPosts={totalPosts} paginate={paginate} />
            </div>
            <ReactHTMLTableToExcel
                id="test-table-xls-button"
                className="download-table-xls-button"
                table="student_table"
                filename="Students list"
                sheet="Students"
                buttonText="Export as XLS"
            />
        </div>
    )
}


 
 export default TeacherStudentTable;