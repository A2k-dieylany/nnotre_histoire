// Source unique de vérité pour les données personnelles du couple.
// Réutilisé par le compteur, la timeline, les messages de salutation.

export const coupleConfig = {
  partnerFirstName: "Fatima",

  // Hypothèse déduite du contexte (fondateur SDS) — corrige si ce n'est pas ton prénom.
  authorFirstName: "Dieylany",

  // PLACEHOLDER — année confirmée (2022), jour/mois à corriger dès que tu les as.
  // Format : YYYY-MM-DD, heure locale (minuit) par défaut si l'heure exacte est inconnue.
  startDate: "2022-01-01",

  // Confirmé : le jour où vous avez décidé de vous redonner une chance.
  // N'alimente PAS le compteur — c'est une entrée de la timeline, pas le point zéro.
  restartDate: "2026-06-08",

  // Pas encore de fichier : dépose-le dans /public/audio/notre-chanson.mp3 puis
  // remplace null par "/audio/notre-chanson.mp3". Sans fichier, la séquence
  // d'entrée fonctionne quand même, juste sans musique.
  songUrl: null as string | null,

  // PLACEHOLDER — c'est ton texte, pas le mien : j'écrirais un mensonge en
  // inventant ce que tu ressens. Remplace tout le paragraphe ci-dessous.
  letterBody:
    "[Écris ici ta lettre. Efface ce texte et remplace-le par tes mots — " +
    "les sauts de ligne (une ligne vide entre deux paragraphes) sont conservés à l'affichage.]",

  // Tirée de ton propre brief (fonctionnalites.md, 2C.4) — change-la si tu veux autre chose.
  letterClosing: "Et le plus beau… c'est que cette histoire continue.",

  // Pas encore de signature scannée : une signature texte (police manuscrite) sert de repli.
  // Dépose une image dans /public/signature.png puis remplace null par "/signature.png".
  signatureImageUrl: null as string | null,

  // Easter egg EE.1 : elle tape votre date de rencontre (chiffres uniquement,
  // n'importe où sur le site) → ce message apparaît. Code déduit de `startDate`
  // (format JJMMAAAA) — se met à jour tout seul si tu corriges la date.
  secretCodeMessage: "[Écris ici le message qui apparaît quand elle trouve le code secret.]",

  // Easter egg EE.4 : message affiché si elle visite le site entre minuit et 1h.
  midnightMessage: "Tu ne dors pas ? Moi non plus. Je pense à toi.",
} as const;
