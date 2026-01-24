import {Link} from 'react-router-dom'
import './PublicHeader.css'

function PublicHeader(){
    return (
        <nav className='nav-bar'>
            <h1>Welcome to Hotel Menu Application</h1>
            <Link className="auth-btn" to="/auth">Signup/Login</Link>
        </nav>
    );
}

export default PublicHeader;