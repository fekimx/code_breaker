import React from 'react'
import JsonData from './classData.json'

 function JsonClassDataDisplay(){
    const DisplayData=JsonData.map(
        (info)=>
        {
            const a = [];
            const list = info.assignments;
            for(let i=0; i<list.length; i++){
                a.push(<li key={list[i]}>{list[i]}</li>)
            }
            return(
                <tr key={info.code}>
                    <td>{info.name}</td>
                    <td>{info.code}</td>
                    <td>
                        <ul>{a}</ul>
                    </td>
                </tr>
            )
        }
    )
 
    return(
        <div>
            <table className="table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Code</th>
                        <th>Assignments</th>
                    </tr>
                </thead>
                <tbody>
                    { DisplayData }
                </tbody>
            </table>
        </div>
    )
 }
 
 export default JsonClassDataDisplay;