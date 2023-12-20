import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import Sidebar from './Sidebar';
import NavigationBar from './Navbar';

const ProtectedRoute = ({ user, children }) => {
    if (!user) {
        return <Navigate to="/login" replace />
    }
    return children ? children : (
        <section className="relative">
            <div className="fixed top-0 left-0 h-screen bg-sidebar sidebar-width">
                < Sidebar />
            </div>

            <div className="main-width md:pr-4">
                <NavigationBar />
                <Outlet />
            </div>
        </section>
    );
}

export default ProtectedRoute