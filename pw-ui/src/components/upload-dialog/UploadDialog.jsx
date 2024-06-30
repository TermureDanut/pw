import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import config from "../../config";

const Input = styled('input')({
    display: 'none',
});

const UploadDialog = ({ open, handleClose, refreshTemplates }) => {
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');
    const storedData = JSON.parse(localStorage.getItem("userData"));
    const token = storedData.accessToken;

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleUpload = () => {
        if (!file || !description) {
            alert("Please select a file and enter a description");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('description', description);

        fetch(`${config.API_BASE_URL}templates/`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to upload template');
                }
                return response.json();
            })
            .then(data => {
                handleClose();
                refreshTemplates();
            })
            .catch(error => {
                console.error('Error uploading template:', error);
            });
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Upload Template</DialogTitle>
            <DialogContent>
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        label="Description"
                        variant="outlined"
                        value={description}
                        onChange={handleDescriptionChange}
                    />
                    <label htmlFor="upload-file">
                        <Input
                            id="upload-file"
                            type="file"
                            onChange={handleFileChange}
                        />
                        <Button variant="contained" component="span">
                            {file ? file.name : "Select File"}
                        </Button>
                    </label>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleUpload}>Upload</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UploadDialog;
