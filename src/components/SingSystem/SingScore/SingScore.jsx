import React, { useState, useEffect, Fragment } from 'react'

import Header from '../../common/Header/Header'

import './SingScore.css'

export default function SingScore(props) {

    // 分数
    const [score, setScore] = useState(0);

    useEffect(() => {
        let { rhythmScore, pitchAccuracy, streamStability } = props;
        if (isNaN(props.rhythmScore)) {
            rhythmScore = 0;
        }
        setScore((rhythmScore + pitchAccuracy + streamStability) / 3);
    }, [props])

    return (
        <Fragment>
            <Header title={"学习得分"} />
            <div className='ssc'>
                <div className='ssc-texts'>
                    <h1 className='ssc-songName'>综合得分</h1>
                    <span className='ssc-finalScore'>{Math.round(score)}</span>
                    <span>分</span>
                </div>
                <ul className='ssc-sections'>
                    <li className='ssc-rhythm ssc-section'>
                        <h2>节奏</h2>
                        <p className='ssc-section-score'>{isNaN(props.rhythmScore) ? 0 : Math.round(props.rhythmScore)}</p>
                    </li>
                    <li className='ssc-pitchAccu ssc-section'>
                        <h2>音准</h2>
                        <p className='ssc-section-score'>{Math.round(props.pitchAccuracy)}</p>
                    </li>
                    <li className='ssc-stream ssc-section'>
                        <h2>气息</h2>
                        <p className='ssc-section-score'>{Math.round(props.streamStability)}</p>
                    </li>
                </ul>
            </div>
        </Fragment>
    )
}
