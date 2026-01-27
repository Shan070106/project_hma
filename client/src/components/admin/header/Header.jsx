import './Header.css';

function Header() {
    return (
        <header className="headnav">
            <div className="left">
                <h3>My App</h3>
            </div>

            <div className="right">
                <button>Menu</button>
                <button>Hotel</button>
                <button>Logout</button>
            </div>
        </header>

    );
}

export default Header;