import { Link } from 'react-router-dom';
import './Sidebar.css';
function Sidebar(){
    return (
        <div className="sidenav">
            <Link className='side-menu' to = "admin/hotel">Hotel</Link>
            <Link className='side-menu' to = "admin/orders">Orders</Link>
            <Link className='side-menu' to = "admin/menu">Menu</Link> 
            <Link className='side-menu' to= "admin/qrcode">Qr Code</Link>
        </div>
    );
}

export default Sidebar;