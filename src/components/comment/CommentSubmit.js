import React, {Component} from 'react'

import {nativeActionType} from '../../consist/config'
import callNative from '../../util/callNative'
import {isLogin} from '../../util/owner'
import {checkNormal} from '../../util/verification'

import {postExploreComment} from '../../api'

import '../../assets/stylesheet/_commentSubmit.css'

class CommentSubmit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      shake: false
    }
  }

  onSubmit = () => {
    if (isLogin()) {
      let inputItem = checkNormal(this.textInput.value, 100)
      if (inputItem) {
        postExploreComment(this.props.id, inputItem)
          .then(() => {
            this.textInput.value = ''
            this.props.updateComments()
              .then(() => {
                window.scrollTo(0, document.body.clientHeight)
              })
          })
      } else {
        this.setState({
          shake: true
        })
        setTimeout(() => this.setState({
          shake: false
        }), 500)
      }
    } else {
      callNative(nativeActionType.login, {})
    }
  }

  render() {
    return (<section className={'position-bottom comment-submit ' + (this.state.shake ? 'shake' : '')}>
      <div className="input-con">
        <input type="text" placeholder="说点儿什么吧？" ref={input => this.textInput = input}/>
      </div>
      <button className="btn-default" onClick={this.onSubmit}>发表</button>
    </section>)
  }
}

export default CommentSubmit