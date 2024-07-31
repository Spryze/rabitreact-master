import { memo } from 'react';
import Box from '@mui/material/Box';

function RabitSplashScreen() {
  return (
    <div id="rabit-splash-screen">
      <div className="logo">
        <img width="128" src="assets/images/logo/logo.png" alt="logo" />
      </div>
      <Box
        id="spinner"
        sx={{
          '& > div': {
            backgroundColor: 'palette.secondary.main',
          },
        }}
      >
        <div className="bounce1" />
        <div className="bounce2" />
        <div className="bounce3" />
      </Box>
    </div>
  );
}

export default memo(RabitSplashScreen);
