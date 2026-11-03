/*
inizio:primo giorno valido, formato "2026-11-01"
scadenza:ultimo giorno valido, formato "2026-11-30"
prezzi:un elenco con il nome del trattamento scritto identico al listino. formato: "Manicure": { prima: 15, ora: 12 },
Se lo stesso nome compare in piu' sezioni (es. "Pacchetto 5 sedute") scrivi prima la sezione: "Pressoterapia > Pacchetto 5 sedute"
etichetta (facoltativa): come compare il nome nel riquadro della home
*/
window.OFFERTA = {
 attiva: true,
 titolo: "Offerta pressoterapia",
 testo: "Pacchetti di pressoterapia a prezzo speciale. Scrivimi su WhatsApp per prenotare il tuo appuntamento.",
 inizio: "",
 scadenza: "",
 prezzi: {
 "Pressoterapia > Pacchetto 5 sedute": { prima: 200, ora: 100, etichetta: "Pressoterapia, 5 sedute" },
 "Pressoterapia > Pacchetto 10 sedute": { prima: 350, ora: 200, etichetta: "Pressoterapia, 10 sedute" },
 "Pressoterapia con bendaggio a freddo > Pacchetto 5 sedute": { prima: 300, ora: 200, etichetta: "Pressoterapia con bendaggio, 5 sedute" },
 "Pressoterapia con bendaggio a freddo > Pacchetto 10 sedute": { prima: 475, ora: 300, etichetta: "Pressoterapia con bendaggio, 10 sedute" }
 }
};
