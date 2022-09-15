import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
// import Badge from '@mui/material/Badge';
// import NotificationsIcon from '@mui/icons-material/Notifications';
import { deepOrange } from '@mui/material/colors';

import { logout } from '../actions/auth'

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleLogout = () => {
    handleCloseUserMenu();
    dispatch(logout());
  }

  const goDashboard = () => {
    handleCloseUserMenu();
    return navigate('/dashboard');
  }

  const goProgrammes = () => {
    handleCloseUserMenu();
    return navigate('/programmes');
  }

  const goOutputs = () => {
    handleCloseUserMenu();
    return navigate('/outputs');
  }

  const goBudgetLines = () => {
    handleCloseUserMenu();
    return navigate('/budget-lines');
  }

  const goUsers = () => {
    handleCloseUserMenu();
    return navigate('/users');
  }

  // const goGenerateReports = () => {
  //   handleCloseUserMenu();
  //   return navigate('/generate-reports');
  // }

  const changePassword = () => {
    handleCloseUserMenu();
    return navigate('/change-password');
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          <Box component="a" href="/">
            <Box
              component="img"
              sx={{
                height: 40,
                width: 160,
                mr: 6,
                display: { xs: 'none', md: 'flex' },
              }}
              alt="The house from the offer."
              src="/logo.png"
            />
          </Box>

          {(user?.job === 'Support Manager' || user?.job === 'Finance Manager') &&
            <>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: 'flex', md: 'none' }
              }}
            >
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: 'block', md: 'none' },
                  }}
                >
                  <MenuItem onClick={goProgrammes}>
                    <Typography textAlign="center">Programmes</Typography>
                  </MenuItem>
                  <MenuItem onClick={goBudgetLines}>
                    <Typography textAlign="center">Budget Lines</Typography>
                  </MenuItem>
                  <MenuItem onClick={goOutputs}>
                    <Typography textAlign="center">Outputs</Typography>
                  </MenuItem>
                  {user?.job === 'Support Manager' &&
                    <MenuItem onClick={goUsers}>
                      <Typography textAlign="center">Users</Typography>
                    </MenuItem>
                  }
                  {/* <MenuItem onClick={goGenerateReports}>
                    <Typography textAlign="center">Generate Reports</Typography>
                  </MenuItem> */}
                </Menu>
              </Box>
              <Box component="a" href="/" sx={{ mx: 'auto', display: { xs: 'flex', md: 'none'}, flexGrow: 1 }}>
                <Box
                  component="img"
                  sx={{
                    height: 40,
                    width: 160
                  }}
                  alt="The house from the offer."
                  src="/logo.png"
                />
              </Box>
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                <Button
                onClick={goProgrammes}
                variant="outlined"
                sx={{
                  color: '#ffffff',
                  border: '1px solid #ffffff',
                  borderRadius: '12px',
                  px: '8px',
                  mr: '8px'
                }}
                >
                  Programmes
              </Button>
              <Button
                onClick={goBudgetLines}
                variant="outlined"
                sx={{
                  color: '#ffffff',
                  border: '1px solid #ffffff',
                  borderRadius: '12px',
                  px: '8px',
                  mr: '8px'
                }}
              >
                Budget Lines
              </Button>
                <Button
                onClick={goOutputs}
                variant="outlined"
                sx={{
                  color: '#ffffff',
                  border: '1px solid #ffffff',
                  borderRadius: '12px',
                  px: '8px',
                  mr: '8px'
                }}
                >
                  Outputs
                </Button>
                {user?.job === 'Support Manager' &&
                  <Button
                  onClick={goUsers}
                  variant="outlined"
                  sx={{
                    color: '#ffffff',
                    border: '1px solid #ffffff',
                    borderRadius: '12px',
                    px: '8px',
                    mr: '8px'
                  }}
                  >
                    Users
                  </Button>
                }
                {/* <Button
                  onClick={goGenerateReports}
                  sx={{ color: 'white', display: 'block' }}
                >
                  Generate Reports
                </Button> */}
              </Box>
            </>
          }
          
          {isAuthenticated &&
            <Box sx={{ flexGrow: 0 }}>
              {/* <IconButton
                sx={{ mr: 1 }}
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
              >
                <Badge badgeContent={0} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton> */}
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: deepOrange[500] }}>DS</Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={goDashboard}>
                  <Typography textAlign="center">Dashboard</Typography>
                </MenuItem>
                <MenuItem onClick={changePassword}>
                  <Typography textAlign="center">Change Password</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          }
          {!isAuthenticated &&
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Link style={{ textDecoration: 'none', marginRight: '12px', color: 'white' }} to="/signin">Sign In</Link>
              <Link style={{ textDecoration: 'none', color: 'white' }} to="/signup">Sign Up</Link>
            </Box>
          }
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Navbar;
