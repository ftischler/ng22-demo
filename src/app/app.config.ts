import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideExperimentalWebMcpTools,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withExperimentalAutoCleanupInjectors,
  withExperimentalPlatformNavigation,
} from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { pokemonMcpTools } from './mcp/pokemon-tools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // v22 (experimental): withExperimentalPlatformNavigation() aligns the router with the
    // native browser Navigation API; withExperimentalAutoCleanupInjectors() destroys the
    // injectors of inactive lazy routes to prevent memory leaks.
    provideRouter(
      routes,
      withComponentInputBinding(),
      withExperimentalPlatformNavigation(),
      withExperimentalAutoCleanupInjectors(),
    ),
    provideHttpClient(),
    // v22 (experimental): register WebMCP tools for AI agents.
    provideExperimentalWebMcpTools(pokemonMcpTools),
  ],
};
