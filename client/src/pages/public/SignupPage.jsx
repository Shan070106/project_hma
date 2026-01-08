import "../../assets/styles/SignupPage.css";

function SignupPage(){

  return (
    <div className="Signup">
      <h2>Sign Up</h2>
      <form className="signup-form">

        <div className="signup-row">
          <label htmlFor="mail"><b>Email</b></label> 
          <input type="email" placeholder="Email"/>
        </div>
        
         <div className="signup-row">
          <label htmlFor="name"><b>Username</b></label> 
          <input type="text" placeholder="Your Username"/>
        </div>

         <div className="signup-row">
          <label htmlFor="pswd"><b>Password</b></label> 
          <input type="password" placeholder="Key to application"/>
        </div>

         <div className="signup-row">
          <label htmlFor="confirm-pswd"><b>Confirm Password</b></label> 
          <input type="password" placeholder="Finalize Key"/>
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default SignupPage;