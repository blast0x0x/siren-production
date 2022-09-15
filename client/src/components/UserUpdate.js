import * as React from 'react';
import { useEffect } from 'react';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  CssBaseline,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  MenuItem
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getUser } from '../actions/user';
import { updateUser } from '../actions/auth';

const theme = createTheme();

const jobs = [
  {
    value: 'Staff',
    label: 'Staff'
  },
  {
    value: 'Support Manager',
    label: 'Support Manager',
  },
  {
    value: 'Finance Manager',
    label: 'Finance Manager',
  },
  {
    value: 'Procurement Manager',
    label: 'Procurement Manager',
  },
  {
    value: 'Chairman',
    label: 'Chairman',
  }
];

export default function UserUpdate() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  // const { isAuthenticated } = useSelector(state => state.auth);
  const { user } = useSelector(state => state.user);
  const [value, setValue] = React.useState(user?.birth);
  const [firstName, setFirstName] = React.useState(user?.firstName);
  const [lastName, setLastName] = React.useState(user?.lastName);
  const [address, setAddress] = React.useState(user?.address);
  const [phone, setPhone] = React.useState(user?.phone);
  const [email, setEmail] = React.useState(user?.email);
  const [job, setJob] = React.useState(user?.job);
  const [contractNo, setContractNo] = React.useState(user?.contractNo);
  const setFN = (event) => {
    setFirstName(event.target.value);
  }
  const setLN = (event) => {
    setLastName(event.target.value);
  }
  const setADD = (event) => {
    setAddress(event.target.value);
  }
  const setPH = (event) => {
    setPhone(event.target.value);
  }
  const setE = (event) => {
    setEmail(event.target.value);
  }
  const setJ = (event) => {
    setJob(event.target.value);
  }
  const setCN = (event) => {
    setContractNo(event.target.value);
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const firstName = data.get('firstName');
    const lastName = data.get('lastName');
    const birth = value;
    const address = data.get('address');
    const phone = data.get('phone');
    const job = data.get('job');
    const contractNo = data.get('contractNo');
    const email = data.get('email');
    dispatch(updateUser({ firstName, lastName, birth, address, phone, email, job, contractNo }, navigate));
  };

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate('/dashboard');
  //   }
  // }, [isAuthenticated, navigate])

  useEffect(() => {
    dispatch(getUser(id));
  }, [dispatch, id]);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography component="h1" variant="h5">
              Edit User
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First name"
                    value={firstName}
                    onChange={setFN}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last name"
                    name="lastName"
                    value={lastName}
                    onChange={setLN}
                    autoComplete="family-name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <DatePicker
                    name="birth"
                    id="birth"
                    label="Date of Birth:"
                    value={value}
                    onChange={(newValue) => {
                      setValue(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} fullWidth required />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="address"
                    label="Address"
                    name="address"
                    value={address}
                    onChange={setADD}
                    autoComplete="family-name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    type="number"
                    id="phone"
                    label="Phone number"
                    name="phone"
                    value={phone}
                    onChange={setPH}
                    autoComplete="family-name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    value={email}
                    onChange={setE}
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="job"
                    label="Job Title"
                    name="job"
                    value={job}
                    onChange={setJ}
                    select
                  >
                    {jobs.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="contractNo"
                    label="Contract No"
                    name="contractNo"
                    value={contractNo}
                    onChange={setCN}
                    autoComplete="family-name"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Update
              </Button>
            </Box>
          </Box>
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
}