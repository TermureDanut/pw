import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import config from "../../config";
import Header from "../header/Header";

const DeletedTemplates = () => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    const token = storedData.accessToken;
    const [rows, setRows] = useState([]);

    const fetchTemplates = () => {
        fetch(`${config.API_BASE_URL}templates/deleted`, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch templates');
                }
                return response.json();
            })
            .then(data => {
                setRows(data.reverse().map((template, index) => ({
                    id: index + 1,
                    templateId: template.id,
                    name: template.name || '',
                })));
            })
            .catch(error => {
                console.error('Error fetching templates:', error);
            });
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const handleRecover = (templateId) => {
        fetch(`${config.API_BASE_URL}templates/recover/${templateId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to recover template');
                }
                fetchTemplates();
            })
            .catch(error => {
                console.error('Error recovering template:', error);
            });
    };

    const columns = [
        {
            field: 'id',
            headerName: '#',
            width: 90,
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 250,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 300,
            renderCell: (params) => {
                return (
                    <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                        <button className="login-button" style={{ cursor: 'pointer', width: "100px", marginTop: "5px", marginRight: "5px" }} onClick={() => handleRecover(params.row.templateId)}>Recover</button>
                    </div>
                );
            }
        }
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "" }}>
            <Header headerText={"Deleted templates"} />
            <div style={{ width: "100%", marginTop: "5px" }}>
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
        </div>
    );
}

export default DeletedTemplates;
