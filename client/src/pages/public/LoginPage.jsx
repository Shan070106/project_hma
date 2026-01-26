import "../../assets/styles/LoginPage.css";

function LoginPage(){
  return (
    <div className="Login">
      <h2>Login</h2>
      <form className="login-form">

        <div className="login-row">
          <label htmlFor="mail"><b>Email</b></label> 
          <input type="email" placeholder="Email"/>
        </div>
        
         <div className="login-row">
          <label htmlFor="name"><b>Username</b></label> 
          <input type="text" placeholder="Your Username"/>
        </div>

         <div className="login-row">
          <label htmlFor="pswd"><b>Password</b></label> 
          <input type="password" placeholder="Key to application"/>
        </div>

        <button className="submit-btn" type="submit">Submit</button>
      </form>
    </div>
  );
}

export default LoginPage;