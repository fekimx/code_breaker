import React from 'react';
import axios from "axios";
import { useState, useEffect } from "react";
import useSWR from 'swr';
import {useSelector} from "react-redux";
import {fetcher} from "../utils/axios";
import ClassCodeForm from './ClassCodeForm';


function StudentClassTable(){

    const [displayData, updateDisplayData] = useState([]);

    const account = useSelector((state) => state.auth.account);
    const userId = account?.id;

    const user = useSWR(`/api/user/${userId}/`, fetcher);

    const fetchLatestClasses = () => {
        axios.get(`/api/studentClass/?studentId=` + account?.id, {})
        .then((response) => {
            console.log("listing student classes")
            const newDisplayData = response.data.map((studentClass) => {
                               
                return(
                    <tr key={studentClass.name}>
                        <td>{studentClass.name}</td>
                        <td>{studentClass.secretKey}</td>
                        <td>
                            {studentClass.assignments.length}    
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

    const data = { classCode: "", userId: account?.id, fetchLatestClasses: fetchLatestClasses};

    useEffect(() => {
        fetchLatestClasses();
    }, []);

    return(
        <div>
            <ClassCodeForm data={data} />
            <table className="table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Secret Key</th>
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
 
 export default StudentClassTable;