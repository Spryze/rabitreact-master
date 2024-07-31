import Button from '@mui/material/Button';

import { useNavigate } from 'react-router-dom';

import useTheme from '@mui/material/styles/useTheme';
import { lighten } from '@mui/material/styles';
import RabitSvgIcon from '@rabit/core/RabitSvgIcon';

export const containerStyle = {
    show: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };
  
export const BackButtonStyles = () => {
  const theme = useTheme();

  return {
    width: '100%',
    padding: '8px 16px',
    borderRadius: '0',
    backgroundColor: lighten('#EFAD2A', 0.05),
    color: '#550101',
    fontWeight: 'bold',
    textTransform: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    '& .MuiSvgIcon-root': {
      marginRight: theme.direction === 'ltr' ? '8px' : '0',
      marginLeft: theme.direction === 'rtl' ? '8px' : '0',
    },
  };
};

export const GetBackButton = (toLink, title) => {
  const theme = useTheme();
  const navigate = useNavigate();

  let toPath = '/';
  if (toLink === '../') {
    toPath = -1;
  } else {
    toPath = toLink;
  }
  const handleBackButtonClick = () => {
    navigate(toPath);
  };

  return (
    <div>
      <Button
        onClick={() => {
          handleBackButtonClick();
        }}
        // color="secondary"
        sx={BackButtonStyles()}
        startIcon={
          <RabitSvgIcon size={20}>
            {theme.direction === 'ltr'
              ? 'heroicons-outline:arrow-sm-left'
              : 'heroicons-outline:arrow-sm-right'}
          </RabitSvgIcon>
        }
      >
        {title}
      </Button>
    </div>
  );
};
