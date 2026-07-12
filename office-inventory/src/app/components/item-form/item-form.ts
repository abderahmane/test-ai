import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Item, ItemRequest, ItemStatus, ITEM_STATUSES } from '../../models/item.model';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-item-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './item-form.html',
  styleUrl: './item-form.css',
})
export class ItemForm {
  private readonly inventoryService = inject(InventoryService);

  @Input() set editingItem(value: Item | null) {
    this.editing.set(value);
    if (value) {
      this.form.set({
        name: value.name,
        category: value.category,
        quantity: value.quantity,
        location: value.location ?? '',
        status: value.status,
      });
    } else {
      this.resetForm();
    }
  }

  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  readonly statuses = ITEM_STATUSES;
  readonly editing = signal<Item | null>(null);
  readonly categories = signal<string[]>([]);
  readonly error = signal<string | null>(null);

  readonly form = signal<ItemRequest>({
    name: '',
    category: '',
    quantity: 0,
    location: '',
    status: 'In Stock' as ItemStatus,
  });

  constructor() {
    this.inventoryService.categories().subscribe((c) => this.categories.set(c));
  }

  update<K extends keyof ItemRequest>(key: K, value: ItemRequest[K]): void {
    this.form.update((f) => ({ ...f, [key]: value }));
  }

  submit(): void {
    const f = this.form();
    if (!f.name.trim() || !f.category.trim() || f.quantity < 0) {
      this.error.set('Please fill in all required fields with valid values.');
      return;
    }
    const payload: ItemRequest = {
      ...f,
      name: f.name.trim(),
      category: f.category.trim(),
      location: f.location?.trim() || null,
    };
    const request$ = this.editing()
      ? this.inventoryService.update(this.editing()!.id, payload)
      : this.inventoryService.create(payload);

    request$.subscribe({
      next: () => {
        this.resetForm();
        this.editing.set(null);
        this.saved.emit();
      },
      error: (err) => {
        this.error.set(err?.error?.error ?? 'Failed to save item.');
      },
    });
  }

  cancel(): void {
    this.resetForm();
    this.editing.set(null);
    this.cancelled.emit();
  }

  private resetForm(): void {
    this.form.set({
      name: '',
      category: '',
      quantity: 0,
      location: '',
      status: 'In Stock' as ItemStatus,
    });
    this.error.set(null);
  }
}