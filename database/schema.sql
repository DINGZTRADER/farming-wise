-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Suppliers
create table if not exists suppliers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  contact_info text,
  created_at timestamptz default now()
);

-- 2. Categories
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  description text,
  created_at timestamptz default now()
);

-- 3. Products
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references categories(id),
  supplier_id uuid references suppliers(id),
  name text not null,
  variant text, -- e.g. "50kg bag", "1L bottle"
  unit text not null, -- e.g. "kg", "litres", "pcs"
  reorder_threshold float default 5.0,
  created_at timestamptz default now()
);

-- 4. Inventory Batches
create table if not exists inventory_batches (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) not null,
  batch_number text, -- optional tracking number
  expiry_date date,
  created_at timestamptz default now()
);

-- 5. Inventory Movements
create type movement_type as enum ('IN', 'OUT', 'ADJUSTMENT');
create table if not exists inventory_movements (
  id uuid primary key default uuid_generate_v4(),
  batch_id uuid references inventory_batches(id) not null,
  type movement_type not null,
  quantity float not null check (quantity > 0),
  reason text,
  created_at timestamptz default now()
);

-- 6. Views

-- Calculate remaining quantity per batch
create or replace view batch_remaining as
select
  b.id as batch_id,
  b.product_id,
  b.expiry_date,
  b.batch_number,
  coalesce(sum(case when m.type = 'IN' then m.quantity when m.type = 'OUT' then -m.quantity when m.type = 'ADJUSTMENT' then m.quantity else 0 end), 0) as quantity_remaining
from inventory_batches b
left join inventory_movements m on b.id = m.batch_id
group by b.id;

-- Calculate total stock per product with alert flags
create or replace view current_stock as
select
  p.id as product_id,
  p.name,
  p.variant,
  p.unit,
  c.name as category_name,
  p.reorder_threshold,
  coalesce(sum(br.quantity_remaining), 0) as quantity_on_hand,
  min(nullif(br.expiry_date, null)) filter (where br.quantity_remaining > 0) as soonest_expiry,
  case 
    when coalesce(sum(br.quantity_remaining), 0) <= p.reorder_threshold then true 
    else false 
  end as low_stock_alert
from products p
left join categories c on p.category_id = c.id
left join batch_remaining br on p.id = br.product_id
group by p.id, c.name, p.name, p.variant, p.unit, p.reorder_threshold;
