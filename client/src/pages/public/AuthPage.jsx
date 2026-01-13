import {Link} from 'react-router-dom';
import SignupPage from './SignupPage';
import LoginPage from './LoginPage';
import "../../assets/styles/AuthPage.css";

function AuthPage(){
    return (
        <div className='AuthPage'>
            <nav><h1>Welcome to the Application !</h1>
              <Link className = "home-btn" to="/">Home</Link>
            </nav>
            <div className='Auth'>
                <SignupPage />
                <LoginPage />
            </div>
        </div>
    );
}

export default AuthPage;