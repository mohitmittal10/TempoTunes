import React, { useEffect, useState } from "react";
import { secondsToMinutesSeconds } from "./helpers";

const Playbar = ({ currentSong, audioRef, isPlaying, setIsPlaying, playSongByName, currentTime, setCurrentTime, duration, setDuration }) => {
  

  
  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        
        audioRef.current.pause();
      } else {
        playSongByName(currentSong)
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const updateTime = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };
  const handleSeek = (e) => {
    if (audioRef.current) {
      const seekTime = (e.target.value / 100) * duration;
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };
  const secondsToMinutesSeconds = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', updateTime);
      audioRef.current.addEventListener('loadedmetadata', updateTime);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateTime);
        audioRef.current.removeEventListener('loadedmetadata', updateTime);
      }
    };
  }, []);
  return (
    <div className="playbar">
        <audio ref={audioRef} />
        <input
            className="seekbar invert"
            type="range"
            min="0"
            max="100"
            value={(currentTime / duration) * 100 || 0}
            onChange={handleSeek}
          />
        <div className="songinfo">{currentSong}</div>
        <div className="songtime">
          {secondsToMinutesSeconds(currentTime)}/{secondsToMinutesSeconds(duration)}
        </div>
        <div className="songbutton invert">
          <img id="previous" src="prevsong.svg" alt="" />
          <img id="play" src={isPlaying ? "pause.svg" : "play.svg"} alt="" onClick={handlePlayPause} />
          <img id="next" src="nextsong.svg" alt="" />
          <div className="volume invert">
            <img className="invert" id="volume" src="volume.svg" alt="" />
            <div className="range">
              <input className="invert" type="range" name="volume" onChange={(e) => audioRef.current.volume = (e.target.value)/100} />
            </div>
          </div>
        </div>
      </div>

  );
};

export default Playbar;
