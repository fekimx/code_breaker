import React from "react";
import axiosService from "../utils/axios";
import { useSearchParams } from "react-router-dom";
import '../App.css';
import NavHeader from "../components/navbar/NavHeader";
import Footer from "../components/Footer";

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
      classKey: ""
    }

    const fetchGradebook = function(classId) {
      axiosService.get(`/api/teacher/gradebook/${classId}/`, {})
      .then((res) => {
        // this.setState({ 
        //   name: res.data['name'],
        //   classKey: res.data['secretKey']
        // });
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
      fetchGradebook(props.classId);
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
            <p>Join code: {this.state.classKey}</p>
            <h2>Gradebook</h2> 
            <h2>Assignment 1</h2>
            <table className="table-striped">
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Progress</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {/* { displayData } */}
                </tbody>
            </table>
            <h2>Assignment 2</h2>
            <table className="table-striped">
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Progress</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {/* { displayData } */}
                </tbody>
            </table>
            <h2>Assignment 3</h2>
            <table className="table-striped">
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Progress</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {/* { displayData } */}
                </tbody>
            </table>
        </div>
        </div>
        <Footer/>  
      </div>
    );
    }
  };
export default withMyHook(TeacherClassDetails);
