import { useState } from "react";
import "../../index.css";
import "../../styles/Login.css";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ReactComponent as Close } from "../../icons/close.svg";

function Login({ setShowLoginForm }) {
  const [invalidEmailPassword, setInvalidEmailPassword] = useState(false);
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [passwordShow, setPasswordShow] = useState(false);
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);

  const passwordShowToggle = () => {
    setPasswordShow(!passwordShow);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Make a POST request to your login API endpoint
      const response = await axios.post("http://localhost:3000/api/users/login", loginData);
      console.log("User logged in: ", response.data);
      const userJWTToken = response.data.token;
      console.log(userJWTToken);
      localStorage.setItem("userJWTToken", JSON.stringify(userJWTToken));
      console.log(localStorage);
      window.location.reload();

      // Handle successful login response here
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 401) {
        setInvalidEmailPassword(true);
      } else if (error.response && error.response.status === 403) {
        setEmailNotVerified(true);
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login_form_container" onClick={(e) => e.stopPropagation()}>
      <h1>Welcome Back</h1>
      <div className='close-icon' onClick={() => { setShowLoginForm(false); }}>
        <Close fill="white" className='w-6 h-6 cursor-pointer' />
      </div>
      <form onSubmit={handleLogin}>
        <input
          type='email'
          placeholder='Email'
          value={loginData.email}
          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
          required
        />
      
        <div className="input_div p-0 flex flex-nowrap items-center pe-2 w-100">
          <input
            className="p-0 m-0 border"
            type={passwordShow ? "text" : "password"}
            placeholder='Password'
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            required
          />
          { !passwordShow
            ? <FaEyeSlash onClick={passwordShowToggle} className="h-7 w-7 cursor-pointer"/>
            : <FaEye onClick={passwordShowToggle} className="h-6 cursor-pointer w-6"/> }
        </div>
        {invalidEmailPassword && <p className="error_message">Invalid email or password</p>}
        {emailNotVerified && <p className="error_message">Email not verified</p>}

        <button type='submit' style={{ marginTop: "10px", width: "100%", cursor: loading ? "not-allowed" : "pointer" ,backgroundColor:"blue"}} disabled={loading} className='loginBtn'>
          {loading
            ? (<div className="loading-spinner"></div>)
            : ("Log in" 
              )
          }
        </button>
       
      </form>
      
    </div>
  );
}

export default Login;
