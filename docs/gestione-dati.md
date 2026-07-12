# Gestione dati: come inserire un professionista o un'area

Choose Wisely (MVP) non ha un pannello di amministrazione: professionisti e aree si inseriscono
**direttamente nel database**. Questa guida è pensata per chi non è developer.

## Accedere al database

Il database è Postgres su [Neon](https://neon.tech). Due modi per accedere, dal più semplice al più tecnico:

1. **Console web di Neon** (consigliata): vai su [console.neon.tech](https://console.neon.tech),
   apri il progetto, sezione "Tables" — puoi vedere e modificare le righe con un'interfaccia a
   foglio di calcolo, senza scrivere SQL.
2. **Drizzle Studio**: dalla root del progetto, esegui `npx drizzle-kit studio` — apre
   un'interfaccia web locale simile, con viste già collegate allo schema del progetto.

## Inserire un nuovo professionista

Tabella: `professional`.

| Campo | Obbligatorio | Significato |
|---|---|---|
| `slug` | sì | Identificativo nell'URL (`/professionisti/[slug]`). Solo lettere minuscole, numeri, trattini. Deve essere unico |
| `name` | sì | Nome visualizzato |
| `photo_url` | no | URL della foto (va caricata da qualche altra parte, es. un hosting immagini, e incollato solo il link) |
| `bio` | no | Breve biografia mostrata sul profilo |
| `phone` | no | Numero di telefono (diventa un link `tel:` cliccabile) |
| `email` | no | Email di contatto (diventa un link `mailto:` cliccabile) |
| `website_url` | no | Sito esterno del professionista |
| `social_links` | no | Lista di link social, formato JSON: `[{"platform": "instagram", "url": "https://..."}]` |
| `is_founder` | sì | `true`/`false` — vedi sezione cap Founder sotto |
| `published` | sì | `true`/`false` — solo i profili `published = true` compaiono sul sito |

Dopo aver creato la riga, per collegare il professionista alle sue specializzazioni: vai sulla
tabella `professional_area` e aggiungi una riga per ogni sotto-area di competenza, con
`professional_id` (l'id del professionista appena creato) e `area_id` (l'id della sotto-area,
vedi sotto come trovarlo).

### Cap Founder = 20

Il flag `is_founder` non ha nessun controllo automatico: **prima di impostarlo a `true`, conta
manualmente quanti professionisti hanno già `is_founder = true`** (query rapida:
`SELECT count(*) FROM professional WHERE is_founder = true`) e assicurati di non superare 20.

## Inserire una nuova area (macro-area o sotto-area)

Tabella: `area`. La stessa tabella contiene sia le macro-aree (es. "Salute") sia le sotto-aree
(es. "Ciclo doloroso o irregolare") — si distinguono dal campo `parent_id`.

| Campo | Obbligatorio | Significato |
|---|---|---|
| `slug` | sì | Usato nell'URL (`/area/[slug]`). Unico |
| `name` | sì | Nome visualizzato |
| `parent_id` | solo per sotto-aree | `null` se è una macro-area; altrimenti l'id della macro-area a cui appartiene |
| `hook` | solo macro-aree | Frase breve mostrata come sottotitolo (es. "Mi sento così → cerco aiuto qui") |
| `short_description` | solo macro-aree | Descrizione breve della macro-area |
| `code` | solo sotto-aree | Identificativo stabile, es. `SAL-01`. Unico |
| `keywords` | solo sotto-aree | Lista di sinonimi per l'autocomplete, es. `["ciclo doloroso", "dismenorrea"]` |

Per trovare l'`id` di una macro-area esistente (necessario per creare una sotto-area):
`SELECT id, name FROM area WHERE parent_id IS NULL`.

## Popolamento massivo / ripartire da zero

Se serve ripopolare tutte le aree da `areas.json` (es. dopo aver aggiornato la tassonomia),
esegui dalla root del progetto:

```bash
npm run db:seed
```

Lo script è idempotente: aggiorna le righe esistenti (stesso `slug`) invece di duplicarle, quindi
è sicuro rieseguirlo. Inserisce anche 2 professionisti di esempio, utili per verificare le pagine
prima che i dati reali siano pronti (il popolamento reale con i primi 20 Founder è un task
separato, SCRUM-57, previsto più avanti prima del lancio).
