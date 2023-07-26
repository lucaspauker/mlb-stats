import React, { useEffect, useState } from 'react';
import { Typography, Button } from '@mui/material';
import { useNavigate, useParams } from "react-router-dom";

import GraphWithTooltips from './GraphWithTooltips';

const isValueInObjectKeys = (obj, value) => Object.keys(obj).includes(value);

const TeamPage = () => {
  const [teamData, setTeamData] = useState(null);
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const team = useParams().id;
  const logoFileName = `${team}.png`;
  const logoSrc = `/team_logos/${logoFileName}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/team_over_time.json');
        const data = await response.json();
        if (!isValueInObjectKeys(data, team)) setError("Team not found");
        setTeamData(data[team]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      { error ?
        <div className='error'>
          Error: team not found
        </div>
        : !teamData ?
        <div className='loading'>
          Loading...
        </div>
        :
        <div>
          <Button onClick={() => navigate(-1)} variant='outlined'>Go back</Button>
          <div className="center-box">
            <img src={logoSrc} alt={`${team} Logo`} style={{ height: '200px', marginRight: '10px' }} />
          </div>
          <div className="medium-space" />
          <Typography variant="h1">{team} ELO this season</Typography>
          <div className="small-space" />
          <GraphWithTooltips data={teamData} />
        </div>
      }
    </div>
  );
}

export default TeamPage;
