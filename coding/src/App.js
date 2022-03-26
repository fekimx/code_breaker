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
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import Question from "./pages/Question";
import About from "./pages/About";
import Assignment from "./pages/Assignment";
import Class from "./pages/Class";
import Solution from "./pages/Solution";
import UnitTest from "./pages/UnitTest";

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
              <Route exact path="/register" element={ <Register/> } />
              <Route exact path="/question" element={ <Question/> } />
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
