import React from "react";

const Playlist = ({ songs, playMusic }) => {
  console.log(songs)
  return (
    <div className="spotifyPlaylist">
      <h1>Tempo Playlist</h1>
      <div className="cardContainer">
        {Object.keys(songs).map((song, index) => (
          <div key={index} className="card rounded" onClick={() => playMusic(songs[song].url, song)}>
            <img src="music.svg" alt="" className="invert" style={{
              height:"20px",
              width:"20px"
            }}/>
            <div className="info" style={{
              height:"250px",
            
            }}>
              <div style={{
                fontSize:"20px"
              }}>{song}</div>
              <div style={{
                fontSize:"15px",
                color:"grey"
              }}>{songs[song]["artist"]}</div>
              <div>{songs[song]["genre"]}</div>
            </div>
            <div className="playnow" style={{
              position:"absolute",
              height:"30px",
              width:"30px",
              bottom:"10%"
            }}>
              <div style={{
                display:"flex",
                flexDirection:"row"
              }}>
                <span>Play Now</span>
                <img src="play.svg" alt="" className="invert" />
              </div>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlist;
