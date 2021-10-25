import React from 'react'
import ImageItem from '../common/ImageItem'

const Recommend = props => {
  if (JSON.stringify(props.data) !== '{}') {
    return (<header>
      {Array(2).fill(true).map((e, index) => (
        <div className="list-item ui-border-b" key={'top' + (index + 1)}>
          <div className="text-con">
            <h3 className="title-item">{props.data['title' + (index + 1)]}</h3>
          </div>
          <ImageItem image={props.data['topImage' + (index + 1)]}/>
        </div>
      ))}
    </header>)
  } else {
    return null
  }
}

export default Recommend
