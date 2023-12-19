import os
import logging

try:
    LOGGER_FILE = os.path.abspath(os.path.abspath(os.getenv('WHISPER_API_LOG_FILE')))
except FileNotFoundError:
    with open(os.path.abspath(os.getenv('WHISPER_API_LOG_FILE')), 'x'):
        pass

logging.basicConfig(filename=LOGGER_FILE, filemode='a', format='%(asctime)s - %(message)s', level=logging.DEBUG)
