# Oil Shop Management System

A lightweight web app for managing oil products, purchases, sales, and inventory in a small shop.

## Features
- Add and track products
- Record stock purchases
- Record sales and reduce inventory
- View low-stock alerts
- Monitor dashboard totals for revenue and profit
- Store data in browser local storage

## How to run
1. Open `index.html` directly in a web browser, or
2. Start a local server:

```bash
cd oil-shop-management-system
python -m http.server 8000
```

Then open: `http://localhost:8000`

## Project structure
- `index.html` — app layout
- `styles.css` — page styling
- `app.js` — business logic and local storage

## Suggested use
This app is intended for a small oil retail business where the owner wants to track:
- product stock levels
- supplier purchases
- customer sales
- inventory warnings
- business revenue and profit

## Notes
The app uses browser local storage, so data remains available on the same browser until reset.







































