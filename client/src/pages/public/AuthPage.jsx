import SignupPage from './SignupPage';
import LoginPage from './LoginPage';
import "../../assets/styles/AuthPage.css";

function AuthPage(){
    return (
        <div className='AuthPage'>
            <nav><h1>Welcome to the Application !</h1></nav>
            <div className='Auth'>
                <SignupPage />
                {/* <div className='rules'>
                    <h2>Validation Rules</h2>
                      <h3>Email Address</h3>
                      <ul>
                        <li><p>Must be provided and cannot be empty</p></li>
                        <li><p>Must follow a valid email format (e.g., user@domain.com)</p></li>
                        <li><p>Must be unique (not already registered)</p></li>
                        <li><p>Must be provided and cannot be empty</p></li>
                      </ul>
                      <h3>Password</h3>
                      <ul>
                        <li><p>Minimum length: 8 characters</p></li>
                        <li><p>Must not be the same as the email or username</p></li>
                        <li><p>One (A–Z),
                            One (a–z),
                            One (0–9),
                            One special character (e.g., ! @ # $ % ^ & *)</p></li>
                        <li><p>Must be provided and cannot be empty</p></li>
                      </ul>
                      <h3>Email Address</h3>
                      <ul>
                        <li><p>Must be provided and cannot be empty</p></li>
                        <li><p>Must follow a valid email format (e.g., user@domain.com)</p></li>
                        <li><p>Must be unique (not already registered)</p></li>
                        <li><p>Must be provided and cannot be empty</p></li>
                      </ul>
                </div> */}
                <LoginPage />
            </div>
        </div>
    );
}

export default AuthPage;