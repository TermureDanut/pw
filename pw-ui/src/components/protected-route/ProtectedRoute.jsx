import React from 'react';
import {Navigate} from 'react-router-dom';

const ProtectedRoute = ({children}) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const inRegisterCheck = JSON.parse(localStorage.getItem("inRegister"));

    if (!userData && !inRegisterCheck) {
        return <Navigate to="/"/>;
    }

    return children;
};

export default ProtectedRoute;
