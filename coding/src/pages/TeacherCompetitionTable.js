import React from 'react';
import axiosService from "../utils/axios";
import { useState, useEffect } from "react";
import useSWR from 'swr';
import {useSelector} from "react-redux";
import {fetcher} from "../utils/axios";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router";
import Pagination from '../components/Pagination';

var count = 0;
function TeacherCompetitionTable(){

    const navigate = useNavigate();
    const [activeData, updateActiveDisplayData] = useState([]);
    const [inactiveData, updateInactiveDisplayData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(3);
    const [totalPosts, setTotalPosts] = useState([]);

    // change page
    const paginate = (pageNumber) => {
        if (pageNumber == "back" && currentPage != 1){
            setCurrentPage(currentPage-1)
            fetchLatestActiveCompetitions(currentPage -1);
        } else if (pageNumber == "forward" && currentPage != Math.ceil(totalPosts/postsPerPage)){
            setCurrentPage(currentPage+1)
            fetchLatestActiveCompetitions(currentPage + 1);
        } else if (pageNumber != "back" && pageNumber != "forward"){
            setCurrentPage(pageNumber)
            fetchLatestActiveCompetitions(pageNumber);
        } 
    }

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

    const fetchLatestActiveCompetitions = (currentPage) => {
        console.log("==========")
        console.log(activeData)
        axiosService.get(`/api/teacher/competition/`, {})
        .then((response) => {
            const indexOfLastPost = currentPage * postsPerPage
            const indexOfFirstPost = indexOfLastPost - postsPerPage
            const paginatedDisplayData = response.data.slice(indexOfFirstPost, indexOfLastPost)
            setTotalPosts(response.data.length)
            const newDisplayData = paginatedDisplayData.map((competition) => {
                if (competition.active) {
                    return(
                        <tr key={competition.name}>
                            <td>{competition.name}
                            <br />
                            <span className="small-link" onClick={()=>updateStatus(competition.id, 'False')}>End</span>
                            </td>
                            <td>
                            <b>8</b> <i className="inactive">total students</i><br />
                            <b>3</b> <i className="inactive">finished</i><br />
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
    const fetchLatestInactiveCompetitions = (currentPage) => {
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
                            <span className="small-link" onClick={()=>updateStatus(competition.id, 'True')}>Start</span>
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
        fetchLatestActiveCompetitions(currentPage);
        fetchLatestInactiveCompetitions(currentPage);
    }, []);

    return(
        <div>

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
            <div>
                <Pagination currentPage = {currentPage} postsPerPage={postsPerPage} totalPosts={totalPosts} paginate={paginate} />
            </div>
            <br />
            <button onClick={()=>navigate("/teacherStartRace")}>Start a Competition</button>
            <br /><br />
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
