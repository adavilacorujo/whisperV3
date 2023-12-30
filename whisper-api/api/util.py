from .config import * 
from flask import jsonify, abort, current_app as app
# from jsonschema import Draft202012Validator


def allowed_file(filename):
    """
    Fetch only allowed files
    """
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def run_whisper_model(filename : str, file_id : str):
    """
    Run the model on the file provided
    """
    queue_dir = os.path.abspath(os.getenv('QUEUE_FOLDER'))
    if file_id in os.listdir(queue_dir):
        return '', False
    
    result_text = pipeline(filename, generate_kwargs={"task": "translate"})
    return result_text, True

def verify_if_exists(filename : str):
    """
    Verify if the video title already exists
    """
    for file_dir in os.listdir(upload_folder):
        dir_path = os.path.abspath(os.path.join(upload_folder, file_dir))
        if os.path.isdir(dir_path):
            if filename in os.listdir(dir_path):
                return True
    return False

def error_response(message: str, code=400):
    """
    Log error and return response with error message
    """
    app.logger.warning(message)
    response = jsonify({'message': message})
    response.status_code = code
    abort(response)


# def validate_json_request(input_json, schema):
#     """
#     Validates input_json against the required schema
#     If input is not complient with schema, will abort response with message specifying all errors
#     """
#     schema_validator = Draft202012Validator(schema)
#     errors = []
#     for error in schema_validator.iter_errors(input_json):
#         error_path = ', '.join(error.path)
#         error_message = error.message.replace('property', 'field')
#         if error_path:
#             error_message = '\'{0}\': {1}'.format(error_path, error_message)
#         errors.append(error_message)
#     if len(errors) > 0:
#         error_response(', '.join(errors))
    