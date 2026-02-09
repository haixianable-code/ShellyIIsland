
import { Word, DayPack, WordNuance, WordLevel, WordTopic } from './types';
import { pluralize, generateRegularForms } from './utils/grammar';

export const SRS_INTERVALS = [0, 1, 3, 7, 14, 30, 90, 180];
export const TODAY_SIMULATED = new Date().toISOString().split('T')[0];

// --- NUANCE DEFINITIONS ---
const N_SER_ESTAR: WordNuance = { type: 'warning', label: 'Core Concept', note: 'Ser = Essence (Who/What). Estar = State (How/Where).' };
const N_SABER_CONOCER: WordNuance = { type: 'warning', label: 'To Know', note: 'Saber = Facts/Skills. Conocer = People/Places.' };
const N_RICO: WordNuance = { type: 'upgrade', label: 'Double Meaning', note: 'Ser rico = Wealthy. Estar rico = Delicious (Food).' };
const N_PEDIR_PREGUNTAR: WordNuance = { type: 'warning', label: 'To Ask', note: 'Pedir = Ask for object. Preguntar = Ask for info.' };
const N_OIR_ESCUCHAR: WordNuance = { type: 'warning', label: 'Hearing', note: 'Oír = To hear (passive). Escuchar = To listen (active).' };
const N_VER_MIRAR: WordNuance = { type: 'warning', label: 'Vision', note: 'Ver = To see (passive). Mirar = To look at/watch (active).' };
const N_TOCAR_JUGAR: WordNuance = { type: 'warning', label: 'Play', note: 'Jugar = Sports/Games. Tocar = Instrument/Touch.' };
const N_LLEVAR_TRAER: WordNuance = { type: 'warning', label: 'Direction', note: 'Llevar = Take (there). Traer = Bring (here).' };
const N_AMAR_QUERER: WordNuance = { type: 'upgrade', label: 'Love Levels', note: 'Querer = Want/Like. Amar = Deep/Romantic love.' };
const N_LISTO: WordNuance = { type: 'upgrade', label: 'Double Meaning', note: 'Ser listo = Smart. Estar listo = Ready.' };
const N_SEGURO: WordNuance = { type: 'upgrade', label: 'Double Meaning', note: 'Ser seguro = Safe. Estar seguro = Certain.' };
const N_VIEJO_ANCIANO: WordNuance = { type: 'upgrade', label: 'Politeness', note: 'Viejo = Old object. Anciano = Elderly person.' };
const N_OYE_ESCUCHA: WordNuance = { type: 'warning', label: 'Usage', note: 'Oye = Hey (Attention). Escucha = Listen (Command).' };
const N_DEJAR_SALIR: WordNuance = { type: 'warning', label: 'To Leave', note: 'Salir = Go out. Dejar = Leave something/someone.' };
const N_PERDER_FALTAR: WordNuance = { type: 'warning', label: 'Missing', note: 'Perder = To lose. Faltar = To be missing.' };

// --- HELPERS ---
const v = (id: string, s: string, t: string, level: WordLevel, topic: WordTopic, tip: string, ex1: string, ex1t: string, ex2: string, ex2t: string, nn: string, forms?: string, reg?: boolean, nuance?: WordNuance): Word => {
  const effectiveReg = reg ?? true;
  let computedForms = forms || '';
  if (effectiveReg && !computedForms) computedForms = generateRegularForms(s);
  return { id, s, t, level, topic, type: 'verb', category: 'island', reg: effectiveReg, forms: computedForms, grammarTip: tip, examples: [{ txt: ex1, eng: ex1t }, { txt: ex2, eng: ex2t }], nounNotes: nn, nuance };
};

const a = (id: string, s: string, t: string, level: WordLevel, topic: WordTopic, ant: string, antT: string, tip: string, ex1: string, ex1t: string, ex2: string, ex2t: string, nn: string, nuance?: WordNuance): Word => {
  let masc = s; let fem = s; if (s.endsWith('o')) fem = s.slice(0, -1) + 'a';
  const forms = `${masc}, ${fem}, ${pluralize(masc)}, ${pluralize(fem)}`;
  return { id, s, t, level, topic, type: 'adj', category: 'island', ant, antT, grammarTip: tip, forms, examples: [{ txt: ex1, eng: ex1t }, { txt: ex2, eng: ex2t }], nounNotes: nn, nuance };
};

