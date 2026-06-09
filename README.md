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

- **List page (`/`)** — Gen-1 Pokémon grid with name search, type filter, links to detail, and a
  skeleton-card loading state.
- **Detail page (`/pokemon/:name`)** — sprite, types, tabbed stats/abilities/moves (with a
  "show all moves" toggle), and a show/hide evolution-chain toggle.

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
| `@let` template binding | stable | `pokemon-type-badge/pokemon-type-badge.ts`, `pokemon-card/pokemon-card.ts` | Binds the signal read to a local so `@switch` / the template can narrow it |
| Arrow functions in templates | stable | `pokemon-detail/pokemon-detail.ts` | Inline `showAllMoves.update((v) => !v)` in the moves "show all / fewer" toggle |
| Spread syntax in templates | stable | `all-pokemon/all-pokemon.ts` | `[class]="[...chipClass, 'capitalize']"` — type chips reuse the `@let chipClass` list inline |
| Comments inside HTML elements | stable | `all-pokemon/all-pokemon.ts` | `//` comment between the search input's attribute bindings |
| `injectAsync()` + `onIdle` | stable | `pokemon-detail/pokemon-detail.ts` | Lazy-injected `EvolutionService` (own chunk), idle prefetch |
| `isActive()` router signal | stable | `app.ts` | `Signal<boolean>` for nav highlight |
| `withExperimentalPlatformNavigation()` | experimental | `app.config.ts` | Router on the native browser Navigation API |
| `withExperimentalAutoCleanupInjectors()` | experimental | `app.config.ts` | Destroys injectors of inactive lazy routes (memory hygiene) |
| WebMCP (`provideExperimentalWebMcpTools`) | experimental | `mcp/pokemon-tools.ts`, `app.config.ts` | `get_pokemon` tool exposed to AI agents |

> Lazy code-splitting is visible in `ng build`: `all-pokemon`, `pokemon-detail`, and
> `evolution-service` each emit their own chunk.

## Project structure

```
src/app/
  all-pokemon/            list page (Signal Forms + Aria Listbox + httpResource)
  pokemon-detail/         detail page (Aria Tabs + injectAsync + arrow-fn toggle)
  pokemon-card/           presentational card (input.required() + @let)
  pokemon-card-skeleton/  loading placeholder (Tailwind animate-pulse)
  pokemon-type-badge/     type chip (@switch + @let)
  services/               PokemonService, EvolutionService (@Service)
  mcp/                    WebMCP tool descriptors
  models/                 typed PokéAPI responses + view models
  util/                   toPokemonCard mapper
```

## Not Angular 22 (used anyway)

- **`animate.enter` / `animate.leave`** (`all-pokemon/all-pokemon.ts`) — the loading→grid
  transition. Shipped in **Angular 20.2**, so it is *not* a v22 feature; included only for UX
  polish. Don't present it as new in v22.

## Real v22 features not yet demoed (room to grow)

- **`ChangeDetectionStrategy.Eager`** — the rename of the former `.Default`.
- **`@boundary`** error boundaries — developer preview (Q3 2026), not in the stable API yet.

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
