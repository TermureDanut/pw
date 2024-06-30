import React, { useState } from "react";
import "./style.css";
import Header from "../header/Header";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import config from "../../config";
import {Alert, Snackbar} from "@mui/material";
import {useNavigate} from "react-router-dom";

const RegisterPage = () => {
    const [userType, setUserType] = useState("1");          // 0 for secretary
    const [showPassword, setShowPassword] = useState(false);
    const [userTypeInt, setUserTypeInt] = useState(1);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [faculty, setFaculty] = useState("");
    const [studiesProgram, setStudiesProgram] = useState("");
    const [studiesType, setStudiesType] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [openSuccess, setOpenSuccess] = React.useState(false);
    const [openInvalid, setOpenInvalid] = React.useState(false);

    const navigate = useNavigate();

    const handleClickSuccess = () => {
        setOpenSuccess(true);
        if (!openSuccess){
            setTimeout(() => {
                navigate("/");
            }, 2000);
        }
    };

    const handleCloseSuccess = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSuccess(false);
    };

    const handleClickInvalid = () => {
        setOpenInvalid(true);
    };

    const handleCloseInvalid = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenInvalid(false);
    };

    const handleUserTypeChange = (event) => {
        const value = event.target.value;
        setUserType(value);
        setUserTypeInt(parseInt(value));
    };

    const handleFNameChange = (e) => {
        setFirstName(e.target.value);
    };

    const handleLNameChange = (e) => {
        setLastName(e.target.value);
    };

    const handleFacultyChange = (e) => {
        setFaculty(e.target.value);
    };

    const handleSProgramChange = (e) => {
        setStudiesProgram(e.target.value);
    };

    const handleSTypeChange = (e) => {
        setStudiesType(e.target.value);
    };

    const handleSpecializationChange = (e) => {
        setSpecialization(e.target.value);
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

    const handleRegister = async () => {
        const response = await fetch(`${config.API_BASE_URL}auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userType: userTypeInt,
                firstName: firstName,
                lastName: lastName,
                faculty: faculty,
                studiesProgram: studiesProgram,
                studiesType: studiesType,
                specialization: specialization,
                email: email,
                password: password,
            }),
        });
        if (response.status === 201) {
            handleClickSuccess();
        } else {
            handleClickInvalid();
        }
    }

    const handleCancel = () => {
        navigate("/");
    }
    return (
        <div className="main-page">
            <Header headerText={"Register"} />
            <div className="content">
                <div className="register-card">
                    <div className="radio-button-group">
                        <label>
                            <input
                                type="radio"
                                value="1"
                                checked={userType === "1"}
                                onChange={handleUserTypeChange}
                            />
                            Student
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="0"
                                checked={userType === "0"}
                                onChange={handleUserTypeChange}
                            />
                            Secretary
                        </label>
                    </div>
                    <div className="text-field-group">
                        {userType === "1" && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Enter First Name"
                                    className="input-fields"
                                    onChange={handleFNameChange}
                                />
                                <input
                                    type="text"
                                    placeholder="Enter Last Name"
                                    className="input-fields"
                                    onChange={handleLNameChange}
                                />
                                <input
                                    type="text"
                                    placeholder="Enter Faculty"
                                    className="input-fields"
                                    onChange={handleFacultyChange}
                                />
                                <input
                                    type="text"
                                    placeholder="Enter Studies Program"
                                    className="input-fields"
                                    onChange={handleSProgramChange}
                                />
                                <input
                                    type="text"
                                    placeholder="Enter Studies Type"
                                    className="input-fields"
                                    onChange={handleSTypeChange}
                                />
                                <input
                                    type="text"
                                    placeholder="Enter Specialization"
                                    className="input-fields"
                                    onChange={handleSpecializationChange}
                                />
                                <input
                                    type="text"
                                    placeholder="Enter Email"
                                    className="input-fields"
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
                            </>
                        )}
                        {userType === "0" && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Enter First Name"
                                    className="input-fields"
                                    onChange={handleFNameChange}
                                />
                                <input
                                    type="text"
                                    placeholder="Enter Last Name"
                                    className="input-fields"
                                    onChange={handleLNameChange}
                                />
                                <input
                                    type="text"
                                    placeholder="Enter Email"
                                    className="input-fields"
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
                            </>
                        )}
                    </div>
                    <button className="register-button" onClick={handleRegister}>Register</button>
                    <button className="register-button" onClick={handleCancel}>Cancel</button>
                </div>
            </div>
            <Snackbar open={openSuccess} autoHideDuration={2000} onClose={handleCloseSuccess}>
                <Alert
                    onClose={handleCloseSuccess}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Register successfully!
                </Alert>
            </Snackbar>
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
};

export default RegisterPage;
