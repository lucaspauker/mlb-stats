import { useRouteError } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Typography, Button } from '@mui/material';

export default function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();
  console.error(error);

  return (
    <div id="error-page">
      <Button onClick={() => navigate(-1)} variant='outlined'>Go back</Button>
      <div className="medium-space"/>
      <Typography variant="h2">Oops, an unexpected error has occured!</Typography>
      <div className="small-space"/>
      <Typography sx={{fontSize: 24}}>
        <i>{error.status} {error.statusText || error.message}</i>
      </Typography>
    </div>
  );
}
