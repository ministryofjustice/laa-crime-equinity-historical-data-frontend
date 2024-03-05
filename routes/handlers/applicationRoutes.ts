import express from 'express'

export default function ApplicationRoutes() {
  const router = express.Router()

  // router.post('/search', (req, res) => {
  //   req.session.data = {
  //     usn: req.body.usn,
  //     name: req.body.name,
  //     dob: req.body.dob,
  //   }
  //   res.render('searchResult', { session: req.session })
  // })

  router.get('/', (req, res) => {
    res.render('views/search-eform')
  })

  router.get('/search-eform', (req, res) => {
    res.render('search-eform')
  })

  return router
}
