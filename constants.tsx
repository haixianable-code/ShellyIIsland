
import { Word } from './types';

export const SRS_INTERVALS = [0, 1, 3, 7, 14, 30, 90, 180];
export const TODAY_SIMULATED = '2026-02-05';

/**
 * 约定：前端界面允许用户从 EXTRA_CANDIDATES 中最多勾选 10 个单词，
 * 然后将选中的单词加入个人学习计划（更新 ProgressMap），但不直接写回 VOCABULARY_DATA。
 */
export const EXTRA_CANDIDATES: Word[] = [
  {
    id: 'decir', s: 'decir', t: 'To say / To tell', type: 'verb', reg: false,
    forms: 'di[go], d[ic]es, d[ic]e, decimos, decís, d[ic]en',
    grammarTip: "Irregular in 'Yo' and has an e->i stem change. Used with indirect objects (Decirle algo a alguien).",
    examples: [
      { txt: "Digo la verdad.", eng: "I tell the truth." },
      { txt: "Ellos dicen que sí.", eng: "They say yes." }
    ],
    nounNotes: "Verdad (Truth), Sí (Yes/Agreement)."
  },
  {
    id: 'saber', s: 'saber', t: 'To know (Facts/Skills)', type: 'verb', reg: false,
    forms: '[sé], sabes, sabe, sabemos, sabéis, saben',
    grammarTip: "Highly irregular 'Yo' form (Sé). Used for knowing facts or how to do something (Saber + infinitive).",
    examples: [
      { txt: "No sé nada.", eng: "I don't know anything." },
      { txt: "Sabe cocinar.", eng: "He/She knows how to cook." }
    ],
    nounNotes: "Nada (Nothing), Cocinar (To cook - verb as object)."
  },
  {
    id: 'creer', s: 'creer', t: 'To believe / To think', type: 'verb', reg: false,
    forms: 'creo, crees, cree, creemos, creéis, creen',
    grammarTip: "Regular endings, but note the 'y' in past tenses (not shown here). Used for opinions.",
    examples: [
      { txt: "Creo que sí.", eng: "I think so." },
      { txt: "No creo en brujas.", eng: "I don't believe in witches." }
    ],
    nounNotes: "Brujas (Witches)."
  },
  {
    id: 'llegar', s: 'llegar', t: 'To arrive', type: 'verb', reg: true,
    forms: 'llego, llegas, llega, llegamos, llegáis, llegan',
    grammarTip: "Regular -AR verb, but has a spelling change in 'Pretérito' (llegué). Usually used with 'a'.",
    examples: [
      { txt: "Llego tarde.", eng: "I arrive late." },
      { txt: "Llegamos al hotel.", eng: "We arrive at the hotel." }
    ],
    nounNotes: "Hotel (Hotel)."
  },
  {
    id: 'dar', s: 'dar', t: 'To give', type: 'verb', reg: false,
    forms: '[doy], das, da, damos, dais, dan',
    grammarTip: "Highly irregular 'Yo' form (Doy). Used in many idioms like 'dar un paseo' (take a walk).",
    examples: [
      { txt: "Doy un regalo.", eng: "I give a gift." },
      { txt: "Ella me da dinero.", eng: "She gives me money." }
    ],
    nounNotes: "Regalo (Gift), Dinero (Money)."
  },
  {
    id: 'parecer', s: 'parecer', t: 'To seem / To look like', type: 'verb', reg: false,
    forms: 'pare[zco], pareces, parece, parecemos, parecéis, parecen',
    grammarTip: "Irregular 'Yo' ending in -zco. Often used as 'Me parece...' (It seems to me).",
    examples: [
      { txt: "Parece difícil.", eng: "It seems difficult." },
      { txt: "Te pareces a tu padre.", eng: "You look like your father." }
    ],
    nounNotes: "Padre (Father)."
  },
  {
    id: 'poner', s: 'poner', t: 'To put / To place', type: 'verb', reg: false,
    forms: 'pon[go], pones, pone, ponemos, ponéis, ponen',
    grammarTip: "Irregular 'Yo' form (Pongo). Also used reflexively (ponerse) to mean 'to become' or 'to wear'.",
    examples: [
      { txt: "Pongo la mesa.", eng: "I set the table." },
      { txt: "Ella pone la radio.", eng: "She turns on the radio." }
    ],
    nounNotes: "Mesa (Table), Radio (Radio)."
  },
  {
    id: 'importante', s: 'importante', t: 'Important', type: 'adj',
    grammarTip: "Ends in -e, so it is the same for both masculine and feminine nouns.",
    examples: [
      { txt: "Una cita importante.", eng: "An important appointment." },
      { txt: "Es muy importante.", eng: "It is very important." }
    ],
    nounNotes: "Cita (Date/Appointment)."
  },
  {
    id: 'feliz', s: 'feliz', t: 'Happy', type: 'adj', ant: 'triste', antT: 'Sad',
    grammarTip: "Ends in -z. For plural, change -z to -c: felices.",
    examples: [
      { txt: "Estoy muy feliz.", eng: "I am very happy." },
      { txt: "Una familia feliz.", eng: "A happy family." }
    ],
    nounNotes: "Familia (Family)."
  },
  {
    id: 'triste', s: 'triste', t: 'Sad', type: 'adj', ant: 'feliz', antT: 'Happy',
    grammarTip: "Ends in -e, so it works for both genders without change.",
    examples: [
      { txt: "Una película triste.", eng: "A sad movie." },
      { txt: "Él está triste.", eng: "He is sad." }
    ],
    nounNotes: "Película (Movie)."
  },
  {
    id: 'dificil', s: 'difícil', t: 'Difficult', type: 'adj', ant: 'fácil', antT: 'Easy',
    grammarTip: "Has an accent on the 'i'. Same form for masculine and feminine.",
    examples: [
      { txt: "Un idioma difícil.", eng: "A difficult language." },
      { txt: "Tareas difíciles.", eng: "Difficult tasks (plural)." }
    ],
    nounNotes: "Idioma (Language), Tareas (Tasks)."
  },
  {
    id: 'facil', s: 'fácil', t: 'Easy', type: 'adj', ant: 'difícil', antT: 'Difficult',
    grammarTip: "Accent on 'a'. Plural is 'fáciles'.",
    examples: [
      { txt: "Es pan comido (fácil).", eng: "It's a piece of cake (easy)." },
      { txt: "Un examen fácil.", eng: "An easy exam." }
    ],
    nounNotes: "Examen (Exam)."
  },
  {
    id: 'seguro', s: 'seguro', t: 'Sure / Safe', type: 'adj', ant: 'peligroso', antT: 'Dangerous',
    grammarTip: "With 'ser' means safe; with 'estar' means sure/certain.",
    examples: [
      { txt: "El barrio es seguro.", eng: "The neighborhood is safe." },
      { txt: "Estoy seguro de eso.", eng: "I am sure about that." }
    ],
    nounNotes: "Barrio (Neighborhood)."
  },
  {
    id: 'listo', s: 'listo', t: 'Ready / Smart', type: 'adj', ant: 'tonto', antT: 'Dumb',
    grammarTip: "With 'ser' means smart; with 'estar' means ready.",
    examples: [
      { txt: "El niño es muy listo.", eng: "The boy is very smart." },
      { txt: "Ya estoy listo.", eng: "I am ready now." }
    ],
    nounNotes: "Niño (Boy)."
  },
  {
    id: 'solo', s: 'solo', t: 'Alone / Only', type: 'adj',
    grammarTip: "Adjective means 'alone'. As an adverb (only) it used to carry an accent (sólo).",
    examples: [
      { txt: "Vivo solo.", eng: "I live alone." },
      { txt: "Un café solo.", eng: "A black coffee (alone)." }
    ],
    nounNotes: "Café (Coffee)."
  },
  {
    id: 'sentir', s: 'sentir', t: 'To feel / To regret', type: 'verb', reg: false,
    forms: 's[ie]nto, s[ie]ntes, s[ie]nte, sentimos, sentís, s[ie]nten',
    grammarTip: "E to IE stem changer. Used to express feelings or apologies (Lo siento).",
    examples: [
      { txt: "Siento mucho calor.", eng: "I feel a lot of heat." },
      { txt: "Lo siento mucho.", eng: "I am so sorry (I regret it)." }
    ],
    nounNotes: "Calor (Heat)."
  },
  {
    id: 'ver', s: 'ver', t: 'To see / To watch', type: 'verb', reg: false,
    forms: 'veo, ves, ve, vemos, veis, ven',
    grammarTip: "Mostly regular present, but has a unique 'Yo' form (Veo) and irregular past (visto).",
    examples: [
      { txt: "Veo la tele.", eng: "I watch TV." },
      { txt: "Vemos el mar.", eng: "We see the sea." }
    ],
    nounNotes: "Tele (TV - short for televisión), Mar (Sea)."
  },
  {
    id: 'tiempo', s: 'tiempo', t: 'Time / Weather', type: 'noun',
    grammarTip: "Used for both clock time and atmospheric weather. (Hace buen tiempo).",
    examples: [
      { txt: "No tengo tiempo.", eng: "I don't have time." },
      { txt: "¿Qué tiempo hace?", eng: "How is the weather?" }
    ],
    nounNotes: "Hacer (To do/make - used for weather)."
  },
  {
    id: 'vida', s: 'vida', t: 'Life', type: 'noun',
    grammarTip: "Often used with 'la' (La vida es bella).",
    examples: [
      { txt: "Disfruto la vida.", eng: "I enjoy life." },
      { txt: "Una vida sana.", eng: "A healthy life." }
    ],
    nounNotes: "Sana (Healthy - adj)."
  },
  {
    id: 'gente', s: 'gente', t: 'People', type: 'noun',
    grammarTip: "In Spanish, 'gente' is singular. Use 'La gente es...' not 'son'.",
    examples: [
      { txt: "La gente es amable.", eng: "People are kind." },
      { txt: "Hay mucha gente.", eng: "There are many people." }
    ],
    nounNotes: "Amable (Kind - adj)."
  },
  {
    id: 'mundo', s: 'mundo', t: 'World', type: 'noun',
    grammarTip: "Used in expressions like 'Todo el mundo' (Everyone).",
    examples: [
      { txt: "Viajo por el mundo.", eng: "I travel through the world." },
      { txt: "Todo el mundo sabe.", eng: "Everyone knows." }
    ],
    nounNotes: "Viajar (To travel)."
  },
  {
    id: 'cosa', s: 'cosa', t: 'Thing', type: 'noun',
    grammarTip: "A very general word. Replace with specific nouns as your level grows!",
    examples: [
      { txt: "Tengo muchas cosas.", eng: "I have many things." },
      { txt: "Una cosa más.", eng: "One more thing." }
    ],
    nounNotes: "Más (More)."
  },
  {
    id: 'lugar', s: 'lugar', t: 'Place', type: 'noun',
    grammarTip: "Synonym of 'sitio'. Often used as 'en primer lugar' (in the first place).",
    examples: [
      { txt: "Un lugar bonito.", eng: "A beautiful place." },
      { txt: "Este es el lugar.", eng: "This is the place." }
    ],
    nounNotes: "Bonito (Beautiful - adj)."
  },
  {
    id: 'bueno', s: 'bueno', t: 'Good', type: 'adj', ant: 'malo', antT: 'Bad',
    grammarTip: "Shortens to 'buen' before a masculine singular noun (Un buen día).",
    examples: [
      { txt: "Un libro bueno.", eng: "A good book." },
      { txt: "¡Buen trabajo!", eng: "Good job!" }
    ],
    nounNotes: "Libro (Book), Trabajo (Work/Job)."
  },
  {
    id: 'malo', s: 'malo', t: 'Bad', type: 'adj', ant: 'bueno', antT: 'Good',
    grammarTip: "Shortens to 'mal' before a masculine singular noun (Un mal ejemplo).",
    examples: [
      { txt: "Un mal día.", eng: "A bad day." },
      { txt: "Comida mala.", eng: "Bad food." }
    ],
    nounNotes: "Día (Day), Comida (Food)."
  }
];

