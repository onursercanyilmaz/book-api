const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()



const articles = []



app.get('/', (req, res) => {
    res.send('<a href="/main">Welcome to my translate API</a>')
})

app.get('/main', (req, res) => {
    //create links to direct kitapyurdu or amazon, etc.
    res.send('<table>\n' +
        '  <tr>\n' +
        '    <th>Website</th>\n' +
        '  <tr>\n' +
        '    <td ><a href="/tureng/word">Tureng</a></td>\n' +
        '  </tr>\n' +



        '</table>')

})







app.get('/tureng/:word', (req, res) => {
    const websiteId = "tureng"
    const wordName = req.params.word

    const websiteAddress = 'https://tureng.com/tr/turkce-ingilizce/'+wordName
    const websiteBase ="https://tureng.com/"


    axios.get(websiteAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificWord = []

            $('table', html).each(function () {


                const englishWord = $('td.en.tm > a:first',this).text()
                console.log(englishWord)
                const turkishWord = $('td.tr.ts > a:first',this).text()
                console.log(turkishWord)

                specificWord.push({
                    englishWord,
                    turkishWord,
                    // publisher,
                    //url: websiteBase + url,
                    source: websiteId
                })
            })
            res.json(specificWord[0])
        }).catch(err => console.log(err))
})

app.listen(process.env.PORT || 8000, () => console.log(`server running on PORT ${PORT}`))
