import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideExperimentalWebMcpTools,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withExperimentalPlatformNavigation,
} from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { pokemonMcpTools } from './mcp/pokemon-tools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // withComponentInputBinding(): route params -> signal inputs (PokemonDetail.name).
    // v22 (experimental): withExperimentalPlatformNavigation() aligns the router with the
    // native browser Navigation API.
    provideRouter(routes, withComponentInputBinding(), withExperimentalPlatformNavigation()),
    provideHttpClient(),
    // v22 (experimental): register WebMCP tools for AI agents.
    provideExperimentalWebMcpTools(pokemonMcpTools),
  ],
};
