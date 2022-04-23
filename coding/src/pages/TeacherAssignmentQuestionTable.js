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
            
            const newDisplayData = response.data.map((questionWeightPair) => {
                const link = `/questions?id=${questionWeightPair.question.id}`;
                count++;
                return(
                    <tr key={questionWeightPair.question.id}>
                        <td>{count}</td>
                        <td>{questionWeightPair.weight}</td>
                        <td><Link to={{pathname: link }} replace>{questionWeightPair.question.name}</Link></td>
                        <td>{questionWeightPair.question.description} </td>
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
        fetchLatestQuestions();
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
        </div>
    )
 }
 
 export default TeacherAssignmentQuestionTable;