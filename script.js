const playPauseBtn = document.querySelector('.play-pause-btn')
const theaterBtn = document.querySelector('.theater-btn')
const fullScreenBtn = document.querySelector('.full-screen-btn')
const miniPlayerBtn = document.querySelector('.mini-player-btn')
const video = document.querySelector('video')
const videoContainer = document.querySelector('.video-container')

document.addEventListener('keydown',e => {
    const tagName = document.activeElement.tagName.toLocaleLowerCase() // Going into the document to ind the activeElement, getting tis tag name and converting it to lowercase
    
    if(tagName == 'input') return // Will not do toggle functions if you are commenting

    switch (e.key.toLocaleLowerCase()) {
        case ' ':
            if (tagName === 'button') return // If clicking on a button with tabbing and pressing space, it will not play/pause video
        case 'k':
            togglePlay()
            break // Checking if the space or k key is pressed, if it is then togglePlay is called
        
        case 'f':
            toggleFullScreenMode()
            break // Checking if the f key is pressed, if it is then full screen is toggled or untoggled
        
        case 't':
            toggleTheaterMode()
        break

        case 'i':
            toggleMiniPlayerMode()
        break
    }
}) 

// View modes

theaterBtn.addEventListener('click', toggleTheaterMode)
fullScreenBtn.addEventListener('click', toggleFullScreenMode)
miniPlayerBtn.addEventListener('click', toggleMiniPlayerMode)

function toggleTheaterMode() {
    videoContainer.classList.toggle('theater')
} // Toggles theater class to be on or off if the event listener is enabled

function toggleFullScreenMode() {
    if (document.fullscreenElement == null) {
        videoContainer.requestFullscreen() // if we are not in fullscreen mode tell the browser to enter fullscreen
    } else {
        document.exitFullscreen() //otherwise exit fullscreen
    }
}

function toggleMiniPlayerMode() {
    if (videoContainer.classList.contains('mini-player')) {
        document.exitPictureInPicture() // if we are in the mini-player mode, we want to exit out of it 
    } else {
        video.requestPictureInPicture() // otherwise enter mini-player mode
    }
}

document.addEventListener('fullscreenchange', () => {
    videoContainer.classList.toggle('full-screen', document.fullscreenElement)
}) // When fullscreen mode is changed, the full-screen class is added to the video container if the fullScreenElement is true

video.addEventListener('enterpictureinpicture', () => {
    videoContainer.classList.add('mini-player')
}) // adding mini-player class when the mini-player is enabled

video.addEventListener('leavepictureinpicture', () => {
    videoContainer.classList.remove('mini-player')
}) // removing mini-player class when the mini-player is disabled

// Play and Pause logic

playPauseBtn.addEventListener('click', togglePlay) // When I click on this button, I am going to call a function

video.addEventListener('click', togglePlay) // When I click on the entire video-container togglePlay is called

function togglePlay() {
    video.paused ? video.play() : video.pause()
} // Is the video paused? If so, call the play(), If not call the paused()

video.addEventListener('play', () => {
    videoContainer.classList.remove('paused')
}) // When I play a video, remove the paused class

video.addEventListener('pause', () => {
    videoContainer.classList.add('paused')
}) // When I play a video, add the paused class

