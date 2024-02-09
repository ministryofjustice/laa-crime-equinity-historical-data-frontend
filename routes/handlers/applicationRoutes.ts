import express from 'express'

export default function ApplicationRoutes() {
  const router = express.Router()

  router.get('/', (req, res) => {
    res.render('homepage')
  })

  // When a post request is made to this URL we can access the body received
  router.post('/search', (req, res) => {
    // Store body values in locals.
    // We can now store the post request anywhere

    req.session.data = {
      usn: req.body.usn,
      name: req.body.name,
      dob: req.body.dob,
    }

    res.render('searchResult', { session: req.session })
  })

  return router
}
