---
name: analizza-storia
description: Analizza una storia Jira e prepara tutto il necessario prima di scrivere una riga di codice — verifica completezza, chiarisce ambiguità con l'utente, propone e scrive su Jira i criteri di accettazione, propone e commenta su Jira il piano di implementazione. Si ferma prima di toccare git o codice. Usa questa skill quando l'utente dice "analizza la storia X", "prepara la storia X", "esegui la storia X" (come primo passo), o menziona una chiave Jira (es. SCRUM-2) chiedendo di iniziare a lavorarci. Complementare a `sviluppa-storia`, che parte da dove questa finisce.
---

# Analizza storia

Prima metà del workflow "storia Jira -> codice" di questo repo. Prepara scope, criteri di accettazione e piano — tutti approvati esplicitamente dall'utente e scritti su Jira — prima che `sviluppa-storia` tocchi git o codice. I gate di approvazione esistono perché scrivere su Jira prima che l'utente abbia validato scope e approccio crea rilavorazione e rumore nella issue tracker.

Segui le fasi in ordine. Non saltarne una per "risparmiare tempo": ogni fase produce l'input di quella dopo.

## Fase 0 — Setup

1. Estrai la chiave della issue dalla richiesta dell'utente (es. `SCRUM-2`). Se l'utente descrive la storia solo a parole senza chiave, cercala con `mcp__jira__searchJiraIssuesUsingJql` o chiedi la chiave esatta.
2. Ottieni il `cloudId` Atlassian con `mcp__jira__getAccessibleAtlassianResources` (riusalo per tutte le chiamate successive nella stessa sessione).
3. Leggi la issue per intero con `mcp__jira__getJiraIssue` (`fields: ["*all"]`, includi i commenti). Leggi anche:
   - la issue padre (epic), se presente
   - le issue collegate (`issuelinks`), specialmente quelle "is blocked by" — il loro stato incide sulla fattibilità del lavoro ora
4. Se la issue o l'epic citano un documento di riferimento (es. un `.md` nel repo, un link Confluence, un file di design), cercalo nel repo (`grep`/`find` su tutti i branch, non solo quello corrente) e, se non trovato, prova `mcp__jira__searchConfluenceUsingCql`. Se manca del tutto, è un gap da segnalare in Fase 1, non un blocco silenzioso.

## Fase 1 — Analisi e gap-finding

Con la issue e i documenti raccolti, valuta se hai davvero tutto il necessario per procedere:

- Lo scope del task è inequivocabile? (confrontalo con l'epic e con eventuali issue "sorelle" per evitare di anticipare lavoro fuori scope)
- Ci sono decisioni tecniche non specificate che cambierebbero l'implementazione (es. package manager, struttura cartelle, convenzioni di naming, branch di base)?
- Ci sono decisioni tecniche specificate nella issue che potrebbero essere obsolete rispetto allo stato attuale del tooling/ecosistema (es. una versione di libreria esplicitamente richiesta che nel frattempo è stata superata)? Se sì, non decidere in autonomia: segnalalo.
- Le issue bloccanti sono risolte? Se non lo sono, valuta se è comunque sensato procedere o se va segnalato.
- Il documento di riferimento (se esiste) è coerente con lo stato attuale del repo, o è cambiato qualcosa nel frattempo?

Se emergono ambiguità o mancanze, fermati e usa `AskUserQuestion` (o domande dirette se non si adattano al formato a scelta multipla). Non proseguire alla Fase 2 finché non sono risolte. Se non ci sono ambiguità, dichiaralo esplicitamente all'utente in una riga prima di continuare — non lasciarlo implicito.

## Fase 2 — Criteri di accettazione

Scrivi una checklist di criteri di accettazione chiari e verificabili (non vaghi: ognuno deve poter essere marcato vero/falso osservando il comportamento del sistema, non l'intenzione). Presentala in chat come testo, non ancora su Jira. Itera con l'utente finché non approva esplicitamente ("ok", "va bene", "approvato" o equivalente) — un silenzio o una richiesta di modifica non contano come approvazione.

## Fase 3 — Scrittura dei criteri su Jira

Solo dopo l'approvazione esplicita:

1. Verifica se il progetto ha un campo dedicato "Acceptance Criteria" con `mcp__jira__getJiraIssueTypeMetaWithFields` (progetto/tipo della issue). Se esiste, usalo.
2. Se non esiste (come nel progetto SCRUM di questo repo), aggiungi i criteri in coda alla Description esistente, sotto un heading `## Criteri di accettazione`, senza cancellare il contenuto originale — usa `mcp__jira__editJiraIssue` con il testo completo (originale + sezione nuova). Passa `contentFormat: "markdown"` e usa newline reali nel testo (non la sequenza letterale `\n`), altrimenti Jira salva i backslash come testo invece di andare a capo.

## Fase 4 — Piano di implementazione

Scrivi un piano tecnico che applichi **clean code, KISS e DRY**: preferisci la soluzione più semplice che soddisfa i criteri di accettazione, riusa pattern/utility già presenti nel repo invece di reinventarli, evita astrazioni premature. Il piano deve includere:

- file/moduli coinvolti e perché
- sequenza dei passi, con dipendenze esplicite tra loro
- quali sotto-task sono **indipendenti tra loro** (candidati alla parallelizzazione in `sviluppa-storia` con più `Agent` lanciati nello stesso messaggio) e quali sono invece sequenziali per via di una dipendenza reale (es. lo schema dati va creato prima dei componenti che lo consumano) — se il task è troppo piccolo per avere workstream indipendenti, dillo esplicitamente invece di forzare una parallelizzazione finta
- come verificare il risultato end-to-end (non solo type-check/test, ma l'uso reale della feature se applicabile)

Presenta il piano in chat e itera finché l'utente non lo approva esplicitamente, esattamente come in Fase 2.

## Fase 5 — Commento su Jira

Dopo l'approvazione, pubblica il piano approvato come commento sulla issue con `mcp__jira__addCommentToJiraIssue` (stesso avvertimento sui newline della Fase 3). Questo lascia traccia storica di cosa è stato deciso e quando, separata dalla Description (che resta la fonte di verità per scope e criteri di accettazione).

## Dopo questa skill

A questo punto scope, criteri di accettazione e piano sono su Jira e approvati. Se l'utente vuole procedere subito allo sviluppo, invoca la skill `sviluppa-storia` sulla stessa chiave issue — non ripetere qui il lavoro di analisi, `sviluppa-storia` lo legge da Jira.
