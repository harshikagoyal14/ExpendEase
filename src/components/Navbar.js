import { useState, useEffect } from "react";
import "../styles/Navbar.css";
import "../index.css";
import Login from "./Authentication/Login";
import Signup from "./Authentication/Signup";
import axios from "axios";
import { SiMoneygram } from "react-icons/si";
import { Link } from "react-router-dom";

function Navbar (props) {
  const userJWTToken = JSON.parse(localStorage.getItem("expenseTrackerUserJWTToken"));
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("expenseTrackerUserJWTToken");
        if (token) {
          const response = await axios.get("http://localhost:3000/api/users", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="navbar_parent z-10 absolute top-0 text-black">
      <h1 className="flex flex-1 gap-2 items-center">
        <div className="moneygram-icon"><SiMoneygram/></div>
        ExpendEase
      </h1>
      <div className="flex gap-x-4">
        {user ? (
          <div className="profile_container">
            <Link to="/profile" className="items-center flex flex-col text-xs text-black">
              <img src={user.profilePicture} alt="profile" className="rounded-full w-10 h-10 p-1 box-border" />
            </Link>
          </div>
        ) : (
          <div className="login_signup_container">
            <button onClick={() => { setShowLoginForm(true); props.setShowSignupForm(false); }}>Login</button>
            <button onClick={() => { props.setShowSignupForm(true); setShowLoginForm(false); }}>Signup</button>
          </div>
        )}
      </div>

       {showLoginForm &&
          <div className="login_parent"><Login setShowLoginForm= {setShowLoginForm}/></div>
        }

       {props.showSignupForm &&
          <div className="signup_parent"><Signup setShowSignupForm= {props.setShowSignupForm}/></div>
        }
    </div>
  );
}

export default Navbar;
