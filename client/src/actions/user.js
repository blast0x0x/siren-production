import api from '../utils/api';
import { setAlert } from './alert';

import {
  GET_USER,
  GET_USERS, 
  USER_ERROR
} from './types';

/*
  NOTE: we don't need a config object for axios as the
 default headers in axios are already Content-Type: application/json
 also axios stringifies and parses JSON for you, so no need for 
 JSON.stringify or JSON.parse
*/

export const getUser = (id, navigate) => async (dispatch) => {
  try {
    const res = await api.get(`/users/${id}`);

    dispatch({
      type: GET_USER,
      payload: res.data
    });

    navigate('/user/edit/' + id);
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get all users
export const getUsers = () => async (dispatch) => {
  try {
    const res = await api.get('/users');

    dispatch({
      type: GET_USERS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const deleteUserById = (id) => async (dispatch) => {
  try {
    const res = await api.post(`/users/delete/${id}`);

    dispatch({
      type: GET_USERS,
      payload: res.data
    });

    dispatch(setAlert('User Removed', 'success'));
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

export const updateUserApprovalById = (userid, checked) => async (dispatch) => {
  try {
    const res = await api.post('/users/updateApprovalById', { userid, checked });
    
    dispatch({
      type: GET_USERS,
      payload: res.data
    });
    dispatch(setAlert('Successfully changed', 'success'))
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
}
