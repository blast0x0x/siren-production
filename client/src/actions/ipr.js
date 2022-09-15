import api from '../utils/api';
import { setAlert } from './alert';

import {
  GET_IPR,
  GET_IPRS,
  IPR_ERROR,
  GET_OUTPUTS
} from './types';

export const getIPR = (id, navigate) => async (dispatch) => {
  try {
    let res = await api.get('/outputs');
    dispatch({
      type: GET_OUTPUTS,
      payload: res.data
    });

    res = await api.get(`/iprs/${id}`);
    dispatch({
      type: GET_IPR,
      payload: res.data
    });

    navigate('/ipr/edit/' + id);
  } catch (err) {
    dispatch({
      type: IPR_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Register IPR
export const registerIPR = (formData, navigate) => async (dispatch) => {
  try {
    await api.post('/iprs', formData);

    dispatch(setAlert('Successfully added', 'success'));
    navigate('/dashboard');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    }
  }
};

export const updateIPR = (formData, navigate) => async (dispatch) => {
  try {
    await api.post('/iprs/update', formData);

    dispatch(setAlert('Successfully updated', 'success'));
    navigate('/dashboard');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    }
  }
};

export const updateIprApprovalById = (id, checked) => async (dispatch) => {
  try {
    const res = await api.post('/iprs/updateApprovalById', { id, checked });

    dispatch({
      type: GET_IPRS,
      payload: res.data
    });
    dispatch(setAlert('Successfully changed', 'success'))
  } catch (err) {
    dispatch({
      type: IPR_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
}

export const updateIprAllocateById = (id) => async (dispatch) => {
  try {
    const res = await api.post('/iprs/updateAllocateById', { id });

    dispatch({
      type: GET_IPRS,
      payload: res.data
    });
    dispatch(setAlert('Successfully changed', 'success'))
  } catch (err) {
    dispatch({
      type: IPR_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
}

export const updateIprIssuedRFQById = (id) => async (dispatch) => {
  try {
    const res = await api.post('/iprs/updateIssuedRFQById', { id });

    dispatch({
      type: GET_IPRS,
      payload: res.data
    });
    dispatch(setAlert('Successfully changed', 'success'))
  } catch (err) {
    dispatch({
      type: IPR_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
}

export const updateIprFinalApproveById = (id, checked) => async (dispatch) => {
  try {
    const res = await api.post('/iprs/updateFinalApproveById', { id, checked });

    dispatch({
      type: GET_IPRS,
      payload: res.data
    });
    dispatch(setAlert('Successfully changed', 'success'))
  } catch (err) {
    dispatch({
      type: IPR_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
}

export const updateIprNewById = (id) => async (dispatch) => {
  try {
    const res = await api.post('/iprs/updateNewById', { id });

    dispatch({
      type: GET_IPRS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: IPR_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
}

// Get all iprs
export const getIprs = () => async (dispatch) => {
  try {
    const res = await api.get('/iprs');

    dispatch({
      type: GET_IPRS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: IPR_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
