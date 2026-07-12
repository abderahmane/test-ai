package com.example.inventory.dto;

public class InventoryStats {

    private long totalItems;
    private long totalQuantity;
    private long lowStockCount;
    private long categoryCount;

    public InventoryStats() {
    }

    public InventoryStats(long totalItems, long totalQuantity, long lowStockCount, long categoryCount) {
        this.totalItems = totalItems;
        this.totalQuantity = totalQuantity;
        this.lowStockCount = lowStockCount;
        this.categoryCount = categoryCount;
    }

    public long getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(long totalItems) {
        this.totalItems = totalItems;
    }

    public long getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(long totalQuantity) {
        this.totalQuantity = totalQuantity;
    }

    public long getLowStockCount() {
        return lowStockCount;
    }

    public void setLowStockCount(long lowStockCount) {
        this.lowStockCount = lowStockCount;
    }

    public long getCategoryCount() {
        return categoryCount;
    }

    public void setCategoryCount(long categoryCount) {
        this.categoryCount = categoryCount;
    }
}