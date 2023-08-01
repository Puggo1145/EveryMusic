import React, { useState, useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom'
import PubSub from 'pubsub-js';

import Header from '../../common/Header/Header'

import './SongSelection.css';
import lock from '../../../static/SingSystem/songSelection/lock.png'

export default function SongSelection(props) {

    const [songList] = useState([
        { id: "s-01", sourceTag: "nationalAnthem", name: "义勇军进行曲", description: "中华人民共和国国歌", accessible: true, type: 0 },
        { id: "s-02", sourceTag: "littleBoy", name: "小小少年", description: "小小少年 很少烦恼", accessible: true, type: 0 },
        { id: "a-03", sourceTag: "wabjtam", name: "我爱北京天安门", description: "天安门上太阳升", accessible: true, type: 0 },
        { id: "a-04", sourceTag: "cef", name: "虫儿飞", description: "黑黑的天空低垂", accessible: true, type: 0 },
        { id: "s-05", sourceTag: "xyz", name: "小燕子", description: "穿花衣", accessible: true, type: 0 },
        { id: "l-06", sourceTag: "ctznl", name: "春天在哪里", description: "春天在那青翠的山林里", accessible: true, type: 0 },
        { id: "s-07", sourceTag: "xxx", name: "小星星", description: "一闪一闪亮晶晶", accessible: true, type: 0 },
        { id: "s-08", sourceTag: "rwmdqsj", name: "让我们荡起双桨", description: "小船儿推开波浪", accessible: true, type: 0 },
        { id: "s-09", sourceTag: "lbh", name: "鲁冰花", description: "夜夜想起妈妈的话", accessible: true, type: 0 },
    ])

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
        <Fragment>
            <Header title={"歌曲选择"} />
            <div className='ssl'>
                <div className='ssl-wrapper'>
                    <h1 className='ssl-title'>选择要学习的内容</h1>
                    <p className='ssl-description'>按照顺序学习，学习效果更佳哦</p>
                    <ul className='ssl-contentList'>
                        {
                            songList.map((item, index) => {
                                return (
                                    <li className='ssl-contentList-item' key={item.id}>
                                        <Link
                                            className={`ssl-contentList-item-link ${item.accessible && "ssl-content-accessible"}`}
                                            style={{ backgroundImage: item.sourceTag === "" ? `url(${lock})` : `url(${require(`../../../static/SingSystem/songResource/${item.sourceTag}/songCover.png`)})` }}
                                            to={
                                                item.accessible
                                                    ? "/singsystem/presing/warmup"
                                                    : "#"
                                            }
                                            onClick={(event) => {
                                                if (!item.accessible) {
                                                    event.preventDefault();
                                                } else {
                                                    PubSub.publish('songInfo', { sourceTag: item.sourceTag, type: item.type })
                                                }
                                            }}
                                        >
                                            <div className='ssl-contentList-item-texts'>
                                                <div className='ssl-contentList-item-link-title'>{item.name}</div>
                                                <div className='ssl-contentList-item-link-description'>{item.description}</div>
                                            </div>
                                        </Link>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <Link className='ss-uploadSong' to='/singsystem/songupload'>上传歌曲</Link>
                </div>
            </div>
        </Fragment>
    )
}
