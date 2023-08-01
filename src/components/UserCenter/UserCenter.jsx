import React, { useState, useEffect, Fragment } from 'react'
import { Link,useLocation } from 'react-router-dom'

import Header from '../common/Header/Header'

import schoolIcon from '../../static/UserCenter/school.png'

import './UserCenter.css'
import axios from 'axios'

export default function UserCenter() {
	
	const [songList] = useState([
		{ id: 1, sourceTag: "nationalAnthem", name: "义勇军进行曲", description: "中华人民共和国国歌", accessible: true, type: 0 },
		{ id: 2, sourceTag: "littleBoy", name: "小小少年", description: "小小少年 很少烦恼", accessible: true, type: 0 },
		{ id: 3, sourceTag: "wabjtam", name: "我爱北京天安门", description: "天安门上太阳升", accessible: false, type: 1 },
	])
	
  const location = useLocation();
  const user = location.state.user;

  //给老师命名
  const [userName] = useState(user.username+'老师')
  const [isClassSwitching, setIsClassSwitching] = useState(false)
  const [res, setRes] = useState(false);
  
  useEffect(() => {
	//获取班级信息请求
	axios.get("https://www.everymusic.cn/api/class/"+user.id)
	.then(response=>{
	  setRes(response.data.data);
	  const classArray = response.data.data.map(i => i.className);
	  setClasses(classArray);
	}).catch(err => console.log(err.message));
  }, [user.id])
  
  
  const initialClasses = [1,2,3]; // 根据实际情况设置班级数量
  const [currentClass, setCurrentClass] = useState(initialClasses[0])
  const [classes, setClasses] = useState(initialClasses)
  
  
  const [singProcess, setSingProcess] = useState(1)
  const [lessonProcess] = useState(1)

  function handleClassSwitch() {
    setIsClassSwitching(!isClassSwitching)
  }

  function handleClassSelect(classNumber) {
	var id = 0;
    setCurrentClass(classNumber)
	
	//根据班级名称查询到班级id
	res.map((i, index) =>{
		if(i.className === classNumber){
			id = i.classId;
      return id;
    }
    return '';
	});
	
	//发送请求获取单个班级的信息
	axios.get("https://www.everymusic.cn/api/class/classNumber/"+id)
	.then(response => {
		const {data} = response.data;
		setSingProcess(data.source.length)
	}).catch(err => console.log(err.message));
	
    // 将选择的班级移动到数组的最前面
    setClasses(prevClasses => {
      const newClasses = prevClasses.filter(c => c !== classNumber)
      newClasses.unshift(classNumber)
      return newClasses;
    })
    setIsClassSwitching(false)
  }
  return (
    <Fragment>
      <Header title={"个人中心"} />
      <div className='uc'>
        <div className='uc-top'>
          <div className='uc-userInfo'>
            <div className='uc-head'>A</div>
            <div className='uc-greet-texts'>
              <h1>{userName}，您好！</h1>
              <p>当前班级为：{currentClass}班</p>
              <div className='uc-school'>
                <img src={schoolIcon} alt="" />
                <span>{user.school}</span>
              </div>
            </div>
          </div>
          <ul className='uc-classSwitch' onClick={handleClassSwitch}>
            {isClassSwitching ? classes.map((classNumber, index) => (
              <li
                key={index}
                className='uc-classSwitch-item'
                onClick={() => handleClassSelect(classNumber)}
              >
                {classNumber === currentClass ? `当前班级：${classNumber}班` : `${classNumber}班`}
              </li>
            )) : (
              <li
                className='uc-classSwitch-item'
              >
                {`当前班级：${currentClass}班`}
              </li>
            )}
          </ul>
        </div>
        <div className='uc-addUp'>
          <h1 className='uc-addUp-title'>数据统计</h1>
          <ul className='uc-addUp-content'>
            <li className='uc-addUp-content-item'>
              <h5>{(singProcess + lessonProcess) * 39 * 3}min</h5>
              <p>教学时长</p>
            </li>
            <li className='uc-addUp-content-item'>
              <h5>{singProcess + lessonProcess}节</h5>
              <p>累计课时</p>
            </li>
          </ul>
        </div>
        <div className='uc-main'>
          <h1 className='uc-main-title'>课程</h1>
          <ul className='uc-main-content'>
            <li className='uc-singProcess'>
              <Link to="/singsystem/songselection">唱歌课进度：{songList[singProcess-1].name}</Link>
              <div className='uc-progress-info'>
                <div className='uc-progressBar'>
                  <div className='uc-progressBar-progress' style={{ width: `${80 * singProcess / 9}%`, backgroundColor: '#3a55c4' }}></div>
                </div>
                {Math.round(singProcess / 9 * 100)}%
              </div>
            </li>
            <li className='uc-lessonProcess'>
              <Link to="/learn">互动课程进度：音的性质</Link>
              <div className='uc-progress-info'>
                <div className='uc-progressBar'>
                  <div className='uc-progressBar-progress' style={{ width: `${80 * lessonProcess / 9}%`, backgroundColor: '#e6a00f' }}></div>
                </div>
                {Math.round(lessonProcess / 9 * 100)}%
              </div>
            </li>
            <li className='uc-musicLearn'>
              <a>教育资源</a>
              <div className='uc-musicLearn-resource'>
                <a className='uc-musicLearn-resource-item' target='_blank' rel="noreferrer" href="https://basic.smartedu.cn/syncClassroom/prepare">备课资料</a>
                <a className='uc-musicLearn-resource-item' target='_blank' rel="noreferrer" href="https://basic.smartedu.cn/tchMaterial?defaultTag=dfb9da8a-2ae2-4b2e-a733-687e0252443f%2F266ea209-a85e-42e7-af40-79d0091d874f%2F50cf54f7-406f-4755-ba72-bc26e70ebb15%2Fea9d7b2d-dc8e-4757-9d4b-d61456ac9d67">原版教材</a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Fragment>
  )
}
