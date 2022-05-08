import React from 'react';
import { useState, useEffect } from "react";
import axiosService from "../utils/axios";
import { useNavigate } from "react-router";
import { Link } from 'react-router-dom';
import { useSearchParams } from "react-router-dom";

var count = 0;
function StudentCompetitionQuestionTable(){
    const data = { classCode: "" };
    const [displayData, updateDisplayData] = useState([]);
    const history = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();
    let competitionId = searchParams.get("id");

    const fetchLatestQuestions = () => {
        axiosService.get(`/api/student/competition/${competitionId}/`)
        .then((response) => {
            const questionWeightPairs = response.data[0]['questionWeightPairs']
            const completedQuestions = response.data[1]
            const newDisplayData = questionWeightPairs.map((questionWeightPair) => {
                const link = `/questions?id=${questionWeightPair.id}&competitionId=${competitionId}`;
                count++;
                return(
                    <tr key={questionWeightPair.id}>
                        <td>{count}</td>
                        <td>{questionWeightPair.weight}</td>
                        <td><Link to={{pathname: link }} replace>{questionWeightPair.name}</Link></td>
                        <td>{questionWeightPair.description}</td>
                        <td>
                        { completedQuestions.includes(questionWeightPair.id) ? "✓" : "x" }
                        </td>
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
                        <th>Completed</th>
                    </tr>
                </thead>
                <tbody>
                    { displayData }
                </tbody>
            </table>
        </div>
    )
 }
 
 export default StudentCompetitionQuestionTable;