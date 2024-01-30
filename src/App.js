import React, { useState, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import NoUser from "./components/Authentication/NoUser";
import Navbar from "./components/Navbar";
import ExpenseTracker from "./components/Transactions/ExpenseTracker";


function Home({ userJWTToken, setShowSignupForm }) {
  return (
    
    <div>
      <Navbar setShowSignupForm={setShowSignupForm} />
      {userJWTToken ? (
        <ExpenseTracker />
      ) : (
        <NoUser setShowSignupForm={setShowSignupForm} />
      )}
    </div>
  );
}
function App () {
  const [showSignupForm, setShowSignupForm] = useState(false);
  const userJWTToken = JSON.parse(localStorage.getItem("userJWTToken"));
  return (
        <Router>
            <div className="App">
                <Routes>
                 <Route
                  path="/"
                  element={<Home userJWTToken={userJWTToken} setShowSignupForm={setShowSignupForm} />}
                 />
                </Routes>
            </div>
        </Router>
  );
}

export default App;