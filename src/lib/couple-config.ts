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

  // BROUILLON, pas la version finale — écrit à ta demande explicite pour débloquer
  // la page blanche. Les faits (2022, le 8 juin 2026, le site) sont ceux que tu m'as
  // donnés ; le reste est générique. Remplace les passages vagues par du concret :
  // un souvenir précis, une blague entre vous, un détail qu'elle seule reconnaîtra.
  // C'est ce qui transforme un brouillon en vraie lettre.
  letterBody:
    "Fatima,\n\n" +
    "Je ne sais pas par où commencer, alors je vais juste commencer.\n\n" +
    "Depuis 2022, tu es devenue quelque chose que je n'avais pas prévu dans ma vie — " +
    "une évidence. Pas parce que tout a été simple. On a eu nos moments difficiles, " +
    "on s'est perdus un temps. Mais le 8 juin 2026, on a choisi de se redonner une " +
    "chance, et ce jour-là compte autant que le premier.\n\n" +
    "J'ai construit ce site en pensant à toi à chaque ligne. Pas pour te prouver " +
    "quelque chose, mais parce que je voulais que tu aies un endroit rien qu'à " +
    "nous — pas sur Instagram, pas sur WhatsApp, un endroit privé où notre histoire " +
    "existe, se raconte, et continue de grandir.\n\n" +
    "Il y a des choses que je ne te dis pas assez. Que je suis fier de nous, de la " +
    "façon dont on s'est relevés ensemble. Que tu me fais rire même quand je n'en " +
    "ai pas envie. Que je pense à toi à des moments random de la journée, sans " +
    "raison particulière, juste parce que tu es là, dans ma tête, tout le temps.\n\n" +
    "Je ne sais pas ce que l'avenir nous réserve exactement. Mais je sais que je " +
    "veux le découvrir avec toi.",

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
