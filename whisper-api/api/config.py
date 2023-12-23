import os
import torch

from dotenv import load_dotenv
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline

load_dotenv()

# Fetch .env variables
upload_folder = os.path.abspath(os.getenv('UPLOAD_FOLDER'))
metadata_file = os.path.abspath(os.getenv('METADATA_FILE'))
asr_model = os.path.abspath(os.getenv('ASR_MODEL_PATH'))

# Define extensions
ALLOWED_EXTENSIONS = {'mp4'}

# Load model in memory
device = "cuda:0" if torch.cuda.is_available() else "cpu"

torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32
whisper_model = AutoModelForSpeechSeq2Seq.from_pretrained(asr_model)
if device == "cuda:0": whisper_model = whisper_model.to_bettertransformer()

whisper_processor = AutoProcessor.from_pretrained(asr_model)

pipeline = pipeline("automatic-speech-recognition",
    model=whisper_model,
    tokenizer=whisper_processor.tokenizer,
    feature_extractor=whisper_processor.feature_extractor,
    max_new_tokens=128,
    chunk_length_s=10,  # decreasing chunk length from default '30' for better translation
    batch_size=64,  # increasing batch_size from defult '16' for better performance
    return_timestamps=True,
    torch_dtype=torch_dtype,
    device=device,
)
