import React from 'react';
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

var count = 0;
function TeacherQuestionTable(){
    const data = { classCode: "" };
    const [displayData, updateDisplayData] = useState([]);
    const history = useNavigate();

    const fetchLatestQuestions = () => {
        axios.get(`/api/question/`, {})
        .then((response) => {
            const newDisplayData = response.data.map((question) => {
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
        fetchLatestQuestions();
    }, []);

    return(
        <div>
            <button onClick={()=>history("/teacherCreateQuestion")}>Create Question</button>
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
 
 export default TeacherQuestionTable;