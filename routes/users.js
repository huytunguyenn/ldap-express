const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
  const name = req.query.name;
  const age = req.query.age;
  res.send(`Name: ${name}, Age: ${age}`);
});


module.exports = router;
