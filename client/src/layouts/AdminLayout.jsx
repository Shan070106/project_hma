import { Outlet } from "react-router-dom";
import Header from "../components/admin/header/Header";
import Sidebar from '../components/admin/sidebar/Sidebar';
import '../assets/styles/AdminLayout.css';

function AdminLayout(){
    return (
       <div className="admin-layout">
            <div className="admin-header">
                <Header/>
            </div>
            <div className="admin-body">
                <div className="sidebar">
                    <Sidebar/>
                </div>
                <div className="main">
                    <Outlet/>
                </div>
            </div>
       </div>
    );
}

export default AdminLayout;