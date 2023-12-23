import { useState } from "react";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import MuiAppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  backgroundColor: "gray",
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const CustomToolbar = ({ isUploadLoading, uploadButtonHandler }) => {
  return (
    <AppBar position="fixed">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isUploadLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Toolbar
        sx={{
          display: "flex",
          flexFlow: "row nowrap",
        }}
      >
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ justifySelf: "flex-start" }}
        >
          Automatic Speech Recognition (ASR)
        </Typography>
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUploadIcon />}
          onChange={uploadButtonHandler}
          sx={{ justifySelf: "flex-end", margin: "0 auto" }}
        >
          Upload file
          <VisuallyHiddenInput type="file" accept=".mp4" />
        </Button>
      </Toolbar>
    </AppBar>
  );
};
