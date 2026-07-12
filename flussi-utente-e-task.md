# Piattaforma Diana — Flussi Utente & Task di Implementazione (MVP)

**Stack**: Vue 3 + Nuxt 4, SSR, mobile-first, accessibile (WCAG 2.1 AA), ottimizzato SEO
**Scope MVP**: solo il flusso Diana (directory pura, nessun self-service professionista)
**Ultimo aggiornamento**: bozza v2

---

## 0. Assunzioni di lavoro (da validare)

| # | Assunzione | Motivo | Alternativa se non valida |
|---|---|---|---|
| A1 | **[MVP - confermato]** Diana NON si registra mai. Non contatta il professionista dalla piattaforma: trova il professionista e i suoi contatti (telefono/email/sito/social), poi esce dalla piattaforma per contattarlo autonomamente | Massima semplicità per il lancio, zero attrito, la piattaforma è una directory/vetrina | In una v2 si potrà introdurre account, contatto in-app, richieste tracciate |
| A2 | **[MVP - confermato]** In questa fase NON esiste self-service per i professionisti (niente registrazione Elodie/Anna, niente pagamento Founder online) E NON esiste nemmeno un backoffice/pannello di amministrazione con login: i profili professionista e le aree vengono inseriti **direttamente nel database** (script di seed/migrazione o client DB diretto), non tramite una UI applicativa | Riduce ulteriormente lo scope tecnico: niente autenticazione, niente UI di gestione da costruire e mantenere | In v2: onboarding self-service + pagamento Founder online, eventualmente con un vero backoffice (vedi Appendice B) |
| A3 | Il flag "Founder" e il cap di 20 sono gestiti come dato nel DB (impostato a mano durante l'inserimento), non da un flusso di pagamento in-app né da una UI di validazione | Coerente con A2 | — |
| A4 | **[MVP - confermato]** La ricerca NON è free-text: è un autocomplete che filtra le sotto-aree esistenti (tassonomia chiusa), attivo già dal primo carattere digitato, dato che all'inizio le sotto-aree saranno poche decine. Diana può selezionare solo tra i match proposti | Con poche sotto-aree l'autocomplete istantaneo è più semplice da realizzare, più veloce da usare e non richiede un motore di ricerca/matching semantico | Se la tassonomia cresce molto, valutare debounce e/o ricerca server-side con matching più sofisticato |
| A5 | **[MVP - confermato]** Nessuna recensione in questa fase. Il profilo professionista mostra solo i dati inseriti nel DB (bio, specializzazioni, contatti, badge Founder), senza rating/recensioni | Riduce lo scope (niente moderazione, niente form guest, niente rischio spam) | In v2 si potranno introdurre recensioni, eventualmente guest-moderate come ipotizzato in precedenza |

---

## 0.1 Palette colori (scelta v1)

Brand identity: primario terracotta (caldo, non clinico, si distingue dal blu/rosa stereotipati del settore health), secondario salvia (calma, fiducia), neutri caldi coerenti con i wireframe di Epic 0. Tutte le coppie testo/sfondo sotto sono verificate WCAG 2.1 AA (contrasto >= 4.5:1 su testo normale).

**Primario — terracotta**
| Stop | Hex | Uso |
|---|---|---|
| 50 | `#FDF3EE` | sfondo tinta chiaro |
| 100 | `#FAE4D8` | sfondo tinta |
| 300 | `#F0B490` | bordi/accenti decorativi |
| 500 | `#C1622D` | icone, bordi enfatizzati (non per testo bianco sopra) |
| 600 | `#A84F26` | bottoni/fill primari, testo bianco sopra = 5.5:1 |
| 700 | `#8A3F1D` | testo/link su sfondo chiaro = 7.5:1 |
| 900 | `#4A2410` | titoli su sfondo tinta |

**Secondario — salvia**
| Stop | Hex | Uso |
|---|---|---|
| 50 | `#EEF3F0` | sfondo tinta chiaro |
| 100 | `#DCE7E0` | sfondo tinta |
| 300 | `#9FB8A9` | bordi/accenti decorativi |
| 500 | `#4B6C5B` | fill secondari, testo bianco sopra = 5.8:1 |
| 700 | `#35493D` | testo su sfondo chiaro |
| 900 | `#1D281F` | titoli su sfondo tinta |

**Neutri caldi** (coerenti con i wireframe già realizzati)
| Stop | Hex | Uso |
|---|---|---|
| 0 | `#FFFFFF` | superficie/card |
| 50 | `#F7F5F0` | sfondo pagina |
| 100 | `#F1EFE8` | sfondo pagina/placeholder |
| 300 | `#D3D1C7` | bordi leggeri |
| 500 | `#B4B2A9` | bordi standard |
| 700 | `#5F5E5A` | testo secondario |
| 900 | `#2C2C2A` | testo primario |

**Stati semantici**
| Stato | Sfondo tinta | Testo/icona | Contrasto testo bianco su fill |
|---|---|---|---|
| Successo | `#E9F5EE` | `#2E7D4F` | 5.0:1 |
| Attenzione | `#FDF0D9` | `#8A5A00` | 5.9:1 |
| Errore | `#FBEAE9` | `#B3261E` | 6.5:1 |

Badge "Founder": usa la tinta primaria (sfondo primario-50, testo primario-700) invece di un colore dedicato, per restare coerente col brand.

Swatch visivi generati con il Visualizer in chat, non allegati come file separato (solo riferimento hex qui sopra è la fonte di verità).

---

## 1. Attori

- **Diana** — utente finale, 35 anni, cerca un professionista che risolva un problema specifico. Naviga da mobile, spesso via ricerca organica (SEO) o social. Unico attore con un flusso applicativo in questo MVP.
- **Elodie / Anna** (professioniste, Founder e standard) — in MVP non hanno un flusso applicativo: i loro profili esistono sulla piattaforma ma vengono inseriti direttamente nel database dal team tecnico, non da loro stesse e non tramite alcuna UI di gestione. Il flusso di self-service (registrazione, onboarding, pagamento quota Founder, dashboard) è documentato in Appendice B come riferimento per la v2, ma non è nello scope di questa fase.

## 1.1 Tassonomia aree (v2 — validata con ricerca)

**Nota sullo scope**: questa tassonomia amplia il perimetro rispetto agli esempi iniziali (che erano solo salute/benessere): include ora anche Casa e Lavoro. Choose Wisely quindi non è più (solo) una directory di salute, ma una directory più ampia di professioniste per problemi/ambiti di vita femminili.

**Metodo**: la lista v1 (fornita dall'utente) è stata verificata con ricerche su dati/statistiche italiani per confermare quali problemi sono effettivamente più diffusi/cercati nel target (donne, prevalentemente 30-50 anni). Modifiche rispetto alla v1:
- Aggiunta "Ansia e sbalzi d'umore" (Salute) come sotto-area distinta da "Stress e burnout" — dati mostrano incidenza doppia di depressione nelle donne e ansia come esperienza molto diffusa, abbastanza specifica da meritare una propria voce
- "Carico mentale familiare" (Casa) spostato in cima alla lista — è il concetto più forte nei dati, con una letteratura/terminologia consolidata (mental load)
- Accorpate "Disorganizzazione cronica" + "Casa sempre in disordine" (stesso problema) in "Casa disordinata e disorganizzazione cronica"
- Accorpate "Gestione tasse e scadenze" + "Confusione fiscale" (stesso problema) in "Gestione tasse, scadenze e confusione fiscale"

Totale: 3 macro-aree, 28 sotto-aree.

### Architettura ricerca: codice, nome e keyword (decisione presa qui, non in implementazione)

Diana può cercare lo stesso problema con parole diverse (es. "ciclo doloroso" vs "dolori mestruali" vs "dismenorrea"). Per gestirlo, ogni sotto-area ha tre elementi definiti come **contenuto** (non come logica applicativa):
- **codice**: identificativo stabile e indipendente dallo slug (es. `SAL-01`), cambia solo se la sotto-area stessa cambia concettualmente
- **nome**: etichetta canonica mostrata in UI
- **keywords**: lista di sinonimi/varianti linguistiche che devono far trovare la stessa sotto-area

Questo richiede un campo aggiuntivo `parole_chiave: string[]` sull'entità Area nello schema DB (Epic 1, SCRUM-14) — segnalato come nota tecnica su quel task.

L'**algoritmo di match** (come interrogare nome+keyword, gestione di plurali/accenti/typo, ranking se una keyword ricorre in più sotto-aree) resta invece un task di implementazione (Epic 2, SCRUM-21): qui serve solo che i dati esistano, non serve risolvere l'algoritmo.

Elenco completo con codice, slug e keyword in `areas.json` (consegnato in chat), pronto per lo script di seed (Epic 1).

### 🌿 Salute (12 sotto-aree)
*"Mi sento così → cerco aiuto qui"*

Ciclo doloroso o irregolare · Premenopausa e menopausa · Stanchezza cronica e calo di energia · Stress e burnout · Ansia e sbalzi d'umore · Difficoltà a dormire · Mal di schiena e cervicale · Dolori articolari · Gonfiore e digestione difficile · Aumento di peso dopo i 35 · Fame nervosa · Gambe gonfie e circolazione lenta

### 🏡 Casa (8 sotto-aree)
*"La mia casa mi pesa invece di aiutarmi"*

Carico mentale familiare · Casa disordinata e disorganizzazione cronica · Mancanza di tempo per la gestione domestica · Routine familiari che non funzionano · Spazi piccoli e poco funzionali · Gestione dei figli e organizzazione familiare · Rientro al lavoro e riorganizzazione della casa · Smart working senza spazio adeguato

### 💼 Lavoro (8 sotto-aree)
*"Voglio più controllo e chiarezza"*

Paura e dubbi sulla Partita IVA · Gestione tasse, scadenze e confusione fiscale · Rientro al lavoro dopo la maternità · Difficoltà a valorizzarsi professionalmente · Desiderio di cambiare lavoro · Organizzazione del lavoro autonomo · Educazione finanziaria di base · Pianificazione economica e investimenti

Nota: le emoji sono solo un riferimento visivo in questo documento, non implicano l'uso di emoji nella UI reale (icone gestite via Tabler icon set nel design system, Epic 0/SCRUM-6).

---

## 2. Flusso Diana (cliente) — MVP, directory pura

Riferimento visivo/informativo: choosewisely.it (bozza online, non funzionante). Riprendiamo l'impostazione dei contenuti e dell'interazione, non lo stack tecnico (lì e' WordPress, noi costruiamo in Vue/Nuxt).

### 2.1 Modello dati "aree problema" (ispirato al reference)

Tassonomia gerarchica a 2 livelli:
- Macro-area (padre): es. "Ormoni & Ciclo", "Stress & Energia", "Dolori muscolo-scheletrici", "Metabolismo & Digestione", "Circolazione & Gonfiore"
- Sotto-area (figlia, il problema vero e proprio): es. "Ciclo irregolare", "Sindrome premestruale" sotto "Ormoni & Ciclo"

URL pattern: `/area/[slug-sotto-area]` -> pagina che elenca i professionisti che trattano quel problema specifico.
Ogni professionista (dato inserito direttamente nel DB) è associato a una o più sotto-aree (le sue specializzazioni) e a un flag `is_founder` (booleano, impostato a mano rispettando il cap di 20).

### 2.2 Homepage

```
HEADER
  Logo | Nome piattaforma
  Nav: "Chi Siamo" - "Sei un professionista?" - "Contatti"

HERO / RICERCA
  H1: "Che problema vuoi risolvere oggi?"
  [ barra di ricerca ] -> autocomplete che filtra le SOTTO-AREE
    già dal 1° carattere digitato (nessun debounce/minimo caratteri,
    dataset piccolo e precaricato)
    click su un match -> naviga a /area/[slug]

GRIGLIA MACRO-AREE (card)
  Per ogni macro-area: immagine + titolo + breve descrizione
  Card cliccabile -> /area/[slug-macro]

SEZIONE FIDUCIA / CHI SIAMO (teaser)
  H2 posizionamento + paragrafo breve + immagini editoriali
  Link "Scopri di più" -> /chi-siamo (pagina completa, vedi 2.5)

FOOTER
  Logo, nome sito, social (Instagram, Facebook, X)
  Link legali: Privacy Policy (/privacy-policy) - Condizioni di utilizzo (/termini-di-utilizzo)
```

Comportamento ricerca (autocomplete): non è una ricerca free-text, ma un filtro su una lista chiusa di sotto-aree. Il filtro si attiva già al primo carattere digitato (nessun minimo di caratteri, nessun debounce necessario), perché il dataset è piccolo (poche decine di sotto-aree). In Nuxt: le sotto-aree vengono precaricate lato client all'ingresso in home (fetch dell'elenco completo), il filtro è puro client-side su quell'array; la pagina di destinazione `/area/[slug]` resta invece SSR/indicizzabile.

### 2.3 Flusso completo

```
1. INGRESSO
   - Ricerca organica (Google) su un problema specifico -> atterra direttamente su /area/[slug] (SEO)
   - Homepage diretta (digitazione URL, social, referral)
   - Link social/ads -> homepage o /area/[slug]

2. HOMEPAGE -> SCOPERTA
   - Ricerca per problema: digita anche solo 1 carattere -> autocomplete filtra le
     sotto-aree esistenti -> click su un match -> /area/[slug]
   - Esplorazione per macro-area (card) -> /area/[slug-macro]

3. PAGINA AREA (/area/[slug]) - SSR, indicizzabile, meta/H1 dedicati
   Struttura della pagina:
   a) Titolo = "Trova il professionista giusto per: [nome sotto-area]" (es. "Trova il professionista giusto per: Sindrome premestruale intensa")
   b) Griglia professionisti filtrata su quella sotto-area
      Card: foto, nome, specializzazioni (sotto-aree associate, mostrate come CHIP cliccabili
        -> click su un chip naviga a /area/[slug-sotto-area] di quella specializzazione), badge "Founder"
      Ordinamento: Founder sempre primi (max 20 totali), poi per rilevanza (es. data inserimento)
   - (facoltativo v1) filtro per località

4. PROFILO PROFESSIONISTA (/professionisti/[slug]) - SSR, indicizzabile
   - Dati pubblici: foto, bio, badge Founder se presente
   - Specializzazioni: tutte le sotto-aree associate al professionista, mostrate come CHIP
     cliccabili -> click su un chip naviga a /area/[slug-sotto-area]
   - CONTATTI DIRETTI in evidenza: telefono (tel:), email (mailto:), sito esterno, social
     NESSUN form di contatto in-app, NESSUN gate di registrazione
   - Dati strutturati schema.org (Person/ProfessionalService) per SEO

5. USCITA DALLA PIATTAFORMA
   Diana contatta il professionista autonomamente, fuori dal sito.
   Fine del flusso: nessun tracciamento della richiesta, nessuna dashboard Diana, nessuna recensione (fuori scope MVP, vedi A5).
```

Note SEO/accessibilità specifiche per il flusso Diana:
- Homepage, pagine `/area/[slug]` e pagine profilo devono essere SSR pure per indicizzazione.
- URL semantici: `/area/[slug-sotto-area]` e `/professionisti/[slug]`.
- Meta tag dinamici, sitemap.xml generata, dati strutturati JSON-LD (Organization, ProfessionalService/Person).
- Form di ricerca (autocomplete) navigabile da tastiera: pattern combobox accessibile, label esplicite, focus visibile, target touch >= 44px.
- Link di contatto (tel:/mailto:) devono essere veri link cliccabili anche da mobile, non solo testo.

### 2.5 Pagine istituzionali

Pagine statiche SSR, contenuto gestito via DB/CMS semplice (stesso principio di A2: nessuna UI di gestione, contenuto inserito direttamente).

**`/chi-siamo`**
- Presentazione personale della fondatrice della piattaforma (bio, foto, motivazione/mission del progetto)
- Sezione dedicata ai Founder: presentazione dei professionisti Founder (eventualmente con foto e breve bio, oltre a quanto già visibile nel loro profilo)
- Obiettivo: costruire fiducia e raccontare il posizionamento del progetto (coerente con la sezione teaser già presente in homepage)

**`/sei-un-professionista`**
- Pagina rivolta a professioniste interessate a essere presenti sulla piattaforma
- Testo di presentazione + modalità di contatto per proporsi (es. email diretta, mailto:, o form di contatto semplice che invia una notifica via email — nessun self-service, nessuna registrazione: è solo un punto di contatto)
- In v2 questa pagina sarà sostituita/affiancata dal flusso self-service completo (Appendice B)

**`/privacy-policy`** e **`/termini-di-utilizzo`**
- Pagine legali obbligatorie, linkate dal footer su ogni pagina del sito
- Contenuto testuale semplice (SSR, indicizzabile ma con eventuale `noindex` se si preferisce non farle emergere in ricerca — da valutare)

---

## 3. Regole di business MVP (ranking e Founder)

1. Ranking di ricerca: Founder sempre in cima (fino a 20), ordinati tra loro per un criterio secondario (es. data inserimento); a seguire i professionisti standard ordinati per rilevanza (es. data inserimento, completezza profilo).
2. Cap Founder = 20: enforcement manuale in fase di inserimento dati nel DB (nessuna UI di validazione automatica in MVP, va rispettato "a mano" da chi inserisce i dati).
3. Stato profilo professionista: gestito come colonna nel DB (es. `pubblicato: true/false`), non da un workflow applicativo.

---

## 4. Task di implementazione (MVP - solo flusso Diana)

### Epic 0 - Setup progetto e fondamenta tecniche
- [ ] Init progetto Nuxt 4 (SSR mode, non SPA/static)
- [ ] Configurazione TypeScript, ESLint, Prettier, Stylelint
- [x] Wireframe mobile-first (homepage, pagina area, profilo professionista, chi siamo, sei un professionista) — realizzati con supporto AI direttamente in questa chat (Visualizer), prima di passare a sviluppo/design definitivo
- [x] Scelta palette colori (brand identity: colori primari/secondari, stati, contrasti verificati AA) — prerequisito del design system — vedi §0.1
- [ ] Design system base mobile-first (breakpoint, spacing, tipografia) - componenti Vue riutilizzabili
- [ ] Setup libreria/pattern accessibilità (focus management, aria-live, skip-link)
- [ ] Setup SEO: useHead/useSeoMeta, sitemap module, robots.txt, Open Graph di default
- [ ] Setup dati strutturati JSON-LD (Organization, ProfessionalService, Person)
- [ ] Configurazione lang="it" corretto (i18n non necessario in MVP)
- [ ] CI/CD, ambienti (dev/staging/prod), Lighthouse CI come gate

### Epic 1 - Modello dati e popolamento contenuti (nessuna UI, nessun login)
Necessario perché in MVP non c'è self-service né backoffice: i dati vanno modellati e inseriti direttamente nel database.
- [x] Definire la tassonomia definitiva delle aree: elenco reale di macro-aree e sotto-aree (lavoro di contenuto, propedeutico allo sviluppo frontend di Epic 3) — vedi §1.1 e `areas.json`
- [ ] Schema DB: entità Area (gerarchica, macro/sotto-area), con campo `codice` (identificativo stabile) e `parole_chiave: string[]` (sinonimi per la ricerca) — vedi §1.1
- [ ] Schema DB: entità Professionista (dati pubblici, foto, bio, contatti, flag `is_founder`, stato pubblicato)
- [ ] Relazione molti-a-molti Professionista ↔ Sotto-area (specializzazioni)
- [ ] Script di seed/migrazione per popolare aree e professionisti (o inserimento diretto via client DB/GUI tipo tool amministrativo del DB, non applicativo)
- [ ] Documentazione interna: come/dove inserire un nuovo professionista o una nuova area (procedura per chi non è developer, se necessario)

### Epic 2 - Homepage e ricerca
- [ ] Homepage SSR: hero con H1 "Che problema vuoi risolvere oggi?", barra ricerca
- [ ] Autocomplete client-side su sotto-aree precaricate, filtro attivo dal 1° carattere (no free-text, no debounce), navigazione a /area/[slug]
- [ ] Griglia macro-aree (card) -> link a /area/[slug-macro]
- [ ] Sezione "chi siamo"/trust-building
- [ ] Header e footer come componenti condivisi

### Epic 3 - Pagina Area (/area/[slug]) e lista professionisti
- [ ] Pagina SSR indicizzabile con meta/H1 dinamici, titolo "Trova il professionista giusto per: [nome sotto-area]"
- [ ] Componente lista/card professionisti con badge Founder
- [ ] Chip cliccabili per le sotto-aree associate a ciascun professionista in card (navigano a /area/[slug])
- [ ] Ordinamento: Founder primi, poi rilevanza/rating (logica backend)
- [ ] Gestione stato vuoto ("nessun professionista disponibile")

### Epic 4 - Profilo professionista e contatti
- [ ] Pagina profilo pubblico SSR (/professionisti/[slug])
- [ ] Dati strutturati schema.org sul profilo
- [ ] Chip cliccabili per tutte le sotto-aree/specializzazioni del professionista (navigano a /area/[slug]) — componente Chip condiviso con Epic 3
- [ ] Contatti diretti evidenti e cliccabili (tel:, mailto:, link esterni), nessun form in-app
- [ ] Badge Founder visibile su card e profilo

### Epic 5 - Pagine istituzionali e legali
- [ ] Pagina `/chi-siamo`: presentazione fondatrice + sezione Founder
- [ ] Pagina `/sei-un-professionista`: testo di presentazione + punto di contatto (mailto: o form semplice con notifica email), nessuna registrazione
- [ ] Pagina `/privacy-policy` (contenuto testuale fornito dal team/legale)
- [ ] Pagina `/termini-di-utilizzo` (contenuto testuale fornito dal team/legale)
- [ ] Link a tutte queste pagine in header (Chi Siamo, Sei un professionista, Contatti) e footer (Privacy Policy, Termini di utilizzo)

### Epic 6 - SEO
- [ ] Sitemap dinamica (aree + profili pubblicati + pagine istituzionali: Chi Siamo, Sei un professionista)
- [ ] Canonical URL corretti su tutte le pagine; valutare `noindex` per Privacy Policy/Termini di utilizzo
- [ ] Performance SSR (caching pagine pubbliche, route rules Nuxt dove opportuno)
- [ ] Ottimizzazione immagini (formati moderni, lazy loading, dimensioni responsive)

### Epic 7 - Accessibilità
- [ ] Audit WCAG 2.1 AA su homepage, pagina area, profilo, pagine istituzionali
- [ ] Chip sotto-aree implementate come veri link (`<a>`/`<NuxtLink>`, non `<div>` con onClick), con target touch >= 44px e focus visibile
- [ ] Pattern combobox accessibile per l'autocomplete di ricerca (filtro dal 1° carattere, risultati annunciati via aria-live)
- [ ] Test con strumenti automatici (axe, Lighthouse) integrati in CI

### Epic 8 - QA e lancio
- [ ] Test end-to-end sul flusso Diana completo (ricerca -> area -> profilo -> contatto)
- [ ] Test cross-device mobile-first
- [ ] Popolamento iniziale dati: 20 profili Founder + selezione standard, per ogni macro-area
- [ ] Verifica SEO pre-lancio (sitemap, meta, dati strutturati validati con tool esterni)

---

## Appendice B - Fuori scope MVP: flusso Professionista self-service (riferimento v2)

Non implementare in questa fase. Conservato come riferimento per quando si deciderà di aprire l'iscrizione self-service a Elodie (Founder) e Anna (standard).

```
1. INGRESSO
   - Landing "Diventa professionista"
   - Landing dedicata "Diventa Founder" (se posti disponibili, altrimenti waitlist)

2. REGISTRAZIONE
   - Form email/password (o social login), verifica email

3. ONBOARDING / COMPILAZIONE PROFILO (comune)
   - Dati anagrafici e professionali, credenziali, aree servite, disponibilità
   - Salvataggio come bozza

4. STEP PAGAMENTO - SOLO SE FOUNDER
   - Riepilogo quota + benefit, checkout (Stripe o simile)
   - Gestione esiti pagamento, retry
   - Se i 20 posti si esauriscono durante il flusso -> downgrade a standard o waitlist

5. VERIFICA / APPROVAZIONE (admin-side)
   - Stato "in revisione" -> approvato/rifiutato, notifica esito

6. PUBBLICAZIONE
   - Founder -> pool prioritario (max 20); Standard -> pool ordinato per rilevanza

7. DASHBOARD PROFESSIONISTA (comune)
   - Richieste ricevute (se in v2 si introduce contatto in-app)
   - Gestione profilo, disponibilità
   - (Solo Founder) stato quota/rinnovo
```

Note da tenere a mente per la v2:
- Serve un lock/transazione atomica sul cap 20 per evitare race condition su iscrizioni simultanee.
- Da definire: cosa succede allo slot di un Founder che lascia la piattaforma o non rinnova.
- Da definire: se introdurre anche per Diana un account e un contatto in-app tracciato, o mantenere il modello "directory con uscita verso contatti diretti" anche in v2.
- Da definire: se/quando introdurre le recensioni (guest-moderate o legate ad account), fuori scope in MVP (A5).

---

## 5. Prossimi passi consigliati

1. ~~Validare le assunzioni in §0~~ — **fatto**.
2. ~~Definire lo schema DB dettagliato~~ — **non serve farlo preventivamente**: è un task tecnico (Epic 1) che si affronta direttamente in fase di sviluppo, non un prerequisito separato di pianificazione.
3. Wireframe mobile-first di homepage, pagina area, profilo professionista — vedi sotto per gli strumenti consigliati.
4. Popolare la tassonomia aree (macro/sotto-aree) definitiva — **spostato come task esplicito in Epic 1** (vedi sopra).

### Strumenti per wireframe con supporto AI

Alcune opzioni valide, in base a quanto vuoi restare "dentro" a un flusso conversazionale vs. usare un tool di design dedicato:

- **Qui stesso, con il tool Visualizer di questo chat**: posso generare wireframe/mockup interattivi (HTML/SVG) di homepage, pagina area e profilo direttamente in conversazione, mobile-first, senza uscire da qui. È il modo più rapido per iterare velocemente su layout e gerarchia visiva prima di passare a un tool di design vero. Se vuoi possiamo iniziare subito con la homepage.
- **v0.dev (Vercel)**: genera UI (anche componenti React/Vue-like) da prompt testuali, esporta codice; buono se poi vuoi codice riutilizzabile come punto di partenza per Nuxt, meno per wireframe "bassa fedeltà" veloci.
- **Figma + Figma AI ("First Draft")**: se il team ha già familiarità con Figma, la AI di Figma genera layout di partenza da prompt che poi si rifiniscono a mano; migliore per collaborazione con designer e handoff a sviluppo.
- **Uizard**: pensato apposta per wireframe/mockup rapidi da prompt testuali o da sketch disegnati a mano, buon compromesso tra velocità e output professionale, ha piani gratuiti.

Per un MVP con poche pagine (homepage, area, profilo, chi siamo, sei un professionista, 2 pagine legali) il Visualizer qui in chat è probabilmente sufficiente per validare la struttura, salvo poi rifinire in Figma se serve materiale da condividere con altri o per un design system più strutturato.
