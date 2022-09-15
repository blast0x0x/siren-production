import * as React from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  CssBaseline,
  Container,
  Box,
  Typography,
  Table,
  TableContainer,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Pagination,
  Paper,
  Button
} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Spinner from './Spinner';
import { getProgrammes, getProgramme, deleteProgrammeById } from '../actions/programme';
import formatDate from '../utils/formatDate';

const theme = createTheme();

export default function Programmes() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [programmesPage, setProgrammesPage] = React.useState(1);
  const { programmes, programmeloading } = useSelector(state => state.programme);

  const maxrow = 10;
  const programmesToShow = programmes?.slice(maxrow * (programmesPage - 1), maxrow * programmesPage);
  const programmesTotalShow = programmes.length;
  const programmesPages = Math.ceil(programmesTotalShow / maxrow);

  const handleProgrammesPageChange = (event, value) => {
    setProgrammesPage(value);
  };

  const deleteProgramme = (id) => {
    dispatch(deleteProgrammeById(id));
  }

  const editProgramme = (id) => {
    dispatch(getProgramme(id, navigate));
  } 

  useEffect(() => {
    dispatch(getProgrammes());
  }, [dispatch]);

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
            Programmes
          </Typography>
          {user?.job === 'Support Manager' &&
            <Button
              sx={{
                width: '200px',
                mt: 4
              }}
              component={Link}
              to="/programme/create"
              variant="contained"
              endIcon={<AddIcon />}
              color="primary"
            >
              Add Programme
            </Button>
          }
          <TableContainer
            sx={{ mt: 1 }}
            component={Paper}
          >
            <Table
              sx={{ minWidth: 650 }}
              aria-label="simple table"
            >
              <TableHead sx={{ background: '#c4c4c4' }}>
                <TableRow>
                  <TableCell align="center"><b>No.</b></TableCell>
                  <TableCell align="left"><b>Name</b></TableCell>
                  <TableCell align="center"><b>Acronym</b></TableCell>
                  <TableCell align="center"><b>Donor</b></TableCell>
                  <TableCell align="center"><b>Total Budget</b></TableCell>
                  <TableCell align="center"><b>Currency</b></TableCell>
                  <TableCell align="center"><b>Start Date</b></TableCell>
                  <TableCell align="center"><b>Duration</b></TableCell>
                  <TableCell align="center"><b>Manager</b></TableCell>
                  {user?.job === 'Support Manager' &&
                    <TableCell align="center" colSpan={2}><b>Actions</b></TableCell>
                  }
                </TableRow>
              </TableHead>
              <TableBody>
                {programmesToShow.map((programme, index) => (
                  <TableRow
                    key={programme._id}
                    index={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    style={index % 2 === 1 ? { background: '#daf8ff6b' } : { background: '#ffffff' }}
                  >
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="left">{programme.name}</TableCell>
                    <TableCell align="center">{programme.acronym}</TableCell>
                    <TableCell align="center">{programme.donor}</TableCell>
                    <TableCell align="center">{programme.total_budget}</TableCell>
                    <TableCell align="center">{programme.currency}</TableCell>
                    <TableCell align="center">{formatDate(programme.start_date)}</TableCell>
                    <TableCell align="center">{programme.duration}</TableCell>
                    <TableCell align="center">{programme.manager}</TableCell>
                    {user?.job === 'Support Manager' &&
                      <>
                        <TableCell align="center" sx={{ pr: 0 }}>
                          <Button
                            onClick={() => editProgramme(programme._id)}
                            variant="text"
                            color="primary"
                            sx={{ pr: 0 }}
                          >
                            <EditIcon />
                          </Button>
                        </TableCell>
                        <TableCell align="center" sx={{ pl: 0 }}>
                          <Button
                            variant="text"
                            color="primary"
                            onClick={() => deleteProgramme(programme._id)}
                            sx={{ pl: 0 }}
                          >
                            <DeleteIcon />
                          </Button>
                        </TableCell>
                      </>
                    }
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination
              sx={{
                my: 1,
                display: 'flex',
                justifyContent: 'center'
              }}
              color="primary"
              count={programmesPages}
              page={programmesPage}
              onChange={handleProgrammesPageChange}
            />
          </TableContainer>
          {programmeloading && <Spinner />}
        </Box>
      </Container>
    </ThemeProvider>);
}