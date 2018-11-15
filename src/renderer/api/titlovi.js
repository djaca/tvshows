import request from 'request-promise'
import cheerio from 'cheerio'

const remote = request.defaults({
  json: true,
  headers: {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36'
  }
})

const link = 'https://titlovi.com'
// const downloadLink = `${link}/download/?type=1&mediaid=`

export function searchTitlovi (payload) {
  return remote.get(`${link}/titlovi/?prijevod=${payload.imdb_id}`)
    .then(resp => {
      return getTvSubtitles(resp, payload)
    })
}

function getTvSubtitles (resp, payload) {
  let div = document.createElement('div')
  div.innerHTML = resp.trim()

  let uri = div.querySelector('div.download a').getAttribute('href')

  return remote.get(link + uri)
    .then(resp => {
      const $ = cheerio.load(resp)

      let subtitles = []
      $('ul').find('li div.header h2').each((i, el) => {
        if ($(el).text() === `Sezona ${String(payload.season)}`) {
          $(el).parent().next().find('.subtitleContainer').each((i, el) => {
            let id = $(el).find('h3').attr('data-id')

            if (id) {
              let languageId = $(el).find('img.lang').attr('alt')
              let versions = $(el).find('h4').html().split('<')[0].trim()
              let author = $(el).find('span.dodao a').text()
              let date = $(el).find('span.datum').text()
              let downloadCount = $(el).find('span.downloads').text()

              let detArr = $(el).find('h3 span').text().split(' ')
              let season = Number(detArr[1])
              let episode = Number(detArr[3])

              let lang = {
                1: 'bosnia',
                3: 'english',
                4: 'croatia',
                6: 'slovenia',
                7: 'serbia'
              }

              subtitles.push({
                id,
                language: lang[languageId],
                versions,
                author,
                date,
                downloadCount,
                season,
                episode
              })
            }
          })
        }
      })

      return subtitles
    })
}
