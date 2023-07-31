import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TableSortLabel } from '@mui/material';
import { Link } from "react-router-dom";

import Footer from './Footer';

const TeamDataTable = () => {
  const [teamData, setTeamData] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'elo', direction: 'desc' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/team_data.json');
        const data = await response.json();
        setTeamData(data);
      } catch (error) {
        console.error('Error fetching team data:', error);
      }
    };

    fetchData();
  }, []);

  const sortTable = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const calculateWinPercentage = (wins, losses) => {
    return ((wins / (wins + losses)) * 100).toFixed(1);
  };

  const sortedTeams = teamData && Object.keys(teamData).sort((a, b) => {
    if (sortConfig.key === 'elo') {
      return sortConfig.direction === 'asc' ? teamData[a].elo - teamData[b].elo : teamData[b].elo - teamData[a].elo;
    } else if (sortConfig.key === 'winPercentage') {
      const winPercentageA = calculateWinPercentage(teamData[a].wins, teamData[a].losses);
      const winPercentageB = calculateWinPercentage(teamData[b].wins, teamData[b].losses);
      return sortConfig.direction === 'asc' ? winPercentageA - winPercentageB : winPercentageB - winPercentageA;
    } else if (sortConfig.key === 'projWinLoss') {
      return sortConfig.direction === 'asc' ? teamData[a].projected_wins - teamData[b].projected_wins : teamData[b].projected_wins - teamData[a].projected_wins;
    } else {
      return sortConfig.direction === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
    }
  });

  return (
    <div>
      { !teamData ?
        <div className='loading'>
          Loading...
        </div>
        :
        <>
        <TableContainer component={Paper} variant='outlined'>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.key === 'teamName'}
                    direction={sortConfig.key === 'teamName' ? sortConfig.direction : 'desc'}
                    onClick={() => sortTable('teamName')}
                  >
                    <Typography variant="subtitle1" component="div" fontWeight="bold">
                      Team Name
                    </Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.key === 'winPercentage'}
                    direction={sortConfig.key === 'winPercentage' ? sortConfig.direction : 'desc'}
                    onClick={() => sortTable('winPercentage')}
                  >
                    <Typography variant="subtitle1" component="div" fontWeight="bold">
                      Win Percentage
                    </Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.key === 'projWinLoss'}
                    direction={sortConfig.key === 'projWinLoss' ? sortConfig.direction : 'desc'}
                    onClick={() => sortTable('projWinLoss')}
                  >
                    <Typography variant="subtitle1" component="div" fontWeight="bold">
                      Projected Record
                    </Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortConfig.key === 'elo'}
                    direction={sortConfig.key === 'elo' ? sortConfig.direction : 'desc'}
                    onClick={() => sortTable('elo')}
                  >
                    <Typography variant="subtitle1" component="div" fontWeight="bold">
                      ELO
                    </Typography>
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedTeams.map((teamName) => {
                const { wins, losses, elo, projected_wins, projected_losses } = teamData[teamName];
                const projWinsLoss = `${projected_wins}-${projected_losses}`;
                const teamInfo = `${teamName} (${wins}-${losses})`;
                const winPercentage = calculateWinPercentage(wins, losses);
                const logoFileName = `${teamName}.png`;
                const logoSrc = `/team_logos/${logoFileName}`;
                return (
                  <TableRow key={teamName}>
                    <TableCell>
                      <Typography variant="body1" component="div" className="horizontal-box">
                        <span style={{width:'50px', marginTop: 4}}><img src={logoSrc} alt={`${teamName} Logo`} style={{ height: '30px', marginRight: '10px' }} /></span>
                        <Link to={"/teams/" + teamName}>
                          {teamInfo}
                        </Link>
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">
                        {winPercentage}%
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">
                        {projWinsLoss}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">
                        {elo}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <div className="medium-space"/>
        <Footer/>
        </>
      }
    </div>
  );
};

export default TeamDataTable;

