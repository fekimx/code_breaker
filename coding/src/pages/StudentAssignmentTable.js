import React from 'react';
import axiosService from "../utils/axios";
import { useState, useEffect } from "react";
import useSWR from 'swr';
import {useSelector} from "react-redux";
import {fetcher} from "../utils/axios";
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';

var count = 0;
function StudentAssignmentTable(){

    const [displayData, updateDisplayData] = useState([]);
    const [currentPage] = useState(1);
    const [postsPerPage] = useState(5);
    const [totalPosts, setTotalPosts] = useState([]);

    const account = useSelector((state) => state.auth.account);
    const userId = account?.id;

    const user = useSWR(`/api/user/${userId}/`, fetcher);

    // change page
    const paginate = (pageNumber) => {
        fetchLatestAssignments(pageNumber);
    }

    const fetchLatestAssignments = (currentPage) => {
        axiosService.get(`/api/student/assignment/`, {})
        .then((response) => {
            count=0
            // Get current items
            const indexOfLastPost = currentPage * postsPerPage
            const indexOfFirstPost = indexOfLastPost - postsPerPage
            const paginatedDisplayData = response.data.slice(indexOfFirstPost, indexOfLastPost)
            setTotalPosts(response.data.length)
            const newDisplayData = paginatedDisplayData.map((assignment) => {
                count++
                // Right now this just grabs the ID of the first question and puts that in a link
                //probably need to change that
                const link = `/studentAssignment?id=${assignment.id}`;
                console.log(count);
                return(
                    <tr key={assignment.name}>
                        <td>{assignment.name}</td>
                        <td>{assignment.numSubmissions} out of {assignment.questions.length}</td>
                        <td>{assignment.score} out of {assignment.possibleScore}</td>
                        <td>{assignment.active 
                        ? <Link to={link}><b>Start</b></Link>
                        : <i className="inactive">Inactive</i>}
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

    const data = { classCode: "", teacherId: account?.id, fetchLatestAssignments: fetchLatestAssignments};

    useEffect(() => {
        fetchLatestAssignments(currentPage);
    }, []);

    return(
        <div>
            <table className="table-striped">
                <thead>
                    <tr>
                        <th>Assignment Title</th>
                        <th>Progress</th>
                        <th>Score</th>
                        <th>Actions</th>
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
 
 export default StudentAssignmentTable;