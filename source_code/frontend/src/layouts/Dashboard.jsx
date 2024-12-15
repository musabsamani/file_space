import React, { useEffect } from 'react';
import { useMyContext } from '../context/ContextProvider';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { EnhancedTable } from './EnhancedTable';

const Dashboard = () => {
    const { user, isAuthenticated } = useMyContext()
    const navigate = useNavigate();

    useEffect(() => {
        // if (!isAuthenticated) {
        //     navigate("/login")
        // }
    }, [isAuthenticated]);

    // if (!isAuthenticated) {
    //     return null;
    // }

    return (
        <div>
            <h1>Dashboard</h1>
            <EnhancedTable />
        </div>
    );
}

export default Dashboard;
