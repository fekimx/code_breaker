import React from 'react';
import { useState, useEffect } from "react";
import axiosService from "../utils/axios";
import { useNavigate } from "react-router";
import Pagination from '../components/Pagination';

var count = 0;
function TeacherQuestionTable(){
    const data = { classCode: "" };
    const [displayData, updateDisplayData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);
    const [totalPosts, setTotalPosts] = useState([]);

    const history = useNavigate();

    // change page
    const paginate = (pageNumber) => {
        console.log("OK", currentPage)
        if (pageNumber == "back" && currentPage != 1){
            setCurrentPage(currentPage-1)
            fetchLatestQuestions(currentPage -1);
        } else if (pageNumber == "forward" && currentPage != Math.ceil(totalPosts/postsPerPage)){
            setCurrentPage(currentPage+1)
            fetchLatestQuestions(currentPage + 1);
        } else if (pageNumber != "back" && pageNumber != "forward"){
            setCurrentPage(pageNumber)
            fetchLatestQuestions(pageNumber);
        } 
    }

    const fetchLatestQuestions = (currentPage) => {
        axiosService.get(`/api/teacher/question/`, {})
        .then((response) => {
            const indexOfLastPost = currentPage * postsPerPage
            const indexOfFirstPost = indexOfLastPost - postsPerPage
            const paginatedDisplayData = response.data.slice(indexOfFirstPost, indexOfLastPost)
            setTotalPosts(response.data.length)
            const newDisplayData = paginatedDisplayData.map((question) => {
                count++;
                return(
                    <tr key={question.id}>
                        <td>{question.id}</td>
                        <td>{question.name}</td>
                        <td>{question.description} </td>
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
        fetchLatestQuestions(currentPage);
    }, []);

    return(
        <div>

            <table className="table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    { displayData }
                </tbody>
            </table>
            <div>
                <Pagination currentPage = {currentPage} postsPerPage={postsPerPage} totalPosts={totalPosts} paginate={paginate} />
            </div>
            <button onClick={()=>history("/teacherCreateQuestion")}>Create Question</button>
        </div>
    )
 }
 
 export default TeacherQuestionTable;