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
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Switch,
  Pagination
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person';
import ArticleIcon from '@mui/icons-material/Article';
import AddIcon from '@mui/icons-material/Add';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Spinner from './Spinner';
import IPRRow from './IPRRow';
import IPRStaffRow from './IPRStaffRow';
import IPRFinanceRow from './IPRFinanceRow';
import IPRProcurementRow from './IPRProcurementRow';
import IPRCEORow from './IPRCEORow';
import { getUsers, updateUserApprovalById } from '../actions/user';
import { checkFirst } from '../actions/auth';
import { getIprs } from '../actions/ipr';
import formatDate from '../utils/formatDate';

const theme = createTheme();

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [staffPage, setStaffPage] = React.useState(1);
  const [usersPage, setUsersPage] = React.useState(1);
  const [supportPage, setSupportPage] = React.useState(1);
  const [financePage, setFinancePage] = React.useState(1);
  const handleStaffPageChange = (event, value) => {
    setStaffPage(value);
  };
  const handleUsersPageChange = (event, value) => {
    setUsersPage(value);
  };
  const handleSupportPageChange = (event, value) => {
    setSupportPage(value);
  };
  const handleFinancePageChange = (event, value) => {
    setFinancePage(value);
  };
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { users, userloading } = useSelector(state => state.user);
  const { iprs, iprloading } = useSelector(state => state.ipr);

  const maxrow = 10;
  const iprsForStaff = iprs?.filter((ipr) => ipr.requestedBy._id.toString() === user?._id.toString()).sort(function (a, b) { return a.approvalState - b.approvalState });
  const staffTotal = iprsForStaff?.length;
  const staffPages = Math.ceil(staffTotal / maxrow);
  const iprsStaffToShow = iprsForStaff.slice(maxrow*(staffPage-1), maxrow*staffPage);
  const staffApproved = iprsForStaff?.filter((ipr) => ipr.approvalState === 2).length;
  const staffDeclined = iprsForStaff?.filter((ipr) => ipr.approvalState === 1).length;
  const staffPending = iprsForStaff?.filter((ipr) => ipr.approvalState === 0).length;
  // const usersToShowTotal = users?.filter((user) => user.approvalState !== 2);
  const usersToShowTotal = users.filter(
    (user) => user.approvalState === 0
  );;
  const usersToShow = usersToShowTotal.slice(maxrow * (usersPage - 1), maxrow * usersPage);
  const usersTotalShow = usersToShowTotal.length;
  const usersPages = Math.ceil(usersTotalShow / maxrow);
  const iprsForSupport = iprs.filter((ipr) => ipr.approvalStage >= 0);
  const supportTotal = iprsForSupport?.length;
  const supportPages = Math.ceil(supportTotal / maxrow);
  const iprsSupportToShow = iprsForSupport.slice(maxrow * (supportPage - 1), maxrow * supportPage);
  const supportApproved = iprsForSupport?.filter((ipr) => ipr.approvalState === 2).length;
  const supportDeclined = iprsForSupport?.filter((ipr) => ipr.approvalState === 1).length;
  const supportPending = iprsForSupport?.filter((ipr) => ipr.approvalState === 0).length;
  const iprsForFinance = iprs;
  const financeTotal = iprsForFinance?.length;
  const financePages = Math.ceil(financeTotal / maxrow);
  const iprsFinanceToShow = iprsForFinance.slice(maxrow * (financePage - 1), maxrow * financePage);
  const iprsForProcurement = iprs.filter((ipr) => ipr.approvalStage > 1 && parseInt(ipr.budgetline.initialAmount) >= 5000);
  const iprsForCEO = iprs.filter((ipr) => ipr.approvalStage > 2 && parseInt(ipr.budgetline.initialAmount) >= 10000);

  const handleCheckChange = (id, event) => {
    dispatch(updateUserApprovalById(id, event.target.checked));
  };

  const checkFirstLogin = () => {
    if (user?.job !== 'Staff' && user?.isFirstLogin)
      dispatch(checkFirst());
  }

  useEffect(() => {
    checkFirstLogin();
  })

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getIprs());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xl">
        <CssBaseline />
        {user?.approvalState === 2 ? (
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
              Dashboard
            </Typography>
            {user?.job === 'Staff' && (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mt: 12,
                    mb: 1
                  }}>
                  <Typography
                    sx={{
                      mt: 1,
                      textAlign: 'left',
                      fontSize: '15px'
                    }}
                    component="h5"
                    variant="h5"
                  >
                    Total Requested: {staffTotal}, Approved: {staffApproved}, Declined: {staffDeclined}, Pending: {staffPending}
                  </Typography>
                  <Button
                    component={Link}
                    to="/ipr/create"
                    variant="contained"
                    endIcon={<AddIcon />}
                    color="primary"
                  >
                    Add IPR
                  </Button>
                </Box>
                <TableContainer component={Paper}>
                  <Table aria-label="collapsible table">
                    <TableHead sx={{ background: '#c4c4c4' }}>
                      <TableRow>
                        <TableCell />
                        <TableCell align="center"><b>IPR No</b></TableCell>
                        <TableCell align="center"><b>Date</b></TableCell>
                        <TableCell align="center"><b>Due Date</b></TableCell>
                        <TableCell align="center"><b>Approval Date</b></TableCell>
                        <TableCell align="center"><b>Status</b></TableCell>
                        <TableCell align="center"><b>Programme</b></TableCell>
                        <TableCell align="center"><b>Output</b></TableCell>
                        {/* <TableCell align="center"><b>Activity</b></TableCell> */}
                        <TableCell align="center"><b>Budtet Line</b></TableCell>
                        <TableCell align="center"><b>Stage</b></TableCell>
                        <TableCell align="center"><b>Notes</b></TableCell>
                        <TableCell align="center"><b>Edit</b></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {iprsStaffToShow.map((ipr, index) => (
                        <IPRStaffRow
                          key={ipr._id}
                          index={index}
                          row={ipr}
                        />
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
                    count={staffPages}
                    page={staffPage}
                    onChange={handleStaffPageChange}
                  />
                </TableContainer>
                {iprloading && <Spinner />}
              </>)}
            {user?.job === 'Finance Manager' && (
              <>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mt: 6,
                    mb: 1
                  }}>
                  <Chip
                    sx={{
                      fontSize: '20px',
                      width: '98px'
                    }}
                    icon={<ArticleIcon />}
                    label="IPRs:"
                    color="primary"
                    variant="outlined"
                  />
                  <Button
                    component={Link}
                    to="/ipr/create"
                    variant="contained"
                    endIcon={<AddIcon />}
                    color="primary"
                  >
                    Add IPR
                  </Button>
                </Box>
                <TableContainer component={Paper}>
                  <Table aria-label="collapsible table">
                    <TableHead sx={{ background: '#c4c4c4' }}>
                      <TableRow>
                        <TableCell />
                        <TableCell align="center"><b>IPR No</b></TableCell>
                        <TableCell align="center"><b>Initiation Date</b></TableCell>
                        <TableCell align="center"><b>Due Date</b></TableCell>
                        <TableCell align="center"><b>Programme</b></TableCell>
                        <TableCell align="center"><b>Output</b></TableCell>
                        {/* <TableCell align="center"><b>Activity</b></TableCell> */}
                        <TableCell align="center"><b>Budtet Line</b></TableCell>
                        <TableCell align="center"><b>Allocation Date</b></TableCell>
                        <TableCell align="center"><b>Allocate</b></TableCell>
                        <TableCell align="center"><b>Status</b></TableCell>
                        <TableCell align="center"><b>Notes</b></TableCell>
                        <TableCell align="center"><b>Edit</b></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {iprsFinanceToShow.map((ipr, index) => (
                        <IPRFinanceRow
                          key={ipr._id}
                          index={index}
                          row={ipr} />
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
                    count={financePages}
                    page={financePage}
                    onChange={handleFinancePageChange}
                  />
                </TableContainer>
                {iprloading && <Spinner />}
              </>)}
            {user?.job === 'Support Manager' && (
              <>
                <Chip
                  sx={{
                    fontSize: '20px',
                    width: '108px',
                    mt: 4,
                    mb: 1
                  }}
                  icon={<PersonIcon />}
                  label="Users:"
                  color="primary"
                  variant="outlined"
                />
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
                        <TableCell align="right"><b>Contract No</b></TableCell>
                        <TableCell align="right"><b>Approval</b></TableCell>
                        <TableCell align="right"><b>Status</b></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {usersToShow.map((user, index) => (
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
                          <TableCell align="center">{user.programme}</TableCell>
                          <TableCell align="right">{user.contractNo}</TableCell>
                          <TableCell align="right">
                            <Switch
                              checked={user.approvalState === 2}
                              onChange={(event) => handleCheckChange(user._id, event)}
                              inputProps={{ 'aria-label': 'controlled' }}
                            />
                          </TableCell>
                          {user.approvalState === 2 ? (
                            <TableCell
                              align="right"
                              sx={{ color: '#65C466' }}
                            >
                              Approved
                            </TableCell>) : user.approvalState === 1 ? (
                              <TableCell
                                align="right"
                                sx={{ color: '#9fa18c' }}
                              >
                                Declined
                              </TableCell>
                            ) : (
                            <TableCell
                              align="right"
                              sx={{ color: '#c55615' }}
                            >
                              Pending
                            </TableCell>
                          )}
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
                    count={usersPages}
                    page={usersPage}
                    onChange={handleUsersPageChange}
                  />
                </TableContainer>
                {userloading && <Spinner />}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mt: 12,
                    mb: 1
                  }}>
                  <Chip
                    sx={{
                      fontSize: '20px',
                      width: '98px'
                    }}
                    icon={<ArticleIcon />}
                    label="IPRs:"
                    color="primary"
                    variant="outlined"
                  />
                  <Typography
                    sx={{
                      mt: 1,
                      textAlign: 'left',
                      fontSize: '15px'
                    }}
                    component="h5"
                    variant="h5"
                  >
                    Total Requested: {supportTotal}, Approved: {supportApproved}, Declined: {supportDeclined}, Pending: {supportPending}
                  </Typography>
                  <Button
                    component={Link}
                    to="/ipr/create"
                    variant="contained"
                    endIcon={<AddIcon />}
                    color="primary"
                  >
                    Add IPR
                  </Button>
                </Box>
                <TableContainer component={Paper}>
                  <Table aria-label="collapsible table">
                    <TableHead sx={{ background: '#c4c4c4' }}>
                      <TableRow>
                        <TableCell />
                        <TableCell align="center"><b>IPR No</b></TableCell>
                        <TableCell align="center"><b>Date</b></TableCell>
                        <TableCell align="center"><b>Due Date</b></TableCell>
                        <TableCell align="center"><b>Approval Date</b></TableCell>
                        <TableCell align="center"><b>Programme</b></TableCell>
                        <TableCell align="center"><b>Output</b></TableCell>
                        {/* <TableCell align="center"><b>Activity</b></TableCell> */}
                        <TableCell align="center"><b>Budtet Line</b></TableCell>
                        <TableCell align="center"><b>Decision</b></TableCell>
                        <TableCell align="center"><b>Status</b></TableCell>
                        <TableCell align="center"><b>Stage</b></TableCell>
                        <TableCell align="center"><b>Delivery Note</b></TableCell>
                        <TableCell align="center"><b>Notes</b></TableCell>
                        <TableCell align="center" colSpan={2}><b>Actions</b></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {iprsSupportToShow.map((ipr, index) => (
                        <IPRRow
                          key={ipr._id}
                          row={ipr}
                          index={index}
                        />
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
                    count={supportPages}
                    page={supportPage}
                    onChange={handleSupportPageChange}
                  />
                </TableContainer>
                {iprloading && <Spinner />}
              </>)}
            {user?.job === 'Procurement Manager' && (
              <>
                <Chip
                  sx={{
                    fontSize: '20px',
                    width: '98px',
                    mt: 12,
                    mb: 1
                  }}
                  icon={<ArticleIcon />}
                  label="IPRs:"
                  color="primary"
                  variant="outlined"
                />
                <TableContainer component={Paper}>
                  <Table aria-label="collapsible table">
                    <TableHead sx={{ background: '#c4c4c4' }}>
                      <TableRow>
                        <TableCell />
                        <TableCell align="center"><b>No</b></TableCell>
                        <TableCell align="center"><b>Date</b></TableCell>
                        <TableCell align="center"><b>Due Date</b></TableCell>
                        <TableCell align="center"><b>Programme</b></TableCell>
                        <TableCell align="center"><b>Output</b></TableCell>
                        {/* <TableCell align="center"><b>Activity</b></TableCell> */}
                        <TableCell align="center"><b>Budtet Line</b></TableCell>
                        <TableCell align="center"><b>RFQ Issuance Date</b></TableCell>
                        {/* <TableCell align="center"><b>RFQ End Date</b></TableCell> */}
                        {/* <TableCell align="center" colSpan={3}><b>Actions</b></TableCell> */}
                        <TableCell align="center"><b>Action</b></TableCell>
                        <TableCell align="center"><b>Status</b></TableCell>
                        <TableCell align="center"><b>Notes</b></TableCell>
                        <TableCell align="center"><b>Edit</b></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {iprsForProcurement.map((ipr, index) => (
                        <IPRProcurementRow
                          key={ipr._id}
                          row={ipr}
                          index={index}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {iprloading && <Spinner />}
              </>)}
            {user?.job === 'Chairman' && (
              <>
                <Chip
                  sx={{
                    fontSize: '20px',
                    width: '98px',
                    mt: 12,
                    mb: 1
                  }}
                  icon={<ArticleIcon />}
                  label="IPRs:"
                  color="primary"
                  variant="outlined"
                />
                <TableContainer component={Paper}>
                  <Table aria-label="collapsible table">
                    <TableHead sx={{ background: '#c4c4c4' }}>
                      <TableRow>
                        <TableCell />
                        <TableCell align="center"><b>No</b></TableCell>
                        <TableCell align="center"><b>Initiation Date</b></TableCell>
                        <TableCell align="center"><b>Due Date</b></TableCell>
                        <TableCell align="center"><b>Approval Date</b></TableCell>
                        <TableCell align="center"><b>Programme</b></TableCell>
                        <TableCell align="center"><b>Output</b></TableCell>
                        {/* <TableCell align="center"><b>Activity</b></TableCell> */}
                        <TableCell align="center"><b>Budtet Line</b></TableCell>
                        <TableCell align="center"><b>Stage</b></TableCell>
                        <TableCell align="center"><b>Approve</b></TableCell>
                        <TableCell align="center"><b>Status</b></TableCell>
                        <TableCell align="center"><b>Notes</b></TableCell>
                        <TableCell align="center"><b>Edit</b></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {iprsForCEO.map((ipr, index) => (
                        <IPRCEORow
                          key={ipr._id}
                          row={ipr}
                          index={index}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {iprloading && <Spinner />}
              </>)}
          </Box>
        ) : user?.approvalState === 0 ? (
          <Typography
            sx={{ textAlign: 'center', mt: 8 }}
            component="h1"
            variant="h5"
          >
            Your profile is under review.
          </Typography>
          ) : (
            <Typography
              sx={{ textAlign: 'center', mt: 8 }}
              component="h1"
              variant="h5"
            >
              Your profile was declined.
            </Typography>
          ) }
      </Container>
    </ThemeProvider>
  );
}