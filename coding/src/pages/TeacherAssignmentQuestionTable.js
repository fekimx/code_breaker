import React from 'react';
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { Link } from 'react-router-dom';

var count = 0;
function TeacherAssignmentQuestionTable(){
    const data = { classCode: "" };
    const [displayData, updateDisplayData] = useState([]);
    const history = useNavigate();

    const fetchLatestQuestions = () => {
        axios.get(`/api/question/`, {})
        .then((response) => {
            const newDisplayData = response.data.map((question) => {
                count++;
                const link = `/questions?id=${count}`;
                return(
                    <tr key={question.id}>
                        <td>{question.id}</td>
                        <td><Link to={{pathname: link }} replace>{question.name}</Link></td>
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