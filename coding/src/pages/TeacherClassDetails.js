import React from "react";
import axiosService from "../utils/axios";
import { useSearchParams } from "react-router-dom";
import '../App.css';
import NavHeader from "../components/navbar/NavHeader";
import Footer from "../components/Footer";
import { useState } from "react";
import Pagination from '../components/Pagination';

function withMyHook(Component) {
  return function WrappedComponent(props) {
    let [searchParams, setSearchParams] = useSearchParams();
    let assignmentId = searchParams.get("id");
    return <TeacherClassDetails {...props} classId={assignmentId} />;
  }
}

class TeacherClassDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      classId: this.props.classId,
      name: "",
      classKey: "",
      assignments: [],
      displayData: undefined,
      studentsPerPage: 5,
      totalStudents: 0,
      currentPage: 1
    }

    const paginate = (pageNumber) => {
      fetchGradebook(this.state.classId, pageNumber);
    }

    const renderStudents = (students, pageNumber) => {
      console.log(pageNumber);
      const indexOfLastStudent = pageNumber * this.state.studentsPerPage
      const indexOfFirstStudent = indexOfLastStudent - this.state.studentsPerPage
      console.log(indexOfFirstStudent, indexOfLastStudent);
      return students.slice(indexOfFirstStudent, indexOfLastStudent).map((student, idx) => (
        <tr key={idx}>
          <td>{student.username}</td>
          <td>{student.score}</td>
          <td>{student.possibleScore}</td>
          <td>{(student.score / student.possibleScore) * 100.0}%</td>
        </tr>
      ));
    }

    const fetchGradebook = (classId, pageNumber) => {
      axiosService.get(`/api/teacher/gradebook/${classId}/`, {})
      .then((res) => {
        this.setState({ 
          assignments: res.data,
          totalStudents: res.data[0].students.length
        });
        const updatedDisplayData = this.state.assignments.map((assignment, idx) => {
          return(
            <div key={idx}>
              <strong>Assignment: {assignment.name}</strong>
              <table className="table-striped">
              <thead>
                  <tr>
                      <th>Student</th>
                      <th>Current Score</th>
                      <th>Possible Score</th>
                      <th>Percent Score</th>
                  </tr>
              </thead>
              <tbody>
                {renderStudents(assignment.students, pageNumber)}
              </tbody>
              </table>
              <div>
                <Pagination postsPerPage={this.state.studentsPerPage} totalPosts={this.state.totalStudents} paginate={paginate} />
              </div>
            </div>

        )
        });
        this.setState({
          displayData: updatedDisplayData
        });
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    };

    axiosService.get(`/api/class/${this.props.classId}/`, {})
    .then((res) => {
      this.setState({ 
        name: res.data['name'],
        classKey: res.data['secretKey']
      });
      fetchGradebook(props.classId, 1);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  render() {
    
    return (
      <div>
      <NavHeader user="Teacher" title="" />
        <div className="pad">
        <div className="container">
            <h1>{this.state.name}</h1>
            <p>Class code: {this.state.classKey}</p>
            <strong>Gradebook</strong>
            <hr />
            {this.state.displayData}
        </div>
        </div>
        <Footer/>  
      </div>
    );
    }
  };
export default withMyHook(TeacherClassDetails);
