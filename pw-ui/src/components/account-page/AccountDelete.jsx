import React, { useEffect, useState } from "react";
import config from "../../config";

const AccountDelete = () => {
    const [userDetails, setUserDetails] = useState(null);
    const storedData = JSON.parse(localStorage.getItem("userData"));
    const token = storedData.accessToken;
    const user = storedData.user;
    const userId = user.id;
    const isStudent = storedData.student;

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
            localStorage.setItem("userData", JSON.stringify({ ...storedData, user: data }));
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const deleteUser = async () => {
        const endpoint = isStudent ? `students/${userId}` : `secretaries/${userId}`;
        try {
            const response = await fetch(`${config.API_BASE_URL}${endpoint}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                const updatedUser = await response.json();

                localStorage.setItem("userData", JSON.stringify({ ...storedData, user: updatedUser }));
                setUserDetails(updatedUser);
            } else {
                console.error('Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const recoverUser = async () => {
        const endpoint = isStudent ? `auth/recover/account/${userId}?student=true` : `auth/recover/account/${userId}?student=false`;
        try {
            const response = await fetch(`${config.API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {

                const updatedUser = { ...user, deleted: false, estimatedHardDelete: null };
                localStorage.setItem("userData", JSON.stringify({ ...storedData, user: updatedUser }));
                setUserDetails(updatedUser);
            } else {
                console.error('Failed to recover user');
            }
        } catch (error) {
            console.error('Error recovering user:', error);
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, [userId]);

    const handleDelete = async () => {
        await deleteUser();
    };

    const handleRecover = async () => {
        await recoverUser();
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
                    <p>Delete Account</p>
                </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center" }}>
                {!userDetails.deleted ?
                    <>
                        <div className="text">
                            <p style={{fontSize: "16px", fontFamily: "arial"}}>If you choose to delete this account, you can still access it and recover it for 30 days.
                                After that, it will be permanently deleted.</p>
                        </div>
                        <button className="login-button" onClick={handleDelete}>Delete</button>
                    </>
                    :
                    <>
                        <div className="text">
                            <p style={{fontSize: "16px", fontFamily: "arial"}}>This account was not permanently deleted. You can recover it.</p>
                        </div>
                        <button className="login-button" onClick={handleRecover}>Recover</button>
                    </>
                }
            </div>
        </div>
    );
};

export default AccountDelete;
