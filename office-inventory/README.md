# Office Inventory Manager (Angular Frontend)

Angular (v21) frontend for the Office Inventory Manager, consuming the Spring Boot
REST API (`/api/items`).

## Development

```bash
npm install
npm start          # ng serve with proxy to http://localhost:8080
```

The dev server runs on `http://localhost:4200` and proxies `/api` requests to the
Spring Boot backend on `http://localhost:8080` (see `proxy.conf.json`).

## Build

```bash
npm run build      # outputs to dist/office-inventory
```

## Structure

- `src/app/models/item.model.ts` — domain models (`Item`, `ItemRequest`, `InventoryStats`).
- `src/app/services/inventory.service.ts` — `HttpClient` service mapping every Spring Boot endpoint.
- `src/app/components/item-form` — add/edit form.
- `src/app/components/inventory-list` — inventory table with edit/delete actions.
- `src/app/components/inventory-stats` — summary cards.