import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom';
import PubSub from 'pubsub-js';

import SongInfo from './SongInfo/SongInfo.jsx';
import AudioFn from './AudioFn/AudioFn.jsx';
import Lyrics from './Lyrics/Lyrics.jsx';
import SongControl from './SongControl/SongControl.jsx';
import ClassControl from '../ClassControl/ClassControl.jsx';

import './SingPanel.css';

import wave1 from '../../../static/SingSystem/singPanel/wave1.png';
import wave2 from '../../../static/SingSystem/singPanel/wave2.png';

export default function SingPanel(props) {

  // 音频加载处理
  const [isPlaying, setIsPlaying] = useState(false);

  // 音频引用
  const audioRefWithVocal = useRef(null);
  const audioRefInstrumental = useRef(null);
  const [songMode, setSongMode] = useState(0); // 0: 原曲带唱 1：歌词跟随（伴奏）

  // 组件基本状态
  const [mode, setMode] = useState(props.location.state.mode); //sing panel模式 —— 0:聆听模式，1: 节奏学习 2: 歌词学习 3: 歌曲演唱
  const [songInfo, setSongInfo] = useState(
    props.location.state.songInfo
  )
  const [scoreOpened, setScoreOpened] = useState(false);

  // 音频加载处理
  useEffect(() => {
    let lodedSongCount = 0;

    import(`../../../static/SingSystem/songResource/${props.location.state.songInfo.sourceTag}/song.mp3`)
      .then(audio => {
        audioRefWithVocal.current.src = audio.default;
        audioRefWithVocal.current.load();
        audioRefWithVocal.current.addEventListener('loadeddata', () => {
          lodedSongCount++;
          if (lodedSongCount === 2) {
            PubSub.publish('isAudioLoaded', true); // 在音频加载完成后，将歌曲的状态发布出去，以供 AudioFn 使用
          }
        });
      });
    import(`../../../static/SingSystem/songResource/${props.location.state.songInfo.sourceTag}/instrumental.mp3`)
      .then(audio => {
        audioRefInstrumental.current.src = audio.default;
        audioRefInstrumental.current.load();
        audioRefWithVocal.current.addEventListener('loadeddata', () => {
          lodedSongCount++;
          if (lodedSongCount === 2) {
            PubSub.publish('isAudioLoaded', true); // 在音频加载完成后，将歌曲的状态发布出去，以供 AudioFn 使用
          }
        });
      });
    // 加载歌曲曲谱
	if(props.location.state.type !== 1){
		import(`../../../static/SingSystem/songResource/${props.location.state.songInfo.sourceTag}/score.jpg`)
		  .then(score => {
		    setSongInfo({
		      ...songInfo,
		      score: score.default
		    });
		  })
	}
  }, []);

  // 处理歌曲播放
  useEffect(() => {
    // 控制歌曲播放（控制消息来自SongControl）
    let token1 = PubSub.subscribe('isPlaying', (msg, isPlaying) => {
      if (isPlaying) {
        audioRefWithVocal.current.play();
        audioRefInstrumental.current.play();
        setIsPlaying(true);
      } else {
        audioRefWithVocal.current.pause();
        audioRefInstrumental.current.pause();
        setIsPlaying(false);
      }
    });

    // 接收来自SongControl的歌曲进度控制
    let token2 = PubSub.subscribe('audioControl', (msg, time) => {
      audioRefWithVocal.current.currentTime += time;
      audioRefInstrumental.current.currentTime += time;
    });

    let token3 = PubSub.subscribe('resetAudio', () => {
      stopCurrentAudio();
    });


    // 监听歌曲播放时间，歌曲播放时间改变后发布歌曲播放时间
    audioRefWithVocal.current.addEventListener('timeupdate', () => {
      PubSub.publish('audioTimeUpdate', audioRefWithVocal.current.currentTime);
    });

    // 监听歌曲播放结束事件，歌曲播放结束后重置歌曲播放时间，发布歌曲播放状态，并进入节奏学习模式
    audioRefWithVocal.current.addEventListener('ended', () => {
      // 重置音频播放时间
      audioRefWithVocal.current.currentTime = 0;
      audioRefInstrumental.current.currentTime = 0;
      PubSub.publish('playEnded', false); // 发布歌曲播放状态
    });

    return () => {
      PubSub.unsubscribe(token1);
      PubSub.unsubscribe(token2);
      PubSub.unsubscribe(token3);
    };
  }, []);

  // 监听来自AudioFn的歌曲播放模式切换
  useEffect(() => {
    let token = PubSub.subscribe('modeSwitch', (msg, action) => {
      stopCurrentAudio();
      PubSub.publish('playEnded', false);

      // action: true: 下一模式，false: 上一模式
      if (action === true) {
        setMode(mode => mode + 1);
      } else {
        setMode(mode => mode - 1);
      }
    });

    return () => {
      PubSub.unsubscribe(token);
    };
  }, [mode]);

  function stopCurrentAudio() {
    audioRefWithVocal.current.pause();
    audioRefInstrumental.current.pause();
    audioRefWithVocal.current.currentTime = 0;
    audioRefInstrumental.current.currentTime = 0;
    setIsPlaying(false);
  }

  // 歌词跳转
  useEffect(() => {
    let token = PubSub.subscribe('lyricClicked', (msg, time) => {
      audioRefWithVocal.current.currentTime = time;
      audioRefInstrumental.current.currentTime = time;
    });

    return () => {
      PubSub.unsubscribe(token);
    };
  }, []);

  // 监听歌曲模式改变的消息 {0: 原曲，1：伴奏}
  useEffect(() => {
    let token = PubSub.subscribe('songModeChange', (msg, mode) => {
      setSongMode(mode);
    });

    if (songMode === 0) {
      audioRefWithVocal.current.volume = 0.5;
      audioRefInstrumental.current.volume = 0;
    } else {
      audioRefWithVocal.current.volume = 0;
      audioRefInstrumental.current.volume = 0.5;
    }

    return () => {
      PubSub.unsubscribe(token);
    };
  }, [songMode]);

  // 组件挂载改主题色
  useEffect(() => {
    let mainColor = props.location.state.songInfo.mainColor;
    // 组件挂载，背景色改变
    document.body.style.backgroundColor = mainColor;
    document.documentElement.style.setProperty('--main-color', mainColor);

    return () => {
      document.body.style.backgroundColor = "#fff";
    };
  }, [props.location.state.songInfo.mainColor]);

  return (
    <>
      <ClassControl />
      <div className='sp'>
        <audio ref={audioRefWithVocal} />
        <audio ref={audioRefInstrumental} />
        <Link className='sp-back' to="/singsystem/songselection" ></Link>
        <div className='sp-main'>
          <div className='sp-left'>
            <SongInfo name={songInfo.name} author={songInfo.author} sourceTag={songInfo.sourceTag} />
            <SongControl />
          </div>
          <AudioFn mode={mode} songInfo={songInfo} />
          <Lyrics lyrics={songInfo.lyrics} />
        </div>
        {mode === 3 && <Link className='sp-endSingBtn' to='/singsystem/singscore'>结束学习</Link>}
        <div className='sp-bg-wave'>
          <img className={isPlaying ? 'sp-wave1 sp-wave' : 'sp-wave'} src={wave1} alt="" />
          <img className={isPlaying ? 'sp-wave2 sp-wave' : 'sp-wave'} src={wave2} alt="" />
        </div>
        {<img className={scoreOpened ? 'sp-score-opened' : 'sp-score'} src={songInfo.score} alt='' onClick={() => setScoreOpened(!scoreOpened)} />}
      </div>
    </>
  )
}