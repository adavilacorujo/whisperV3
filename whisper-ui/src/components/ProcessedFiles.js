import { useContext } from "react";
import axios from "axios";

import { CardMedia } from "@mui/material";
import { ProcessedPaper } from "./ui/Processed.js";
import { QueueHandlerContext } from "./Content.js";

export const ProcessedFilesComponent = ({ queueHeight, totalHeight }) => {
  const { completedFiles, setSelectedFile, setVideoDiv } =
    useContext(QueueHandlerContext);

  const handleClick = (id) => {
    axios
      .get(`/api/results/${id}`)
      .then((response) => {
        setSelectedFile({
          id: response["data"]["results"]["id"],
          filename: response["data"]["filename"],
          text: response["data"]["results"]["result"]["text"],
          videoURL: response["data"]["video_url"],
        });
        setVideoDiv(
          <CardMedia
            controls
            component="video"
            alt="text video"
            height="400px"
            onError={(error) => console.log(error)}
            image={`/api/video/${response["data"]["video_url"]}`}
          >
            <track
              label="English"
              kind="subtitles"
              srclang="en"
              src="captions/vtt/sintel-en.vtt"
              default
            />
          </CardMedia>
        );
      })
      .catch((error) => console.log(error));
  };

  return (
    <ProcessedPaper
      queueHeight={queueHeight}
      totalHeight={totalHeight}
      completedFiles={completedFiles}
      handleClick={handleClick}
    />
  );
};
