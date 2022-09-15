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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { updateBudgetLine, getBudgetLine } from '../actions/budgetline';
import { getProgrammes } from '../actions/programme';

const theme = createTheme();

export default function BudgetLineUpdate() {
  const { id } = useParams();
  const { budgetline } = useSelector(state => state.budgetline);
  const { programmes } = useSelector(state => state.programme);
  const programmeOptions = programmes?.map((option) => ({
    value: option._id,
    label: option.name
  }))
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [programme, setProgramme] = React.useState(budgetline?.programme);
  const [name, setName] = React.useState(budgetline?.name);
  const [currency, setCurrency] = React.useState(budgetline?.currency);
  const [initialAmount, setInitialAmount] = React.useState(budgetline?.initialAmount);
  const setP = (event) => {
    setProgramme(event.target.value);
  }
  const setN = (event) => {
    setName(event.target.value);
  }
  const setC = (event) => {
    setCurrency(event.target.value);
  }
  const setI = (event) => {
    setInitialAmount(event.target.value);
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const programme = data.get('programme');
    const name = data.get('name');
    const currency = data.get('currency');
    const initialAmount = data.get('initialAmount');
    dispatch(updateBudgetLine({ programme, name, currency, initialAmount }, navigate));
  };

  useEffect(() => {
    dispatch(getProgrammes());
  }, [dispatch]);

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate('/dashboard');
  //   }
  // }, [isAuthenticated, navigate])

  useEffect(() => {
    dispatch(getBudgetLine(id));
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
              Edit BudgetLine
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="programme"
                    name="programme"
                    select
                    label="Programme"
                    value={programme}
                    onChange={setP}
                  >
                    {programmeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
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
                    name="currency"
                    required
                    fullWidth
                    id="currency"
                    label="Currency"
                    value={currency}
                    onChange={setC}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="initialAmount"
                    required
                    fullWidth
                    id="initialAmount"
                    label="Initial Amount"
                    value={initialAmount}
                    onChange={setI}
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