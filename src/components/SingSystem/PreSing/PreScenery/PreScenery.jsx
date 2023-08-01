import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import './PreScenery.css'

import tingTing from "../../../../static/SingSystem/PreScenery/tingTing.png"

export default function PreScenery(props) {

  const [preSceneryImg, setPreSceneryImg] = useState(null);
  const [songInfo, setSongInfo] = useState({
    name: "",
    description: [],
    question: "",
  });

  useEffect(() => {
    import(`../../../../static/SingSystem/songResource/${props.sourceTag}/preSceneryImg.png`)
      .then(res => {
        setPreSceneryImg(res.default);
      })
      .catch(error => {
        console.error("无法获取图片，检查图片路径或名称是否正确", error);
      });
  }, []);

  useEffect(() => {
    import(`../../../../static/SingSystem/songResource/${props.sourceTag}/songInfo.json`)
      .then(res => {
        setSongInfo(res);
      })
      .catch(error => {
        console.error("无法获取歌曲信息，检查文件路径或名称是否正确", error);
      });
  }, [props.sourceTag]);

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
    <div className='ps'>
      <h1 className='ps-title'>情景引入</h1>
      <div className='ps-content'>
        <img className='ps-content-img' src={preSceneryImg} alt="" />
        <p className='ps-content-description'>
          {songInfo.description.map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </p>
      </div>
      <div className='ps-bottom'>
        <img className="ps-bottom-tingTing" src={tingTing} alt="" />
        <p>{songInfo.question}</p>
        <Link
          className="ps-next"
          to={{
            pathname: "/singsystem/singPanel",
            state: {
              mode: 0, songInfo: {
                sourceTag: props.sourceTag,
                name: songInfo.name,
                author: songInfo.author,
                mainColor: songInfo.mainColor,
                lyrics: songInfo.lyrics,
                rhythm: songInfo.rhythm,
              }
            }
          }}
        >
          开始聆听
        </Link>
      </div>
    </div>
  )
}
