import React from 'react';
import ShakaPlayer from 'shaka-player-react';
import 'shaka-player-react/dist/controls.css';

export default function VideoPlayer({ source, modal1Open }) {
  return (
    <>
      {modal1Open && <ShakaPlayer autoPlay src={source} />}
    </>
  );
}