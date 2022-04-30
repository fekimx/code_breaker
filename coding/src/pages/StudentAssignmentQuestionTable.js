import React from 'react';
import { useState, useEffect } from "react";
import axiosService from "../utils/axios";
import { useNavigate } from "react-router";
import { Link } from 'react-router-dom';
import { useSearchParams } from "react-router-dom";
import Pagination from '../components/Pagination';


var count = 0;
function StudentAssignmentQuestionTable(){
    const data = { classCode: "" };
    const [displayData, updateDisplayData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(5);
    const [totalPosts, setTotalPosts] = useState([]);

    const history = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();
    let assignmentId = searchParams.get("id");

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
        axiosService.get(`/api/student/assignment/${assignmentId}/`)
        .then((response) => {
            // Get current items
            const indexOfLastPost = currentPage * postsPerPage
            const indexOfFirstPost = indexOfLastPost - postsPerPage
            const questionWeightPairs = response.data['questionWeightPairs']
            const paginatedDisplayData = questionWeightPairs.slice(indexOfFirstPost, indexOfLastPost)
            setTotalPosts(questionWeightPairs.length)
            const newDisplayData = paginatedDisplayData.map((questionWeightPair) => {
                const link = `/questions?id=${questionWeightPair.id}&assignmentId=${assignmentId}`;
                count++;
                return(
                    <tr key={questionWeightPair.id}>
                        <td>{count}</td>
                        <td>{questionWeightPair.weight}</td>
                        <td><Link to={{pathname: link }} replace>{questionWeightPair.name}</Link></td>
                        <td>{questionWeightPair.description} </td>
                    </tr>
                )
            });
            count=0;
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
                        <th>Weight</th>
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
        </div>
    )
 }
 
 export default StudentAssignmentQuestionTable;