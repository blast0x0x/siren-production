import React from 'react';
import {
  Container,
  Typography
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

const NotFound = () => {
  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Typography variant="h1" component="h2">
          Page Not Found
        </Typography>
        <Typography paragraph="true">
          Sorry, this page does not exist
        </Typography>
      </Container>
    </ThemeProvider>
  );
};

export default NotFound;
