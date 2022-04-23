import React from 'react';
import TeacherClassAddForm from './TeacherClassAddForm';
import axiosService from "../utils/axios";
import { useState, useEffect } from "react";
import useSWR from 'swr';
import {useSelector} from "react-redux";
import {fetcher} from "../utils/axios";
import { useNavigate } from "react-router";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

function TeacherClassTable(){

    const [displayData, updateDisplayData] = useState([]);

    const account = useSelector((state) => state.auth.account);
    const userId = account?.id;
    const history = useNavigate();

    const user = useSWR(`/api/user/${userId}/`, fetcher);

    const fetchLatestClasses = () => {
        axiosService.get(`/api/class/?teacherId=` + account?.id, {})
        .then((response) => {
            const newDisplayData = response.data.map((teacherClass) => {
                return(
                    <tr key={teacherClass.secretKey}>
                        <td>{teacherClass.name}</td>
                        <td>Class code: {teacherClass.secretKey} <br/> {teacherClass.students.length} students</td>
                        <td>
                            {teacherClass.assignments.length} assignments
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

    const data = { classCode: "", teacherId: account?.id, fetchLatestClasses: fetchLatestClasses};

    useEffect(() => {
        fetchLatestClasses();
    }, []);

    return(
        <div>
            <TeacherClassAddForm data={data} />
            <table className="table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Class Info</th>
                        <th>Assignments</th>
                    </tr>
                </thead>
                <tbody>
                    { displayData }
                </tbody>
            </table>
            <button onClick={()=>history("/teacherCreateAssignment")}>Create an Assignment</button>
        </div>
    )
}
 
 export default TeacherClassTable;