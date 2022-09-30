import api from '../utils/api';
import { setAlert } from './alert';

import {
  GET_BUDGETLINE,
  GET_BUDGETLINES,
  BUDGETLINE_ERROR
} from './types';


export const getBudgetLine = (id, navigate) => async (dispatch) => {
  try {
    const res = await api.get(`/budgetlines/${id}`);

    dispatch({
      type: GET_BUDGETLINE,
      payload: res.data
    });

    navigate('/budgetline/edit/' + id);
  } catch (err) {
    dispatch({
      type: BUDGETLINE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const getBudgetLines = () => async (dispatch) => {
  try {
    const res = await api.get('/budgetlines');

    dispatch({
      type: GET_BUDGETLINES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: BUDGETLINE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const createBudgetLine = (formData, navigate) => async (dispatch) => {
  try {
    const res = await api.post('/budgetlines', formData);
    dispatch(setAlert('Successfully created', 'success'));
    navigate('/budgetlines');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    }
  }
};

export const updateBudgetLine = (formData, navigate) => async (dispatch) => {
  try {
    const res = await api.post('/budgetlines/update', formData);
    dispatch(setAlert('Successfully updated', 'success'));
    navigate('/budgetlines');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    }
  }
};

export const deleteBudgetLineById = (id) => async (dispatch) => {
  try {
    const res = await api.post(`/budgetlines/delete/${id}`);

    dispatch({
      type: GET_BUDGETLINES,
      payload: res.data
    });

    dispatch(setAlert('BudgetLine Removed', 'success'));
  } catch (err) {
    dispatch({
      type: BUDGETLINE_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
