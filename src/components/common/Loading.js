import React from 'react'
import {ActivityIndicator} from 'antd-mobile'

const Loading = props => {
  return (
    <ActivityIndicator
      toast animating={props.animating} size="large" text=""/>
  )
}

export default Loading