import axios from 'axios'
import {camelizeKeys} from 'humps'
import _ from 'lodash'

import {API_HOST_DEV, API_HOST_PRO} from '../consist/config'
import {formatDate} from '../util/string'
import {toString} from '../util/array'
import {getToken, isLogin} from '../util/owner'

if (process.env.NODE_ENV === 'production') {
  axios.defaults.baseURL = API_HOST_PRO
} else {
  axios.defaults.baseURL = API_HOST_DEV
}

const fetchAuthToken = () => {
  let token = getToken()
  if (isLogin()) {
    axios.defaults.headers.common['Authorization'] = `Token ${token}`
  } else {
    axios.defaults.headers.common['Authorization'] = null
  }
}

/**
 * format Json
 */
const formatLocationJson = originalData => {
  let list = originalData.results
  let location = {}

  for (let i in list) {
    location[list[i].id] = list[i].location
  }

  return location
}

const separateItemJson = originalData => {
  const data = {
    'common': {},
    'customized': {},
    'priceItems': {}
  }

  for (let key in originalData) {
    let commomArr = [
      'id',
      'name',
      'create_timestamp',
      'edit_timestamp',
      'abstract',
      'is_product',
      'thumbnail_image',
      'cover_image',
      'advertise',
      'template',
      'collected']

    if (key.substr(0, 1) === '_' || key === 'prices') {
      data.priceItems[key] = originalData[key]
    } else if (commomArr.indexOf(key) !== -1) {
      data.common[key] = originalData[key]
    } else {
      data.customized[key] = originalData[key]
      if (key === 'time') {
        data.customized[key] = formatDate(originalData[key])
      }
    }
  }

  return data
}

const formatTemplateJson = originalData => {
  let data = {}
  let keyArr = []
  for (let i in originalData) {
    keyArr.push(originalData[i].code)
    data[keyArr[i]] = originalData[i].name
  }

  return data
}

const formatCustomizedJson = (originalData, templateData) => {
  let data = {}
  for (let i in originalData) {
    if (!_.isObject(originalData[i])) {
      if (i.indexOf('image') !== -1) {
        data[i] = {}
        let key = i.replace(/_image/, '')
        data[key]['image'] = originalData[i]
        delete data[i]
      } else {
        data[i] = data[i] || {}
        data[i]['name'] = templateData[i]
        data[i]['value'] = originalData[i]
      }
    } else {
      if (i === 'location') {
        data[i] = {}
        data[i]['name'] = templateData[i]
        data[i]['value'] = originalData[i]['name']
      }
    }
  }

  return data
}

const formatPriceJson = (originalData, templateData) => {
  let data = {}
  let priceData = originalData.prices
  let keyArr = []
  let mergeArr = []

  for (let i in originalData) {
    if (!_.isObject(originalData[i])) {
      data[i] = {}
      data[i]['value'] = []
      data[i]['name'] = templateData[i]
      data[i]['value'].push({
        'name': originalData[i],
        'value': priceData[i + '_price'],
        'postKey': i
      })

      if (/\d/gi.test(i)) {
        mergeArr.push(i)
      } else {
        keyArr.push(i)
      }
    } else {
      let j = i.substr(0, i.length - 1)
      data[j] = {}
      data[j]['name'] = templateData[j]
      data[j]['value'] = priceData[j]
      data[j]['postKey'] = j
    }
  }

  for (let i in mergeArr) {
    for (let j in keyArr) {
      if (j.indexOf(i) !== -1) {
        let key = keyArr[j]
        let mergeKey = mergeArr[i]
        data[key]['value'].push(data[mergeKey]['value'][0])
        delete data[mergeKey]
      }
    }
  }

  return data
}

const formatItemJson = (itemData, templateData) => {
  let data = separateItemJson(itemData)
  let template = formatTemplateJson(templateData)
  let customizedData = formatCustomizedJson(data.customized, template)
  let priceData = formatPriceJson(data.priceItems, template)

  data.customized = customizedData
  data.priceItems = priceData

  return data
}

const getTemplate = id => {
  return axios.get(`templates/${id}`)
    .then(res => res.data.attributes)
}

const getItems = (page, id) => {
  return axios.get(`items?page=${page}&topic=${id}`)
    .then(res => camelizeKeys(res.data))
}

/**
 * index
 */
export const getCommercials = () => {
  return axios.get('items/ads')
    .then(res => camelizeKeys(res.data))
}

export const getRecommend = page => {
  return axios.get(`items/highlight?page=${page}`)
    .then(res => camelizeKeys(res.data))
}

export const getTopics = () => {
  return axios.get('topics')
    .then(res => camelizeKeys(res.data))
}

/**
 * topic
 */
export const getTopic = (id, page) => {
  let topicId
  let data = {}
  return axios.get(`topics/${id}`)
    .then(res => {
      data.common = res.data
      topicId = res.data.id
    })
    .then(() => {
      return getItems(page, topicId)
        .then(res => {
          res.location = formatLocationJson(res)
          data.list = res
          return camelizeKeys(data)
        })
    })
}

export const getItem = id => {
  let templateId, itemData
  fetchAuthToken()
  return axios.get(`items/${id}`)
    .then(res => {
      templateId = res.data.template
      itemData = res.data
    })
    .then(() => {
      return getTemplate(templateId)
        .then(res => camelizeKeys(formatItemJson(itemData, res)))
    })
}

export const postPayment = (id, method, prices) => {
  let params = {
    'id': id,
    'method': method,
    'prices': toString(prices, ',')
  }
  fetchAuthToken()
  return axios.post('interactions/payment/', params)
    .then(res => camelizeKeys(res.data))
}

/**
 * explore
 */
export const getExplore = page => {
  return axios.get(`explore?page=${page}`)
    .then(res => camelizeKeys(res.data)
    )
}

export const getExploreItem = id => {
  return axios.get(`explore/${id}`)
    .then(res => camelizeKeys(res.data))
}

export const postExploreComment = (id,
                                   content,
                                   title = 'title',
                                   abstract = 'abstract',
                                   bannerImage = 'banner_image') => {
  let params = {
    'id': id,
    'content': content,
    'abstract': abstract,
    'banner_image': bannerImage
  }
  fetchAuthToken()
  return axios.post(`explore/${id}/comment`, params)
    .then(res => res.data)
}

/**
 * collect
 */
export const getCollect = (id) => {
  fetchAuthToken()
  return axios.get(`interactions/collects/${id}/collect/`)
    .then(res => res)
    .catch(res => res)
}

export const getCollects = (page) => {
  fetchAuthToken()
  return axios.get(`interactions/collects/?page=${page}`)
    .then(res => camelizeKeys(res.data))
}

/**
 * order
 */
export const getOrders = (page) => {
  fetchAuthToken()
  return axios.get(`interactions/orders/?page=${page}`)
    .then(res => camelizeKeys(res.data))
}