import '../App.css';
import Tabs from './Tabs';
import TeacherClassTable from './TeacherClassTable';
import TeacherStudentTable from './TeacherStudentTable';
import TeacherQuestionTable from './TeacherQuestionTable';
import Navbar from "../components/navbar/Navbar";

function TeacherDashboard() {
  return (
    <div>
      <Navbar/>
      <h1>Teacher Dashboard</h1>
      <Tabs>
        <div label="Classes">
          <TeacherClassTable/>
        </div>
        <div label="Students">
          <TeacherStudentTable/>
        </div>
        <div label="Questions">
          <TeacherQuestionTable/>
        </div>
      </Tabs>
    </div>
  );
}

export default TeacherDashboard;