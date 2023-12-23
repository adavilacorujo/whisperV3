import { createContext, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import { CircularProgress, Typography } from "@mui/material";

import axios from "axios";

import { Content } from "./components/Content";
import { CustomToolbar } from "./components/ui/ToolBar";

export const LoadingErrorContent = createContext(null);

const uploadFile = async (selectedFile, setIsLoading, setQueueFiles) => {
  //TODO: Check if file is mp4

  const formData = new FormData();
  formData.append("file", selectedFile, selectedFile.name);

  await axios
    .post("/api/upload", formData)
    .then((response) => {
      if (response.status !== 200)
        throw new Error("Not a good response", response);
      setIsLoading(false);
      setQueueFiles([response["data"]]);
      return true;
    })
    .catch((error) => {
      setIsLoading(false);
      console.log(error);
      return false;
    });
};

export default function App() {
  const [queueFiles, setQueueFiles] = useState([]);
  const [completedFiles, setCompletedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [loadingErrorContent, setErrorLoadingContent] = useState(null);
  const [isUploadLoading, setIsUploadLoading] = useState(false);

  const uploadButtonHandler = (event) => {
    setIsUploadLoading(true);
    uploadFile(event.target.files[0], setIsUploadLoading, setQueueFiles);
  };

  useEffect(() => {
    // Fetch list of files
    axios
      .get("/api/uploads")
      .then((response) => {
        const tempProcessed = [];
        const tempQueue = [];
        if (response.hasOwnProperty("data")) {
          response["data"].forEach((res) => {
            if (res["model_ran"]) {
              tempProcessed.push(res);
            } else {
              tempQueue.push(res);
            }
          });
        }
        setCompletedFiles(tempProcessed);
        setQueueFiles(tempQueue);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsError(true);
        setIsLoading(false);
        console.log("error", error);
      });
  }, []);

  useEffect(() => {
    if (isError)
      setErrorLoadingContent(<Typography>Could not fetch data</Typography>);
    else if (isLoading) setErrorLoadingContent(<CircularProgress />);
    else setErrorLoadingContent(null);
  }, [isLoading, isError]);

  return (
    <Box sx={{ display: "flex", flexFlow: "row nowrap", marginTop: "5rem" }}>
      <CssBaseline />
      <LoadingErrorContent.Provider value={loadingErrorContent}>
        <CustomToolbar
          isUploadLoading={isUploadLoading}
          uploadButtonHandler={uploadButtonHandler}
        />
        <Content
          queueFiles={queueFiles}
          completedFiles={completedFiles}
          setQueueFiles={setQueueFiles}
          setCompletedFiles={setCompletedFiles}
        />
      </LoadingErrorContent.Provider>
    </Box>
  );
}
