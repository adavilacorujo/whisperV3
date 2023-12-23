import { useContext } from "react";

import {
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Paper,
  Stack,
  Divider,
  Typography,
} from "@mui/material";

import { LoadingErrorContent } from "../../App";

export const ProcessedPaper = ({
  queueHeight,
  totalHeight,
  completedFiles,
  handleClick,
}) => {
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
          overflowX: "wrap",
        }}
      >
        <Typography fontSize={"20px"} padding={"2rem"}>
          Uploaded files
        </Typography>
        <Stack
          sx={{
            height: `${totalHeight - queueHeight}vh`,
            overflow: "scroll",
          }}
          direction={"column"}
          divider={<Divider orientation="horizontal" flexItem />}
          spacing={2}
        >
          {loadingErrorContent !== null ? (
            loadingErrorContent
          ) : (
            <List>
              {completedFiles.map((modelInfo) => (
                <>
                  <ListItem key={modelInfo["id"]}>
                    <ListItemButton
                      onClick={() => handleClick(modelInfo["id"])}
                    >
                      <Stack>
                        <ListItemText>
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
                            <strong>Time Taken:</strong>{" "}
                            {Number(modelInfo["time"]).toFixed(2)}s
                          </Typography>
                          <Typography
                            sx={{ fontSize: "15px", overflowX: "scroll" }}
                          >
                            <strong>File Size:</strong>{" "}
                            {Number(modelInfo["size"]).toFixed(2)}MB
                          </Typography>
                        </ListItemText>
                      </Stack>
                    </ListItemButton>
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
