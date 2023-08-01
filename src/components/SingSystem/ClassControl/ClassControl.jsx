import React, { useState } from 'react';

import './ClassControl.css';

import sitAudioFile from '../../../static/ClassControl/sit.mp3';
import quietAudioFile from '../../../static/ClassControl/quiet.mp3';

export default function ClassControl() {

  const [isShow, setIsShow] = useState(false);
  const [sitAudio] = useState(new Audio(sitAudioFile));
  const [quietAudio] = useState(new Audio(quietAudioFile));

  function handleClick(action) {
    setIsShow(!isShow);
    if ( action === 1 ) {
      sitAudio.volume = 0.6;
      sitAudio.play();
    } else if ( action === 2 ) {
      quietAudio.volume = 0.6;
      quietAudio.play();
    }
  }

  return (
    <div className='cctrl'>
      {
        isShow &&
        <ul className='cctrl-panel'>
          <li className='cctrl-panel-item' onClick={() => handleClick(1)}></li>
          <li className='cctrl-panel-item' onClick={() => handleClick(2)}></li>
        </ul>
      }
      <div className='cctrl-btn' onClick={handleClick}></div>
    </div>
  )
}