const n = (id: string, s: string, t: string, level: WordLevel, topic: WordTopic, gender: 'm' | 'f', tip: string, ex1: string, ex1t: string, ex2: string, ex2t: string, category?: string): Word => {
  const finalCategory = category || 'island';
  const article = gender === 'm' ? 'El' : 'La'; const pluralArticle = gender === 'm' ? 'Los' : 'Las';
  const forms = `${article} ${s}, ${pluralArticle} ${pluralize(s)}`;
  return { id, s, t, level, topic, type: 'noun', category: finalCategory, forms, grammarTip: `${gender === 'm' ? 'Masc' : 'Fem'}. ${tip}`, examples: [{ txt: ex1, eng: ex1t }, { txt: ex2, eng: ex2t }], nounNotes: '' };
};

const m = (id: string, s: string, t: string, level: WordLevel, topic: WordTopic, tip: string, ex1: string, ex1t: string, ex2: string, ex2t: string, category: string): Word => ({
  id, s, t, level, topic, type: 'misc', category, grammarTip: tip, forms: '', examples: [{ txt: ex1, eng: ex1t }, { txt: ex2, eng: ex2t }], nounNotes: 'Function Word'
});

// --- MAIN VOCABULARY DATA (DAY PACKS) ---
export const VOCABULARY_DATA: DayPack[] = [
  {
    id: 'day1',
    title: 'Welcome to the Island',
    words: [
      v('ser', 'ser', 'To be (Essence)', 'A1', 'grammar', 'Permanent traits/origin.', 'Soy de España.', 'I am from Spain.', 'Eres alto.', 'You are tall.', 'Use for identity.', undefined, false, N_SER_ESTAR),
      v('estar', 'estar', 'To be (State)', 'A1', 'grammar', 'Temporary states/location.', 'Estoy cansado.', 'I am tired.', 'Está en casa.', 'He is at home.', 'Use for location/feeling.', undefined, false, N_SER_ESTAR),
      v('tener', 'tener', 'To have', 'A1', 'grammar', 'Possession/Age.', 'Tengo un gato.', 'I have a cat.', 'Tiene frío.', 'He is cold (has cold).', 'Also used for age.', undefined, false),
      v('hacer', 'hacer', 'To do/make', 'A1', 'work', 'Actions/Weather.', 'Hago la cama.', 'I make the bed.', 'Hace sol.', 'It is sunny.', 'Go-verb (Hago).', undefined, false),
      v('ir', 'ir', 'To go', 'A1', 'travel', 'Movement.', 'Voy a la playa.', 'I go to the beach.', 'Vamos a comer.', 'We are going to eat.', 'Highly irregular.', undefined, false),
      v('poder', 'poder', 'Can/To be able', 'A1', 'grammar', 'Ability.', 'Puedo nadar.', 'I can swim.', 'No puedes pasar.', 'You cannot pass.', 'Stem changer O->UE.', undefined, false),
      v('decir', 'decir', 'To say/tell', 'A1', 'social', 'Communication.', 'Digo la verdad.', 'I tell the truth.', 'Dices hola.', 'You say hello.', 'Go-verb (Digo).', undefined, false),
      v('dar', 'dar', 'To give', 'A1', 'social', 'Offering.', 'Te doy mi mano.', 'I give you my hand.', 'Damos gracias.', 'We give thanks.', 'Irregular Yo form (Doy).', undefined, false),
      v('saber', 'saber', 'To know (Fact)', 'A1', 'grammar', 'Knowledge.', 'Sé cocinar.', 'I know how to cook.', 'Sabes mi nombre.', 'You know my name.', 'Irregular Yo form (Sé).', undefined, false, N_SABER_CONOCER),
      v('querer', 'querer', 'To want', 'A1', 'feelings', 'Desire.', 'Quiero agua.', 'I want water.', 'Te quiero.', 'I love you.', 'Stem changer E->IE.', undefined, false, N_AMAR_QUERER),
      v('ver', 'ver', 'To see', 'A1', 'body', 'Vision.', 'Veo el mar.', 'I see the sea.', 'Vemos la tele.', 'We watch TV.', 'Irregular Yo form (Veo).', undefined, false, N_VER_MIRAR),
      a('grande', 'grande', 'Big', 'A1', 'quantity', 'pequeño', 'Small', 'Size.', 'Casa grande.', 'Big house.', 'Gran hombre.', 'Great man (before noun).', 'Shortens to Gran before singular nouns.'),
      a('bueno', 'bueno', 'Good', 'A1', 'feelings', 'malo', 'Bad', 'Quality.', 'Buen día.', 'Good day.', 'Es bueno.', 'It is good.', 'Shortens to Buen before masc. sing. nouns.'),
      a('nuevo', 'nuevo', 'New', 'A1', 'time', 'viejo', 'Old', 'Freshness.', 'Coche nuevo.', 'New car (brand new).', 'Nuevo coche.', 'New car (to me).', 'Meaning changes with position.'),
      a('alto', 'alto', 'Tall/High', 'A1', 'body', 'bajo', 'Short', 'Height.', 'Edificio alto.', 'Tall building.', 'Música alta.', 'Loud music.', 'Also volume.'),
      a('largo', 'largo', 'Long', 'A1', 'quantity', 'corto', 'Short', 'Length.', 'Pelo largo.', 'Long hair.', 'Viaje largo.', 'Long trip.', 'False friend: Not Large!'),
      a('mucho', 'mucho', 'Much/Many', 'A1', 'quantity', 'poco', 'Little', 'Quantity.', 'Mucho dinero.', 'Much money.', 'Muchas gracias.', 'Many thanks.', 'Agrees in gender/number.'),
      a('mayor', 'mayor', 'Older/Bigger', 'A1', 'social', 'menor', 'Younger', 'Comparison.', 'Hermano mayor.', 'Older brother.', 'Es mayor que yo.', 'He is older than me.', 'Comparative of Grande.'),
      a('mejor', 'mejor', 'Better', 'A1', 'feelings', 'peor', 'Worse', 'Quality.', 'Mi mejor amigo.', 'My best friend.', 'Es mejor así.', 'It is better this way.', 'Comparative of Bueno.'),
      a('abierto', 'abierto', 'Open', 'A1', 'daily', 'cerrado', 'Closed', 'State.', 'Puerta abierta.', 'Open door.', 'Soy abierto.', 'I am open-minded.', 'Past participle of Abrir.')
    ]
  },
  {
    id: 'day2',
    title: 'Island Basics',
    words: [
      v('llegar', 'llegar', 'To arrive', 'A1', 'travel', 'Arrival.', 'Llego a casa.', 'I arrive home.', 'El tren llega.', 'The train arrives.', 'Regular AR.', undefined, true),
      v('creer', 'creer', 'To believe', 'A1', 'abstract', 'Belief.', 'Creo en ti.', 'I believe in you.', 'Creo que sí.', 'I think so.', 'Regular ER.', undefined, true),
      v('dejar', 'dejar', 'To leave/let', 'A1', 'social', 'Permission.', 'Déjame ir.', 'Let me go.', 'Dejo el libro.', 'I leave the book.', 'Regular AR.', undefined, true, N_DEJAR_SALIR),
      v('parecer', 'parecer', 'To seem', 'A1', 'abstract', 'Appearance.', 'Parece bien.', 'It seems good.', 'Me parece.', 'It seems to me.', 'Irregular Yo (Parezco).', undefined, false),
      v('hablar', 'hablar', 'To speak', 'A1', 'social', 'Speech.', 'Hablo español.', 'I speak Spanish.', 'Hablas rápido.', 'You speak fast.', 'Regular AR.', undefined, true),
      n('tiempo', 'tiempo', 'Time/Weather', 'A1', 'time', 'm', 'Duration.', 'Mucho tiempo.', 'Long time.', 'Hace mal tiempo.', 'Bad weather.', 'Double meaning.'),
      n('mujer', 'mujer', 'Woman/Wife', 'A1', 'social', 'f', 'Person.', 'Mujer fuerte.', 'Strong woman.', 'Mi mujer.', 'My wife.', 'Double meaning.'),
      n('hombre', 'hombre', 'Man', 'A1', 'social', 'm', 'Person.', 'Hombre alto.', 'Tall man.', '¡Hombre!', 'Hey man!', 'Also generic mankind.'),
      n('dia', 'día', 'Day', 'A1', 'time', 'm', 'Time unit.', 'Buenos días.', 'Good morning.', 'Todo el día.', 'All day.', 'Masculine ending in A!'),
      n('vida', 'vida', 'Life', 'A1', 'life', 'f', 'Existence.', 'Vida loca.', 'Crazy life.', 'Toda la vida.', 'All life.', 'Essential noun.'),
      n('parte', 'parte', 'Part', 'A1', 'abstract', 'f', 'Fraction.', 'Gran parte.', 'Large part.', 'Parte de mí.', 'Part of me.', 'Common noun.'),
      n('casa', 'casa', 'House/Home', 'A1', 'daily', 'f', 'Dwelling.', 'En casa.', 'At home.', 'Voy a casa.', 'I go home.', 'No article needed for "at home".'),
      n('mundo', 'mundo', 'World', 'A1', 'nature', 'm', 'Place.', 'Hola mundo.', 'Hello world.', 'Todo el mundo.', 'Everyone (All the world).', 'Idiom: Todo el mundo.'),
      n('vez', 'vez', 'Time (Instance)', 'A1', 'time', 'f', 'Occurrence.', 'Una vez.', 'One time.', 'Otra vez.', 'Again (Another time).', 'Plural: Veces.'),
      n('agua', 'agua', 'Water', 'A1', 'nature', 'm', 'Liquid.', 'El agua fría.', 'The cold water.', 'Bebe agua.', 'Drink water.', 'Fem noun, but uses El to avoid sound clash.'),
      n('amigo', 'amigo', 'Friend', 'A1', 'social', 'm', 'Relationship.', 'Mi mejor amigo.', 'My best friend.', 'Hola amigo.', 'Hello friend.', 'Fem: Amiga.'),
      n('verdad', 'verdad', 'Truth', 'A1', 'abstract', 'f', 'Reality.', 'Es verdad.', 'It is true.', 'De verdad.', 'Really.', 'Idiom: De verdad.'),
      n('noche', 'noche', 'Night', 'A1', 'time', 'f', 'Time.', 'Buenas noches.', 'Good evening.', 'De noche.', 'At night.', 'Feminine.'),
      n('cosa', 'cosa', 'Thing', 'A1', 'abstract', 'f', 'Object.', 'Cosas buenas.', 'Good things.', '¿Qué cosa?', 'What thing?', 'Generic object.'),
      n('lugar', 'lugar', 'Place', 'A1', 'travel', 'm', 'Location.', 'En su lugar.', 'In his place.', 'Lugar bonito.', 'Beautiful place.', 'Common noun.')
    ]
  }
];

