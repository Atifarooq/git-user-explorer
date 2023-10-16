import React from "react";
import { Paper, Skeleton, Typography, Box } from "@mui/material";

const LoadingSign = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        py: 1,
        px: 2,
        display: "grid",
        gridTemplateColumns: "auto 1fr",
        gap: "20px",
      }}
    >
      <Skeleton animation="wave" variant="circular" width={40} height={40} />
      <Box>
        <Typography component="div" variant="body1" sx={{ lineHeight: 2.5 }}>
          <Skeleton />
        </Typography>
      </Box>
    </Paper>
  );
};

export default LoadingSign;
