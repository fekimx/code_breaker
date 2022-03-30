import React from 'react';
import JsonData from './questionData.json';
import TeacherClassAddForm from './TeacherClassAddForm';

var count = 0;
function TeacherQuestionTable(){
    const data = {
        classCode: ""
      };
    const DisplayData=JsonData.map(
        (info)=>
        {
            count++;
            return(
                <tr key={info.name}>
                    <td>{count}</td>
                    <td>{info.name}</td>
                    <td>{info.desc} </td>
                    <td>
                        <a><button>Edit</button></a>
                        <a><button>Delete</button></a>
                    </td>
                </tr>
            )
        }
    )
 
    return(
        <div>
            <TeacherClassAddForm data={data} />
            <table className="table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    { DisplayData }
                </tbody>
            </table>
        </div>
    )
 }
 
 export default TeacherQuestionTable;