/**
 * Per-language copy for the CV home pages (/, /es, /fr, /de), rendered by
 * HomePage.astro: the FAQs (visible + FAQPage JSON-LD), the regional-profile
 * links and the hidden schema.org Person microdata.
 * @file src/data/home.ts
 */

export type HomeLang = "en" | "es" | "fr" | "de";

export interface HomeCopy {
  faqs: { question: string; answer: string }[];
  regionalLabel: string;
  regionalPrompt: string;
  /** Label-to-list separator; French typography puts a space before the colon. */
  colon: string;
  /** Visible label per regional link, keyed by href. */
  links: Record<string, string>;
  jobTitle: string;
  description: string;
}

export const homeCopy: Record<HomeLang, HomeCopy> = {
  "en": {
    "colon": ":",
    "faqs": [
      {
        "question": "Do you have a work permit for Switzerland?",
        "answer": "As an EU Citizen (Spain), I am eligible for a Swiss Work Permit (B-Permit) immediately upon hiring via the CH-EU Bilateral Agreements. No visa sponsorship required."
      },
      {
        "question": "What programming languages do you specialize in?",
        "answer": "I specialize in Python and C#, with extensive experience in Django, .NET Framework and Core, and REST API development."
      },
      {
        "question": "What industrial protocols do you work with?",
        "answer": "I have over 8 years of experience integrating SNMP, Modbus, and BACnet protocols for DCIM platforms and data center infrastructure."
      },
      {
        "question": "Are you available for remote work?",
        "answer": "Yes, I am open to remote, hybrid, or on-site positions in Switzerland (Zurich, Basel, Geneva, Lausanne) or Spain."
      },
      {
        "question": "When can you start?",
        "answer": "I am available immediately, with no notice period, so I can start as soon as we agree on a date."
      }
    ],
    "regionalLabel": "Regional profiles",
    "regionalPrompt": "Hiring in a specific market?",
    "links": {
      "/switzerland": "Switzerland",
      "/switzerland#zurich": "Zurich",
      "/switzerland#geneva": "Geneva",
      "/switzerland#basel": "Basel",
      "/switzerland#lausanne": "Lausanne",
      "/spain": "Spain",
      "/spain#madrid": "Madrid",
      "/spain#barcelona": "Barcelona"
    },
    "jobTitle": "Senior Backend Developer",
    "description": "Backend developer specializing in industrial protocol integration (SNMP, Modbus, BACnet) with over 8 years building backend applications."
  },
  "es": {
    "colon": ":",
    "faqs": [
      {
        "question": "¿Tienes permiso de trabajo para Suiza?",
        "answer": "Como ciudadano de la UE (España), soy elegible para un permiso de trabajo suizo (Permiso B) inmediatamente tras la contratación según los Acuerdos Bilaterales CH-UE. No requiere patrocinio de visa."
      },
      {
        "question": "¿En qué lenguajes de programación te especializas?",
        "answer": "Me especializo en Python y C#, con amplia experiencia en Django, .NET Framework y Core, y desarrollo de API REST."
      },
      {
        "question": "¿Con qué protocolos industriales trabajas?",
        "answer": "Tengo más de 8 años de experiencia integrando protocolos SNMP, Modbus y BACnet para plataformas DCIM."
      },
      {
        "question": "¿Estás disponible para trabajo remoto?",
        "answer": "Sí, estoy abierto a posiciones remotas, híbridas o presenciales en Suiza (Zúrich, Basilea, Ginebra, Lausana) o España."
      },
      {
        "question": "¿Cuándo puedes empezar?",
        "answer": "Tengo disponibilidad inmediata, sin período de preaviso, así que puedo empezar en cuanto acordemos una fecha."
      }
    ],
    "regionalLabel": "Perfiles regionales",
    "regionalPrompt": "¿Contratas en un mercado concreto?",
    "links": {
      "/switzerland": "Suiza",
      "/switzerland#zurich": "Zúrich",
      "/switzerland#geneva": "Ginebra",
      "/switzerland#basel": "Basilea",
      "/switzerland#lausanne": "Lausana",
      "/spain": "España",
      "/spain#madrid": "Madrid",
      "/spain#barcelona": "Barcelona"
    },
    "jobTitle": "Desarrollador Backend Senior",
    "description": "Desarrollador backend especializado en la integración de protocolos industriales (SNMP, Modbus, BACnet) con más de 8 años de experiencia desarrollando aplicaciones backend."
  },
  "fr": {
    "colon": " :",
    "faqs": [
      {
        "question": "Avez-vous un permis de travail pour la Suisse ?",
        "answer": "En tant que citoyen de l'UE (Espagne), je suis éligible à un permis de travail suisse (Permis B) immédiatement après l'embauche via les Accords Bilatéraux CH-UE. Aucun parrainage de visa requis."
      },
      {
        "question": "Dans quels langages de programmation êtes-vous spécialisé ?",
        "answer": "Je me spécialise en Python et C#, avec une vaste expérience en Django, .NET Framework et Core, et développement d'API REST."
      },
      {
        "question": "Avec quels protocoles industriels travaillez-vous ?",
        "answer": "J'ai plus de 8 ans d'expérience dans l'intégration des protocoles SNMP, Modbus et BACnet pour les plateformes DCIM."
      },
      {
        "question": "Êtes-vous disponible pour le travail à distance ?",
        "answer": "Oui, je suis ouvert aux postes à distance, hybrides ou sur site en Suisse (Zurich, Bâle, Genève, Lausanne) ou en Espagne."
      },
      {
        "question": "Quand pouvez-vous commencer ?",
        "answer": "Je suis disponible immédiatement, sans préavis, et je peux donc commencer dès que nous convenons d'une date."
      }
    ],
    "regionalLabel": "Profils régionaux",
    "regionalPrompt": "Vous recrutez sur un marché précis ?",
    "links": {
      "/switzerland": "Suisse",
      "/switzerland#zurich": "Zurich",
      "/switzerland#geneva": "Genève",
      "/switzerland#basel": "Bâle",
      "/switzerland#lausanne": "Lausanne",
      "/spain": "Espagne",
      "/spain#madrid": "Madrid",
      "/spain#barcelona": "Barcelone"
    },
    "jobTitle": "Développeur Backend Senior",
    "description": "Développeur backend spécialisé dans l'intégration de protocoles industriels (SNMP, Modbus, BACnet) avec plus de 8 ans d'expérience dans le développement backend."
  },
  "de": {
    "colon": ":",
    "faqs": [
      {
        "question": "Haben Sie eine Arbeitsgenehmigung für die Schweiz?",
        "answer": "Als EU-Bürger (Spanien) bin ich berechtigt, sofort nach der Einstellung eine Schweizer Arbeitsbewilligung (B-Bewilligung) gemäß den bilateralen Abkommen CH-EU zu erhalten. Kein Visumsponsoring erforderlich."
      },
      {
        "question": "Auf welche Programmiersprachen sind Sie spezialisiert?",
        "answer": "Ich bin auf Python und C# spezialisiert, mit umfangreicher Erfahrung in Django, .NET Framework und Core, und REST-API-Entwicklung."
      },
      {
        "question": "Mit welchen industriellen Protokollen arbeiten Sie?",
        "answer": "Ich habe über 8 Jahre Erfahrung in der Integration von SNMP-, Modbus- und BACnet-Protokollen für DCIM-Plattformen."
      },
      {
        "question": "Sind Sie für Remote-Arbeit verfügbar?",
        "answer": "Ja, ich bin offen für Remote-, Hybrid- oder Vor-Ort-Positionen in der Schweiz (Zürich, Basel, Genf, Lausanne) oder Spanien."
      },
      {
        "question": "Wann können Sie anfangen?",
        "answer": "Ich bin sofort verfügbar, ohne Kündigungsfrist, und kann beginnen, sobald wir einen Termin vereinbaren."
      }
    ],
    "regionalLabel": "Regionale Profile",
    "regionalPrompt": "Sie stellen in einem bestimmten Markt ein?",
    "links": {
      "/switzerland": "Schweiz",
      "/switzerland#zurich": "Zürich",
      "/switzerland#geneva": "Genf",
      "/switzerland#basel": "Basel",
      "/switzerland#lausanne": "Lausanne",
      "/spain": "Spanien",
      "/spain#madrid": "Madrid",
      "/spain#barcelona": "Barcelona"
    },
    "jobTitle": "Senior Backend-Entwickler",
    "description": "Backend-Entwickler, spezialisiert auf industrielle Protokollintegration (SNMP, Modbus, BACnet) mit über 8 Jahren Erfahrung in der Backend-Entwicklung."
  }
};
