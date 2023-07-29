import React from 'react';
import { useNavigate } from "react-router-dom";
import { Button, Typography } from '@mui/material';
import { Link } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Button onClick={() => navigate(-1)} variant='outlined'>Go back</Button>
      <div className="medium-space"/>
      <Typography variant="h2">
        About SportsGenie
      </Typography>
      <Typography variant="h3">
        What is ELO score?
 Insight     </Typography>
      <Typography>
        ELO score is a numerical rating system used to evaluate the relative skill levels of players in competitive games, most notably in chess but also adopted in various other sports and games. Named after its creator, Arpad Elo, this system assigns a numeric rating to each player, with higher scores indicating greater proficiency. The fundamental principle behind the ELO score is that players gain or lose points based on the outcome of their matches and the rating of their opponents. If a player defeats a higher-rated opponent, they will earn more points, whereas losing to a lower-rated opponent will lead to a deduction in points. This process of recalculating ratings after each match aims to provide a dynamic and accurate representation of a player's skill, allowing for fair and competitive matchups.
      </Typography>
      <Typography variant="h3">
        How we calculate the ELO score for each team
      </Typography>
      <Typography>
        In order to calculate the ELO score for each team, we use the last 10 years of data.
        We start each team at a score of 1500, then go through all the games in the past 10 years and update the score each game.
        At the end of the season, we bring each team closer to 1500 by taking a weighted average of their current score and 1500.
        Specifically, we have <br/><center>NEW_SCORE = (OLD_SCORE * 2 + 1500) / 3.</center><br/>
        We do this to simulate teams getting new talent and the overall level of play evening out over time.
        The K value for the ELO update is 4, with a weighting for the run differential, as described&nbsp;
        <a style={{color: 'blue'}} target="_blank" href="https://legacy.baseballprospectus.com/article_legacy.php?articleid=5247">here</a>.
      </Typography>
      <Typography variant="h3">
        How we calculate the game probabilities
      </Typography>
      <Typography>
        In order to calculate the game probabilities for all the games on a given day, we first aggregate data about the ELO for each team and the stats for the starting pitchers.
        We then use a logistic regression model to compute the probabilities for each game.
        For predicting the probability of a team winning the game, it is important that the model is well-calibrated.
        Calibration refers to the alignment of predicted probabilities with the true probabilities.
        A well-calibrated classifier outputs probabilities that accurately reflect the likelihood of positive class occurrence, allowing for  a meaningful model.
        Below is the calibration curve for the model we use on the training dataset.
        The calibration curve is a graphical representation of how well-calibrated the model is.
        A perfectly calibrated model would lie along the 45 degree line.
      </Typography>
      <div className="vertical-box">
        <br/>
        <img src="calibration_curve.png" alt="Win/loss distribution graph" style={{ width: '50%' }} />
        <br/>
      </div>
      <Typography>
        As described in&nbsp;
        <a style={{color: 'blue'}} target="_blank" href="https://projects.fivethirtyeight.com/checking-our-work/">a 538 blog post</a>
        , with our model,&nbsp;<br/><br/>
        <span style={{color:'grey'}}>"We're not trying to pick winners, though; we're trying to model the games, which means including in our predictions all of the randomness inherent in baseball."</span>
        <br/><br/>
        For each game, our model predicts if the home team will win.
        Below is a graph of the probability distribution predicted by our model for games where the home team wins and in games where the home team loses.
        We can see that the mean of the distribution for the predictions where the home team wins is larger than the mean of the distribution where the home team loses.
        However, each distribution has a lot of variance because baseball inherently has a lot of variance.
      </Typography>
      <div className="vertical-box">
        <br/>
        <img src="win_loss_graph.png" alt="Win/loss distribution graph" style={{ width: '50%' }} />
        <br/>
      </div>
      <Typography>
        For more information on how the modeling works, check out our&nbsp;
        <a style={{color: 'blue'}} target="_blank" href="https://projects.fivethirtyeight.com/checking-our-work/">Github repo</a>,
        for all the code used to generate these graphs and the predictions!
      </Typography>
    </div>
  );
};

export default About;

