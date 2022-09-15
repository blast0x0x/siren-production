import * as React from 'react';
import { useDispatch } from 'react-redux';
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
  Switch,
  Button
} from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { updateIprApprovalById, updateIprNewById, getIPR } from '../actions/ipr';
import formatDate from '../utils/formatDate';

export default function IPRRow(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { row, index } = props;
  const [open, setOpen] = React.useState(false);
  const stages = ['Finance', 'Support', 'Procurement', 'CEO', 'Finalized'];

  const total = (items) => {
    let total = 0;
    items.map((item) => total += parseInt(item.totalPrice));
    return total;
  }

  const setOpenFunction = (isOpen) => {
    if (row.isNewIPR && isOpen) dispatch(updateIprNewById(row._id))
      setOpen(isOpen);
  }

  const exportPDF = () => {
    const unit = "mm";
    const size = "A4";
    const orientation = "landscape"; // portrait or landscape

    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(20);

    const title = "INITIATE PURCHASE REQUISITION FORM";
    const headers = [["No", "ITEM DESCRIPTION", "REQUESTED BY", "OUTPUT", "BUDGET LINE", "BUDGET CODE", "QTY", "EXTIMATED UNIT PRICE", "TOTAL PRICE", "REMARKS"]];
    const tabledata = row.content.map((item, index) => 
      [index+1, item.itemDescription, row.requestedBy.firstName+' '+row.requestedBy.lastName, item.output, item.budgetLine, '', item.qty, item.estimatedUnitPrice, item.totalPrice, item.remarks]
    )

    let content = {
      styles: {
        fontSize: 8
      },
      headStyles: {
        fillColor: '#1976d2',
        textColor: '#fff',
        halign: 'center',
        valign: 'middle'
      },
      bodyStyles: {
        halign: 'center',
        valign: 'middle'
      },
      startY: 45,
      theme: 'grid',
      head: headers,
      body: tabledata
    };

    doc.addImage('/logo2.png', 231, 10, 52, 10);
    doc.autoTable({
      styles: {
        fontSize: 16
      },
      headStyles: {
        fillColor: '#1976d2',
        textColor: '#fff',
        halign: 'center',
        valign: 'middle'
      },
      theme: 'grid',
      startY: 22,
      head: [[title]]
    });
    doc.setFontSize(9);
    doc.text('Date:', 200, 36);
    doc.text('IPR No.:', 200, 40);
    doc.text('Due Date:', 200, 44);
    doc.text(formatDate(row.registerDate), 282, 36, { align: 'right' });
    doc.text(row?.iprNo, 282, 40, { align: 'right' });
    doc.text(formatDate(row.dueDate), 282, 44, { align: 'right' });
    doc.autoTable(content);
    doc.autoTable({
      styles: {
        fontSize: 8
      },
      headStyles: {
        fillColor: '#1976d2',
        textColor: '#fff',
        halign: 'center',
        valign: 'middle'
      },
      bodyStyles: {
        halign: 'center',
        valign: 'middle'
      },
      theme: 'grid',
      startY: doc.lastAutoTable.finalY + 10,
      head: [["NOTES & JUSTIFICATIONS"]],
      body: [[row.notes]]
    });
    doc.autoTable({
      styles: {
        fontSize: 8
      },
      headStyles: {
        fillColor: '#1976d2',
        textColor: '#fff',
        halign: 'center',
        valign: 'middle'
      },
      bodyStyles: {
        halign: 'center',
        valign: 'middle'
      },
      theme: 'grid',
      startY: doc.lastAutoTable.finalY + 10,
      head: [["FINANCIAL OFFCER", "SUPPORT MANAGER", "OPERATIONS MANAGER"]],
      body: [["Checked", "Approved", ""], ["Joya Bachir", "Jalal Awada", "Marc Maouad"], ["Signature", "Signature", "Signature"]]
    });
    doc.save(row.iprNo+".pdf");
  }

  const handleCheckChange = (id, event) => {
    dispatch(updateIprApprovalById(id, event.target.checked));
  };

  const editIPR = (id) => {
    dispatch(getIPR(id, navigate));
  }

  return (
    <React.Fragment>
      <TableRow
        sx={{ '& > *': { borderBottom: 'unset' } }}
        style={index % 2 === 1 ? { background: '#daf8ff6b' } : { background: '#ffffff' }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpenFunction(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="center" component="th" scope="row" style={row.isNewIPR ? { fontWeight: '700' } : { fontWeight: '400' }}>
          {row.iprNo}
        </TableCell>
        <TableCell align="center" style={row.isNewIPR ? { fontWeight: '700' } : { fontWeight: '400' }}>{formatDate(row.registerDate)}</TableCell>
        <TableCell align="center" style={row.isNewIPR ? { fontWeight: '700' } : { fontWeight: '400' }}>{formatDate(row.dueDate)}</TableCell>
        <TableCell align="center" style={row.isNewIPR ? { fontWeight: '700' } : { fontWeight: '400' }}>{(row.approvalStage > 1) && formatDate(row.approvalDate)}</TableCell>
        <TableCell align="center">{row.programme.name}</TableCell>
        <TableCell align="center">{row.output.name}</TableCell>
        <TableCell align="center">{row.output.activities.filter((activity) => activity._id.toString() === row.activity.toString())[0].activityName}</TableCell>
        <TableCell align="center">{row.budgetline.name}</TableCell>
        <TableCell align="center">
          <Switch
            checked={row.approvalStage > 1}
            onChange={(event) => handleCheckChange(row._id, event)}
            inputProps={{ 'aria-label': 'controlled' }}
          />
        </TableCell>
        {row.approvalState === 2 ? (<TableCell align="center" sx={{ color: '#65C466' }} style={row.isNewIPR ? { fontWeight: '700' } : { fontWeight: '400' }}>Approved</TableCell>) : row.approvalState === 1 ? (<TableCell align="center" sx={{ color: '#9fa18c' }} style={row.isNewIPR ? { fontWeight: '700' } : { fontWeight: '400' }}>Declined</TableCell>) : (<TableCell align="center" sx={{ color: '#c55615' }} style={row.isNewIPR ? { fontWeight: '700' } : { fontWeight: '400' }}>Pending</TableCell>)}
        <TableCell align="center" style={row.isNewIPR ? { fontWeight: '700' } : { fontWeight: '400' }}>{stages[row.approvalStage]}</TableCell>
        <TableCell align="center" style={row.isNewIPR ? { fontWeight: '700' } : { fontWeight: '400' }}>Detail</TableCell>
        <TableCell align="center" style={row.isNewIPR ? { fontWeight: '700' } : { fontWeight: '400' }}>{row.notes}</TableCell>
        <TableCell align="center" sx={{ pr: 0 }}>
          <Button
            onClick={() => editIPR(row._id)}
            variant="text"
            color="primary"
            sx={{ pr: 0 }}
          >
            <EditIcon />
          </Button>
        </TableCell>
        <TableCell align="center" sx={{ pl: 0 }}>
          <Button
            disabled={!(row.approvalStage === 4 || (row.approvalStage === 3 && parseInt(row.budgetline.initialAmount) < 10000) || (row.approvalStage === 2 && parseInt(row.budgetline.initialAmount) < 5000))}
            variant="text"
            color="primary"
            onClick={exportPDF}
            sx={{ pl: 0 }}
          >
            <DownloadIcon />
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
                      <TableCell align="center">{row.requestedBy.firstName + ' ' + row.requestedBy.lastName}</TableCell>
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
