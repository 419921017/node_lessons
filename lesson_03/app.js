const express = require('express')
const superagent = require('superagent')
const cheerio = require('cheerio')
const fs = require('fs')
const app = express()

app.get('/', (req, res, next) => {
  superagent.get('https://cnodejs.org/')
    .end((err, sres) => {
      if (err) {
        return next(err)
      }
      console.log('sres', sres);
      const $ = cheerio.load(sres.text)
      let items = []
      console.log('$', $);
      $('#topic_list .topic_title').each((index, element) => {
        let $element = $(element)
        items.push({
          title: $element.attr('title'),
          href: $element.attr('href')
        })
      })
      const result = JSON.stringify(items)
      fs.writeFile('cnodejsItems.json', result)
      res.send(items)
    })
})

app.listen(3000, () => {
  console.log('App stared at prot 3000');
  
})