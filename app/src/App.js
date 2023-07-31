import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Typography, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';

import './App.css';
import Header from './Header';
import TeamDataTable from './TeamDataTable';
import GameProbabilities from './GameProbabilities';
import About from './About';
import TeamPage from './TeamPage';
import ErrorPage from './ErrorPage';
import GroupsIcon from '@mui/icons-material/Groups';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import {FaBaseballBall} from 'react-icons/fa';
import theme from './theme';

const Layout = ({elem, name="Home Page",
                 description="Welcome to SportsGenie. This is the home page."}) => {
  return(
    <div>
      <Helmet>
        <title>SportsGenie - {name}</title>
        <title>{name} - SportsGenie</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={name + " - SportsGenie"} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://sports-genie.com/android-chrome-512x512.png" />
        <meta property="og:url" content="https://sports-genie.com/" />
        <meta property="og:type" content="website" />
      </Helmet>
      <Header />
      <div className='main-content'>
        <div className='toggle-container'>
          <ToggleButtonGroup
            size='large'
            color='secondary'
            value={window.location.pathname}
            exclusive
            className='toggle-group'
          >
            <ToggleButton value="/" component={Link} to="/" className="toggle-button">
              <GroupsIcon sx={{marginRight:1}}/>
              Team ratings
            </ToggleButton>
            <ToggleButton value="/games" component={Link} to="/games" className="toggle-button">
              <ContentPasteIcon sx={{marginRight:1}}/>
              Game predictions
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <div className='medium-space' />
        {elem}
        <div className='medium-space' />
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout elem={<TeamDataTable />} name="Team Ratings"
                description="Team ELO and ranking data for all MLB baseball teams." />,
    errorElement: <Layout elem={<ErrorPage />} />,
  },
  {
    path: "/games",
    element: <Layout elem={<GameProbabilities />} name="Game Predictions"
                description="Probabilities for all MLB baseball games today." />,
    errorElement: <Layout elem={<ErrorPage />} />,
  },
  {
    path: "/teams/:id",
    element: <Layout elem={<TeamPage />} name="Team Page"
                description="Team-specific data throughout the season for MLB baseball teams." />,
    errorElement: <Layout elem={<ErrorPage />} />,
  },
  {
    path: "/about",
    element: <Layout elem={<About />} name="About"
                description="About SportsGenie: how we create our MLB baseball models." />,
    errorElement: <Layout elem={<ErrorPage />} />,
  },
]);

function App() {
  const [page, setPage] = useState('teams');

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </ThemeProvider>
  );
}

export default App;
