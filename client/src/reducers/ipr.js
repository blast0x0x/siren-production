import {
  GET_IPR,
  GET_IPRS,
  IPR_ERROR
} from '../actions/types';

const initialState = {
  ipr: null,
  iprs: [],
  iprloading: true,
  error: {}
};

function iprReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_IPR:
      return {
        ...state,
        ipr: payload,
        iprloading: false
      };
    case GET_IPRS:
      return {
        ...state,
        iprs: payload,
        iprloading: false
      };
    case IPR_ERROR:
      return {
        ...state,
        error: payload,
        ipr: null,
        iprloading: false
      };
    default:
      return state;
  }
}

export default iprReducer;
