import { useState } from "react";
import { ToastContainer, toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import "../../assets/styles/SignupPage.css";

function SignupPage(){

  const [user, setUser] = useState({
    email : "",
    username: "",
    password: "",
    confirmPassword: ""
  });

  const navigateTo = useNavigate();

  const {email,username,password,confirmPassword} = user;

  const handleChange = (e) => {
    const {name,value} = e.target;
    setUser({
      ...user,
      [name] : value
    });
  }

  const handleSuccess = (successMessage) => {
    toast.success(successMessage,{
      position: "bottom-right"  
    });
  }

  const handleError = (errorMessage) => {
    toast.error(errorMessage, {
      position: "bottom-right"
    });
  }

 async function handleSubmit(e) {
    e.preventDefault();
    if(password !== confirmPassword){
        handleError("password do not match");
        return ;
    }
    console.log("Form is submitted");
    try {
        const {confirmPassword, ...userData} = user; 
        const {data} = await axios.post(
          'http://localhost:5000/api/auth/signup',
          userData
          // ,
          // { withCredentials: true }
        );
        
        handleSuccess(data.message);

        setTimeout(() => {
          navigateTo("/admin")
        },1000)

      } catch (error) {
        const errorMsg = error?.response?.data?.message || "Internal server error";
        handleError(errorMsg);
        console.log(error);
      }
 }
  return (
  <div className="Signup">
    <h2>Sign Up</h2>

    <form className="signup-form" onSubmit={handleSubmit}>

      <div className="signup-row">
        <label htmlFor="email"><b>Email</b></label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          placeholder="Email"
          onChange={handleChange}
          required
        />
      </div>

      <div className="signup-row">
        <label htmlFor="username"><b>Username</b></label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          placeholder="Your Username"
          onChange={handleChange}
          required
        />
      </div>

      <div className="signup-row">
        <label htmlFor="password"><b>Password</b></label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          placeholder="Key to application"
          onChange={handleChange}
          required
        />
      </div>

      <div className="signup-row"> 
        <label htmlFor="confirmPassword"><b>Confirm Password</b></label>
        <input 
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={confirmPassword}
          placeholder="Confirm your password"
          onChange={handleChange} 
          required
        />
      </div>

      <button className="submit-btn" type="submit">
        Submit
      </button>

    </form>

    <ToastContainer />
  </div>
);

}

export default SignupPage;


//  res.status(statusCode).json({
//     success: false,
//     message: err.message || "Internal Server Error",
//     stack: process.env.NODE_ENV === "production" ? null : err.stack,
//   });