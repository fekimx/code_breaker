import React from 'react';
import TeacherClassAddForm from './TeacherClassAddForm';
import axiosService from "../utils/axios";
import { useState, useEffect } from "react";
import useSWR from 'swr';
import {useSelector} from "react-redux";
import {fetcher} from "../utils/axios";
import { useNavigate } from "react-router";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Pagination from '../components/Pagination';

function TeacherClassTable(){
    const [displayData, updateDisplayData] = useState([]);
    const [currentPage] = useState(1);
    const [postsPerPage] = useState(5);
    const [totalPosts, setTotalPosts] = useState([]);


    const account = useSelector((state) => state.auth.account);
    const userId = account?.id;
    const history = useNavigate();

    const user = useSWR(`/api/user/${userId}/`, fetcher);

    // change page
    const paginate = (pageNumber) => {
        fetchLatestClasses(pageNumber);
    }

    const fetchLatestClasses = (currentPage) => {
        axiosService.get(`/api/class/?teacherId=` + account?.id, {})
        .then((response) => {
            // Get current items
            const indexOfLastPost = currentPage * postsPerPage
            const indexOfFirstPost = indexOfLastPost - postsPerPage
            const paginatedDisplayData = response.data.slice(indexOfFirstPost, indexOfLastPost)
            setTotalPosts(response.data.length)
    
            const newDisplayData = response.data.map((teacherClass) => {
                const link = `/teacherClassDetails?id=${teacherClass.id}`;
                return(
                    <tr key={teacherClass.secretKey}>
                        <td><Link to={link}>{teacherClass.name}</Link></td>
                        <td>Class code: {teacherClass.secretKey} <br/> {teacherClass.students.length} students</td>
                        <td>
                            {teacherClass.assignments.length} assignments
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

    const data = { classCode: "", teacherId: account?.id, fetchLatestClasses: fetchLatestClasses};

    useEffect(() => {
        fetchLatestClasses(currentPage);
    }, []);

    return(
        <div>
            <TeacherClassAddForm data={data} />
            <table className="table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Class Info</th>
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
 
 export default TeacherClassTable;