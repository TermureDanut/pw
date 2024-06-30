import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {Avatar, Button, Menu, MenuItem} from "@mui/material";
import {useState} from "react";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {useNavigate} from "react-router-dom";

const drawerWidth = 240;

const ClippedDrawer = ({ onButtonClick }) => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    const user = storedData.user;
    const isStudent = storedData.student;
    const isSecretary = storedData.secretary;

    const [anchorElAccount, setAnchorElAccount] = useState(null);
    const navigate = useNavigate();
    const [selectedButton, setSelectedButton] = useState("2");

    const handleButtonClick = (buttonName) => {
        setSelectedButton(buttonName);
        onButtonClick(buttonName);
    };

    const handleClickAccount = (event) => {
        setAnchorElAccount(event.currentTarget);
    };

    const handleCloseAccount = () => {
        setAnchorElAccount(null);
    };
    const firstLetter = user.firstName.charAt(0).toUpperCase();
    const handleLogout = () => {
        localStorage.removeItem("userData");
        navigate("/");
    }

    const handleMyAccount = () => {
        navigate("/myaccount");
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: "white" }}>
                <Toolbar sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <Typography variant="h6" noWrap component="div" sx = {{color: 'grey'}}>
                        Meniu
                    </Typography>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleClickAccount}
                            edge="start"
                            sx={{marginRight: 1}}
                        >
                            <Avatar>{firstLetter}</Avatar>
                        </IconButton>

                        <Menu
                            anchorEl={anchorElAccount}
                            open={Boolean(anchorElAccount)}
                            onClose={handleCloseAccount}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <MenuItem onClick={handleMyAccount}>
                                <AccountCircleIcon sx={{color: 'grey', marginRight: 1}}/>
                                Account
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <LogoutIcon sx={{color: 'grey', marginRight: 1}}/>
                                Logout
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
            {isSecretary === true ?
                <Drawer
                    variant="permanent"
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                    }}
                >
                    <Toolbar />
                    <Box sx={{ overflow: 'auto' }}>
                        <Button
                            fullWidth
                            onClick={() => handleButtonClick('2')}
                            sx={{
                                color: selectedButton === 'All Templates' ? 'white' : 'grey',
                                height: '50px',
                                marginBottom: 1,
                                backgroundColor: selectedButton === '2' ? 'black' : 'transparent',
                            }}
                        >
                            All Templates
                        </Button>
                        <Button
                            fullWidth
                            onClick={() => handleButtonClick('3')}
                            sx={{
                                color: selectedButton === 'All Students' ? 'white' : 'grey',
                                height: '50px',
                                marginBottom: 1,
                                backgroundColor: selectedButton === '3' ? 'black' : 'transparent',
                            }}
                        >
                            All Students
                        </Button>
                        <Button
                            fullWidth
                            onClick={() => handleButtonClick('4')}
                            sx={{
                                color: selectedButton === 'All Requests' ? 'white' : 'grey',
                                height: '50px',
                                marginBottom: 1,
                                backgroundColor: selectedButton === '4' ? 'black' : 'transparent',
                            }}
                        >
                            All Requests
                        </Button>
                    </Box>
                </Drawer>
                : isStudent === true ? <></> : <></>

            }
        </Box>
    );
}

export default ClippedDrawer;