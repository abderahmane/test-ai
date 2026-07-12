package com.example.inventory.service;

import com.example.inventory.dto.InventoryStats;
import com.example.inventory.dto.ItemRequest;
import com.example.inventory.model.Item;
import com.example.inventory.model.ItemStatus;
import com.example.inventory.repository.ItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ItemService {

    private static final int LOW_STOCK_THRESHOLD = 5;

    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public List<Item> findAll() {
        return itemRepository.findAll();
    }

    public List<Item> search(String term, String category, String status) {
        List<Item> items = itemRepository.findAll();

        return items.stream()
                .filter(item -> matchesTerm(item, term))
                .filter(item -> category == null || category.isBlank() || item.getCategory().equals(category))
                .filter(item -> status == null || status.isBlank() || item.getStatus().name().equals(status))
                .toList();
    }

    public Item findById(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Item not found with id: " + id));
    }

    @Transactional
    public Item create(ItemRequest request) {
        Item item = new Item();
        applyRequest(item, request);
        return itemRepository.save(item);
    }

    @Transactional
    public Item update(Long id, ItemRequest request) {
        Item existing = findById(id);
        applyRequest(existing, request);
        return itemRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        if (!itemRepository.existsById(id)) {
            throw new IllegalArgumentException("Item not found with id: " + id);
        }
        itemRepository.deleteById(id);
    }

    @Transactional
    public void deleteAll() {
        itemRepository.deleteAll();
    }

    public List<String> findCategories() {
        return itemRepository.findDistinctCategories();
    }

    public InventoryStats computeStats() {
        List<Item> items = itemRepository.findAll();
        long totalItems = items.size();
        long totalQuantity = items.stream().mapToLong(i -> i.getQuantity() == null ? 0 : i.getQuantity()).sum();
        long lowStockCount = items.stream()
                .filter(i -> i.getQuantity() != null && i.getQuantity() <= LOW_STOCK_THRESHOLD)
                .count();
        long categoryCount = itemRepository.findDistinctCategories().size();
        return new InventoryStats(totalItems, totalQuantity, lowStockCount, categoryCount);
    }

    private void applyRequest(Item item, ItemRequest request) {
        item.setName(request.getName());
        item.setCategory(request.getCategory());
        item.setQuantity(request.getQuantity());
        item.setLocation(request.getLocation());
        item.setStatus(request.getStatus() == null ? ItemStatus.IN_STOCK : request.getStatus());
    }

    private boolean matchesTerm(Item item, String term) {
        if (term == null || term.isBlank()) {
            return true;
        }
        String t = term.toLowerCase();
        return (item.getName() != null && item.getName().toLowerCase().contains(t))
                || (item.getCategory() != null && item.getCategory().toLowerCase().contains(t))
                || (item.getLocation() != null && item.getLocation().toLowerCase().contains(t));
    }
}