import React, { useState, useEffect } from 'react';
import config from "../../config";

const AccountDetails = ({ userId, isStudent }) => {
    const [userDetails, setUserDetails] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [faculty, setFaculty] = useState("");
    const [studiesProgram, setStudiesProgram] = useState("");
    const [studiesType, setStudiesType] = useState("");
    const [specialization, setSpecialization] = useState("");

    const storedData = JSON.parse(localStorage.getItem("userData"));
    const token = storedData.accessToken;

    const fetchUserDetails = async () => {
        const endpoint = isStudent ? `students/${userId}` : `secretaries/${userId}`;
        try {
            const response = await fetch(`${config.API_BASE_URL}${endpoint}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            setUserDetails(data);
            setFirstName(data.firstName);
            setLastName(data.lastName);
            setEmail(data.email);
            setFaculty(data.faculty);
            setStudiesProgram(data.studiesProgram);
            setStudiesType(data.studiesType);
            setSpecialization(data.specialization);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, [userId]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleDoneClick = async () => {
        await patchUserDetails();
        setIsEditing(false);
    };

    const handleCancelClick = () => {
        setFirstName(userDetails.firstName);
        setLastName(userDetails.lastName);
        setEmail(userDetails.email);
        setFaculty(userDetails.faculty);
        setStudiesProgram(userDetails.studiesProgram);
        setStudiesType(userDetails.studiesType);
        setSpecialization(userDetails.specialization);
        setIsEditing(false);
    };

    const patchUserDetails = async () => {
        const endpoint = isStudent ? `students/${userId}` : `secretaries/${userId}`;
        try {
            console.log(firstName + " " + lastName + " " + email + " " + faculty + " " + studiesProgram + " " + studiesType + " " + specialization);
            const response = await fetch(`${config.API_BASE_URL}${endpoint}`, {
                method: 'PATCH',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    faculty: faculty,
                    studiesProgram: studiesProgram,
                    studiesType: studiesType,
                    specialization: specialization
                })
            });
            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(`Failed to update user details: ${responseData.message || response.statusText}`);
            }
            return responseData;
        } catch (error) {
            console.error('Error updating user details:', error);
        }
    };

    if (!userDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{
            marginTop: "10px",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column"
        }}>
            <div className="title">
                <div className="text">
                    <p>Details</p>
                </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center" }}>
                <div>
                    <label style={{fontSize: "16px", fontFamily: "arial"}}>First Name: </label>
                    <input
                        style={{fontSize: "16px", fontFamily: "arial"}}
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={!isEditing}
                    />
                </div>
                <div>
                    <label style={{fontSize: "16px", fontFamily: "arial"}}>Last Name: </label>
                    <input
                        style={{fontSize: "16px", fontFamily: "arial"}}
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={!isEditing}
                    />
                </div>
                <div>
                    <label style={{fontSize: "16px", fontFamily: "arial"}}>Email: </label>
                    <input
                        style={{fontSize: "16px", fontFamily: "arial"}}
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!isEditing}
                    />
                </div>
                {isStudent && (
                    <>
                        <div>
                            <label style={{fontSize: "16px", fontFamily: "arial"}}>Faculty: </label>
                            <input
                                style={{fontSize: "16px", fontFamily: "arial"}}
                                type="text"
                                value={faculty}
                                onChange={(e) => setFaculty(e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>
                        <div>
                            <label style={{fontSize: "16px", fontFamily: "arial"}}>Studies Program: </label>
                            <input
                                style={{fontSize: "16px", fontFamily: "arial"}}
                                type="text"
                                value={studiesProgram}
                                onChange={(e) => setStudiesProgram(e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>
                        <div>
                            <label style={{fontSize: "16px", fontFamily: "arial"}}>Studies Type: </label>
                            <input
                                style={{fontSize: "16px", fontFamily: "arial"}}
                                type="text"
                                value={studiesType}
                                onChange={(e) => setStudiesType(e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>
                        <div>
                            <label style={{fontSize: "16px", fontFamily: "arial"}}>Specialization: </label>
                            <input
                                style={{fontSize: "16px", fontFamily: "arial"}}
                                type="text"
                                value={specialization}
                                onChange={(e) => setSpecialization(e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>
                    </>
                )}
                {isEditing ? (
                    <>
                        <button className="login-button" onClick={handleDoneClick}>Done</button>
                        <button className="login-button" onClick={handleCancelClick}>Cancel</button>
                    </>
                ) : (
                    <button className="login-button" onClick={handleEditClick}>Edit</button>
                )}
            </div>
        </div>
    );
};

export default AccountDetails;
