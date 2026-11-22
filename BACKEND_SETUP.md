
# LabhSutra Backend Setup

## 1. Technology
- Supabase Authentication
- PostgreSQL Database
- Row Level Security (RLS)
- Supabase JavaScript Client

## 2. Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_key
```

Never commit `.env` or expose the Supabase service role key.

## 3. Database Tables

- profiles
- shops
- customers
- ledger_transactions
- products
- inventory_movements
- suppliers
- supplier_offers
- purchase_plans
- purchase_plan_items

## 4. Authentication

Implemented in `src/lib/auth.ts`:
- Sign up
- Sign in
- Sign out
- Get current session
- Listen for authentication changes

## 5. Backend Services

Located in `src/services/`:

- `ledgerService.ts` — customer credit and payment transactions
- `inventoryService.ts` — products and stock movements
- `supplierService.ts` — supplier offers (demo data)
- `purchasePlannerService.ts` — purchase plan creation and retrieval

## 6. Database Security

- RLS enabled on all 10 tables.
- Shop records are restricted by owner.
- Customer and transaction data are isolated by shop.
- Supplier demo data is readable by authenticated users.
- Sensitive database operations use controlled PostgreSQL functions.

## 7. Run Locally

```bash
npm install
npm run dev
```

## 8. Build Verification

```bash
npm run build
```
