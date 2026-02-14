import { useState } from "react";
import "../../assets/styles/SignupPage.css";

function SignupPage(){

  const [user, setUser] = useState({
    email : "",
    username: "",
    password: ""
  });

  const handleChange = (e) => {
    const {key,value} = e.target;
    setUser({
      ...preUser,
      [key] : value
    });
  }
 
  return (
    <div className="Signup">
      <h2>Sign Up</h2>
      <form className="signup-form" onSubmit={handleSubmit}>

        <div className="signup-row">
          <label htmlFor="mail"><b>Email</b></label> 
          <input type="email" placeholder="Email" onChange={handleChange}/>
        </div>
        
         <div className="signup-row">
          <label htmlFor="name"><b>Username</b></label> 
          <input type="text" placeholder="Your Username" onChange={handleChange}/>
        </div>

         <div className="signup-row">
          <label htmlFor="pswd"><b>Password</b></label> 
          <input type="password" placeholder="Key to application" onChange={handleChange}/>
        </div>

         <div className="signup-row">
          <label htmlFor="confirm-pswd"><b>Confirm Password</b></label> 
          <input type="password" placeholder="Finalize Key" onChange={handleChange}/>
        </div>

        <button className="submit-btn" type="submit">Submit</button>
      </form>
    </div>
  );
}

export default SignupPage;