import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import NoUser from "./components/Authentication/NoUser";
import Navbar from "./components/Navbar";
import ExpenseTracker from "./components/Transactions/ExpenseTracker";
import Profile from "./components/Profile/Profile";


function Home({ userJWTToken, setShowSignupForm , showSignupForm}) {
  return (
    
    <div>
      <Navbar setShowSignupForm={setShowSignupForm} showSignupForm={showSignupForm} />
      {userJWTToken ? (
        <ExpenseTracker />
      ) : (
        <NoUser setShowSignupForm={setShowSignupForm} showSignupForm={showSignupForm} />
      )}
    </div>
  );
}

function UserProfile () {
  return (
        <div>
            <Profile />
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
                  element={<Home userJWTToken={userJWTToken} setShowSignupForm={setShowSignupForm} showSignupForm={showSignupForm} />}
                 />
                 <Route path="/profile" element={<UserProfile />} />
                </Routes>
            </div>
        </Router>
  );
}

export default App;