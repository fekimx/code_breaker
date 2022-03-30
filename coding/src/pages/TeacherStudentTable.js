import React, {useRef} from 'react';
import JsonData from './studentData.json';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

function TeacherStudentTable(){
    const DisplayData=JsonData.map(
        (info)=>
        {
            const c = [];
            const list = info.class;
            for(let i=0; i<list.length; i++){
                c.push(<li key={list[i]}>{list[i]}</li>)
            }
            return(
                <tr key={info.email}>
                    <td>{info.name}</td>
                    <td>{info.email}</td>
                    <td>
                        <ul>{c}</ul>
                    </td>
                </tr>
            )
        }
    )
 
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
                        <th>Name</th>
                        <th>Email</th>
                        <th>Class</th>
                    </tr>
                </thead>
                <tbody>
                    { DisplayData }
                </tbody>
            </table>
        </div>
    )
}
 
 export default TeacherStudentTable;