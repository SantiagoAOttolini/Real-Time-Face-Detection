const video = document.getElementById("video");

//Expressions
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceExpressionNet.loadFromUri("/models"),
]).then(startVideo);

//Start camera
function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    (stream) => (video.srcObject = stream),
    (err) => console.log(err)
  );
}

//Detection expressions
video.addEventListener("play", () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    const detection = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    const resizeDetections = faceapi.resizeResults(detection, displaySize);
    //clear the square of img
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    //Detect movements and follow it
    faceapi.draw.drawDetections(canvas, resizeDetections);
    //Draw lines into the face
    faceapi.draw.drawFaceLandmarks(canvas, resizeDetections)
    //Detect your emotional face (Surpirse, neutral, etc...)
    faceapi.draw.drawFaceExpressions(canvas, resizeDetections)
  }, 100);
});
