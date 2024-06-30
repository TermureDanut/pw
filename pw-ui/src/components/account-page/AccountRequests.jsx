import Box from "@mui/material/Box";
import {DataGrid} from "@mui/x-data-grid";
import React, {useEffect, useState} from "react";
import config from "../../config";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { format } from 'date-fns';

const columns = [
    {
        field: 'id',
        headerName: '#',
        width: 90,
    },
    {
        field: 'template',
        headerName: 'Template',
        width: 150,
    },
    {
        field: 'completed',
        headerName: 'Completed',
        width: 200,
        renderCell: (params) => (
            params.value ? <CheckIcon /> : <CloseIcon />
        )
    },
    {
        field: 'madeAt',
        headerName: 'Made at',
        width: 300,
    },
    {
        field: 'completedAt',
        headerName: 'Completed at',
        width: 300,
    },
];

const AccountRequests = () => {
    const [rows, setRows] = useState([]);

    const storedData = JSON.parse(localStorage.getItem("userData"));
    const token = storedData.accessToken;

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await fetch(`${config.API_BASE_URL}students/requests/${storedData.user.id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch uncompleted requests');
                }

                const data = await response.json();

                setRows(data.reverse().map((request, index) => ({
                    id: index + 1,
                    template: request.template.name || '',
                    completed: request.completed,
                    madeAt: format(new Date(request.madeDate), 'HH:mm dd:MM:yyyy'),
                    completedAt: request.solvedDate ? format(new Date(request.solvedDate), 'HH:mm dd:MM:yyyy') : "No date yet!",
                })));
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };

        fetchRequests();
    }, []);

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
                    <p>Requests</p>
                </div>
            </div>
            <Box sx={{height: 'auto', width: '100%'}}>
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
    )
}
export default AccountRequests;