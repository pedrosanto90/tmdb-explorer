# 🎬 TMDB Explorer

Angular application to explore movies using the [The Movie Database (TMDB)](https://www.themoviedb.org/) API.

Project developed to practice advanced Angular and RxJS concepts.

## 🚀 Demo

> Link to the deploy (Vercel/Netlify — see deploy section below)

## 🛠️ Technologies

- Angular 21 (Standalone Components)
- TypeScript (strict mode)
- RxJS
- TMDB API v3

## ✨ Features

- Popular movies listing
- Real-time search with debounce
- Detail page with cast
- Error handling with retry
- Lazy loading per route

## 📚 RxJS concepts practiced

| Operator | Where it is used |
|---|---|
| `debounceTime` | Search — avoids spamming the API |
| `distinctUntilChanged` | Search — ignores repeated values |
| `switchMap` | Search and detail — cancels previous requests |
| `forkJoin` | Detail — loads movie and credits in parallel |
| `takeUntil` | All components — avoids memory leaks |
| `catchError` | All components — error handling |

## ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/your-username/tmdb-explorer.git
cd tmdb-explorer

# Install dependencies
npm install

# Configure the API key
# Edit src/environments/environment.ts and add your TMDB API key

# Start the development server
ng serve
```

## 🔑 API Key

1. Create an account at [themoviedb.org](https://www.themoviedb.org/)
2. Go to **Settings → API → Developer**
3. Copy the **API Key (v3)**
4. Paste it into `src/environments/environment.ts`

## 📁 Project Structure

```
src/app/
├── core/                  # Services, interceptors, models
├── features/
│   ├── movies/            # Listing and search
│   └── movie-detail/      # Detail page
└── shared/                # Reusable components
```
