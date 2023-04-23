import React, { Component } from 'react'
import PubSub from 'pubsub-js';

import ttHead from '../../../../static/Lesson1/volumn/tingting-head.svg'
import ttBody from '../../../../static/Lesson1/volumn/tingting-body.svg'

import './Volumn.css'

export default class Volumn extends Component {
  headRef = React.createRef();

  state = {
    interactionEnabled: false, // Context是否已交互
  }

  componentDidMount() {
    this.pubsubToken = PubSub.subscribe('CONTEXT_HIDDEN', () => {
      this.setState({ interactionEnabled: true });
    });
  }

  // 组件更新时，检查interactionEnabled是否为true
  componentDidUpdate() {
    if ( this.state.interactionEnabled ) {
      // 捕获音频媒体
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
      if (!navigator.getUserMedia) {
        console.log('您的浏览器不支持使用麦克风。');
      }
      navigator.getUserMedia({ audio: true }, this.onSuccess, () => console.log('获取音频时出现了一些问题'));
    }
  }

  // 接触事件订阅，关闭audioContext
  componentWillUnmount() {
    PubSub.unsubscribe(this.pubsubToken);
    if (this.audioContext && this.recorder && this.volume) {
      this.recorder.disconnect(this.audioContext.destination);
      this.volume.disconnect(this.recorder);
      this.audioInput.disconnect(this.volume);
      this.audioContext.close();
    }
  }

  onSuccess = (stream) => {
    //创建一个音频环境对像
    const audioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new audioContext();

    const audioInput = this.audioContext.createMediaStreamSource(stream);
    this.audioInput = audioInput;

    const volume = this.audioContext.createGain();
    this.volume = volume;
    audioInput.connect(volume);

    //创建缓存，用来缓存声音
    let bufferSize = 2048;

    // 创建声音的缓存节点，createJavaScriptNode方法的
    // 第二个和第三个参数指的是输入和输出都是双声道。
    let recorder = this.audioContext.createScriptProcessor(bufferSize, 1, 1);
    this.recorder = recorder;

    // 录音过程的回调函数，基本上是将左右两声道的声音
    // 分别放入缓存。
    recorder.onaudioprocess = (e) => {
      let buffer = e.inputBuffer.getChannelData(0); //获得缓冲区的输入音频，转换为包含了PCM通道数据的32位浮点数组

      //创建变量并迭代来获取最大的音量值
      let maxVal = 0;
      for (let i = 0; i < buffer.length; i++) {
        if (maxVal < buffer[i]) {
          maxVal = buffer[i];
        }
      }

      //scale用于调整maxVal的精度，乘数用于控制头部的放大比例
      const scale = 1 + maxVal * 2;
      const img = this.headRef.current;
      img.style.transform = "scale(" + scale + ")";
    };
    
    // 将音量节点连上缓存节点，换言之，音量节点是输入
    // 和输出的中间环节。
    volume.connect(recorder);
    recorder.connect(this.audioContext.destination);
  };

  render() {
    return (
        <div className='volumn-center'>
            <div className="volumn-tingTing">
                <img className="volumn-head" src={ ttHead } ref={ this.headRef }/> 
                <img className='volumn-body' src={ ttBody } />
            </div>
        </div>
    )
  }
}
