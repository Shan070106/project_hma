import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import "../../assets/styles/LoginPage.css";

function LoginPage(){
  const [user, setUser] = useState({
    username:"",
    password:""
  });

  const navigateTo = useNavigate();

  const {username,password} = user;

  const handleChange = (e) => {
    const {name,value} = e.target;
    setUser({
      ...user,
      [name] : value
    });
  }

  const handleSuccess = (successMessage) => {
    toast.success(successMessage,{
      position: "top-center"
    });
  }

  const handleError = (errorMessage) => {
    toast.error(errorMessage, {
      position: "top-center"
    });
  }

  return (
    <div className="Login">
      <h2>Login</h2>
      <form className="login-form">
        
         <div className="login-row">
          <label htmlFor="name"><b>Username</b></label> 
          <input 
            type="text" 
            id="username"
            name="username"
            value={username}
            onChange={handleChange}
            placeholder="Your Username"
            required
          />
        </div>

         <div className="login-row">
          <label htmlFor="pswd"><b>Password</b></label> 
          <input 
            type="password" 
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            placeholder="Key to application"
            required
          />
        </div>

        <button className="submit-btn" type="submit">Submit</button>
      </form>
    </div>
  );
}

export default LoginPage;