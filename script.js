const playPauseBtn = document.querySelector('.play-pause-btn')
const video = document.querySelector('video')
const videoContainer = document.querySelector('.video-container')

document.addEventListener('keydown',e => {
    switch (e.key.toLocaleLowerCase()) {
        case ' ':
        case 'k':
            togglePlay()
            break
    } //Checking if the space or k key is pressed, if it is then togglePlay is called
}) 

//Play and Pause logic

playPauseBtn.addEventListener('click', togglePlay) //When I click on this button, I am going to call a function

video.addEventListener('click', togglePlay) //When I click on the entire video-container togglePlay is called

function togglePlay() {
    video.paused ? video.play() : video.pause()
} //Is the video paused? If so, call the play(), If not call the paused()

video.addEventListener('play', () => {
    videoContainer.classList.remove('paused')
}) //When I play a video, remove the paused class

video.addEventListener('pause', () => {
    videoContainer.classList.add('paused')
}) //When I play a video, add the paused class

