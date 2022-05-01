import React from 'react';
import { useState, useEffect } from "react";
import useSWR from 'swr';
import {useSelector} from "react-redux";
import { useNavigate } from "react-router";
import axiosService, {fetcher} from "../utils/axios";
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';

var count = 0;
function TeacherCompetitionTable(){

    const [activeDisplayData, updateDisplayDataActive] = useState([]);
    const [inactiveDisplayData, updateDisplayDataInactive] = useState([]);

    const account = useSelector((state) => state.auth.account);
    const userId = account?.id;
    const history = useNavigate();

    const user = useSWR(`/api/user/${userId}/`, fetcher);

    const updateStatus = (tmpPK, tmpActive) => {
        axiosService.post(`/api/teacher/competitionStatus/`, {
            id: tmpPK,
            active: tmpActive
        })
        .then(function (response) {
            fetchLatestClasses()
        })
        .catch(function (error) {
            fetchLatestClasses()
        });
    }

    const fetchLatestClasses = () => {
        axiosService.get(`/api/teacher/competition/`, {})
        .then((response) => {
            var newActive = 0;
            var newInactive = 0;
            const displayBlank = () => {
                return (
                    <tr key="1">
                        <td colSpan="3" className="blank">
                            Nothing here
                        </td>
                    </tr>
                )
            }

            const newDisplayDataActive = response.data.filter(item => item[4] == true).map((row) => {
                newActive++;
                const tmpLink = `/watchCompetition?id=${row[2]}`;
                return(
                    <tr className="datatable" key={row.name}>
                        <td>{row[1]}</td>
                        <td>{row[3]} <span className="small-link" onClick={()=>updateStatus(row[2], 'False')}>disable</span></td>
                        <td><a href={tmpLink}>Watch Live</a> - ({row[6]} of {row[5]} finished)</td>  
                    </tr>
                )
            });
            const newDisplayDataInactive = response.data.filter(item => item[4] == false).map((row) => {
                newInactive++;
                return(
                    <tr className="datatable" key={row.name}>
                        <td>{row[1]}</td>
                        <td>{row[3]} <span className="small-link" onClick={()=>updateStatus(row[2], 'True')}>enable</span></td>
                        <td>{row[6]} of {row[5]} students finished</td>  
                    </tr>
                )
            });
            
            updateDisplayDataActive((newActive > 0) ? newDisplayDataActive : displayBlank);
            updateDisplayDataInactive((newInactive > 0) ? newDisplayDataInactive : displayBlank);
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
            <button className="float-right" onClick={()=>history("/teacherStartRace")}>Create a Competition</button>
            <h3>Active Competitions</h3>
            <table className="table-striped">
                <thead>
                    <tr key="1">
                        <th>Class</th>
                        <th>Competition</th>
                        <th>Progress</th>
                    </tr>
                </thead>
                <tbody>
                    { activeDisplayData }
                </tbody>
            </table>
            <h3>Inactive Competitions</h3>
            <table className="table-striped">
                <thead>
                    <tr key="1">
                        <th>Class</th>
                        <th>Competition</th>
                        <th>Progress</th>
                    </tr>
                </thead>
                <tbody>
                    { inactiveDisplayData }
                </tbody>
            </table>
            <div>
            </div>
        </div>
    )
}
 
 export default TeacherCompetitionTable;
