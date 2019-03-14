// window.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
function init() {
    const constraints = window.constraints = {
        audio: false,
        video: true
    };
    navigator.getUserMedia({audio: false, video: true},
        function (stream) {
            const video = document.querySelector("video");
            console.log(stream);
            video.srcObject = stream;
        },
        function (err) {
            console.log("The following error occurred: " + err.name);
        });
}

document.getElementById("btn").onclick = init;