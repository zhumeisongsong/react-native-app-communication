import _UA from '../consist/UA'
export const noBgScroll = () => {
  let wrapProps
  if (_UA.isIOS) {
    wrapProps = {
      onTouchStart: e => e.preventDefault(),
    }
  }
}