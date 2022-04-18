import React from 'react';
import axiosService from "../utils/axios";
import { useState, useEffect } from "react";
import useSWR from 'swr';
import {useSelector} from "react-redux";
import {fetcher} from "../utils/axios";
import { Link } from 'react-router-dom';

var count = 0;
function TeacherCompetitionTable(){

    const [displayData, updateDisplayData] = useState([]);

    const account = useSelector((state) => state.auth.account);
    const userId = account?.id;

    const user = useSWR(`/api/user/${userId}/`, fetcher);

    const fetchLatestCompetitions = () => {
        axiosService.get(`/api/teacher/competition/`, {})
        .then((response) => {
            count=0
            const newDisplayData = response.data.map((competition) => {
                count++
                // Right now this just grabs the ID of the first question and puts that in a link
                const link = `competition?id=${count}`;
                console.log(count);
                return(
                    <tr key={competition.name}>
                        <td>{competition.name}</td>
                        <td>{competition.active 
                        ? <Link to={link}><b>Start</b></Link>
                        : <i class="inactive">Inactive</i>}
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

    const data = { classCode: "", teacherId: account?.id, fetchLatestCompetitions: fetchLatestCompetitions};

    useEffect(() => {
        fetchLatestCompetitions();
    }, []);

    return(
        <div>
            <table className="table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
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
 
 export default TeacherCompetitionTable;