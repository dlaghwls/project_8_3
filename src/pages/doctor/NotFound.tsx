import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="70vh"
    >
      <Typography variant="h3" gutterBottom>404</Typography>
      <Typography variant="h5" gutterBottom>페이지를 찾을 수 없습니다</Typography>
      <Typography variant="body1" color="textSecondary" paragraph>
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
      </Typography>
      <Button
        component={Link}
        to="/doctor"
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
      >
        대시보드로 돌아가기
      </Button>
    </Box>
  );
};

export default NotFound;
