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
  Button,
  Grid,
  TextField,
  MenuItem
} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Spinner from './Spinner';
import { getUsers, getUser, deleteUserById } from '../actions/user';
import formatDate from '../utils/formatDate';
import { getProgrammes } from '../actions/programme'

const theme = createTheme();

export default function Users() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [usersPage, setUsersPage] = React.useState(1);
  const { users, userloading } = useSelector(state => state.user);
  const { programmes } = useSelector(state => state.programme);

  let programmesFiltered = programmes.filter((programme) => programme.isRemoved === false);
  const programmeNameMenu = [];
  programmeNameMenu.push("All Programmes");
  for (let i = 0; i < programmesFiltered.length; i ++)
    programmeNameMenu.push(programmesFiltered[i].name);
  const [programmeMenuItemNum, setProgrammeMenuItemNum] = React.useState(0);
  const [programmeId, setProgrammeId] = React.useState(0);

  const maxrow = 10;
  let usersFiltered;
  let usersToShow = [];
  let usersTotalShow = 0;
  
  if (programmeId !== 0)
    usersFiltered = users.filter((user) => user.programme === programmeId && user.approvalState === 2 && user.isRemoved === false);
  else
    usersFiltered = users.filter((user) => user.approvalState === 2 && user.isRemoved === false);
    
  usersToShow = usersFiltered?.slice(maxrow * (usersPage - 1), maxrow * usersPage);
  usersTotalShow = usersFiltered.length;
  
  const usersPages = Math.ceil(usersTotalShow / maxrow);

  const handleUsersPageChange = (event, value) => {
    setUsersPage(value);
  };

  const editUser = (id) => {
    dispatch(getUser(id, navigate));
  }

  const deleteUser = (id) => {
    dispatch(deleteUserById(id));
  }

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getProgrammes());
  }, [dispatch]);

  useEffect(() => {
    if (user?.job !== 'Support Manager') {
      navigate('/dashboard');
    }
  })

  const handleProgrammeMenuItem = async (index) => {
    setProgrammeMenuItemNum(index);

    if (index > 0)
      index = programmesFiltered[index - 1]._id;
      
    setProgrammeId(index);
  }

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
            Users
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Button
                sx={{
                  width: '200px',
                  mt: 4
                }}
                component={Link}
                to="/user/create"
                variant="contained"
                endIcon={<AddIcon />}
                color="primary"
              >
                Add User
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="programme"
                fullWidth
                id="programme"
                label="Programme Selection"
                value={programmeNameMenu[programmeMenuItemNum]}
                select
              >
                { programmeNameMenu.map((option, index) => (
                  <MenuItem key={option} value={option} onClick={() => handleProgrammeMenuItem(index)}>
                    {option}
                  </MenuItem>
                )) } 
              </TextField>
            </Grid>
          </Grid>          
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
                  <TableCell align="left"><b>User Name</b></TableCell>
                  <TableCell align="center"><b>Date of Birth</b></TableCell>
                  <TableCell align="center"><b>Address</b></TableCell>
                  <TableCell align="center"><b>Phone Number</b></TableCell>
                  <TableCell align="center"><b>Email</b></TableCell>
                  <TableCell align="center"><b>Job</b></TableCell>
                  <TableCell align="center"><b>Programme</b></TableCell>
                  <TableCell align="center"><b>Contract No</b></TableCell>
                  <TableCell align="center"><b>Status</b></TableCell>
                  <TableCell align="center" colSpan={2}><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usersToShow.map((user, index) => {
                  const programme = programmesFiltered.filter((element) => element._id === user.programme);
                  return (
                    <TableRow
                      key={user._id}
                      index={index}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      style={index % 2 === 1 ? { background: '#daf8ff6b' } : { background: '#ffffff' }}
                    >
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell align="left">{user.firstName + ' ' + user.lastName}</TableCell>
                      <TableCell align="center">{formatDate(user.birth)}</TableCell>
                      <TableCell align="center">{user.address}</TableCell>
                      <TableCell align="center">{user.phone}</TableCell>
                      <TableCell align="center">{user.email}</TableCell>
                      <TableCell align="center">{user.job}</TableCell>
                      <TableCell align="center">{
                        programme[0]?.name
                      }</TableCell>
                      <TableCell align="center">{user.contractNo}</TableCell>
                      {user.approvalState === 2 ? (
                        <TableCell
                          align="center"
                          sx={{ color: '#65C466' }}
                        >
                          Approved
                        </TableCell>) : user.approvalState === 1 ? (
                          <TableCell
                            align="center"
                            sx={{ color: '#9fa18c' }}
                          >
                            Declined
                          </TableCell>
                        ) : (
                        <TableCell
                            align="center"
                          sx={{ color: '#c55615' }}
                        >
                          Pending
                        </TableCell>
                      )}
                      <TableCell align="center" sx={{ pr: 0 }}>
                        <Button
                          onClick={() => editUser(user._id)}
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
                          onClick={() => deleteUser(user._id)}
                          sx={{ pl: 0 }}
                        >
                          <DeleteIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            <Pagination
              sx={{
                my: 1,
                display: 'flex',
                justifyContent: 'center'
              }}
              color="primary"
              count={usersPages}
              page={usersPage}
              onChange={handleUsersPageChange}
            />
          </TableContainer>
          {userloading && <Spinner />}
        </Box>
    </Container>
  </ThemeProvider>);
}