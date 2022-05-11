const { Router } = require('express')
const IdsModel = require('./models/Ids')
const fs = require('fs')

const router = Router()

function routes(app){

    app.use(router.post('/systemids', async(req,res) => {

        try{

            const { incrementalOrderId, prefix } = req.body

            if(prefix === 'wms'|| prefix ==='dte'|| prefix === 'erp'){}else{{ return res.json({error: 'prefix must be wms-erp-dte '}) }}

            const search = await IdsModel.findOne({incrementalOrderId, prefix})

            const pdf = await fs.readFileSync('./pdfs/pdfbase64.txt', 'UTF-8')

            const systemId = prefix === 'wms' ? 'wmsId' : prefix === 'dte' ? 'dteId' : prefix === 'erp' && 'erpId'

            if(search){

                prefix === 'dte' ? 
                res.json({ orden: { custom: { [systemId]: search[systemId], dtePdf: pdf, gddPdf: pdf }}})
                :
                res.json({ orden: { custom: { [systemId]: search[systemId] }}})
                
            }else{
                
                const totalIds = await IdsModel.count({prefix: prefix})
                
                const idNumber = totalIds.toString().padStart(8, '0') 
                
                let serial = `${prefix}-${idNumber}`
                    
                const newId = await new IdsModel({incrementalOrderId: incrementalOrderId, [systemId]: serial, prefix: prefix})
                    
                await newId.save()

                prefix === 'dte' ?
                res.json({ orden:{ custom:{ [systemId]: serial, dtePdf: pdf, gddPdf: pdf } }})
                :
                res.json({ orden:{ custom:{ [systemId]: serial } }})
                
            }
            
        }catch(error){
            
            console.error(error)
            res.send('api-sandbox Error')
            
        }
        
    }))

/* -------------------------------------------------------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------------------- */

    app.use(router.post('/credit-note-erp-id', async(req,res) => {

        try{

            const { incrementalOrderId, erpId } = req.body

            const erp = await IdsModel.findOne({erpId})

            if(!erp){ return res.json({error: 'erpId not found'})}

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

    app.use(router.get('/', (req,res)=>{
        res.send('api-sandbox')
    }))
    
}

module.exports = routes