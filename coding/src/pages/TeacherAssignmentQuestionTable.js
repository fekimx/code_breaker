import React from 'react';
import { useState, useEffect } from "react";
import axiosService from "../utils/axios";
import { useNavigate } from "react-router";
import { Link } from 'react-router-dom';

var count = 0;
function TeacherAssignmentQuestionTable(){
    const data = { classCode: "" };
    const [displayData, updateDisplayData] = useState([]);
    const history = useNavigate();

    const fetchLatestQuestions = () => {
        axiosService.get(`/api/assignmentQuestions/?assignmentId=${window.location.href.charAt( window.location.href.length - 1 )}`, {})
        .then((response) => {
            console.log("The response:");
            console.log(response);
            const newDisplayData = response.data.map((question) => {
                const link = `/questions?id=${question.id}`;
                return(
                    <tr key={question.question.id}>
                        <td>{question.question.id}</td>
                        <td><Link to={{pathname: link }} replace>{question.question.name}</Link></td>
                        <td>{question.question.description} </td>
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
        fetchLatestQuestions();
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
        </div>
    )
 }
 
 export default TeacherAssignmentQuestionTable;