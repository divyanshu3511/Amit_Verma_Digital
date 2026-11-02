import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { PromptListComponent } from './features/prompts/prompt-list/prompt-list.component';
import { PromptDetailComponent } from './features/prompts/prompt-detail/prompt-detail.component';
import { PrivacyComponent } from './features/legal/privacy/privacy.component';
import { TermsComponent } from './features/legal/terms/terms.component';
import { LoginComponent } from './features/account/login/login.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { AdminLayoutComponent } from './features/admin/admin-layout/admin-layout.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { AdminPromptsComponent } from './features/admin/prompts/admin-prompts.component';
import { AdminPromptFormComponent } from './features/admin/prompts/admin-prompt-form.component';
import { AdminPromptDeleteComponent } from './features/admin/prompts/admin-prompt-delete.component';
import { AdminSettingsComponent } from './features/admin/settings/admin-settings.component';
import { AdminVideosComponent } from './features/admin/videos/admin-videos.component';
import { AdminMessagesComponent } from './features/admin/messages/admin-messages.component';
import { AdminMessageDetailComponent } from './features/admin/messages/admin-message-detail.component';

export const routes: Routes = [
  // Public routes
  { path: '', component: HomeComponent },
  { path: 'prompts', component: PromptListComponent },
  { path: 'prompts/details/:idOrSlug', component: PromptDetailComponent },
  { path: 'prompts/:idOrSlug', component: PromptDetailComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'account/login', component: LoginComponent },
  { path: 'login', redirectTo: 'account/login', pathMatch: 'full' },

  // Admin routes (accessible directly while authEnabled is false)
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'dashboard', redirectTo: '', pathMatch: 'full' },
      { path: 'prompts', component: AdminPromptsComponent },
      { path: 'prompts/create', component: AdminPromptFormComponent },
      { path: 'prompts/edit/:id', component: AdminPromptFormComponent },
      { path: 'prompts/delete/:id', component: AdminPromptDeleteComponent },
      { path: 'settings', component: AdminSettingsComponent },
      { path: 'videos', component: AdminVideosComponent },
      { path: 'messages', component: AdminMessagesComponent },
      { path: 'messages/details/:id', component: AdminMessageDetailComponent },
      { path: 'messages/:id', component: AdminMessageDetailComponent }
    ]
  },

  // 404 Not Found & Wildcard
  { path: '404', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent }
];