// --- EXPANSION PACKS: CONTAINER A (THE TOOLKIT) ---
export const EXTRA_CANDIDATES: Word[] = [
  // --- 1. LOGIC I (BASIC CONNECTORS) ---
  m('y', 'y', 'And', 'A1', 'grammar', 'Use "e" if next word starts with i/hi.', 'Tú y yo.', 'You and I.', 'Blanco y negro.', 'Black and white.', 'connector'),
  m('o', 'o', 'Or', 'A1', 'grammar', 'Use "u" if next word starts with o/ho.', 'Agua o vino.', 'Water or wine.', 'Uno o dos.', 'One or two.', 'connector'),
  m('pero', 'pero', 'But', 'A1', 'grammar', 'Soft contrast.', 'Quiero, pero no puedo.', 'I want, but I cannot.', 'Es pequeño pero bueno.', 'It is small but good.', 'connector'),
  m('porque', 'porque', 'Because', 'A1', 'grammar', 'Explains why.', 'Como porque tengo hambre.', 'I eat because I have hunger.', 'Lloro porque duele.', 'I cry because it hurts.', 'connector'),
  m('si_cond', 'si', 'If', 'A1', 'grammar', 'No accent mark = If.', 'Si puedes, ven.', 'If you can, come.', 'Si llueve, no voy.', 'If it rains, I don\'t go.', 'connector'),
  m('tambien', 'también', 'Also/Too', 'A1', 'grammar', 'Agreement (Positive).', 'Yo también.', 'Me too.', 'Voy también.', 'I go also.', 'connector'),
  m('tampoco', 'tampoco', 'Neither', 'A1', 'grammar', 'Agreement (Negative).', 'Yo tampoco.', 'Me neither.', 'No como tampoco.', 'I don\'t eat either.', 'connector'),
  
  // --- 2. LOGIC II (ADVANCED LINKING) ---
  m('aunque', 'aunque', 'Although', 'A2', 'grammar', 'Contrast.', 'Aunque llueva, voy.', 'Although it rains, I go.', 'Es caro, aunque bueno.', 'It is expensive, although good.', 'connector'),
  m('sin_embargo', 'sin embargo', 'However', 'B1', 'grammar', 'Formal contrast.', 'Es difícil; sin embargo, posible.', 'It is hard; however, possible.', 'No vino, sin embargo.', 'He didn\'t come, however.', 'connector'),
  m('entonces', 'entonces', 'So/Then', 'A1', 'time', 'Consequence.', 'Pienso, entonces existo.', 'I think, therefore I exist.', '¿Entonces qué?', 'So what?', 'connector'),
  m('por_eso', 'por eso', 'That\'s why', 'A1', 'grammar', 'Reason.', 'Estoy enfermo, por eso no voy.', 'I am sick, that is why I don\'t go.', 'Es tarde, por eso corro.', 'It is late, that is why I run.', 'connector'),
  m('mientras', 'mientras', 'While', 'A2', 'time', 'Simultaneous.', 'Leo mientras como.', 'I read while I eat.', 'Mientras tú duermes.', 'While you sleep.', 'connector'),
  m('o_sea', 'o sea', 'In other words', 'B1', 'grammar', 'Clarification.', 'No vino, o sea, se olvidó.', 'He didn\'t come, I mean, he forgot.', '', '', 'connector'),
  
  // --- 3. THE DETECTIVE (INTERROGATIVES) ---
  m('que_q', 'qué', 'What', 'A1', 'grammar', 'Accent mark is crucial.', '¿Qué es esto?', 'What is this?', '¿Qué pasa?', 'What is happening?', 'interrogative'),
  m('quien', 'quién', 'Who', 'A1', 'grammar', 'For people.', '¿Quién es él?', 'Who is he?', '¿Quién llama?', 'Who calls?', 'interrogative'),
  m('cuando', 'cuándo', 'When', 'A1', 'time', 'Time.', '¿Cuándo vamos?', 'When do we go?', '¿Cuándo es?', 'When is it?', 'interrogative'),
  m('donde', 'dónde', 'Where', 'A1', 'travel', 'Location.', '¿Dónde estás?', 'Where are you?', '¿Dónde vives?', 'Where do you live?', 'interrogative'),
  m('por_que', 'por qué', 'Why', 'A1', 'grammar', 'Two words + Accent.', '¿Por qué lloras?', 'Why do you cry?', '¿Por qué no?', 'Why not?', 'interrogative'),
  m('como', 'cómo', 'How', 'A1', 'grammar', 'Manner.', '¿Cómo estás?', 'How are you?', '¿Cómo te llamas?', 'What (How) is your name?', 'interrogative'),
  m('cuanto', 'cuánto', 'How much', 'A1', 'quantity', 'Amount.', '¿Cuánto cuesta?', 'How much does it cost?', '¿Cuánto tiempo?', 'How much time?', 'interrogative'),
  m('cual', 'cuál', 'Which', 'A1', 'grammar', 'Choice.', '¿Cuál quieres?', 'Which one do you want?', 'Which is your name?', 'Which is your name?', 'interrogative'),

  // --- 4. THE COUNTER I (0-10) ---
  m('cero', 'cero', 'Zero', 'A1', 'quantity', '0', 'Tengo cero.', 'I have zero.', 'Número cero.', 'Number zero.', 'quantity'),
  m('uno', 'uno', 'One', 'A1', 'quantity', '1. Becomes "Un" before masc noun.', 'Un gato.', 'One cat.', 'Número uno.', 'Number one.', 'quantity'),
  m('dos', 'dos', 'Two', 'A1', 'quantity', '2', 'Dos manos.', 'Two hands.', 'Son las dos.', 'It is two o\'clock.', 'quantity'),
  m('tres', 'tres', 'Three', 'A1', 'quantity', '3', 'Tres deseos.', 'Three wishes.', 'Son las tres.', 'It is three o\'clock.', 'quantity'),
  m('cuatro', 'cuatro', 'Four', 'A1', 'quantity', '4', 'Cuatro patas.', 'Four legs.', 'Cuatro estaciones.', 'Four seasons.', 'quantity'),
  m('cinco', 'cinco', 'Five', 'A1', 'quantity', '5', 'Cinco dedos.', 'Five fingers.', 'Dame cinco.', 'Give me five.', 'quantity'),
  m('seis', 'seis', 'Six', 'A1', 'quantity', '6', 'Seis meses.', 'Six months.', 'A las seis.', 'At six.', 'quantity'),
  m('siete', 'siete', 'Seven', 'A1', 'quantity', '7', 'Siete días.', 'Seven days.', 'Siete mares.', 'Seven seas.', 'quantity'),
  m('ocho', 'ocho', 'Eight', 'A1', 'quantity', '8', 'Ocho horas.', 'Eight hours.', 'A las ocho.', 'At eight.', 'quantity'),
  m('nueve', 'nueve', 'Nine', 'A1', 'quantity', '9', 'Nueve vidas.', 'Nine lives.', 'Nueve meses.', 'Nine months.', 'quantity'),
  m('diez', 'diez', 'Ten', 'A1', 'quantity', '10', 'Diez puntos.', 'Ten points.', 'Top diez.', 'Top ten.', 'quantity'),
  n('numero', 'número', 'Number', 'A1', 'quantity', 'm', 'Generic term.', '¿Qué número?', 'What number?', 'Número de teléfono.', 'Phone number.', 'quantity'),

  // --- 5. THE COUNTER II (11-100 & MONEY) ---
  m('once', 'once', 'Eleven', 'A1', 'quantity', '11', 'Once jugadores.', 'Eleven players.', 'Once jugadores.', 'Eleven players.', 'quantity'),
  m('doce', 'doce', 'Twelve', 'A1', 'quantity', '12', 'Doce meses.', 'Twelve months.', 'A las doce.', 'At twelve.', 'quantity'),
  m('veinte', 'veinte', 'Twenty', 'A1', 'quantity', '20', 'Veinte años.', 'Twenty years.', 'Veinte euros.', 'Twenty euros.', 'quantity'),
  m('treinta', 'treinta', 'Thirty', 'A1', 'quantity', '30', 'Treinta días.', 'Thirty days.', 'Más de treinta.', 'More than thirty.', 'quantity'),
  m('cincuenta', 'cincuenta', 'Fifty', 'A1', 'quantity', '50', 'Cincuenta por ciento.', 'Fifty percent.', 'Cincuenta sombras.', 'Fifty shades.', 'quantity'),
  m('cien', 'cien', 'One Hundred', 'A1', 'quantity', '100. "Ciento" if >100.', 'Cien años.', 'One hundred years.', 'Cien veces.', 'One hundred times.', 'quantity'),
  m('mil', 'mil', 'One Thousand', 'A1', 'quantity', '1000', 'Mil gracias.', 'A thousand thanks.', 'Dos mil.', 'Two thousand.', 'quantity'),
  n('millon', 'millón', 'Million', 'A1', 'quantity', 'm', 'Needs "de" (Millón de...).', 'Un millón de amigos.', 'A million friends.', 'Un millón.', 'One million.', 'quantity'),
  n('euro', 'euro', 'Euro', 'A1', 'work', 'm', 'Currency.', 'Cinco euros.', 'Five euros.', 'Pagar en euros.', 'Pay in euros.', 'quantity'),
  n('dolar', 'dólar', 'Dollar', 'A1', 'work', 'm', 'Currency.', 'Un dólar.', 'One dollar.', 'Muchos dólares.', 'Many dollars.', 'quantity'),
  
  // --- 6. THE COUNTER III (MATH & QUANTITY) ---
  m('mas', 'más', 'More/Plus', 'A1', 'quantity', 'Addition.', 'Más o menos.', 'More or less.', 'Uno más uno.', 'One plus one.', 'quantity'),
  m('menos', 'menos', 'Less/Minus', 'A1', 'quantity', 'Subtraction.', 'Menos mal.', 'Thank goodness (Less bad).', 'Cinco menos dos.', 'Five minus two.', 'quantity'),
  n('mitad', 'mitad', 'Half', 'A1', 'quantity', 'f', 'Fraction.', 'La mitad.', 'The half.', 'Mitad y mitad.', 'Half and half.', 'quantity'),
  n('par', 'par', 'Pair/Couple', 'A1', 'quantity', 'm', 'Two of something.', 'Un par de zapatos.', 'A pair of shoes.', 'Somos un par.', 'We are a couple.', 'quantity'),
  n('precio', 'precio', 'Price', 'A1', 'work', 'm', 'Cost.', 'Buen precio.', 'Good price.', '¿Qué precio?', 'What price?', 'quantity'),
  n('cuenta', 'cuenta', 'Bill/Account', 'A1', 'work', 'f', 'Payment.', 'La cuenta, por favor.', 'The bill, please.', 'Cuenta bancaria.', 'Bank account.', 'quantity'),
  n('total', 'total', 'Total', 'A1', 'quantity', 'm', 'Sum.', 'El total es...', 'The total is...', 'En total.', 'In total.', 'quantity'),
  m('demasiado', 'demasiado', 'Too much', 'A2', 'quantity', 'Excess.', 'Demasiado calor.', 'Too much heat.', 'Hablas demasiado.', 'You talk too much.', 'quantity'),
  m('bastante', 'bastante', 'Enough/Quite', 'A2', 'quantity', 'Sufficient.', 'Es bastante.', 'It is enough.', 'Bastante bien.', 'Quite good.', 'quantity'),

  // --- 7. NAVIGATOR I (STATIC LOCATION) ---
  m('en', 'en', 'In/On', 'A1', 'travel', 'General location.', 'En casa.', 'At home.', 'En la mesa.', 'On the table.', 'preposition'),
  m('sobre', 'sobre', 'On/Over', 'A2', 'travel', 'Surface.', 'Sobre la mesa.', 'On the table.', 'Sobre todo.', 'Above all.', 'preposition'),
  m('bajo', 'bajo', 'Under', 'A2', 'travel', 'Beneath.', 'Bajo el sol.', 'Under the sun.', 'Bajo control.', 'Under control.', 'preposition'),
  m('dentro', 'dentro', 'Inside', 'A2', 'travel', 'Interior.', 'Dentro de la caja.', 'Inside the box.', 'Hay algo dentro.', 'There is something inside.', 'preposition'),
  m('fuera', 'fuera', 'Outside', 'A2', 'travel', 'Exterior.', 'Fuera de casa.', 'Outside the house.', '¡Fuera!', 'Get out!', 'preposition'),
  m('aqui', 'aquí', 'Here', 'A1', 'travel', 'This place.', 'Estoy aquí.', 'I am here.', 'Ven aquí.', 'Come here.', 'preposition'),
  m('alli', 'allí', 'There', 'A1', 'travel', 'That place.', 'Está allí.', 'It is there.', 'Mira allí.', 'Look there.', 'preposition'),
  n('lado', 'lado', 'Side', 'A1', 'travel', 'm', 'Position.', 'Al otro lado.', 'On the other side.', 'A mi lado.', 'By my side.', 'preposition'),
  n('centro', 'centro', 'Center', 'A1', 'travel', 'm', 'Middle.', 'En el centro.', 'In the center.', 'Centro de la ciudad.', 'City center.', 'preposition'),
  
  // --- 8. NAVIGATOR II (MOVEMENT & DIRECTION) ---
  m('a', 'a', 'To/At', 'A1', 'travel', 'Direction.', 'Voy a casa.', 'I go home.', 'A las tres.', 'At three.', 'preposition'),
  m('de', 'de', 'Of/From', 'A1', 'travel', 'Origin/Possession.', 'Soy de España.', 'I am from Spain.', 'Libro de Ana.', 'Ana\'s book.', 'preposition'),
  m('desde', 'desde', 'Since/From', 'A2', 'time', 'Start point.', 'Desde ayer.', 'Since yesterday.', 'Desde aquí.', 'From here.', 'preposition'),
  m('hasta', 'hasta', 'Until', 'A1', 'time', 'End point.', 'Hasta mañana.', 'Until tomorrow.', 'Hasta el fin.', 'Until the end.', 'preposition'),
  m('hacia', 'hacia', 'Towards', 'A2', 'travel', 'Direction.', 'Voy hacia el sol.', 'I go towards the sun.', 'Mirar hacia atrás.', 'Look back.', 'preposition'),
  m('por', 'por', 'By/Through', 'A1', 'travel', 'Transit/Cause.', 'Por la calle.', 'Through the street.', 'Por favor.', 'Please (By favor).', 'preposition'),
  m('para', 'para', 'For/To', 'A1', 'travel', 'Goal/Recipient.', 'Para ti.', 'For you.', 'Para comer.', 'In order to eat.', 'preposition'),
  m('entre', 'entre', 'Between', 'A2', 'travel', 'Middle.', 'Entre tú y yo.', 'Between you and me.', 'Entre dos aguas.', 'Between two waters.', 'preposition'),
  n('direccion', 'dirección', 'Direction/Address', 'A2', 'travel', 'f', 'Path.', 'Buena dirección.', 'Good direction.', 'Mi dirección.', 'My address.', 'preposition'),

  // --- 9. IDENTITY (PRONOUNS & BASICS) ---
  m('yo', 'yo', 'I', 'A1', 'social', 'Subject.', 'Yo soy.', 'I am.', 'Yo voy.', 'I go.', 'island'),
  m('tu', 'tú', 'You', 'A1', 'social', 'Subject (Informal).', 'Tú eres.', 'You are.', 'Para ti.', 'For you.', 'island'),
  m('el_pron', 'él', 'He', 'A1', 'social', 'Subject.', 'Él come.', 'He eats.', 'Con él.', 'With him.', 'island'),
  m('ella', 'ella', 'She', 'A1', 'social', 'Subject.', 'Ella canta.', 'She sings.', 'A ella.', 'To her.', 'island'),
  m('nosotros', 'nosotros', 'We', 'A1', 'social', 'Subject.', 'Nosotros vamos.', 'We go.', 'Para nosotros.', 'For us.', 'island'),
  m('ellos', 'ellos', 'They', 'A1', 'social', 'Subject.', 'Ellos son.', 'They are.', 'Con ellos.', 'With them.', 'island'),
  m('mio', 'mío', 'Mine', 'A2', 'social', 'Possessive.', 'Es mío.', 'It is mine.', 'El mío.', 'The mine (one).', 'island'),
  m('tuyo', 'tuyo', 'Yours', 'A2', 'social', 'Possessive.', 'Es tuyo.', 'It is yours.', 'El tuyo.', 'The yours (one).', 'island'),
  n('nombre', 'nombre', 'Name', 'A1', 'social', 'm', 'Identity.', 'Mi nombre es.', 'My name is.', 'Buen nombre.', 'Good name.', 'island')
];

