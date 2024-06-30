import "./style.css";
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import config from "../../config";

const RequestsPage = () => {
    const [rows, setRows] = useState([]);

    const fetchRequests = () => {
        const storedData = JSON.parse(localStorage.getItem("userData"));
        const token = storedData.accessToken;
        fetch(`${config.API_BASE_URL}secretaries/requests/uncompleted`, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch uncompleted requests');
                }
                return response.json();
            })
            .then(data => {
                setRows(data.reverse().map((request, index) => ({
                    id: index + 1,
                    requestId: request.id,
                    student: (request.student.firstName + " " + request.student.lastName) || '',
                    template: request.template.name || '',
                    file: request.template.content || ''
                })));
            })
            .catch(error => {
                console.error('Error fetching requests:', error);
            });
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleGenerate = (requestId, studentName) => {
        const storedData = JSON.parse(localStorage.getItem("userData"));
        const token = storedData.accessToken;

        fetch(`${config.API_BASE_URL}generate/${requestId}`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to download file');
                }
                return response.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${studentName}.docx`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                fetchRequests();
            })
            .catch(error => {
                console.error('Error downloading file:', error);
            });
    };

    const columns = [
        {
            field: 'id',
            headerName: '#',
            width: 90,
        },
        {
            field: 'student',
            headerName: 'Student',
            width: 200,
        },
        {
            field: 'template',
            headerName: 'Template',
            width: 250,
        },
        {
            field: 'file',
            headerName: 'Generate document',
            width: 150,
            renderCell: (params) => (
                <button
                    className="login-button"
                    style={{ cursor: 'pointer', width: "100px", marginTop: "5px", marginRight: "5px" }}
                    onClick={() => handleGenerate(params.row.requestId, params.row.student)}
                >
                    Download
                </button>
            )
        }
    ];

    return (
        <div className="dataGridDivStyle">
            <Box sx={{ height: 'auto', width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    disableAutosize
                    disableColumnFilter
                    disableColumnMenu
                    disableColumnResize
                    disableColumnSelector
                    disableColumnSorting
                    disableDensitySelector
                    disableEval
                    disableMultipleRowSelection
                    disableRowSelectionOnClick
                    disableVirtualization
                />
            </Box>
        </div>
    );
}

export default RequestsPage;
