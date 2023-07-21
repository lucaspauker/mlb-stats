import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { Button, ToggleButton, ToggleButtonGroup } from '@mui/material';

import './App.css';
import Header from './Header';
import TeamDataTable from './TeamDataTable';
import GameProbabilities from './GameProbabilities';
import GroupsIcon from '@mui/icons-material/Groups';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import {FaBaseballBall} from 'react-icons/fa';
import theme from './theme';

function App() {
  const [page, setPage] = useState('teams');

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Header />
        <div className='main-content'>
          <ToggleButtonGroup
            size='large'
            color='secondary'
            value={page}
            exclusive
            onChange={(e, value) => setPage(value)}
          >
            <ToggleButton value="teams">
              <GroupsIcon sx={{marginRight:1}}/>
              Team ratings
            </ToggleButton>
            <ToggleButton value="games">
              <ContentPasteIcon sx={{marginRight:1}}/>
              Game predictions
            </ToggleButton>
          </ToggleButtonGroup>
          <div className='small-space' />
          {page === 'teams' ?
            <TeamDataTable />
            : page === 'games' ?
            <GameProbabilities />
            : null
          }
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
