import React, { useState, useEffect } from 'react';
import PubSub from 'pubsub-js';
import pinyin from 'pinyin'; // 引入 pinyin 库

export default function LyricLearn() {
    const [currentLyric, setCurrentLyric] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        let token = PubSub.subscribe('isPlaying', (msg, isPlaying) => {
            setIsPlaying(true);
        });

        return () => {
            PubSub.unsubscribe(token);
        };
    })

    useEffect(() => {
        let token = PubSub.subscribe('currentLyric', (msg, lyric) => {
            // 去掉句子末尾的标点符号
            lyric = lyric.replace(/[\p{P}\p{S}]$/u, "");
            setCurrentLyric(lyric);
        });

        return () => {
            PubSub.unsubscribe(token);
        };
    }, []);

    const renderLyricWithPinyin = () => {
        // 使用 pinyin 库将中文转化为拼音
        const lyricPinyin = pinyin(currentLyric, {
            style: pinyin.STYLE_TONE, // 设置拼音风格为带有数字声调
            heteronym: false // 不显示多音字的多种读音
        }).flat();

        // 用 span 标签分别包装原始的中文字符和其对应的拼音
        let lyricWithPinyin = [];
        for (let i = 0; i < currentLyric.length; i++) {
            lyricWithPinyin.push(
                <span key={i} style={{ marginLeft: "0.1em", marginRight: "0.1em" }}>
                    <ruby>
                        {currentLyric[i]}<rt>{lyricPinyin[i]}</rt>
                    </ruby>
                </span>
            );
        }

        return lyricWithPinyin;
    };

    return (
        <div className='ll'>
            {
                isPlaying ?
                <h1 className='af-modeText sp-global-main-color' >{renderLyricWithPinyin()}</h1> :
                <div className='ll-title af-modeText sp-global-main-color'>
                    <h1>歌词认读模式</h1>
                    <p className='ll-desctiption' style={{ fontSize: '16px' }}>播放歌曲，认读歌词拼音</p>
                </div>
            }
        </div>
    );
}
