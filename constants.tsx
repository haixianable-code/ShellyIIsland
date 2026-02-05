
import { Word } from './types';

export const SRS_INTERVALS = [0, 1, 3, 7, 14, 30, 90, 180];
export const TODAY_SIMULATED = '2026-02-05';

export const VOCABULARY_DATA: { date: string, words: Word[] }[] = [
  { 
    date: '2026-02-03', 
    words: [
      { 
        id: 'ser', s: 'ser', t: 'To be (Permanent)', type: 'verb', reg: false, 
        forms: '[soy], [eres], [es], [somos], [sois], [son]',
        grammarTip: "Used for origin, identity, and permanent traits. Focuses on 'what' something is.",
        examples: [
          { txt: "Yo soy de España.", eng: "I am from Spain." },
          { txt: "Ella es doctora.", eng: "She is a doctor." }
        ],
        nounNotes: "España (Spain), Doctora (Doctor - female)."
      },
      { 
        id: 'estar', s: 'estar', t: 'To be (Temporary)', type: 'verb', reg: false, 
        forms: 'est[oy], est[ás], est[á], estamos, estáis, est[án]',
        grammarTip: "Used for locations and temporary states (moods). Focuses on 'how' or 'where' something is.",
        examples: [
          { txt: "La casa está limpia.", eng: "The house is clean." },
          { txt: "Estamos en el parque.", eng: "We are in the park." }
        ],
        nounNotes: "Casa (House), Parque (Park)."
      },
      { 
        id: 'tener', s: 'tener', t: 'To have', type: 'verb', reg: false, 
        forms: 'ten[go], t[ie]nes, t[ie]ne, tenemos, tenéis, t[ie]nen',
        grammarTip: "Used for possession and also age (I have X years). Be careful with the 'go' ending in 'Yo'.",
        examples: [
          { txt: "Tengo un perro.", eng: "I have a dog." },
          { txt: "Ella tiene hambre.", eng: "She is hungry (lit: has hunger)." }
        ],
        nounNotes: "Perro (Dog), Hambre (Hunger - noun in Spanish)."
      },
      { 
        id: 'hacer', s: 'hacer', t: 'To do / To make', type: 'verb', reg: false, 
        forms: 'ha[go], haces, hace, hacemos, hacéis, hacen',
        grammarTip: "A very versatile verb. Also used for weather descriptions (Hace sol).",
        examples: [
          { txt: "Hago la tarea.", eng: "I do the homework." },
          { txt: "Hacemos un pastel.", eng: "We make a cake." }
        ],
        nounNotes: "Tarea (Homework), Pastel (Cake)."
      }
    ]
  },
  {
    date: '2026-02-04',
    words: [
      { 
        id: 'ir', s: 'ir', t: 'To go', type: 'verb', reg: false, 
        forms: '[voy], [vas], [va], [vamos], [vais], [van]',
        grammarTip: "Highly irregular. Usually followed by 'a' to indicate destination (Ir a...).",
        examples: [
          { txt: "Voy a la playa.", eng: "I go to the beach." },
          { txt: "Vamos al cine.", eng: "We go to the cinema." }
        ],
        nounNotes: "Playa (Beach), Cine (Cinema)."
      },
      { 
        id: 'venir', s: 'venir', t: 'To come', type: 'verb', reg: false, 
        forms: 'ven[go], v[ie]nes, v[ie]ne, venimos, venís, v[ie]nen',
        grammarTip: "Similar to 'tener' in its stem changes. Often followed by 'de' (Venir de...).",
        examples: [
          { txt: "Vengo de la oficina.", eng: "I come from the office." },
          { txt: "Ella viene tarde.", eng: "She comes late." }
        ],
        nounNotes: "Oficina (Office)."
      },
      { 
        id: 'poder', s: 'poder', t: 'To be able / Can', type: 'verb', reg: false, 
        forms: 'p[ue]do, p[ue]des, p[ue]de, podemos, podéis, p[ue]den',
        grammarTip: "An O to UE stem-changer. Very useful for requests (¿Puedes help me?).",
        examples: [
          { txt: "Puedo hablar un poco.", eng: "I can speak a little." },
          { txt: "No podemos entrar.", eng: "We cannot enter." }
        ],
        nounNotes: "Entrar (To enter - verb as noun object)."
      },
      { 
        id: 'querer', s: 'querer', t: 'To want / To love', type: 'verb', reg: false, 
        forms: 'q[uier]o, q[uier]es, q[uier]e, queremos, queréis, q[uier]en',
        grammarTip: "An E to IE stem-changer. Used both for wanting objects and loving people.",
        examples: [
          { txt: "Quiero un café.", eng: "I want a coffee." },
          { txt: "Te quiero mucho.", eng: "I love you a lot." }
        ],
        nounNotes: "Café (Coffee)."
      }
    ]
  },
  { 
    date: '2026-02-05', 
    words: [
      { 
        id: 'deber', s: 'deber', t: 'Must / Should', type: 'verb', reg: true,
        forms: 'debo, debes, debe, debemos, debéis, deben',
        grammarTip: "A regular -ER verb. Usually followed by an infinitive verb (Deber + hacer).",
        examples: [
          { txt: "Debo estudiar hoy.", eng: "I must study today." },
          { txt: "Debes comer fruta.", eng: "You should eat fruit." }
        ],
        nounNotes: "Fruta (Fruit)."
      },
      { 
        id: 'seguir', s: 'seguir', t: 'To follow / To continue', type: 'verb', reg: false, 
        forms: 's[i]go, s[i]gues, s[i]gue, seguimos, seguís, s[i]guen',
        grammarTip: "An E to I stem-changer. Be careful with the 'Yo' form (Sigo).",
        examples: [
          { txt: "Sigo el camino.", eng: "I follow the path." },
          { txt: "Seguimos las reglas.", eng: "We follow the rules." }
        ],
        nounNotes: "Camino (Path/Way), Reglas (Rules)."
      },
      { 
        id: 'encontrar', s: 'encontrar', t: 'To find / To meet', type: 'verb', reg: false, 
        forms: 'enc[ue]ntro, enc[ue]ntras, enc[ue]ntra, encontramos, encontráis, enc[ue]ntran',
        grammarTip: "An O to UE stem-changer. 'Nosotros' form stays regular.",
        examples: [
          { txt: "Encuentro mis llaves.", eng: "I find my keys." },
          { txt: "Encontramos amigos.", eng: "We meet friends." }
        ],
        nounNotes: "Llaves (Keys), Amigos (Friends)."
      },
      { 
        id: 'llamar', s: 'llamar', t: 'To call', type: 'verb', reg: true,
        forms: 'llamo, llamas, llama, llamamos, llamáis, llaman',
        grammarTip: "Regular -AR verb. Used for calling someone by name or on the phone.",
        examples: [
          { txt: "Llamo a mi hermano.", eng: "I call my brother." },
          { txt: "Llamamos un taxi.", eng: "We call a taxi." }
        ],
        nounNotes: "Hermano (Brother), Taxi (Taxi)."
      },
      { 
        id: 'hablar', s: 'hablar', t: 'To speak / To talk', type: 'verb', reg: true,
        forms: 'hablo, hablas, habla, hablamos, habláis, hablan',
        grammarTip: "The most common -AR verb. Used for speaking a language (Hablar español).",
        examples: [
          { txt: "Hablo con mi madre.", eng: "I talk with my mother." },
          { txt: "Ellos hablan mucho.", eng: "They talk a lot." }
        ],
        nounNotes: "Madre (Mother)."
      },
      { 
        id: 'dejar', s: 'dejar', t: 'To let / To leave', type: 'verb', reg: true,
        forms: 'dejo, dejas, deja, dejamos, dejáis, dejan',
        grammarTip: "Regular -AR verb. Means 'to leave something behind' or 'to allow'.",
        examples: [
          { txt: "Dejo las llaves.", eng: "I leave the keys." },
          { txt: "No me dejas hablar.", eng: "You don't let me speak." }
        ],
        nounNotes: "Llaves (Keys)."
      },
      { 
        id: 'joven', s: 'joven', t: 'Young', type: 'adj', ant: 'viejo', antT: 'Old',
        grammarTip: "Ends in a consonant, so it's the same for male and female nouns.",
        examples: [
          { txt: "Un hombre joven.", eng: "A young man." },
          { txt: "Mujeres jóvenes.", eng: "Young women." }
        ],
        nounNotes: "Hombre (Man), Mujeres (Women)."
      },
      { 
        id: 'viejo', s: 'viejo', t: 'Old', type: 'adj', ant: 'joven', antT: 'Young',
        grammarTip: "Used for objects. For people, 'mayor' is often preferred in polite contexts.",
        examples: [
          { txt: "Un libro viejo.", eng: "An old book." },
          { txt: "Ropa vieja.", eng: "Old clothes." }
        ],
        nounNotes: "Libro (Book), Ropa (Clothes)."
      },
      { 
        id: 'nuevo', s: 'nuevo', t: 'New', type: 'adj', ant: 'antiguo', antT: 'Antique',
        grammarTip: "Standard -o/-a adjective. Usually placed after the noun.",
        examples: [
          { txt: "Un coche nuevo.", eng: "A new car." },
          { txt: "Zapatos nuevos.", eng: "New shoes." }
        ],
        nounNotes: "Coche (Car), Zapatos (Shoes)."
      },
      { 
        id: 'antiguo', s: 'antiguo', t: 'Ancient / Old', type: 'adj', ant: 'nuevo', antT: 'New',
        grammarTip: "Used for history or objects. If placed before the noun, it means 'former'.",
        examples: [
          { txt: "Un museo antiguo.", eng: "An ancient museum." },
          { txt: "Ciudades antiguas.", eng: "Ancient cities." }
        ],
        nounNotes: "Museo (Museum), Ciudades (Cities)."
      },
      { 
        id: 'moderno', s: 'moderno', t: 'Modern', type: 'adj', ant: 'tradicional', antT: 'Traditional',
        grammarTip: "Used for buildings, ideas, or technology.",
        examples: [
          { txt: "Un edificio moderno.", eng: "A modern building." },
          { txt: "Música moderna.", eng: "Modern music." }
        ],
        nounNotes: "Edificio (Building), Música (Music)."
      },
      { 
        id: 'tradicional', s: 'tradicional', t: 'Traditional', type: 'adj', ant: 'moderno', antT: 'Modern',
        grammarTip: "Ends in -al. Same for both genders.",
        examples: [
          { txt: "Comida tradicional.", eng: "Traditional food." },
          { txt: "Un baile tradicional.", eng: "A traditional dance." }
        ],
        nounNotes: "Comida (Food), Baile (Dance)."
      }
    ]
  }
];
