import { useContext } from "react";
import axios from "axios";

import ReactPlayer from 'react-player'
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
        console.log("response", response);
        setSelectedFile({
          id: response["data"]["results"]["id"],
          filename: response["data"]["filename"],
          text: response["data"]["results"]["result"]["text"],
          videoURL: response["data"]["video_url"],
        });
        setVideoDiv(
          <ReactPlayer
            controls
            component="video"
            alt="text video"
            height="400px"
            width="100%"
            onError={(error) => console.log(error)}
            url={`/api/video/${response["data"]["video_url"]}`}
            config={{
              file: {
                attributes: {
                  crossOrigin: "anonymous"
                },
                tracks: [
                  {
                    kind: "subtitles",
                    src: `/api/srt/${response["data"]["results"]["id"]}`,
                    srcLang: "en",
                    default: true,
                    mode: "showing"
                  },
                ]
              }
            }}
          />
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
