import React, { Component } from 'react';
import './Timbre.css';

import pianoAudio from '../../../../static/Lesson1/timbre/audio/piano.mp3';
import guitarAudio from '../../../../static/Lesson1/timbre/audio/guitar.mp3';
import violinAudio from '../../../../static/Lesson1/timbre/audio/violin.mp3';

export default class Timbre extends Component {
  state = {
    instruments: [
      { name: 'piano', cName: '钢琴',audioFile: pianoAudio, audio: new Audio(pianoAudio), progress: 0 },
      { name: 'guitar', cName: '吉他',audioFile: guitarAudio, audio: new Audio(guitarAudio), progress: 0 },
      { name: 'violin', cName: '小提琴', audioFile: violinAudio, audio: new Audio(violinAudio), progress: 0 },
    ],
  };

  componentDidMount() {
    const { instruments } = this.state;
    instruments.forEach((instrument) => {
      instrument.audio.addEventListener('timeupdate', () => {
        this.updateProgress(instrument);
      });
    });
  }

  componentWillUnmount() {
    const { instruments } = this.state;
    instruments.forEach((instrument) => {
      instrument.audio.pause();
      instrument.audio.currentTime = 0;
    });
  }

  handleClick = (selectedInstrument) => {
    const { instruments } = this.state;
  
    instruments.forEach((instrument) => {
      if (instrument.name !== selectedInstrument.name) {
        instrument.audio.pause();
        instrument.audio.currentTime = 0;
      }
    });
  
    if (selectedInstrument.audio.paused) {
      selectedInstrument.audio.play();
      this.updateProgress(selectedInstrument);
    } else {
      selectedInstrument.audio.pause();
    }
  };
  
  

  updateProgress = (instrument) => {
    const progress = instrument.audio.currentTime / instrument.audio.duration;
    instrument.progress = progress;
    this.setState({ instruments: [...this.state.instruments] });
  
    if (!instrument.audio.paused && !instrument.audio.ended) {
      requestAnimationFrame(() => this.updateProgress(instrument));
    }
  };
  

  render() {
    const { instruments } = this.state;
    const radius = 45; // Convert rem to pixels
  
    return (
      <div className="timbre-center">
        <div className="timbre-timbreSection">
          {instruments.map((instrument, index) => {
            const progress = instrument.progress;
            // const circumference = 2 * Math.PI * radius;
            // const strokeDashoffset = (1 - progress) * circumference;
            const playingClass = !instrument.audio.paused ? 'timbre-playing' : '';
  
            return (
              <div
                className={`timbre-${instrument.name} ${playingClass}`}
                key={index}
                onClick={() => this.handleClick(instrument)}
              >
                <h3>{instrument.cName}</h3>
                <svg className="timbre-progress-ring" viewBox="0 0 100 100">
                  <circle
                    className="circle-bg"
                    cx="50%"
                    cy="50%"
                    r={`${radius}%`}
                  ></circle>
                  <circle
                    className="circle"
                    cx="50%"
                    cy="50%"
                    r={`${radius}%`}
                    style={{
                      strokeDasharray: `${2 * Math.PI * radius}px`,
                      strokeDashoffset: `${(1 - progress) * 2 * Math.PI * radius}px`,
                    }}
                  ></circle>
                </svg>
              </div>
            );
          })}
        </div>
      </div>
    );
  }  
}
