import React, { useState, useEffect, useRef } from 'react'

import Header from '../common/Header/Header';

import './PlayInstrument.css';

export default function PlayInstrument() {

    const [whiteKeys, setWhiteKeys] = useState(['C', 'D', 'E', 'F', 'G', 'A', 'B']); // 白键数组
    const [blackKeys, setBlackKeys] = useState(['Cs', 'Ds', 'Fs', 'Gs', 'As']); // 黑键数组

    const [audios, setAudios] = useState([]); // 音频数组
    const [audioIndex, setAudioIndex] = useState(41); // 当前起始八度音符
    const [octave, setOctave] = useState(4); // 当前八度

    const [isLoaded, setIsLoaded] = useState(false); // 是否加载完成

    const audioContext = useRef(new AudioContext());
    const gainNode = useRef(audioContext.current.createGain());

    // 加载音频
    useEffect(() => {
        loadSound();

        return () => {
            audioContext.current.close();
        }
    }, [])

    async function loadSound() {
        setIsLoaded(false);
        let index = audioIndex
        const newAudioArray = [];
        for (let i = 0; i < 12; i++) {
            let url = require('../../static/PlayInstrument/audio/' + index + '.mp3');
            await fetch(url)
                .then(res => res.arrayBuffer())
                .then(arrayBuffer => audioContext.current.decodeAudioData(arrayBuffer))
                .then(audioBuffer => {
                    newAudioArray.push(audioBuffer);
                    if (newAudioArray.length === 12) {
                        setAudios(newAudioArray);
                        setIsLoaded(true);
                    };
                });
            index++;
        };
    }

    function handleKeyClick(keyIndex) {
        if (!isLoaded) return;
        const audio = audioContext.current.createBufferSource();
        audio.buffer = audios[keyIndex];
        audio.connect(gainNode.current);
        gainNode.current.gain.value = 0.3;
        gainNode.current.connect(audioContext.current.destination);
        audio.start();
    }

    function handleOctaveSwitch(action) {
        if (action) {
            if (octave < 5) {
                setOctave(octave + 1);
                setAudioIndex(audioIndex + 20);
            }
        } else {
            if (octave > 3) {
                setOctave(octave - 1);
                setAudioIndex(audioIndex - 20);
            }
        }
    }

    useEffect(() => {
        loadSound();
    }, [audioIndex])

    return (
        <>
            <Header title={"虚拟乐器"} />
            <div className='pi-wrapper'>
                <div className='piano'>
                    <div className="topFunc">
                        <div className="topFunc-left">
                            <h2>Piano</h2>
                            <p>EveryMusic</p>
                            <ul className="toneSwith">
                                <li className="tone1"></li>
                                <li className="tone2"></li>
                                <li className="tone3"></li>
                            </ul>
                        </div>
                        <div className="topFunc-right">
                            <div className="display">
                                <h2>{isLoaded ? `钢琴 - C${octave}` : '正在加载音频...'}</h2>
                            </div>
                            <div className="volume">
                                <div className="volumeKnobShadow">
                                    <div id="volumeKnob"></div>
                                    <div className="volumeInfo">
                                        <p>音量：50%</p>
                                    </div>
                                </div>
                                <div className="points">
                                    <div className="startPoint"></div>
                                    <div className="endPoint"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bottomFunc">
                        <div className="octaveSwitch">
                            <button id="upOct" onClick={() => handleOctaveSwitch(1)}>
                                <div className="triangleUp"></div>
                            </button>
                            <button id="downOct" onClick={() => handleOctaveSwitch(0)}>
                                <div className="triangleDown"></div>
                            </button>
                        </div>
                        <div className="pianoKeys">
                            <ul className="whiteKeys">
                                {
                                    whiteKeys.map((item, index) => {
                                        return (
                                            <li key={index} id={item} onClick={() => handleKeyClick(index)}></li>
                                        );
                                    })
                                }
                            </ul>
                            <ul className="blackKeys">
                                {
                                    blackKeys.map((item, index) => {
                                        return (
                                            <li key={index} id={item} onClick={() => handleKeyClick(index + 7)}></li>
                                        );
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
