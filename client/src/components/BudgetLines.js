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
import { getProgrammes } from '../actions/programme';
import { getBudgetLines, getBudgetLine, deleteBudgetLineById } from '../actions/budgetline';

const theme = createTheme();

export default function BudgetLines() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { programmes } = useSelector(state => state.programme);
  
  const [budgetlinesPage, setBudgetLinesPage] = React.useState(1);
  const { budgetlines, budgetlineloading } = useSelector(state => state.budgetline);

  console.log("eagle:programmes=", programmes);

  const programmeNameMenu = [];
  programmeNameMenu.push("All Programmes");
  for (let i = 0; i < programmes.length; i ++)
    programmeNameMenu.push(programmes[i].acronym);
  const [programmeMenuItemNum, setProgrammeMenuItemNum] = React.useState(0);
  const [programmeId, setProgrammeId] = React.useState(0);

  const maxrow = 10;
  let budgetlinesToShow = [];
  let budgetlinesTotalShow = 0;

  if (programmeId !== 0) {
    const budgetlinesFitered = budgetlines?.filter((budgetline) => budgetline.programme.toString() === programmeId.toString());
    budgetlinesToShow = budgetlinesFitered?.slice(maxrow * (budgetlinesPage - 1), maxrow * budgetlinesPage);
    budgetlinesTotalShow = budgetlinesFitered.length;
  } else {
    budgetlinesToShow = budgetlines?.slice(maxrow * (budgetlinesPage - 1), maxrow * budgetlinesPage);
    budgetlinesTotalShow = budgetlines.length;
  }
  
  const budgetlinesPages = Math.ceil(budgetlinesTotalShow / maxrow);

  const handleBudgetLinesPageChange = (event, value) => {
    setBudgetLinesPage(value);
  };

  const deleteBudgetLine = (id) => {
    dispatch(deleteBudgetLineById(id));
  }

  const editBudgetLine = (id) => {
    dispatch(getBudgetLine(id, navigate));
  } 

  useEffect(() => {
    dispatch(getProgrammes());
    dispatch(getBudgetLines());      
  }, [dispatch]);

  useEffect(() => {
    if (user?.job !== 'Support Manager' && user?.job !== 'Finance Manager') {
      navigate('/dashboard');
    }
  })

  const handleProgrammeMenuItem = async (index) => {
    setProgrammeMenuItemNum(index);

    if (index > 0)
      index = programmes[index - 1]._id;
      
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
            Budget Lines
          </Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Button
                sx={{
                  width: '200px',
                  mt: 2
                }}
                component={Link}
                to="/budgetline/create"
                variant="contained"
                endIcon={<AddIcon />}
                color="primary"
              >
                Add Budget Line
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
                  <TableCell align="left"><b>Name</b></TableCell>
                  <TableCell align="center"><b>Currency</b></TableCell>
                  <TableCell align="center"><b>Initial Amount</b></TableCell>
                  <TableCell align="center" colSpan={2}><b>Actions</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {budgetlinesToShow.map((budgetline, index) => (
                  <TableRow
                    key={budgetline._id}
                    index={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    style={index % 2 === 1 ? { background: '#daf8ff6b' } : { background: '#ffffff' }}
                  >
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="left">{budgetline.name}</TableCell>
                    <TableCell align="center">{budgetline.currency}</TableCell>
                    <TableCell align="center">{budgetline.initialAmount}</TableCell>
                    <TableCell align="center" sx={{ pr: 0 }}>
                      <Button
                        onClick={() => editBudgetLine(budgetline._id)}
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
                        onClick={() => deleteBudgetLine(budgetline._id)}
                        sx={{ pl: 0 }}
                      >
                        <DeleteIcon />
                      </Button>
                    </TableCell>
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
              count={budgetlinesPages}
              page={budgetlinesPage}
              onChange={handleBudgetLinesPageChange}
            />
          </TableContainer>
          {budgetlineloading && <Spinner />}
        </Box>
      </Container>
    </ThemeProvider>);
}