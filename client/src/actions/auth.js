import api from '../utils/api';
import { setAlert } from './alert';
import {
  REGISTER_SUCCESS,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGOUT
} from './types';

/*
  NOTE: we don't need a config object for axios as the
 default headers in axios are already Content-Type: application/json
 also axios stringifies and parses JSON for you, so no need for 
 JSON.stringify or JSON.parse
*/

// Load User
export const loadUser = () => async (dispatch) => {
  try {
    const res = await api.get('/auth');

    dispatch({
      type: USER_LOADED,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// Register User
export const register = (formData) => async (dispatch) => {
  try {
    const res = await api.post('/users', formData);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    }
  }
};

export const createUser = (formData, navigate) => async (dispatch) => {
  try {
    const res = await api.post('/users', formData);
    console.log(res.data);
    dispatch(setAlert('Successfully created', 'success'));
    navigate('/users');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    }
  }
};

export const updateUser = (formData, navigate) => async (dispatch) => {
  try {
    const res = await api.post('/users/update', formData);
    console.log(res.data);
    dispatch(setAlert('Successfully updated', 'success'));
    navigate('/users');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    }
  }
};

export const changePassword = (formData, navigate) => async (dispatch) => {
  try {
    const res = await api.post('/users/changePassword', formData);
    console.log(res.data);
    dispatch(setAlert('Successfully changed', 'success'))
    navigate('/dashboard');
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    }
  }
};

// Login User
export const login = (email, password) => async (dispatch) => {
  const body = { email, password };

  try {
    const res = await api.post('/auth', body);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    }
  }
};

export const checkFirst = () => async (dispatch) => {
  try {
    await api.post('/users/checkFirst');
    // console.log('isFirstLogin->false', res.data);
    dispatch(loadUser());
    dispatch(setAlert('Please change password', 'warning', 10000));
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
}

// Logout
export const logout = () => ({ type: LOGOUT });
