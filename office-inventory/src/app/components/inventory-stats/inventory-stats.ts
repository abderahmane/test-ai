import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryStats } from '../../models/item.model';

@Component({
  selector: 'app-inventory-stats',
  imports: [CommonModule],
  templateUrl: './inventory-stats.html',
  styleUrl: './inventory-stats.css',
})
export class InventoryStatsComponent {
  @Input() stats: InventoryStats | null = null;
}