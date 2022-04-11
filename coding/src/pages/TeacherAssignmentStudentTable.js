import React, {useRef} from 'react';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { useState, useEffect } from "react";
import axios from "axios";

function TeacherAssignmentStudentTable() {
    const [displayData, updateDisplayData] = useState([]);

    const fetchLatestStudents = () => {
        axios.get(`/api/students/`, {})
        .then((response) => {
            const newDisplayData = response.data.map((student) => {
                return(
                    <tr key={student.id}>
                        <td>{student.id}</td>
                        <td>{student.username}</td>
                        <td>{student.email}</td>
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
        fetchLatestStudents();
    }, []);
 
    return(
        <div>
            <ReactHTMLTableToExcel
                id="test-table-xls-button"
                className="download-table-xls-button"
                table="student_table"
                filename="Students list"
                sheet="Students"
                buttonText="Export as XLS"
            />
            
            <table className="table-striped" id="student_table">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Username</th>
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
 
 export default TeacherAssignmentStudentTable;