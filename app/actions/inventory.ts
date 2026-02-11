'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getOverviewData() {
    const supabase = await createClient()

    const { data: stock, error } = await supabase
        .from('current_stock')
        .select('*')
        .order('low_stock_alert', { ascending: false }) // Prioritize alerts

    if (error) throw new Error(error.message)
    return stock
}

export async function getProducts() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('products')
        .select(`
      *,
      category:categories(name),
      supplier:suppliers(name)
    `)
        .order('name')

    if (error) throw new Error(error.message)
    return data
}

export async function getCategories() {
    const supabase = await createClient()
    const { data, error } = await supabase.from('categories').select('*').order('name')
    if (error) throw new Error(error.message)
    return data
}

export async function getSuppliers() {
    const supabase = await createClient()
    const { data, error } = await supabase.from('suppliers').select('*').order('name')
    if (error) throw new Error(error.message)
    return data
}

export async function createProduct(formData: FormData) {
    const supabase = await createClient()

    const product = {
        name: formData.get('name') as string,
        category_id: formData.get('category_id') as string,
        supplier_id: formData.get('supplier_id') as string || null,
        variant: formData.get('variant') as string || null,
        unit: formData.get('unit') as string,
        reorder_threshold: parseFloat(formData.get('reorder_threshold') as string) || 5,
    }

    const { error } = await supabase.from('products').insert(product)

    if (error) return { success: false, message: error.message }

    revalidatePath('/products')
    revalidatePath('/')
    return { success: true, message: 'Product created successfully' }
}

export async function addStock(formData: FormData) {
    const supabase = await createClient()

    const productId = formData.get('product_id') as string
    const quantity = parseFloat(formData.get('quantity') as string)
    const expiryDate = formData.get('expiry_date') as string || null
    const batchNumber = formData.get('batch_number') as string || null

    if (!productId || !quantity) return { success: false, message: 'Missing fields' }

    // 1. Create Batch
    const { data: batch, error: batchError } = await supabase
        .from('inventory_batches')
        .insert({
            product_id: productId,
            batch_number: batchNumber,
            expiry_date: expiryDate,
        })
        .select()
        .single()

    if (batchError) return { success: false, message: 'Batch creation failed: ' + batchError.message }

    // 2. Create Movement (IN)
    const { error: moveError } = await supabase
        .from('inventory_movements')
        .insert({
            batch_id: batch.id, // Link to the new batch
            type: 'IN',
            quantity: quantity,
            reason: 'Stock Addition',
        })

    if (moveError) return { success: false, message: 'Movement record failed: ' + moveError.message }

    revalidatePath('/')
    revalidatePath('/add-stock')
    return { success: true, message: 'Stock added successfully' }
}

export async function getBatches(productId: string) {
    const supabase = await createClient()
    // Fetch batches with remaining quantity > 0 using the view
    const { data, error } = await supabase
        .from('batch_remaining')
        .select('*')
        .eq('product_id', productId)
        .gt('quantity_remaining', 0)
        .order('expiry_date', { ascending: true }) // FIFO: use oldest expiry first

    if (error) throw new Error(error.message)
    return data
}

export async function recordUsage(formData: FormData) {
    const supabase = await createClient()

    const batchId = formData.get('batch_id') as string
    const quantity = parseFloat(formData.get('quantity') as string)
    const reason = formData.get('reason') as string

    if (!batchId || !quantity) return { success: false, message: 'Missing fields' }

    const { error } = await supabase
        .from('inventory_movements')
        .insert({
            batch_id: batchId,
            type: 'OUT',
            quantity: quantity,
            reason: reason || 'Farm Usage',
        })

    if (error) return { success: false, message: error.message }

    revalidatePath('/')
    revalidatePath('/usage')
    return { success: true, message: 'Usage recorded successfully' }
}

export async function getAllActiveBatches() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('batch_remaining')
        .select('*') // Just raw view data, join happens in UI if needed
        .gt('quantity_remaining', 0)
        .order('expiry_date')

    if (error) throw new Error(error.message)
    return data
}
