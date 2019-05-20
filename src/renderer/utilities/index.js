export function formatBytes (a, round = false) {
  if (a === 0) {
    return '0 Bytes'
  }
  let c = 1024
  let d = 2
  let e = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let f = Math.floor(Math.log(a) / Math.log(c))

  if (round) {
    return Math.floor(parseFloat((a / Math.pow(c, f)).toFixed(d))) + ' ' + e[f]
  }

  return parseFloat((a / Math.pow(c, f)).toFixed(d)) + ' ' + e[f]
}
