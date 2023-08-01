import React, { useState, useEffect } from 'react'
import PubSub from 'pubsub-js';

import './SongControl.css';

export default function SongControl() {

  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);

  // 控制歌曲播放
  function handlePlay() {
    if(isAudioLoaded) {
      setIsPlaying(!isPlaying);
    }
  }

  // 控制歌曲快进快退
  function handleBackward() {
    PubSub.publish('audioControl', -5);
  }

  function handleForward() {
    PubSub.publish('audioControl', 5);
  }

  // 发布播放状态
  useEffect(() => {
    PubSub.publish('isPlaying', isPlaying);
  }, [isPlaying]);

  useEffect(() => {
    let token = PubSub.subscribe('isAudioLoaded', (msg, isLoaded) => {
      setIsAudioLoaded(isLoaded);
    });
    let token2 = PubSub.subscribe('playEnded', (msg, isPlaying) => {
      setIsPlaying(isPlaying);
    });
    let token3 = PubSub.subscribe('resetAudio', () => {
      setIsPlaying(false);
    });

    return () => {
      PubSub.unsubscribe(token);
      PubSub.unsubscribe(token2);
      PubSub.unsubscribe(token3);
    };
  }, []);

  return (
    <div className='sc'>
        <button className='sc-backward sc-progressFn' onClick={handleBackward}></button>
        <button className={isPlaying ? 'sc-pause sc-ctrl-btn' : 'sc-play sc-ctrl-btn'} onClick={handlePlay}></button>
        <button className='sc-forward sc-progressFn' onClick={handleForward}></button>
    </div>
  )
}
