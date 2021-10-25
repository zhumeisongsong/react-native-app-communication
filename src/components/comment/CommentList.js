import React from 'react'

import ImageItem from '../../components/common/ImageItem'

import {formatDate} from '../../util/string'

import '../../assets/stylesheet/_commentList.css'
import * as IconComment from '../../assets/image/icon-comment.png'

const CommentList = props => {
  if (props.data) {
    return (<section className="comment-con">
      <header className="comment-title">
        <img src={IconComment} alt=""/>
        <span>评论({props.data.length})</span>
      </header>
      <section className="comment-list">
        {props.data.map((val, index) => (<div key={index} className="comment-item">
            <div className="author-info">
              <ImageItem image={val.author.avatar} photo="true"/>
              <div className="author-text">
                <h4>{val.author.nickname || '匿名'}</h4>
                <time>{formatDate(val.createTimestamp)}</time>
              </div>
            </div>
            <p className="comment-content">{val.content}</p>
          </div>)
        )}
      </section>
    </section>)
  } else
    return null
}

export default CommentList