import React, {Component} from 'react'

import Back from '../../components/common/Back'
import Loading from '../../components/common/Loading'
import CommentList from '../../components/comment/CommentList'
import CommentSubmit from '../../components/comment/CommentSubmit'

import _UA from '../../consist/UA'
import {formatDate} from '../../util/string'

import {getExploreItem} from '../../api/index'

import '../../assets/stylesheet/detail.css'

class ExploreDetail extends Component {
  state = {
    id: this.props.match.params.id,
    dataSource: {},
    title: '详情',
    hiddenNativeTabs: false,
    shareIcon: {
      data: {}
    }
  }

  onFetchData = async function (id) {
    const res = await getExploreItem(id)
    this.setState({
      dataSource: res,
      animating: true,
      shareIcon: {
        shown: true,
        data: {
          share_url: window.location.href,
          share_tit: res.title,
          share_img: res.bannerImage,
          share_des: res.abstract
        }
      }
    })
  }

  componentDidMount() {
    this.onFetchData(this.state.id)
      .then(() => {
        this.setState({
          animating: false
        })
      })
  }

  render() {
    const article = (<article>
      <header className="detail-common">
        <div className="common-item">
          <h2 className="detail-title">{this.state.dataSource.title}</h2>
          <time className="detail-time">{formatDate(this.state.dataSource.createTimestamp)}</time>
        </div>
      </header>
      <section className="rich-text">
        <div dangerouslySetInnerHTML={{
          __html: this.state.dataSource.content
        }}/>
      </section>
    </article>)

    if (JSON.stringify(this.state.dataSource) !== '{}') {
      return (<div className="main-con explore-detail">
        { _UA.isWebview &&
        <Back title={this.state.title} hiddenNativeTabs={this.state.hiddenNativeTabs} shareIcon={this.state.shareIcon}/>
        }
        <div className="scroll-con" style={_UA.isWebview ? {} : {top: '0'}}>
          {article}
          <CommentList data={this.state.dataSource.comments}/>
        </div>
        { _UA.isWebview &&
        <CommentSubmit id={this.state.dataSource.id} updateComments={this.onFetchData.bind(this, this.state.id)}/>
        }
      </div>)
    } else {
      return <Loading animating={this.state.animating}/>
    }
  }
}

export default ExploreDetail