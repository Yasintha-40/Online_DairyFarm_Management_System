import { createContext, useEffect, useState } from "react";
import axios from "axios"; 
import { toast } from "react-toastify";

export const AppContent = createContext();

export const AppContextProvider = (props) => {
    
    axios.defaults.withCredentials = true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    
    const [isLoggedin, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null); // Change from false to null

    const getAuthState = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);
            if (data.success) {
                setIsLoggedIn(true);
                await getUserData(); // Wait for user data before proceeding
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getUserData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/data`);
            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        getAuthState();
    }, []);

    const value = {
        backendUrl,
        isLoggedin,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserData,
    };

    return <AppContent.Provider value={value}>{props.children}</AppContent.Provider>;
};
