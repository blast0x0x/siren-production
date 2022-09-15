import * as React from 'react';
import {  useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Button
} from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import { getIPR } from '../actions/ipr';
import formatDate from '../utils/formatDate';

export default function IPRStaffRow(props) {
  const { row, index } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const stages = ['Finance', 'Support', 'Procurement', 'CEO', 'Finalized'];

  const total = (items) => {
    let total = 0;
    items.map((item) => total += parseInt(item.totalPrice));
    return total;
  }

  const editIPR = (id) => {
    dispatch(getIPR(id, navigate));
  }

  return (
    <React.Fragment>
      <TableRow
        sx={{ '& > *': { borderBottom: 'unset' } }}
        style={index % 2 === 1 ? { background: '#daf8ff6b'}:{background: '#ffffff'}}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center" component="th" scope="row">
          {row.iprNo}
        </TableCell>
        <TableCell align="center">{formatDate(row.registerDate)}</TableCell>
        <TableCell align="center">{formatDate(row.dueDate)}</TableCell>
        <TableCell align="center">{(row.approvalStage > 1) && formatDate(row.approvalDate)}</TableCell>
        {row.approvalState === 2 ? (<TableCell align="center" sx={{ color: '#65C466' }}>Approved</TableCell>) : row.approvalState === 1 ? (<TableCell align="center" sx={{ color: '#9fa18c' }}>Declined</TableCell>) : (<TableCell align="center" sx={{ color: '#c55615' }}>Pending</TableCell>)}
        <TableCell align="center">{row.programme.name}</TableCell>
        <TableCell align="center">{row.output.name}</TableCell>
        <TableCell align="center">{row.output.activities.filter((activity) => activity._id.toString() === row.activity.toString())[0].activityName}</TableCell>
        <TableCell align="center">{row.budgetline.name}</TableCell>
        <TableCell align="center">{stages[row.approvalStage]}</TableCell>
        <TableCell align="center">{row.notes}</TableCell>
        <TableCell align="center">
          <Button
            onClick={() => editIPR(row._id)}
            disabled={row.approvalState === 2}
            variant="text"
            color="primary"
            sx={{ pr: 0 }}
          >
            <EditIcon />
          </Button>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Items
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Item Description</TableCell>
                    <TableCell align="center">Requested By</TableCell>
                    <TableCell align="center">Qty</TableCell>
                    <TableCell align="center">Estimated Unit Price</TableCell>
                    <TableCell align="center">Total Price</TableCell>
                    <TableCell align="center">Remarks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.content.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell component="th" scope="row">
                        {item.itemDescription}
                      </TableCell>
                      <TableCell align="center">{row.requestedBy.firstName+' '+row.requestedBy.lastName}</TableCell>
                      <TableCell align="center">{item.qty}</TableCell>
                      <TableCell align="center">{item.estimatedUnitPrice}</TableCell>
                      <TableCell align="center">{item.totalPrice}</TableCell>
                      <TableCell align="center">{item.remarks}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell align="center" colSpan={3} />
                    <TableCell align="center">Total</TableCell>
                    <TableCell align="center"><b>{total(row.content)}</b></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
