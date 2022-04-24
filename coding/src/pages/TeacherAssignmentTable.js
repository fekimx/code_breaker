import React from 'react';
import { useState, useEffect } from "react";
import useSWR from 'swr';
import {useSelector} from "react-redux";
import axiosService, {fetcher} from "../utils/axios";
import { Link } from 'react-router-dom';

var count = 0;
function TeacherAssignmentTable(){

    const [displayData, updateDisplayData] = useState([]);

    const account = useSelector((state) => state.auth.account);
    const userId = account?.id;

    const user = useSWR(`/api/user/${userId}/`, fetcher);

    const fetchLatestClasses = () => {
        axiosService.get(`/api/teacher/assignment/`, {})
        .then((response) => {
            count=0
            const newDisplayData = response.data.map((assignment) => {
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
        fetchLatestClasses();
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
        </div>
    )
}
 
 export default TeacherAssignmentTable;