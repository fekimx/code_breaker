import '../App.css';
import Tabs from './Tabs';
import TeacherClassTable from './TeacherClassTable';
import TeacherStudentTable from './TeacherStudentTable';
import TeacherQuestionTable from './TeacherQuestionTable';
import NewNav from "../components/navbar/NewNav";
import Footer from "../components/Footer";

function TeacherDashboard() {
  return (
    <div>
      <NewNav/>
      <div className="pad">
      <div class="container">
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
      </div>
      <Footer/>  
    </div>
  );
}

export default TeacherDashboard;
