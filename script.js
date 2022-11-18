const playPauseBtn = document.querySelector('.play-pause-btn')
const theaterBtn = document.querySelector('.theater-btn')
const fullScreenBtn = document.querySelector('.full-screen-btn')
const miniPlayerBtn = document.querySelector('.mini-player-btn')
const muteBtn = document.querySelector('.mute-btn')
const captionsBtn = document.querySelector('.captions-btn')
const speedBtn = document.querySelector('.speed-btn')
const currentTimeElement = document.querySelector('.current-time')
const totalTimeElement = document.querySelector('.total-time')
const previewImg = document.querySelector('.preview-img')
const thumbnailImg = document.querySelector('.thumbnail-img')
const volumeSlider = document.querySelector('.volume-slider')
const video = document.querySelector('video')
const videoContainer = document.querySelector('.video-container')
const timelineContainer = document.querySelector('.timeline-container')

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

// Timeline

timelineContainer.addEventListener('mousemove', handleTimelineUpdate)
timelineContainer.addEventListener('mousedown', toggleScrubbing)
document.addEventListener('mouseup', event => {
    if (isScrubbing) toggleScrubbing(event)
}) // if we are in the act of scrubbing we only want the document event listeners to fire

document.addEventListener('mousemove', event => {
    if (isScrubbing) handleTimelineUpdate(event)
}) // We only want to handle the time line update if we are currently scrubbing

let isScrubbing = false
let wasPaused
function toggleScrubbing(event) {
    const rectangle = timelineContainer.getBoundingClientRect() // get rectangle within timeline container and set it to a variable
    const percent = Math.min(Math.max(0, event.x - rectangle.x), rectangle.width) / rectangle.width // Clamped between two values, get the x position of the mouse and get the x position of the timeline and subtract both values giving us the x position within the timeline by taking into account any spacing between the timeline and the page. Rectangle.width is the farthest right position, while 0 is the farthest left position. All divided by the timeline width to give a percentage
    
    isScrubbing = (event.buttons & 1) === 1 // binary version of which buttons are being pressed, if the value returns 1 then the left button the mouse is being pressed

    videoContainer.classList.toggle('scrubbing', isScrubbing) // toggle class scrubbing if isScrubbing is true

    if (isScrubbing) {
        wasPaused = video.paused // setting paused video state to a variable
        video.pause() // pause video if scrubbing is true
    } else {
        video.currentTime = percent * video.duration // Move video to the position where the mouse was let go after scrubbing
        if (!wasPaused) video.play() // When scrubbing is done, video will continue playing
    }

    handleTimelineUpdate(event) // when scrubbing starts, call handleTimelineUpdate 
}

function handleTimelineUpdate(event) {
    const rectangle = timelineContainer.getBoundingClientRect() // get rectangle within timeline container and set it to a variable
    const percent = Math.min(Math.max(0, event.x - rectangle.x), rectangle.width) / rectangle.width // Clamped between two values, get the x position of the mouse and get the x position of the timeline and subtract both values giving us the x position within the timeline by taking into account any spacing between the timeline and the page. Rectangle.width is the farthest right position, while 0 is the farthest left position. All divided by the timeline width to give a percentage
    const previewImgNumber = Math.max(1, Math.floor((percent * video.duration) / 10)) // Takes our percent and outputs a number based on the video duration in intervals of 10
    const previewImgSrc = `assets/previewImages/previewImage${previewImgNumber}.jpg` // Takes the outputted number in previewImageNumber and plugs it into a variable
    previewImg.src = previewImgSrc // setting the preview image source (src='') to the variable declared above called previewImgSrc
    timelineContainer.style.setProperty('--preview-position', percent)

    if (isScrubbing) {
        event.preventDefault()
        thumbnailImg.src = previewImgSrc
        timelineContainer.style.setProperty('--progress-position', percent)
    }
}

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

    const percent = video.currentTime / video.duration
    timelineContainer.style.setProperty('--progress-position', percent) // moves red bar along 
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

