# Choose Wisely

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## CI/CD

Ogni pull request verso `develop` o `main` esegue il workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml):

1. `npm ci`
2. `npm run lint` (ESLint)
3. `npm run lint:style` (Stylelint)
4. `npm run typecheck` (`nuxt typecheck`)
5. `npm run build`
6. Lighthouse CI ([`.lighthouserc.json`](.lighthouserc.json)): builda l'app, la serve in locale con `node .output/server/index.mjs` e audita `/design-system` (l'unica pagina con contenuto reale in questa fase del progetto). La build fallisce se uno dei punteggi performance/accessibilità/best practices/SEO scende sotto 90.

   Nota: al momento di scrivere questo workflow, `/design-system` non supera ancora le soglie di accessibilità e SEO (manca `<title>`, `lang` su `<html>` e meta description) — questi aspetti sono responsabilità delle storie dedicate SCRUM-7 (accessibilità) e SCRUM-8 (SEO), non di questo task. Una volta che quelle storie saranno mergiate il gate dovrebbe tornare verde; se ciò non accade, verificare i report generati dallo step Lighthouse CI nei log della action.

### Hosting (Vercel) — passi manuali del reporter

L'hosting scelto è [Vercel](https://vercel.com) (piano free/Hobby). La configurazione lato codice è zero-config (Vercel riconosce automaticamente Nuxt/Nitro), quindi non è richiesto alcun `vercel.json`. I seguenti passi **non sono automatizzabili da codice** e restano a carico del reporter, direttamente nella dashboard Vercel:

1. Creare un progetto su [vercel.com](https://vercel.com) e collegarlo al repo GitHub `giadadelli/choose-wisely`.
2. Nelle impostazioni del progetto, impostare `main` come Production Branch.
3. Assegnare un dominio/sottodominio stabile al branch `develop` (per farlo fungere da ambiente di staging persistente, invece delle sole preview effimere per-PR).
4. Configurare le variabili d'ambiente su Vercel (es. `NUXT_PUBLIC_SITE_URL`).
5. **Più avanti**, quando il sito sarà pronto per andare live (fuori scope in questo task): aggiornare i DNS di `choosewisely.it` per puntare a Vercel al posto del sito WordPress attuale a cui è collegato oggi.

I punti 1-4 sono necessari perché le preview automatiche sulle PR e il deploy di produzione funzionino; il punto 5 resta rimandato a quando si deciderà di sostituire il sito WordPress esistente.

### Database (Neon) — migrazioni automatiche via GitHub Actions

Le migrazioni (`drizzle-kit migrate`) girano nel workflow [`.github/workflows/db-migrate.yml`](.github/workflows/db-migrate.yml) su push a `main`/`develop`, **non** nella build di Vercel: le variabili `DATABASE_URL`/`DATABASE_URL_UNPOOLED` su Vercel sono marcate Sensitive e vengono iniettate solo a runtime (funzioni serverless), mai durante lo step di build — uno script `vercel-build` con la migrazione dentro fallirebbe sempre per credenziali mancanti, indipendentemente dall'ordine migrate/build.

Passi manuali necessari, nella dashboard GitHub (Settings → Environments del repo):

1. Creare l'Environment `production`, con secret `DATABASE_URL_UNPOOLED` puntato al branch Neon `main`/produzione.
2. Creare l'Environment `development`, con secret `DATABASE_URL_UNPOOLED` puntato a un branch Neon dedicato a `develop` (non condiviso con production, per lo stesso motivo della nota storica sotto).

> Nota storica: prima di questa configurazione, `db:migrate` andava lanciato a mano in locale contro `.env.local`, che punta sempre allo stesso branch Neon indipendentemente dal branch git su cui si sta lavorando. Questo ha causato una migrazione finita sul branch `main` invece che su `develop`.

Le preview per-PR (branch Neon effimero creato ad hoc, deploy Vercel pilotato da GitHub Actions) sono fuori scope in questo task e restano da implementare in un secondo momento.
