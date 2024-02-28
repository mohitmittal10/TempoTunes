let currentSong = new Audio();
let songs
let currFolder
let folder
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getsongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    // let a = await fetch(`/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1].replaceAll("/", ""))
        }
    }

    //show all the songs in playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> <img class="invert" src="music.svg" alt="">
         <div class="info">
         <div>${song.replaceAll("%20", " ").replaceAll("/", "").replaceAll("%5D", "").replaceAll("%5B", "")}</div>
         <div>Song Artist</div>
         </div>
         <div class="playnow">
             <span>Play Now</span>
             <img class="invert" src="play.svg" alt="">
         </div>
     </li>`;
    }

    // atttach an event listner to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            ////console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    return songs
}

const playmusic = (track, pause = false) => {
    // let audio = new Audio(track)

    currentSong.src = `/${currFolder}/` + track

    if (!pause) {
        currentSong.play()
        play.src = "pause.svg"
        document.querySelector(".songinfo").innerHTML = decodeURI(track)  ///display song name

        // Save the current song information in localStorage
        localStorage.setItem("lastPlayedSong", track);
    }

    document.querySelector(".songtime").innerHTML = "00:00/00:00"   ///display initial song time i.e. 00:00/00:00
}


//function to retrieve the last played song from the local storage of browser
const displayLastPlayedSongInfo = () => {
    const lastPlayedSong = localStorage.getItem("lastPlayedSong")
    playmusic(lastPlayedSong, true); // Start with pause=true to set the audio source
    document.querySelector(".songinfo").innerHTML = decodeURI(lastPlayedSong)
}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5500/songs/`)
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];


        ////console.log(e.href)
        if (e.href.includes("/songs/")) {
            //console.log(e.href.split("/").slice(-2)[1])
            let folder = e.href.split("/").slice(-2)[1]; // Get the folder name
            //get the metadaata of the folder
            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
            let response = await a.json();
            //console.log(response)

            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card rounded">
            <div class="play">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="12" fill="#4CAF50" />
                    <path
                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                        stroke="#141B34" stroke-width="1.5" stroke-linejoin="round" />
                </svg>
            </div>
            <img src="http://127.0.0.1:5500/songs/${folder}/cover.jpeg" alt="" />
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`

            // load the playlist whenever card is clicked 
            Array.from(document.getElementsByClassName("card")).forEach(e => {
                //console.log(e)
                e.addEventListener("click", async item => {
                    songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
                    
                    document.querySelector(".left").style.left = 0+ "%"
                })
            })

        }
    }

}



async function main() {



    displayAlbums()
    //get the list of all songs
    songs = await getsongs("songs/${folder}")
    ////console.log(songs)


}

// attach event listner to play, next and previous
play.addEventListener("click", () => {
    if (currentSong.paused) {
        currentSong.play()
        play.src = "pause.svg"
    }
    else {
        currentSong.pause()
        play.src = "play.svg"
    }
})

//listen for time update event
currentSong.addEventListener("timeupdate", () => {
    //console.log(currentSong.currentTime, currentSong.duration)
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
    document.querySelector(".circle").style.left = currentSong.currentTime / currentSong.duration * 100 + "%"
})

//add an event listner to seekbar
document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
    document.querySelector(".circle").style.left = percent + "%"
    currentSong.currentTime = ((currentSong.duration) * percent) / 100
})

//add event listner to hamburger
document.querySelector(".hamburger").addEventListener("click", e => {
    document.querySelector(".left").style.left = 0 + "%"

})


// Function to hide or show the close button based on viewport width
function toggleCloseButtonVisibility() {
    const closeButton = document.querySelector(".close");
    if (window.innerWidth > 768) {
        closeButton.style.display = "none"; // Hide the close button
    } else {
        closeButton.style.display = "block"; // Show the close button
    }
}

//event listner to close hamburger
document.querySelector(".close").addEventListener("click", e => {
    document.querySelector(".left").style.left = -150 + "%"
})

// Listen for changes in viewport width
window.addEventListener("resize", toggleCloseButtonVisibility);

// Initial call to set close button visibility when the page loads
toggleCloseButtonVisibility();

//add event listner to previous 
previous.addEventListener("click", () => {
    //console.log(currentSong.src)
    //console.log(currentSong.src.split("/")[4])
    //  //console.log(songs)
    // //console.log(songs.indexOf(currentSong.src.split("/")[4]))
    currentSong.pause()
    // Get the index of the current song in the songs array
    const currentIndex = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    // Calculate the index of the previous song
    ////   const previousIndex = (currentIndex - 1 + songs.length) % songs.length;
    //play prev song
    ////   if(currentIndex!=0){
    ////   playmusic(songs[previousIndex])
    ////   }
    ////console.log(currentIndex)
    if ((currentIndex - 1) >= 0) {
        playmusic(songs[currentIndex - 1])
    }
    ////console.log(currentSong.src.split("/").slice(-1)[0])
})

//add event listner to next 
next.addEventListener("click", () => {
    currentSong.pause()
    // Get the index of the current song in the songs array
    const currentIndex = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    //get the index of next song
    //// const nextIndex = (currentIndex+1)%songs.length
    //play next song
    //// if(currentIndex!=songs.length-1){
    ////     playmusic(songs[nextIndex])
    //// }
    if ((currentIndex + 1) < songs.length) {
        playmusic(songs[currentIndex + 1])
    }

})

//add event listner to volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    //console.log(e,e.target,e.target.value)
    currentSong.volume = parseInt(e.target.value) / 100
})





main()

// Call function when the page is loaded to display the last played song info
window.onload = displayLastPlayedSongInfo;

