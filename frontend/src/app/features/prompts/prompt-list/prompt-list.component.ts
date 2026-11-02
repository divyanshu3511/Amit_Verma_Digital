import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PromptService } from '../../../core/services/prompt.service';
import { LanguageService } from '../../../core/services/language.service';
import { Prompt } from '../../../core/models/prompt.model';
import { PromptCardComponent } from '../../../shared/components/prompt-card/prompt-card.component';

@Component({
  selector: 'app-prompt-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PromptCardComponent],
  templateUrl: './prompt-list.component.html',
  styleUrls: ['./prompt-list.component.css']
})
export class PromptListComponent implements OnInit {
  private promptService = inject(PromptService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  langService = inject(LanguageService);

  prompts: Prompt[] = [];
  categories: string[] = [];

  searchTerm = '';
  selectedCategory = 'All';
  sortBy = 'newest';

  ngOnInit(): void {
    this.promptService.getCategories().subscribe(cats => {
      this.categories = cats;
    });

    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['search'] || '';
      this.selectedCategory = params['category'] || 'All';
      this.sortBy = params['sort'] || 'newest';
      if (params['lang'] === 'hi' || params['lang'] === 'en') {
        this.langService.setLanguage(params['lang'], false);
      }
      this.loadPrompts();
    });
  }

  loadPrompts(): void {
    this.promptService.getLivePrompts(this.searchTerm, this.selectedCategory, this.sortBy).subscribe(prompts => {
      this.prompts = prompts;
    });
  }

  onFilterSubmit(): void {
    this.updateQueryParams();
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.updateQueryParams();
  }

  onSortChange(): void {
    this.updateQueryParams();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 'All';
    this.sortBy = 'newest';
    this.updateQueryParams();
  }

  private updateQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        search: this.searchTerm || null,
        category: this.selectedCategory === 'All' ? null : this.selectedCategory,
        sort: this.sortBy === 'newest' ? null : this.sortBy
      },
      queryParamsHandling: 'merge'
    });
  }
}
