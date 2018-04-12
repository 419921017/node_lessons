const express = require('express')
const superagent = require('superagent')
const cheerio = require('cheerio')
const eventproxy = require('eventproxy')
const url = require('url')
const fs = require('fs')

const cnodeUrl = 'https://cnodejs.org/'

superagent.get(cnodeUrl)
  .end((err, res) => {
    if (err) {
      return next(err)
    }
    let topicUrls = []
    const $ = cheerio.load(res.text)
    $('#topic_list .topic_title').each((index, element) => {
      let $element = $(element)
      let href = url.resolve(cnodeUrl, $element.attr('href'))
      topicUrls.push({
        href: href
      })
    })
    handleEP(topicUrls)
    fs.writeFile('topicUrls.json', JSON.stringify(topicUrls))
  })

  function handleEP(arr) {
    const ep = new eventproxy()
    ep.after('topic_html', arr.length, (topics) => {
      const result = topics.map((topPair) => {
        let href = topPair.href
        let html = topPair.text
        const $ = cheerio.load(html)
        return {
          title: $('.topic_full_title').eq(0).text().trim(),
          href: href,
          comment1: $('.reply_content').eq(0).text().trim()
        }
      })
      // console.log('final:');
      // console.log(topics);
      const str = JSON.stringify(result)
      fs.writeFile('topicContent.json', str.substring(1, str.length - 1))
    })
    arr.forEach(element => {
      superagent.get(element.href)
        .end((err, res) => {
          console.log('fetch ' + element.href + ' successful');
          ep.emit('topic_html', {
            href: element.href,
            text: res.text
          })
        })
    });
    
  }