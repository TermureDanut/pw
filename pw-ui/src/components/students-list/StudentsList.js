import "./style.css";
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import config from "../../config";

const columns = [
    {
        field: 'id',
        headerName: '#',
        width: 90,
    },
    {
        field: 'firstName',
        headerName: 'First name',
        width: 150,
    },
    {
        field: 'lastName',
        headerName: 'Last name',
        width: 150,
    },
    {
        field: 'email',
        headerName: 'Email',
        width: 150,
    },
    {
        field: 'faculty',
        headerName: 'Faculty',
        width: 150,
    },
    {
        field: 'studiesProgram',
        headerName: 'Studies Program',
        width: 150,
    },
    {
        field: 'studiesType',
        headerName: 'Studies Type',
        width: 150,
    },
    {
        field: 'specialization',
        headerName: 'Specialization',
        width: 150,
    },
];

const StudentsList = () => {
    const [rows, setRows] = useState([]);
    const storedData = JSON.parse(localStorage.getItem("userData"));
    const token = storedData.accessToken;

    useEffect(() => {
        fetch(`${config.API_BASE_URL}students/`, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            }})
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch students');
                }
                return response.json();
            })
            .then(data => {
                setRows(data.map((student, index) => ({
                    id: index + 1,
                    firstName: student.firstName || '',
                    lastName: student.lastName || '',
                    email: student.email || '',
                    faculty: student.faculty || '',
                    studiesProgram: student.studiesProgram || '',
                    studiesType: student.studiesType || '',
                    specialization: student.specialization || '',
                })));
            })
            .catch(error => {
                console.error('Error fetching students:', error);
            });
    }, []);

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

export default StudentsList;
