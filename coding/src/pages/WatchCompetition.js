import React from "react";
import axiosService from "../utils/axios";
import { useSearchParams } from "react-router-dom";
import '../App.css';
import { useState } from "react";
import ProgressBar from 'react-bootstrap/ProgressBar'
import NavHeader from "../components/navbar/NavHeader";

function withMyHook(Component) {
  return function WrappedComponent(props) {
    let [searchParams, setSearchParams] = useSearchParams();
    let assignmentId = searchParams.get("id");
    return <WatchCompetition {...props} assignmentId={assignmentId} />;
  }
}

class WatchCompetition extends React.Component {
  constructor(props) {
    super(props);

    /*
    # competition name
    # total competition questions
    # total competition unit tests
    # class name
    # array of:
        # student username
        # student email
        # corrent unit tests
    */

    this.state = {
        competitionName: "",
        competitionQuestions: 0,
        competitionUnitTests: 0,
        owningClassName: "",
        studentData: ""
    }

    const updateUI = (assignmentId) => {
        axiosService.get(`/api/teacher/competitionWatch/${props.assignmentId}/`, {})
        .then((res) => {
            const newDisplayData = res.data[4].map((tmpRow) => {
                return(
                    <div className="progress-line">
                        <span><b>{ tmpRow[0] }</b><span>{ tmpRow[1] }</span></span>
                        <ProgressBar animated variant="success" min="0" max={ res.data[2] } now={ tmpRow[2] } />
                    </div>
                )
            })
            this.setState({
                competitionName: res.data[0],
                competitionQuestions: res.data[1],
                competitionUnitTests: res.data[2],
                owningClassName: res.data[3],
                studentData: newDisplayData
            })
            setTimeout(updateUI, 2000);
        })
        .catch((err) => {
          console.log(err);
          setTimeout(updateUI, 2000);
        });
    }

    updateUI()
    }
    
    render() {
        return (
      <div>
          <NavHeader user="Teacher" title="" />
          <div className="pad">
              <div className="container">
                  <h1>{ this.state.competitionName }</h1>
                  <p>
                      <b>Class:</b> { this.state.owningClassName }<br />
                      <b>Total Questions:</b> { this.state.competitionQuestions }<br />
                      <b>Total Unit Tests:</b> { this.state.competitionUnitTests }
                  </p>
                  <div>
                      { this.state.studentData }
                  </div>
              </div>
          </div>
      </div>
    
    )}
}
export default withMyHook(WatchCompetition);
