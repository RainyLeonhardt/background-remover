# background-remover

Background Remover Application
The Background Remover is a web-based application that allows users to remove the background of images. Users can upload images, then select a specific region within the image, and the app will then process the image to remove the background in that selected region.

This application is built with Flask, JavaScript, HTML, and CSS, with the main image processing done using OpenCV in Python.

Features
Image Upload: Users can upload images in various formats (png, jpg, jpeg, gif).
Image Selection: Users can select a specific region within the uploaded image.
Background Removal: The application will remove the background in the selected region of the image.
Download Processed Image: Users can then download the processed image.
How to Run Locally
Clone the repository to your local machine.
Install the necessary Python dependencies. These include flask, flask_cors, cv2, numpy, and werkzeug.
Start the Flask application by running the main Python script.
Open a web browser and go to localhost:5000 to access the application.
Start uploading and processing your images!
How to Use
Click on the "Select Image" button to choose the image you want to upload.
Once an image is selected, it will be displayed in the image container on the page.
Click and drag on the image to select the area you want to remove the background from. The selected area will be displayed with a red outline.
Click the "Process Image" button to remove the background in the selected area.
The processed image will be displayed in a new image container below. From there, you can download the processed image.
Tech Stack
Frontend: HTML, CSS, JavaScript
Backend: Python (Flask, OpenCV)
Infrastructure: Flask application

![UI1](https://github.com/RainyLeonhardt/background-remover/assets/55123523/e921e644-a452-426d-93b0-4221a3bb007f)
![UI2](https://github.com/RainyLeonhardt/background-remover/assets/55123523/e60b2fed-e692-4283-b733-176fc444dc65)
![UI3](https://github.com/RainyLeonhardt/background-remover/assets/55123523/91f30db8-845d-479c-85db-f395fbd5b48d)
![UI4](https://github.com/RainyLeonhardt/background-remover/assets/55123523/e7268bab-35f6-478a-b56f-a9fc90393766)
![cropped](https://github.com/RainyLeonhardt/background-remover/assets/55123523/9665d1db-c6f4-4cf8-99a3-404069e4c447)
![no_bg_cropped](https://github.com/RainyLeonhardt/background-remover/assets/55123523/9f8a9930-e6c3-4aa3-9706-8da3cfe24996)
