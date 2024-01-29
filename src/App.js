import React, { useState, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import NoUser from "./components/Authentication/NoUser";
import Navbar from "./components/Navbar";
import ExpenseTracker from "./components/Transactions/ExpenseTracker";


function Home ({ userJWTToken,  showSignupForm, setShowSignupForm }) {

  console.log(showSignupForm);
  return (
        <div>
            <Navbar showSignupForm={showSignupForm} setShowSignupForm={setShowSignupForm} />
            {userJWTToken ? <ExpenseTracker /> : <NoUser showSignupForm={showSignupForm} setShowSignupForm={setShowSignupForm} />}
        </div>
  );
}

function App () {
  const [showSignupForm, setShowSignupForm] = useState(false);
  const userJWTToken = JSON.parse(localStorage.getItem("expenseTrackerUserJWTToken"));
  const userFirebaseRefId = JSON.parse(localStorage.getItem("expenseTrackerUserFirebaseRefId"));
  return (
        <Router>
            <div className="App">
                <Routes>
                <Route path="/" element={<Home userJWTToken={userJWTToken}  showSignupForm={showSignupForm} setShowSignupForm={setShowSignupForm} />}  />
                </Routes>
            </div>
        </Router>
  );
}

export default App;