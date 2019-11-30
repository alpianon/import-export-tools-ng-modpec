# ImportExportTools NG modPEC

## Note for non-Italian users This is a MOD of a well-known Thunderbird

Addon (ImportExportTools NG - for more details see `README_orig.md`),
specifically intended to add functionalities to backup [Italian
certified email messages](https://en.wikipedia.org/wiki/Certified_email)
and preserve their legal value as digitally signed documents.

If you are not using Italian Certified Email ("PEC") nor you need to
create a hash list of your messages saved in EML format, you probably do
not need this MOD at all.

For the above reason, the remainder of this README file is in Italian
language, and the active localizations are only Italian and English-US.

## Nota importante

Questo MOD è un fork del nuovo addon "ImportExportTools NG", compatibile
con le versioni di Thunderbird successive alla 60.

Il MOD del vecchio addon, compatibile con le precedenti versioni di
Thunderbird, è disponibile
[qui](https://github.com/alpianon/importexporttools-modpec).

## A cosa serve?  

Questo MOD aggiunge all'addon importexporttools delle funzionalità che
aiutano l'utente a fare il backup dei messaggi di PEC in modo da poterne
provare in futuro l'autenticità, nel rispetto della privacy e della
riservatezza della corrispondenza.  L'idea è nata da una conversazione
tra legali ([l'autore di questo MOD](http://pianon.eu/) e [Carlo
Piana](https://www.piana.eu/), che ha suggerito la procedura che viene
qui implementata) nella mailing list di [ARRAY](https://www.array.eu/)
in merito ai problemi pratici di conservazione delle PEC. Per
approfondire, leggete più avanti il paragrafo sugli aspetti legali.

**ATTENZIONE Questo MOD è ancora work-in-progress, non è ancora stato
testato in produzione in modo adeguato, ed è inteso unicamente come
applicazione da provare in ambienti di test e sviluppo. Si declina
qualsiasi responsabilità per qualsiasi uso in produzione e a fini
professionali.**

*Ferma l'esclusione di garanzia di cui sopra, si può verificare la
correttezza della generazione della lista di hash con lo script
`debug.sh` creato automaticamente dentro alla cartella di backup, come
spiegato meglio più avanti (vale solo per gli ambienti linux).*

## Installazione

Se avete ImportExportTools NG (versione originale) installato, è
opportuno disinstallarlo, prima di installare questo MOD.

Per installare ImportExportTools NG "moddato" è sufficiente scaricare,
dalla cartella "xpi", il file con estensione `.xpi` relativo all'ultima
versione disponibile, e poi installarlo dalla scheda "Gestione
componenti aggiuntivi" di Thunderbird, cliccando sull'icona delle
impostazioni (quella a forma di ruota dentata, per capirci), e
selezionando la voce "Installa componente aggiuntivo da file".

### NOTA IMPORTANTE PER GLI UTENTI LINUX

Come ulteriore funzionalità aggiunta, questo MOD consente di scegliere,
nelle opzioni di ImportExportTools, di **tagliare il nome dei file
esportati a 140 caratteri** invece che "solo" a 256 caratteri; questo
perchè, se nella generalità dei filesystem il limite è 256 caratteri,
quando si usa Ecryptfs (tipicamente, se si sceglie di avere la cartella
home cifrata in certe distribuzioni Linux) il limite è di fatto 140
caratteri, come spiegato meglio
[qui](https://unix.stackexchange.com/questions/32795/what-is-the-maximum-allowed-filename-and-folder-size-with-ecryptfs)).
Con questa opzione, è possibile salvare i messaggi da importexporttools
anche in una cartella cifrata con Ecryptfs senza incorrere nell'errore
`NS_ERROR_FILE_NAME_TOO_LONG` se l'oggetto dell'email (dal quale
importexporttools genera il nome del file) è troppo lungo.

## Come si usa?

Alle tradizionali opzioni di menu di importexporttools, questo MOD
aggiunge un'opzione per salvare i messaggi *"come file EML con hash list
e verifica SMIME (Backup PEC)"* (nella finestra "cerca ed esporta"
l'opzione è indicata come *"EML+hash list+verifica SMIME"* per motivi di
spazio ma la funzionalità è la stessa).

Selezionando tale opzione, verrà creata una cartella (con il nome della
cartella di Thunderbird e la data e ora di esportazione, se viene
esportata un'intera cartella; con il prefisso "Backup_PEC" e la data e
ora di esportazione, se vengono esportati solo i messaggi selezionati o
cercati).

All'interno di questa cartella, alla fine dell'esportazione, troverete
una sottocartella "messaggi" (contenente i messaggi di PEC esportati in
formato EML) e due file, `lista_hash.txt` e
`lista_hash_con_nomi_file.txt`: il contenuto del primo andrà inserito in
apposita dichiarazione da firmare digitalmente e marcare temporalmente,
il secondo andrà conservato insieme al backup come riferimento futuro
(vd. più avanti il paragrafo relativo agli aspetti legali).

  * **Importante**: Il contenuto del file `lista_hash_con_nomi_file.txt`
    è volutamente identico all'output di un comando `sha256sum * | sort`
    lanciato nella sottocartella `messaggi` dentro alla cartella di
    backup, in modo da consentire di fare una verifica incrociata sul
    corretto funzionamento dell'addon.
  * Questa verifica può essere effettuata in modo "automatico" facendo
    girare lo script debug.sh che viene generato dentro alla cartella
    di backup (`cd percorso/cartella/backup/; ./debug.sh`)

Durante l'esportazione dei messaggi di PEC, viene anche effettuata una
**verifica della firma digitale del provider di PEC (Aruba, Legalmail,
ecc.)** all'interno di ciascun messaggio: se la firma di alcuni messaggi
non è valida o è scaduta, alla fine dell'esportazione viene visualizzato
un messaggio di errore, con indicazione di guardare, per i dettagli, il
file `errori_verifica_PEC.txt` nella cartella di esportazione.

  * **Attenzione**: nel caso vengano rilevati degli errori su alcuni
    messaggi esportati, la lista degli hash viene comunque generata; ma
    l'operazione di firma digitale e marcatura temporale su tale lista
    non ha alcun valore/senso dal punto di vista legale, o meglio non ne
    ha relativamente ai messaggi sui quali sono stati rilevati degli
    errori (vd. sempre più avanti il paragrafo relativo agli aspetti
    legali).

## Aspetti legali relativi al backup dei messaggi di PEC

### Perché, nel caso dei messaggi di PEC, un backup "tradizionale" non basta?

La normativa sui documenti informatici prevede che un documento firmato
con un certificato scaduto non è un documento valido, equivale a un
documento non firmato. Nel momento in cui il certificato viene
utilizzato per la firma, il documento firmato è valido. Chiunque può
osservare, da quel momento in poi, che il documento è stato firmato con
un certificato valido, usando uno degli strumenti informatici (alcuni
anche _open source_) messi a disposizione per la verifica. Tuttavia i
certificati **scadono**. Pertanto, dal giorno in cui il certificato con
cui il documento è firmato scade, non è più possibile sapere con
certezza se al momento della firma il certificato fosse valido. Pertanto
viene a cessare la funzione di prova opponibile ai terzi
dell'autenticità. Per conservare tale efficacia probatoria, occorre uno
strumento che dia certezza temporale del fatto che a un dato momento,
antecedente alla scadenza del certificato, il documento fosse già stato
firmato.

Questo procedimento è appunto la conservazione. Tenere una o più copie
fisiche del file, infatti, non garantisce il **tempo** in cui la firma
contenuta nel file fosse stata apposta. Solo con un riferimento
riconosciuto dalla legge come opponibile ai terzi, ciò è possibile.
Apponendo la marca temporale, un terzo certifica che quel documento
esisteva già al momento di marcatura. Dunque fornisce la prova
necessaria a conservare la validità giuridica al documento informatico
così realizzato.

### La marca temporale su un archivio di messaggi di PEC: problemi di privacy

L'apposizione di una marca temporale a tutto l'archivio di messaggi PEC
porterebbe ‒ nel caso si dovesse provare la data di firma di un
determinato messaggio ‒ alla necessità di produrre l'intera porzione di
archivio. Non sarebbe infatti possibile validare la marca temporale
senza avere l'esatta sequenza di bit a cui è stata apposta.
L'alternativa sarebbe apporre la marcatura temporale a ogni singolo
messaggio, cosa che ha un costo elevato e una praticità molto scarsa.

Ulteriore alternativa è appunto usare un **elenco di hash**, in modo che
la marca temporale sia univocamente collegata a una serie di messaggi,
ma non sia necessario produrre tutti i messaggi, al fine di provare che
quel messaggio in quella esatta e inalterata sequenza di bit, è stato
creato prima della scadenza del relativo certificato.

D'altronde, ogni firma, inclusa la marca temporale, consiste nella
cifratura di un hash del documento (non del documento) con la chiave
privata. La firma di un documento contenente gli hash è
computazionalmente equivalente.

### Una soluzione per fare il backup dei messaggi di PEC nel rispetto della privacy

Nella soluzione qui proposta, usiamo due liste. La
`lista_hash_con_nomi_file` contiene l'elenco completo con i nomi di
file. La `lista_hash_noname.txt` è l'elenco delle stesse impronte hash
senza i nomi di file, che può essere così inserito in un documento senza
nemmeno rivelare l'esistenza di un determinato messaggio, visto che
anche il solo titolo del messaggio, pur accorciato, potrebbe rivelare
informazioni.

Qualora occorresse produrre in giudizio o in altra sede il messaggio
relativo, a certificato scaduto, sarebbe possibile creare un **pacchetto
di distribuzione** mediante l'inserimento in un contenitore (un file
zip, ad esempio) del messaggio originale e il documento con gli hash,
firmato e marcato temporalmente. Usando `lista_hash_con_nomi_file` come
tabella di corrispondenza è possibile risalire univocamente e
agevolmente da un file al documento contenente gli hash e viceversa. La
perdita del file `lista_hash_con_nomi_file` non sarebbe comunque grave,
potendolo in ogni momento ricostruire (non applicando un _salt_, ogni
documento ha uno e un solo hash SHA256).
