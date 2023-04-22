import React, { Component } from 'react'
import { withRouter } from "react-router-dom";
import PubSub from 'pubsub-js';

import './Context.css'

// 引入静态资源
import tingTingSpeak from '../../../static/Lesson1/context/tingTing-Speak.png';

class Context extends Component {
    state = {
        isHidden: false,
        contextWords: [
          "嗨！我是听听，欢迎来到第一节课。这节课我们要学习的是音的性质，让我们先从一个视频开始吧！",
          "让我们先从音高开始学习！点击按钮，看看听听会有什么变化？",
          "看到面前的唱名了吗？试试用刚才学到的知识唱出正确的音高！在开口之前记得先点击一下页面上的按钮，听一听正确的音高哦！",
          "接下来，让我们来学习音的强弱吧！你可以对着听听大声唱歌，看看听听会有什么变化？",
          "听过火车鸣笛的声音吗？接下来，请你模仿火车的鸣笛声让火车前进吧!声音持续的时间越长，火车走得越远哦！",
          "音色就像糖果的口味，虽然大家吃的都是糖果，但每一颗糖果的口味都有所不同。点击屏幕上的乐器，感受不同乐器的声音",
        ],
    };
    
    componentDidMount() {
        this.pubsubToken = PubSub.subscribe("ROUTES_ORDER", (_, routesOrder) => {
          // 设置初始文本
          const initialPageIndex = routesOrder.indexOf(this.props.location.pathname);
          this.setState({ currentContextWord: this.state.contextWords[initialPageIndex] });
    
          // 订阅 PAGE_CHANGED 消息
          this.pageChangedToken = PubSub.subscribe("PAGE_CHANGED", (_, { pageIndex }) => {
            this.setState({
              isHidden: pageIndex === routesOrder.length - 1,
              currentContextWord: this.state.contextWords[pageIndex] || "",
            });
          });
        });
    }
    
    componentWillUnmount() {
        PubSub.unsubscribe(this.pubsubToken);
        PubSub.unsubscribe(this.pageChangedToken);
    }
    
    handleClick = () => {
        this.setState({ isHidden: true });
        PubSub.publish("CONTEXT_HIDDEN");
    };
    
    render() {
        const { isHidden, currentContextWord } = this.state;
        if (isHidden) {
            return null;
        }
    
        return (
            <div className='context-center'>
                <img className='context-tingTing' src={tingTingSpeak} alt="ttLost" />
                <h3 className='context-words'>{currentContextWord}</h3>
                <button className='context-ok' onClick={this.handleClick}>明白</button>
            </div>
        );
    }
}

export default withRouter(Context);