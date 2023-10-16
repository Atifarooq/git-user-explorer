import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Breadcrumb: FC<any> = ({ data, hidden }) => {
  const navigate = useNavigate();
  return (
    <Box sx={{ display: hidden ? 'none' : 'flex', alignItems: "center" }}>
      <Button
        sx={{ minWidth: "auto", mr: 1 }}
        variant="text"
        color="inherit"
        onClick={() => navigate(-1)}
      >
        <ArrowBackIcon />
      </Button>
      {data && <Typography>{data}</Typography>}
    </Box>
  );
};

export default Breadcrumb;
