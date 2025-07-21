from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage
from django.conf import settings
import os
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
from PIL import Image
from pdf2image import convert_from_path
import logging

logger = logging.getLogger(__name__)

POPLER_BIN_PATH = r"C:\Users\shiti\Downloads\poppler\Library\bin"

class OCRView(APIView):
    def post(self, request, format=None):
        file_obj = request.FILES.get('file')
        if not file_obj:
            logger.error('No file uploaded')
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)
        logger.info(f'Received file: {file_obj.name}, content_type: {file_obj.content_type}')
        temp_path = default_storage.save(file_obj.name, file_obj)
        temp_file = os.path.join(settings.MEDIA_ROOT, temp_path)
        try:
            text = ''
            if file_obj.content_type == 'application/pdf' or file_obj.name.lower().endswith('.pdf'):
                logger.info('Processing as PDF')
                images = convert_from_path(temp_file, poppler_path=POPLER_BIN_PATH)
                for image in images:
                    text += pytesseract.image_to_string(image)
            else:
                logger.info('Processing as image')
                image = Image.open(temp_file)
                text = pytesseract.image_to_string(image)
            logger.info('OCR extraction complete')
            os.remove(temp_file)
            return Response({'text': text}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f'OCR error: {e}')
            if os.path.exists(temp_file):
                os.remove(temp_file)
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 