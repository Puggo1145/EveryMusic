import React, { useState, useEffect, useRef, Fragment } from 'react'
import './RhythmPractice.css';

import PubSub from 'pubsub-js';

export default function RhythmPractice(props) {

    const [mode, setMode] = useState(0);  // 0: 设置音量阈值 1：节拍练习
    const [rhythmInfo, setRhythmInfo] = useState([]);

    // mode 0必要属性
    const [isDetecting, setIsDetecting] = useState(false);
    const stateRef = useRef({}); // volumeNode有闭包问题，需要用useRef存储mode、isDetecting、isPlaying的值来使其可以被访问
    const [volumeThreshold, setVolumeThreshold] = useState(0);

    // mode 1必要属性
    const [isPlaying, setIsPlaying] = useState(false);
    const [beatTime, setBeatTime] = useState(0);
    const [rhythmColor, setRhythmColor] = useState('#000');

    // 节拍练习得分计算
    const rhythmScore = useRef({
        correct: 0,
        wrong: 0,
    });
    const [checkLock, setCheckLock] = useState(false);

    let visualVolume = useRef(null);

    let audioContext = useRef(null);
    let microphone = useRef(null);
    let volumeNode = useRef(null);
    let stream = useRef(null);

    useEffect(() => {
        setRhythmInfo(props.rhythm)
        setBeatTime((60 / props.rhythm.bpm) / (props.rhythm.beat / props.rhythm.duration));
    }, [props.rhythm]);

    const volumeProcessorCode = `
        class VolumeProcessor extends AudioWorkletProcessor {
          process(inputs, outputs, parameters) {
            if (!inputs || !inputs[0] || !inputs[0][0]) { 
              return true;
            }

            const input = inputs[0][0];
            let sum = 0;
            for (let i = 0; i < input.length; i++) {
              sum += input[i] ** 2;
            }
            const rms = Math.sqrt(sum / input.length);
            this.port.postMessage({ rms });
            return true;
          }
        }
        registerProcessor('volume-processor', VolumeProcessor);
        `;

    useEffect(() => {
        const init = async () => {
            audioContext.current = new AudioContext();
            const blob = new Blob([volumeProcessorCode], { type: 'application/javascript' });
            const processorUrl = URL.createObjectURL(blob);
            await audioContext.current.audioWorklet.addModule(processorUrl.toString());

            volumeNode.current = new AudioWorkletNode(audioContext.current, 'volume-processor');

            stream.current = await navigator.mediaDevices.getUserMedia({
                audio: {
                    autoGainControl: false,
                    noiseSuppression: false,
                    echoCancellation: false
                }
            });
        };

        init();

        return () => {
            if (volumeNode.current) {
                volumeNode.current.disconnect();
                volumeNode.current.port.onmessage = null;
                volumeNode.current = null;
            }
            if (microphone.current) {
                microphone.current.mediaStream.getTracks()[0].stop();
                microphone.current = null;
            }
            setIsDetecting(false);

            PubSub.publish("rhythmScore", rhythmScore.current.correct / (rhythmScore.current.wrong === 0 ? rhythmScore.current.correct : rhythmScore.current.correct + rhythmScore.current.wrong) * 100);
        };
    }, []);

    useEffect(() => {
        // 将所有的状态都存储在一个对象中
        stateRef.current = { isDetecting, isPlaying, mode, volumeThreshold };
    }, [isDetecting, isPlaying, mode, volumeThreshold]);

    useEffect(() => {
        if (mode === 1) {
            let token1 = PubSub.subscribe("isPlaying", (msg, isPlaying) => {
                setIsPlaying(isPlaying);
            });

            return () => {
                PubSub.unsubscribe(token1);
            }
        }
    }, [mode]);

    const startVolumeDetection = () => {
        if (audioContext.current.state === "suspended") {
            audioContext.current.resume();
        }
        microphone.current = audioContext.current.createMediaStreamSource(stream.current);
        microphone.current.connect(volumeNode.current);
        volumeNode.current.connect(audioContext.current.destination);

        volumeNode.current.port.onmessage = (event) => {
            const volume = event.data.rms;
            // console.log("volume:" + volume.toFixed(2), "volumeThreshold:" + ( stateRef.current.volumeThreshold - 0.1).toFixed(2));
            if (stateRef.current.mode === 0 && volume > 0.2) {
                setVolumeThreshold(volume);
            } else if (stateRef.current.mode === 1 && volume > stateRef.current.volumeThreshold - 0.1) {
                // check锁，防止连续的音量输入导致的多次检测，影响计分
                !checkLock && checkRhythm();
            }
        };
    };

    // check锁，500ms内不允许连续的音量输入
    useEffect(() => {
        let timer = setTimeout(() => setCheckLock(false), 500);
        return () => clearTimeout(timer);
    }, [checkLock])

    const stopVolumeDetection = () => {
        if (volumeNode.current) {
            volumeNode.current.port.onmessage = null;
        }
    };

    const handleClick = () => {
        if (!isDetecting) {
            setIsDetecting(true);
        } else {
            setIsDetecting(false);
            setMode(1);
            PubSub.publish('resetAudio')
        }
    };

    const checkRhythm = () => {
        setCheckLock(true);

        let scale = visualVolume.current.getBoundingClientRect().width / 500;

        if ((scale > 0 && scale <= 0.2) || (scale >= 0.8 && scale <= 1)) {
            rhythmScore.current.correct++;
            setRhythmColor('green');
            setTimeout(() => setRhythmColor('#000'), 200);
        } else {
            rhythmScore.current.wrong++;

            setRhythmColor('red');
            setTimeout(() => setRhythmColor('#000'), 200);
        }
    }

    useEffect(() => {
        if (mode === 0 && isDetecting) {
            startVolumeDetection();
        } else if (mode === 0 && !isDetecting) {
            stopVolumeDetection();
        } else if (mode === 1 && isPlaying) {
            startVolumeDetection();
        } else if (mode === 1 && !isPlaying) {
            stopVolumeDetection();
        }
    }, [mode, isDetecting, isPlaying]);

    return (
        <Fragment>
            <div className='rp'>
                <h1 className='rp-title sp-global-main-color'>节奏练习模式</h1>
                {
                    mode === 0 ?
                        <div className='rp-detectVolumnSet'>
                            {isDetecting ?
                                <p className='rp-description sp-global-main-color'>
                                    当前音量阈值：{volumeThreshold.toFixed(2)}
                                </p> :
                                <p className='rp-description sp-global-main-color'>
                                    请先设置一个合适的检测音量 <br />
                                    确保环境安静后点击开始 <br />
                                    击掌以调整检测数值，点击结束以完成设置
                                </p>
                            }
                            <button className='rp-detectVolumnSet-btn' onClick={handleClick}>
                                {isDetecting ? '结束' : '开始'}
                            </button>
                        </div> :
                        <div className='rp-rhythmPractice sp-global-main-color'>
                            <p className='rp-description'>
                                这是一首{rhythmInfo.duration}{rhythmInfo.beat}拍的歌曲 <br />
                                即以{rhythmInfo.duration}分音符为一拍，每小节{rhythmInfo.beat}拍<br />
                                点击播放按钮，拍手练习节奏
                            </p>
                        </div>
                }
            </div>
            <div
                ref={visualVolume}
                className="rp-visual-volumn"
                style={mode === 1 && isPlaying ? {
                    animationName: "rhythmAnimation",
                    animationDuration: `${beatTime}s`,
                    animationTimingFunction: 'ease',
                    animationIterationCount: 'infinite',
                    animationDelay: `${rhythmInfo.delay}ms`,
                    backgroundColor: rhythmColor
                } : null}
            ></div>
        </Fragment>
    )
}