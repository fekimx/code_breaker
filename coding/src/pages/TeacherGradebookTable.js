import React from 'react';
import TeacherClassAddForm from './TeacherClassAddForm';
import axiosService from "../utils/axios";
import { useState, useEffect } from "react";
import {useSelector} from "react-redux";

function TeacherGradebookTable(){

    const [displayData, updateDisplayData] = useState([]);

    const account = useSelector((state) => state.auth.account);

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
        // fetchLatestClasses();
    }, []);

    return(
        <div>
            <h3>Class #1</h3>
            <h5>Assignment #1</h5>
            <table className="table-striped">
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Progress</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    { displayData }
                </tbody>
            </table>
            <h5>Assignment #2</h5>
            <table className="table-striped">
                <thead>
                    <tr>
                    <th>Student</th>
                    <th>Progress</th>
                    <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    { displayData }
                </tbody>
            </table>
            <h3>Class #2</h3>
            <h5>Assignment #1</h5>
            <table className="table-striped">
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Progress</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    { displayData }
                </tbody>
            </table>
            <h5>Assignment #2</h5>
            <table className="table-striped">
                <thead>
                    <tr>
                    <th>Student</th>
                    <th>Progress</th>
                    <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    { displayData }
                </tbody>
            </table>
        </div>
    )
}
 
 export default TeacherGradebookTable;