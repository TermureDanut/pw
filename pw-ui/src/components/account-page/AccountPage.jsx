import "./style.css";
import Header from "../header/Header";
import {useState} from "react";
import AccountDetails from "./AccountDetails";
import AccountRequests from "./AccountRequests";
import AccountDelete from "./AccountDelete";
import {useNavigate} from "react-router-dom";

const AccountPage = () => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    const user = storedData.user;
    const isStudent = storedData.student;
    const isSecretary = storedData.secretary;
    const navigate = useNavigate();

    const [selectedButton, setSelectedButton] = useState(1);

    const onDetailsClick = () => {
        setSelectedButton(1);
    }

    const onRequestsClick = () => {
        setSelectedButton(2);
    }

    const onDeleteClick = () => {
        setSelectedButton(3);
    }

    const goToMainPage = () => {
        navigate("/mainpage")
    }
    return (
        <div>
            <Header headerText={user.firstName + " " + user.lastName}/>
            <div className="content">
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: "center",
                    border: "1px black",
                    width: "15%",
                    height: "1000px",
                    marginTop: "-10px",
                    boxSizing: "border-box",
                    boxShadow: "0 0 0 0.3px black"
                }}>
                    <button style={{
                        width: "80%", height: "50px", fontSize: "15px",
                        fontFamily: "Arial, sans-serif",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        marginTop: "10px"
                    }} className="account-buttons"
                            onClick={onDetailsClick}>
                        Details
                    </button>

                    {isStudent ?
                        <button style={{
                            width: "80%", height: "50px", fontSize: "15px",
                            fontFamily: "Arial, sans-serif",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            marginTop: "10px"
                        }} className="account-buttons"
                                onClick={onRequestsClick}>
                            Requests
                        </button> : <></>
                    }

                    <button style={{
                        width: "80%", height: "50px", fontSize: "15px",
                        fontFamily: "Arial, sans-serif",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        marginTop: "10px"
                    }} className="account-buttons"
                            onClick={onDeleteClick}>
                        Delete
                    </button>

                    <button style={{
                        width: "80%", height: "50px", fontSize: "15px",
                        fontFamily: "Arial, sans-serif",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        marginTop: "10px"
                    }} className="account-buttons"
                            onClick={goToMainPage}>
                        Main Page
                    </button>
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: "center",
                    width: "85%",
                    height: "1000px",
                    marginTop: "-10px",
                    boxSizing: "border-box",
                    boxShadow: "0 0 0 0.3px black"
                }}>
                    {selectedButton === 1 ?
                        <AccountDetails userId={user.id} isStudent={isStudent} />
                        :
                        selectedButton === 2 ?
                            <AccountRequests/>
                            :
                            <AccountDelete/>}

                </div>
            </div>
        </div>
    )
}
export default AccountPage;