import { createContext, useContext, useState } from 'react';
import { ToastContainer } from 'react-toastify';

import { LOCAL_STORAGE_KEY_USER, LOCAL_STORAGE_KEY_TOKEN } from '../constants';

const Context = createContext()

const ContextProvider = ({ children }) => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_USER) || "{}"));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(() => JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_TOKEN) || null));

    const value = {
        isAuthenticated, setIsAuthenticated,
        user, setUser,
        token, setToken
    }

    return (
        <Context.Provider
            value={value}
        >
            <ToastContainer />
            {children}
        </Context.Provider>
    );
}

export const useMyContext = () => {
    const context = useContext(Context);
    if (context === undefined) {
        throw new Error("useMyContext must be used within a ContextProvider");
    }
    return context;
};

export default ContextProvider;