import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import PubSub from 'pubsub-js'
import { useHistory } from 'react-router-dom'

import './SongUpload.css'
import Header from '../../common/Header/Header'

export default function SongUpload() {
  
  const history = useHistory()

  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const fileInputRef = useRef(null);
  const [response, setResponse] = useState({});

  const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'audio/mpeg' || file.type === 'audio/wav')) {
      uploadFile(file);
    } else {
      setUploadMessage("请上传mp3或wav格式的音频文件");
    }
  };

  const uploadFile = (file) => {
    setUploading(true);
    setUploadMessage("正在分析，这需要一些时间，请耐心等待...");
    const formData = new FormData();
    formData.append('file', file);

    axios.post('https://www.everymusic.cn/api/songInfo/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      setTimeout(() => {
        setUploading(false);
        if (response.data.code === 20000) {
          setResponse(response.data.data);
          setUploadMessage("分析完成，正在进入唱歌系统");
        } else {
          setUploadMessage("分析失败，云函数错误，请转至阿里云函数计算控制台！");
        }
      }, 40000 + Math.random()*40000)
    }).catch(error => {
      setUploading(false);
      setUploadMessage(`Upload error: ${error}`);
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    if (response.name) {
      PubSub.publish('analyzedSongInfo', response);
      setTimeout(() => {
        history.push({
          pathname: '/singsystem/singpanel',
          state: { songInfo: response, type: 1 } //mode 2代表使用解析的歌曲信息
        });
      }, 1000);
    }
  }, [response, history]);

  return (
    <>
      <Header title={"上传歌曲"} />
      <div className='su'>
        <div className='su-top-texts'>
          <h1>自己选择歌曲</h1>
          <p>基于深度学习技术的serverless歌曲分析功能，集成多个模型，自动提取歌曲人声与伴奏、标注节奏、生成歌词，让学习不受限</p >
          <p>功能仍在测试中，仅支持中文歌曲！算力即将耗尽，仅供管理员账号使用</p >
        </div>
        <div className='su-upload-btn' onClick={triggerFileInput}>
          <p>上传歌曲</p >
          <p>支持 wav/mp3 格式</p >
          <input
            type="file"
            onChange={onFileChange}
            disabled={uploading}
            style={{ display: 'none' }}
            ref={fileInputRef}
          />
          <p className='su-upload-uploadMessage'>{uploadMessage}</p >
        </div>
        <ul className='su-upload-models'>
          <li className='su-models-uvr'>
            <h3>MDX-NET</h3>
            <p>使用了混合频谱的音源分离模型</p >
          </li>
          <li className='su-models-pl'>
            <h3>Paraformer-large</h3>
            <p>来自modelScope达摩院的语音识别模型</p >
          </li>
          <li className='su-models-pitch'>
            <h3>everymusic-fine tone</h3>
            <p>人人音乐家音高识别算法</p >
          </li>
        </ul>
      </div>
    </>
  )
}