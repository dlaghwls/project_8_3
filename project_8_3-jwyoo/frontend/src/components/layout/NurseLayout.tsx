import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, IconButton, Drawer, List,
  ListItemButton, ListItemIcon, ListItemText, Box, Badge, Avatar,
  Menu, MenuItem, Divider, Container, CssBaseline
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  LocalHospital as VitalIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '../../store/AuthContext';

const NurseLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const drawerItems = [
    { text: '대시보드', icon: <DashboardIcon />, path: '/nurse' },
    { text: '바이탈 입력', icon: <VitalIcon />, path: '/nurse/vital-input' },
    { text: '메시지', icon: <MessageIcon />, path: '/nurse/messages' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(!drawerOpen)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            StrokeCare+ 간호사 대시보드
          </Typography>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton onClick={handleProfileMenuOpen} color="inherit">
            <Avatar sx={{ width: 32, height: 32, ml: 1 }}>
              {user?.name?.charAt(0) || 'N'}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => navigate('/nurse/profile')}>
              <Typography>{user?.name} (간호사)</Typography>
            </MenuItem>
            <MenuItem onClick={() => navigate('/nurse/settings')}>설정</MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>로그아웃</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            {drawerItems.map((item) => (
              <ListItemButton
                key={item.text}
                component={Link}
                to={item.path}
                onClick={() => setDrawerOpen(false)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            ))}
          </List>
          <Divider />
          <List>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="로그아웃" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, pt: 8, px: 2 }}>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default NurseLayout;
