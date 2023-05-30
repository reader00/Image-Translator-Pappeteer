import html
import os

# Imports the Google Cloud client libraries
from google.api_core.exceptions import AlreadyExists
from google.cloud import texttospeech
from google.cloud import translate_v3beta1 as translate
from google.cloud import vision


def pic_to_text(infile: str) -> str:
    """Detects text in an image file

    Args:
    infile: path to image file

    Returns:
    String of text detected in image
    """

    # Instantiates a client
    client = vision.ImageAnnotatorClient()

    # Opens the input image file
    with open(infile, "rb") as image_file:
        content = image_file.read()

    image = vision.Image(content=content)

    # For dense text, use document_text_detection
    # For less dense text, use text_detection
    response = client.document_text_detection(image=image)
    text = response.full_text_annotation.text
    print(f"Detected text: {text}")

    return text


img_path = 'C:\\Users\\qorya\\Downloads\\a.jpg'
pic_to_text(img_path)
