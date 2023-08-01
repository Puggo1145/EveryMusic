import React, { useState, useEffect } from 'react'

import './SongInfo.css';

export default function SongInfo(props) {

  const [songCover, setSongCover] = useState(null);

  useEffect(() => {
    import(`../../../../static/SingSystem/songResource/${props.sourceTag}/songCover.png`)
    .then(songCover => {
      setSongCover(songCover.default);
    })
  }, [props.sourceTag])

  return (
    <div className='si'>
        <div className="si-information">
            <h1 className='si-title'>{props.name}</h1>
            <p className='si-author'>{props.author}</p>
        </div>
        <div className='si-songcover' style={{backgroundImage: `url(${songCover})`}} />
    </div>
  )
}
