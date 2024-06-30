import React, { useState } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import ClippedDrawer from '../side-menu/ClippedDrawer';
import StudentsList from "../students-list/StudentsList";
import TemplatesList from "../templates-list/TemplatesList";
import RequestsPage from "../requests-page/RequestsPage";
import MakeRequestPage from "../make-request-page/MakeRequestPage";

const MainPage = () => {
    const [selectedButton, setSelectedButton] = useState("2");
    const storedData = JSON.parse(localStorage.getItem("userData"));
    const isStudent = storedData.student;
    const isSecretary = storedData.secretary;

    const handleButtonClick = (buttonName) => {
        setSelectedButton(buttonName);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <CssBaseline />
            <ClippedDrawer onButtonClick={handleButtonClick} />
            {isSecretary ? (
                <>
                    {selectedButton === '2' && <TemplatesList />}
                    {selectedButton === '3' && <StudentsList />}
                    {selectedButton === '4' && <RequestsPage />}
                </>
            ) : isStudent ? (
                <MakeRequestPage/>
            ) : (
                <></>
            )}
        </Box>
    );
};

export default MainPage;
