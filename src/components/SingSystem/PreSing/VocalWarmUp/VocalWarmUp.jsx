import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

import './VocalWarmUp.css'

export default function VocalWarmUp() {
    const [isStart, setIsStart] = useState(false);
    const [countDownNum, setCountDownNum] = useState(3); //3-0
    const [pitchIndex, setPitchIndex] = useState(null); //0-6
    const [pitchIndicator, setPitchIndicator] = useState([
        { pitch: 'Do', checked: false },
        { pitch: 'Re', checked: false },
        { pitch: 'Mi', checked: false },
        { pitch: 'Fa', checked: false },
        { pitch: 'Sol', checked: false },
        { pitch: 'La', checked: false },
        { pitch: 'Si', checked: false },
        { pitch: 'Do+', checked: false },
    ]);
    const [ocatve, setOcatve] = useState([
        "C大调", "C#大调", "D大调", "D#大调", "E大调", "F大调", "完成"
    ]); //0-6
    const audioRef = useRef();

    // 倒计时
    useEffect(() => {
        let timer;
        if (isStart && countDownNum > 0) {
            timer = setInterval(() => {
                setCountDownNum(countDownNum - 1);
            }, 1000);
        } if (isStart && countDownNum === 0) {
            setTimeout(() => {
                warmingUpAudio();
                setCountDownNum(-1);
                setPitchIndex(0);
            }, 1000);
        }

        return () => clearInterval(timer);  // 清理定时器
    }, [countDownNum, isStart]);

    // 开嗓核心逻辑
    useEffect(() => {
        let timer;
        let newPitchIndicator
        // console.log(pitchIndex + "--" + Math.ceil((pitchIndex + 1) / 7));
        if (pitchIndex !== null && pitchIndex < 48) {
            // 先处理pitchIndicator的checked
            newPitchIndicator = pitchIndicator.map((obj, index) => {
                if (index === pitchIndex % 8) {
                    return { pitch: obj.pitch, checked: true };
                } else {
                    return { pitch: obj.pitch, checked: false };
                }
            })
            setPitchIndicator(newPitchIndicator);

            // 再处理pitchIndex的递增，因为pitchIndex的递增是在pitchIndicator的checked处理之后
            timer = setInterval(() => {
                setPitchIndex(pitchIndex + 1);
            }, 500);
        } else if (pitchIndex !== null && pitchIndex === 48) {
            newPitchIndicator = pitchIndicator.map((obj) => {
                return { pitch: obj.pitch, checked: true };
            })
            setPitchIndicator(newPitchIndicator);
            setTimeout(() => {
                setIsStart(false);
            }, 2000);
        }

        return () => clearInterval(timer);
    }, [pitchIndex]);

    useEffect(() => {
        audioRef.current = new Audio(require('../../../../static/SingSystem/SingWarmUp/warmUpAudio.mp3'));

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    function startWarmUp() {
        setIsStart(true);
    }

    function warmingUpAudio() {
        if (audioRef.current) {
            audioRef.current.play();
        }
    };

    // 背景色处理
    useEffect(() => {
        // 组件挂载，背景色改变
        document.body.style.backgroundColor = "#F2F1F8";

        // 在组件卸载时恢复原始背景色
        return () => {
            document.body.style.backgroundColor = "#fff";
        };
    }, []);

    return (
        <div className='vwu'>
            <div className='vwu-left'>
                <div className='vwu-texts'>
                    <h1 className='vwu-title'>开嗓练习：唱出正确音高</h1>
                    <p className='vwu-description'>现在是：{ocatve[Math.ceil((pitchIndex + 1) / 8) - 1]}</p>
                    <Link className='vmu-btn' to='/singsystem/vocalrangetest' style={{color: "#496ce7"}}>不确定应该唱多高？点击测试一下你的音域</Link>
                    {!isStart ?
                        <div className='vwu-control-btn'>
                            <button className='vwu-start vwu-btn' onClick={startWarmUp}>开始</button>
                            <Link className='vwu-next vwu-btn' to="/singsystem/presing/prescenery">下一环节</Link>
                        </div>
                        : null
                    }
                </div>
                {isStart ? <h1 className='vwu-pitch'>{countDownNum > 0 ? countDownNum : countDownNum === 0 ? "开始" : pitchIndex < 48 ? pitchIndicator[pitchIndex % 8].pitch : "完成"}</h1> : null}
            </div>
            <ul className='vwu-pitch-indicator'>
                {
                    pitchIndicator.map((item, index) => {
                        return (
                            <li
                                key={item.pitch}
                                className={`vwu-pitch-indicator-item pitch-${item.pitch}`}
                                style={{
                                    height: `${(index + 1) * 50}px`,
                                    backgroundColor: `${item.checked ? '#496ce7' : '#b8c3e9'}`
                                }}
                            ></li>
                        );
                    })
                }
            </ul>
        </div>
    )
}
