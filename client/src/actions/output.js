import api from '../utils/api';
import { setAlert } from './alert';

import {
  // GET_OUTPUT,
  GET_OUTPUTS,
  OUTPUT_ERROR
} from './types';


// export const getOutput = (id, navigate) => async (dispatch) => {
//   try {
//     const res = await api.get(`/outputs/${id}`);

//     dispatch({
//       type: GET_OUTPUT,
//       payload: res.data
//     });

//     navigate('/output/edit/' + id);
//   } catch (err) {
//     dispatch({
//       type: OUTPUT_ERROR,
//       payload: { msg: err.response.statusText, status: err.response.status }
//     });
//   }
// };

export const getOutputs = () => async (dispatch) => {
  try {
    const res = await api.get('/outputs');

    dispatch({
      type: GET_OUTPUTS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: OUTPUT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const createOutput = (formData) => async (dispatch) => {
  try {
    const res = await api.post('/outputs', formData);
    dispatch({
      type: GET_OUTPUTS,
      payload: res.data
    });
    dispatch(setAlert('Successfully created', 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    }
  }
};

export const updateOutput = (formData) => async (dispatch) => {
  try {
    const res = await api.post('/outputs/update', formData);
    dispatch({
      type: GET_OUTPUTS,
      payload: res.data
    });
    dispatch(setAlert('Successfully updated', 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    }
  }
};

export const deleteOutput = (id) => async (dispatch) => {
  try {
    const res = await api.post(`/outputs/delete/${id}`);

    dispatch({
      type: GET_OUTPUTS,
      payload: res.data
    });

    dispatch(setAlert('Output Removed', 'success'));
  } catch (err) {
    dispatch({
      type: OUTPUT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const createActivity = (formData) => async (dispatch) => {
  try {
    const res = await api.post('/outputs/activity', formData);
    dispatch({
      type: GET_OUTPUTS,
      payload: res.data
    });
    dispatch(setAlert('Successfully created', 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    }
  }
};

export const updateActivity = (formData) => async (dispatch) => {
  try {
    const res = await api.post('/outputs/activity/update', formData);
    dispatch({
      type: GET_OUTPUTS,
      payload: res.data
    });
    dispatch(setAlert('Successfully updated', 'success'));
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    }
  }
};

export const deleteActivity = (outputid, activityid) => async (dispatch) => {
  try {
    const res = await api.post(`/outputs/delete/${outputid}/${activityid}`);

    dispatch({
      type: GET_OUTPUTS,
      payload: res.data
    });

    dispatch(setAlert('Activity Removed', 'success'));
  } catch (err) {
    dispatch({
      type: OUTPUT_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
