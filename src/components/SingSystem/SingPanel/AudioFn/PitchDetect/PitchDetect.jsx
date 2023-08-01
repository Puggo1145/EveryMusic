import React, { useEffect, useState, useMemo, useRef } from 'react';
import * as Pitchfinder from "pitchfinder";
import PubSub from 'pubsub-js';

import './PitchDetect.css'

export default function PitchDetect() {
  const [note, setNote] = useState("None");
  const [frequency, setFrequency] = useState(null);
  const [noteIndex, setNoteIndex] = useState(null);  // 0 ~ 43
  const [notes, setNotes] = useState([]);
  const boxWidth = 500;
  const detectPitch = useMemo(() => Pitchfinder.AMDF(), []);

  // 频率校准与容差
  const tolerance = 10;  // 频率变化的容差值
  const [centerFrequency, setCenterFrequency] = useState(null);

  // 评价
  const [judgment] = useState([
    "很棒！继续保持",
    "保持气息平稳",
    "唱低一点",
    "唱高一点",
  ]);
  const [history, setHistory] = useState([]);  // 音高的历史数据
  const [feedback, setFeedback] = useState('');  // 反馈信息
  const [keyState, setKeyState] = useState({ q: false, w: false, a: false, s: false, e: false, d: false });

  // 评分
  const soundDuration = useRef(0);
  const judgmentCount = useRef([0, 0]);

  // 外部订阅消息
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let token = PubSub.subscribe('isPlaying', (msg, data) => {
      setIsPlaying(data);
    })

    return () => {
      PubSub.unsubscribe(token);
    }
  }, [])


  useEffect(() => {
    let audioContext, analyser, source, dataArray;
    let timeoutId = null;
    navigator.mediaDevices.getUserMedia({
      audio: {
        autoGainControl: false,
        noiseSuppression: false,
        echoCancellation: false
      }
    })
      .then(stream => {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        dataArray = new Float32Array(analyser.fftSize);

        const updatePitch = () => {
          analyser.getFloatTimeDomainData(dataArray);
          const pitchResult = detectPitch(dataArray);
          if (pitchResult !== null && pitchResult <= 1000) {
            // 累积发声时长
            soundDuration.current += 0.5

            // 获取中心频率做容差处理
            if (Math.round(Math.abs(pitchResult - centerFrequency)) > tolerance || centerFrequency === null) {
              setCenterFrequency(pitchResult);
            }
            setFrequency(Math.round(pitchResult));
            setNote(freqToNoteName(Math.round(centerFrequency)));

          } else {
            setFrequency(null);
            setNote("None");
            setNotes(prevNotes => {
              const updatedNotes = prevNotes.map(note => ({ ...note, active: false }));
              return updatedNotes;
            });
          }
          timeoutId = setTimeout(() => {
            requestAnimationFrame(updatePitch);
          }, 50);
        }

        requestAnimationFrame(updatePitch);
      })
      .catch(err => {
        console.log(err);
      });

    return () => {
      clearTimeout(timeoutId);
      if (source) source.disconnect();
      if (analyser) analyser.disconnect();
      if (audioContext) audioContext.close();
    }
  }, [detectPitch, centerFrequency]);

  function midiNumberToNoteName(midiNumber) {
    const octave = Math.floor(midiNumber / 12) - 1;
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const note = notes[midiNumber % 12];
    return note + octave;
  }

  function freqToNoteName(frequency) {
    if (frequency !== null) {
      const noteNumber = 12 * (Math.log(frequency / 440) / Math.log(2));
      setNoteIndex(Math.round(noteNumber) + 29);
      const midiNumber = Math.round(noteNumber) + 69;
      return midiNumberToNoteName(midiNumber);
    } else {
      return null;
    }
  }

  useEffect(() => {
    if (frequency !== null) {
      setNotes(prevNotes => {
        if (prevNotes.length > 0 && prevNotes[prevNotes.length - 1].index === noteIndex && prevNotes[prevNotes.length - 1].active) {
          return prevNotes;
        } else {
          let updatedNotes = prevNotes.map(note => ({ ...note, active: false }));
          updatedNotes = [...updatedNotes, { index: noteIndex, length: 0, position: 0, active: true, key: Date.now() }];
          return updatedNotes;
        }
      });
    } else {
      setNotes(prevNotes => {
        const updatedNotes = prevNotes.map(note => ({ ...note, active: false }));
        return updatedNotes;
      });
    }
  }, [frequency, noteIndex]);

  useEffect(() => {
    const animate = () => {
      setNotes(prevNotes => {
        return prevNotes
          .filter(note => note.position < boxWidth)
          .map(note => {
            return {
              ...note,
              length: note.active ? note.length + 1 : note.length,
              position: note.active ? note.position : note.position + 1
            }
          });
      });
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  useEffect(() => {
    if (frequency !== null && isPlaying) {
      // 判断音高是上升还是下降
      const direction = frequency > centerFrequency ? 'up' : 'down';
      // 更新历史记录
      let updatedHistory = [...history, direction];

      // 如果历史记录超过一定长度，删除早期的数据
      if (updatedHistory.length > 10) {
        updatedHistory = updatedHistory.slice(1);
      }

      // 音高超过容差值次数
      let exceedsTolerance = 0;
      for (let i = 1; i < updatedHistory.length; i++) {
        if (updatedHistory[i] !== updatedHistory[i - 1]) {
          exceedsTolerance++;
        }
      }

      // 根据音高变化的频繁程度和方向更新反馈信息
      if (exceedsTolerance >= 3) {
        setFeedback(judgment[1]);  // "保持气息平稳，顺畅清晰"
      } else {
        // setFeedback(judgment[0]);  // "很棒！继续保持"
      }

      // 最后更新 history
      setHistory(updatedHistory);
    }
  }, [frequency, isPlaying, centerFrequency, judgment]);

  // useEffect(() => {
  //   const keydownHandler = ({ key }) => {
  //     if (['q', 'w', 'a', 's', 'e', 'd'].includes(key)) {
  //       const newKeyState = { ...keyState, [key]: true };
  //       setKeyState(newKeyState);

  //       if (newKeyState.q && newKeyState.w) {
  //         setFeedback(judgment[3]);  // "唱高一点"
  //         PubSub.publish('singSuggestion', judgment[3]);
  //       } else if (newKeyState.a && newKeyState.s) {
  //         setFeedback(judgment[2]);  // "唱低一点"
  //         PubSub.publish('singSuggestion', judgment[2]);
  //       } else if (newKeyState.e && newKeyState.d) {
  //         setFeedback(judgment[1]);  // "保持气息平稳，顺畅清晰"
  //         PubSub.publish('singSuggestion', judgment[1]);
  //       }

  //     };
  //   };

  //   const keyupHandler = ({ key }) => {
  //     if (key === 'q' || key === 'w') {
  //       judgmentCount.current[0]++;
  //     } else if (key === 'a' || key === 's') {
  //       judgmentCount.current[0]++;
  //     } else if (key === 'e' || key === 'd') {
  //       judgmentCount.current[1]++;
  //     }

  //     if (['q', 'w', 'a', 's', 'e', 'd'].includes(key)) {
  //       const newKeyState = { ...keyState, [key]: false };
  //       setKeyState(newKeyState);

  //       if (!(newKeyState.q || newKeyState.w || newKeyState.a || newKeyState.s || newKeyState.e || newKeyState.d)) {
  //         setFeedback('');  // 清除 feedback
  //       }

  //     }
  //   };

  //   window.addEventListener('keydown', keydownHandler);
  //   window.addEventListener('keyup', keyupHandler);
  //   return () => {
  //     window.removeEventListener('keydown', keydownHandler);
  //     window.removeEventListener('keyup', keyupHandler);
  //   }
  // }, [keyState, judgment]);  // 添加 keyState 到依赖数组中

  // 计算最后得分并发布
  useEffect(() => {
    return () => {
      const basicScore = Math.min(soundDuration.current / 60 * 100, 100);

      // Calculate pitchScore and streamScore
      const pitchScore = Math.max(basicScore - judgmentCount.current[0] / 2 * 5, 0);
      const streamScore = Math.max(basicScore - judgmentCount.current[1] / 2 * 5, 0);

      // Publish scores
      PubSub.publish('pitchScore', pitchScore);
      PubSub.publish('streamScore', streamScore);
    }
  }, []);

  return (
    <div className='noteBlock'>
      <h1 className={isPlaying ? "pd-judgment" : "pd-judgment sp-global-main-color"}>{isPlaying ? feedback : '演唱模式'}</h1>
      <div className='note-indicator' style={{ bottom: `${(376 / 44) * noteIndex + 24}px` }}></div>
      {notes.map((note) => (
        <div
          key={note.key}
          className='note'
          style={{
            bottom: `${(376 / 44) * note.index + 28}px`,
            width: `${note.length}px`,
            right: `${note.position + 96}px`,
          }}
        />
      ))}
    </div>
  );
}