export const ISLAND_SLANG = [
  { s: "¡No me toques los huevos!", t: "Stop bothering me!", note: "⚠️ [Warning: Vulgar] Lit: Don't touch my eggs." },
  { s: "Postureo", t: "Showing off / Flexing", note: "Common in social media for 'posing' for photos." },
  { s: "Estar de chill", t: "To be chilling", note: "Spanglish used by Gen Z for relaxing." },
  { s: "Crush", t: "A crush", note: "Directly borrowed from English, very common on Instagram/TikTok." },
  { s: "Puntazo", t: "A great point / Cool thing", note: "That's a 'plus' or a really cool feature." },
  { s: "¡Qué fuerte!", t: "Wow! / No way!", note: "Used for shocking news or gossip." },
  { s: "En plan...", t: "Like...", note: "The ultimate filler word used by young Spaniards." },
  { s: "O sea", t: "I mean / In other words", note: "Filler word used to clarify (often sounds 'pijo/posh')." },
  { s: "¡Joder!", t: "F*ck! / Damn!", note: "⚠️ [Warning: Vulgar] Extremely common exclamation in Spain." },
  { s: "Gilipollas", t: "Asshole / Idiot", note: "⚠️ [Warning: Offensive] Very common insult in Spain." },
  { s: "Molar", t: "To be cool / To like", note: "¡Esto mola mucho! = This is really cool!" },
  { s: "Flipar", t: "To freak out / To love", note: "Flipando en colores = Totally freaking out." },
  { s: "Guay", t: "Cool", note: "The classic Spanish word for 'cool'." },
  { s: "Chulo", t: "Cool / Cute / Cocky", note: "Can mean a cool object or a cocky person." },
  { s: "Currar", t: "To work", note: "Slang for 'trabajar'. Un curro = A job." },
  { s: "Pasta", t: "Money", note: "No tengo pasta = I don't have any money/dough." },
  { s: "Tío / Tía", t: "Dude / Girl", note: "Used to address friends, regardless of age." },
  { s: "Colega", t: "Buddy / Pal", note: "Informal way to say friend." },
  { s: "Ni de coña", t: "No way / Not a chance", note: "⚠️ [Warning: Informal] A strong way to say no." },
  { s: "Me la pela", t: "I don't give a sh*t", note: "⚠️ [Warning: Vulgar] Use only with very close friends." },
  { s: "Coño", t: "Damn / What the...", note: "⚠️ [Warning: Vulgar] Used for emphasis, very common." },
  { s: "Cabrón", t: "Bastard / Skilled person", note: "⚠️ [Warning: Offensive] Can be an insult or a compliment among friends." },
  { s: "Pavo / Pava", t: "Guy / Girl", note: "Lit: Turkey. Used like 'this guy/girl'." },
  { s: "Me rallo", t: "I'm tripping / overthinking", note: "Used when something is confusing or bothering you." },
  { s: "Es la caña", t: "It's awesome", note: "Lit: It's the cane/reed." },
  { s: "Ir a su bola", t: "To do one's own thing", note: "He/She goes at their own pace/ball." },
  { s: "Ser un empollón", t: "To be a nerd", note: "Someone who studies a lot." },
  { s: "Niquelado", t: "Perfect / Flawless", note: "Often used when something is finished perfectly." },
  { s: "Vete a freír espárragos", t: "Go away / Get lost", note: "Lit: Go fry asparagus. A polite way to tell someone to leave." },
  { s: "Estar hecho polvo", t: "To be exhausted", note: "Lit: To be made of dust." },
  { s: "Mala pata", t: "Bad luck", note: "Lit: Bad leg." },
  { s: "Estar de coña", t: "To be joking", note: "¿Estás de coña? = Are you kidding me?" },
  { s: "Ponerse las pilas", t: "To get one's act together", note: "Lit: To put in batteries." },
  { s: "Hacerse un lío", t: "To get confused", note: "Lit: To make oneself a mess." },
  { s: "Ser un tostón", t: "To be a bore", note: "Used for boring people or situations." },
  { s: "Dar la lata", t: "To annoy", note: "Lit: To give the tin/can." },
  { s: "Estar como una cabra", t: "To be crazy", note: "Lit: To be like a goat." },
  { s: "No tener pelos en la lengua", t: "To be blunt", note: "Lit: Not to have hairs on the tongue." },
  { s: "Ser pan comido", t: "To be a piece of cake", note: "Lit: To be eaten bread." },
  { s: "Tomar el pelo", t: "To pull someone's leg", note: "Lit: To take the hair." },
  { s: "Tirar la casa por la ventana", t: "To spare no expense", note: "Lit: To throw the house out the window." },
  { s: "Quedarse de piedra", t: "To be stunned", note: "Lit: To stay like stone." },
  { s: "Estar en las nubes", t: "To be daydreaming", note: "Lit: To be in the clouds." },
  { s: "Echar un ojo", t: "To have a look", note: "Lit: To throw an eye." },
  { s: "Cagarla", t: "To screw up", note: "⚠️ [Warning: Vulgar] Lit: To sh*t it." },
  { s: "Hostia", t: "Damn / Hit", note: "⚠️ [Warning: Vulgar] Used as an exclamation or to describe a hit/slap." },
  { s: "Pijo / Pija", t: "Posh / Preppy", note: "Used for people who act rich or snobbish." },
  { s: "Friki", t: "Geek / Freak", note: "Commonly used for fans of anime, tech, or niche hobbies." },
  { s: "Cutre", t: "Shabby / Seedy / Poor quality", note: "Used for something cheap or poorly made." },
  { s: "Hortera", t: "Tacky / Gaudy", note: "Used for someone with bad fashion sense." },
  { s: "Chachi", t: "Lovely / Nice", note: "A bit old-fashioned but still used occasionally." },
  { s: "Guiri", t: "Foreign tourist", note: "Specifically used for Northern European or North American tourists." },
  { s: "Botellón", t: "Street drinking party", note: "Very common social phenomenon in Spain." },
  { s: "Tapear", t: "To go for tapas", note: "The most important Spanish social activity." },
  { s: "Caña", t: "Small beer", note: "Standard way to order a beer from the tap." },
  { s: "Ligar", t: "To flirt / To hook up", note: "Essential for social life." },
  { s: "Dar un plantón", t: "To stand someone up", note: "When someone doesn't show up for a date." },
  { s: "Ser un bicho raro", t: "To be a weirdo", note: "Lit: To be a weird bug." },
  { s: "Tener mala leche", t: "To have a bad temper", note: "Lit: To have bad milk." },
  { s: "Ser un pelota", t: "To be a teacher's pet / suck-up", note: "Someone who flatters others for gain." },
  { s: "Sanguijuela", t: "Leech", note: "For someone who takes advantage of others." },
  { s: "¡Ni hablar!", t: "No way!", note: "Lit: Not even talk about it." },
  { s: "Por si las moscas", t: "Just in case", note: "Lit: For if the flies." },
  { s: "Me importa un pimiento", t: "I couldn't care less", note: "Lit: It matters a pepper to me." },
  { s: "Estar de mala uva", t: "To be in a bad mood", note: "Lit: To be of bad grape." },
  { s: "Ser un rata", t: "To be stingy", note: "Lit: To be a rat. Used for someone who hates spending money." },
  { s: "Hacer el chorra", t: "To act like an idiot", note: "⚠️ [Warning: Informal] Lit: To do the spout." },
  { s: "Liarla parda", t: "To make a huge mess", note: "Used when a small mistake becomes a big disaster." },
  { s: "Estar hasta las narices", t: "To be fed up", note: "Lit: To be up to the nostrils." },
  { s: "Ser un muermo", t: "To be a drag / bore", note: "Used for a person who has no energy." },
  { s: "Pasárselo bomba", t: "To have a blast", note: "Lit: To pass it bomb." },
  { s: "Irse por los cerros de Úbeda", t: "To beat around the bush", note: "Lit: To go through the hills of Ubeda." },
  { s: "Meter la pata", t: "To put one's foot in it", note: "To make a mistake or be indiscreet." },
  { s: "No dar palo al agua", t: "To not do a lick of work", note: "Lit: Not to give a stick to the water." },
  { s: "Quedarse frito", t: "To fall fast asleep", note: "Lit: To stay fried." },
  { s: "Ser la leche", t: "To be the best / incredible", note: "Lit: To be the milk. Can be positive or negative." },
  { s: "¡Vaya tela!", t: "What a mess! / Unbelievable!", note: "Used when a story is complicated or shocking." },
  { s: "Hacerse el sueco", t: "To play dumb", note: "Lit: To act Swedish." },
  { s: "A otra cosa, mariposa", t: "Let's move on", note: "Lit: To another thing, butterfly. Rhyming way to change topics." },
  { s: "Poner los cuernos", t: "To cheat on someone", note: "Lit: To put the horns on." },
  { s: "Estar forrado", t: "To be loaded (rich)", note: "Lit: To be lined/covered." },
  { s: "No comerse un rosco", t: "To have no luck (romantically)", note: "Lit: Not to eat a doughnut." },
  { s: "Dar el pego", t: "To look the part / pass as genuine", note: "Used for something that looks real but might not be." },
  { s: "Ser un bocazas", t: "To be a big mouth", note: "Someone who can't keep a secret." },
  { s: "Montar un pollo", t: "To make a scene", note: "Lit: To mount a chicken." },
  { s: "Ir pitando", t: "To go very fast / in a rush", note: "Lit: To go whistling." },
  { s: "Estar de bajón", t: "To feel down/sad", note: "Used for a temporary low mood." },
  { s: "Sudar de alguien", t: "To ignore someone", note: "Lit: To sweat from someone." },
  { s: "Tener un cacao", t: "To be confused", note: "Lit: To have a cocoa/mess in the head." },
  { s: "Ser un solete", t: "To be a sweetheart", note: "Lit: To be a little sun." },
  { s: "Me mola mazo", t: "I like it a lot", note: "Madrid slang using 'mazo' for 'very/a lot'." },
  { s: "¡Hosti!", t: "Oops! / Wow!", note: "Softened version of 'hostia'." },
  { s: "Modo avión", t: "Airplane mode", note: "Used metaphorically for disconnecting from people." },
  { s: "Hacer ghosting", t: "To ghost someone", note: "Direct adoption of the English term for social media." },
  { s: "Influencer", t: "Influencer", note: "Used exactly as in English." },
  { s: "Darle a like", t: "To like a post", note: "Verbified use of the word 'like'." },
  { s: "Hacer un directo", t: "To go live", note: "Used for Instagram/TikTok lives." },
  { s: "Followers", t: "Followers", note: "Usually used in English or translated as 'seguidores'." },
  { s: "Hashtag", t: "Hashtag", note: "Universal social media term." },
  { s: "¡A tope!", t: "To the max! / Full on!", note: "Used for energy and excitement." }
];

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
          { txt: "Hablo con mi mother.", eng: "I talk with my mother." },
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
