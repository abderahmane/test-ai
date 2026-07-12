package com.example.inventory.repository;

import com.example.inventory.model.Item;
import com.example.inventory.model.ItemStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    List<Item> findByCategory(String category);

    List<Item> findByStatus(ItemStatus status);

    List<Item> findByNameContainingIgnoreCase(String name);

    Optional<Item> findByNameAndCategory(String name, String category);

    @Query("SELECT DISTINCT i.category FROM Item i ORDER BY i.category ASC")
    List<String> findDistinctCategories();
}