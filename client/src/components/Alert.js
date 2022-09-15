import React from 'react';
import { useSelector } from 'react-redux';
import { Alert as MuiAlert, AlertTitle } from '@mui/material';

const Alert = () => {
  const { alert } = useSelector(state => state);
  const capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }
  return (
    <div className="mui-alert">
      {alert.map((alrt) => (
        <MuiAlert sx={{ marginBottom: '10px' }} key={alrt.id} severity={alrt.alertType}>
          <AlertTitle>{capitalize(alrt.alertType)}</AlertTitle>
          {alrt.msg}
        </MuiAlert>
      ))}
    </div>
  )
};

export default Alert;
