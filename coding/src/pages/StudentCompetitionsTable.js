import React from 'react';
import axiosService from "../utils/axios";
import { useState, useEffect } from "react";
import useSWR from 'swr';
import {useSelector} from "react-redux";
import {fetcher} from "../utils/axios";
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';

 var count = 0;
 function StudentCompetitionsTable(){

     const [displayData, updateDisplayData] = useState([]);
     const [currentPage, setCurrentPage] = useState(1);
     const [postsPerPage] = useState(3);
     const [totalPosts, setTotalPosts] = useState([]);

     const account = useSelector((state) => state.auth.account);
     const userId = account?.id;

     const user = useSWR(`/api/user/${userId}/`, fetcher);

    // change page
    const paginate = (pageNumber) => {
        console.log("OK", currentPage)
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

     const fetchLatestActiveCompetitions = (currentPage) => {
         console.log("--> START");
         axiosService.get(`/api/student/competition/`, {})
         .then((response) => {
            count=0
            console.log("--> START2");

            if (response.data.length === 0) {
                console.log("EMPTY !");
            }
            const indexOfLastPost = currentPage * postsPerPage
            const indexOfFirstPost = indexOfLastPost - postsPerPage
            const paginatedDisplayData = response.data.slice(indexOfFirstPost, indexOfLastPost)
            setTotalPosts(response.data.length)
            const newDisplayData = paginatedDisplayData.map((competition) => {
                 console.log("--> MAP "+count);
                 count++
                 // Right now this just grabs the ID of the first question and puts that in a link
                 const link = `/studentCompetition?id=${competition.id}`;
                 console.log(count);
                 return(
                    <tr key={competition.name}>
                        <td>{competition.name}</td>
                        <td>3 of 11 questions</td>
                        <td>{competition.active 
                        ? <Link to={link}><b>Start</b></Link>
                        : <i className="inactive">Inactive</i>}
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

     const data = { classCode: "", teacherId: account?.id, fetchLatestActiveCompetitions: fetchLatestActiveCompetitions};

     useEffect(() => {
        fetchLatestActiveCompetitions(currentPage);
     }, []);

     return(
        <div>
            <table className="table-striped">
                <thead>
                    <tr>
                        <th>Competition Title</th>
                        <th>Progress</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    { displayData }
                    { displayData == "" &&
                        <tr>
                            <td colSpan="3">
                                <div className="vertical-padding">
                                <center><i className="inactive">No Competitions Yet :-(</i></center>
                                </div>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
            <div>
                <Pagination currentPage = {currentPage} postsPerPage={postsPerPage} totalPosts={totalPosts} paginate={paginate} />
            </div>
        </div>
    )
 }

  export default StudentCompetitionsTable; 