// Navbar.jsx
import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { login1, logout } from '../store/UserSlice';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1, 3),
  textTransform: 'none',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.light, 0.85),
  },
}));

export default function Navbar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [searchUsers, setSearchUsers] = useState([]);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const dispatch = useDispatch();
  let navigate = useNavigate();
  let userStore = useSelector((state) => state.user);
  let login = userStore.login;

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <Box display="flex" flexDirection="column" alignItems="center" gap={1} p={2}>
        {!login ? (
          <>
            <StyledButton component={Link} to="/login" color="primary" variant="contained">
              Login
            </StyledButton>
            <StyledButton component={Link} to="/signup" color="primary" variant="contained">
              Sign Up
            </StyledButton>
          </>
        ) : (
          <>
            <StyledButton
              component={Link} to="/"
              color="secondary"
              variant="contained"
            >
              Home
            </StyledButton>
            <StyledButton
              component={Link} to="/profile"
              color="secondary"
              variant="contained"
            >
              Profile
            </StyledButton>
            <StyledButton
              onClick={() => dispatch(logout())}
              color="secondary"
              variant="contained"
            >
              Log Out
            </StyledButton>
          </>
        )}
      </Box>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  // Add a new state to manage the search input value
const [searchInput, setSearchInput] = useState('');

const handleSearchChange = async (e) => {
  const value = e.target.value;
  setSearchInput(value); // Update the input value state
  if (!value.trim()) {
    setSearchUsers([]);
    return;
  }
  try {
    const res = await axios.get(`https://pixify-backend-phx3.onrender.com/user/search?q=${value}`);
    const data = res.data;
    setSearchUsers(data.users); // Directly set the users array
  } catch (err) {
    console.error('Error fetching search results:', err);
    setSearchUsers([]);
  }
};

const handleLinkClick = () => {
  setSearchInput(''); // Clear the search input
  setSearchUsers([]); // Clear the search results dropdown
};


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed" sx={{ zIndex: 1300 }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            Pixify
          </Typography>
          <div className="search-container">
  { login===true &&
    <Search>
    <SearchIconWrapper>
      <SearchIcon />
    </SearchIconWrapper>
    <StyledInputBase
      placeholder="Search…"
      inputProps={{ 'aria-label': 'search' }}
      onChange={handleSearchChange}
      value={searchInput}
    />
  </Search>
  }
  {Array.isArray(searchUsers) && searchUsers.length > 0 && (
  <div 
    className='absolute top-full mt-2 bg-white rounded-lg shadow-lg'
    style={{ width: '300px', zIndex: 1000 }} // Adjust width as needed
  >
    { searchUsers.map((ele) => {
     return ele._id!==userStore?.user?._id && <Link onClick={handleLinkClick} state={ele._id} to={'/friendProfile' } 
        className='flex items-center gap-3 p-2 border-b last:border-none hover:bg-gray-100 cursor-pointer'
        key={ele._id}
      >
        <img 
          className='w-10 h-10 rounded-full object-cover' 
          src={ele.profilePic} 
          alt={ele.name} 
        />
        <p className='text-sm font-medium text-gray-800'>{ele.name}</p>
      </Link>
})}
  </div>
)}

</div>

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