// --- ISLAND SLANG (Fun Bonus Content) ---
export const ISLAND_SLANG = [
  // 🟢 Daily Life
  { s: "¡Qué guay!", t: "How cool!", note: "Spain. Like 'Awesome!'." },
  { s: "¡Vale!", t: "Okay!", note: "Spain's favorite word. Agreed/Understood." },
  { s: "¡No manches!", t: "No way!", note: "Mexican slang. Surprise/Disbelief." },
  { s: "¡Chévere!", t: "Cool/Great!", note: "Caribbean/South American vibes." },
  { s: "¡Pura Vida!", t: "Pure Life!", note: "Costa Rican philosophy. All good." },
  { s: "¡Aguas!", t: "Watch out!", note: "Mexican warning. Lit: 'Waters!'." },
  { s: "Tío / Tía", t: "Dude/Mate", note: "Spain. Lit: Uncle/Aunt." },
  { s: "Chamba", t: "Work/Gig", note: "Latin America. 'Tengo mucha chamba'." },
  { s: "Resaca", t: "Hangover", note: "The morning after the fiesta." },
  { s: "Buena onda", t: "Good vibes", note: "Cool person/atmosphere. Ant: Mala onda." },
  { s: "Me importa un pepino", t: "I don't give a damn", note: "Lit: I care a cucumber." },
  { s: "Estar sin blanca", t: "To be broke", note: "Lit: To be without white coin." },
  { s: "¡Ojo!", t: "Watch out!", note: "Lit: Eye! Pay attention." },
  { s: "¡Che, boludo!", t: "Hey, buddy/fool!", note: "Argentina. Context is key!" },
  { s: "Flipante", t: "Mind-blowing", note: "Spain. Amazing or shocking." },
  
  // 🌶️ Spicy / Vulgar
  { s: "Joder", t: "F*ck / Damn", note: "Spain. Very common. Spicy!", spicy: true },
  { s: "Mierda", t: "Sh*t", note: "Universal expression of frustration. Spicy!", spicy: true },
  { s: "Coño", t: "Damn it", note: "Spain. Lit: Anatomy. High freq. Spicy!", spicy: true },
  { s: "Hostia", t: "Holy cow!", note: "Spain. Lit: Host. Surprise/Anger. Spicy!", spicy: true },
  { s: "Cabrón", t: "Bastard / Badass", note: "Insult or praise depending on tone. Spicy!", spicy: true },
  { s: "Pinche", t: "F*cking / Damn", note: "Mexico. Adj: Pinche tráfico. Spicy!", spicy: true },
  { s: "Pendejo", t: "Idiot / Asshole", note: "Latin America. Very offensive. Spicy!", spicy: true },
  { s: "Gilipollas", t: "Douchebag", note: "Spain. Very common insult. Spicy!", spicy: true },
  { s: "Carajo", t: "Hell / Damn", note: "Vete al carajo = Go to hell. Spicy!", spicy: true },
  { s: "Verga", t: "Sh*t / Damn", note: "Mexico/Venezuela. Very vulgar. Spicy!", spicy: true },
  { s: "Puta", t: "B*tch / Whore", note: "Also intensifier: Puta vida. Spicy!", spicy: true },
  { s: "De puta madre", t: "Awesome / Great", note: "Spain. Vulgar but positive! Spicy!", spicy: true },
  { s: "Hijo de puta", t: "Son of a b*tch", note: "High offense. Spicy!", spicy: true },
  { s: "Cagarla", t: "To screw up", note: "Lit: To sh*t it. Spicy!", spicy: true },
  { s: "No me jodas", t: "You gotta be kidding", note: "Lit: Don't f*ck me. Disbelief.", spicy: true }
];
