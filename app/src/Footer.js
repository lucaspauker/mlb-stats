import React from 'react';
import { Link } from "react-router-dom";
import { Typography } from '@mui/material';

const Footer = () => {
  return (
    <div className='vertical-box'>
      <Typography>
        <Link to="/about#" className='vertical-box' style={{color:'blue'}}>
          Learn more about how we calculate these numbers →
        </Link>
      </Typography>
    </div>
  );
};

export default Footer;

