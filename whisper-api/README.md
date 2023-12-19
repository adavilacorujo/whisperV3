# Whisper API

This API exposes the WhisperV3 model through multiple endpoints.

## Routes

#### Upload

- `/upload` - upload handler for receiving an mp4 file

Given a file the API verifies if the file is already uploaded. If it is, is sends a CONFLICT status code (409). If file has not been uploaded before it creates a new UUID for the file, and a directory under the UUID simulating a DB. It proceeds to store the video file under `db/file_id/file_name.mp4`.

Upon saving the file the route adds the uploaded file's metadata to a pickle file. Metadata added contains:

- `size` - file size
- `location` - file location
- `id` - file id
- `model` - intended model to use
- `model_ran` - flag to delineate between files passed through the pipeline
- `upload_date` - datetime object for the given date

The route returns all this data as well in the response.

#### Model

- `/model` - schedule handler for requesting a transcription

Instead of running the model once the user uploads the file, the app places the file into a queue in the UI and then calls this route to schedule a job. The route accepts the file path and its UUID. Once the model is ran it appends to its metadata with simple metrics:

- `time` - time taken to run model
- `model_ran` - flag to delineate between files passed through the pipeline set to True
- `model_date` - datetime object when the model was ran

The route returns all the metadata.

#### Uploads

- `/uploads` - fetch list of uploaded files

Route to pull the app's history. Each time a model is ran, or a file is uploaded, a new entry is appended to the metadata pickle file. This route reads the file and sends a response containing a list of objects containing the metadata for each uploaded file.

#### Results

- `/results/<string:/id>` - result fetcher for a given UUID

Route sends the results for a given UUID. If the model has not been ran on the file with the UUID it returns a 404 since it can't find the `results.json` file that contains the results.

#### Video

- `/<string:id>/<string:video>` - video fetcher given a UUID and file name

Maybe a user wants to see the video as well. Route returns a blob (mp4) given a UUID using Flasks send_file function.
