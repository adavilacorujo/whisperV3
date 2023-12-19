import os
import pickle

from dotenv import load_dotenv

load_dotenv()

# Fetch .env variables
upload_folder = os.path.abspath(os.getenv('UPLOAD_FOLDER'))
metadata_file = os.path.abspath(os.getenv('METADATA_FILE'))
asr_model = os.path.abspath(os.getenv('ASR_MODEL_PATH'))

# Define extensions
ALLOWED_EXTENSIONS = {'mp4'}

# Load model in memory
f = open(asr_model, 'rb')
pipeline = pickle.load(f)
f.close()