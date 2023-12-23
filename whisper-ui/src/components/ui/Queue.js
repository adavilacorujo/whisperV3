import { useContext } from "react";

import {
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Divider,
  Typography,
  CircularProgress,
} from "@mui/material";

import { LoadingErrorContent } from "../../App";

export const QueuePaper = ({ queueHeight, queueFiles }) => {
  const loadingErrorContent = useContext(LoadingErrorContent);
  return (
    <div
      style={{
        flexBasis: "30%",
        margin: 0,
        padding: 0,
      }}
    >
      <Paper
        sx={{
          backgroundColor: "gray",
          color: "white",
          marginBottom: "1rem",
        }}
      >
        <Typography
          fontSize={"20px"}
          paddingTop={"2rem"}
          paddingLeft={"2rem"}
          paddingRight={"2rem"}
          paddingBottom={"0.5rem"}
        >
          Files in queue
        </Typography>
        <Stack
          sx={{ height: `${queueHeight}vh`, overflow: "scroll" }}
          direction={"column"}
          divider={<Divider orientation="horizontal" flexItem />}
          spacing={2}
        >
          {loadingErrorContent !== null ? (
            loadingErrorContent
          ) : (
            <List>
              {queueFiles.map((modelInfo) => (
                <>
                  <ListItem key={modelInfo["id"]}>
                    <Stack>
                      <ListItemText sx={{ display: "grid" }}>
                        <div style={{ gridColumn: "1/8", gridRow: "1" }}>
                          <Typography
                            sx={{ fontSize: "15px", overflowX: "scroll" }}
                          >
                            <strong>Title:</strong>
                            {String(modelInfo["location"])
                              .split("/")
                              [
                                modelInfo["location"].split("/").length - 1
                              ].slice(0, 30)}
                            ...
                          </Typography>
                          <Typography
                            sx={{ fontSize: "15px", overflowX: "scroll" }}
                          >
                            <strong>Model:</strong> {modelInfo["model"]}
                          </Typography>
                          <Typography
                            sx={{ fontSize: "15px", overflowX: "scroll" }}
                          >
                            <strong>File Size:</strong>{" "}
                            {Number(modelInfo["size"]).toFixed(2)}MB
                          </Typography>
                        </div>
                        <div style={{ gridColumn: "7/11", gridRow: "1" }}>
                          <CircularProgress />
                        </div>
                      </ListItemText>
                    </Stack>
                  </ListItem>
                  <Divider />
                </>
              ))}
            </List>
          )}
        </Stack>
      </Paper>
    </div>
  );
};
