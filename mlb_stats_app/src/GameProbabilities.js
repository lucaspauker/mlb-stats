import React, { useEffect, useState } from 'react';
import { Typography, Paper, CircularProgress } from '@mui/material';

import './GameProbabilities.css';

const GameProbabilities = () => {
  const [teamData, setTeamData] = useState(null);
  const [gameData, setGameData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/today_data.json');
        const data = await response.json();
        setGameData(data);

        const response2 = await fetch('/team_data.json');
        const data2 = await response2.json();
        setTeamData(data2);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const convertToHoursMinutesAMPM = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const amPM = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12;

    // Add leading zeros to minutes if necessary
    const minutesString = minutes < 10 ? `0${minutes}` : `${minutes}`;

    return `${hours}:${minutesString} ${amPM}`;
  }

  return (
    <div>
      { !gameData || !teamData ?
        <div className='loading'>
          Loading...
        </div>
        :
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {gameData.map((game, index) => {
            const { home_team, away_team, prob_home, prob_away, game_time } = game;
            const gameTime = new Date(game_time);
            const gameTimeString = convertToHoursMinutesAMPM(gameTime);
            let hasGamePassed = false;
            if (new Date() > gameTime) {
              hasGamePassed = true;
            }
            const homeData = teamData[home_team];
            const homeTeamInfo = `(${homeData['wins']}-${homeData['losses']})`;
            const homeTeamLogo = `/team_logos/${home_team}.png`;
            const awayData = teamData[away_team];
            const awayTeamInfo = `(${awayData['wins']}-${awayData['losses']})`;
            const awayTeamLogo = `/team_logos/${away_team}.png`;

            return (
              <Paper key={index} className='game-box' variant='outlined'>
                {hasGamePassed ?
                  <Typography variant="caption" sx={{color:'grey'}}>
                    Game started today at {gameTimeString}
                  </Typography>
                  :
                  <Typography variant="caption" sx={{color:'grey'}}>
                    Game starts today at {gameTimeString}
                  </Typography>
                }
                <div className='small-space'/>
                <div className='horizontal-box game-teams-box'>
                  <div className='vertical-box' style={{width:'40%'}}>
                    <img src={homeTeamLogo} alt={`${home_team} Logo`} style={{ height: '64px', marginRight: '10px' }} />
                    <Typography variant="body1">
                      {home_team}
                    </Typography>
                    <Typography variant="body1">
                      {homeTeamInfo}
                    </Typography>
                  </div>
                  <Typography variant="body1">
                    @
                  </Typography>
                  <div className='vertical-box' style={{width:'40%'}}>
                    <img src={awayTeamLogo} alt={`${away_team} Logo`} style={{ height: '64px', marginRight: '10px' }} />
                    <Typography variant="body1">
                      {away_team}
                    </Typography>
                    <Typography variant="body1">
                      {awayTeamInfo}
                    </Typography>
                  </div>
                </div>
                <div className='medium-space'/>
                {prob_home > prob_away ?
                  <Typography variant="body1">
                    <b>{prob_home}%</b> chance the <b>{home_team}</b> win
                  </Typography>
                  :
                  <Typography variant="body1">
                    <b>{prob_away}%</b> chance the <b>{away_team}</b> win
                  </Typography>
                }
              </Paper>
            );
          })}
        </div>
      }
    </div>
  );
};

export default GameProbabilities;

