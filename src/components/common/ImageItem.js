import React from 'react'

import * as iconImageHolder from '../../assets/image/icon-image-placeholder.svg'
import * as iconPhotoDefault from '../../assets/image/icon-profile-default.svg'

const ImageItem = props => {
  return (
    props.image ? (
      <div className="image-con"
           style={{backgroundImage: `url(${props.image})`}}/>
    ) : (
      props.photo ? (
        <div className="image-con photo-holder"
             style={{backgroundImage: `url(${iconPhotoDefault})`}}/>
      ) : (
        <div className="image-con image-holder"
             style={{backgroundImage: `url(${iconImageHolder})`}}/>
      )
    )
  )
}

export default ImageItem