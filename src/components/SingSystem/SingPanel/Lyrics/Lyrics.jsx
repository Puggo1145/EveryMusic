import React, { useState, useEffect, useRef } from 'react'
import PubSub from 'pubsub-js';

import './Lyrics.css';

export default function Lyrics(props) {
  const [lyrics, setLyrics] = useState([]);
  const [songMode, setSongMode] = useState(0);
  const lyricsListRef = useRef(null);

  useEffect(() => {
    if (props.lyrics) {
      let lyricsArray = props.lyrics.split("\n").filter(l => l !== "").map((line, index) => {
        let time = line.slice(1, line.indexOf("]"));
        let minutes = parseInt(time.split(":")[0]);
        let seconds = parseFloat(time.split(":")[1]);
        let timeInSeconds = minutes * 60 + seconds;
        let text = line.slice(line.indexOf("]") + 1);

        if (index === 0) {
          return { time: timeInSeconds, text: text, isCurrent: true, singSuggestion: null };
        } else {
          return { time: timeInSeconds, text: text, isCurrent: false, singSuggestion: null };
        }
      });
      setLyrics(lyricsArray);
    }
  }, [props.lyrics]);

  // 处理唱歌建议
  useEffect(() => {
    let token = PubSub.subscribe('singSuggestion', (msg, suggestion) => {
      setLyrics(lyrics => lyrics.map(lyric => {
        if (lyric.isCurrent && lyric.singSuggestion === null) {
          return { ...lyric, singSuggestion: suggestion };
        } else {
          return lyric;
        }
      }));
    });

    return () => {
      PubSub.unsubscribe(token);
    };
  }, []);

  // 滚动歌词
  useEffect(() => {
    let token = PubSub.subscribe('audioTimeUpdate', (msg, time) => {
      let currentLyricIndex;
      for (let i = 0; i < lyrics.length; i++) {
        if (time < lyrics[i].time) {
          currentLyricIndex = i - 1;
          break;
        }
      }
      if (currentLyricIndex !== undefined) {
        setLyrics(lyrics.map((lyric, index) => {
          return { ...lyric, isCurrent: index === currentLyricIndex }
        }));
        if (lyricsListRef.current) {
          const currentLyricEl = lyricsListRef.current.querySelector('.currentLy');
          if (currentLyricEl) {
            lyricsListRef.current.scrollTop = currentLyricEl.offsetTop - lyricsListRef.current.offsetHeight / 2 + currentLyricEl.offsetHeight / 2;
          }
        }
      }
    });

    return () => {
      PubSub.unsubscribe(token);
    };
  }, [lyrics]);

  // 歌词跳转
  function handleLyricClick(time) {
    PubSub.publish('lyricClicked', time);
  }

  // 向LyricLearn组件传递歌词
  useEffect(() => {
    const currentLyric = lyrics.find(lyric => lyric.isCurrent);
    if (currentLyric) {
      PubSub.publish('currentLyric', currentLyric.text);
    }
  }, [lyrics]);

  // 清除建议
  function clearSuggestion() {
    setLyrics(lyrics => lyrics.map(lyric => {
      return { ...lyric, singSuggestion: null };
    }));
  }


  function handleSongModeClick(type) {
    PubSub.publish('songModeChange', type);
    setSongMode(type);
  }

  return (
    <div className='lr'>
      <div className='lr-mode'>
        <button className={`lr-mode-a lr-mode-btn ${songMode === 0 && 'lr-mode-on'}`} onClick={() => handleSongModeClick(0)}>原曲带唱</button>
        <button className={`lr-mode-b lr-mode-btn ${songMode === 1 && 'lr-mode-on'}`} onClick={() => handleSongModeClick(1)}>歌词跟随</button>
      </div>
      <button className='ly-clearSuggection' onClick={clearSuggestion}></button>
      <ul className='lr-lytexts' ref={lyricsListRef}>
        {
          lyrics.map((item, index) => {
            return (
              <li
                key={index}
                className={item.isCurrent ? 'ly-lytext currentLy' : 'ly-lytext'}
                onClick={() => handleLyricClick(item.time)}
              >
                <span>
                  {item.text}
                  {item.singSuggestion && <div className='ly-singSuggestion'>{item.singSuggestion}</div>}
                </span>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}