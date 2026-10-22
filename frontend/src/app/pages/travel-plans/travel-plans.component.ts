import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface TravelPlan {
  id: number;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  notes: string;
}

@Component({
  selector: 'app-travel-plans',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './travel-plans.component.html',
  styleUrl: './travel-plans.component.css'
})
export class TravelPlansComponent {
  destination = '';
  startDate = '';
  endDate = '';
  travelers = 1;
  notes = '';

  message = '';
  plans: TravelPlan[] = [];

  constructor() {
    this.loadPlans();
  }

  loadPlans() {
    try {
      const savedPlans = localStorage.getItem('safetravel_plans');
      this.plans = savedPlans ? JSON.parse(savedPlans) : [];
    } catch {
      this.plans = [];
    }
  }

  savePlan() {
    this.message = '';

    if (!this.destination.trim()) {
      this.message = 'Please enter a destination.';
      return;
    }

    if (!this.startDate || !this.endDate) {
      this.message = 'Please select both travel dates.';
      return;
    }

    if (this.endDate < this.startDate) {
      this.message = 'Return date cannot be before the departure date.';
      return;
    }

    if (!Number.isInteger(this.travelers) ||
        this.travelers < 1 ||
        this.travelers > 100) {
      this.message = 'Enter a valid number of travellers (1–100).';
      return;
    }

    const plan: TravelPlan = {
      id: Date.now(),
      destination: this.destination.trim(),
      startDate: this.startDate,
      endDate: this.endDate,
      travelers: this.travelers,
      notes: this.notes.trim()
    };

    this.plans = [...this.plans, plan];
    this.persistPlans();

    this.destination = '';
    this.startDate = '';
    this.endDate = '';
    this.travelers = 1;
    this.notes = '';

    this.message = 'Your travel plan has been saved successfully!';
  }

  deletePlan(id: number) {
    this.plans = this.plans.filter(plan => plan.id !== id);
    this.persistPlans();
    this.message = 'Travel plan deleted.';
  }

  private persistPlans() {
    try {
      localStorage.setItem('safetravel_plans', JSON.stringify(this.plans));
    } catch {
      this.message = 'Unable to save plans in this browser.';
    }
  }
}