import React from 'react'

import * as iconImageHolder from '../../assets/image/icon-image-placeholder.svg'

const ImageFreeItem = props => {
  return (
    props.image ? (
      <div className="image-free-con">
        <img src={props.image} alt="" className="border-radius-lg"/>
      </div>
    ) : (
      <div className="image-con image-holder"
           style={{backgroundImage: `url(${iconImageHolder})`}}/>
    )
  )
}

export default ImageFreeItem