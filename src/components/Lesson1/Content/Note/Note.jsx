import React, { Component } from 'react';
import PubSub from 'pubsub-js';

import './Note.css';

//引入静态资源
import tingTingimg from '../../../../static/Lesson1/img/tingTing.png';

export default class Note extends Component {
  state = {
    interactionEnabled: false,
    currentNoteIndex: null,
    heights: [20, 40, 60, 80, 100, 120, 140],
    notes: ['do', 're', 'mi', 'fa', 'sol', 'la', 'si'], // 所有音高
    indexCache: [], // 缓存点击过的音高按钮的索引
    noteClickCount: 0, // 点击音高按钮的次数
  };

  componentDidMount() {
    this.pubsubToken = PubSub.subscribe('CONTEXT_HIDDEN', () => {
      this.setState({ interactionEnabled: true });
    });
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.pubsubToken);
  }

  playAudio = (index) => {
    // 播放按钮声音
    let audioSrc = require('../../../../static/Lesson1/pitchGame/audio/4' + (index + 1) + '.mp3');
    window.audioElement = new Audio(audioSrc);
    window.audioElement.volume = 0.3;
    window.audioElement.play();
  }

  handleButtonClick = (index) => {
    if (this.state.interactionEnabled) {
      this.setState({ currentNoteIndex: index }, () => {
        this.playAudio(index);
        setTimeout(() => {
          this.setState({ currentNoteIndex: null })
        }, 1000);
      });

      // 记录点击次数，全部点击后提示下一页
      if ( !(index in this.state.indexCache) ) {
        this.setState({ indexCache: [...this.state.indexCache, index] });
      }

      if ( this.state.indexCache.length === 6 ) {
        this.setState({ noteClickCount: 0 });
        PubSub.publish('PROMPT_NEXT');
      }
    }
  };

  render() {
    const { heights, currentNoteIndex, notes } = this.state;
    const currentHeight = currentNoteIndex !== null ? heights[currentNoteIndex] : 0;

    return (
      <div className='note-center'>
        <section className='note-height'>{currentHeight}m</section>
        <div className='note-tingTingBox'>
          <img
            className={`note-tingTing${currentNoteIndex !== null ? ' note-tingTing-jump' : ''}`}
            src={tingTingimg}
            alt=''
            style={{
              '--jump-height': currentNoteIndex !== null ? `${heights[currentNoteIndex]}px` : '0px',
            }}
          />
          <div className='note-heightBox'></div>
        </div>
        <ul className='note-soundBtns'>
          {notes.map((note, index) => (
            <li key={note}>
              <button onClick={() => this.handleButtonClick(index)}>{note}</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
