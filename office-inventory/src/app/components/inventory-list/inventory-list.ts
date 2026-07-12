import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Item } from '../../models/item.model';

@Component({
  selector: 'app-inventory-list',
  imports: [CommonModule],
  templateUrl: './inventory-list.html',
  styleUrl: './inventory-list.css',
})
export class InventoryList {
  @Input() items: Item[] = [];
  @Input() loading = false;
  @Output() edit = new EventEmitter<Item>();
  @Output() delete = new EventEmitter<Item>();

  badgeClass(status: string): string {
    switch (status) {
      case 'In Stock': return 'badge-in';
      case 'Low Stock': return 'badge-low';
      case 'Out of Stock': return 'badge-out';
      case 'Under Repair': return 'badge-repair';
      default: return 'badge-in';
    }
  }
}