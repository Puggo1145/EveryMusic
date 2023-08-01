import React, { useState, useEffect } from 'react';
import PubSub from 'pubsub-js';

import RhythmPractice from './RhythmPractice/RhythmPractice';
import LyricLearn from './LyricLearn/LyricLearn';
import PitchDetect from './PitchDetect/PitchDetect';

import './AudioFn.css';

export default function AudioFn(props) {

    const { mode, mainColor, songInfo } = props;

    const [isAudioLoaded, setIsAudioLoaded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const [modeContent, setModeContent] = useState(null);

    useEffect(() => {
        PubSub.subscribe('isPlaying', (msg, isPlaying) => {
            setIsPlaying(isPlaying);
        });
    }, [isPlaying]);

    useEffect(() => {
        let token = PubSub.subscribe('isAudioLoaded', (msg, isLoaded) => {
            setIsAudioLoaded(isLoaded);
        });

        return () => {
            PubSub.unsubscribe(token);
        };
    }, []);

    // 根据mode的值，切换渲染的内容内容
    useEffect(() => {
        switch (mode) {
            case 0:
                setModeContent(<div className='af-modeText sp-global-main-color'>
                    <h1>聆听模式</h1>
                    <p>请仔细聆听并认读歌词</p>
                </div>)
                break;
            case 1:
                setModeContent(<RhythmPractice rhythm={songInfo.rhythm}/>)
                break;
            case 2:
                setModeContent(<LyricLearn />)
                break;
            case 3:
                setModeContent(<PitchDetect />)
                break;
            default:
                setModeContent(<h1 className='af-modeText sp-global-main-color'>聆听模式：请仔细聆听</h1>)
                break;
        }
    }, [mode]);

    function handleModeSwitch(isNext) {
        PubSub.publish('modeSwitch', isNext);
    }

    return (
        <div className='af'>
            {isAudioLoaded && mode !== 0 && <button className='af-prevFn af-btn' onClick={() => handleModeSwitch(false)}></button>}
            <div className='af-wrapper' style={{borderRadius: mode === 3 && '16px'}}>
                {isPlaying && mode !== 1 && mode !== 3 && <div className='af-play-circle'></div>}
                {
                    !isAudioLoaded ?
                        <h1 className='af-modeText' style={{ color: mainColor }}>正在加载歌曲，请稍后...</h1> :
                        modeContent
                }
            </div>
            {isAudioLoaded && mode !== 3 && <button className='af-nextFn af-btn' onClick={() => handleModeSwitch(true)}></button>}
        </div>
    )
}
