---
name: sviluppa-storia
description: Sviluppa una storia Jira il cui scope, criteri di accettazione e piano di implementazione sono già stati approvati e scritti su Jira (di norma via la skill `analizza-storia`). Porta la issue a "In Progress", crea il branch feature da develop, esegue il piano (parallelizzando con più Agent dove il piano lo consente, seguendo clean code/KISS/DRY), poi committa, pusha, apre la pull request e porta la issue a "REVIEW". Usa questa skill quando l'utente dice "sviluppa la storia X", "implementa la storia X", "inizia lo sviluppo di X", o conferma di voler procedere dopo l'analisi. Se la issue non ha ancora criteri di accettazione/piano approvati su Jira, invoca prima `analizza-storia`.
---

# Sviluppa storia

Seconda metà del workflow "storia Jira -> codice" di questo repo. Presuppone che scope, criteri di accettazione e piano siano già su Jira (Description per i criteri, ultimo commento per il piano) — se non lo sono, fermati e invoca prima `analizza-storia` sulla stessa chiave issue invece di improvvisare un piano qui.

**Nota su esecuzione parallela su più storie**: questa skill crea branch, scrive file e fa commit — se l'utente vuole sviluppare più storie insieme, ogni esecuzione deve girare in un git worktree separato (`isolation: "worktree"` sull'Agent che la esegue), mai nella stessa working directory condivisa: due checkout/commit concorrenti sullo stesso albero di lavoro si sovrascrivono a vicenda. Inoltre un subagent non ha `AskUserQuestion`: se durante l'esecuzione (Fase 3, punto 5) serve una decisione dell'utente, il subagent deve fermarsi e riportarla nel suo risultato finale invece di provare a bloccarsi in attesa di una risposta — sarà l'agente principale a inoltrarla all'utente e a far ripartire il subagent con la risposta.

## Fase 0 — Setup

1. Ottieni il `cloudId` Atlassian (`mcp__jira__getAccessibleAtlassianResources`) e rileggi la issue con `mcp__jira__getJiraIssue` (`fields: ["*all"]`, includi i commenti) per recuperare i criteri di accettazione (Description) e il piano approvato (ultimo commento pertinente). Se mancano entrambi, fermati e chiedi all'utente se vuole che tu esegua prima `analizza-storia`.

## Fase 1 — Stato "In Progress"

Prima di iniziare a scrivere codice (non prima — la issue deve riflettere lo stato reale del lavoro):

1. `mcp__jira__getTransitionsForJiraIssue` per trovare l'id della transizione verso lo stato "In Progress" (il nome esatto può variare da progetto a progetto).
2. `mcp__jira__transitionJiraIssue` con quell'id.

Se non esiste una transizione ovvia verso uno stato "in corso", chiedi all'utente prima di indovinare.

## Fase 2 — Branch

1. Esegui `git status`: se ci sono modifiche non salvate rilevanti, non procedere con checkout distruttivi — metti in stash (`-u` se serve) o chiedi all'utente.
2. Aggiorna `develop` (`git fetch origin develop`) — i branch feature di questo repo partono sempre da `develop`, non dal branch corrente né da `main`.
3. Crea il branch `feature/<ID-STORIA>_<breve-slug-kebab>` a partire da `develop` aggiornato (es. `feature/SCRUM-2_init-nuxt3-ssr`). Lo slug è un riassunto breve in kebab-case del titolo della storia, in inglese salvo che il repo usi già una convenzione diversa.

## Fase 3 — Esecuzione

1. Traccia i sotto-task del piano approvato con `TaskCreate`/`TaskUpdate`, aggiornando lo stato man mano (non in batch a fine lavoro).
2. Per i workstream indipendenti individuati nel piano, lancia più `Agent` **nello stesso messaggio** (chiamate parallele) invece che in sequenza. Per le parti con dipendenze reali, esegui in sequenza.
3. Scrivi codice seguendo **clean code, KISS, DRY** e le convenzioni già presenti nel repo (struttura cartelle, stile, librerie già in uso) — non introdurre pattern nuovi se un pattern esistente risolve già il problema, non aggiungere astrazioni per requisiti ipotetici.
4. Verifica secondo quanto descritto nel piano prima di considerare il lavoro concluso: non solo type-check/build, ma l'uso reale della feature dove applicabile.
5. Se durante l'esecuzione scopri che il piano approvato non regge (assunzione sbagliata, requisito mancante), fermati e torna dall'utente invece di deviare in silenzio — un piano approvato non è una licenza a improvvisare cambi di scope.

## Fase 4 — Aggiornamento dei criteri di accettazione su Jira

Prima di committare, rileggi la lista dei criteri di accettazione nella Description della issue e aggiorna lo stato delle checkbox (`editJiraIssue`, preservando tutto il resto del testo):

- Marca `[x]` i criteri che hai effettivamente verificato tu (comando eseguito, output controllato, non solo "dovrebbe funzionare")
- Lascia `[ ]` quelli che richiedono un test manuale dell'utente (compreso il criterio di test manuale previsto da `analizza-storia`) o che non sei riuscito a verificare

Questo serve a far sapere all'utente, senza dover rileggere la conversazione, esattamente cosa è stato controllato e cosa resta da controllare a lui.

## Fase 5 — Commit, push e pull request

1. Rivedi cosa stai per aggiungere (`git status`/`git diff`) prima di uno stage ampio — non includere file estranei allo scope della storia (es. configurazioni personali dell'IDE, segreti). Se nella working tree ci sono anche modifiche non legate a questa storia, valuta commit separati invece di un unico commit indistinto.
2. Committa seguendo le convenzioni git già in uso in questo repo (messaggi che spiegano il "perché", non solo il "cosa"; nuovi commit invece di amend; nessun `--no-verify`). Menziona la chiave della storia nel messaggio.
3. Push del branch su `origin` (`git push -u origin <branch>` se non ha già un upstream).
4. Apri la pull request verso `develop` (non `main`): usa `mcp__github__create_pull_request` se disponibile, altrimenti `gh pr create` da bash. Titolo breve con la chiave storia, corpo con riepilogo delle modifiche, riferimento ai criteri di accettazione soddisfatti e un test plan. Cerca prima un template di PR nel repo (`pull_request_template.md` o `.github/PULL_REQUEST_TEMPLATE/`) e usalo se esiste.
5. Se questa esecuzione gira in un git worktree isolato (es. sotto `.claude/worktrees/`, o comunque un path diverso dalla working directory principale del repo — tipico quando questa skill e' eseguita da un subagent con `isolation: "worktree"`), rimuovilo ora con `git worktree remove --force <path-del-worktree>`: a questo punto branch e commit sono gia' al sicuro su origin (pushati al passo 3), il checkout locale isolato non serve piu' e va tolto per non lasciare cartelle orfane. Se invece stai lavorando nella working directory principale del repo (nessun isolamento), salta questo passo.
6. Riporta all'utente il link alla PR.

## Fase 6 — Stato "REVIEW"

Dopo l'apertura della PR, porta la issue Jira allo stato "REVIEW" (`mcp__jira__getTransitionsForJiraIssue` per trovare l'id, poi `mcp__jira__transitionJiraIssue`). Questo segnala che il codice è pronto per essere revisionato, non solo che è "in corso".

## Cosa NON fa questa skill

Non fa merge della pull request, non porta la issue a "Done": quelle sono decisioni dell'utente o di chi revisiona il codice, non automatizzabili da qui.
