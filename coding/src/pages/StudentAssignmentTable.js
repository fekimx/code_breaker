import React from 'react';
import axios from "axios";
import { useState, useEffect } from "react";
import useSWR from 'swr';
import {useSelector} from "react-redux";
import {fetcher} from "../utils/axios";
import { Link } from 'react-router-dom';


function StudentAssignmentTable(){

    const [displayData, updateDisplayData] = useState([]);

    const account = useSelector((state) => state.auth.account);
    const userId = account?.id;

    const user = useSWR(`/api/user/${userId}/`, fetcher);

    const fetchLatestClasses = () => {
        axios.get(`/api/assignment/`, {})
        .then((response) => {
            const newDisplayData = response.data.map((assignment) => {
                               
                // change the href to inclde the value of assignment.questions[0] to link to the first one
                const url = 1;
                const link = `questions?=${url}`;
                //"http://127.0.0.1:8000/questions/?=" + assignment.questions[0];
                console.log(assignment.questions);
                return(
                    <tr key={assignment.name}>
                        <td>{assignment.name}</td>
                        <td><Link to={link}>Start</Link></td>  
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
                        <th>Start Assignment</th>
                    </tr>
                </thead>
                <tbody>
                    { displayData }
                </tbody>
            </table>
        </div>
    )
}
 
 export default StudentAssignmentTable;