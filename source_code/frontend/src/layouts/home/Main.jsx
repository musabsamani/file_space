import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginForm from "../forms/LoginForm";
import RegistrationForm from "../forms/RegistrationForm";
import Dashboard from '../Dashboard';

const Main = () => {
    return (
        <main className="flex-grow container mx-auto py-8">
            <section className="bg-white" style={{ minHeight: 'calc(100vh - 260px)' }}>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegistrationForm />} />
                </Routes>
            </section>
        </main>
    );
}

export default Main;
