import { useState } from "react";
import "../../index.css";
import "../../styles/Signup.css";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ReactComponent as CloseIcon } from "../../icons/close.svg"; // Import the Close icon component

function Signup ({ setShowSignupForm }) {
  const [invalidEmailFormat, setInvalidEmailFormat] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [passwordUnmatched, setPasswordUnmatched] = useState(false);
  const [invalidName, setInvalidName] = useState(false);
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [passwordShow, setPasswordShow] = useState(false);
  const [confirmpasswordShow, setconfirmPasswordShow] = useState(false);
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);

  const passwordShowToggle = () => {
    setPasswordShow(!passwordShow);
  };

  const confirmpasswordShowToggle = () => {
    setconfirmPasswordShow(!confirmpasswordShow);
  };

  const handleNameChange = (e) => {
    const isValidName = /^[a-zA-Z\s]*$/.test(e.target.value);

    if (isValidName || e.target.value === "") {
      setSignupData({ ...signupData, name: e.target.value });
      setInvalidName(false);
    } else {
      setInvalidName(true);
    }
  };

  const handleSignup = async (e) => {
  e.preventDefault();
  setLoading(true);
  if (signupData.password !== signupData.confirmPassword) {
    setUserExists(false);
    setInvalidEmailFormat(false);
    setInvalidPassword(false);
    setInvalidName(false);
    setEmailVerificationSent(false);
    setPasswordUnmatched(true);
    setLoading(false);
    return;
  }

  if (signupData.password.length < 8) {
    setUserExists(false);
    setPasswordUnmatched(false);
    setInvalidEmailFormat(false);
    setInvalidName(false);
    setEmailVerificationSent(false);
    setInvalidPassword(true);
    setLoading(false);
    return;
  } else {
    setInvalidPassword(false);
  }

  try {
    const response = await axios.post("http://localhost:3000/api/users/signup", signupData);
    setEmailVerificationSent(true);
    console.log(response.data); // Assuming the response contains relevant information
  } catch (error) {
    if (error.response && error.response.status === 409) {
      setUserExists(true);
    } else if (error.response && error.response.status === 400) {
      setInvalidEmailFormat(true);
    } else {
      console.error(error);
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="signup_form_container" onClick={(e) => e.stopPropagation()}>
      <h1>Create Your Account</h1>
      <div className='close-icon' onClick={() => { setShowSignupForm(false); }}>
        <CloseIcon fill="white" className='w-6 h-6 cursor-pointer' />
      </div>
      <form onSubmit={handleSignup}>
        <input
          type='text'
          placeholder='Name'
          value={signupData.name}
          onChange={handleNameChange}
          required
        />
        <input
          type='email'
          placeholder='Email'
          value={signupData.email}
          onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
          required
        />

        <div className="input_div p-0 flex flex-nowrap items-center pe-2 w-full">

          <input
          placeholder='Password(minimum 8 characters)'
          value={signupData.password}
          type={passwordShow ? "text" : "password"}
          onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
          required

        />
        { !passwordShow
            ? <FaEyeSlash onClick={passwordShowToggle} className="h-7 w-7 cursor-pointer"/>
            : <FaEye onClick={passwordShowToggle} className="h-6 cursor-pointer w-6"/> }

        </div>
        
        <div className="input_div p-0 flex flex-nowrap items-center pe-2 w-full">
          <input
          placeholder='Confirm Password'
          type={confirmpasswordShow ? "text" : "password"}
          value={signupData.confirmPassword}
          onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
          required
        />
        { !confirmpasswordShow
            ? <FaEyeSlash onClick={confirmpasswordShowToggle} className="h-7 w-7 cursor-pointer"/>
            : <FaEye onClick={confirmpasswordShowToggle} className="h-6 cursor-pointer w-6"/> }
        </div>
        {passwordUnmatched && <p className="error_message">Passwords do not match</p>}
        {userExists && <p className="error_message">User already exists</p>}
        {invalidEmailFormat && <p className="error_message">Invalid email format</p>}
        {invalidName && <p className="error_message">Invalid name format</p>}
        {invalidPassword && <p className="error_message">Invalid Password format</p>}
        {emailVerificationSent && <p className="error_message" style={{ color: "white" }}>Email verification sent. Please verify.</p>}
        <button type='submit' style={{ marginTop: "10px", width: "100%", cursor: loading ? "not-allowed" : "pointer" ,backgroundColor:"blue"}} disabled={loading} className="signupBtn">
          {loading
            ? (
              <div className="loading-spinner"></div>
              )
            : (
                "Sign up"
              )}
        </button>
      </form>
    </div>
  );
}

export default Signup;
