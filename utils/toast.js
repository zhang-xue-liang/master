export const error = (msg) => {
  wx.showToast({
    title: msg,
    icon:'error'
  })
}

export const success = (msg,callback,duration=1000) => {
  wx.showToast({
    title:msg,
    duration:duration,
    success() {
      setTimeout(()=>{callback()},duration)
    }
  })
}
