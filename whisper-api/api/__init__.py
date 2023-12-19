"""
Flask API serving OpenAI's Whisper v3 capabilities, ie automatic-speec-recognition (asr)
The API also leverages models such as _, _ for summarization and entity-recognition, respectively.
All models are pulled from Huggingface.

__author__: Andres Davila
__version__: 0.1
"""
import json
import time

from uuid import uuid4
from flask_cors import CORS
from datetime import datetime
from werkzeug.utils import secure_filename
from flask import Flask, request, send_file, make_response, jsonify, abort

from .util import *
from .logs import *
from .config import * 

whisper_app = Flask(__name__)
whisper_app.config['UPLOAD_FOLDER'] = upload_folder
whisper_app.secret_key = 'super secret key'
CORS(whisper_app)

@whisper_app.route('/upload', methods=['GET','POST'])
def submit():
    """
    Upload handler for uploading an mp4
    """
    if request.method == 'POST':
        input_schema = {
            "required": [
                "file"
            ], "properties": {
                "file": {"type": "object"}
            }
        }

        # request_json = request.get_json()
        # validate_json_request(request_json, input_schema)

        # check if the post request has the file part
        if 'file' not in request.files:
            myResponse = make_response('no file present')
            myResponse.ok = False
            myResponse.status_code = 204
            whisper_app.logger.info('%s - %s - no file present', request.method, request.url)
            return myResponse
        file = request.files['file']
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            myResponse = make_response('empty file name')
            myResponse.status_code = 204
            myResponse.ok = False
            whisper_app.logger.info('%s - %s - empty file name', request.method, request.url)

            return myResponse
        if file and allowed_file(file.filename):
            file_id = str(uuid4())
            filename = secure_filename(file.filename)

            if verify_if_exists(filename):
                return abort(409, {"error": 'file already uploaded'})

            file_dir = os.path.join(whisper_app.config['UPLOAD_FOLDER'], file_id)
            os.mkdir(file_dir)

            file_path = os.path.join(file_dir, filename)
            # Maybe save to database?
            file.save(file_path)

            file_stats = os.stat(file_path)
            file_size = file_stats.st_size / (1024 * 1024)

            whisper_app.logger.info('%s - %s - %s -  %sMB', request.method, request.url, file_path, file_size)

            response_json = {
                'size': file_size,
                'location': os.path.abspath(file_path),
                'id': file_id,
                'model': 'openai/whisper-large-v3',
                'model_ran': False,
                'upload_date': datetime.now()
            }

            # write metadata to file
            try:
                f = open(metadata_file, 'rb')
                metadata = pickle.load(f)
            except FileNotFoundError:
                f = open(metadata_file, 'x')
                metadata = []
            finally:
                f.close()

            metadata.append(response_json)
            f = open(metadata_file, 'wb')
            pickle.dump(metadata, f)
            f.close()
            metadata.append(response_json)
            return jsonify(response_json)
    else: 
        myResponse = make_response('method not allowed')
        myResponse.status_code = 405
        myResponse.ok = False
        return myResponse

@whisper_app.route('/model', methods=['POST'])
def upload():
    """
    Handler for requesting a transcription
    """
    if request.method == 'POST':
        input_schema = {
            "required": [
                "file",
                "id"
            ], "properties": {
                "file": {"type": "string"},
                "id": {"type": "string"}
            }
        }

        request_json = request.get_json()
        # validate_json_request(request_json, input_schema)

        file_path = request_json.get('file')
        file_id = request_json.get('id')

        whisper_app.logger.info('%s - %s - model request - %s', request.method, request.url, file_path)
        start_time = time.time()
        whisper_app.logger.info('translating - %s', file_id)
        text, flag = run_whisper_model(file_path, file_id)

        if not flag:
            whisper_app.logger.info('model request already in queue %s - %s', file_path, file_id)
            abort(409, 'Already in queue')

        end_time = time.time() - start_time
        whisper_app.logger.info('translated - %s - %s seconds', file_id, end_time)

        # add to metadata
        f = open(metadata_file, 'rb')
        metadata = pickle.load(f)
        model_data = list(filter(lambda x: x.get('id', '') == file_id, metadata))[0]
        temp_model_data = model_data
        f.close()

        model_data["time"] = end_time
        model_data["model_ran"] = True
        model_data["model_date"] = datetime.now()

        # rewrite to file
        metadata = [model_data if  item == temp_model_data else item for item in metadata]
        f = open(metadata_file, 'wb')
        pickle.dump(metadata, f)
        f.close()

        # write text to file 
        f = open(os.path.join(upload_folder, file_id, 'results.json'), 'w')
        json_temp = model_data
        # json_temp['result'] = text4
        json.dump(json_temp, f, default=str)
        f.close()

        return jsonify(model_data)

@whisper_app.route('/uploads', methods=['GET'])
def uploads():
    """
    Get list of uploaded files

    Return:
        - (list), list of objects containing metadata for each file uploaded
    """
    try:
        f = open(metadata_file, 'rb')
        metadata = pickle.load(f)
        f.close()
    except FileNotFoundError:
        metadata = []

    return jsonify(metadata)

@whisper_app.route('/results/<string:id>', methods=['GET'])
def results(id : str):
    """
    Get result for a given model

    Args:
        - id (str), file id to query
    
    Return:
        - (dict), dictionary containing results from the pipeline
    """
    f = open(metadata_file, 'rb')
    metadata = pickle.load(f)
    try:
        model_data = list(filter(lambda x: x.get('id', '') == id, metadata))[0]
    except IndexError:
        abort(404, 'no record with that id')
    finally:
        f.close()

    data_path = os.sep.join(model_data["location"].split(os.sep)[:-1])
    results_path = os.path.join(data_path, 'results.json')

    if os.path.exists(results_path):
        return jsonify({
            'video_url': os.sep.join(model_data["location"].split(os.sep)[-2:]),
            'results': json.load(open(results_path, 'r')),
            'filename': model_data["location"].split(os.sep)[-1],
        })
    else: abort(404, 'Model has not been ran on this file. Send request to /model to schedule the model.')

@whisper_app.route('/<string:id>/<string:video>', methods=['GET'])
def video(id : str, video : str):
    """
    Get video from API per id

    Args:
        - video (str), path of file to query

    Return:
        - (blob), video object
    """
    video_path = os.path.abspath(os.path.join(upload_folder, id, video))
    return send_file(video_path, mimetype='video' + video_path.split('.')[-1])
