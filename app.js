const STORAGE_KEY = 'oil-shop-management-system';

const defaultState = {
  products: [
    { id: 1, name: 'Engine Oil 5W-30', category: 'Engine', purchasePrice: 240, sellingPrice: 360, stock: 35, supplier: 'Prime Lubricants' },
    { id: 2, name: 'Gear Oil GL4', category: 'Transmission', purchasePrice: 270, sellingPrice: 390, stock: 12, supplier: 'Dyno Supply' },
    { id: 3, name: 'Hydraulic Oil ISO 32', category: 'Hydraulic', purchasePrice: 300, sellingPrice: 430, stock: 18, supplier: 'North Valley Oil' },
    { id: 4, name: 'Brake Fluid DOT 4', category: 'Brake', purchasePrice: 180, sellingPrice: 260, stock: 9, supplier: 'Prime Lubricants' }
  ],
  sales: [
    { id: 1, productId: 1, productName: 'Engine Oil 5W-30', quantity: 3, unitPrice: 360, total: 1080, customer: 'AutoZone Garage', date: '2026-10-05' },
    { id: 2, productId: 2, productName: 'Gear Oil GL4', quantity: 2, unitPrice: 390, total: 780, customer: 'Kenya Motors', date: '2026-10-09' }
  ],
  purchases: [
    { id: 1, productId: 1, productName: 'Engine Oil 5W-30', quantity: 20, unitCost: 240, total: 4800, supplier: 'Prime Lubricants', date: '2026-10-04' },
    { id: 2, productId: 4, productName: 'Brake Fluid DOT 4', quantity: 15, unitCost: 180, total: 2700, supplier: 'Prime Lubricants', date: '2026-10-06' }
  ]
};

let state = loadState();

const productForm = document.getElementById('product-form');
const purchaseForm = document.getElementById('purchase-form');
const saleForm = document.getElementById('sale-form');
const resetButton = document.getElementById('reset-data');

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : structuredClone(defaultState);
  } catch (error) {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function generateId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value || 0);
}

function getProductById(productId) {
  return state.products.find((product) => product.id === Number(productId));
}

function renderProductOptions() {
  const purchaseProductSelect = document.getElementById('purchase-product');
  const saleProductSelect = document.getElementById('sale-product');

  if (!state.products.length) {
    purchaseProductSelect.innerHTML = '<option value="">No products available</option>';
    saleProductSelect.innerHTML = '<option value="">No products available</option>';
    return;
  }

  const options = state.products
    .map(
      (product) => `<option value="${product.id}">${product.name} (${product.stock} in stock)</option>`
    )
    .join('');

  purchaseProductSelect.innerHTML = options;
  saleProductSelect.innerHTML = options;
}

function renderProductTable() {
  const tableBody = document.getElementById('product-table-body');

  tableBody.innerHTML = state.products
    .map(
      (product) => `
        <tr>
          <td>${product.name}</td>
          <td>${product.category}</td>
          <td>${formatCurrency(product.sellingPrice)}</td>
          <td>${product.stock}</td>
          <td>${product.supplier}</td>
        </tr>
      `
    )
    .join('');
}

function renderPurchaseTable() {
  const tableBody = document.getElementById('purchase-table-body');

  tableBody.innerHTML = state.purchases
    .slice()
    .reverse()
    .map(
      (purchase) => `
        <tr>
          <td>${purchase.date}</td>
          <td>${purchase.productName}</td>
          <td>${purchase.quantity}</td>
          <td>${formatCurrency(purchase.total)}</td>
        </tr>
      `
    )
    .join('');
}

function renderSalesTable() {
  const tableBody = document.getElementById('sales-table-body');

  tableBody.innerHTML = state.sales
    .slice()
    .reverse()
    .map(
      (sale) => `
        <tr>
          <td>${sale.date}</td>
          <td>${sale.productName}</td>
          <td>${sale.quantity}</td>
          <td>${formatCurrency(sale.total)}</td>
          <td>${sale.customer}</td>
        </tr>
      `
    )
    .join('');
}

