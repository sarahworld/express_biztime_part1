const express = require('express')
const db = require('../db')
const router = new express.Router()
const slugify = require('slugify');
const ExpressError = require('../expressError');


router.get('/', async (request, response) => {
    const result = await db.query(`SELECT code, name FROM companies`)
    return response.json({"companies":result.rows})
})

router.get('/:code', async (request, response) => {
    let code = request.params.code
    const result = await db.query(`SELECT code, name, description FROM companies WHERE code=$1 `,[code])
    return response.json({"company":result.rows})
})

router.post('/', async (request, response, next) => {
    try{
        let { name, description } = request.body;
        let code = slugify(name, {lower: true});
        const result = await db.query(`INSERT INTO companies (code, name, description)
                                     VALUES ($1, $2, $3)
                                     RETURNING code, name, description`,
                                [code, name, description]);
        
        return response.status(201).json({"company": result.rows[0]})
    }

    catch (err) {
        return next(err);
    }
}
)

router.put('/', async (request, response, next) => {
    try{
        let { name, description } = request.body;
        let code = slugify(name, {lower: true});
        const result = await db.query(`UPDATE companies 
                                    SET name = $1,
                                    description = $2
                                    WHERE code = $3
                                    RETURNING code, name, description`,
                                [name, description, code]);
        if(result.rows.length === 0){
            throw new ExpressError(`No such company with ${code}`, 404)
        }
        else {
            return response.status(201).json({"company": result.rows[0]})
        }
    }

    catch (err) {
        return next(err);
    }
}
)

router.delete('/:code', async (request, response, next) => {
    try{
        
        let code = request.params.code;
        const result = await db.query(`DELETE FROM companies 
                                    WHERE code=$1
                                    RETURNING code`,
                                [code]);
        if(result.rows.length === 0){
            throw new ExpressError(`No such company with ${code}`, 404)
        }
        else {
            return response.status(201).json({"company": result.rows[0]})
        }
    }

    catch (err) {
        return next(err);
    }
}
)
    

module.exports = router;