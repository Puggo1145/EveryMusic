import React, { useState, useEffect, useMemo } from 'react'
import * as Pitchfinder from "pitchfinder";

import Header from '../../common/Header/Header'

import './VocalRangeTest.css'

export default function VocalRangeTest() {

  const [indicator, setIndicator] = useState([
    { pitch: 'Do', current: true },
    { pitch: 'Re', current: false },
    { pitch: 'Mi', current: false },
    { pitch: 'Fa', current: false },
    { pitch: 'Sol', current: false },
    { pitch: 'La', current: false },
    { pitch: 'Si', current: false },
    { pitch: 'Do+', current: false },
  ]);
  const [isTesting, setIsTesting] = useState(false);  // 是否正在测试
  const [note, setNote] = useState("None");
  const [frequency, setFrequency] = useState(null);
  const [noteIndex, setNoteIndex] = useState(null);  // 0 ~ 43
  const detectPitch = useMemo(() => Pitchfinder.AMDF(), []);  // 使用 useMemo 记住 detectPitch 的值

  const [allNoteIndexes, setAllNoteIndexes] = useState([]); // 用于记录所有的noteIndex
  const [voiceRange, setVoiceRange] = useState(""); //用于记录音域判断结果

  useEffect(() => {
    let audioContext, analyser, source, dataArray;
    let timeoutId = null;
    let stream;
  
    if (isTesting) {
      navigator.mediaDevices.getUserMedia({
        audio: {
          autoGainControl: false,
          // noiseSuppression: false,
          echoCancellation: false
        }
      })
        .then(mediaStream => {
          stream = mediaStream;  // 保存stream引用
  
          audioContext = new (window.AudioContext || window.webkitAudioContext)();
          analyser = audioContext.createAnalyser();
          analyser.fftSize = 2048;
  
          source = audioContext.createMediaStreamSource(stream);
          source.connect(analyser);
  
          dataArray = new Float32Array(analyser.fftSize);
  
          // 更新音高
          const updatePitch = () => {
            analyser.getFloatTimeDomainData(dataArray);
            const pitchResult = detectPitch(dataArray);
  
            // 只有当音高变化时才更新
            if (pitchResult !== null) {
              const pitchFrequency = pitchResult;
              // const pitchFrequency = pitchResult + pitchResult * 3 / 40;
              setFrequency(Math.round(pitchFrequency));
              setNote(freqToNoteName(pitchFrequency));
            }
  
            // 延迟再次更新
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
        if (stream) stream.getTracks()[0].stop();  // 停止捕获音频流
      }
    }
  }, [detectPitch, isTesting]);  
  

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
    };
  }

  useEffect(() => {
    if (noteIndex !== null) {
      setAllNoteIndexes(prevIndexes => [...prevIndexes, noteIndex]);
    }
  }, [noteIndex]);

  // 当测试结束时，计算音域判断
  useEffect(() => {
    if (!isTesting && allNoteIndexes.length > 0) {
      const averageNoteIndex = allNoteIndexes.reduce((prev, curr) => prev + curr) / allNoteIndexes.length;

      // 基于你的需求，可以调整这个范围
      if (averageNoteIndex < 14) {
        setVoiceRange("低音歌手");
      } else if (averageNoteIndex < 29) {
        setVoiceRange("中音歌手");
      } else {
        setVoiceRange("高音歌手");
      }
    }
  }, [isTesting]);

  function handleTestBtn() {
    setIsTesting(!isTesting);
    if (!isTesting) {
      setAllNoteIndexes([]); // 如果开始测试，清空allNoteIndexes
      setVoiceRange(""); // 清空之前的音域判断结果
    }
  }
  // 转换 noteIndex 到 indicator 索引
  const indicatorIndex = noteIndex !== null ? Math.round((noteIndex / 43) * 7) : null;

  return (
    <>
      <Header title={"音域测试"} />
      <div className='vrt'>
        <div className='vrt-left'>
          <h1>音域测试：你是高音还是低音</h1>
          <p>点击测试按钮，唱出你能到达的最低音和最高音</p>
          <button className='vrt-startTest' onClick={handleTestBtn}>{isTesting ? '停止测试' : '立即测试'}</button>
        </div>
        <div className='vrt-right'>
          <div className='vrt-right-cue'>
            <h2>{isTesting ? `当前音高：${note}` : voiceRange ? `你是${voiceRange}` : '点击按钮开始测试'}</h2>
            <h2>{voiceRange && "已为您选择了合适的歌曲"}</h2>
          </div>
          <ul className='vrt-right-indicator'>
            {
              indicator.map((item, index) => {
                return (
                  <li key={index} className={indicatorIndex === index ? 'current-note' : ''}></li>
                )
              }
              )
            }
          </ul>
        </div>
      </div>
    </>
  )
}