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
import { updateProgramme, getProgramme } from '../actions/programme';

const theme = createTheme();

const currencies = [
  {
    value: 'DKK',
    label: 'DKK'
  },
  {
    value: 'EUR',
    label: 'EUR',
  },
  {
    value: 'GBP',
    label: 'GBP',
  },
  {
    value: 'JOD',
    label: 'JOD',
  },
  {
    value: 'LBP',
    label: 'LBP',
  },
  {
    value: 'USD',
    label: 'USD',
  }
];

export default function ProgrammeUpdate() {
  const { id } = useParams();
  const { programme } = useSelector(state => state.programme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = React.useState(programme?.name);
  const [acronym, setAcronym] = React.useState(programme?.acronym);
  const [donor, setDonor] = React.useState(programme?.donor);
  const [totalBudget, setTotalBudget] = React.useState(programme?.total_budget);
  const [currency, setCurrency] = React.useState(programme?.currency);
  const [value, setValue] = React.useState(programme?.start_date);
  const [duration, setDuration] = React.useState(programme?.duration);
  const [manager, setManager] = React.useState(programme?.manager);
  const setN = (event) => {
    setName(event.target.value);
  }
  const setA = (event) => {
    setAcronym(event.target.value);
  }
  const setDO = (event) => {
    setDonor(event.target.value);
  }
  const setT = (event) => {
    setTotalBudget(event.target.value);
  }
  const setC = (event) => {
    setCurrency(event.target.value);
  }
  const setDU = (event) => {
    setDuration(event.target.value);
  }
  const setM = (event) => {
    setManager(event.target.value);
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get('name');
    const acronym = data.get('acronym');
    const donor = data.get('donor');
    const totalBudget = parseInt(data.get('totalBudget'));
    const currency = data.get('currency');
    const startDate = value;
    const duration = parseInt(data.get('duration'));
    const manager = data.get('manager');
    dispatch(updateProgramme({ id, name, acronym, donor, totalBudget, currency, startDate, duration, manager }, navigate));
  };

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate('/dashboard');
  //   }
  // }, [isAuthenticated, navigate])

  useEffect(() => {
    dispatch(getProgramme(id));
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
              Edit Programme
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="given-name"
                    name="name"
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    autoFocus
                    value={name}
                    onChange={setN}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="acronym"
                    required
                    fullWidth
                    id="acronym"
                    label="Acronym"
                    value={acronym}
                    onChange={setA}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="donor"
                    required
                    fullWidth
                    id="donor"
                    label="Donor"
                    value={donor}
                    onChange={setDO}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    type="number"
                    id="totalBudget"
                    label="Total Budget"
                    name="totalBudget"
                    value={totalBudget}
                    onChange={setT}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="currency"
                    label="Currency"
                    name="currency"
                    value={currency}
                    onChange={setC}
                    select
                  >
                    {currencies.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <DatePicker
                    name="startDate"
                    id="startDate"
                    label="Start Date:"
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
                    type="number"
                    id="duration"
                    label="Duration (Months)"
                    name="duration"
                    value={duration}
                    onChange={setDU}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="manager"
                    required
                    fullWidth
                    id="manager"
                    label="Programme Manager"
                    value={manager}
                    onChange={setM}
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