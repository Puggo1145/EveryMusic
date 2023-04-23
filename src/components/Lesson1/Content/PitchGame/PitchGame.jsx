import React, { Component } from 'react'
import { PitchDetector } from 'pitchy';
import PubSub from 'pubsub-js';

import './PitchGame.css'

export default class PitchGame extends Component {
  state = {
    onListen: false,
    notes: ["do", "re", "mi", "fa", "sol", "la", "si"],
    noteNames: [
      "c",
      "C#",
      "d",
      "D#",
      "e",
      "f",
      "F#",
      "g",
      "G#",
      "a",
      "A#",
      "b",
      "c",
    ],
    correctNotes: new Array(7).fill(false),
  };

  // 初始化refs
  constructor(props) {
    super(props);
    this.noteRefs = [];
    this.state.notes.forEach(() => {
      this.noteRefs.push(React.createRef());
    });
  }

  // 组件挂载后的全局操作：1.new AudioContext() 2.创建分析器 3.获取音频流 4.将音频流传给分析器 5.将分析器传给音高分析函数
  componentDidMount() {
    // 订阅全局事件，context隐藏时，允许用户操作
    this.pubsubToken = PubSub.subscribe('CONTEXT_HIDDEN', () => {
      this.setState({ onListen: true });
    });

    this.audioContext = new window.AudioContext();
    this.analyserNode = this.audioContext.createAnalyser();
    this.scriptNode = this.audioContext.createScriptProcessor(2048, 1, 1);

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaStreamSource = this.audioContext.createMediaStreamSource(stream);
        mediaStreamSource.connect(this.analyserNode);
        this.analyserNode.connect(this.scriptNode);
        this.scriptNode.connect(this.audioContext.destination);

        const detector = PitchDetector.forFloat32Array(this.analyserNode.fftSize);
        const input = new Float32Array(detector.inputLength);

        // 在这里设置音量阈值
        const volumeThreshold = 0.08;

        // 在scriptNode的audioprocess事件中检测音量并调用updatePitch
        this.scriptNode.addEventListener("audioprocess", (event) => {
          const volume = this.calculateVolume(event.inputBuffer.getChannelData(0));
          if (volume > volumeThreshold) {
            this.updatePitch(this.analyserNode, detector, input, this.audioContext.sampleRate);
          }
        });
      });
  }

  // 组件卸载前的全局操作：1.取消订阅 2.关闭音频流
  componentWillUnmount() {
    PubSub.unsubscribe(this.pubsubToken);
    this.audioContext.close();
  }


  // 音量分析函数
  calculateVolume = (data) => {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i] * data[i];
    }
    return Math.sqrt(sum / data.length);
  }

  // 音高分析函数
  updatePitch = (analyserNode, detector, input, sampleRate) => {
    analyserNode.getFloatTimeDomainData(input);
    const [pitch, clarity] = detector.findPitch(input, sampleRate);
    let frequency = Math.round(pitch * 10) / 10;
    let clarityIndex = Math.round(clarity * 100);

    // 计算音名
    if ( this.state.onListen == true) {
      this.getNoteName(frequency, clarityIndex);
    }
  }

  // 计算音名函数
  getNoteName = (frequency, clarityIndex) => {
    const A4 = 440;
    const noteIndex = Math.round((Math.log2(frequency / A4) * 12 + 57) % 12);
    const notesMapping = [0, null, 1, null, 2, 3, null, 4, null, 5, null, 6];

    // console.log(noteIndex, clarityIndex, this.state.noteNames[noteIndex % this.state.noteNames.length]); 音准调试
  
    if (clarityIndex >= 90) {
      const targetNoteIndex = notesMapping[noteIndex % this.state.noteNames.length];
  
      if (targetNoteIndex !== null) {
        this.setState((prevState) => {
          const correctNotes = prevState.correctNotes.slice();
          correctNotes[targetNoteIndex] = true;
          return { correctNotes };
        });
      }
    }

    const allCorrect = this.state.correctNotes.every((note) => note);
    if (allCorrect) {
      this.setState({ onListen: false });
      PubSub.publish('PROMPT_NEXT');
    }
  };
  
  // 按钮点击事件
  handleButtonClick = (event, index) => {
    if (this.state.onListen) {

      // 声音检测标志变量：声音检测关闭
      this.setState({ onListen: false });

      // 动画
      event.target.style.animation = 'listen 1s ease'

      // 播放按钮声音
      let audioSrc = require('../../../../static/Lesson1/pitchGame/audio/4' + (index + 1) + '.mp3');
      window.audioElement = new Audio(audioSrc);
      window.audioElement.volume = 0.3;
      window.audioElement.play();

      setTimeout(() => {
        window.audioElement.pause();
        // 动画清除
        event.target.style.animation = ''
        // 声音变量标志函数：声音检测开启
        this.setState({ onListen: true });
      }, 1000);
    }
  }

  render() {
    const { notes, correctNotes } = this.state;

    return (
      <div className="pitchGame-center">
        <div className="pitchGame-singSection">
          <ul className="pitchGame-stage">
            {notes.map((note, index) => (
              <li
                key={note}
                className={ correctNotes[index] ? " correct" : ""}
                ref={this.noteRefs[index]}
                onClick={(event) => this.handleButtonClick(event, index)}
              >
                {note}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
}
