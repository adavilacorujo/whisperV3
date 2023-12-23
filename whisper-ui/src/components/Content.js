import { createContext, useState } from "react";

import { QueueFilesComponent } from "./QueueFiles.js";
import { ProcessedFilesComponent } from "./ProcessedFiles.js";
import { ResultsPaper } from "./ui/Results.js";

const queueHeight = 15;
const totalHeight = 60;

export const QueueHandlerContext = createContext({
  queueFiles: [],
  completedFiles: [],
  selectedFile: {
    id: "",
    filename: "",
    text: "",
    videoURL: null,
  },
  setSelectedFile: () => {},
  setQueueFiles: () => {},
  setCompletedFiles: () => {},
  setVideoDiv: () => {},
});

export const Content = ({
  queueFiles,
  setQueueFiles,
  completedFiles,
  setCompletedFiles,
}) => {
  const [selectedFile, setSelectedFile] = useState({
    id: "",
    filename: "",
    text: "",
    videoURL: null,
  });
  const [videoDiv, setVideoDiv] = useState(null);

  const queueFileHandler = {
    queueFiles: queueFiles,
    completedFiles: completedFiles,
    selectedFile: selectedFile,
    setSelectedFile: setSelectedFile,
    setQueueFiles: setQueueFiles,
    setCompletedFiles: setCompletedFiles,
    setVideoDiv: setVideoDiv,
  };
  return (
    <div style={{ padding: "2rem", display: "flex" }}>
      <QueueHandlerContext.Provider value={queueFileHandler}>
        <div
          style={{
            flexBasis: "30%",
            margin: 0,
            padding: 0,
          }}
        >
          <QueueFilesComponent queueHeight={queueHeight} />
          <ProcessedFilesComponent
            queueHeight={queueHeight}
            totalHeight={totalHeight}
          />
        </div>
        <ResultsPaper selectedFile={selectedFile} videoDiv={videoDiv} />
      </QueueHandlerContext.Provider>
    </div>
  );
};
