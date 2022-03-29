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
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import Question from "./pages/Question";
import CreateQuestion from "./pages/CreateQuestion";
import About from "./pages/About";
import Assignment from "./pages/Assignment";
import Class from "./pages/Class";
import Solution from "./pages/Solution";
import UnitTest from "./pages/UnitTest";
import CreateClass from './pages/CreateClass';
import CreateAssignment from './pages/CreateAssignment';
import Navbar from "./components/Navbar/Navbar";

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
              <Route exact path="/Homepage" element={ <Homepage/> } />
              <Route exact path="/register" element={ <Register/> } />
              <Route exact path="/question" element={ <Question/> } />
              <Route exact path="/teacherCreateQuestion" element={ <CreateQuestion/> } />
              <Route exact path="/teacherCreateClass" element={ <CreateClass/> } />
              <Route exact path="/teacherCreateAssignment" element={ <CreateAssignment/> } />
              <Route exact path="/about" element={ <About/> } />
              <Route exact path="/assignment" element={ <Assignment/> } />
              <Route exact path="/class" element={ <Class/> } />
              <Route exact path="/solution" element={ <Solution/> } />
              <Route exact path="/unittest" element={ <UnitTest/> } />
              <Route exact path='/' element={<ProtectedRoute/>}>
                <Route exact path='/' element={<Dashboard/>}/>
              </Route>
            </Routes>
          </div>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  )
}

export default App;
