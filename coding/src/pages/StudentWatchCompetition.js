import React from "react";
import axiosService from "../utils/axios";
import { useSearchParams } from "react-router-dom";
import '../App.css';
import { useState } from "react";
import ProgressBar from 'react-bootstrap/ProgressBar'
import NavHeader from "../components/navbar/NavHeader";
import { validateYupSchema } from "formik";

function withMyHook(Component) {
  return function WrappedComponent(props) {
    let [searchParams, setSearchParams] = useSearchParams();
    let assignmentId = searchParams.get("id");
    return <StudentWatchCompetition {...props} assignmentId={assignmentId} />;
  }
}
var tmpScores = []
var tmpNames = []
var tmp = new Array();
var count = -1 
class StudentWatchCompetition extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        competitionName: "",
        owningClassName: "",
        top3: ""
    }
   
    const updateUI = (assignmentId) => {
        tmpScores = []
        tmpNames = []
        tmp = []
        count = -1
          axiosService.get(`/api/student/competitionWatch/${props.assignmentId}/`, {})
          .then((res) => {
                const students = res.data[4];
                for(var i=0; i<students.length; i++){
                    var student = students[i];
                    count++;
                    var minItem = Math.min(...tmpScores);
                    if(count < 3){
                        tmpScores[count] = student[2];
                        tmpNames[count] = student[0];
                    }
                    else if(student[2] > minItem){
                        tmpScores[tmpScores.indexOf(minItem)] = student[2] 
                        tmpNames[tmpScores.indexOf(minItem)] = student[0]
                    }
                }
                var i = 0;
                while(i<3) {
                    tmp.push({"name":tmpNames[i], "score":tmpScores[i]})
                    i++;
                }
                tmp.sort(function(a, b) {
                    return b.score - a.score;
                });
                console.log(tmp[0].score+tmp[1].score+tmp[2].score)
              var c = 0;
              const data = tmp.map((val) => {
                  c++;
                  return <p key={val.name}>
                            <span>{c}) {val.name}: {val.score}</span>
                        </p>
              })
              
              this.setState({
                  competitionName: res.data[0],
                  owningClassName: res.data[3],
                  top3: data
              })
              setTimeout(updateUI, 2000);
          })
          .catch((err) => {
            console.log(err);
            setTimeout(updateUI, 2000);
          });
      }
  
      //updateUI()
    }

      render() {
        return (
      <div>
            {/* <h5>Leaderboard:</h5>
                <div>{this.state.top3}</div>
            <br/>
            <h5>Questions:</h5>  */}
      </div>
    
    )}
}
export default withMyHook(StudentWatchCompetition);