import * as React from 'react';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import EditIcon from '@mui/icons-material/Edit';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { setAlert } from '../actions/alert';
import { getProgrammes } from '../actions/programme';
// import { getBudgetLines } from '../actions/budgetline';
// import { getOutputs } from '../actions/output';
import Spinner from './Spinner';
import {
  updateIPR,
  // getIPR
} from '../actions/ipr';

const theme = createTheme();

function createData(itemDescription, requestedBy, output, qty, estimatedUnitPrice, totalPrice, remarks) {
  return { itemDescription, requestedBy, output, qty, estimatedUnitPrice, totalPrice, remarks };
}

let rows = [];
let requestedman = '';
let modalrow = null;
let total = 0;

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

export default function IprEdit() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { ipr } = useSelector(state => state.ipr);
  const { programmes } = useSelector(state => state.programme);
  // const { budgetlines } = useSelector(state => state.budgetline);
  const { outputs } = useSelector(state => state.output);
  const [editNo, setEditNo] = React.useState(-1);
  const [open, setOpen] = React.useState(false);
  const [dateValue, setDateValue] = React.useState(ipr?.registerDate);
  const [dueDateValue, setDueDateValue] = React.useState(ipr?.dueDate);
  const [iD, setID] = React.useState(null);
  const [iQ, setIQ] = React.useState(null);
  const [iE, setIE] = React.useState(null);
  const [iR, setIR] = React.useState(null);
  const [notes, setNotes] = React.useState(ipr?.notes);
  const [programmevalue, setProgrammeValue] = React.useState(ipr?.programme._id);
  const [outputvalue, setOutputValue] = React.useState(ipr?.output._id);
  const [activityvalue, setActivityValue] = React.useState(ipr?.activity);
  const [budgetlinevalue, setBudtetlineValue] = React.useState(ipr?.budgetline._id);
  const [outputfilters, setOutputfilters] = React.useState(outputs.filter((output) => output.programme.toString() === ipr?.programme._id.toString()));
  const [activityfilters, setActivityfilters] = React.useState(outputs.filter((output) => output._id.toString() === ipr?.output._id.toString())[0]?.activities);
  const [budgetlinefilters, setBudgetlinefilters] = React.useState(outputs?.filter((output) => output._id.toString() === ipr?.output._id.toString())[0]?.connectedBudgetlines.map((budgetline) => ({
    value: budgetline._id,
    label: budgetline.name
  })));

  const handleProgrammeValueChange = (event) => {
    setProgrammeValue(event.target.value);
    setOutputValue(null);
    setActivityValue(null);
    setBudtetlineValue(null);
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
  const handleOpen = (index) => {
    setEditNo(index);
    modalrow = rows[index];
    setID(modalrow.itemDescription);
    setIQ(modalrow.qty);
    setIE(modalrow.estimatedUnitPrice);
    setIR(modalrow.remarks);
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  }

  const getTotal = (items) => {
    let total = 0;
    items.map((item) => total += parseInt(item.totalPrice));
    return total;
  }

  const navigate = useNavigate();
  // const {
  //   isAuthenticated,
  //   user
  // } = useSelector(state => state.auth);


  if (ipr) {
    rows = ipr.content;
    requestedman = ipr.requestedBy.firstName + ' ' + ipr.requestedBy.lastName;
    total = getTotal(rows);
  }

  useEffect(() => {
    // dispatch(getIPR(id));
    // dispatch(getOutputs());
    dispatch(getProgrammes());
    // dispatch(getBudgetLines());
  }, [dispatch, id]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const programme = programmevalue;
    const output = outputvalue;
    const activity = activityvalue;
    const budgetline = budgetlinevalue;
    const content = rows;
    const notes = data.get('notes');
    const iprid = id;
    dispatch(updateIPR({ programme, output, activity, budgetline, content, notes, iprid }, navigate));
  };

  const handleItemDescriptionChange = (event) => {
    event.preventDefault();
    setID(event.target.value);
  }

  const handleQtyChange = (event) => {
    event.preventDefault();
    setIQ(event.target.value);
  }

  const handleExtimatedUnitPriceChange = (event) => {
    event.preventDefault();
    setIE(event.target.value);
  }

  const handleRemarksChange = (event) => {
    event.preventDefault();
    setIR(event.target.value);
  }

  const handleNotesChange = (event) => {
    event.preventDefault();
    setNotes(event.target.value);
  }

  const handleModalSubmit = (event) => {
    event.preventDefault();
    const itemDescription = iD;
    const requestedBy = ipr.requestedBy;
    const qty = iQ;
    const estimatedUnitPrice = iE;
    const totalPrice = parseInt(iQ) * parseInt(iE);
    const remarks = iR;
    if (itemDescription === '' || itemDescription === null) return dispatch(setAlert('Item Description is required', 'error'));
    if (qty === '' || qty === null) return dispatch(setAlert('Qty is required', 'error'));
    if (estimatedUnitPrice === '' || estimatedUnitPrice === null) return dispatch(setAlert('Estimated Unit Price is required', 'error'));
    rows[editNo] = createData(itemDescription, requestedBy, qty, estimatedUnitPrice, totalPrice, remarks);
    total = getTotal(rows);
    setOpen(false);
  }

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
            {!ipr ? <Spinner /> :
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <DatePicker
                      readOnly
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
                      readOnly
                      required
                      fullWidth
                      id="iprNo"
                      value={ipr?.iprNo}
                      name="iprNo"
                      inputProps={{
                        readOnly: true
                      }}
                      autoComplete="family-name"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <DatePicker
                      readOnly
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
                        <TableCell align="center">Edit</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row, index) => (
                        <TableRow
                          key={index}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell align="center">{index + 1}</TableCell>
                          <TableCell align="center">{row.itemDescription}</TableCell>
                          <TableCell align="center">{requestedman}</TableCell>
                          <TableCell align="center">{row.qty}</TableCell>
                          <TableCell align="right">{row.estimatedUnitPrice}</TableCell>
                          <TableCell align="right">{row.totalPrice}</TableCell>
                          <TableCell align="center">{row.remarks}</TableCell>
                          <TableCell align="center">
                            <Button
                              type="button"
                              variant="text"
                              onClick={() => handleOpen(index)}
                            >
                              <EditIcon />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {(rows.length > 0) &&
                        <TableRow>
                          <TableCell align="left" colSpan={3} />
                          <TableCell align="right" colSpan={2}>Total</TableCell>
                          <TableCell align="right"><b>{total}</b></TableCell>
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
                    value={notes}
                    maxRows={4}
                    onChange={handleNotesChange}
                  />
                </Grid>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 3, mb: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mx: 1, px: 4 }}
                  >
                    Update
                  </Button>
                  <Button component={Link} sx={{ mx: 1, px: 4 }} to="/dashboard" variant="outlined" color="primary">
                    Cancel
                  </Button>
                </Box>
              </Box>
            }
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography id="modal-modal-title" textAlign="center" variant="h6" component="h2">
                  Edit Item
                </Typography>
                <Box component="form" noValidate onSubmit={handleModalSubmit} sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        value={iD}
                        id="itemDescription"
                        label="Item Description"
                        name="itemDescription"
                        onChange={handleItemDescriptionChange}
                        autoComplete="family-name"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        readOnly
                        required
                        fullWidth
                        id="requestedBy"
                        label="Requested By"
                        name="requestedBy"
                        value={requestedman}
                        autoComplete="family-name"
                        inputProps={{
                          readOnly: true
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        type="number"
                        value={iQ}
                        onChange={handleQtyChange}
                        id="qty"
                        label="Quantity"
                        name="qty"
                        autoComplete="family-name"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        type="number"
                        id="estimatedUnitPrice"
                        onChange={handleExtimatedUnitPriceChange}
                        value={iE}
                        label="Estimated Unit Price"
                        name="estimatedUnitPrice"
                        autoComplete="family-name"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id="remarks"
                        label="Remarks"
                        value={iR}
                        onChange={handleRemarksChange}
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
                    Update
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