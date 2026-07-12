import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Item, InventoryStats } from './models/item.model';
import { InventoryService } from './services/inventory.service';
import { ItemForm } from './components/item-form/item-form';
import { InventoryList } from './components/inventory-list/inventory-list';
import { InventoryStatsComponent } from './components/inventory-stats/inventory-stats';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, ItemForm, InventoryList, InventoryStatsComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly inventoryService = inject(InventoryService);

  readonly items = signal<Item[]>([]);
  readonly stats = signal<InventoryStats | null>(null);
  readonly categories = signal<string[]>([]);
  readonly loading = signal(false);
  readonly editing = signal<Item | null>(null);

  readonly search = signal('');
  readonly filterCategory = signal('');
  readonly filterStatus = signal('');

  private debounce?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.refreshCategories();
    this.load();
  }

  load(): void {
    this.loading.set(true);
    const search = this.search();
    const category = this.filterCategory();
    const status = this.filterStatus();

    this.inventoryService.list(search, category, status).subscribe({
      next: (items) => {
        this.items.set(items);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.inventoryService.stats().subscribe((s) => this.stats.set(s));
  }

  onSearch(value: string): void {
    this.search.set(value);
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => this.load(), 250);
  }

  onFilterCategory(value: string): void {
    this.filterCategory.set(value);
    this.load();
  }

  onFilterStatus(value: string): void {
    this.filterStatus.set(value);
    this.load();
  }

  onSaved(): void {
    this.editing.set(null);
    this.refreshCategories();
    this.load();
  }

  onEdit(item: Item): void {
    this.editing.set(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onDelete(item: Item): void {
    if (!confirm(`Delete "${item.name}"?`)) return;
    this.inventoryService.delete(item.id).subscribe(() => {
      if (this.editing()?.id === item.id) this.editing.set(null);
      this.refreshCategories();
      this.load();
    });
  }

  onClearAll(): void {
    if (this.items().length === 0) return;
    if (!confirm('This will delete ALL inventory items. Continue?')) return;
    this.inventoryService.deleteAll().subscribe(() => {
      this.editing.set(null);
      this.refreshCategories();
      this.load();
    });
  }

  private refreshCategories(): void {
    this.inventoryService.categories().subscribe((c) => this.categories.set(c));
  }
}