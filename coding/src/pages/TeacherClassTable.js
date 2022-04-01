import React from 'react';
import TeacherClassAddForm from './TeacherClassAddForm';
import axios from "axios";
import { useState, useEffect } from "react";
import useSWR from 'swr';
import {useSelector} from "react-redux";
import {fetcher} from "../utils/axios";

function TeacherClassTable(){

    const [displayData, updateDisplayData] = useState([]);

    const account = useSelector((state) => state.auth.account);
    const userId = account?.id;

    const user = useSWR(`/api/user/${userId}/`, fetcher);

    const fetchLatestClasses = () => {
        axios.get(`/api/class/?teacherId=` + account?.id, {})
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
        </div>
    )
}
 
 export default TeacherClassTable;