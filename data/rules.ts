export type Rule = {
  number: string;
  title: string;
  category: string;
  sections?: { title: string; items: string[] }[];
  items?: string[];
  important?: boolean;
};

export const rules: Rule[] = [
  {
    number: "§1",
    title: "Allgemeines Verhalten",
    category: "Allgemeines",
    items: [
      "Behandle alle Spieler und Teammitglieder respektvoll. Beleidigungen sind nur im angemessenen RP-Kontext erlaubt.",
      "Rassismus, Sexismus, extreme Diskriminierung, sexuelle Belästigung und menschenverachtende Inhalte sind verboten.",
      "Trolling, absichtliches Stören von RP und provozierte Regelverstöße werden sanktioniert.",
      "Das Ausnutzen von Bugs, Glitches oder Exploits ist verboten. Gefundene Fehler müssen dem Team gemeldet werden.",
      "Cheats, Mod-Menüs, unerlaubte Hilfsmittel und das Weitergeben interner Informationen führen zum Ausschluss."
    ]
  },
  {
    number: "§2",
    title: "Roleplay-Grundlagen",
    category: "Roleplay",
    items: [
      "Jeder Spieler muss sein Leben glaubwürdig schützen und Gefahren ernst nehmen (FearRP).",
      "Unrealistisches oder erzwungenes RP (FailRP/PowerRP) ist verboten. Andere Spieler müssen eine faire Reaktionsmöglichkeit erhalten.",
      "Informationen aus Discord, Streams oder anderen Quellen dürfen nicht im RP verwendet werden (Metagaming).",
      "IC- und OOC-Angelegenheiten sind klar voneinander zu trennen. OOC-Diskussionen gehören nicht in laufende Situationen.",
      "Das Verlassen des Servers während oder unmittelbar nach einer RP-Situation (Combat Logging) ist verboten.",
      "Ein Serverneustart beendet eine laufende RP-Situation nicht automatisch. Die Situation wird danach fortgesetzt.",
      "Soundboards, Stimmenverzerrer und unrealistische Charakterkonzepte dürfen RP nicht stören."
    ]
  },
  {
    number: "§3",
    title: "RDM und VDM",
    category: "Kampf",
    items: [
      "RDM: Das Töten oder Verletzen ohne nachvollziehbaren RP-Hintergrund ist verboten.",
      "Vor einem Angriff muss grundsätzlich eine klare und verständliche RP-Interaktion stattfinden.",
      "VDM: Fahrzeuge dürfen nicht ohne triftigen RP-Grund als Waffe eingesetzt werden.",
      "Personen absichtlich zu überfahren oder dauerhaft zu rammen ist verboten.",
      "Ein Fahrzeug darf nur zur Flucht oder in einer glaubwürdigen Ausnahmesituation defensiv eingesetzt werden."
    ]
  },
  {
    number: "§4",
    title: "New-Life-Regel und Bewusstlosigkeit",
    category: "Roleplay",
    items: [
      "Bewusstlose Spieler dürfen sich nicht an Gespräche oder Informationen erinnern, die sie während ihrer Bewusstlosigkeit wahrgenommen haben.",
      "Nach einer vollständigen Wiederbelebung mit Gedächtnisverlust darf nicht unmittelbar an den Ort der Niederlage zurückgekehrt werden.",
      "Rache aufgrund einer vergessenen Situation ist verboten.",
      "Eine Behandlung durch den EMS ist auszuspielen. Verletzungen dürfen nicht ignoriert werden.",
      "Ein permanenter Charaktertod darf nicht ohne Zustimmung des betroffenen Spielers oder Entscheidung der Serverleitung erzwungen werden."
    ]
  },
  {
    number: "§5",
    title: "Überfälle und Geiselnahmen",
    category: "Kampf",
    items: [
      "Überfälle benötigen einen nachvollziehbaren RP-Grund und eine klare Forderung.",
      "Dem Gegenüber muss ausreichend Zeit zum Verstehen und Reagieren gegeben werden.",
      "Unverhältnismäßige Forderungen sowie das vollständige Leerräumen eines Spielers sind verboten.",
      "Geiseln dürfen nicht ohne RP-Grund verletzt oder getötet werden.",
      "Abgesprochene Fake-Geiseln sind verboten.",
      "Derselbe Spieler darf nicht wiederholt in kurzer Folge überfallen werden.",
      "Atlas und EMS dürfen nicht allein wegen ihrer Dienstausrüstung überfallen oder entführt werden."
    ]
  },
  {
    number: "§6",
    title: "Looting und Loot-Zonen",
    category: "Loot & Zonen",
    items: [
      "Survivor dürfen die Karte, Ruinen und freigegebenen Gebiete nach Ressourcen durchsuchen.",
      "Lootpunkte, Händler, Spawngebiete und wichtige Zugänge dürfen nicht abgecampt werden.",
      "Es ist verboten, an einem Lootpunkt zu warten, um ankommende oder gerade lootende Spieler ohne echtes RP auszurauben oder zu töten.",
      "Loot darf nicht durch Glitches, Makros oder andere unerlaubte Methoden vervielfältigt werden.",
      "Das Plündern bewusstloser Spieler ist nur nach einer vorausgegangenen RP-Situation und im erlaubten Umfang gestattet.",
      "Das absichtliche Verfolgen anderer Spieler ausschließlich wegen ihres Loots ist verboten.",
      "Geschützte Zonen und serverseitige Loot-Beschränkungen sind einzuhalten."
    ]
  },
  {
    number: "§7",
    title: "Fraktionen und Gruppierungen",
    category: "Fraktionen",
    sections: [
      {
        title: "Atlas-Einheit",
        items: [
          "Die Atlas-Einheit übernimmt staatliche Sicherheits- und Ordnungsaufgaben.",
          "Maßnahmen müssen verhältnismäßig und im RP begründet sein.",
          "Korruption oder Machtmissbrauch sind nur mit vorheriger Genehmigung der Fraktions- und Serverleitung erlaubt.",
          "Dienstwaffen, Fahrzeuge und interne Informationen dürfen nicht ohne Genehmigung weitergegeben werden."
        ]
      },
      {
        title: "EMS",
        items: [
          "Der EMS ist grundsätzlich neutral und dient der medizinischen Versorgung.",
          "EMS-Mitarbeiter dürfen während einer Behandlung nicht angegriffen, entführt oder ausgeraubt werden.",
          "Die Neutralität darf nicht zur Informationsweitergabe oder Begünstigung einer Seite missbraucht werden.",
          "Dienstmaterial und medizinische Ausrüstung dürfen nicht zweckentfremdet werden."
        ]
      },
      {
        title: "Gangs und andere Gruppierungen",
        items: [
          "Gangs benötigen ein erkennbares Konzept, Ziele und glaubwürdiges Verhalten.",
          "Konflikte müssen sich aus dem RP entwickeln. Dauerhafte grundlose Kriege sind verboten.",
          "Gangzugehörigkeit rechtfertigt keinen sofortigen Angriff.",
          "Staatliche Organisationen dürfen nicht allein wegen ihrer Fraktionszugehörigkeit angegriffen werden.",
          "Mitgliederlimits, Bündnisse und Gebietsregeln der Serverleitung sind einzuhalten."
        ]
      },
      {
        title: "Survivor",
        items: [
          "Survivor sind freie Überlebende und dürfen looten, handeln, reisen und Gruppen bilden.",
          "Ein Survivor muss Gefahren ebenso ernst nehmen wie Mitglieder offizieller Organisationen.",
          "Das Survivor-Konzept ist keine Rechtfertigung für RDM, Loot-Camping oder dauerhaftes Banditenverhalten ohne RP."
        ]
      }
    ]
  },
  {
    number: "§8",
    title: "Schusswechsel und Konflikte",
    category: "Kampf",
    items: [
      "Schusswechsel müssen eine nachvollziehbare Vorgeschichte besitzen.",
      "Forderungen sind klar auszusprechen und müssen erfüllbar sein.",
      "Nach einer erfüllten Forderung darf nicht grundlos geschossen werden.",
      "Das Einmischen in fremde Schusswechsel ohne eigenen RP-Bezug ist verboten.",
      "Nachrückende Spieler dürfen nur teilnehmen, wenn sie bereits glaubwürdig in die Situation eingebunden waren.",
      "Das Wechseln des Charakters, um sich erneut an derselben Situation zu beteiligen, ist verboten."
    ]
  },
  {
    number: "§8.1",
    title: "Gebietseroberungen",
    category: "Loot & Zonen",
    important: true,
    items: [
      "Bei einer Gebietseroberung darf ausschließlich innerhalb der sichtbar markierten Eroberungszone geschossen werden.",
      "Schüsse von außerhalb in die Zone oder aus der Zone nach außen sind verboten.",
      "Das Verlassen der Zone, um Gegner außerhalb zu bekämpfen, ist nicht erlaubt.",
      "Das absichtliche Hinauslocken von Spielern aus der Zone, um sie dort anzugreifen, ist verboten.",
      "Nur Spieler, die glaubwürdig und aktiv an der Gebietseroberung beteiligt sind, dürfen eingreifen.",
      "Nach Ende oder Abbruch der Eroberung endet die besondere Schusserlaubnis sofort."
    ]
  },
  {
    number: "§9",
    title: "Fahrzeuge und Apokalypse-Setting",
    category: "Roleplay",
    items: [
      "Fahrzeuge sind dem Setting entsprechend wertvoll und glaubwürdig zu behandeln.",
      "Unrealistische Stunts, grundloses Rammen und dauerhaftes Fahren mit völlig zerstörten Fahrzeugen gelten als FailRP.",
      "Reparaturen, Treibstoffmangel und Unfälle müssen angemessen ausgespielt werden.",
      "Fraktionsfahrzeuge dürfen nur mit nachvollziehbarem RP-Grund entwendet werden."
    ]
  },
  {
    number: "§10",
    title: "Safezones und Respawn-Bereiche",
    category: "Loot & Zonen",
    items: [
      "In ausgewiesenen Safezones sind Überfälle, Entführungen, Schüsse und Provokationen verboten.",
      "Spieler dürfen nicht in Safezones fliehen, um einer bereits laufenden Situation zu entkommen.",
      "Das Warten an Ein- oder Ausgängen einer Safezone, um Spieler direkt abzufangen, ist verboten.",
      "Spawn- und Respawn-Bereiche dürfen nicht beobachtet oder abgecampt werden."
    ]
  },
  {
    number: "§11",
    title: "Support",
    category: "Support",
    items: [
      "Laufende RP-Situationen werden nicht wegen einer OOC-Diskussion unterbrochen. Streitfälle sind danach im Support zu klären.",
      "Supportfälle sollten nach Möglichkeit mit Clips oder Screenshots belegt werden.",
      "Aufnahmen dürfen nicht manipuliert oder bewusst aus dem Zusammenhang gerissen werden.",
      "Supportentscheidungen sind zu respektieren. Beschwerden sind sachlich über den vorgesehenen Weg einzureichen.",
      "Regellücken dürfen nicht absichtlich ausgenutzt werden. Die Serverleitung entscheidet im Sinne eines fairen RP."
    ]
  },
  {
    number: "GRUNDSATZ",
    title: "Fairness vor Gewinnen",
    category: "Allgemeines",
    important: true,
    items: [
      "Handle fair, schütze dein Leben und gib anderen Spielern die Möglichkeit, gutes RP zu entwickeln. Gewinnen ist weniger wichtig als eine gemeinsame, glaubwürdige Geschichte."
    ]
  }
];

export const ruleCategories = [
  "Alle",
  "Allgemeines",
  "Roleplay",
  "Kampf",
  "Loot & Zonen",
  "Fraktionen",
  "Support"
];