function renderInventoryAlerts() {
  const tableBody = document.getElementById('inventory-table-body');

  tableBody.innerHTML = state.products
    .map((product) => {
      const status = product.stock <= 10 ? 'low' : 'good';
      const label = product.stock <= 10 ? 'Low stock' : 'Healthy';

      return `
        <tr>
          <td>${product.name}</td>
          <td>${product.stock}</td>
          <td><span class="status-pill ${status}">${label}</span></td>
        </tr>
      `;
    })
    .join('');
}

function renderDashboard() {
  const totalProducts = state.products.length;
  const totalStock = state.products.reduce((sum, product) => sum + Number(product.stock), 0);

  const totalRevenue = state.sales.reduce((sum, sale) => sum + Number(sale.total), 0);
  const totalPurchases = state.purchases.reduce((sum, purchase) => sum + Number(purchase.total), 0);
  const totalProfit = totalRevenue - totalPurchases;

  document.getElementById('total-products').textContent = String(totalProducts);
  document.getElementById('total-stock').textContent = `${totalStock}L`;
  document.getElementById('total-revenue').textContent = formatCurrency(totalRevenue);
  document.getElementById('total-profit').textContent = formatCurrency(totalProfit);
}

function renderAll() {
  renderDashboard();
  renderProductOptions();
  renderProductTable();
  renderPurchaseTable();
  renderSalesTable();
  renderInventoryAlerts();
}

productForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.getElementById('product-name').value.trim();
  const category = document.getElementById('product-category').value.trim();
  const purchasePrice = Number(document.getElementById('purchase-price').value);
  const sellingPrice = Number(document.getElementById('selling-price').value);
  const stock = Number(document.getElementById('product-stock').value);
  const supplier = document.getElementById('product-supplier').value.trim();

  if (!name || !category || !supplier || purchasePrice <= 0 || sellingPrice <= 0 || stock < 0) {
    alert('Please enter valid product information.');
    return;
  }

  const newProduct = {
    id: generateId(),
    name,
    category,
    purchasePrice,
    sellingPrice,
    stock,
    supplier
  };

  state.products.push(newProduct);
  saveState();
  renderAll();
  productForm.reset();
});

purchaseForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const productId = Number(document.getElementById('purchase-product').value);
  const quantity = Number(document.getElementById('purchase-quantity').value);
  const unitCost = Number(document.getElementById('purchase-unit-cost').value);
  const supplier = document.getElementById('purchase-supplier').value.trim();

  const product = getProductById(productId);

  if (!product || quantity <= 0 || unitCost < 0 || !supplier) {
    alert('Please provide valid purchase details.');
    return;
  }

  const purchaseTotal = quantity * unitCost;

  state.purchases.push({
    id: generateId(),
    productId: product.id,
    productName: product.name,
    quantity,
    unitCost,
    total: purchaseTotal,
    supplier,
    date: new Date().toISOString().slice(0, 10)
  });

  product.stock += quantity;
  product.purchasePrice = unitCost;
  product.supplier = supplier;

  saveState();
  renderAll();
  purchaseForm.reset();
});

saleForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const productId = Number(document.getElementById('sale-product').value);
  const quantity = Number(document.getElementById('sale-quantity').value);
  const customer = document.getElementById('sale-customer').value.trim();

  const product = getProductById(productId);

  if (!product || quantity <= 0 || !customer) {
    alert('Please provide valid sale information.');
    return;
  }

  if (product.stock < quantity) {
    alert(`Not enough stock. Available stock for ${product.name}: ${product.stock}`);
    return;
  }

  const total = quantity * product.sellingPrice;

  state.sales.push({
    id: generateId(),
    productId: product.id,
    productName: product.name,
    quantity,
    unitPrice: product.sellingPrice,
    total,
    customer,
    date: new Date().toISOString().slice(0, 10)
  });

  product.stock -= quantity;

  saveState();
  renderAll();
  saleForm.reset();
});

resetButton.addEventListener('click', () => {
  const confirmReset = window.confirm('This will restore the sample oil shop data. Continue?');
  if (!confirmReset) return;

  state = structuredClone(defaultState);
  saveState();
  renderAll();
});

renderAll();



























































































































