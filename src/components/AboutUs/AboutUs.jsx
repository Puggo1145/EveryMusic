import React from 'react'

import Header from '../common/Header/Header.jsx'

import './AboutUs.css'

export default function AboutUs() {
    return (
        <>
            <Header title={"关于我们"} />
            <div className='au'>
                <h1>寻找技术与人文关怀的十字路口</h1>
                <p>人人音乐家始终关注技术背后的现实意义，希望通过技术手段推动教育公平，让有趣的知识能够为更多人所共享。</p>
                <p>本产品主要面向乡村小学，缓解因教育资源不足而带来的音乐学习问题。教师只需在电子白板打开该产品，按照产品内功能的指引，即可进行音乐教学，无需专业的音乐背景。</p>
                <h1>开发者团队</h1>      
                <p>以下是产品开发者名单，在此列出以表示感谢。同时，我们期待有更多人能够加入我们，一起推动教育进步</p>
                <ul className='au-cards au-developers'>
                    <li>
                        <h3>赵一蔚</h3>
                        <p>产品经理/前端开发</p>
                        <p>联系方式：puggoo1145@gmail.com</p>
                    </li>
                    <li>
                        <h3>胡凯</h3>
                        <p>运维/课程设计</p>
                    </li>
                    <li>
                        <h3>高梓竣</h3>
                        <p>后端开发</p>
                    </li>
                </ul>
                <h1>技术总览</h1>
                <p>该产品背后有多项技术支持，在此感谢开源模型的提供方：modelScope/ultimateVocalRemover，让我们能够将音频技术应用到教育事业中</p>     
                <ul className='au-cards au-tech'>
                    <li>
                        <h3>React</h3>
                        <p>一个用于构建用户界面的前端框架，以组件式的思维完成工程化开发</p>
                    </li>
                    <li>
                        <h3>MDX-NET</h3>
                        <p>使用了混合频谱的音源分离模型</p>
                    </li>
                    <li>
                        <h3>Paraformer-large</h3>
                        <p>来自modelScope达摩院的语音识别模型</p>
                    </li>
                    <li>
                        <h3>EM-pitch-fine tone</h3>
                        <p>基于pitchy和AMDF的音频精调算法</p>
                    </li>
                </ul>
            </div>
        </>
    )
}
