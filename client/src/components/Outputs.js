import * as React from 'react';
import { useEffect } from 'react';
import {
  useSelector,
  useDispatch
} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  CssBaseline,
  Container,
  Box,
  Typography,
  Button,
  Modal,
  Grid,
  TextField,
  Tooltip,
  MenuItem,
  FormControl,
  InputLabel, 
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText
} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Spinner from './Spinner';
import { getProgrammes } from '../actions/programme';
import { getBudgetLines } from '../actions/budgetline';
import {
  getOutputs,
  deleteOutput,
  createOutput,
  updateOutput,
  createActivity,
  updateActivity,
  deleteActivity
} from '../actions/output';

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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const theme = createTheme();

export default function Outputs() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { programmes } = useSelector(state => state.programme);
  const { budgetlines } = useSelector(state => state.budgetline);
  const programmeOptions = programmes?.map((option) => ({
    value: option._id,
    label: option.name
  }))
  const { outputs, outputloading } = useSelector(state => state.output);
  const [expanded, setExpanded] = React.useState([]);
  const [name, setName] = React.useState('');
  const [activity, setActivity] = React.useState('');
  const [openOutputCreate, setOpenOutputCreate] = React.useState(false);
  const [openOutputEdit, setOpenOutputEdit] = React.useState(false);
  const [openActivityCreate, setOpenActivityCreate] = React.useState(false);
  const [openActivityEdit, setOpenActivityEdit] = React.useState(false);
  const [idToUpdateOutput, setIdToUpdateOutput] = React.useState(null);
  const [idToCreateActivity, setIdToCreateActivity] = React.useState(null);
  const [idToUpdateActivity, setIdToUpdateActivity] = React.useState(null);
  const [activityIdToUpdateActivity, setActivityIdToUpdateActivity] = React.useState(null);

  const [programmevalue, setProgrammeValue] = React.useState(null);
  const [budgetlinefilters, setBudgetlinefilters] = React.useState(null);
  
  const [connectedBudgetLineIds, setConnectedBudgetLineIds] = React.useState([]);
  const [connectedBudgetLineNames, setConnectedBudgetLineNames] = React.useState([]);

  const handleProgrammeValueChange = (event) => {
    setConnectedBudgetLineNames([]);
    setProgrammeValue(event.target.value);
    setBudgetlinefilters(budgetlines.filter((budgetline) => budgetline.programme.toString() === event.target.value.toString()));
  }

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setConnectedBudgetLineNames(
      typeof value === 'string' ? value.split(',') : value,
    );
    let nameIdPairs = {};
    for (let i = 0; i < budgetlines.length; i++)
      nameIdPairs[budgetlines[i].name] = budgetlines[i]._id;
    const budgetLineIds = value.map((name) => nameIdPairs[name]);
    setConnectedBudgetLineIds(budgetLineIds);
  };

  const openOutputCreateModal = () => setOpenOutputCreate(true);

  const closeOutputCreateModal = () => {
    setOpenOutputCreate(false);
    setConnectedBudgetLineNames([]);
    setProgrammeValue(null);
    setName('');
  }

  const openOutputEditModal = (output) => {
    setName(output.name);
    setIdToUpdateOutput(output._id);
    setProgrammeValue(output.programme);
    let idNamePairs = {};
    for (let i = 0; i < budgetlines.length; i++)
      idNamePairs[budgetlines[i]._id] = budgetlines[i].name;
    const budgetLineNames = output.connectedBudgetlines.map((id) => idNamePairs[id]);
    setConnectedBudgetLineNames(budgetLineNames);
    setOpenOutputEdit(true);
  }

  const closeOutputEditModal = () => {
    setOpenOutputEdit(false);
    setConnectedBudgetLineNames([]);
    setProgrammeValue(null);
    setName('');
  }

  const openActivityCreateModal = (id) => {
    setIdToCreateActivity(id);
    setOpenActivityCreate(true);
  }

  const closeActivityCreateModal = () => {
    setOpenActivityCreate(false);
    setActivity('');
  }

  const openActivityEditModal = (outputid, activityid, activity) => {
    setActivity(activity);
    setIdToUpdateActivity(outputid);
    setActivityIdToUpdateActivity(activityid);
    setOpenActivityEdit(true);
  }

  const closeActivityEditModal = () => {
    setOpenActivityEdit(false);
    setActivity('');
  }

  const setN = (event) => {
    setName(event.target.value);
  }

  const setA = (event) => {
    setActivity(event.target.value);
  }

  const insertOutput = (event) => {
    event.preventDefault();
    closeOutputCreateModal();
    const data = new FormData(event.currentTarget);
    const programme = programmevalue;
    const connectedBudgetlines = connectedBudgetLineIds;
    const name = data.get('name');
    dispatch(createOutput({ programme, connectedBudgetlines, name }));
  };

  const editOutput = (event) => {
    event.preventDefault();
    closeOutputEditModal();
    const data = new FormData(event.currentTarget);
    const id = idToUpdateOutput;
    const programme = programmevalue;
    const connectedBudgetlines = connectedBudgetLineIds;
    const name = data.get('name');
    dispatch(updateOutput({ id, programme, connectedBudgetlines, name }));
  };

  const removeOutput = (id) => {
    dispatch(deleteOutput(id));
  }

  const insertActivity = (event) => {
    event.preventDefault();
    closeActivityCreateModal();
    const data = new FormData(event.currentTarget);
    const id = idToCreateActivity;
    const activity = data.get('activity');
    dispatch(createActivity({ id, activity }));
  };

  const editActivity = (event) => {
    event.preventDefault();
    closeActivityEditModal();
    const data = new FormData(event.currentTarget);
    const outputid = idToUpdateActivity;
    const activityid = activityIdToUpdateActivity;
    const activity = data.get('activity');
    dispatch(updateActivity({ outputid, activityid, activity }));
  };

  const removeActivity = (outputid, activityid) => {
    dispatch(deleteActivity(outputid, activityid));
  }

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  useEffect(() => {
    let temp = [];
    for (let i = 0; i < outputs.length; i++) {
      temp.push(outputs[i]._id);
      const activitytemp = outputs[i].activities;
      for (let j = 0; j < activitytemp.length; j++) {
        temp.push(activitytemp[j]._id);
      }
    }
    setExpanded(temp);
  }, [outputs])

  useEffect(() => {
    dispatch(getOutputs());
    dispatch(getProgrammes());
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
            mb: 4,
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
              mt: 4
            }}
            component="h1"
            variant="h5"
          >
            Outputs
          </Typography>
          <Box
            sx={{
              mt: 4,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {!outputloading ? (
              <TreeView
                aria-label="file system navigator"
                defaultCollapseIcon={<ExpandMoreIcon />}
                defaultExpandIcon={<ChevronRightIcon />}
                onNodeToggle={handleToggle}
                expanded={expanded}
                sx={{
                  padding: 1,
                  height: 600,
                  flexGrow: 1,
                  maxWidth: 800,
                  overflowY: 'auto',
                  border: '1px solid #c3c3c3',
                  borderRadius: '8px'
                }}
              >
                {outputs?.map((output) => (
                  <TreeItem
                    key={output._id}
                    nodeId={output._id}
                    label={output.name}
                    sx={{
                      position: 'relative',
                      py: 1
                    }}
                  >
                    <Box component="span" sx={{ position: 'absolute', right: '0', top: '7px' }}>
                      <Tooltip title="Add Activity">
                        <Button
                          onClick={() => openActivityCreateModal(output._id)}
                          variant="text"
                          color="primary"
                          sx={{
                            padding: 0,
                            minWidth: '28px'
                          }}
                        >
                          <AddIcon />
                        </Button>
                      </Tooltip>
                      <Tooltip title="Edit Output">
                        <Button
                          variant="text"
                          color="primary"
                          onClick={() => openOutputEditModal(output)}
                          sx={{
                            padding: 0,
                            minWidth: '28px'
                          }}
                        >
                          <EditIcon />
                        </Button>
                      </Tooltip>
                      <Tooltip title="Delete Output">
                        <Button
                          onClick={() => removeOutput(output._id)}
                          variant="text"
                          color="primary"
                          sx={{
                            padding: 0,
                            minWidth: '28px'
                          }}
                        >
                          <DeleteIcon />
                        </Button>
                      </Tooltip>
                    </Box>
                    {output.activities.map((activity) => (
                      <TreeItem
                        sx={{
                          position: 'relative',
                          py: 1
                        }}
                        key={activity._id}
                        nodeId={activity._id}
                        label={activity.activityName}
                      >
                        <Box component="span" sx={{ position: 'absolute', right: '0', top: '7px' }}>
                          <Tooltip title="Edit Activity">
                            <Button
                              variant="text"
                              color="primary"
                              onClick={() => openActivityEditModal(output._id, activity._id, activity.activityName)}
                              sx={{
                                padding: 0,
                                minWidth: '28px'
                              }}
                            >
                              <EditIcon />
                            </Button>
                          </Tooltip>
                          <Tooltip title="Delete Activity">
                            <Button
                              onClick={() => removeActivity(output._id, activity._id)}
                              variant="text"
                              color="primary"
                              sx={{
                                padding: 0,
                                minWidth: '28px'
                              }}
                            >
                              <DeleteIcon />
                            </Button>
                          </Tooltip>
                        </Box>
                      </TreeItem>
                    ))}
                  </TreeItem>
                ))}
              </TreeView>
            ) : (
              <Spinner />
            )}
          </Box>
          <Box
            sx={{
              mt: 4,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Button
              onClick={openOutputCreateModal}
              variant="contained"
              endIcon={<AddIcon />}
              color="primary"
            >
              Add Output
            </Button>
          </Box>
          <Modal
            open={openOutputCreate}
            onClose={closeOutputCreateModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" textAlign="center" variant="h6" component="h2">
                Add Output
              </Typography>
              <Box component="form" noValidate onSubmit={insertOutput} sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
                    <FormControl style={{ width: '100%' }}>
                      <InputLabel id="demo-multiple-checkbox-label">Budget Lines</InputLabel>
                      <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={connectedBudgetLineNames}
                        onChange={handleChange}
                        input={<OutlinedInput label="Budget Lines" />}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                      >
                        {budgetlinefilters?.map((budgetLine) => (
                          <MenuItem key={budgetLine._id} value={budgetLine.name}>
                            <Checkbox checked={connectedBudgetLineNames.indexOf(budgetLine.name) > -1} />
                            <ListItemText primary={budgetLine.name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="name"
                      label="Name"
                      name="name"
                      value={name}
                      onChange={setN}
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
          <Modal
            open={openOutputEdit}
            onClose={closeOutputEditModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" textAlign="center" variant="h6" component="h2">
                Edit Output
              </Typography>
              <Box component="form" noValidate onSubmit={editOutput} sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
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
                  <Grid item xs={12}>
                    <FormControl style={{ width: '100%' }}>
                      <InputLabel id="demo-multiple-checkbox-label">Budget Lines</InputLabel>
                      <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={connectedBudgetLineNames}
                        onChange={handleChange}
                        input={<OutlinedInput label="Budget Lines" />}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                      >
                        {budgetlinefilters?.map((budgetLine) => (
                          <MenuItem key={budgetLine._id} value={budgetLine.name}>
                            <Checkbox checked={connectedBudgetLineNames.indexOf(budgetLine.name) > -1} />
                            <ListItemText primary={budgetLine.name} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="name"
                      label="Name"
                      name="name"
                      value={name}
                      onChange={setN}
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
          <Modal
            open={openActivityCreate}
            onClose={closeActivityCreateModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" textAlign="center" variant="h6" component="h2">
                Add Activity
              </Typography>
              <Box component="form" noValidate onSubmit={insertActivity} sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="activity"
                      label="Activity Name"
                      name="activity"
                      value={activity}
                      onChange={setA}
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
          </Modal>
          <Modal
            open={openActivityEdit}
            onClose={closeActivityEditModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" textAlign="center" variant="h6" component="h2">
                Edit Activity
              </Typography>
              <Box component="form" noValidate onSubmit={editActivity} sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="activity"
                      label="Activity Name"
                      name="activity"
                      value={activity}
                      onChange={setA}
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
    </ThemeProvider>
  );
}