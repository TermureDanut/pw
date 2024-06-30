import "./style.css";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import IconButton from "@mui/material/IconButton";
import Header from "../header/Header";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import config from "../../config";
import {Alert, Snackbar} from "@mui/material";

const WelcomePage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [openInvalid, setOpenInvalid] = React.useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem("inRegister", false);
        const storedData = JSON.parse(localStorage.getItem("userData"));
        if (storedData) {
            navigate("/mainpage", {replace: true});
        }
    }, [navigate]);

    const handleClickInvalid = () => {
        setOpenInvalid(true);
    };

    const handleCloseInvalid = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenInvalid(false);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async () => {
        const response = await fetch(`${config.API_BASE_URL}auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });
        if (response.ok) {
            const jsonResponse = await response.json();
            localStorage.setItem("userData", JSON.stringify(jsonResponse));
            localStorage.setItem("inRegister", false);
            const storedData = JSON.parse(localStorage.getItem("userData"));
            navigate("/mainpage", {replace: true});

        } else {
            handleClickInvalid();
        }
    };

    const handleRegister =  () => {
        localStorage.setItem("inRegister", true);
        navigate("/register")
    }

    return (
        <div className="welcome-page">
            <Header headerText = {"Proiect Programare Web"}/>
            <div className="content">
                <div className="login-card">
                    <div className="text_login_register">Login</div>
                    <div>
                        <input
                            type="text"
                            placeholder="Enter email"
                            className="input-bars"
                            onChange={handleEmailChange}
                        />
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter password"
                                className="input-bars"
                                onChange={handlePasswordChange}
                            />
                            <IconButton onClick={togglePasswordVisibility}
                                        style={{
                                            marginTop: '10px',
                                            color: 'black',
                                            backgroundColor: 'white',
                                            width: '40px',
                                            height: '40px',
                                            marginLeft: '10px'
                                        }}
                            >
                                {showPassword ? <VisibilityIcon/> : <VisibilityOffIcon/>}
                            </IconButton>
                        </div>
                    </div>
                    <button className="login-button" onClick={handleLogin}>
                        Login
                    </button>
                    <button className="login-button" onClick={handleRegister}>
                        Register
                    </button>
                </div>
            </div>
            <Snackbar open={openInvalid} autoHideDuration={2000} onClose={handleCloseInvalid}>
                <Alert
                    onClose={handleCloseInvalid}
                    severity="error"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Invalid data!
                </Alert>
            </Snackbar>
        </div>
    );
}

export default WelcomePage;