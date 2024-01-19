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



async function main() {
    let songs = await getsongs()
    console.log(songs)
    
    //show all the songs in playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> <img class="invert" src="music.svg" alt="">
        <div class="info">
            <div>${song.replaceAll("%20", " ").replaceAll("/", "").replaceAll("%5D", "").replaceAll("%5B", "").replaceAll(".mp3", "")}</div>
            <div>Song Artist</div>
        </div>
        <div class="playnow">
            <span>Play Now</span>
            <img class="invert" src="play.svg" alt="">
        </div>
    </li>`;
        
        
    }


    //play the first song
    var audio = new Audio(songs[0]);
   /// audio.play();

    
    audio.addEventListener("loadeddata", () => {
        let duration = audio.duration;
        console.log(duration)
        // The duration variable now holds the duration (in seconds) of the audio clip
    });

}


main()



