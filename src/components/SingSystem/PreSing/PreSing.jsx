import React, {Fragment} from 'react'
import { Route } from 'react-router-dom'

import Header from '../../common/Header/Header';
import VocalWarmUp from './VocalWarmUp/VocalWarmUp'
import PreScenery from './PreScenery/PreScenery'
import ClassControl from '../ClassControl/ClassControl';

export default function PreSing(props) {
  
  return (
    <Fragment>
        <Header title={"课前准备"} />
        <Route path="/singsystem/presing/warmup" component={VocalWarmUp} />
        <Route path="/singsystem/presing/prescenery" render={() => <PreScenery {...props} />} />
        <ClassControl />
    </Fragment>
  )
}
