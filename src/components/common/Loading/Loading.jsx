import React, { Component } from 'react'
import PubSub from 'pubsub-js'

// 引入局部样式
import './Loading.css'

// 使用import导入需要使用的图片资源
import tingTingSpeak from '../../../static/Lesson1/context/tingTing-Speak.png';
import home from '../../../static/Lesson1/footer/home.png';
import prevPage from '../../../static/Lesson1/footer/prevPage.png';
import tingTing from '../../../static/Lesson1/img/tingTing.png';
import rail from '../../../static/Lesson1/length/rail.png';
import train from '../../../static/Lesson1/length/train.png';
import guitar from '../../../static/Lesson1/timbre/img/guitar.png';
import piano from '../../../static/Lesson1/timbre/img/piano.png';
import violin from '../../../static/Lesson1/timbre/img/violin.png';
import tingtingBody from '../../../static/Lesson1/volumn/tingting-body.svg';
import tingtingHead from '../../../static/Lesson1/volumn/tingting-head.svg';

// 使用import导入需要使用的音频资源
import audio41 from '../../../static/Lesson1/pitchGame/audio/41.mp3';
import audio42 from '../../../static/Lesson1/pitchGame/audio/42.mp3';
import audio43 from '../../../static/Lesson1/pitchGame/audio/43.mp3';
import audio44 from '../../../static/Lesson1/pitchGame/audio/44.mp3';
import audio45 from '../../../static/Lesson1/pitchGame/audio/45.mp3';
import audio46 from '../../../static/Lesson1/pitchGame/audio/46.mp3';
import audio47 from '../../../static/Lesson1/pitchGame/audio/47.mp3';

export default class Loading extends Component {

  // 组件挂载完毕后，开始加载资源
  async componentDidMount() {
    // 加载所有需要的资源
    await this.loadAllResources();
  
    // 资源加载完成后，更新 loading 状态
    PubSub.publish('loaded', false);
  }

  // 资源加载器
  loadAllResources = async () => {

    // 需要加载的图片资源
    const imageResources = [
      tingTingSpeak,
      home,
      prevPage,
      tingTing,
      rail,
      train,
      guitar,
      piano,
      violin,
      tingtingBody,
      tingtingHead,
    ]

    // 需要加载的音频资源
    const audioResources = [
      audio41,
      audio42,
      audio43,
      audio44,
      audio45,
      audio46,
      audio47,
    ]

    await Promise.all([
      ...audioResources.map((resource) => this.loadAudioFile(resource)),
      ...imageResources.map((resource) => this.loadImageFile(resource)),
    ])
  }

  // 图片加载器
  loadImageFile = (src) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = src;
      image.onload = () => resolve(image);
      image.onerror = (error) => reject(error);
    });
  };
  
  // 音频加载器
  async loadAudioFile(src) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    const response = await fetch(src);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
  }

  render() {
    return (
      <div className='loading-center'>
        <div className="loading">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <p className='loading-text'>正在加载，请稍后</p>
      </div>
    )
  }
}
