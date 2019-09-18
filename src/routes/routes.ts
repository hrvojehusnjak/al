import querystring from 'querystring'

import axios from 'axios'
import express from 'express'
import { query, validationResult } from 'express-validator'
// Jaccard index is a statistic used for gauging the similarity and diversity of sets
// const require because module has no types file
const jaccard = require('jaccard')

import skewer from '../utils/skewer'

const router = express.Router()
const baseUrl = 'https://baconipsum.com/api/?'

router.get('/', [
  query('type').isIn(['all-meat', 'meat-and-filler'])
    .withMessage('The `type` value must be exactly one of: \'all-meat\' or \'meat-and-filler\''),
  query('paras').isInt({ gt: 0, lt: 9 }).optional()
    .withMessage('Number of paragraphs must be between 1 and 8'),
  query('sentences').isInt({ gt: 0, lt: 21 })
    .withMessage('Number of sentences must be between 1 and 20'),
  query('texts').isInt({ gt: 1, lt: 9 }).custom((value) => value % 2 === 0)
    .withMessage('Number of texts must be an even number between 2 and 8')
], async (req: any, res: any) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }
  const startTime: number = new Date().getTime()
  const { type, paras, sentences, texts } = req.query
  const link: string = baseUrl + querystring.stringify({ type, paras, sentences })
  // jaccard.index() method will accept argument of type string [][]
  const baconIpsumTexts: string[] = []
  const skewers: string[][] = []
  const textPromises: any[] = []
  for (let i = 0; i < texts; i++) {
    textPromises.push(axios.get(link))
  }
  const axiosReqAll = await axios.all(textPromises)
  for (const axiosReq of axiosReqAll) {
    baconIpsumTexts.push(axiosReq.data[0])
    const skeweredText: string[] = skewer(axiosReq.data[0])
    // We create set from array (set holds no duplicate values) because the
    // Jaccard index compares value sets. Then we create array from that set
    const skeweredSet = [...new Set(skeweredText)]
    skewers.push(skeweredSet)
  }
  // Compare skewer sets from each text
  const jaccardResults: any[] = []
  for (let i = 0, len = skewers.length; i < len; i++) {
    for (let j = i + 1; j < len; j++) {
      jaccardResults.push({
        comparedFirstIndex: i,
        comparedSecondIndex: j,
        jaccardIndex: jaccard.index(skewers[i], skewers[j])
      })
    }
  }
  const endTime: number = new Date().getTime() - startTime

  return res.status(200).json({
    similarities: jaccardResults,
    texts: baconIpsumTexts,
    timePassed: endTime / 1000 + ' s'
  })
})

module.exports = router
