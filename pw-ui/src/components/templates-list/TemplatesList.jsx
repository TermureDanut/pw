import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DataGrid } from '@mui/x-data-grid';
import config from "../../config";
import UploadDialog from "../upload-dialog/UploadDialog";
import {useNavigate} from "react-router-dom";


const TemplatesList = () => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    const token = storedData.accessToken;
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);
    const [description, setDescription] = useState('');
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const navigate = useNavigate();

    const handleOpenUploadDialog = () => {
        setUploadDialogOpen(true);
    };

    const handleCloseUploadDialog = () => {
        setUploadDialogOpen(false);
    };

    const fetchTemplates = () => {
        const storedData = JSON.parse(localStorage.getItem("userData"));
        const token = storedData.accessToken;
        fetch(`${config.API_BASE_URL}templates/`, {
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
                    file: template.content || '',
                    description: template.description || ''
                })));
            })
            .catch(error => {
                console.error('Error fetching templates:', error);
            });
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const handleDescription = (description) => {
        setDescription(description);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleEdit = () => {
    };

    const handleDeletedTemplates = () => {
        navigate("/templates/deleted");
    }

    const handleDelete = (templateId) => {
        fetch(`${config.API_BASE_URL}templates/${templateId}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete template');
                }
                setRows(rows.filter(row => row.templateId !== templateId));
            })
            .catch(error => {
                console.error('Error deleting template:', error);
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
            field: 'file',
            headerName: 'Download File',
            width: 150,
            renderCell: (params) => {
                const handleDownload = () => {
                    fetch(`${config.API_BASE_URL}templates/${params.row.templateId}/download`, {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    })
                        .then(response => {
                            if (response.ok) {
                                return response.blob();
                            } else {
                                throw new Error('Failed to download file');
                            }
                        })
                        .then(blob => {
                            const url = window.URL.createObjectURL(new Blob([blob]));
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', params.row.name);
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        })
                        .catch(error => {
                            console.error('Error downloading file:', error);
                        });
                };

                return (
                    <button className="login-button" style={{cursor: 'pointer', width: "100px", marginTop: "5px", marginRight: "5px"}} onClick={handleDownload}>
                        Download
                    </button>
                );
            }
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 300,
            renderCell: (params) => {
                return (
                    <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
                        <button className="login-button" style={{cursor: 'pointer', width: "100px", marginTop: "5px", marginRight: "5px"}} onClick={() => handleDescription(params.row.description)}>Description</button>
                        <button className="login-button" style={{cursor: 'pointer', width: "100px", marginTop: "5px", marginRight: "5px"}} onClick={() => handleEdit(params.row)}>Edit</button>
                        <button className="login-button" style={{cursor: 'pointer', width: "100px", marginTop: "5px", marginRight: "5px"}} onClick={() => handleDelete(params.row.templateId)}>Delete</button>
                    </div>
                );
            }
        }
    ];

    return (
        <div style={{ width: "100%", marginTop: "100px" }}>
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
            <div style={{display: "flex", justifyContent: "flex-end", marginTop: "10px", marginRight: "10px"}}>
                <button className="login-button" style={{marginRight: "10px"}} onClick={handleOpenUploadDialog}>Add template</button>
                <button className="login-button" style={{marginRight: "10px"}} onClick={handleDeletedTemplates}>Deleted Templates</button>
            </div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Description</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {description}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>

            <UploadDialog open={uploadDialogOpen} handleClose={handleCloseUploadDialog} refreshTemplates={fetchTemplates} />
        </div>
    );
}

export default TemplatesList;
