import request from 'request-promise'
import cheerio from 'cheerio'

const remote = request.defaults({
  json: true,
  headers: {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'
  }
})

// 1337x.to base URL
let tpbURL = 'https://thepiratebay.org'

export function generateUrl (keyword) {
  return tpbURL + '/search/' + keyword + '/0/99/0'
}

export function searchTorrents (keyword) {
  return remote.get(tpbURL + '/search/' + keyword + '/0/99/0')
    .then(resp => {
      return cheerio.load(resp)
    })
    .then($ => {
      return $('table#searchResult tr:has(a.detLink)')
        .map((i, x) => {
          return {
            seeders: $(x).find('td[align="right"]').first().text(),
            leechers: $(x).find('td[align="right"]').next().text(),
            title: $(x).find('a.detLink').text(),
            magnet: $(x).find('[title="Download this torrent using magnet"]').attr('href'),
            size: $(x).find('font.detDesc').text().split(',')[1].split(' ')[2],
            category: $(x).find('[title="More from this category"]').text()
          }
        })
        .filter((i, { category }) => /video|TV shows/gi.test(category))
        .get()
        .slice(0, 10)
    })
}
