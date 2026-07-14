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

### Database (Neon) — mapping branch e migrazioni automatiche

Ogni ambiente deve avere il proprio branch Neon, per evitare che una migrazione lanciata per un ambiente finisca su un altro (è già successo: vedi nota sotto). Passi manuali, nella dashboard Neon (sezione integrazione Vercel):

1. Verificare che il branch Neon `main`/produzione sia quello collegato alle variabili d'ambiente Vercel per l'environment **Production** (`DATABASE_URL`, `DATABASE_URL_UNPOOLED`).
2. Creare/collegare un branch Neon dedicato a `develop`, così l'ambiente di staging persistente non condivide il DB con production.
3. Abilitare l'opzione dell'integrazione Neon "crea automaticamente un branch per ogni preview deployment", impostando come **parent branch di default `develop`** (non `main`): le feature branch/PR partono così dallo schema di staging più aggiornato, non da quello di produzione.

Le migrazioni (`drizzle-kit migrate`) vengono eseguite automaticamente ad ogni deploy tramite lo script `vercel-build` (`package.json`), che Vercel esegue al posto di `build` in fase di build — prima che il deploy vada live. Non essendo Vercel un processo persistente (a differenza di es. Flyway all'avvio di un'app Java), questo è il momento equivalente più vicino allo "startup": gira una volta per deploy, contro il `DATABASE_URL`/`DATABASE_URL_UNPOOLED` di quello specifico environment/branch, e se la migrazione fallisce il deploy non va live.

> Nota storica: prima di questa configurazione, `db:migrate` andava lanciato a mano in locale contro `.env.local`, che punta sempre allo stesso branch Neon indipendentemente dal branch git su cui si sta lavorando. Questo ha causato una migrazione finita sul branch `main` invece che su `develop`.
