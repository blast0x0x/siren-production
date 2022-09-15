import * as React from 'react';
import { useEffect } from 'react';
import {
  useSelector,
  // useDispatch
} from 'react-redux';
// import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  CssBaseline,
  Container,
  Box,
  Typography,
  // Table,
  // TableContainer,
  // TableRow,
  // TableHead,
  // TableCell,
  // TableBody,
  // Pagination,
  // Paper,
  // Button
} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import AddIcon from '@mui/icons-material/Add';
// import Spinner from './Spinner';
// import { getProgrammes, getProgramme, deleteProgrammeById } from '../actions/programme';
// import formatDate from '../utils/formatDate';

const theme = createTheme();

export default function GenerateReports() {
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (user?.job !== 'Support Manager' && user?.job !== 'Finance Manager') {
      navigate('/dashboard');
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xl">
        <CssBaseline />
        <Box
          sx={{
            mb: 8,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Typography
            sx={{
              mt: 1,
              textAlign: 'right',
              fontSize: '14px'
            }}
            component="h5"
            variant="h5"
          >
            {user?.firstName} {user?.lastName} - {user?.job}
          </Typography>
          <Typography
            sx={{
              textAlign: 'center',
              mt: 8
            }}
            component="h1"
            variant="h5"
          >
            Generate Reports
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>);
}