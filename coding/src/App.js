import './App.css';
import axios from 'axios';
import { Provider } from "react-redux";
import store, { persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import React from "react";
import Login from "./pages/Login";
import Homepage from "./pages/Homepage";
import StudentDashboard from "./pages/StudentDashboard";
import Register from "./pages/Register";
import Terms from "./pages/Terms";
import ProtectedRoute from "./routes/ProtectedRoute";
import Question from "./pages/Question";
import CreateQuestion from "./pages/CreateQuestion";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Assignment from "./pages/Assignment";
import Class from "./pages/Class";
import Solution from "./pages/Solution";
import UnitTest from "./pages/UnitTest";
import Admin from "./pages/Admin";
import CreateClass from './pages/CreateClass';
import CreateAssignment from './pages/CreateAssignment';
import StudentClasses from './pages/StudentClasses';
import StudentAssignment from './pages/StudentAssignment';
import TeacherAssignment from './pages/TeacherAssignment';
import TeacherDashboard from './pages/TeacherDashboard';
import CreateCompetition from './pages/CreateCompetition';
import Leaderboard from "./pages/Leaderboard";
import Legal from "./pages/Legal";
import PageNotFound from "./pages/PageNotFound";


axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <BrowserRouter>
          <div>
            <Routes>
              <Route exact path="/login" element={ <Login/> } />
              <Route exact path="/Leaderboard" element={ <Leaderboard/> } />
              <Route exact path="/Homepage" element={ <Homepage/> } />
              <Route exact path="/register" element={ <Register/> } />
              <Route exact path="/contact" element={ <Contact/> } />
              <Route exact path="/terms" element={ <Terms/> } />
              <Route exact path="/legal" element={ <Legal/> } />
              <Route path="/questions" element={ <Question/> } />
              <Route exact path="/teacherCreateQuestion" element={ <CreateQuestion/> } />
              <Route exact path="/teacherCreateClass" element={ <CreateClass/> } />
              <Route exact path="/teacherCreateAssignment" element={ <CreateAssignment/> } />
              <Route exact path="/teacherStartRace" element={ <CreateCompetition assignmentType="RACE" /> } />
              <Route exact path="/studentClasses" element={ <StudentClasses/> } />
              <Route exact path="/about" element={ <About/> } />
              <Route exact path='/admin' element={<ProtectedRoute admin/>}>
                <Route exact path='/admin' element={ <Admin /> } />
              </Route>
              <Route exact path="/assignment" element={ <Assignment/> } />
              <Route exact path="/class" element={ <Class/> } />
              <Route exact path="/solution" element={ <Solution/> } />
              <Route exact path='/unittest' element={<ProtectedRoute teacher/>}>
                <Route exact path='/unittest' element={ <UnitTest /> } />
              </Route>
              <Route exact path='/' element={<ProtectedRoute/>}>
                <Route exact path='/' element={<StudentDashboard/>}/>
              </Route>
              <Route exact path='/studentdashboard' element={<StudentDashboard/>}/>
              <Route exact path='/teacherdashboard' element={<ProtectedRoute teacher/>}>
                <Route exact path='/teacherdashboard' element={ <TeacherDashboard /> } />
              </Route>
              <Route exact path='/studentAssignment' element={<StudentAssignment/>}/>
              <Route exact path='/teacherAssignment' element={<ProtectedRoute teacher/>}>
                <Route exact path='/teacherAssignment' element={ <TeacherAssignment /> } />
              </Route>
              <Route exact path="*" element={ <PageNotFound/> }  />
            </Routes>
          </div>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  )
}

export default App;
