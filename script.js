const playPauseBtn = document.querySelector('.play-pause-btn')
const theaterBtn = document.querySelector('.theater-btn')
const fullScreenBtn = document.querySelector('.full-screen-btn')
const miniPlayerBtn = document.querySelector('.mini-player-btn')
const muteBtn = document.querySelector('.mute-btn')
const captionsBtn = document.querySelector('.captions-btn')
const speedBtn = document.querySelector('.speed-btn')
const currentTimeElement = document.querySelector('.current-time')
const totalTimeElement = document.querySelector('.total-time')
const volumeSlider = document.querySelector('.volume-slider')
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

        case 'm':
            toggleMute()
        break

        case 'arrowLeft':
        case 'j':
            skip(-5)
        break

        case 'arrowRight':
        case 'l':
            skip(+5)
        break

        // case 'c':
        //     toggleCaptions()
        // break;
    }
}) 

// Playback Speed
speedBtn.addEventListener('click', changePlaybackSpeed)

function changePlaybackSpeed() {
    let newPlaybackRate = video.playbackRate + .25 // adding on .25 to the video playback rate
    if (newPlaybackRate > 2) newPlaybackRate = 0.25 // if the video playback rate is above 2, set it back to .25
    video.playbackRate = newPlaybackRate // video playbackRate is set to the newPlayback rate
    speedBtn.textContent = `${newPlaybackRate}x` // show the play back rate by setting it to the text content on the speed btn
}

// Captions
// const captions = video.textTracks[0]
// captions.mode = 'hidden' // Get the first text track (our captions) and set the mode to hidden so it is not visible by default

// captionsBtn.addEventListener('click', toggleCaptions) 

// function toggleCaptions() {
//     const isHidden = captions.mode === 'hidden' // setting captions mode if it is hidden to the variable isHidden
//     captions.mode = isHidden ? 'showing' : 'hidden' // if the first text track mode is hidden, then set to showing, otherwise keep hidden
//     videoContainer.classList.toggle('captions', isHidden) // if isHidden is true then toggle the caption class on the video container class list
// }

// Duration
video.addEventListener('loadeddata', () => {
    totalTimeElement.textContent = durationFormat(video.duration)
}) // Plugs video duration into durationFormat function to output a Math.floor duration

video.addEventListener('timeupdate', () => {
    currentTimeElement.textContent = durationFormat(video.currentTime)
}) // timeupdate function gets called everytime the time is updated, and when it is the text content is replaced by the current time

const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2
}) // Always 2 digits present, leads with 0 if less than 10

function durationFormat(time) {
    const seconds = Math.floor(time % 60)
    const minutes = Math.floor(time / 60) % 60
    const hours = Math.floor(time / 3600)

    if (hours === 0) {
        return `${minutes}:${leadingZeroFormatter.format(seconds)}`
    } else {
        return `${hours}:${leadingZeroFormatter.format(minutes)}:${leadingZeroFormatter.format(seconds)}`
    }
}

function skip(duration) {
    video.currentTime += duration
}

// Volume 
muteBtn.addEventListener('click', toggleMute) // When clicking the mute button, toggleMute is called
volumeSlider.addEventListener('input', event => {
    video.volume = event.target.value 
    video.muted = event.target.value === 0 // If the slider value is 0, video is muted
})

function toggleMute() {
    video.muted = !video.muted
} // Video muted property is swapped

video.addEventListener('volumechange', () => {
    volumeSlider.value = video.volume
    let volumeLevel
    if (video.muted || video.volume === 0) {
        volumeSlider.value = 0 // If the video is muted, the slider value is all the way to the left
        volumeLevel = "muted"
    } else if (video.volume >= 0.5) {
        volumeLevel = "high"
    } else {
        volumeLevel = "low"
    }

    videoContainer.dataset.volumeLevel = volumeLevel
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

