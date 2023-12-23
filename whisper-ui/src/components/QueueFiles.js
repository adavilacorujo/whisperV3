import { useContext, useEffect } from "react";
import axios from "axios";
import { QueuePaper } from "./ui/Queue.js";
import { QueueHandlerContext } from "./Content.js";

const startTranslation = async (
  fileLocation,
  file_id,
  queueFiles,
  completedFiles,
  setCompletedFiles,
  setQueueFiles
) => {
  // start translation
  await axios
    .post("/api/model", {
      file: fileLocation,
      id: file_id,
    })
    .then((response) => {
      if (response.status !== 200)
        throw new Error("Not a good response", response);

      // Filter out from queue array
      setQueueFiles(queueFiles.filter((el) => el.id !== file_id));
      // Add to completed files
      setCompletedFiles([...completedFiles, response["data"]]);
      return true;
    })
    .catch((error) => {
      return false;
    });
};

export const QueueFilesComponent = ({ queueHeight }) => {
  const { queueFiles, completedFiles, setQueueFiles, setCompletedFiles } =
    useContext(QueueHandlerContext);

  useEffect(() => {
    if (queueFiles.length > 0) {
      // submit request to run model
      queueFiles.forEach((file) => {
        startTranslation(
          file["location"],
          file["id"],
          queueFiles,
          completedFiles,
          setCompletedFiles,
          setQueueFiles
        );
      });
    }
  }, [queueFiles]);

  return <QueuePaper queueHeight={queueHeight} queueFiles={queueFiles} />;
};
