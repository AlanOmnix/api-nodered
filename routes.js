const { Router } = require('express')
const IdsModel = require('./models/Ids')
const fs = require('fs')

const router = Router()

function routes(app){

    app.use(router.post('/omnixid', async(req,res) => {

        try{

            const { incrementalOrderId, prefix } = req.body

            const search = await IdsModel.findOne({incrementalOrderId, prefix})

            const systemId = prefix === 'wms' ? 'wmsId' : prefix === 'erp' && 'erpId'

            if(search){

                res.json({ orden: { custom: { [systemId]: search[systemId] }}})
                
            }else{
                
                const totalIds = await IdsModel.count({prefix: prefix})
                
                const idNumber = totalIds.toString().padStart(8, '0') 
                
                let serial = `${prefix}-${idNumber}`
                    
                const newId = await new IdsModel({incrementalOrderId: incrementalOrderId, [systemId]: serial, prefix: prefix})
                    
                await newId.save()
                    
                res.json({ orden: {
                    custom:{
                        [systemId]: serial
                    }
                }}) 
                
            }
            
        }catch(error){
            
            console.error(error)
            res.send('api-sandbox Error')
            
        }
        
    }))

/* -------------------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------------------- */

    app.use(router.post('/creditNoteErpId', async(req,res) => {

        try{

            const { incrementalOrderId, erpId } = req.body

            const pdf = await fs.readFileSync('./pdfs/pdfbase64.txt', 'UTF-8')

            const rel = incrementalOrderId + erpId

            const search = await IdsModel.findOne({rel: rel})

            if(search){

                res.json({ orden: { custom: { creditNoteErpId: search.creditNoteErpId, creditNotePdf: pdf }}})

            }else{
            
                const prefix = 'erp-creditNote'
                  
                const totalIds = await IdsModel.count({prefix: prefix})
                
                const idNumber = totalIds.toString().padStart(8, '0') 
                
                let serial = `${prefix}-${idNumber}`
                    
                const newId = await new IdsModel({incrementalOrderId: incrementalOrderId, creditNoteErpId: serial, prefix: prefix, rel: rel})
                    
                await newId.save()
                    
                res.json({ orden: {
                    custom:{
                        creditNoteErpId: serial,
                        creditNotePdf: pdf
                    }
                }}) 

            }

        }catch(error){
            console.error(error)
            res.send('api-sandbox Error')
        }

    }))


/* -------------------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------------------- */

    app.use(router.post('/dte', async(req,res) => {

        try{    
           
            const { incrementalOrderId } = req.body

            const pdf = await fs.readFileSync('./pdfs/pdfbase64.txt', 'UTF-8')
            
            const search = await IdsModel.findOne({incrementalOrderId: incrementalOrderId, prefix: 'dte'})
            
            if(search){
                
                res.json({ orden: { custom: { dteId: search.dteId, dtePdf: pdf, gddPdf: pdf }}})
                
            }else{
                
                const totalIds = await IdsModel.count({prefix: 'dte'})
                
                const idNumber = totalIds.toString().padStart(8, '0') 
                
                let serial = `dte-${idNumber}`
                
                const newId = await new IdsModel({incrementalOrderId: incrementalOrderId, dteId: serial, prefix: 'dte'})
                
                await newId.save()
                    
                res.json({ orden: {
                    custom:{
                        dteId: serial,
                        dtePdf: pdf,
                        gddPdf: pdf
                    }
                }}) 
                
            }

        }catch(error){
            console.error(error)
            res.send('api-sandbox Error')
        }

    }))


/* -------------------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------------------- */
    


    app.use(router.get('/', (req,res)=>{
        res.send('api-sandbox')
    }))
    
}

module.exports = routes