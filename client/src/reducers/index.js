import { combineReducers } from 'redux';
import alertReducer from './alert';
import authReducer from './auth';
import userReducer from './user';
import iprReducer from './ipr';
import programmeReducer from './programme';
import budgetlineReducer from './budgetline';
import outputReducer from './output';

export default combineReducers({
  alert: alertReducer,
  auth: authReducer,
  user: userReducer,
  ipr: iprReducer,
  programme: programmeReducer,
  budgetline: budgetlineReducer,
  output: outputReducer,
});
