const fs = require('fs')
const copy = (src, tar) => fs.createReadStream(src).pipe(fs.createWriteStream(tar));
path = process.env.DATA_PATH
if (path) {
  setInterval(() => {
    console.log(new Date())
      console.log('Copied!')
    copy(path, './src/latest_demo_info.json')
  }, 3600 * 1e3)
} else {
  console.log('No env var: DATA_PATH QQ')
}
