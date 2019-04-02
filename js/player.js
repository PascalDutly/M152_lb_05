document.addEventListener("DOMContentLoaded", function () {
    startplayer();
}, false);
var player;

function startplayer() {
    player = document.getElementById('video_player');
    player.controls = false;
}

function play_vid() {
    player.play();
}

function pause_vid() {
    player.pause();
}

function stop_vid() {
    player.pause();
    player.currentTime = 0;
}

function change_vol() {
    player.volume = document.getElementById("change_vol").value;
}

function mute() {
    player.volume = 0;
}

function changeSpeed(speed) {
    player.playbackRate = speed;
}

function fullscreen() {
    if (player.requestFullscreen) {
        player.requestFullscreen();
    } else if (player.mozRequestFullScreen) { /* Firefox */
        player.mozRequestFullScreen();
    } else if (player.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        player.webkitRequestFullscreen();
    } else if (player.msRequestFullscreen) { /* IE/Edge */
        player.msRequestFullscreen();
    }
}
