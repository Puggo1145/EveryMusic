import React, { Component } from 'react';
import PubSub from 'pubsub-js';

import './Video.css';

//引入静态资源
import noteVideo from '../../../../static/Lesson1/video/note.mp4';


export default class Video extends Component {
  state = {
    videoSrc: noteVideo, // 视频地址
    interactionEnabled: false, // Context是否已交互，处理Video交互
    isPlaying: false, // 视频是否正在播放
  };

  // 组件挂载时，订阅一个context隐藏的消息，当context隐藏时，允许用户交互
  componentDidMount() {
    this.pubsubToken = PubSub.subscribe('CONTEXT_HIDDEN', () => {
      this.setState({ interactionEnabled: true });
    });
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.pubsubToken);
  }

  // 创建一个ref，用于获取video元素
  videoRef = React.createRef();

  handleVideoClick = (event) => {
    // 阻止冒泡
    event.stopPropagation();

    let { interactionEnabled } = this.state;
    if (interactionEnabled) {
      const video = this.videoRef.current;
      if (video.paused) {
        this.setState({ isPlaying: true });
        video.play();
      } else {
        this.setState({ isPlaying: false });
        video.pause();
      }
    }
  };

  render() {
    const { videoSrc, interactionEnabled, isPlaying } = this.state;

    return (
      <div className='video-center'>
        <div className='video-television' onClick={this.handleVideoClick}>
          {interactionEnabled && !isPlaying ? (
            <button className='video-playVideo-btn' onClick={this.handleVideoClick}>
              <div className='video-triangle' onClick={this.handleVideoClick}></div>
            </button>
          ) : null}
          <video className='video-video' src={videoSrc} ref={this.videoRef}></video>
        </div>
      </div>
    );
  }
}
