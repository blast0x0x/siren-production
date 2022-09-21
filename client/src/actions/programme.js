import api from '../utils/api';
import { setAlert } from './alert';

import {
  GET_PROGRAMME,
  GET_PROGRAMMES,
  PROGRAMME_ERROR
} from './types';


export const getProgramme = (id, navigate) => async (dispatch) => {
  try {
    const res = await api.get(`/programmes/${id}`);

    dispatch({
      type: GET_PROGRAMME,
      payload: res.data
    });

    navigate('/programme/edit/' + id);
  } catch (err) {
    dispatch({
      type: PROGRAMME_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const getProgrammes = () => async (dispatch) => {
  try {
    const res = await api.get('/programmes');

    dispatch({
      type: GET_PROGRAMMES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: PROGRAMME_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const createProgramme = (formData, navigate) => async (dispatch) => {
  try {
    const res = await api.post('/programmes', formData);
    dispatch(setAlert('Successfully created', 'success'));
    navigate('/programmes');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    }
  }
};

export const updateProgramme = (formData, navigate) => async (dispatch) => {
  try {
    const res = await api.post('/programmes/update', formData);
    dispatch(setAlert('Successfully updated', 'success'));
    navigate('/programmes');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    }
  }
};

export const deleteProgrammeById = (id) => async (dispatch) => {
  try {
    const res = await api.post(`/programmes/delete/${id}`);

    dispatch({
      type: GET_PROGRAMMES,
      payload: res.data
    });

    dispatch(setAlert('Programme Removed', 'success'));
  } catch (err) {
    dispatch({
      type: PROGRAMME_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};
