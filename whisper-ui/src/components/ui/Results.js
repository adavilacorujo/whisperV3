import { Card, CardContent, Typography, Grid, Paper } from "@mui/material";
import TroubleshootIcon from "@mui/icons-material/Troubleshoot";

export const ResultsPaper = ({ selectedFile, videoDiv }) => {
  const emptyPrompt = (
    <Card
      sx={{
        justifyContent: "center",
        alignItems: "center",
        my: "15%",
        mx: "25%",
        borderRadius: 5,
        width: "100%",
      }}
    >
      <CardContent>
        <Typography
          color="text.primary"
          sx={{ fontSize: 26, textAlign: "left", fontWeight: "bold" }}
        >
          Click or upload a new video to get its translation
        </Typography>
        <br />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography sx={{ fontSize: 18 }}>
              No file has been selected. Select a file from the left to view its
              transcription/translation.
            </Typography>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              alignItems: "start",
              justifyContent: "center",
            }}
          >
            <TroubleshootIcon sx={{ fontSize: 90 }} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <div
      style={{
        display: "100%",
        paddingLeft: "2rem",
      }}
    >
      <Paper
        sx={{
          backgroundColor: "gray",
          color: "white",
          height: "80vh",
          overflowY: "scroll",
        }}
      >
        {selectedFile["filename"] === "" ? (
          emptyPrompt
        ) : (
          <>
            <Typography fontSize={"20px"} padding={"2rem"}>
              {selectedFile["filename"]}
            </Typography>
            <div
              style={{
                paddingLeft: "4rem",
                paddingRight: "4rem",
                margin: "auto 0",
              }}
            >
              {videoDiv}
            </div>
            <Typography
              fontSize={"20px"}
              paddingTop={"2rem"}
              paddingLeft={"2rem"}
            >
              Translation
            </Typography>
            <Typography fontSize={"15px"} padding={"2rem"}>
              {selectedFile["text"]}
            </Typography>
          </>
        )}
      </Paper>
    </div>
  );
};
