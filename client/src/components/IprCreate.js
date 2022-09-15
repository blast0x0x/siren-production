import * as React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  CssBaseline,
  Container,
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  MenuItem
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { setAlert } from '../actions/alert';
import { registerIPR } from '../actions/ipr';
import { getProgrammes } from '../actions/programme';
// import { getBudgetLines } from '../actions/budgetline';
import { getOutputs } from '../actions/output';
import formatDate from '../utils/formatDate';

const theme = createTheme();

function createData(itemDescription, requestedBy, qty, estimatedUnitPrice, totalPrice, remarks) {
  return { itemDescription, requestedBy, qty, estimatedUnitPrice, totalPrice, remarks };
}

let rows = [];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function IprCreate() {
  const dispatch = useDispatch();
  const [total, setTotal] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [dateValue, setDateValue] = React.useState(new Date());
  const [dueDateValue, setDueDateValue] = React.useState(null);
  const [quantity, setQuantity] = React.useState(null);
  const [unitPrice, setUnitPrice] = React.useState(null);
  const [UnitTotal, setUnitTotal] = React.useState('');
  const { programmes } = useSelector(state => state.programme);
  // const { budgetlines } = useSelector(state => state.budgetline);
  const { outputs } = useSelector(state => state.output);
  const [programmevalue, setProgrammeValue] = React.useState(null);
  const [outputvalue, setOutputValue] = React.useState(null);
  const [activityvalue, setActivityValue] = React.useState(null);
  const [budgetlinevalue, setBudtetlineValue] = React.useState(null);
  const [outputfilters, setOutputfilters] = React.useState(null);
  const [activityfilters, setActivityfilters] = React.useState(null);
  const [budgetlinefilters, setBudgetlinefilters] = React.useState(null);
 
  const handleProgrammeValueChange = (event) => {
    setProgrammeValue(event.target.value);
    setOutputValue(null);
    setOutputfilters(outputs.filter((output) => output.programme.toString() === event.target.value.toString()));
  }
  const handleOutputValueChange = (event) => {
    setOutputValue(event.target.value);
    setActivityValue(null);
    setBudtetlineValue(null);
    setActivityfilters(outputs.filter((output) => output._id.toString() === event.target.value.toString())[0].activities);
    setBudgetlinefilters(outputs.filter((output) => output._id.toString() === event.target.value.toString())[0].connectedBudgetlines.map((budgetline) => ({
      value: budgetline._id,
      label: budgetline.name
    })));
  }
  const handleActivityValueChange = (event) => {
    setActivityValue(event.target.value);
  }
  const handleBudgetlineValueChange = (event) => {
    setBudtetlineValue(event.target.value);
  }
  const programmeOptions = programmes?.map((option) => ({
    value: option._id,
    label: option.name
  }))
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setQuantity('');
    setUnitPrice('');
    setUnitTotal('');
  }

  const navigate = useNavigate();
  const {
    // isAuthenticated,
    user
  } = useSelector(state => state.auth);

  const IPRNumber = 'SIREN/PROGRAMME-' + formatDate(new Date()) + '-' + Date.now() % 100;

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const date = dateValue;
    const iprNo = IPRNumber;
    const dueDate = dueDateValue;
    const requestedBy = user._id;
    const programme = programmevalue;
    const output = outputvalue;
    const activity = activityvalue;
    const budgetline = budgetlinevalue;
    const content = rows;
    const notes = data.get('notes');
    rows = [];
    if (content.length === 0) return dispatch(setAlert('Please add content', 'error'));
    dispatch(registerIPR({ date, iprNo, dueDate, requestedBy, programme, output, activity, budgetline, content, notes }, navigate));
  };

  const handleModalSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const itemDescription = data.get('itemDescription');
    const requestedBy = user._id;
    const qty = data.get('qty');
    const estimatedUnitPrice = data.get('estimatedUnitPrice');
    const totalPrice = data.get('totalPrice');
    const remarks = data.get('remarks');
    if (itemDescription === '') return dispatch(setAlert('Item Description is required', 'error'));
    if (qty === '') return dispatch(setAlert('Qty is required', 'error'));
    if (estimatedUnitPrice === '') return dispatch(setAlert('Estimated Unit Price is required', 'error'));
    rows.push(createData(itemDescription, requestedBy, qty, estimatedUnitPrice, totalPrice, remarks));
    setTotal(parseInt(total) + parseInt(totalPrice));
    setQuantity('');
    setUnitPrice('');
    setUnitTotal('');
    setOpen(false);
  }

  const calcTotalByQty = (event) => {
    event.preventDefault();
    if (event.target.value !== null && event.target.value !== '') {
      setQuantity(parseInt(event.target.value));
    } else {
      setUnitTotal('');
    }
    if (event.target.value !== null && event.target.value !== '' &&
      unitPrice !== null && unitPrice !== '') setUnitTotal(parseInt(event.target.value) * unitPrice);
  }

  const calcTotalByUnitPrice = (event) => {
    event.preventDefault();
    if (event.target.value !== null && event.target.value !== '') {
      setUnitPrice(parseInt(event.target.value));
    } else {
      setUnitTotal('');
    }
    if (event.target.value !== null && event.target.value !== '' &&
      quantity !== null && quantity !== '') setUnitTotal(parseInt(event.target.value) * quantity);
  }

  useEffect(() => {
    dispatch(getOutputs());
    dispatch(getProgrammes());
    // dispatch(getBudgetLines());
  }, [dispatch]);

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate('/');
  //   }
  // }, [isAuthenticated, navigate])

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container component="main" maxWidth="xl">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            INITIATE PURCHASE REQUISITION FORM
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <DatePicker
                  name="date"
                  id="date"
                  label="Date:"
                  value={dateValue}
                  onChange={(newValue) => {
                    setDateValue(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  required
                  fullWidth
                  id="iprNo"
                  value={IPRNumber}
                  name="iprNo"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <DatePicker
                  name="dueDate"
                  id="dueDate"
                  label="Due Date:"
                  value={dueDateValue}
                  onChange={(newValue) => {
                    setDueDateValue(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    required
                    fullWidth
                    id="programme"
                    name="programme"
                    select
                    label="Programme"
                    value={programmevalue}
                    onChange={handleProgrammeValueChange}
                  >
                    {programmeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    required
                    fullWidth
                    id="output"
                    name="output"
                    select
                    label="Output"
                    value={outputvalue}
                    onChange={handleOutputValueChange}
                  >
                    {outputfilters?.map((option) => (
                      <MenuItem key={option._id} value={option._id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    required
                    fullWidth
                    id="activity"
                    name="activity"
                    select
                    label="Activity"
                    value={activityvalue}
                    onChange={handleActivityValueChange}
                  >
                    {activityfilters?.map((option) => (
                      <MenuItem key={option._id} value={option._id}>
                        {option.activityName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    required
                    fullWidth
                    id="budgetline"
                    name="budgetline"
                    select
                    label="Budget Line"
                    value={budgetlinevalue}
                    onChange={handleBudgetlineValueChange}
                  >
                    {budgetlinefilters?.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
            </Grid>
            <Button
              type="button"
              variant="contained"
              endIcon={<AddIcon />}
              sx={{ mt: 3 }}
              onClick={handleOpen}
            >
              Add
            </Button>
            <TableContainer sx={{ mt: 1 }} component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">No.</TableCell>
                    <TableCell align="center">ITEM DESCRIPTION</TableCell>
                    <TableCell align="center">REQUESTED BY</TableCell>
                    <TableCell align="center">QTY</TableCell>
                    <TableCell align="right">ESTIMATED UNIT PRICE</TableCell>
                    <TableCell align="right">TOTAL PRICE</TableCell>
                    <TableCell align="center">REMARKS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell align="center">{index+1}</TableCell>
                      <TableCell align="center">{row.itemDescription}</TableCell>
                      <TableCell align="center">{user.firstName} {user.lastName}</TableCell>
                      <TableCell align="center">{row.qty}</TableCell>
                      <TableCell align="right">{row.estimatedUnitPrice}</TableCell>
                      <TableCell align="right">{row.totalPrice}</TableCell>
                      <TableCell align="center">{row.remarks}</TableCell>
                    </TableRow>
                  ))}
                  {(rows.length > 0) &&
                    <TableRow>
                      <TableCell align="left" colSpan={4} />
                      <TableCell align="right" colSpan={2}>Total</TableCell>
                      <TableCell align="right">{total}</TableCell>
                    </TableRow>
                  }
                </TableBody>
              </Table>
            </TableContainer>
            <Grid
              item
              sx={{
                '& .MuiTextField-root': { mt: 2, width: '100%' },
              }}
              xs={12}
            >
              <TextField
                id="notes"
                name="notes"
                label="NOTES & JUSTIFICATIONS"
                multiline
                maxRows={4}
              />
            </Grid>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 3, mb: 2 }}>
              <Button
                type="submit"
                variant="contained"
                sx={{ mx: 1, px: 4 }}
              >
                Submit
              </Button>
              <Button component={Link} sx={{ mx: 1, px: 4 }} to="/dashboard" variant="outlined" color="primary">
                Cancel
              </Button>
            </Box>
            </Box>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
            <Box sx={style}>
              <Typography id="modal-modal-title" textAlign="center" variant="h6" component="h2">
                Add Item
              </Typography>
              <Box component="form" noValidate onSubmit={handleModalSubmit} sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="itemDescription"
                      label="Item Description"
                      name="itemDescription"
                      autoComplete="family-name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="requestedBy"
                      label="Requested By"
                      name="requestedBy"
                      value={user?.firstName + ' ' + user?.lastName}
                      autoComplete="family-name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      type="number"
                      id="qty"
                      label="Quantity"
                      name="qty"
                      autoComplete="family-name"
                      onChange={calcTotalByQty}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      type="number"
                      id="estimatedUnitPrice"
                      label="Estimated Unit Price"
                      name="estimatedUnitPrice"
                      autoComplete="family-name"
                      onChange={calcTotalByUnitPrice}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      inputProps={{
                        readOnly: true
                      }}
                      value={UnitTotal}
                      required
                      type="number"
                      fullWidth
                      id="totalPrice"
                      label="Total Price"
                      name="totalPrice"
                      autoComplete="family-name"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="remarks"
                      label="Remarks"
                      name="remarks"
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
                  Insert
                </Button>
              </Box>
            </Box>
          </Modal>
        </Box>
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
}