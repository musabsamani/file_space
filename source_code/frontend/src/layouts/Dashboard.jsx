import React, { useEffect } from 'react';
import { useMyContext } from '../context/ContextProvider';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { user, isAuthenticated } = useMyContext()
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login")
        }
    }, [user])

    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    );
}

export default Dashboard;
