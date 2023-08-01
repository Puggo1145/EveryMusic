import React, { Component } from 'react'
import PubSub from 'pubsub-js'

import './Length.css'

//引入静态资源
import train from '../../../../static/Lesson1/length/train.png'

export default class Length extends Component {
  state = {
    interactionEnabled: false,
    distance: 0,
    speed: 0
  }

  trainRef = React.createRef()
  distanceBarRef = React.createRef()
  distanceNumRef = React.createRef()

  componentDidMount() {
    this.pubsubToken = PubSub.subscribe('CONTEXT_HIDDEN', () => {
      this.setState({ interactionEnabled: true });
    });
    this.speed = 0
    this.distance = 0
  }

  componentDidUpdate() {
    if (this.state.interactionEnabled) {
      navigator.mediaDevices.getUserMedia =
        navigator.mediaDevices.getUserMedia ||
        navigator.mediaDevices.webkitGetUserMedia ||
        navigator.mediaDevices.mozGetUserMedia ||
        navigator.mediaDevices.msGetUserMedia;
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          const audioContext = window.AudioContext || window.webkitAudioContext;
          this.audioContext = new audioContext();

          const audioInput = this.audioContext.createMediaStreamSource(stream);
          this.audioInput = audioInput;

          const volume = this.audioContext.createGain();
          this.volume = volume;
          audioInput.connect(volume);

          const bufferSize = 2048;
          const recorder = this.audioContext.createScriptProcessor(bufferSize, 1, 1);
          this.recorder = recorder
          recorder.onaudioprocess = (e) => {
            let buffer = e.inputBuffer.getChannelData(0); //获得缓冲区的输入音频，转换为包含了PCM通道数据的32位浮点数组
            //创建变量并迭代来获取最大的音量值
            let maxVal = 0;
            for (var i = 0; i < buffer.length; i++) {
              if (maxVal < buffer[i]) {
                maxVal = buffer[i];
              }
            }

            //显示音量值
            let inputVolumn = Math.round(maxVal * 100)
            this.trainGame(inputVolumn)

          }
          volume.connect(recorder);
          recorder.connect(this.audioContext.destination);
        }).catch(function (err) {
          console.log(err);
        })
    }
  }

  componentWillUnmount() {
    PubSub.unsubscribe(this.pubsubToken);
    if (this.audioContext && this.recorder && this.volume) {
      this.recorder.disconnect(this.audioContext.destination);
      this.volume.disconnect(this.recorder);
      this.audioInput.disconnect(this.volume);
      this.audioContext.close();
    }
  }

  trainGame = (inputVolumn) => {
    let volumn = inputVolumn

    let velocity = 0.2 //控制火车速率(加速和减速所需的时间)

    // 声音大于10 前进
    if (volumn > 10) {
      this.speed += velocity
    } else {
      this.speed -= velocity
    }

    //将速度控制在0-2之间
    this.speed = Math.max(0, Math.min(this.speed, 1))

    this.distance += this.speed

    this.trainRef.current.style.left = this.distance * 0.2 + 'rem'
    this.distanceBarRef.current.style.width = this.distance * 0.2 + 'rem'
    this.distanceNumRef.current.innerHTML = Math.round(this.distance) + 'm'

    if (this.distance > 400) {
      PubSub.publish('PROMPT_NEXT');
    }
  }

  render() {
    return (
      <div className='length-center'>
        <div className="length-trainSection">
          <div className="length-distanceBar">
            <div className="length-bar" ref={this.distanceBarRef}></div>
            <p className="length-distanceNum" ref={this.distanceNumRef}>0m</p >
          </div>
          < img className="length-train" ref={this.trainRef} src={train} alt="train" />
        </div>
      </div>
    )
  }
}