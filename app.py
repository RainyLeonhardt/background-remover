from flask import Flask, request, send_from_directory
from flask_cors import CORS
import os
import cv2
import numpy as np
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = './uploads/'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return 'No file part'
    file = request.files['file']
    if file.filename == '':
        return 'No selected file'
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        if not os.path.isdir(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)
        
        # here you can call the function to remove the background from image
        remove_background(file_path, filename)

        return 'File uploaded and processed successfully'

@app.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename, as_attachment=True)

def remove_background(image_path, filename):
    # load image
    img = cv2.imread(image_path)

    # create mask with the same shape as image
    mask = np.zeros(img.shape[:2], np.uint8)

    # define background and foreground model
    bgdModel = np.zeros((1,65),np.float64)
    fgdModel = np.zeros((1,65),np.float64)

    # define rectangle for GrabCut algorithm
    rect = (50,50,450,290)

    # apply GrabCut algorithm
    cv2.grabCut(img,mask,rect,bgdModel,fgdModel,5,cv2.GC_INIT_WITH_RECT)

    # modify the mask
    mask2 = np.where((mask==2)|(mask==0),0,1).astype('uint8')

    # create an RGBA image with an alpha channel
    img_rgba = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)

    # set the alpha channel of the image based on the mask
    img_rgba[:, :, 3] = mask2 * 255

    # get base filename without extension
    base_filename = os.path.splitext(filename)[0]

    # save the result in PNG format to preserve transparency
    cv2.imwrite(os.path.join(UPLOAD_FOLDER, 'no_bg_'+base_filename + '.png'), img_rgba)

if __name__ == '__main__':
    app.run(port=5000)