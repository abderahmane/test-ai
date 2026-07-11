/* ===== Office Inventory Manager ===== */
(function () {
  "use strict";

  const STORAGE_KEY = "office_inventory_items";
  const LOW_STOCK_THRESHOLD = 5;

  // ---- State ----
  let items = loadItems();

  // ---- DOM refs ----
  const form = document.getElementById("itemForm");
  const itemIdInput = document.getElementById("itemId");
  const nameInput = document.getElementById("name");
  const categoryInput = document.getElementById("category");
  const quantityInput = document.getElementById("quantity");
  const locationInput = document.getElementById("location");
  const statusInput = document.getElementById("status");
  const formTitle = document.getElementById("formTitle");
  const submitBtn = document.getElementById("submitBtn");
  const cancelBtn = document.getElementById("cancelBtn");

  const searchInput = document.getElementById("searchInput");
  const filterCategory = document.getElementById("filterCategory");
  const filterStatus = document.getElementById("filterStatus");
  const clearAllBtn = document.getElementById("clearAllBtn");

  const inventoryBody = document.getElementById("inventoryBody");
  const emptyState = document.getElementById("emptyState");
  const categoryList = document.getElementById("categoryList");

  const statTotal = document.getElementById("statTotal");
  const statQuantity = document.getElementById("statQuantity");
  const statLow = document.getElementById("statLow");
  const statCategories = document.getElementById("statCategories");

  // ---- Persistence ----
  function loadItems() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Failed to load items:", e);
      return [];
    }
  }

  function saveItems() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save items:", e);
    }
  }

  // ---- Helpers ----
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  function badgeClass(status) {
    switch (status) {
      case "In Stock": return "badge-in";
      case "Low Stock": return "badge-low";
      case "Out of Stock": return "badge-out";
      case "Under Repair": return "badge-repair";
      default: return "badge-in";
    }
  }

  // ---- Rendering ----
  function getFilteredItems() {
    const term = searchInput.value.trim().toLowerCase();
    const cat = filterCategory.value;
    const st = filterStatus.value;

    return items.filter(function (item) {
      const matchesTerm =
        !term ||
        item.name.toLowerCase().includes(term) ||
        (item.category && item.category.toLowerCase().includes(term)) ||
        (item.location && item.location.toLowerCase().includes(term));
      const matchesCat = !cat || item.category === cat;
      const matchesStatus = !st || item.status === st;
      return matchesTerm && matchesCat && matchesStatus;
    });
  }

  function renderTable() {
    const filtered = getFilteredItems();
    inventoryBody.innerHTML = "";

    if (filtered.length === 0) {
      emptyState.hidden = false;
      emptyState.textContent =
        items.length === 0
          ? "No items found. Add your first inventory item above."
          : "No items match your search/filter.";
      return;
    }

    emptyState.hidden = true;

    filtered.forEach(function (item) {
      const tr = document.createElement("tr");

      tr.innerHTML =
        "<td>" + escapeHtml(item.name) + "</td>" +
        "<td>" + escapeHtml(item.category) + "</td>" +
        "<td>" + escapeHtml(item.quantity) + "</td>" +
        "<td>" + escapeHtml(item.location || "-") + "</td>" +
        '<td><span class="badge ' + badgeClass(item.status) + '">' +
          escapeHtml(item.status) + "</span></td>" +
        '<td><div class="actions-cell">' +
          '<button class="btn btn-sm btn-edit" data-action="edit" data-id="' + item.id + '">Edit</button>' +
          '<button class="btn btn-sm btn-delete" data-action="delete" data-id="' + item.id + '">Delete</button>' +
        "</div></td>";

      inventoryBody.appendChild(tr);
    });
  }

  function renderStats() {
    const totalQty = items.reduce(function (sum, i) {
      return sum + (Number(i.quantity) || 0);
    }, 0);
    const lowCount = items.filter(function (i) {
      return (Number(i.quantity) || 0) <= LOW_STOCK_THRESHOLD;
    }).length;
    const categories = new Set(
      items.map(function (i) { return i.category; }).filter(Boolean)
    );

    statTotal.textContent = items.length;
    statQuantity.textContent = totalQty;
    statLow.textContent = lowCount;
    statCategories.textContent = categories.size;
  }

  function renderCategoryOptions() {
    const categories = Array.from(
      new Set(items.map(function (i) { return i.category; }).filter(Boolean))
    ).sort();

    // datalist for the form input
    categoryList.innerHTML = categories
      .map(function (c) { return '<option value="' + escapeHtml(c) + '"></option>'; })
      .join("");

    // filter dropdown
    const current = filterCategory.value;
    filterCategory.innerHTML =
      '<option value="">All Categories</option>' +
      categories
        .map(function (c) {
          return '<option value="' + escapeHtml(c) + '">' + escapeHtml(c) + "</option>";
        })
        .join("");
    // keep selection if still valid
    if (categories.indexOf(current) !== -1) {
      filterCategory.value = current;
    }
  }

  function renderAll() {
    renderCategoryOptions();
    renderTable();
    renderStats();
  }

  // ---- Form handling ----
  function resetForm() {
    form.reset();
    itemIdInput.value = "";
    formTitle.textContent = "Add New Item";
    submitBtn.textContent = "Add Item";
    cancelBtn.hidden = true;
  }

  function startEdit(id) {
    const item = items.find(function (i) { return i.id === id; });
    if (!item) return;

    itemIdInput.value = item.id;
    nameInput.value = item.name;
    categoryInput.value = item.category;
    quantityInput.value = item.quantity;
    locationInput.value = item.location || "";
    statusInput.value = item.status;

    formTitle.textContent = "Edit Item";
    submitBtn.textContent = "Update Item";
    cancelBtn.hidden = false;
    nameInput.focus();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const name = nameInput.value.trim();
    const category = categoryInput.value.trim();
    const quantity = parseInt(quantityInput.value, 10);
    const location = locationInput.value.trim();
    const status = statusInput.value;

    if (!name || !category || isNaN(quantity) || quantity < 0) {
      alert("Please fill in all required fields with valid values.");
      return;
    }

    const id = itemIdInput.value;
    if (id) {
      // update existing
      const idx = items.findIndex(function (i) { return i.id === id; });
      if (idx !== -1) {
        items[idx] = { id: id, name: name, category: category, quantity: quantity, location: location, status: status };
      }
    } else {
      // add new
      items.push({
        id: generateId(),
        name: name,
        category: category,
        quantity: quantity,
        location: location,
        status: status
      });
    }

    saveItems();
    resetForm();
    renderAll();
  }

  function handleTableClick(e) {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const id = btn.getAttribute("data-id");
    const action = btn.getAttribute("data-action");

    if (action === "edit") {
      startEdit(id);
    } else if (action === "delete") {
      if (confirm("Are you sure you want to delete this item?")) {
        items = items.filter(function (i) { return i.id !== id; });
        saveItems();
        renderAll();
      }
    }
  }

  function handleClearAll() {
    if (items.length === 0) return;
    if (confirm("This will delete ALL inventory items. Continue?")) {
      items = [];
      saveItems();
      resetForm();
      renderAll();
    }
  }

  // ---- Events ----
  form.addEventListener("submit", handleSubmit);
  cancelBtn.addEventListener("click", resetForm);
  inventoryBody.addEventListener("click", handleTableClick);
  clearAllBtn.addEventListener("click", handleClearAll);
  searchInput.addEventListener("input", renderTable);
  filterCategory.addEventListener("change", renderTable);
  filterStatus.addEventListener("change", renderTable);

  // ---- Init ----
  renderAll();
})();