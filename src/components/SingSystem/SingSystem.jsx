import React, { useState, useEffect, Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import PubSub from 'pubsub-js';

import SongSelection from './SongSelection/SongSelection';
import PreSing from './PreSing/PreSing';
import SingPanel from "./SingPanel/SingPanel.jsx"
import SingScore from './SingScore/SingScore';
import VocalRangeTest from './VocalRangeTest/VocalRangeTest';
import SongUpload from './SongUpload/SongUpload';

import './SingSystem.css';

export default function SingSystem(props) {

  const [songInfo, setSongInfo] = useState({});//[sourceTag, type]

    // 接收分数
  const [score, setScore] = useState({
    rhythmScore: 0,
    pitchAccuracy: 0,
    streamStability: 0,
  });

  useEffect(() => {
    const rhythmScoreToken = PubSub.subscribe('rhythmScore', (msg, rscore) => {
      setScore(score => ({ ...score, rhythmScore: rscore }));
    });

    const pitchScoreToken = PubSub.subscribe('pitchScore', (msg, pscore) => {
      setScore(score => ({ ...score, pitchAccuracy: pscore }));
    });

    const streamScoreToken = PubSub.subscribe('streamScore', (msg, sscore) => {
      setScore(score => ({ ...score, streamStability: sscore }));
    });

    return () => {
      PubSub.unsubscribe(rhythmScoreToken);
      PubSub.unsubscribe(pitchScoreToken);
      PubSub.unsubscribe(streamScoreToken);
    }
  }, [])

  // 背景色处理
  useEffect(() => {
    // 组件挂载，背景色改变
    document.body.style.backgroundColor = "#F2F1F8";

    // 在组件卸载时恢复原始背景色
    return () => {
      document.body.style.backgroundColor = "#fff";
    };
  }, []);

  useEffect(() => {
    const songInfo = PubSub.subscribe('songInfo', (msg, data) => {
      setSongInfo(data);
    });

    return () => {
      PubSub.unsubscribe(songInfo);
    }
  }, []);

  return (
    <Fragment>
      <Switch>
        <Route path="/singsystem/songselection" render={() => <SongSelection {...props}/>}/>
        <Route path="/singsystem/singpanel" component={SingPanel} />
        <Route path="/singsystem/presing" render={() => <PreSing {...props} {...songInfo} />} />
        <Route path="/singsystem/singscore" render={() => <SingScore {...score}/>}/>
        <Route path="/singsystem/vocalrangetest" component={VocalRangeTest} />
        <Route path="/singsystem/songupload" component={SongUpload} />
      </Switch>
    </Fragment>
  );
};
