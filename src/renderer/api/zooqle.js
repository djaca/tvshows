import request from 'request-promise'
import cheerio from 'cheerio'

let domain = 'https://zooqle.com'

export function searchZooqle (keyword) {
  let options = {
    uri: domain + '/search?q=' + keyword + '&fmt=rss',
    headers:
      {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
      },
    transform: function (body) {
      return cheerio.load(body, { xmlMode: true })
    }
  }

  let torrents = []
  return request(options).then($ => {
    $('channel item').each(function (index) {
      let sizeMatch = $(this).children('description').text().match(/([0-9.]+\s[G|M][B])/)
      let size
      if (sizeMatch) {
        size = sizeMatch[0]
      }
      torrents[index] = {
        name: $(this).children('title').text(),
        url: $(this).children('link').text(),
        seeders: $(this).children('torrent\\:seeds').text(),
        leechers: $(this).children('torrent\\:peers').text(),
        size,
        // date: $(this).children('pubDate').text(),
        magnet: $(this).children('torrent\\:magnetURI').text(),
        verified: $(this).children('torrent\\:verified').text()
      }
    })

    return torrents
  })
}
