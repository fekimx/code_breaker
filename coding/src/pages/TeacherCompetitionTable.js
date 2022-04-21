import React from 'react';
import axiosService from "../utils/axios";
import { useState, useEffect } from "react";
import useSWR from 'swr';
import {useSelector} from "react-redux";
import {fetcher} from "../utils/axios";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router";

var count = 0;
function TeacherCompetitionTable(){

    const navigate = useNavigate();
    const [activeData, updateActiveDisplayData] = useState([]);
    const [inactiveData, updateInactiveDisplayData] = useState([]);

    const account = useSelector((state) => state.auth.account);
    const userId = account?.id;

    const user = useSWR(`/api/user/${userId}/`, fetcher);

    const updateStatus = (tmpPK, tmpActive) => {
        console.log("HOOOOOOOOO -----")
        console.log(tmpPK)
        axiosService.post(`/api/teacher/competitionStatus/`, {
            id: tmpPK,
            active: tmpActive
        })
        .then(function (response) {
            fetchLatestActiveCompetitions()
            fetchLatestInactiveCompetitions()
          console.log(response);
        })
        .catch(function (error) {
            fetchLatestActiveCompetitions()
            fetchLatestInactiveCompetitions()
          console.log(error);
        });
    }

    const fetchLatestActiveCompetitions = () => {
        console.log("==========")
        console.log(activeData)
        axiosService.get(`/api/teacher/competition/`, {})
        .then((response) => {
            const newDisplayData = response.data.map((competition) => {
                if (competition.active) {
                    return(
                        <tr key={competition.name}>
                            <td>{competition.name}
                            <br />
                            <button class="text-button" onClick={()=>updateStatus(competition.id, 'False')}>End Competition</button>
                            </td>
                            <td>
                            <b>8</b> <i class="inactive">total students</i><br />
                            <b>3</b> <i class="inactive">finished</i><br />
                            </td>
                        </tr>
                    )
                } else {
                    return
                }
            });
            updateActiveDisplayData(newDisplayData);
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    const fetchLatestInactiveCompetitions = () => {
        axiosService.get(`/api/teacher/competition/`, {})
        .then((response) => {
            const newDisplayData = response.data.map((competition) => {
                console.log(count);
                count = 1
                 const link = `competition?id=${count}`;
                 if (!competition.active) {
                     return(
                         <tr key={competition.name}>
                             <td>{competition.name}
                             <br />
                            <button class="text-button" onClick={()=>updateStatus(competition.id, 'True')}>Re-enable Competition</button>
                           </td>    
                         </tr>
                     )
                 } else {
                     return
                 }
            });
            updateInactiveDisplayData(newDisplayData);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    const data = { classCode: "", teacherId: account?.id, fetchLatestCompetitions: fetchLatestActiveCompetitions};

    useEffect(() => {
        fetchLatestActiveCompetitions();
        fetchLatestInactiveCompetitions();
    }, []);

    return(
        <div>
            <button onClick={()=>navigate("/teacherStartRace")}>Start a Competition</button>
             <br /><br />
             <table className="table-striped">
                 <thead>
                     <tr>
                         <th>Active Competitions</th>
                         <th>Student Progress</th>
                     </tr>
                 </thead>
                 <tbody>
                 { activeData }
                     </tbody>
             </table>
             <br />
            <table className="table-striped">
                <thead>
                    <tr>
                    <th>Inactive Competitions</th>
                    </tr>
                </thead>
                <tbody>

                { inactiveData }

                   </tbody>
            </table>
        </div>
    )
}
 
 export default TeacherCompetitionTable;
