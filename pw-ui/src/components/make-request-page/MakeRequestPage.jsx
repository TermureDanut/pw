import React, { useState, useEffect } from 'react';
import config from "../../config";
import {Alert, Snackbar} from "@mui/material";

const MakeRequestPage = () => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    const user = storedData.user;

    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [description, setDescription] = useState('');

    const [openSuccess, setOpenSuccess] = React.useState(false);

    const handleCloseSuccess = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenSuccess(false);
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = () => {
        fetch(`${config.API_BASE_URL}templates/`, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${storedData.accessToken}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch templates');
                }
                return response.json();
            })
            .then(data => {
                setTemplates(data);
            })
            .catch(error => {
                console.error('Error fetching templates:', error);
            });
    };

    const handleTemplateChange = (event) => {
        const templateId = event.target.value;
        const template = templates.find(t => t.id === parseInt(templateId));
        setSelectedTemplate(templateId);
        setDescription(template ? template.description : '');
    };

    const handleSend = () => {
        const requestDto = {
            studentId: user.id,
            templateId: selectedTemplate
        };

        fetch(`${config.API_BASE_URL}students/request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${storedData.accessToken}`
            },
            body: JSON.stringify(requestDto)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to make request');
                }
                return response.json();
            })
            .then(data => {
                setOpenSuccess(true);
                console.log('Request made successfully:', data);
            })
            .catch(error => {
                console.error('Error making request:', error);
            });
    };

    return (
        <div style={{display: 'flex', flexDirection: "column", justifyContent: 'center', alignItems: 'center', marginTop: "60px", width: "100%"}}>
            <p style={{fontSize: "20px"}}>Make a request</p>
            <div>
                <select style={{height: "60px", width: "200px", fontSize: "15px"}} onChange={handleTemplateChange} value={selectedTemplate || ''}>
                    <option value="" disabled>Select a template</option>
                    {templates.map(template => (
                        <option key={template.id} value={template.id}>
                            {template.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <p>
                    {description}
                </p>
            </div>
            <button className="login-button" onClick={handleSend}>Send</button>
            <Snackbar open={openSuccess} autoHideDuration={2000} onClose={handleCloseSuccess}>
                <Alert
                    onClose={handleCloseSuccess}
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Request made successfully!
                </Alert>
            </Snackbar>
        </div>
    );
};

export default MakeRequestPage;
