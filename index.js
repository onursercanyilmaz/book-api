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
    res.send('<a href="/books">Welcome to my Book</a>')
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
        '    <td ><a href="/books/amazon">Amazon</a></td>\n' +
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

app.get('/books/amazon', (req, res) => {
    res.redirect('/books/amazon/bestsellers');
})
app.get('/books/amazon/bestsellers', (req, res) => {
    const page = req.params.page
    const websiteId ="amazon"

    const websiteAddress = "https://www.amazon.com.tr/gp/bestsellers/books"
    const websiteBase ="https://www.amazon.com.tr/"


    axios.get(websiteAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificBooks = []

            $('.zg-grid-general-faceout', html).each(function () {

                const title = $('a > span:first ',this).text()
                //const publisher = $('.publisher',this).text()
                const author = $('._p13n-zg-list-grid-desktop_truncationStyles_p13n-sc-css-line-clamp-1__1Fn1y:last',this).text()
                const image = $(" div > a:nth-child(1) > div > img",this).attr("src")
                const url = $('.a-link-normal',this).attr("href")
                const price = $('._p13n-zg-list-grid-desktop_price_p13n-sc-price__3mJ9Z',this).text()
                specificBooks.push({
                    title,
                    author,
                    //publisher,
                    image,
                    url: websiteBase + url,
                    price,
                    source: websiteId
                })
            })
            res.json(specificBooks)
        }).catch(err => console.log(err))
})
app.get('/books/amazon/search/:bookName', (req, res) => {
    const websiteId = "amazon"
    const bookName = req.params.bookName

    const websiteAddress = 'https://www.amazon.com.tr/s?k='+bookName+'&i=stripbooks&__mk_tr_TR=%C3%85M%C3%85%C5%BD%C3%95%C3%91&crid=1BR5SJ7PJ53VD&sprefix=a%2Cstripbooks%2C134&ref=nb_sb_noss'
    const websiteBase ="https://www.amazon.com.tr/"


    axios.get(websiteAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificBooks = []

            $('.a-section', html).each(function () {

                const title = $('a > span:first ',this).text()
               //const publisher = $('.publisher',this).text()
                const author = $('.a-row > .a-size-base + .a-size-base ',this).text()
                const image = $(" div > span > a > div > img",this).attr("src")
                const url = $('a',this).attr("href")
                const price = $('.a-price > span:first' ,this).text()
                specificBooks.push({
                    title,
                    author,
                   // publisher,
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