import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import Header from './Header';
import TeamDataTable from './TeamDataTable';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Header />
        <div className='main-content'>
          <TeamDataTable />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
