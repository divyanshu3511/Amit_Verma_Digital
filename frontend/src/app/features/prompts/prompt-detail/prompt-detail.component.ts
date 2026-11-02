import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { PromptService } from '../../../core/services/prompt.service';
import { LanguageService } from '../../../core/services/language.service';
import { ToastService } from '../../../core/services/toast.service';
import { SiteSettingService } from '../../../core/services/site-setting.service';
import { Prompt } from '../../../core/models/prompt.model';
import { SiteSetting } from '../../../core/models/site-setting.model';

@Component({
  selector: 'app-prompt-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './prompt-detail.component.html',
  styleUrls: ['./prompt-detail.component.css']
})
export class PromptDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private promptService = inject(PromptService);
  private toastService = inject(ToastService);
  siteSettingService = inject(SiteSettingService);
  langService = inject(LanguageService);

  prompt?: Prompt;
  relatedPrompts: Prompt[] = [];
  settings?: SiteSetting;
  isLoading = true;

  ngOnInit(): void {
    this.siteSettingService.getSettings().subscribe(settings => {
      this.settings = settings;
    });

    this.route.paramMap.subscribe(params => {
      const idOrSlug = params.get('idOrSlug');
      if (idOrSlug) {
        this.loadPrompt(idOrSlug);
      }
    });
  }

  loadPrompt(idOrSlug: string): void {
    this.isLoading = true;
    this.promptService.getLivePromptByIdOrSlug(idOrSlug).subscribe(p => {
      this.isLoading = false;
      if (!p) {
        this.router.navigate(['/404']);
        return;
      }
      this.prompt = p;
      // Load related prompts in same category
      this.promptService.getLivePrompts(null, p.category).subscribe(list => {
        this.relatedPrompts = list.filter(item => item.id !== p.id).slice(0, 3);
      });
    });
  }

  copyPrompt(): void {
    if (!this.prompt) return;
    this.toastService.copyText(this.prompt.promptText, 'Prompt copied to clipboard!');
  }

  copyInstructions(): void {
    if (!this.prompt || !this.prompt.instructions) return;
    const text = this.prompt.instructions
      .map(i => `${i.sortOrder}. ${i.instructionText}`)
      .join('\n');
    this.toastService.copyText(text, 'Instructions copied to clipboard!');
  }

  copyBoth(): void {
    if (!this.prompt) return;
    let combined = `=== PROMPT ===\n${this.prompt.promptText.trim()}\n\n`;
    if (this.prompt.instructions && this.prompt.instructions.length > 0) {
      combined += `=== INSTRUCTIONS ===\n` + this.prompt.instructions
        .map(i => `${i.sortOrder}. ${i.instructionText}`)
        .join('\n');
    }
    this.toastService.copyText(combined, 'Prompt & Instructions copied!');
  }

  getKeywordsList(): string[] {
    if (!this.prompt?.keywords) return [];
    return this.prompt.keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
  }
}
