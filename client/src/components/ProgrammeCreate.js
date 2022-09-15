import * as React from 'react';
// import { useEffect } from 'react';
import {
  useDispatch,
  // useSelector
} from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
import { createProgramme } from '../actions/programme'

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

export default function ProgrammeCreate() {
  const [value, setValue] = React.useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get('name');
    const acronym = data.get('acronym');
    const donor = data.get('donor');
    const totalBudget = parseInt(data.get('totalBudget'));
    const currency = data.get('currency');
    console.log("Eagle ProgrmmeCreate:currency=", currency);
    const startDate = value;
    const duration = parseInt(data.get('duration'));
    const manager = data.get('manager');
    dispatch(createProgramme({ name, acronym, donor, totalBudget, currency, startDate, duration, manager }, navigate));
  };

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate('/dashboard');
  //   }
  // }, [isAuthenticated, navigate])

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
              Create Programme
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
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="acronym"
                    required
                    fullWidth
                    id="acronym"
                    label="Acronym"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="donor"
                    required
                    fullWidth
                    id="donor"
                    label="Donor"
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
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="currency"
                    label="Currency"
                    name="currency"
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
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="manager"
                    required
                    fullWidth
                    id="manager"
                    label="Programme Manager"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Create
              </Button>
            </Box>
          </Box>
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
}