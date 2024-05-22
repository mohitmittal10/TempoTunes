import React, { useEffect, useState, useRef } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Playlist from "./components/Playlist";
import Playbar from "./components/Playbar";
import "./style.css";
import "./utility.css"
import genres from "./level1.json"
const App = () => {
  const [currentSong, setCurrentSong] = useState("Nothing being played");
  const [songs, setSongs] = useState({});
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  useEffect(() => {
    // Fetch songs and albums when component mounts
    getSongs(genres);
    displayLastPlayedSongInfo();  
  }, []);

  const displayLastPlayedSongInfo = () => {
    const lastPlayedSong = localStorage.getItem("lastPlayedSong");
    if (lastPlayedSong) {
      setCurrentSong(lastPlayedSong)
    }
  };

  const getSongs = async (genres) => {
    let fetchedSongs = [];
    for (let genre of genres.genres) {
      if (genre["songs"] !== null) {
        for (let song of genre["songs"]) {
          try {
            const str = `${process.env.PUBLIC_URL}/songs/${genre["title"]}/${song["title"]}`
            console.log(str)
            let response = await fetch(str);
            if (response.ok) {
              let blob = await response.blob();
              let url = URL.createObjectURL(blob);
              fetchedSongs[song["title"]]= { genre: genre["title"], url: url, artist:song["artist"] };
            } else {
              console.error(`Failed to fetch song: ${song}`);
            }
          } catch (error) {
            console.error(`Error fetching song: ${song}`, error);
          }
        }
      }
    }
    setSongs(fetchedSongs);
  }

  const playSongByName = (songName) => {
    const song = songs[songName];
    if (song && audioRef.current) {
      audioRef.current.src = song.url;
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      console.error('Song not found or audioRef.current is null');
    }
  };
  const playMusic = (url, currentSong) => {
    console.log(`playing from ${url}`)
    console.log(audioRef.current)
    setCurrentSong(currentSong)
    localStorage.setItem("lastPlayedSong", currentSong)
    console.log(currentSong)
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.play();
    }
  };

  return (
    <div className="container flex bg-black" style={{ height: "100vh" }}>
      <Sidebar getSongs={getSongs} />
      <div className="right bg-grey rounded m-1 p-1">
        <Header />
        <Playlist playMusic={playMusic} songs={songs} />
        <Playbar
          isPlaying={isPlaying} 
          setIsPlaying = {setIsPlaying} 
          audioRef={audioRef}
          currentSong={currentSong} 
          playSongByName={playSongByName}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          duration={duration}
          setDuration={setDuration}
        />
      </div>
    </div>
  );
};

export default App;
