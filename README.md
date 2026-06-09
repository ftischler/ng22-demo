# ng22-demo — Angular 22 Feature Showcase

A small Pokédex app (data from [PokéAPI](https://pokeapi.co)) built to demonstrate the
headline features of **Angular 22**. Every feature below is wired into a real, working
screen — not a standalone snippet.

## Stack

- Angular **22.0**
- `@angular/aria` 22 (accessible headless primitives)
- Tailwind CSS 4
- TypeScript 6
- Zoneless + OnPush by default

## What it does

- **List page (`/`)** — Gen-1 Pokémon grid with name search, type filter, and links to detail.
- **Detail page (`/pokemon/:name`)** — sprite, types, tabbed stats/abilities/moves, and a
  show/hide evolution-chain toggle.

## Demonstrated Angular 22 features

| Feature | Status | Where | What to look at |
| --- | --- | --- | --- |
| `httpResource()` | stable | `services/pokemon-service.ts` | Signal-driven HTTP; URL `undefined` ⇒ request skipped |
| `@Service()` | stable | `services/pokemon-service.ts`, `services/evolution-service.ts` | Replaces `@Injectable({ providedIn: 'root' })` |
| OnPush by default | stable | `all-pokemon/all-pokemon.ts` | No `changeDetection` set — it's the new default |
| Signal Forms | stable | `all-pokemon/all-pokemon.ts` | `form()`, `minLength()`, `[formField]`, `debounce()` |
| `debounce()` (forms) | stable | `all-pokemon/all-pokemon.ts` | Delays model sync of the search field by 300 ms |
| Angular Aria — Listbox | stable | `all-pokemon/all-pokemon.ts` | `ngListbox`/`ngOption` type filter (value is `V[]`) |
| Angular Aria — Tabs | stable | `pokemon-detail/pokemon-detail.ts` | `ngTabs`/`ngTabList`/`ngTabPanel`/`ngTabContent` |
| `@switch` multi-case + exhaustive | stable | `pokemon-type-badge/pokemon-type-badge.ts` | Stacked `@case` fallthrough (shared color) + `@default never` exhaustiveness over the type union |
| `@let` template binding | stable | `pokemon-type-badge/pokemon-type-badge.ts` | Binds the signal read to a local so `@switch` can narrow it |
| `injectAsync()` + `onIdle` | stable | `pokemon-detail/pokemon-detail.ts` | Lazy-injected `EvolutionService` (own chunk), idle prefetch |
| `isActive()` router signal | stable | `app.ts` | `Signal<boolean>` for nav highlight |
| `withComponentInputBinding()` | stable | `app.config.ts` | Route param `:name` → signal `input.required()` |
| `withExperimentalPlatformNavigation()` | experimental | `app.config.ts` | Router on the native browser Navigation API |
| WebMCP (`provideExperimentalWebMcpTools`) | experimental | `mcp/pokemon-tools.ts`, `app.config.ts` | `get_pokemon` tool exposed to AI agents |

> Lazy code-splitting is visible in `ng build`: `all-pokemon`, `pokemon-detail`, and
> `evolution-service` each emit their own chunk.

## Project structure

```
src/app/
  all-pokemon/        list page (Signal Forms + Aria Listbox + httpResource)
  pokemon-detail/     detail page (Aria Tabs + injectAsync)
  services/           PokemonService, EvolutionService (@Service)
  mcp/                WebMCP tool descriptors
  models/             typed PokéAPI responses + view models
  util/               toPokemonCard mapper
```

## Run

```bash
pnpm install
pnpm start        # dev server on http://localhost:4200
pnpm build        # production build
```

## Notes

- `@Service()` and `httpResource()` are intentional v22 idioms, not legacy `@Injectable`/`HttpClient`.
- Experimental features (`withExperimentalPlatformNavigation`, WebMCP) are flagged as such and
  may change in future releases.
- Pokémon sprites are loaded with `NgOptimizedImage` (`ngSrc`); all interactive elements carry
  ARIA roles/labels and visible focus states to satisfy WCAG AA.
