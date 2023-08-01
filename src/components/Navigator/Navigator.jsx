import React from 'react'
import { Link } from 'react-router-dom';

import Header from '../common/Header/Header';

import './Navigator.css';

import goWithClassImg from '../../static/Navigator/goWithClass.png';
import interactiveLesson from '../../static/Navigator/interactiveLesson.png';
import playInstrument from '../../static/Navigator/playInstrument.png';
import { useState } from 'react';

export default function Navigator() {

  const [isLoginToken, setIsLoginToken] = useState(getCookieValue("token"));

  function getCookieValue(cookieName) {
    const cookieString = decodeURIComponent(document.cookie); // 解码 cookie
    const cookies = cookieString.split("; "); // 将 cookie 字符串拆分成数组

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const [name, value] = cookie.split("="); // 拆分出 cookie 的名称和值

      if (name === cookieName) {
        return value; // 找到指定名称的 cookie 值并返回
      }
    }

    return ""; // 如果找不到指定名称的 cookie，则返回空字符串
  }


  return (
    <div className='ng'>
      <Header title={"模式选择"} />
      <h1 className='ng-description'>选择您的学习方式</h1>
      <p style={{ textAlign: 'center', color: '#333' }}>{!isLoginToken && '登陆以使用完整功能!'}</p>
      <div className='ng-content'>
        {isLoginToken ? (
          <Link className='ng-content-item' to="/singsystem/songselection">
            <h2 className='ng-content-item-title'>学唱歌</h2>
            <p className='ng-content-item-description'>和人人音乐家一起，唱你喜欢的歌曲</p>
            <div className='ng-content-item-levelmark' style={{ color: "#496CE7" }}>唱歌教学</div>
            <img className='ng-content-item-img' src={goWithClassImg} alt="" />
          </Link>
        ) : (
          <div className='ng-content-item ng-content-item-notlogin'>
            <h2 className='ng-content-item-title'>学唱歌</h2>
            <p className='ng-content-item-description'>和人人音乐家一起，唱你喜欢的歌曲</p>
            <div className='ng-content-item-levelmark' style={{ color: "#496CE7" }}>唱歌教学</div>
            <img className='ng-content-item-img' src={goWithClassImg} alt="" />
          </div>
        )}
        <Link className='ng-content-item' to="/learn">
          <h2 className='ng-content-item-title'>互动课程</h2>
          <p className='ng-content-item-description'>在互动中学习音乐</p>
          <div className='ng-content-item-levelmark' style={{ color: "#FFC043" }}>专题课程</div>
          <img className='ng-content-item-img' src={interactiveLesson} alt="" />
        </Link>
        <Link className='ng-content-item' to="/playinstrument">
          <h2 className='ng-content-item-title'>虚拟乐器</h2>
          <p className='ng-content-item-description'>使用虚拟乐器演奏</p>
          <div className='ng-content-item-levelmark' style={{ color: "#7ac70c" }}>虚拟乐器</div>
          <img className='ng-content-item-img' src={playInstrument} alt="" />
        </Link>
      </div>
    </div>
  )
}
