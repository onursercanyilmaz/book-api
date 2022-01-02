const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const bookName = "dune"

const websites = [
    {
        name: 'kitapyurdu',
        address: 'https://www.kitapyurdu.com/index.php?route=product/search&filter_name='+bookName,
        base: ''
    },
    {
        name: 'bkm',
        address: 'https://www.bkmkitap.com/is-bankasi-kultur-yayinlari',
        base: ''
    }
]

const articles = []

websites.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('.product-cr', html).each(function () {
                const image = $(".pr-img-link > img",this).attr("src")
                const title = $('a > span:first ',this).text()
                const publisher = $('.publisher',this).text()
                const author = $('.author > span',this).text()
                const url = $('a',this).attr("href")
                const price = $('.price .price-new > span:last',this).text()
                articles.push({

                    title,
                    author,
                    publisher,
                    image,
                    url: newspaper.base + url,
                    price,
                    source: newspaper.name
                })
            })



        })
})

app.get('/', (req, res) => {
    res.send('<a href="/books">Welcome to my Book API</a>')
})

app.get('/books', (req, res) => {
   //create links to direct kitapyurdu or amazon, etc.
    res.send('<table>\n' +
        '  <tr>\n' +
        '    <th>Website</th>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '   <td ><a href="/books/kitapyurdu">Kitapyurdu</a></td>\n' +
        '  </tr>\n' +
        '  <tr>\n' +
        '    <td ><a href="/books">Amazon</a></td>\n' +
        '  </tr>\n' +
        '</table>')

})

app.get('/books/kitapyurdu', (req, res) => {
    res.redirect('/books/kitapyurdu/1');
})
app.get('/books/kitapyurdu/:page', (req, res) => {
    const page = req.params.page
    const websiteId ="kitapyurdu"

    const websiteAddress = "https://www.kitapyurdu.com/kategori/kitap/"+page
    const websiteBase = websites.filter(website => website.name === websiteId)[0].base


    axios.get(websiteAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificBooks = []

            $('.product-cr', html).each(function () {
                const image = $(".pr-img-link > img",this).attr("src")
                const title = $('a > span:first ',this).text()
                const publisher = $('.publisher',this).text()
                const author = $('.author > span',this).text()
                const url = $('a',this).attr("href")
                const price = $('.price .price-new > span:last',this).text()
                specificBooks.push({
                    title,
                    author,
                    publisher,
                    image,
                    url: websiteBase + url,
                    price,
                    source: websiteId
                })
            })
            res.json(specificBooks)
        }).catch(err => console.log(err))
})
app.get('/books/kitapyurdu/search/:bookName', (req, res) => {
    const websiteId = "kitapyurdu"
    const bookName = req.params.bookName

    const websiteAddress = 'https://www.kitapyurdu.com/index.php?route=product/search&filter_name='+bookName
    const websiteBase ="https://www.kitapyurdu.com/"


    axios.get(websiteAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificBooks = []

            $('.product-cr', html).each(function () {
                const image = $(".pr-img-link > img",this).attr("src")
                const title = $('a > span:first ',this).text()
                const publisher = $('.publisher',this).text()
                const author = $('.author > span',this).text()
                const url = $('a',this).attr("href")
                const price = $('.price .price-new > span:last',this).text()
                specificBooks.push({
                    title,
                    author,
                    publisher,
                    image,
                    url: websiteBase + url,
                    price,
                    source: websiteId
                })
            })
            res.json(specificBooks)
        }).catch(err => console.log(err))
})






app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))