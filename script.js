let currentSong = new Audio();

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


async function getsongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(/songs/)[1])
        }
    }

    return songs
}

const playmusic = (track, pause = false) => {
    // let audio = new Audio(track)
    currentSong.src = "/songs/" + track
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
const displayLastPlayedSongInfo = ()=>{
    const lastPlayedSong = localStorage.getItem("lastPlayedSong")
    playmusic(lastPlayedSong, true); // Start with pause=true to set the audio source
    document.querySelector(".songinfo").innerHTML = decodeURI(lastPlayedSong)
}

async function main() {

    //get the list of all songs
    let songs = await getsongs()
    //console.log(songs)

    //show all the songs in playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
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
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
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
    console.log(currentSong.currentTime, currentSong.duration)
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`

})


main()

// Call function when the page is loaded to display the last played song info
window.onload = displayLastPlayedSongInfo;

