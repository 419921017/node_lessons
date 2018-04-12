const async = require('async')

let urls = [];

for(var i = 0; i < 30; i++) {
  urls.push('http://datasource_' + i);
}

let concurrencyCount = 0

async.mapLimit(urls, 5, (url, callback) => {
  fetchUrl(url, callback)
}, (err, result) => {
  console.log('fina: ', result);
  
})


function fetchUrl(url, callback) {
  const delay = parseInt((Math.random() * 1000000) % 2000, 10)
  concurrencyCount++
  console.log('现在的并发数是', concurrencyCount, '正在抓取的是', url, '耗时', delay, '毫秒');
  setTimeout(() => {
    concurrencyCount--
    callback(null, url + 'html content' )
  }, delay)
}

