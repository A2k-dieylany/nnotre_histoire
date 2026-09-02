// Source unique de vérité pour les données personnelles du couple.
// Réutilisé par le compteur, la timeline, les messages de salutation.

export const coupleConfig = {
  partnerFirstName: "Fatima",

  // Ta signature, telle que tu l'as écrite au bas de la lettre.
  authorFirstName: "A2K",

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

  // Ta lettre, telle que tu l'as écrite. Le **gras** est rendu comme du vrai gras
  // à l'affichage (voir src/lib/parse-bold.ts + src/components/typewriter.tsx).
  letterBody:
    "**À toi, Fatima ❤️**\n\n" +
    "**Ma princessse**\n\n" +
    "Je ne sais toujours pas vraiment par où commencer cette lettre.\n\n" +
    "Alors je vais faire simple : je vais commencer par toi.\n\n" +
    "Depuis 2022, il y a ton nom quelque part dans mon histoire. Et avec le temps, " +
    "ce nom est devenu bien plus qu'un prénom. Il est devenu des souvenirs, des " +
    "habitudes, des sourires, des conversations interminables, des moments que je " +
    "n'oublierai jamais… et surtout, une personne qui a fini par prendre une place " +
    "que je n'avais jamais imaginé lui donner.\n\n" +
    "**Toi.**\n\n" +
    "Je ne vais pas faire semblant que notre histoire a toujours été parfaite. Elle " +
    "ne l'a jamais été. On a ri, on s'est aimés, on s'est compris… mais on s'est " +
    "aussi blessés, éloignés, et perdus pendant un moment.\n\n" +
    "Et peut-être que c'est justement pour ça que le **8 juin 2026** a autant de " +
    "valeur pour moi.\n\n" +
    "Parce que ce jour-là, ce n'était pas simplement un retour.\n\n" +
    "C'était deux personnes qui avaient déjà une histoire, qui connaissaient leurs " +
    "défauts, leurs blessures, leurs silences, et qui ont quand même décidé de se " +
    "retrouver.\n\n" +
    "De se redonner une chance.\n\n" +
    "Et personnellement, je crois que certaines histoires deviennent encore plus " +
    "belles après avoir traversé des tempêtes.\n\n" +
    "Alors oui, notre histoire a commencé en 2022.\n\n" +
    "Mais quelque part, j'ai l'impression qu'une nouvelle partie de notre histoire " +
    "a commencé le **8 juin 2026**.\n\n" +
    "Et c'est aussi pour ça que j'ai créé cet endroit.\n\n" +
    "**Notre Univers.**\n\n" +
    "Je voulais quelque chose qui nous appartienne vraiment.\n\n" +
    "Pas une conversation parmi des milliers sur WhatsApp.\n" +
    "Pas quelques photos perdues au milieu d'Instagram.\n" +
    "Pas des souvenirs qui disparaissent au fil du temps dans nos téléphones.\n\n" +
    "Je voulais un endroit où **nous** puissions exister.\n\n" +
    "Un endroit où nos souvenirs puissent rester.\n" +
    "Où nos petites histoires puissent être racontées.\n" +
    "Où nos journées puissent être partagées.\n" +
    "Où je puisse te laisser des lettres.\n" +
    "Où tu puisses me laisser les tiennes.\n" +
    "Où nos photos, nos musiques, nos jeux, nos projets et même nos rêves puissent " +
    "trouver leur place.\n\n" +
    "Un endroit qui grandira avec nous.\n\n" +
    "Et peut-être que dans quelques années, on reviendra ici, on regardera tout ce " +
    "qu'on aura écrit, toutes les photos qu'on aura ajoutées, toutes les petites " +
    "choses qu'on aura vécues… et on se dira :\n\n" +
    "**« Regarde tout ce qu'on a construit. »**\n\n" +
    "Il y a aussi tellement de choses que je ne te dis pas assez.\n\n" +
    "Je ne te dis pas toujours à quel point je suis fier de nous.\n\n" +
    "Je ne te dis pas toujours que parfois, au milieu d'une journée complètement " +
    "normale, je pense à toi sans aucune raison. Une chanson, une phrase, une " +
    "petite chose que je vois… et soudain, **c'est toi qui me viens à l'esprit.**\n\n" +
    "Je ne te dis pas assez que j'aime tes petites habitudes, tes petites réactions, " +
    "ta façon de parler, tes petites manies… même celles que je fais semblant de ne " +
    "pas aimer. 😂\n\n" +
    "Et surtout, je ne te dis peut-être pas assez que je suis heureux que ce soit " +
    "**toi**.\n\n" +
    "Toi, Fatima.\n\n" +
    "La fille qui m'appelle **« Bébé Yaayam »** et qui, sans forcément le savoir, a " +
    "rendu ce surnom beaucoup plus précieux qu'il ne devrait l'être. ❤️\n\n" +
    "Je ne sais pas exactement à quoi ressemblera notre avenir.\n\n" +
    "Je ne sais pas combien de souvenirs nous attendent encore, combien de voyages, " +
    "de projets, de disputes pour des choses insignifiantes, de fous rires, de " +
    "nuits à parler, de photos prises à la va-vite, de journées ordinaires qui " +
    "deviendront finalement des souvenirs importants.\n\n" +
    "Je ne sais pas.\n\n" +
    "Mais il y a une chose que je sais.\n\n" +
    "**J'ai envie de découvrir tout ça avec toi.**\n\n" +
    "Je ne veux pas seulement aimer les beaux moments avec toi.\n\n" +
    "Je veux aussi apprendre à traverser les moins beaux.\n\n" +
    "Je veux continuer à te connaître, même lorsque je penserai déjà tout savoir de " +
    "toi.\n\n" +
    "Je veux continuer à te choisir, même lorsque la routine s'installera.\n\n" +
    "Je veux continuer à construire avec toi, même lorsque nos rêves changeront.\n\n" +
    "Parce qu'au fond, je ne cherche pas une histoire parfaite.\n\n" +
    "**Je cherche notre histoire.**\n\n" +
    "Celle qui nous ressemble.\n\n" +
    "Celle qui a déjà connu des détours mais qui continue d'avancer.\n\n" +
    "Celle qui a commencé en 2022, qui s'est réécrite le 8 juin 2026…\n\n" +
    "**et dont je ne veux surtout pas écrire la fin maintenant.**\n\n" +
    "Alors bienvenue dans **Notre Univers**, ma princesse.\n\n" +
    "Tout ce que tu trouveras ici existe parce qu'à un moment ou à un autre, j'ai " +
    "pensé à toi.\n\n" +
    "Et le plus beau dans tout ça ?\n\n" +
    "**Cette lettre n'est que la première page.**\n\n" +
    "La suite, Fatima…\n\n" +
    "**on va l'écrire ensemble.** ❤️♾️",

  // Vide : la lettre se termine déjà par sa propre conclusion (voir ci-dessus) —
  // pas besoin d'une deuxième ligne de clôture séparée après.
  letterClosing: "",

  // Pas encore de signature scannée : une signature texte (police manuscrite) sert de repli.
  // Dépose une image dans /public/signature.png puis remplace null par "/signature.png".
  signatureImageUrl: null as string | null,

  // Easter egg EE.1 : elle tape 08062026 (chiffres uniquement, n'importe où sur
  // le site) → ce message apparaît. Code déduit de `restartDate` ci-dessus, pas
  // de `startDate` — c'est la date des retrouvailles qui sert de code, par choix.
  // BROUILLON — même logique que la lettre : à toi de le rendre vrai.
  secretCodeMessage: "Ce chiffre-là, c'est le jour où on a décidé de ne plus se perdre. Tu l'as trouvé. 😏❤️",

  // Easter egg EE.4 : message affiché si elle visite le site entre minuit et 1h.
  midnightMessage: "Tu ne dors pas ? Moi non plus. Je pense à toi.",

  // Dashboard (3A.4) : une citation différente chaque jour (déduite de la date,
  // pas aléatoire à chaque rechargement). Génériques pour l'instant — remplace
  // par des phrases à vous si tu préfères, dans l'ordre que tu veux.
  dailyQuotes: [
    "Le plus beau jour, c'est celui où on choisit encore la même personne.",
    "Une petite attention aujourd'hui vaut mieux qu'une grande promesse demain.",
    "On ne construit pas une histoire en un jour — on la construit chaque jour.",
    "Le bonheur, c'est souvent juste être deux à regarder dans la même direction.",
    "Rien n'est parfait, mais tout devient plus léger à deux.",
  ],

  // Compte à rebours (3A.5) — laisse `date` à null pour masquer cette section
  // tant que tu n'as pas de prochain événement à annoncer.
  nextEvent: {
    label: "PLACEHOLDER — prochain événement",
    date: null as string | null,
  },
} as const;
