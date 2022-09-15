import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  CssBaseline,
  Container,
} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();

export default function Landing() {

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" sx={{ width: '100%', maxWidth: '100% !important', padding: '0 !important' }}>
        <CssBaseline />
        <section className="landing">
          <div className="dark-overlay">
            <div className="landing-inner">
              <h1 className="x-large">Siren Procurement System v1.0</h1>
              <p className="lead">
                Building responsive institutions, promoting prosperous societies
              </p>
              <div className="buttons">
                <Link to="/signin" className="btn btn-primary signinbutton">
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn-light signupbutton">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </ThemeProvider>
  );
}