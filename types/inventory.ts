export type UUID = string;

export interface Supplier {
    id: UUID;
    name: string;
    contact_info: string | null;
    created_at: string;
}

export interface Category {
    id: UUID;
    name: string;
    description: string | null;
    created_at: string;
}

export interface Product {
    id: UUID;
    category_id: UUID;
    supplier_id: UUID | null;
    name: string;
    variant: string | null;
    unit: string;
    reorder_threshold: number;
    created_at: string;
    // Join fields
    category?: Category;
    supplier?: Supplier;
}

export interface InventoryBatch {
    id: UUID;
    product_id: UUID;
    batch_number: string | null;
    expiry_date: string | null;
    created_at: string;
    // Join fields
    product?: Product;
}

export interface InventoryMovement {
    id: UUID;
    batch_id: UUID;
    type: 'IN' | 'OUT' | 'ADJUSTMENT';
    quantity: number;
    reason: string | null;
    created_at: string;
    // Join fields
    batch?: InventoryBatch;
}

export interface CurrentStock {
    product_id: UUID;
    name: string;
    variant: string | null;
    unit: string;
    category_name: string;
    reorder_threshold: number;
    quantity_on_hand: number;
    soonest_expiry: string | null;
    low_stock_alert: boolean;
}

export interface BatchRemaining extends InventoryBatch {
    quantity_remaining: number;
}
