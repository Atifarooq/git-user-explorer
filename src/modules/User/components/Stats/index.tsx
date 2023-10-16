import { FC } from "react";
import { Box, Typography } from "@mui/material";

const Stats: FC<any> = ({ caption, value }) => {
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Typography variant="h5">{value}</Typography>
      <Typography
        variant="caption"
        display="block"
        color="text.secondary"
        sx={{ textTransform: "uppercase" }}
      >
        {caption}
      </Typography>
    </Box>
  );
};

export default Stats;
