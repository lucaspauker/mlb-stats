import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Typography, Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";

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

const Layout = ({elem}) => {
  return(
    <div>
      <Header />
      <div className='main-content'>
        <ToggleButtonGroup
          size='large'
          color='secondary'
          value={window.location.pathname}
          exclusive
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
        <div className='medium-space' />
        {elem}
      </div>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout elem={<TeamDataTable />} />,
    errorElement: <Layout elem={<ErrorPage />} />,
  },
  {
    path: "/games",
    element: <Layout elem={<GameProbabilities />} />,
    errorElement: <Layout elem={<ErrorPage />} />,
  },
  {
    path: "/teams/:id",
    element: <Layout elem={<TeamPage />} />,
    errorElement: <Layout elem={<ErrorPage />} />,
  },
  {
    path: "/about",
    element: <Layout elem={<About />} />,
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
