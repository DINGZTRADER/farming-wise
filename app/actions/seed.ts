'use server'

import { createClient } from '@/lib/supabase/server'
import { parse } from 'date-fns'

const RAW_DATA = `category	supplier	product	variant	unit	quantity	expiry_date
FERTILISERS		Yaramila NPK 25.5.5		50 kg bags	7		
FERTILISERS		Kynoplus N46		50 kg bags	1		
FERTILISERS		Green Miracle		Bottle	1	4/1/2026
FERTILISERS		Wuxal		Box	6	3/1/2028
FERTILISERS		Altretgel Hydrogel		Pkt	5	12/6/2026
PESTICIDE		Ultraphos		Tin	19	7/1/2026
PESTICIDE		Target 5% SG		Tin	3	9/1/2024
PESTICIDE		Striker 247 SC	100ml	Bottle	127	5/1/2027
PESTICIDE		Striker 247 SC	200ml	Bottle	9	5/1/2027
PESTICIDE		Striker 247 SC	500ml	Bottle	6	5/1/2027
PESTICIDE		Dudufenos 440 EC		Bottle	6	1/1/2027
PESTICIDE		Osefin 7.5% Dust 75g		Tin	5	2/1/2027
HERBICIDE		Stellar Star 210SL		Bottle	2	4/26/2026
HERBICIDE		Glymark 360 SL		Bottle	1		
HERBICIDE		2.4 D AMINE 720G/L		Bottle	1		
HERBICIDE		GuardForce		Bottle	1	1/1/2027
HERBICIDE		AminoForce		Bottle	1	4/1/2026
FUNGICIDE		Orius ADAMA		Bottle	1	8/1/2026
MASKS		Face Masks 3ply		Box	1		
MASKS		Face Masks Elastic		Box	4		
STATIONARY		Pens		Pcs	18		
STATIONARY		Counterbooks		Pcs	2		
STATIONARY		Permanent Markers		Box	2		
STATIONARY		Dry Cells	Duracel	Pcs	5		
STATIONARY		Cellotape		Pcs	1		
STATIONARY		Loud Speaker SD6S		Pcs	1		
GLOVES		Medical Examination		Box	2		
GLOVES		Safety A.R.S COLT		Pair	3		
DEWORMERS		Ascaten-P COSMOS		Tabs	35		
FUEL		Petrol		Litres	88		
FUEL		Diesel		Litres	92		
FUEL	Shell Bweyale	Hydraulic Oil		Litres	5		
LIGHTING		Solar Lights		Pcs	2		
LIGHTING		Sockets		Pcs	2		
LIGHTING		Generator Cables		Mtrs	3		
LIGHTING		Torches		Pcs	16		
BUILDING		Silicon M995		Tube	1	6/1/2027
BUILDING		Cement Hima		Bags	11		
BUILDING		Cement Tororo		Bags	0		
BUILDING		Cement Simba		Bags	0		
BUILDING		Solute Mix 1		Bags	6.5	2/1/2029
BUILDING		Waterbased Undercoat		Bkts	2		
MACHINERY		Oil Filter		Pcs	2		
MACHINERY		Oil Filter		Pcs	1		
MACHINERY		Boomspray Nozzles		Pcs	24		
MACHINERY		Boomspray Bushes		Pkt	1		
MACHINERY		Moisture Meter		Pcs	2		
SEEDS	National Tree Seed Centre, Namanve	Culliundra Caluthyrsus		Bag	1		`

export async function seedInventory() {
    const supabase = await createClient()
    const rows = RAW_DATA.split('\n').slice(1).filter(r => r.trim()) // Skip header

    let log = []

    for (const row of rows) {
        const cols = row.split('\t')
        const categoryName = cols[0]?.trim()
        const supplierName = cols[1]?.trim()
        const productName = cols[2]?.trim()
        const variant = cols[3]?.trim()
        const unit = cols[4]?.trim()
        const qtyStr = cols[5]?.trim()
        const expiryStr = cols[6]?.trim()

        if (!productName) continue

        // 1. Category
        let categoryId
        if (categoryName) {
            const { data: cat } = await supabase.from('categories').select('id').eq('name', categoryName).single()
            if (cat) categoryId = cat.id
            else {
                const { data: newCat } = await supabase.from('categories').insert({ name: categoryName }).select('id').single()
                categoryId = newCat?.id
            }
        }

        // 2. Supplier
        let supplierId = null
        if (supplierName) {
            const { data: sup } = await supabase.from('suppliers').select('id').eq('name', supplierName).single()
            if (sup) supplierId = sup.id
            else {
                const { data: newSup } = await supabase.from('suppliers').insert({ name: supplierName }).select('id').single()
                supplierId = newSup?.id
            }
        }

        // 3. Product
        // Check if exists (by name + variant?)
        let productId
        let query = supabase.from('products').select('id').eq('name', productName)
        if (variant) query = query.eq('variant', variant)
        else query = query.is('variant', null)

        const { data: prod } = await query.single()

        if (prod) productId = prod.id
        else {
            const { data: newProd } = await supabase.from('products').insert({
                name: productName,
                category_id: categoryId,
                supplier_id: supplierId,
                variant: variant || null,
                unit: unit || 'pcs',
                reorder_threshold: 5
            }).select('id').single()
            productId = newProd?.id
        }

        // 4. Batch & Stock
        const quantity = parseFloat(qtyStr || '0')
        if (quantity > 0 && productId) {
            let expiryDate = null
            if (expiryStr) {
                try {
                    expiryDate = parse(expiryStr, 'M/d/yyyy', new Date()).toISOString()
                } catch (e) { }
            }

            const { data: batch } = await supabase.from('inventory_batches').insert({
                product_id: productId,
                expiry_date: expiryDate,
                batch_number: 'INIT-' + new Date().getFullYear()
            }).select('id').single()

            if (batch) {
                await supabase.from('inventory_movements').insert({
                    batch_id: batch.id,
                    type: 'IN',
                    quantity: quantity,
                    reason: 'Initial Import'
                })
            }
        }
        log.push(`Processed ${productName}`)
    }

    return { success: true, log }
}
