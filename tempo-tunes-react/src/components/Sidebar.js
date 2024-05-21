import React from "react";

const Sidebar = ({ getSongs }) => {
  return (
    <div className="left">
      <div className="home bg-grey rounded m-1 p-1">
        <div className="close">
          <img className="invert" src="close.svg" alt="" />
        </div>
        <div className="logo m-1 flex">
          <img className="invert" src="logo.svg" alt="" />
          <h1>TempoTunes</h1>
        </div>
        <ul>
          <li className="m-1">
            <img className="invert" src="home.svg" alt="home" />Home
          </li>
          <li className="m-1">
            <img className="invert" src="search.svg" alt="search" />search
          </li>
        </ul>
      </div>
      <div className="library bg-grey rounded m-1 p-1">
        <div className="heading">
          <img src="playlist.svg" alt="" />
          <h2>Your library</h2>
        </div>
        <div className="songList">
          <ul></ul>
        </div>
        <div className="footer">
          <div>
            <a href="https://www.spotify.com/jp/legal/"><span>Legal</span></a>
          </div>
          <div>
            <a href="https://www.spotify.com/jp/privacy/"><span>Privacy Center</span></a>
          </div>
          <div>
            <a href="https://www.spotify.com/jp/legal/privacy-policy/"><span>Privacy Policy</span></a>
          </div>
          <div>
            <a href="https://www.spotify.com/jp/legal/cookies-policy/"><span>Cookies</span></a>
          </div>
          <div>
            <a href="https://www.spotify.com/jp/legal/privacy-policy/#s3"><span>About Ads</span></a>
          </div>
          <div>
            <a href="https://www.spotify.com/jp/accessibility/"><span>Accessibility</span></a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
