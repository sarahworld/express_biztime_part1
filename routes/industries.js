const express = require('express')
const db = require('../db')
const ExpressError = require('../expressError')
const router = new express.Router()


router.post('/', async (request, response, next) => {
    try{
        let { industry } = request.body;
        let code = slugify(industry[4], {lower: true})
        const result = await db.query(`INSERT VALUES industries (code, industry) 
                                VALUES ($1, $2)
                                RETURNING code,industry`,
                                [code, industry]);
        return response.status(201).json({"industries":result.rows[0]})
        
    }
    catch (err) {
        return next(err)
    }
})
