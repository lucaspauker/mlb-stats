import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import './Header.css';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar className="header-container">
        <SportsBaseballIcon className="header-logo" fontSize='inherit'/>
        <Typography variant="h1">
          <span className="header-title">MLB-STATS</span>
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

