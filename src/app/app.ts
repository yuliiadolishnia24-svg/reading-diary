import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface BookEntry {
  title: string;
  author: string;
  image?: string;
  review?: string;
  rating: number;
  date: string;
  showDetails?: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  imports: [CommonModule, FormsModule]
})
export class App {
  entries: BookEntry[] = [];
  newEntry: Partial<BookEntry> = { rating: 0 };
  editingIndex: number | null = null;

  // Пряма прив'язка до теми
  darkTheme: boolean = false;

  constructor() {
    const saved = localStorage.getItem('readingDiary');
    if (saved) this.entries = JSON.parse(saved);

    // Застосувати тему при старті
    this.updateBodyTheme();
  }

  // --- Книги ---
  saveEntry() {
  // Перевірка на порожні поля
  if (!this.newEntry.title?.trim() || !this.newEntry.author?.trim()) {
    alert('Будь ласка, заповніть обов\'язкові поля: Назва книги та Автор');
    return; // вихід з методу, книга не додається
  }

  const entry: BookEntry = {
    title: this.newEntry.title.trim(),
    author: this.newEntry.author.trim(),
    image: this.newEntry.image?.trim(),
    review: this.newEntry.review?.trim(),
    rating: this.newEntry.rating || 0,
    date: new Date().toLocaleDateString(),
    showDetails: false
  };

  if (this.editingIndex !== null) {
    this.entries[this.editingIndex] = entry;
    this.editingIndex = null;
  } else {
    this.entries.push(entry);
  }

  this.newEntry = { rating: 0 };
  this.saveToStorage();
}


  editEntry(index: number) {
    const entry = this.entries[index];
    this.newEntry = { ...entry };
    this.editingIndex = index;
  }

  deleteEntry(index: number) {
    this.entries.splice(index, 1);
    this.saveToStorage();
  }

  setRating(star: number) {
    this.newEntry.rating = star;
  }

  private saveToStorage() {
    localStorage.setItem('readingDiary', JSON.stringify(this.entries));
  }

  // --- Тема ---
  updateBodyTheme() {
    if (this.darkTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
}
