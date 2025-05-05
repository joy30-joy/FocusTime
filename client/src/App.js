import React from 'react';
import { Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Timer from './components/Timer';
import SessionHistory from './components/SessionHistory';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  // In a real app, this would come from authentication
  const userId = 'user123';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Timer userId={userId} />
        <SessionHistory userId={userId} />
      </Container>
    </ThemeProvider>
  );
}

export default App;