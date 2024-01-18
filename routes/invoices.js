const express = require('express')
const db = require('../db')
const ExpressError = require('../expressError')
const router = new express.Router()


router.get('/', async (request, response) => {
    const result = await db.query(`SELECT id, comp_code FROM invoices`)
    return response.json({"invoices":result.rows})
})

router.get('/:id', async (request, response, next) => {
    try{
        let id = request.params.id
        const result = await db.query(`SELECT id, amt, paid, add_date, paid_date FROM invoices AS i
                                        INNER JOIN companies AS c ON (i.comp_code = c.code) WHERE id=$1 `,[id])
        if(result.rows[0].length === 0) {
            throw new ExpressError(`No such invoices: ${id}`, 404);
        }
    
        const data = result.rows[0]
        const invoice = {
            id:data.id,
            company:{
                code:data.comp_code,
                name:data.name,
                description:data.description
            },
            amt:data.amt,
            paid:data.paid,
            add_date:data.add_date,
            paid_date:data.paid_date
        };
        return response.json({"invoice":invoice})
    }
    catch(err){
        next(err)
    }
   
})

router.post('/', async (request, response, next) => {
    try{
        let { comp_code, amt } = request.body;
        
        const result = await db.query(`INSERT INTO invoices (comp_code, amt)
                                     VALUES ($1, $2)
                                     RETURNING id, comp_code, amt, paid, add_date, paid_date`,
                                [comp_code, amt]);
        
        return response.status(201).json({"invoices": result.rows[0]})
    }

    catch (err) {
        return next(err);
    }
}
)

router.put('/:id', async (request, response, next) => {
    try {
        let { amt } = request.body;
        let { id } = request.params.id
        let paidDate = null;

        const currResult = await db.query(`SELECT paid 
                                    FROM invoices
                                    WHERE id = $1`,
                                    [id])

        if(currResult.rows[0].length === 0){
            throw new ExpressError(`No such invoices ${id}`, 404);
        }

        const currPaidDate = currResult.rows[0].paid_date;

        if(!currPaidDate && paid){
            paidDate = new Date();
        }else if(!paid){
            paidDate = null
        }
        else{
            paidDate = currPaidDate;
        }

        const result = db.query(`UPDATE invoices
                                SET amt = $1, paid=$2, paid_date=$3
                                WHERE id =$4
                                RETURNING id, comp_code, amt, paid, add_date, paid_date`,
                                [amt, paid, paidDate, id]);

        return response.json({"invoices":result.rows[0]})
    }
    catch (err) {
        return next(err);
    }
})

router.delete("/:id", async function (req, res, next) {
    try {
      let id = req.params.id;
  
      const result = await db.query(
            `DELETE FROM invoices
             WHERE id = $1
             RETURNING id`,
          [id]);
  
      if (result.rows.length === 0) {
        throw new ExpressError(`No such invoice: ${id}`, 404);
      }
  
      return res.json({"status": "deleted"});
    }
  
    catch (err) {
      return next(err);
    }
  });


module.exports = router;