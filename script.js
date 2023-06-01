let canvas = document.getElementById('uploaded-image');
let context = canvas.getContext('2d');

let cropCanvas = document.getElementById('cropped-image');
let cropContext = cropCanvas.getContext('2d');

let img = new Image();
let isDrawing = false;

let rect = {};

function drawImage() {
    img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
        document.querySelector('.image-container').style.display = 'block';
        document.getElementById('processImage').style.display = 'block'; // show the button
    };
    img.src = URL.createObjectURL(document.getElementById('image-upload').files[0]);
}

document.getElementById('upload-form').addEventListener('submit', function(event) {
    event.preventDefault();
    let fileInput = document.getElementById('image-upload');
    if (fileInput.files && fileInput.files[0]) {
        drawImage();
    }
});

document.getElementById('processImage').addEventListener('click', function(e) {
    e.preventDefault();

    // Check if cropped image exists
    if (!cropCanvas.width || !cropCanvas.height) {
        console.error('No cropped image found');
        return;
    }

    // Convert cropped image on canvas to Blob
    cropCanvas.toBlob(function(blob) {
        // send the cropped image to the server
        let formData = new FormData();
        formData.append('file', blob, 'cropped.png');  // 3rd argument is filename

        fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // load the processed image into the canvas
                img.src = 'http://localhost:5000/uploads/' + data.filename;
                drawImage();
            } else {
                console.error('Error:', data.error);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
});

let scaleFactor = img.width / canvas.offsetWidth;

// canvas.addEventListener('mousedown', function(e) {
//     isDrawing = true;
//     let scaleFactor = img.width / canvas.offsetWidth;
//     rect.startX = (e.clientX - canvas.getBoundingClientRect().left) * scaleFactor;
//     rect.startY = (e.clientY - canvas.getBoundingClientRect().top) * scaleFactor;
// });

// canvas.addEventListener('mousemove', function(e) {
//     if (isDrawing) {
//         context.clearRect(0, 0, canvas.width, canvas.height); // clear canvas
//         context.drawImage(img, 0, 0, img.width, img.height); // redraw image
//         let scaleFactor = img.width / canvas.offsetWidth;
//         rect.w = ((e.clientX - canvas.getBoundingClientRect().left) * scaleFactor) - rect.startX;
//         rect.h = ((e.clientY - canvas.getBoundingClientRect().top) * scaleFactor) - rect.startY;
//         context.strokeStyle = 'red';
//         context.strokeRect(rect.startX, rect.startY, rect.w, rect.h);
//     }
// });

// canvas.addEventListener('mouseup', function() {
//     isDrawing = false;

//     if (rect.w && rect.h) {
//         document.getElementById('cropImage').style.display = 'block';
//     }
// });

canvas.addEventListener('mousedown', function(e) {
    isDrawing = true;
    let scaleFactor = img.width / canvas.offsetWidth;
    rect.startX = (e.clientX - canvas.getBoundingClientRect().left) * scaleFactor;
    rect.startY = (e.clientY - canvas.getBoundingClientRect().top) * scaleFactor;
});

canvas.addEventListener('mousemove', function(e) {
    if (isDrawing) {
        context.clearRect(0, 0, canvas.width, canvas.height); // clear canvas
        context.drawImage(img, 0, 0, img.width, img.height); // redraw image
        let scaleFactor = img.width / canvas.offsetWidth;
        rect.endX = (e.clientX - canvas.getBoundingClientRect().left) * scaleFactor;
        rect.endY = (e.clientY - canvas.getBoundingClientRect().top) * scaleFactor;

        rect.w = rect.endX - rect.startX;
        rect.h = rect.endY - rect.startY;

        let drawStartX = rect.startX;
        let drawStartY = rect.startY;
        let drawWidth = rect.w;
        let drawHeight = rect.h;

        if (rect.w < 0) {
            drawStartX = rect.endX;
            drawWidth = -rect.w;
        }
        if (rect.h < 0) {
            drawStartY = rect.endY;
            drawHeight = -rect.h;
        }

        context.strokeStyle = 'red';
        context.strokeRect(drawStartX, drawStartY, drawWidth, drawHeight);
    }
});

canvas.addEventListener('mouseup', function() {
    isDrawing = false;

    if (rect.w < 0) {
        rect.startX = rect.endX;
        rect.w = -rect.w;
    }

    if (rect.h < 0) {
        rect.startY = rect.endY;
        rect.h = -rect.h;
    }

    if (rect.w && rect.h) {
        document.getElementById('cropImage').style.display = 'block';
    }
});

document.getElementById('cropImage').addEventListener('click', function() {
    // check if there is a selected area
    if (rect.w && rect.h) {
        // create a new image data from the selected area of the original image data
        let imageData = context.getImageData(rect.startX, rect.startY, rect.w, rect.h);
        
        // adjust the size of the cropped canvas to fit the selected area
        cropCanvas.width = rect.w;
        cropCanvas.height = rect.h;
        
        // put the new image data into the cropped canvas
        cropContext.putImageData(imageData, 0, 0);
        
        // display the cropped canvas
        document.getElementById('cropped-container').style.display = 'block';
    }
});
