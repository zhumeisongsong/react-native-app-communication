const apiRoot = 'api/'

export const NUM_ROWS = 10
export const API_HOST_DEV = 'https://anet.org.cn/' + apiRoot
export const API_HOST_PRO = 'https://anet.org.cn/' + apiRoot

export const nativeActionType = {
  search: 'go_to_search',
  payment: 'go_to_pay',
  back: 'go_back',
  share: 'go_to_share',
  login: 'trigger_login',
  hiddenNativeTabs: 'hidden_native_tabs'
}