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
import { getBudgetLines, getBudgetLine, deleteBudgetLineById } from '../actions/budgetline';

const theme = createTheme();

export default function BudgetLines() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [budgetlinesPage, setBudgetLinesPage] = React.useState(1);
  const { budgetlines, budgetlineloading } = useSelector(state => state.budgetline);

  const maxrow = 10;
  const budgetlinesToShow = budgetlines?.slice(maxrow * (budgetlinesPage - 1), maxrow * budgetlinesPage);
  const budgetlinesTotalShow = budgetlines.length;
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
    dispatch(getBudgetLines());
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
            Budget Lines
          </Typography>
          <Button
            sx={{
              width: '200px',
              mt: 4
            }}
            component={Link}
            to="/budgetline/create"
            variant="contained"
            endIcon={<AddIcon />}
            color="primary"
          >
            Add Budget Line
          </Button>
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