
import { Word } from './types';

export const SRS_INTERVALS = [0, 1, 3, 7, 14, 30, 90, 180];
export const TODAY_SIMULATED = '2026-02-05';

// Helper to generate regular conjugations
const generateRegularForms = (verb: string): string => {
  let root = verb.slice(0, -2);
  let type = verb.slice(-2);
  let prefix = ['', '', '', '', '', ''];

  // Handle Reflexive (e.g., lavarse, ducharse)
  if (verb.endsWith('se')) {
    const infinitive = verb.slice(0, -2); // lavarse -> lavar
    root = infinitive.slice(0, -2); // lavar -> lav
    type = infinitive.slice(-2); // lavar -> ar
    prefix = ['me ', 'te ', 'se ', 'nos ', 'os ', 'se '];
  }

  if (type === 'ar') {
    return `${prefix[0]}${root}o, ${prefix[1]}${root}as, ${prefix[2]}${root}a, ${prefix[3]}${root}amos, ${prefix[4]}${root}áis, ${prefix[5]}${root}an`;
  }
  if (type === 'er') {
    return `${prefix[0]}${root}o, ${prefix[1]}${root}es, ${prefix[2]}${root}e, ${prefix[3]}${root}emos, ${prefix[4]}${root}éis, ${prefix[5]}${root}en`;
  }
  if (type === 'ir') {
    return `${prefix[0]}${root}o, ${prefix[1]}${root}es, ${prefix[2]}${root}e, ${prefix[3]}${root}imos, ${prefix[4]}${root}ís, ${prefix[5]}${root}en`;
  }
  return '';
};

// Helper to simple pluralize Spanish words
const pluralize = (word: string): string => {
  if (/[aeiouáéíóú]$/i.test(word)) return word + 's';
  if (word.endsWith('z')) return word.slice(0, -1) + 'ces';
  return word + 'es';
};

// Helper to create Verb (English) - Default Category: 'island'
const v = (id: string, s: string, t: string, tip: string, ex1: string, ex1t: string, ex2: string, ex2t: string, nn: string, forms: string = '', reg: boolean = true): Word => {
  let computedForms = forms;
  if (reg && !computedForms) {
    computedForms = generateRegularForms(s);
  }
  
  return {
    id, s, t, type: 'verb', category: 'island', reg, forms: computedForms, grammarTip: tip,
    examples: [{ txt: ex1, eng: ex1t }, { txt: ex2, eng: ex2t }], nounNotes: nn
  };
};

// Helper to create Adjective (English) - Default Category: 'island'
const a = (id: string, s: string, t: string, ant: string, antT: string, tip: string, ex1: string, ex1t: string, ex2: string, ex2t: string, nn: string): Word => {
  let masc = s;
  let fem = s;
  if (s.endsWith('o')) {
    fem = s.slice(0, -1) + 'a';
  }
  const mascPl = pluralize(masc);
  const femPl = pluralize(fem);
  const forms = `${masc}, ${fem}, ${mascPl}, ${femPl}`;

  return {
    id, s, t, type: 'adj', category: 'island', ant, antT, grammarTip: tip, forms,
    examples: [{ txt: ex1, eng: ex1t }, { txt: ex2, eng: ex2t }], nounNotes: nn
  };
};

// Helper to create Noun (English) - Default Category: 'island'
const n = (id: string, s: string, t: string, gender: 'm' | 'f', tip: string, ex1: string, ex1t: string, ex2: string, ex2t: string, nn: string): Word => {
  const article = gender === 'm' ? 'El' : 'La';
  const pluralArticle = gender === 'm' ? 'Los' : 'Las';
  const plural = pluralize(s);
  const forms = `${article} ${s}, ${pluralArticle} ${plural}`;

  return {
    id, s, t, type: 'noun', category: 'island', forms, grammarTip: `${gender === 'm' ? 'Masculine' : 'Feminine'}. ${tip}`,
    examples: [{ txt: ex1, eng: ex1t }, { txt: ex2, eng: ex2t }], nounNotes: nn
  };
};

// Helper for Misc/Function words (No conjugation tables, Golden Rules) - REQUIRES CATEGORY
const m = (id: string, s: string, t: string, tip: string, ex1: string, ex1t: string, ex2: string, ex2t: string, category: string): Word => ({
  id, s, t, type: 'misc', category, grammarTip: tip, forms: '',
  examples: [{ txt: ex1, eng: ex1t }, { txt: ex2, eng: ex2t }], nounNotes: 'Function Word'
});

export const EXTRA_CANDIDATES: Word[] = [
  // --- The Glue (Connectors) ---
  m('y', 'y', 'And', 'Change "y" to "e" if the next word starts with "i-" or "hi-" (e.g., madre e hija).', 'Tú y yo.', 'You and I.', 'Pan y agua.', 'Bread and water.', 'connector'),
  m('o', 'o', 'Or', 'Change "o" to "u" if the next word starts with "o-" or "ho-" (e.g., siete u ocho).', '¿Té o café?', 'Tea or coffee?', 'Blanco o negro.', 'White or black.', 'connector'),
  m('pero', 'pero', 'But', 'Use to contrast ideas. If the first part is negative and you correct it, use "Sino" instead.', 'Pobre pero feliz.', 'Poor but happy.', 'Es tarde pero voy.', 'It is late but I go.', 'connector'),
  m('porque', 'porque', 'Because', 'Note: "Por qué" = Why? "Porque" = Because. "El porqué" = The reason.', 'Como porque tengo hambre.', 'I eat because I am hungry.', 'Lloro porque duele.', 'I cry because it hurts.', 'connector'),
  m('si', 'si', 'If', 'No accent mark! "Sí" (with accent) means Yes.', 'Si puedes, ven.', 'If you can, come.', 'Si llueve, no voy.', 'If it rains, I do not go.', 'connector'),
  m('que', 'que', 'That / Than', 'The most common connector. Used for relative clauses and comparisons.', 'El libro que leo.', 'The book that I read.', 'Más alto que tú.', 'Taller than you.', 'connector'),
  m('cuando', 'cuando', 'When', 'No accent. Use subjunctive if referring to the future.', 'Cuando llegues.', 'When you arrive.', 'Cuando como.', 'When I eat.', 'connector'),
  m('como', 'como', 'Like / As', 'Used for comparisons or "In the capacity of".', 'Fuerte como un toro.', 'Strong as a bull.', 'Trabajo como chef.', 'I work as a chef.', 'connector'),
  m('aunque', 'aunque', 'Although / Even if', 'Use subjunctive if the fact is hypothetical.', 'Aunque llueva.', 'Even if it rains.', 'Aunque es tarde.', 'Although it is late.', 'connector'),
  m('mientras', 'mientras', 'While', 'Two actions happening at the same time.', 'Leo mientras como.', 'I read while I eat.', 'Mientras tanto.', 'Meanwhile.', 'connector'),
  m('pues', 'pues', 'Well / Since', 'Common filler word or cause connector.', 'Pues... no sé.', 'Well... I do not know.', 'Hazlo, pues puedes.', 'Do it, since you can.', 'connector'),
  m('ni', 'ni', 'Nor / Neither', 'Used in negatives. "Ni esto ni aquello" (Neither this nor that).', 'Ni agua ni pan.', 'Neither water nor bread.', 'No tengo ni idea.', 'I have no idea.', 'connector'),
  m('tambien', 'también', 'Also / Too', 'Used for agreement in positive sentences.', 'Yo también.', 'Me too.', 'Ella viene también.', 'She comes also.', 'connector'),
  m('tampoco', 'tampoco', 'Neither', 'Used for agreement in negative sentences.', 'Yo tampoco.', 'Me neither.', 'No voy tampoco.', 'I am not going either.', 'connector'),
  m('ademas', 'además', 'Besides / Furthermore', 'Adds information.', 'Además, es barato.', 'Besides, it is cheap.', 'Además de eso.', 'Besides that.', 'connector'),
  m('asi', 'así', 'Like this / So', 'Manner or consequence.', 'Hazlo así.', 'Do it like this.', 'Es así.', 'It is like that.', 'connector'),
  m('entonces', 'entonces', 'Then / So', 'Sequence or consequence.', 'Y entonces se fue.', 'And then he left.', '¿Entonces qué?', 'So what?', 'connector'),
  m('luego', 'luego', 'Later / Then', 'Time sequence.', 'Hasta luego.', 'See you later.', 'Primero como, luego duermo.', 'First I eat, then I sleep.', 'connector'),
  m('sino', 'sino', 'But rather', 'Used after a negative to offer the correct alternative.', 'No es rojo, sino azul.', 'It is not red, but blue.', 'No hablo, sino escucho.', 'I do not speak, but listen.', 'connector'),
  m('donde', 'donde', 'Where', 'Relative pronoun (no accent). Place.', 'La casa donde vivo.', 'The house where I live.', 'Donde quieras.', 'Wherever you want.', 'connector'),

  // --- Time Machine (Time Adverbs) ---
  m('ahora', 'ahora', 'Now', 'Right this moment.', 'Hazlo ahora.', 'Do it now.', 'Ahora o nunca.', 'Now or never.', 'time'),
  m('hoy', 'hoy', 'Today', 'Current day.', 'Hoy es lunes.', 'Today is Monday.', 'Te veo hoy.', 'See you today.', 'time'),
  m('ayer', 'ayer', 'Yesterday', 'Day before today.', 'Ayer llovió.', 'Yesterday it rained.', 'Como ayer.', 'Like yesterday.', 'time'),
  m('manana', 'mañana', 'Tomorrow / Morning', 'Context matters! "La mañana" = Morning. "Mañana" = Tomorrow.', 'Hasta mañana.', 'Until tomorrow.', 'Por la mañana.', 'In the morning.', 'time'),
  m('siempre', 'siempre', 'Always', 'At all times.', 'Siempre te amaré.', 'I will always love you.', 'Siempre tarde.', 'Always late.', 'time'),
  m('nunca', 'nunca', 'Never', 'At no time. Can go before verb or after (with "No").', 'Nunca digas nunca.', 'Never say never.', 'No voy nunca.', 'I never go.', 'time'),
  m('ya', 'ya', 'Already / Now', 'Tricky! Past="Already". Present="Now!". Negative="No longer".', '¡Ya voy!', 'I am coming now!', 'Ya comí.', 'I already ate.', 'time'),
  m('todavia', 'todavía', 'Still / Yet', 'Continues to be.', 'Todavía estoy aquí.', 'I am still here.', 'No, todavía no.', 'No, not yet.', 'time'),
  m('antes', 'antes', 'Before', 'Prior time.', 'Antes de comer.', 'Before eating.', 'Mucho antes.', 'Long before.', 'time'),
  m('despues', 'después', 'After', 'Later time.', 'Después de ti.', 'After you.', 'Poco después.', 'Shortly after.', 'time'),
  m('pronto', 'pronto', 'Soon', 'In short time.', 'Hasta pronto.', 'See you soon.', 'Ven pronto.', 'Come soon.', 'time'),
  m('tarde', 'tarde', 'Late', 'Delayed.', 'Es muy tarde.', 'It is very late.', 'Más vale tarde.', 'Better late.', 'time'),
  m('temprano', 'temprano', 'Early', 'Ahead of time.', 'Levantarse temprano.', 'Get up early.', 'Es temprano.', 'It is early.', 'time'),
  m('anoche', 'anoche', 'Last night', 'Night before.', 'Salí anoche.', 'I went out last night.', 'Dormí bien anoche.', 'I slept well last night.', 'time'),
  m('jamass', 'jamás', 'Never (Emphatic)', 'Stronger than "Nunca".', '¡Jamás!', 'Never ever!', 'Te olvidaré jamás.', 'I will never forget you.', 'time'),
  m('a_veces', 'a veces', 'Sometimes', 'Occasional.', 'A veces lloro.', 'Sometimes I cry.', 'A veces sí.', 'Sometimes yes.', 'time'),
  m('mientras_tanto', 'mientras tanto', 'Meanwhile', 'During the interval.', 'Espera mientras tanto.', 'Wait meanwhile.', 'Y mientras tanto...', 'And meanwhile...', 'time'),
  m('luego_connect', 'luego', 'Later', 'Afterwards.', 'Nos vemos luego.', 'See you later.', 'Luego te llamo.', 'I call you later.', 'time'),
  m('aun', 'aún', 'Still', 'Synonym of Todavía when accented.', 'Aún no.', 'Not yet.', 'Aún te quiero.', 'I still love you.', 'time'),
  m('anteayer', 'anteayer', 'Day before yesterday', 'Two days ago.', 'Llegué anteayer.', 'I arrived the day before yesterday.', 'Lo vi anteayer.', 'I saw him day before yesterday.', 'time'),

  // --- Navigators (Prepositions) ---
  m('en', 'en', 'In / On / At', 'Use for location (static) or transport.', 'En casa.', 'At home.', 'En tren.', 'By train.', 'preposition'),
  m('con', 'con', 'With', 'Accompaniment. Special forms: Conmigo (With me), Contigo (With you).', 'Café con leche.', 'Coffee with milk.', 'Ven conmigo.', 'Come with me.', 'preposition'),
  m('sin', 'sin', 'Without', 'Absence.', 'Agua sin gas.', 'Still water (Without gas).', 'Sin ti.', 'Without you.', 'preposition'),
  m('de', 'de', 'Of / From', 'Origin or Possession. "De el" becomes "Del".', 'Soy de España.', 'I am from Spain.', 'El coche de Ana.', 'Ana\'s car.', 'preposition'),
  m('a', 'a', 'To / At', 'Direction or Time. "A el" becomes "Al". *Personal A*: Use before people objects.', 'Voy a casa.', 'I go home.', 'Veo a Juan.', 'I see Juan.', 'preposition'),
  m('por', 'por', 'For / By / Through', 'Cause, Agent, or Travel through. "Gracias por..."', 'Por favor.', 'Please.', 'Escrito por mí.', 'Written by me.', 'preposition'),
  m('para', 'para', 'For / To', 'Purpose, Destination, or Recipient.', 'Para ti.', 'For you.', 'Estudio para aprender.', 'I study to learn.', 'preposition'),
  m('sobre', 'sobre', 'On / About', 'Location or Topic.', 'Sobre la mesa.', 'On the table.', 'Hablar sobre amor.', 'Talk about love.', 'preposition'),
  m('entre', 'entre', 'Between / Among', 'Position.', 'Entre tú y yo.', 'Between you and me.', 'Entre nosotros.', 'Among us.', 'preposition'),
  m('hasta', 'hasta', 'Until', 'Limit of time or space.', 'Hasta mañana.', 'Until tomorrow.', 'Hasta el final.', 'Until the end.', 'preposition'),
  m('desde', 'desde', 'Since / From', 'Starting point.', 'Desde ayer.', 'Since yesterday.', 'Desde aquí.', 'From here.', 'preposition'),
  m('hacia', 'hacia', 'Towards', 'Direction.', 'Hacia el mar.', 'Towards the sea.', 'Mira hacia arriba.', 'Look up (towards up).', 'preposition'),
  m('contra', 'contra', 'Against', 'Opposition.', 'Contra la pared.', 'Against the wall.', 'Tú contra mí.', 'You against me.', 'preposition'),
  m('bajo', 'bajo', 'Under', 'Location.', 'Bajo el agua.', 'Under the water.', 'Bajo control.', 'Under control.', 'preposition'),
  m('ante', 'ante', 'Before / In face of', 'Presence.', 'Ante el juez.', 'Before the judge.', 'Ante todo.', 'First of all.', 'preposition'),
  m('tras', 'tras', 'After / Behind', 'Sequence.', 'Tras la tormenta.', 'After the storm.', 'Día tras día.', 'Day after day.', 'preposition'),
  m('durante', 'durante', 'During', 'Duration.', 'Durante la noche.', 'During the night.', 'Durante el día.', 'During the day.', 'preposition'),
  m('segun', 'según', 'According to', 'Reference.', 'Según él.', 'According to him.', 'Según la ley.', 'According to the law.', 'preposition'),
  m('cerca', 'cerca', 'Near', 'Proximity. Usually "Cerca de".', 'Cerca de casa.', 'Near home.', 'Muy cerca.', 'Very close.', 'preposition'),
  m('lejos', 'lejos', 'Far', 'Distance. Usually "Lejos de".', 'Lejos de aquí.', 'Far from here.', 'Tan lejos.', 'So far.', 'preposition'),

  // --- The Quantifiers (Amount) ---
  m('muy', 'muy', 'Very', 'Use before Adjectives/Adverbs only. NEVER use alone.', 'Muy bien.', 'Very good.', 'Muy rápido.', 'Very fast.', 'quantity'),
  m('mucho', 'mucho', 'Much / A lot', 'Use with Nouns (matches gender/number) or Verbs.', 'Mucho dinero.', 'A lot of money.', 'Te quiero mucho.', 'I love you a lot.', 'quantity'),
  m('poco', 'poco', 'Little / Few', 'Small quantity.', 'Poco tiempo.', 'Little time.', 'Habla poco.', 'He speaks little.', 'quantity'),
  m('todo', 'todo', 'All / Everything', 'Totality.', 'Todo el día.', 'All day.', 'Gracias por todo.', 'Thanks for everything.', 'quantity'),
  m('nada', 'nada', 'Nothing / Anything', 'Absence. Double negative rule applies.', 'No quiero nada.', 'I do not want anything.', 'Nada es gratis.', 'Nothing is free.', 'quantity'),
  m('algo', 'algo', 'Something', 'Indefinite.', 'Quiero algo.', 'I want something.', 'Algo es algo.', 'Better than nothing.', 'quantity'),
  m('bastante', 'bastante', 'Enough / Quite', 'Sufficient.', 'Bastante bien.', 'Quite well.', 'Tengo bastante.', 'I have enough.', 'quantity'),
  m('demasiado', 'demasiado', 'Too / Too much', 'Excess.', 'Demasiado caro.', 'Too expensive.', 'Hablas demasiado.', 'You talk too much.', 'quantity'),
  m('mas', 'más', 'More', 'Addition.', 'Más o menos.', 'More or less.', 'Quiero más.', 'I want more.', 'quantity'),
  m('menos', 'menos', 'Less', 'Subtraction.', 'Menos mal.', 'Thank goodness (Less bad).', 'Más o menos.', 'More or less.', 'quantity'),
  m('tan', 'tan', 'So', 'Used with adjectives/adverbs. "Tan... como" (As... as).', 'Tan bonito.', 'So pretty.', 'Tan alto como tú.', 'As tall as you.', 'quantity'),
  m('tanto', 'tanto', 'So much', 'Used with nouns/verbs.', 'Tanto tiempo.', 'So much time.', 'Te quiero tanto.', 'I love you so much.', 'quantity'),
  m('casi', 'casi', 'Almost', 'Proximity.', 'Casi gano.', 'I almost won.', 'Casi nunca.', 'Almost never.', 'quantity'),
  m('apenas', 'apenas', 'Barely / Hardly', 'Scarcity.', 'Apenas puedo ver.', 'I can barely see.', 'Hace apenas un día.', 'Barely a day ago.', 'quantity'),
  m('medio', 'medio', 'Half', 'Part.', 'Medio litro.', 'Half liter.', 'Medio día.', 'Midday.', 'quantity'),
  m('mitad', 'mitad', 'Half (Noun)', 'The center point.', 'La mitad.', 'The half.', 'Parte por la mitad.', 'Split in half.', 'quantity'),
  m('varios', 'varios', 'Several', 'Indefinite number.', 'Varios días.', 'Several days.', 'Tengo varios.', 'I have several.', 'quantity'),
  m('suficiente', 'suficiente', 'Sufficient', 'Enough.', 'Es suficiente.', 'It is enough.', 'Dinero suficiente.', 'Sufficient money.', 'quantity'),
  m('monton', 'montón', 'Heap / Lot', 'Colloquial "A lot".', 'Un montón.', 'A whole lot.', 'Te quiero un montón.', 'Love you tons.', 'quantity'),
  m('resto', 'resto', 'Rest', 'Remainder.', 'El resto del día.', 'The rest of the day.', 'Y el resto.', 'And the rest.', 'quantity'),

  // --- Power Tools (Interrogatives & Mood) ---
  m('que_q', 'qué', 'What?', 'Always carries an accent in questions.', '¿Qué haces?', 'What are you doing?', '¿Qué es eso?', 'What is that?', 'interrogative'),
  m('quien', 'quién', 'Who?', 'Matches plural (Quiénes).', '¿Quién eres?', 'Who are you?', '¿Quién sabe?', 'Who knows?', 'interrogative'),
  m('cual', 'cuál', 'Which? / What?', 'Used for choices or identification.', '¿Cuál prefieres?', 'Which do you prefer?', '¿Cuál es tu nombre?', 'What is your name?', 'interrogative'),
  m('como_q', 'cómo', 'How?', 'Manner.', '¿Cómo estás?', 'How are you?', '¿Cómo te llamas?', 'How are you called?', 'interrogative'),
  m('donde_q', 'dónde', 'Where?', 'Location.', '¿Dónde estás?', 'Where are you?', '¿De dónde eres?', 'Where are you from?', 'interrogative'),
  m('cuando_q', 'cuándo', 'When?', 'Time.', '¿Cuándo vamos?', 'When do we go?', '¿Cuándo termina?', 'When does it end?', 'interrogative'),
  m('cuanto', 'cuánto', 'How much?', 'Quantity.', '¿Cuánto cuesta?', 'How much does it cost?', '¿Cuántos años tienes?', 'How old are you?', 'interrogative'),
  m('por_que_q', 'por qué', 'Why?', 'Separate words + accent. Answer with "Porque".', '¿Por qué lloras?', 'Why do you cry?', '¿Por qué no?', 'Why not?', 'interrogative'),
  m('para_que', 'para qué', 'What for?', 'Purpose.', '¿Para qué sirve?', 'What is it for?', '¿Para qué ir?', 'Why go (for what purpose)?', 'interrogative'),
  m('ojala', 'ojalá', 'I hope / God willing', 'Arabic origin. Triggers Subjunctive.', '¡Ojalá llueva!', 'I hope it rains!', 'Ojalá.', 'I hope so.', 'interrogative'),
  m('quiza', 'quizá', 'Maybe', 'Probability.', 'Quizá mañana.', 'Maybe tomorrow.', 'Quizá sí.', 'Maybe yes.', 'interrogative'),
  m('tal_vez', 'tal vez', 'Perhaps', 'Probability.', 'Tal vez voy.', 'Perhaps I go.', 'Tal vez no.', 'Perhaps not.', 'interrogative'),
  m('claro', 'claro', 'Of course', 'Agreement.', '¡Claro que sí!', 'Of course yes!', 'Claro.', 'Sure.', 'interrogative'),
  m('por_supuesto', 'por supuesto', 'Of course', 'Stronger agreement.', 'Por supuesto.', 'Of course.', 'Por supuesto que no.', 'Of course not.', 'interrogative'),
  m('vale', 'vale', 'Okay', 'Spain\'s favorite word.', '¡Vale!', 'Okay!', 'Vale, vamos.', 'Okay, let\'s go.', 'interrogative'),
  m('bueno_filler', 'bueno', 'Well / Okay', 'Filler or agreement.', 'Bueno... pues...', 'Well... so...', 'Bueno, adiós.', 'Okay, bye.', 'interrogative'),
  m('exacto', 'exacto', 'Exactly', 'Confirmation.', 'Exacto.', 'Exactly.', '¡Eso es, exacto!', 'That is it, exactly!.', 'interrogative'),
  m('cuidado', 'cuidado', 'Careful!', 'Warning.', '¡Ten cuidado!', 'Be careful!', '¡Cuidado!', 'Watch out!.', 'interrogative'),
  m('perdon', 'perdón', 'Sorry / Excuse me', 'Apology.', 'Perdón.', 'Sorry.', 'Pido perdón.', 'I ask for forgiveness.', 'interrogative'),
  m('gracias', 'gracias', 'Thanks', 'Gratitude.', 'Muchas gracias.', 'Many thanks.', 'Gracias por todo.', 'Thanks for everything.', 'interrogative'),

  // --- Essential Nature (Island Life) [ORIGINAL NOUNS KEPT] ---
  n('tiempo', 'tiempo', 'Time / Weather', 'm', 'Means both clock time and weather.', 'Hace buen tiempo.', 'The weather is good.', 'No tengo tiempo.', 'I have no time.', 'Buen (Good)'),
  n('vida', 'vida', 'Life', 'f', 'Vital word.', 'La vida es bella.', 'Life is beautiful.', 'Vida en la isla.', 'Island life.', 'Bella (Beautiful)'),
  n('dia', 'día', 'Day', 'm', 'Ends in -a but is Masculine (El día).', 'Buenos días.', 'Good morning.', 'Todo el día.', 'All day.', 'Buenos (Good)'),
  n('mundo', 'mundo', 'World', 'm', 'Used in "Todo el mundo" (Everyone).', 'Hola mundo.', 'Hello world.', 'Viajar por el mundo.', 'Travel the world.', 'Viajar (Travel)'),
  n('casa', 'casa', 'House / Home', 'f', 'Where you live.', 'Voy a casa.', 'I go home.', 'Casa grande.', 'Big house.', 'Grande (Big)'),
  n('sol', 'sol', 'Sun', 'm', 'Central to island life.', 'Tomar el sol.', 'To sunbathe.', 'El sol brilla.', 'The sun shines.', 'Brilla (Shines)'),
  n('luna', 'luna', 'Moon', 'f', 'Celestial body.', 'Luna llena.', 'Full moon.', 'Luz de luna.', 'Moonlight.', 'Llena (Full)'),
  n('mar', 'mar', 'Sea', 'm', 'Can be feminine in poetry (La mar).', 'Vista al mar.', 'Sea view.', 'Nadar en el mar.', 'Swim in the sea.', 'Vista (View)'),
  n('isla', 'isla', 'Island', 'f', 'Land surrounded by water.', 'Isla desierta.', 'Desert island.', 'Vivir en una isla.', 'Live on an island.', 'Desierta (Desert)'),
  n('agua', 'agua', 'Water', 'f', 'Takes "El" in singular (El agua) to avoid A-A clash.', 'Agua fresca.', 'Fresh water.', 'Quiero agua.', 'I want water.', 'Fresca (Fresh)'),

  // --- People & Society ---
  n('hombre', 'hombre', 'Man', 'm', 'Adult male.', 'Un hombre sabio.', 'A wise man.', 'Hombre de negocios.', 'Businessman.', 'Sabio (Wise)'),
  n('mujer', 'mujer', 'Woman', 'f', 'Adult female.', 'Mujer fuerte.', 'Strong woman.', 'Mujeres y niños.', 'Women and children.', 'Fuerte (Strong)'),
  n('familia', 'familia', 'Family', 'f', 'Social unit.', 'Amo a mi familia.', 'I love my family.', 'Familia unida.', 'United family.', 'Unida (United)'),
  n('amigo', 'amigo', 'Friend', 'm', 'Companion.', 'Mi mejor amigo.', 'My best friend.', 'Salir con amigos.', 'Go out with friends.', 'Mejor (Best)'),
  n('gente', 'gente', 'People', 'f', 'Singular grammatically, plural meaning.', 'Mucha gente.', 'Many people.', 'Gente buena.', 'Good people.', 'Mucha (Much)'),
  n('persona', 'persona', 'Person', 'f', 'Individual human.', 'Buena persona.', 'Good person.', 'Tres personas.', 'Three people.', 'Tres (Three)'),
  n('nombre', 'nombre', 'Name', 'm', 'Identity.', 'Mi nombre es...', 'My name is...', '¿Tu nombre?', 'Your name?', 'Tu (Your)'),
  n('trabajo', 'trabajo', 'Job / Work', 'm', 'Activity.', 'Buen trabajo.', 'Good job.', 'Voy al trabajo.', 'I go to work.', 'Voy (I go)'),
  n('escuela', 'escuela', 'School', 'f', 'Place of learning.', 'Niños en la escuela.', 'Kids at school.', 'Escuela de surf.', 'Surf school.', 'Surf (Surfing)'),
  n('ciudad', 'ciudad', 'City', 'f', 'Urban area.', 'Ciudad grande.', 'Big city.', 'Vivir en la ciudad.', 'Live in the ciudad.', 'Vivir (Live)'),

  // --- Body & Self ---
  n('mano', 'mano', 'Hand', 'f', 'Ends in -o but is Feminine (La mano).', 'Dame la mano.', 'Give me your hand.', 'Mano derecha.', 'Right hand.', 'Derecha (Right)'),
  n('ojo', 'ojo', 'Eye', 'm', 'Vision organ.', 'Ojos azules.', 'Blue eyes.', 'Ojo por ojo.', 'Eye for an eye.', 'Azules (Blue)'),
  n('cabeza', 'cabeza', 'Head', 'f', 'Top of body.', 'Dolor de cabeza.', 'Headache.', 'Usa la cabeza.', 'Use your head.', 'Dolor (Pain)'),
  n('corazon', 'corazón', 'Heart', 'm', 'Organ of love.', 'Corazón roto.', 'Broken heart.', 'Abrir el corazón.', 'Open the heart.', 'Roto (Broken)'),
  n('cuerpo', 'cuerpo', 'Body', 'm', 'Physical form.', 'Cuerpo sano.', 'Healthy body.', 'Mover el cuerpo.', 'Move the body.', 'Sano (Healthy)'),
  n('pie', 'pie', 'Foot', 'm', 'Body part.', 'Ir a pie.', 'Go on foot.', 'Pie izquierdo.', 'Left foot.', 'Izquierdo (Left)'),
  n('boca', 'boca', 'Mouth', 'f', 'For speaking/eating.', 'Cierra la boca.', 'Close your mouth.', 'Boca grande.', 'Big mouth.', 'Cierra (Close)'),
  n('cara', 'cara', 'Face', 'f', 'Front of head.', 'Cara feliz.', 'Happy face.', 'Lavar la cara.', 'Wash the face.', 'Lavar (Wash)'),

  // --- Abstract & Common Objects ---
  n('dinero', 'dinero', 'Money', 'm', 'Currency.', 'No tengo dinero.', 'I have no money.', 'Ganar dinero.', 'Earn money.', 'Ganar (Earn)'),
  n('comida', 'comida', 'Food', 'f', 'Sustenance.', 'Comida rica.', 'Tasty food.', 'Hora de comida.', 'Meal time.', 'Rica (Tasty)'),
  n('libro', 'libro', 'Book', 'm', 'Reading material.', 'Leer un libro.', 'Read a book.', 'Libro viejo.', 'Old book.', 'Leer (Read)'),
  n('palabra', 'palabra', 'Word', 'f', 'Unit of language.', 'Palabra de honor.', 'Word of honor.', 'Última palabra.', 'Last word.', 'Honor (Honor)'),
  n('problema', 'problema', 'Problem', 'm', 'Ends in -ma, usually Masculine.', 'No hay problema.', 'No problem.', 'Gran problema.', 'Big problem.', 'Hay (There is)'),
  n('lugar', 'lugar', 'Place', 'm', 'Location.', 'Lugar bonito.', 'Nice place.', 'En su lugar.', 'In its place.', 'Bonito (Nice)'),
  n('calle', 'calle', 'Street', 'f', 'Road.', 'Calle principal.', 'Main street.', 'Cruzar la calle.', 'Cross the street.', 'Principal (Main)'),
  n('noche', 'noche', 'Night', 'f', 'Time of darkness.', 'Buenas noches.', 'Good night.', 'Noche oscura.', 'Dark night.', 'Oscura (Dark)'),
  n('semana', 'semana', 'Week', 'f', 'Seven days.', 'Fin de semana.', 'Weekend.', 'Semana santa.', 'Holy week.', 'Fin (End)'),
  n('año', 'año', 'Year', 'm', 'Time period.', 'Feliz año nuevo.', 'Happy new year.', 'Tener 20 años.', 'To be 20 years old.', 'Nuevo (New)'),
];

export const ISLAND_SLANG = [
  { s: "¡No me toques los huevos!", t: "Don't annoy me!", note: "⚠️ Vulgar. Lit: Don't touch my eggs." },
  { s: "Postureo", t: "Showing off", note: "Posing for social media." },
  { s: "Estar de chill", t: "Chilling", note: "Relaxing (Spanglish)." },
  { s: "¡Qué fuerte!", t: "No way! / Wow!", note: "For shocking news." },
  { s: "En plan...", t: "Like...", note: "Common filler word." }
];

export const VOCABULARY_DATA: { date: string, words: Word[] }[] = [
  {
    date: '2026-02-03',
    words: [
      v('ser', 'ser', 'To be (Essence)', 'Permanent traits/origin.', 'Soy de aquí.', 'I am from here.', 'Eres alto.', 'You are tall.', 'Aquí (Here)', '[soy], [eres], [es], [somos], [sois], [son]', false),
      v('estar', 'estar', 'To be (State)', 'Temporary states/location.', 'Estoy bien.', 'I am well.', 'Estás en casa.', 'You are home.', 'Casa (House)', 'est[oy], est[ás], est[á], estamos, estáis, est[án]', false),
      v('tener', 'tener', 'To have', 'Age/Possession.', 'Tengo frío.', 'I am cold.', 'Tienes un gato.', 'You have a cat.', 'Gato (Cat)', 'ten[go], t[ie]nes, t[ie]ne, tenemos, tenéis, t[ie]nen', false),
      v('hacer', 'hacer', 'To do/make', 'Weather/Actions.', 'Hago la cama.', 'I make the bed.', 'Hace sol.', 'It is sunny.', 'Cama (Bed)', 'ha[go], haces, hace, hacemos, hacéis, hacen', false),
      v('ir', 'ir', 'To go', 'Destination (Ir a).', 'Voy al mar.', 'I go to the sea.', 'Vas lejos.', 'You go far.', 'Mar (Sea)', '[voy], [vas], [va], [vamos], [vais], [van]', false),
      v('poder', 'poder', 'To be able/Can', 'Stem change O->UE.', 'Puedo ver.', 'I can see.', 'No puedes comer.', 'You cannot eat.', 'Ver (See)', 'p[ue]do, p[ue]des, p[ue]de, podemos, podéis, p[ue]den', false),
      v('decir', 'decir', 'To say/tell', 'Go-verb + E->I.', 'Digo sí.', 'I say yes.', 'Dices no.', 'You say no.', 'Sí (Yes)', 'di[go], d[ic]es, d[ic]e, decimos, decís, d[ic]en', false),
      v('dar', 'dar', 'To give', 'Irregular Yo (Doy).', 'Doy una flor.', 'I give a flower.', 'Das amor.', 'You give love.', 'Flor (Flower)', 'd[oy], das, da, damos, dais, dan', false),
      v('saber', 'saber', 'To know (Facts)', 'Irregular Yo (Sé).', 'Sé cocinar.', 'I know to cook.', 'Sabes el camino.', 'You know the way.', 'Camino (Way)', '[sé], sabes, sabe, sabemos, sabéis, saben', false),
      v('ver', 'ver', 'To see', 'Irregular Yo (Veo).', 'Veo el sol.', 'I see the sun.', 'Ves la luna.', 'You see the moon.', 'Luna (Moon)', 'v[eo], ves, ve, vemos, veis, ven', false),
      a('grande', 'grande', 'Big', 'pequeño', 'Small', 'Shortens to "gran" before nouns.', 'Isla grande.', 'Big island.', 'Ojo grande.', 'Big eye.', 'Ojo (Eye)'),
      a('largo', 'largo', 'Long', 'corto', 'Short', 'Not "Large" (False friend).', 'Pelo largo.', 'Long hair.', 'Día largo.', 'Long day.', 'Pelo (Hair)'),
      a('alto', 'alto', 'Tall/High', 'bajo', 'Short/Low', 'Height/Volume.', 'Árbol alto.', 'Tall tree.', 'Muro alto.', 'High wall.', 'Árbol (Tree)'),
      a('ancho', 'ancho', 'Wide', 'estrecho', 'Narrow', 'Space/Dimensions.', 'Río ancho.', 'Wide river.', 'Calle ancha.', 'Wide street.', 'Río (River)'),
      a('grueso', 'grueso', 'Thick', 'delgado', 'Thin', 'Thickness of objects.', 'Libro grueso.', 'Thick book.', 'Muro grueso.', 'Thick wall.', 'Libro (Book)')
    ]
  },
  {
    date: '2026-02-04',
    words: [
      v('querer', 'querer', 'To want/love', 'Stem change E->IE.', 'Quiero agua.', 'I want water.', 'Quieres comer.', 'You want to eat.', 'Agua (Water)', 'qu[ie]ro, qu[ie]res, qu[ie]re, queremos, queréis, qu[ie]ren', false),
      v('venir', 'venir', 'To come', 'Go-verb + E->IE.', 'Vengo aquí.', 'I come here.', 'Vienes tarde.', 'You come late.', 'Tarde (Late)', 'ven[go], v[ie]nes, v[ie]ne, venimos, venís, v[ie]nen', false),
      v('poner', 'poner', 'To put', 'Go-verb (Pongo).', 'Pongo la mesa.', 'I set the table.', 'Pones música.', 'You play music.', 'Mesa (Table)', 'pon[go], pones, pone, ponemos, ponéis, ponen', false),
      v('salir', 'salir', 'To go out/leave', 'Go-verb (Salgo).', 'Salgo ahora.', 'I leave now.', 'Sales pronto.', 'You leave soon.', 'Ahora (Now)', 'sal[go], sales, sale, salimos, salís, salen', false),
      v('llegar', 'llegar', 'To arrive', 'Regular AR.', 'Llego tarde.', 'I arrive late.', 'Llegas a tiempo.', 'You arrive on time.', 'Tiempo (Time)', '', true),
      v('pasar', 'pasar', 'To pass/happen', 'Regular AR.', '¿Qué pasa?', 'What happens?', 'Paso la sal.', 'I pass the salt.', 'Sal (Salt)', '', true),
      a('gordo', 'gordo', 'Fat', 'flaco', 'Skinny', 'Body type.', 'Gato gordo.', 'Fat cat.', 'Perro flaco.', 'Skinny dog.', 'Gato (Cat)'),
      a('fuerte', 'fuerte', 'Strong', 'débil', 'Weak', 'Power/Intensity.', 'Café fuerte.', 'Strong coffee.', 'Hombre fuerte.', 'Strong man.', 'Café (Coffee)'),
      a('pesado', 'pesado', 'Heavy', 'ligero', 'Light', 'Weight.', 'Caja pesada.', 'Heavy box.', 'Aire ligero.', 'Light air.', 'Caja (Box)')
    ]
  },
  {
    date: '2026-02-05',
    words: [
      v('deber', 'deber', 'Should/Must', 'Regular ER.', 'Debo ir.', 'I must go.', 'Debes comer.', 'You should eat.', 'Comer (Eat)', '', true),
      v('seguir', 'seguir', 'To follow', 'E->I Stem change.', 'Sigo el sol.', 'I follow the sun.', 'Sigues recto.', 'You go straight.', 'Sol (Sun)', 's[i]go, s[i]gues, s[i]gue, seguimos, seguís, s[i]guen', false),
      v('encontrar', 'encontrar', 'To find', 'O->UE Stem change.', 'Encuentro oro.', 'I find gold.', 'Encuentras luz.', 'You find light.', 'Oro (Gold)', 'enc[ue]ntro, enc[ue]ntras, enc[ue]ntra, encontramos, encontráis, enc[ue]ntran', false),
      v('llamar', 'llamar', 'To call', 'Regular AR.', 'Llamo a mamá.', 'I call mom.', 'Llamas un taxi.', 'You call a taxi.', 'Taxi (Taxi)', '', true),
      v('hablar', 'hablar', 'To speak', 'Regular AR.', 'Hablo español.', 'I speak Spanish.', 'Hablas bien.', 'You speak well.', 'Bien (Well)', '', true),
      v('dejar', 'dejar', 'To let/leave', 'Regular AR.', 'Dejo la llave.', 'I leave the key.', 'Dejas fumar.', 'You quit smoking.', 'Llave (Key)', '', true),
      a('joven', 'joven', 'Young', 'viejo', 'Old', 'Age (People).', 'Soy joven.', 'I am young.', 'Hombre viejo.', 'Old man.', 'Hombre (Man)'),
      a('nuevo', 'nuevo', 'New', 'antiguo', 'Old/Ancient', 'Age (Objects).', 'Coche nuevo.', 'New car.', 'Reloj antiguo.', 'Old watch.', 'Coche (Car)'),
      a('moderno', 'moderno', 'Modern', 'tradicional', 'Traditional', 'Style/Era.', 'Casa moderna.', 'Modern house.', 'Baile tradicional.', 'Traditional dance.', 'Baile (Dance)')
    ]
  },
  // ... Keep previous data for subsequent dates as is, no changes needed for rest of dates.
  // Re-exporting rest of VOCABULARY_DATA to maintain file structure...
  {
    date: '2026-02-06',
    words: [
      v('sentir', 'sentir', 'To feel', 'E->IE.', 'Siento frío.', 'I feel cold.', 'Sientes dolor.', 'You feel pain.', 'Dolor (Pain)', 's[ie]nto, s[ie]ntes, s[ie]nte, sentimos, sentís, s[ie]nten', false),
      v('tomar', 'tomar', 'To take/drink', 'Regular AR.', 'Tomo café.', 'I drink coffee.', 'Tomas el bus.', 'You take the bus.', 'Bus (Bus)', '', true),
      v('vivir', 'vivir', 'To live', 'Regular IR.', 'Vivo aquí.', 'I live here.', 'Vives lejos.', 'You live far.', 'Lejos (Far)', '', true),
      v('creer', 'creer', 'To believe', 'Regular ER.', 'Creo en ti.', 'I believe in you.', 'Crees eso.', 'You believe that.', 'Ti (You)', '', true),
      v('pensar', 'pensar', 'To think', 'E->IE.', 'Pienso mucho.', 'I think a lot.', 'Piensas bien.', 'You think well.', 'Mucho (A lot)', 'p[ie]nso, p[ie]nsas, p[ie]nsa, pensamos, pensáis, p[ie]nsan', false),
      v('trabajar', 'trabajar', 'To work', 'Regular AR.', 'Trabajo duro.', 'I work hard.', 'Trabajas hoy.', 'You work today.', 'Duro (Hard)', '', true),
      a('fresco', 'fresco', 'Fresh', 'podrido', 'Rotten', 'Food state.', 'Pan fresco.', 'Fresh bread.', 'Fruta podrida.', 'Rotten fruit.', 'Pan (Bread)'),
      a('rico', 'rico', 'Rich/Tasty', 'pobre', 'Poor', 'Wealth/Taste.', 'Hombre rico.', 'Rich man.', 'Sabor rico.', 'Tasty flavor.', 'Sabor (Flavor)'),
      a('rápido', 'rápido', 'Fast', 'lento', 'Slow', 'Speed.', 'Coche rápido.', 'Fast car.', 'Tren lento.', 'Slow train.', 'Tren (Train)')
    ]
  },
  {
    date: '2026-02-07',
    words: [
      v('empezar', 'empezar', 'To start', 'E->IE.', 'Empiezo ya.', 'I start now.', 'Empiezas hoy.', 'You start today.', 'Ya (Already)', 'emp[ie]zo, emp[ie]zas, emp[ie]za, empezamos, empezáis, emp[ie]zan', false),
      v('conocer', 'conocer', 'To know (People)', 'Irregular Yo (Conozco).', 'Conozco a Ana.', 'I know Ana.', 'Conoces Roma.', 'You know Rome.', 'Roma (Rome)', 'conoz[co], conoces, conoce, conocemos, conocéis, conocen', false),
      v('llevar', 'llevar', 'To carry/wear', 'Regular AR.', 'Llevo gafas.', 'I wear glasses.', 'Llevas agua.', 'You carry water.', 'Gafas (Glasses)', '', true),
      v('escribir', 'escribir', 'To write', 'Regular IR.', 'Escribo cartas.', 'I write letters.', 'Escribes bien.', 'You write well.', 'Cartas (Letters)', '', true),
      v('producir', 'producir', 'To produce', 'Irregular Yo (Produzco).', 'Produzco luz.', 'I produce light.', 'Produces pan.', 'You produce bread.', 'Luz (Light)', 'produz[co], produces, produce, producimos, producís, producen', false),
      v('aparecer', 'aparecer', 'To appear', 'Irregular Yo (Aparezco).', 'Aparezco aquí.', 'I appear here.', 'Apareces allí.', 'You appear there.', 'Allí (There)', 'aparez[co], apareces, aparece, aparecemos, aparecéis, aparecen', false),
      a('fácil', 'fácil', 'Easy', 'difícil', 'Difficult', 'Difficulty.', 'Examen fácil.', 'Easy exam.', 'Vida difícil.', 'Hard life.', 'Vida (Life)'),
      a('simple', 'simple', 'Simple', 'complicado', 'Complicated', 'Complexity.', 'Plan simple.', 'Simple plan.', 'Juego complicado.', 'Complicated game.', 'Plan (Plan)'),
      a('barato', 'barato', 'Cheap', 'caro', 'Expensive', 'Price.', 'Ropa barata.', 'Cheap clothes.', 'Vino caro.', 'Expensive wine.', 'Ropa (Clothes)')
    ]
  },
  {
    date: '2026-02-08',
    words: [
      v('entender', 'entender', 'To understand', 'E->IE.', 'Entiendo todo.', 'I understand all.', 'Entiendes nada.', 'You understand nothing.', 'Todo (All)', 'ent[ie]ndo, ent[ie]ndes, ent[ie]nde, entendemos, entendéis, ent[ie]nden', false),
      v('necesitar', 'necesitar', 'To need', 'Regular AR.', 'Necesito aire.', 'I need air.', 'Necesitas ir.', 'You need to go.', 'Aire (Air)', '', true),
      v('buscar', 'buscar', 'To search', 'Regular AR.', 'Busco paz.', 'I seek peace.', 'Buscas algo.', 'You seek something.', 'Algo (Something)', '', true),
      v('esperar', 'esperar', 'To wait/hope', 'Regular AR.', 'Espero tren.', 'I wait for train.', 'Esperas ver.', 'You hope to see.', 'Tren (Train)', '', true),
      v('usar', 'usar', 'To use', 'Regular AR.', 'Uso el coche.', 'I use the car.', 'Usas la red.', 'You use the net.', 'Red (Net)', '', true),
      v('mirar', 'mirar', 'To look', 'Regular AR.', 'Miro el mar.', 'I look at the sea.', 'Miras la tv.', 'You watch TV.', 'Mar (Sea)', '', true),
      a('limpio', 'limpio', 'Clean', 'sucio', 'Dirty', 'Hygiene.', 'Casa limpia.', 'Clean house.', 'Mano sucia.', 'Dirty hand.', 'Mano (Hand)'),
      a('lleno', 'lleno', 'Full', 'vacío', 'Empty', 'Capacity.', 'Vaso lleno.', 'Full glass.', 'Vaso vacío.', 'Empty glass.', 'Vaso (Glass)'),
      a('abierto', 'abierto', 'Open', 'cerrado', 'Closed', 'Status.', 'Ojo abierto.', 'Open eye.', 'Puerta cerrada.', 'Closed door.', 'Ojo (Eye)')
    ]
  },
  {
    date: '2026-02-09',
    words: [
      v('pedir', 'pedir', 'To ask/order', 'E->I.', 'Pido agua.', 'I ask for water.', 'Pides pan.', 'You ask for bread.', 'Pan (Bread)', 'p[i]do, p[i]des, p[i]de, pedimos, pedís, p[i]den', false),
      v('abrir', 'abrir', 'To open', 'Regular IR.', 'Abro la caja.', 'I open the box.', 'Abres los ojos.', 'You open eyes.', 'Caja (Box)', '', true),
      v('perder', 'perder', 'To lose', 'E->IE.', 'Pierdo tiempo.', 'I lose time.', 'Pierdes peso.', 'You lose weight.', 'Tiempo (Time)', 'p[ie]rdo, p[ie]rdes, p[ie]rde, perdemos, perdéis, p[ie]rden', false),
      v('volver', 'volver', 'To return', 'O->UE.', 'Vuelvo casa.', 'I return home.', 'Vuelves pronto.', 'You return soon.', 'Casa (Home)', 'v[ue]lvo, v[ue]lves, v[ue]lve, volvemos, volvéis, v[ue]lven', false),
      v('caer', 'caer', 'To fall', 'Irregular Yo (Caigo).', 'Caigo bien.', 'I am liked.', 'Caes mal.', 'You are disliked.', 'Mal (Badly)', 'cai[go], caes, cae, caemos, caéis, caen', false),
      v('traer', 'traer', 'To bring', 'Irregular Yo (Traigo).', 'Traigo vino.', 'I bring wine.', 'Traes luz.', 'You bring light.', 'Vino (Wine)', 'trai[go], traes, trae, traemos, traéis, traen', false),
      a('caliente', 'caliente', 'Hot', 'frío', 'Cold', 'Temperature.', 'Sopa caliente.', 'Hot soup.', 'Hielo frío.', 'Cold ice.', 'Sopa (Soup)'),
      a('cálido', 'cálido', 'Warm', 'helado', 'Freezing', 'Weather.', 'Día cálido.', 'Warm day.', 'Viento helado.', 'Freezing wind.', 'Día (Day)'),
      a('seco', 'seco', 'Dry', 'mojado', 'Wet', 'Moisture.', 'Pelo seco.', 'Dry hair.', 'Suelo mojado.', 'Wet floor.', 'Suelo (Floor)'),
      a('suave', 'suave', 'Soft', 'duro', 'Hard', 'Texture.', 'Piel suave.', 'Soft skin.', 'Roca dura.', 'Hard rock.', 'Piel (Skin)'),
      a('blando', 'blando', 'Soft/Mushy', 'áspero', 'Rough', 'Touch.', 'Pan blando.', 'Soft bread.', 'Pared áspera.', 'Rough wall.', 'Pared (Wall)')
    ]
  },
  {
    date: '2026-02-10',
    words: [
      v('parecer', 'parecer', 'To seem', 'Irregular Yo (Parezco).', 'Parezco feliz.', 'I seem happy.', 'Pareces triste.', 'You seem sad.', 'Feliz (Happy)', 'parez[co], pareces, parece, parecemos, parecéis, parecen', false),
      v('quedar', 'quedar', 'To stay/remain', 'Regular AR.', 'Quedo aquí.', 'I stay here.', 'Quedas solo.', 'You stay alone.', 'Solo (Alone)', '', true),
      v('ayudar', 'ayudar', 'To help', 'Regular AR.', 'Ayudo mucho.', 'I help a lot.', 'Ayudas poco.', 'You help little.', 'Poco (Little)', '', true),
      v('pagar', 'pagar', 'To pay', 'Regular AR.', 'Pago yo.', 'I pay.', 'Pagas tú.', 'You pay.', 'Cuenta (Bill)', '', true),
      v('ofrecer', 'ofrecer', 'To offer', 'Irregular Yo (Ofrezco).', 'Ofrezco ayuda.', 'I offer help.', 'Ofreces té.', 'You offer tea.', 'Ayuda (Help)', 'ofrez[co], ofreces, ofrece, ofrecemos, ofrecéis, ofrecen', false),
      v('recordar', 'recordar', 'To remember', 'O->UE.', 'Recuerdo todo.', 'I remember all.', 'Recuerdas nada.', 'You recall nothing.', 'Todo (All)', 'rec[ue]rdo, rec[ue]rdas, rec[ue]rda, recordamos, recordáis, rec[ue]rdan', false),
      v('permitir', 'permitir', 'To allow', 'Regular IR.', 'Permito esto.', 'I allow this.', 'Permites eso.', 'You allow that.', 'Esto (This)', '', true),
      v('explicar', 'explicar', 'To explain', 'Regular AR.', 'Explico bien.', 'I explain well.', 'Explicas mal.', 'You explain badly.', 'Mal (Badly)', '', true),
      a('feliz', 'feliz', 'Happy', 'triste', 'Sad', 'Emotion.', 'Niño feliz.', 'Happy boy.', 'Día triste.', 'Sad day.', 'Niño (Boy)'),
      a('alegre', 'alegre', 'Cheerful', 'deprimido', 'Depressed', 'Mood.', 'Música alegre.', 'Happy music.', 'Hombre deprimido.', 'Depressed man.', 'Música (Music)'),
      a('contento', 'contento', 'Content', 'enfadado', 'Angry', 'Feeling.', 'Estoy contento.', 'I am content.', 'Estás enfadado.', 'You are angry.', 'Estoy (I am)')
    ]
  },
  {
    date: '2026-02-11',
    words: [
      v('mantener', 'mantener', 'To maintain', 'Go-verb + E->IE.', 'Mantengo calma.', 'I keep calm.', 'Mantienes orden.', 'You keep order.', 'Calma (Calm)', 'manten[go], mant[ie]nes, mant[ie]ne, mantenemos, mantenéis, mant[ie]nen', false),
      v('cumplir', 'cumplir', 'To fulfill', 'Regular IR.', 'Cumplo años.', 'I have birthday.', 'Cumples meta.', 'You reach goal.', 'Meta (Goal)', '', true),
      v('resultar', 'resultar', 'To result', 'Regular AR.', 'Resulta bien.', 'It turns out well.', 'Resulta mal.', 'It turns out bad.', 'Bien (Well)', '', true),
      v('añadir', 'añadir', 'To add', 'Regular IR.', 'Añado sal.', 'I add salt.', 'Añades agua.', 'You add water.', 'Sal (Salt)', '', true),
      v('suponer', 'suponer', 'To suppose', 'Go-verb (Supongo).', 'Supongo que sí.', 'I suppose so.', 'Supones mal.', 'You suppose wrong.', 'Que sí (That yes)', 'supon[go], supones, supone, suponemos, suponéis, suponen', false),
      v('lograr', 'lograr', 'To achieve', 'Regular AR.', 'Logro ganar.', 'I manage to win.', 'Logras ver.', 'You manage to see.', 'Ganar (Win)', '', true),
      a('tranquilo', 'tranquilo', 'Calm', 'nervioso', 'Nervous', 'State.', 'Mar tranquilo.', 'Calm sea.', 'Chico nervioso.', 'Nervous boy.', 'Mar (Sea)'),
      a('seguro', 'seguro', 'Safe/Sure', 'inseguro', 'Unsafe/Unsure', 'Security.', 'Lugar seguro.', 'Safe place.', 'Paso inseguro.', 'Unsure step.', 'Lugar (Place)'),
      a('satisfecho', 'satisfecho', 'Satisfied', 'insatisfecho', 'Dissatisfied', 'Feeling.', 'Cliente satisfecho.', 'Satisfied client.', 'Hombre insatisfecho.', 'Dissatisfied man.', 'Cliente (Client)')
    ]
  },
  {
    date: '2026-02-12',
    words: [
      v('comer', 'comer', 'To eat', 'Regular ER.', 'Como pan.', 'I eat bread.', 'Comes fruta.', 'You eat fruit.', 'Fruta (Fruit)', '', true),
      v('ganar', 'ganar', 'To win/earn', 'Regular AR.', 'Gano dinero.', 'I earn money.', 'Ganas juego.', 'You win game.', 'Dinero (Money)', '', true),
      v('enviar', 'enviar', 'To send', 'I -> Í (Accent).', 'Envío carta.', 'I send letter.', 'Envías flor.', 'You send flower.', 'Carta (Letter)', 'env[í]o, env[í]as, env[í]a, enviamos, enviáis, env[í]an', false),
      v('contestar', 'contestar', 'To answer', 'Regular AR.', 'Contesto.', 'I answer.', 'Contestas.', 'You answer.', 'Pregunta (Question)', '', true),
      v('elegir', 'elegir', 'To choose', 'E->I + J.', 'Elijo esto.', 'I choose this.', 'Eliges eso.', 'You choose that.', 'Esto (This)', 'eli[j]o, el[i]ges, el[i]ge, elegimos, elegís, el[i]gen', false),
      v('nacer', 'nacer', 'To be born', 'Irregular Yo (Nazco).', 'Nazco hoy.', 'I am born today.', 'Naces libre.', 'You are born free.', 'Libre (Free)', 'naz[co], naces, nace, nacemos, nacéis, nacen', false),
      v('morir', 'morir', 'To die', 'O->UE.', 'Muero de risa.', 'I die of laughter.', 'Mueres joven.', 'You die young.', 'Risa (Laughter)', 'm[ue]ro, m[ue]res, m[ue]re, morimos, morís, m[ue]ren', false),
      a('emocionado', 'emocionado', 'Excited', 'aburrido', 'Bored', 'Feeling.', 'Estoy emocionado.', 'I am excited.', 'Estás aburrido.', 'You are bored.', 'Estoy (I am)'),
      a('interesado', 'interesado', 'Interested', 'desinteresado', 'Disinterested', 'Interest.', 'Público interesado.', 'Interested audience.', 'Ojo desinteresado.', 'Disinterested eye.', 'Público (Audience)'),
      a('sorprendido', 'sorprendido', 'Surprised', 'indiferente', 'Indifferent', 'Reaction.', 'Cara sorprendida.', 'Surprised face.', 'Gesto indiferente.', 'Indifferent gesture.', 'Cara (Face)')
    ]
  },
  {
    date: '2026-02-13',
    words: [
      v('preguntar', 'preguntar', 'To ask', 'Regular AR.', 'Pregunto hora.', 'I ask time.', 'Preguntas nombre.', 'You ask name.', 'Hora (Time)', '', true),
      v('cerrar', 'cerrar', 'To close', 'E->IE.', 'Cierro puerta.', 'I close door.', 'Cierras ojo.', 'You close eye.', 'Puerta (Door)', 'c[ie]rro, c[ie]rras, c[ie]rra, cerramos, cerráis, c[ie]rran', false),
      v('entrar', 'entrar', 'To enter', 'Regular AR.', 'Entro casa.', 'I enter house.', 'Entras sala.', 'You enter room.', 'Sala (Room)', '', true),
      v('comenzar', 'comenzar', 'To begin', 'E->IE.', 'Comienzo ya.', 'I begin now.', 'Comienzas mal.', 'You begin badly.', 'Ya (Already)', 'com[ie]nzo, com[ie]nzas, com[ie]nza, comenzamos, comenzáis, com[ie]nzan', false),
      v('terminar', 'terminar', 'To finish', 'Regular AR.', 'Termino hoy.', 'I finish today.', 'Terminas esto.', 'You finish this.', 'Hoy (Today)', '', true),
      v('continuar', 'continuar', 'To continue', 'U -> Ú.', 'Continúo recto.', 'I continue straight.', 'Continúas bien.', 'You continue well.', 'Recto (Straight)', 'contin[ú]o, contin[ú]as, contin[ú]a, continuamos, continuáis, contin[ú]an', false),
      v('existir', 'existir', 'To exist', 'Regular IR.', 'Existo.', 'I exist.', 'Existes.', 'You exist.', 'Vida (Life)', '', true),
      v('suceder', 'suceder', 'To happen', 'Regular ER.', 'Sucede algo.', 'Something happens.', 'Suceden cosas.', 'Things happen.', 'Cosas (Things)', '', true),
      a('interesante', 'interesante', 'Interesting', 'aburrido', 'Boring', 'Quality.', 'Libro interesante.', 'Interesting book.', 'Clase aburrida.', 'Boring class.', 'Clase (Class)'),
      a('emocionante', 'emocionante', 'Exciting', 'monótono', 'Monotonous', 'Feeling.', 'Viaje emocionante.', 'Exciting trip.', 'Vida monótona.', 'Monotonous life.', 'Viaje (Trip)'),
      a('divertido', 'divertido', 'Fun', 'serio', 'Serious', 'Personality.', 'Juego divertido.', 'Fun game.', 'Hombre serio.', 'Serious man.', 'Juego (Game)'),
      a('gracioso', 'gracioso', 'Funny', 'solemne', 'Solemn', 'Character.', 'Chiste gracioso.', 'Funny joke.', 'Acto solemne.', 'Solemn act.', 'Chiste (Joke)'),
      a('entretenido', 'entretenido', 'Entertaining', 'tedioso', 'Tedious', 'Activity.', 'Show entretenido.', 'Entertaining show.', 'Día tedioso.', 'Tedious day.', 'Show (Show)')
    ]
  },
  {
    date: '2026-02-14',
    words: [
      v('gustar', 'gustar', 'To like', 'Special: Me gusta.', 'Me gusta sol.', 'I like sun.', 'Te gusta mar.', 'You like sea.', 'Sol (Sun)', 'gust[a], gust[an]', false),
      v('preferir', 'preferir', 'To prefer', 'E->IE.', 'Prefiero té.', 'I prefer tea.', 'Prefieres ir.', 'You prefer to go.', 'Té (Tea)', 'pref[ie]ro, pref[ie]res, pref[ie]re, preferimos, preferís, pref[ie]ren', false),
      v('odiar', 'odiar', 'To hate', 'Regular AR.', 'Odio lluvia.', 'I hate rain.', 'Odias ruido.', 'You hate noise.', 'Lluvia (Rain)', '', true),
      v('amar', 'amar', 'To love', 'Regular AR.', 'Amo vida.', 'I love life.', 'Amas todo.', 'You love all.', 'Vida (Life)', '', true),
      v('desear', 'desear', 'To desire', 'Regular AR.', 'Deseo verte.', 'I desire to see you.', 'Deseas más.', 'You desire more.', 'Verte (See you)', '', true),
      v('soñar', 'soñar', 'To dream', 'O->UE.', 'Sueño alto.', 'I dream high.', 'Sueñas feo.', 'You dream bad.', 'Alto (High)', 's[ue]ño, s[ue]ñas, s[ue]ña, soñamos, soñáis, s[ue]ñan', false),
      v('imaginar', 'imaginar', 'To imagine', 'Regular AR.', 'Imagino mundo.', 'I imagine world.', 'Imaginas luz.', 'You imagine light.', 'Mundo (World)', '', true),
      a('amable', 'amable', 'Kind', 'grosero', 'Rude', 'Behavior.', 'Mujer amable.', 'Kind woman.', 'Gesto grosero.', 'Rude gesture.', 'Mujer (Woman)'),
      a('cortés', 'cortés', 'Polite', 'descortés', 'Impolite', 'Manners.', 'Hombre cortés.', 'Polite man.', 'Voz descortés.', 'Impolite voice.', 'Voz (Voice)'),
      a('educado', 'educado', 'Polite/Educated', 'maleducado', 'Rude', 'Upbringing.', 'Niño educado.', 'Polite child.', 'Perro maleducado.', 'Rude dog.', 'Niño (Child)'),
      a('generoso', 'generoso', 'Generous', 'tacaño', 'Stingy', 'Sharing.', 'Amigo generoso.', 'Generous friend.', 'Jefe tacaño.', 'Stingy boss.', 'Amigo (Friend)')
    ]
  },
  {
    date: '2026-02-15',
    words: [
      v('aprender', 'aprender', 'To learn', 'Regular ER.', 'Aprendo leer.', 'I learn to read.', 'Aprendes rapido.', 'You learn fast.', 'Leer (Read)', '', true),
      v('comprar', 'comprar', 'To buy', 'Regular AR.', 'Compro pan.', 'I buy bread.', 'Compras ropa.', 'You buy clothes.', 'Ropa (Clothes)', '', true),
      v('recibir', 'recibir', 'To receive', 'Regular IR.', 'Recibo carta.', 'I get letter.', 'Recibes amor.', 'You get love.', 'Carta (Letter)', '', true),
      v('vender', 'vender', 'To sell', 'Regular ER.', 'Vendo coche.', 'I sell car.', 'Vendes casa.', 'You sell house.', 'Coche (Car)', '', true),
      v('obtener', 'obtener', 'To obtain', 'Go-verb + E->IE.', 'Obtengo nota.', 'I get grade.', 'Obtienes paz.', 'You get peace.', 'Nota (Grade)', 'obten[go], obt[ie]nes, obt[ie]ne, obtenemos, obtenéis, obt[ie]nen', false),
      a('bueno', 'bueno', 'Good', 'malo', 'Bad', 'General.', 'Día bueno.', 'Good day.', 'Tiempo malo.', 'Bad weather.', 'Día (Day)'),
      a('bonito', 'bonito', 'Pretty', 'feo', 'Ugly', 'Appearance.', 'Flor bonita.', 'Pretty flower.', 'Monstruo feo.', 'Ugly monster.', 'Flor (Flower)'),
      a('hermoso', 'hermoso', 'Beautiful', 'horrible', 'Horrible', 'Beauty.', 'Paisaje hermoso.', 'Beautiful view.', 'Crimen horrible.', 'Horrible crime.', 'Paisaje (Landscape)'),
      a('agradable', 'agradable', 'Pleasant', 'desagradable', 'Unpleasant', 'Feeling.', 'Olor agradable.', 'Pleasant smell.', 'Ruido desagradable.', 'Unpleasant noise.', 'Olor (Smell)'),
      a('lindo', 'lindo', 'Cute', 'espantoso', 'Scary', 'Appearance.', 'Bebé lindo.', 'Cute baby.', 'Sueño espantoso.', 'Scary dream.', 'Bebé (Baby)')
    ]
  },
  {
    date: '2026-02-16',
    words: [
      v('leer', 'leer', 'To read', 'Regular ER.', 'Leo libro.', 'I read book.', 'Lees diario.', 'You read paper.', 'Libro (Book)', '', true),
      v('sentarse', 'sentarse', 'To sit', 'E->IE reflexive.', 'Me siento.', 'I sit.', 'Te sientas.', 'You sit.', 'Silla (Chair)', 'me s[ie]nto, te s[ie]ntas, se s[ie]nta, nos sentamos, os sentáis, se s[ie]ntan', false),
      v('conseguir', 'conseguir', 'To get/achieve', 'E->I + G/GU.', 'Consigo meta.', 'I reach goal.', 'Consigues pan.', 'You get bread.', 'Meta (Goal)', 'consi[g]o, cons[i]gues, cons[i]gue, conseguimos, conseguís, cons[i]guen', false),
      v('levantarse', 'levantarse', 'To get up', 'Reflexive.', 'Me levanto.', 'I get up.', 'Te levantas.', 'You get up.', 'Cama (Bed)', '', true),
      v('acostarse', 'acostarse', 'To go to bed', 'O->UE reflexive.', 'Me acuesto.', 'I lie down.', 'Te acuestas.', 'You lie down.', 'Noche (Night)', 'me ac[ue]sto, te ac[ue]stas, se ac[ue]sta, nos acostamos, os acostáis, se ac[ue]stan', false),
      v('ducharse', 'ducharse', 'To shower', 'Reflexive.', 'Me ducho.', 'I shower.', 'Te duchas.', 'You shower.', 'Agua (Water)', '', true),
      v('vestirse', 'vestirse', 'To dress', 'E->I reflexive.', 'Me visto.', 'I dress.', 'Te vistes.', 'You dress.', 'Ropa (Clothes)', 'me v[i]sto, te v[i]stes, se v[i]ste, nos vestimos, os vestís, se v[i]sten', false),
      v('lavarse', 'lavarse', 'To wash', 'Reflexive.', 'Me lavo.', 'I wash.', 'Te lavas.', 'You wash.', 'Mano (Hand)', '', true),
      v('despertarse', 'despertarse', 'To wake up', 'E->IE reflexive.', 'Me despierto.', 'I wake up.', 'Te despiertas.', 'You wake up.', 'Sol (Sun)', 'me desp[ie]rto, te desp[ie]rtas, se desp[ie]rta, nos despertamos, os despertáis, se desp[ie]rtan', false),
      a('perfecto', 'perfecto', 'Perfect', 'imperfecto', 'Imperfect', 'Quality.', 'Día perfecto.', 'Perfect day.', 'Círculo imperfecto.', 'Imperfect circle.', 'Día (Day)'),
      a('excelente', 'excelente', 'Excellent', 'terrible', 'Terrible', 'Grade.', 'Nota excelente.', 'Excellent grade.', 'Error terrible.', 'Terrible error.', 'Nota (Grade)'),
      a('maravilloso', 'maravilloso', 'Wonderful', 'pésimo', 'Awful', 'Quality.', 'Mundo maravilloso.', 'Wonderful world.', 'Servicio pésimo.', 'Awful service.', 'Mundo (World)'),
      a('magnífico', 'magnífico', 'Magnificent', 'horrible', 'Horrible', 'Review.', 'Palacio magnífico.', 'Magnificent palace.', 'Olor horrible.', 'Horrible smell.', 'Palacio (Palace)')
    ]
  },
  {
    date: '2026-02-17',
    words: [
      v('levantar', 'levantar', 'To lift', 'Regular AR.', 'Levanto peso.', 'I lift weight.', 'Levantas mano.', 'You raise hand.', 'Mano (Hand)', '', true),
      v('acabar', 'acabar', 'To end', 'Regular AR.', 'Acabo ya.', 'I end now.', 'Acabas mal.', 'You end badly.', 'Ya (Already)', '', true),
      v('mover', 'mover', 'To move', 'O->UE.', 'Muevo silla.', 'I move chair.', 'Mueves pie.', 'You move foot.', 'Pie (Foot)', 'm[ue]vo, m[ue]ves, m[ue]ve, movemos, movéis, m[ue]ven', false),
      v('tocar', 'tocar', 'To touch/play', 'Regular AR.', 'Toco piano.', 'I play piano.', 'Tocas puerta.', 'You knock door.', 'Piano (Piano)', '', true),
      v('llover', 'llover', 'To rain', 'O->UE (Impersonal).', 'Llueve.', 'It rains.', 'Llueve mucho.', 'It rains a lot.', 'Lluvia (Rain)', 'll[ue]ve', false),
      v('nevar', 'nevar', 'To snow', 'E->IE (Impersonal).', 'Nieva.', 'It snows.', 'Nieva hoy.', 'It snows today.', 'Nieve (Snow)', 'n[ie]va', false),
      v('crecer', 'crecer', 'To grow', 'Irregular Yo (Crezco).', 'Crezco rápido.', 'I grow fast.', 'Creces alto.', 'You grow tall.', 'Alto (Tall)', 'crez[co], creces, crece, crecemos, crecéis, crecen', false),
      a('correcto', 'correcto', 'Correct', 'incorrecto', 'Incorrect', 'Truth.', 'Dato correcto.', 'Correct fact.', 'Uso incorrecto.', 'Incorrect use.', 'Dato (Fact)'),
      a('verdadero', 'verdadero', 'True', 'falso', 'False', 'Truth.', 'Amor verdadero.', 'True love.', 'Amigo falso.', 'False friend.', 'Amor (Love)'),
      a('real', 'real', 'Real', 'irreal', 'Unreal', 'Reality.', 'Mundo real.', 'Real world.', 'Sueño irreal.', 'Unreal dream.', 'Mundo (World)'),
      a('posible', 'posible', 'Possible', 'imposible', 'Impossible', 'Chance.', 'Es posible.', 'It is possible.', 'Misión imposible.', 'Mission impossible.', 'Misión (Mission)')
    ]
  },
  {
    date: '2026-02-18',
    words: [
      v('contar', 'contar', 'To count/tell', 'O->UE.', 'Cuento tres.', 'I count three.', 'Cuentas cuento.', 'You tell story.', 'Tres (Three)', 'c[ue]nto, c[ue]ntas, c[ue]nta, contamos, contáis, c[ue]ntan', false),
      v('subir', 'subir', 'To go up', 'Regular IR.', 'Subo.', 'I go up.', 'Subes.', 'You go up.', 'Escalera (Stairs)', '', true),
      v('bajar', 'bajar', 'To go down', 'Regular AR.', 'Bajo.', 'I go down.', 'Bajas.', 'You go down.', 'Calle (Street)', '', true),
      v('partir', 'partir', 'To depart/split', 'Regular IR.', 'Parto pan.', 'I split bread.', 'Partes hoy.', 'You leave today.', 'Pan (Bread)', '', true),
      a('ordenado', 'ordenado', 'Tidy', 'desordenado', 'Messy', 'Order.', 'Cuarto ordenado.', 'Tidy room.', 'Pelo desordenado.', 'Messy hair.', 'Cuarto (Room)'),
      a('organizado', 'organizado', 'Organized', 'desorganizado', 'Disorganized', 'Structure.', 'Plan organizado.', 'Organized plan.', 'Grupo desorganizado.', 'Disorganized group.', 'Plan (Plan)'),
      a('claro', 'claro', 'Clear', 'confuso', 'Confusing', 'Clarity.', 'Agua clara.', 'Clear water.', 'Texto confuso.', 'Confusing text.', 'Agua (Water)'),
      a('sencillo', 'sencillo', 'Simple', 'complejo', 'Complex', 'Difficulty.', 'Paso sencillo.', 'Simple step.', 'Sistema complejo.', 'Complex system.', 'Paso (Step)')
    ]
  },
  {
    date: '2026-02-19',
    words: [
      v('oír', 'oír', 'To hear', 'Irregular Yo (Oigo) + Y.', 'Oigo ruido.', 'I hear noise.', 'Oyes voz.', 'You hear voice.', 'Ruido (Noise)', 'oi[go], o[y]es, o[y]e, oímos, oís, o[y]en', false),
      v('cambiar', 'cambiar', 'To change', 'Regular AR.', 'Cambio ropa.', 'I change clothes.', 'Cambias todo.', 'You change all.', 'Ropa (Clothes)', '', true),
      v('olvidar', 'olvidar', 'To forget', 'Regular AR.', 'Olvido nombre.', 'I forget name.', 'Olvidas llave.', 'You forget key.', 'Nombre (Name)', '', true),
      v('repetir', 'repetir', 'To repeat', 'E->I.', 'Repito.', 'I repeat.', 'Repites.', 'You repeat.', 'Clase (Class)', 'rep[i]to, rep[i]tes, rep[i]te, repetimos, repetís, rep[i]ten', false),
      v('construir', 'construir', 'To build', 'U->UY.', 'Construyo casa.', 'I build house.', 'Construyes muro.', 'You build wall.', 'Muro (Wall)', 'constru[y]o, constru[y]es, constru[y]e, construimos, construís, constru[y]en', false),
      v('destruir', 'destruir', 'To destroy', 'U->UY.', 'Destruyo mal.', 'I destroy evil.', 'Destruyes plan.', 'You destroy plan.', 'Mal (Evil)', 'destru[y]o, destru[y]es, destru[y]e, destruimos, destruís, destru[y]en', false),
      v('crear', 'crear', 'To create', 'Regular AR.', 'Creo arte.', 'I create art.', 'Creas vida.', 'You create life.', 'Arte (Art)', '', true),
      v('inventar', 'inventar', 'To invent', 'Regular AR.', 'Invento cosa.', 'I invent thing.', 'Inventas juego.', 'You invent game.', 'Cosa (Thing)', '', true),
      a('temprano', 'temprano', 'Early', 'tarde', 'Late', 'Time.', 'Mañana temprano.', 'Early morning.', 'Noche tarde.', 'Late night.', 'Mañana (Morning)'),
      a('pronto', 'pronto', 'Soon/Quick', 'tardío', 'Late', 'Timing.', 'Respuesta pronta.', 'Quick answer.', 'Fruto tardío.', 'Late fruit.', 'Respuesta (Answer)'),
      a('inmediato', 'inmediato', 'Immediate', 'diferido', 'Deferred', 'Urgency.', 'Acción inmediata.', 'Immediate action.', 'Pago diferido.', 'Deferred payment.', 'Acción (Action)'),
      a('urgente', 'urgente', 'Urgent', 'relajado', 'Relaxed', 'Priority.', 'Carta urgente.', 'Urgent letter.', 'Ritmo relajado.', 'Relaxed pace.', 'Carta (Letter)')
    ]
  },
  {
    date: '2026-02-20',
    words: [
      v('jugar', 'jugar', 'To play', 'U->UE.', 'Juego fútbol.', 'I play soccer.', 'Juegas bien.', 'You play well.', 'Fútbol (Soccer)', 'j[ue]go, j[ue]gas, j[ue]ga, jugamos, jugáis, j[ue]gan', false),
      v('desaparecer', 'desaparecer', 'To disappear', 'Irregular Yo (Desaparezco).', 'Desaparezco.', 'I disappear.', 'Desapareces.', 'You disappear.', 'Mago (Wizard)', 'desaparez[co], desapareces, desaparece, desaparecemos, desaparecéis, desaparecen', false),
      v('surgir', 'surgir', 'To arise', 'Irregular Yo (Surjo).', 'Surjo.', 'I arise.', 'Surges.', 'You arise.', 'Problema (Problem)', 'sur[j]o, surges, surge, surgimos, surgís, surgen', false),
      a('frecuente', 'frecuente', 'Frequent', 'raro', 'Rare', 'Frequency.', 'Uso frecuente.', 'Frequent use.', 'Pájaro raro.', 'Rare bird.', 'Pájaro (Bird)'),
      a('permanente', 'permanente', 'Permanent', 'temporal', 'Temporary', 'Duration.', 'Daño permanente.', 'Permanent damage.', 'Trabajo temporal.', 'Temporary job.', 'Daño (Damage)'),
      a('eterno', 'eterno', 'Eternal', 'efímero', 'Ephemeral', 'Time.', 'Amor eterno.', 'Eternal love.', 'Arte efímero.', 'Ephemeral art.', 'Arte (Art)'),
      a('constante', 'constante', 'Constant', 'variable', 'Variable', 'Consistency.', 'Ritmo constante.', 'Constant rhythm.', 'Clima variable.', 'Variable climate.', 'Clima (Climate)'),
      a('estable', 'estable', 'Stable', 'inestable', 'Unstable', 'Stability.', 'Base estable.', 'Stable base.', 'Suelo inestable.', 'Unstable ground.', 'Base (Base)')
    ]
  },
  {
    date: '2026-02-21',
    words: [
      v('cantar', 'cantar', 'To sing', 'Regular AR.', 'Canto canción.', 'I sing song.', 'Cantas mal.', 'You sing badly.', 'Canción (Song)', '', true),
      v('correr', 'correr', 'To run', 'Regular ER.', 'Corro rápido.', 'I run fast.', 'Corres lento.', 'You run slow.', 'Parque (Park)', '', true),
      v('dormir', 'dormir', 'To sleep', 'O->UE.', 'Duermo mucho.', 'I sleep a lot.', 'Duermes poco.', 'You sleep little.', 'Cama (Bed)', 'd[ue]rmo, d[ue]rmes, d[ue]rme, dormimos, dormís, d[ue]rmen', false),
      v('despertar', 'despertar', 'To wake', 'E->IE.', 'Despierto.', 'I wake.', 'Despiertas.', 'You wake.', 'Hora (Time)', 'desp[ie]rto, desp[ie]rtas, desp[ie]rta, despertamos, despertáis, desp[ie]rtan', false),
      v('reír', 'reír', 'To laugh', 'E->I.', 'Río mucho.', 'I laugh a lot.', 'Ríes fuerte.', 'You laugh loud.', 'Chiste (Joke)', 'r[í]o, r[í]es, r[í]e, reímos, reís, r[í]en', false),
      v('llorar', 'llorar', 'To cry', 'Regular AR.', 'Lloro pena.', 'I cry sorrow.', 'Lloras feliz.', 'You cry happy.', 'Pena (Sorrow)', '', true),
      v('gritar', 'gritar', 'To shout', 'Regular AR.', 'Grito fuerte.', 'I shout loud.', 'Gritas nombre.', 'You shout name.', 'Nombre (Name)', '', true),
      v('susurrar', 'susurrar', 'To whisper', 'Regular AR.', 'Susurro algo.', 'I whisper something.', 'Susurras.', 'You whisper.', 'Secreto (Secret)', '', true),
      a('mucho', 'mucho', 'Much', 'poco', 'Little', 'Quantity.', 'Mucho dinero.', 'Much money.', 'Poco tiempo.', 'Little time.', 'Dinero (Money)'),
      a('todo', 'todo', 'All', 'ninguno', 'None', 'Totality.', 'Todo el día.', 'All day.', 'Ningún hombre.', 'No man.', 'Día (Day)'),
      a('completo', 'completo', 'Complete', 'incompleto', 'Incomplete', 'State.', 'Juego completo.', 'Complete set.', 'Texto incompleto.', 'Incomplete text.', 'Juego (Set)'),
      a('suficiente', 'suficiente', 'Sufficient', 'insuficiente', 'Insufficient', 'Amount.', 'Comida suficiente.', 'Sufficient food.', 'Pago insuficiente.', 'Insufficient pay.', 'Comida (Food)')
    ]
  },
  {
    date: '2026-02-22',
    words: [
      v('mostrar', 'mostrar', 'To show', 'O->UE.', 'Muestro foto.', 'I show photo.', 'Muestras casa.', 'You show house.', 'Foto (Photo)', 'm[ue]stro, m[ue]stras, m[ue]stra, mostramos, mostráis, m[ue]stran', false),
      v('estudiar', 'estudiar', 'To study', 'Regular AR.', 'Estudio arte.', 'I study art.', 'Estudias ley.', 'You study law.', 'Ley (Law)', '', true),
      v('enseñar', 'enseñar', 'To teach', 'Regular AR.', 'Enseño yoga.', 'I teach yoga.', 'Enseñas bien.', 'You teach well.', 'Yoga (Yoga)', '', true),
      v('practicar', 'practicar', 'To practice', 'Regular AR.', 'Practico gol.', 'I practice goal.', 'Practicas voz.', 'You practice voice.', 'Gol (Goal)', '', true),
      v('mejorar', 'mejorar', 'To improve', 'Regular AR.', 'Mejoro nota.', 'I improve grade.', 'Mejoras vida.', 'You improve life.', 'Nota (Grade)', '', true),
      v('empeorar', 'empeorar', 'To worsen', 'Regular AR.', 'Empeoro tos.', 'I worsen cough.', 'Empeoras.', 'You get worse.', 'Tos (Cough)', '', true),
      v('progresar', 'progresar', 'To progress', 'Regular AR.', 'Progreso.', 'I progress.', 'Progresas.', 'You progress.', 'Paso (Step)', '', true),
      a('entero', 'entero', 'Whole', 'partido', 'Split', 'Integrity.', 'Pan entero.', 'Whole bread.', 'Corazón partido.', 'Broken heart.', 'Corazón (Heart)'),
      a('unido', 'unido', 'United', 'separado', 'Separated', 'Union.', 'Reino Unido.', 'United Kingdom.', 'Cuarto separado.', 'Separate room.', 'Reino (Kingdom)'),
      a('junto', 'junto', 'Together', 'aparte', 'Apart', 'Proximity.', 'Estamos juntos.', 'We are together.', 'Mesa aparte.', 'Separate table.', 'Estamos (We are)')
    ]
  },
  {
    date: '2026-02-23',
    words: [
      v('cortar', 'cortar', 'To cut', 'Regular AR.', 'Corto pelo.', 'I cut hair.', 'Cortas papel.', 'You cut paper.', 'Papel (Paper)', '', true),
      v('limpiar', 'limpiar', 'To clean', 'Regular AR.', 'Limpio casa.', 'I clean house.', 'Limpias coche.', 'You clean car.', 'Casa (House)', '', true),
      v('cocinar', 'cocinar', 'To cook', 'Regular AR.', 'Cocino cena.', 'I cook dinner.', 'Cocinas rico.', 'You cook tasty.', 'Cena (Dinner)', '', true),
      v('conducir', 'conducir', 'To drive', 'Irregular Yo (Conduzco).', 'Conduzco bus.', 'I drive bus.', 'Conduces mal.', 'You drive badly.', 'Bus (Bus)', 'conduz[co], conduces, conduce, conducimos, conducís, conducen', false),
      v('manejar', 'manejar', 'To handle/drive', 'Regular AR.', 'Manejo todo.', 'I handle all.', 'Manejas bien.', 'You drive well.', 'Todo (All)', '', true),
      v('preparar', 'preparar', 'To prepare', 'Regular AR.', 'Preparo té.', 'I prepare tea.', 'Preparas viaje.', 'You prepare trip.', 'Viaje (Trip)', '', true),
      v('servir', 'servir', 'To serve', 'E->I.', 'Sirvo vino.', 'I serve wine.', 'Sirves comida.', 'You serve food.', 'Vino (Wine)', 's[i]rvo, s[i]rves, s[i]rve, servimos, servís, s[i]rven', false),
      v('probar', 'probar', 'To try/taste', 'O->UE.', 'Pruebo sopa.', 'I taste soup.', 'Pruebas ropa.', 'You try clothes.', 'Sopa (Soup)', 'pr[ue]bo, pr[ue]bas, pr[ue]ba, probamos, probáis, pr[ue]ban', false),
      v('mezclar', 'mezclar', 'To mix', 'Regular AR.', 'Mezclo color.', 'I mix color.', 'Mezclas todo.', 'You mix all.', 'Color (Color)', '', true),
      v('decorar', 'decorar', 'To decorate', 'Regular AR.', 'Decoro sala.', 'I decorate room.', 'Decoras pastel.', 'You decorate cake.', 'Pastel (Cake)', '', true),
      a('evidente', 'evidente', 'Evident', 'dudoso', 'Doubtful', 'Certainty.', 'Error evidente.', 'Evident error.', 'Dato dudoso.', 'Doubtful data.', 'Error (Error)')
    ]
  },
  {
    date: '2026-02-24',
    words: [
      v('caminar', 'caminar', 'To walk', 'Regular AR.', 'Camino solo.', 'I walk alone.', 'Caminas mucho.', 'You walk a lot.', 'Solo (Alone)', '', true),
      v('bailar', 'bailar', 'To dance', 'Regular AR.', 'Bailo salsa.', 'I dance salsa.', 'Bailas bien.', 'You dance well.', 'Salsa (Salsa)', '', true),
      v('temer', 'temer', 'To fear', 'Regular ER.', 'Temo nada.', 'I fear nothing.', 'Temes caer.', 'You fear falling.', 'Nada (Nothing)', '', true),
      a('obvio', 'obvio', 'Obvious', 'oculto', 'Hidden', 'Visibility.', 'Razón obvia.', 'Obvious reason.', 'Tesoro oculto.', 'Hidden treasure.', 'Tesoro (Treasure)'),
      a('visible', 'visible', 'Visible', 'invisible', 'Invisible', 'Sight.', 'Estrella visible.', 'Visible star.', 'Mano invisible.', 'Invisible hand.', 'Estrella (Star)'),
      a('transparente', 'transparente', 'Transparent', 'opaco', 'Opaque', 'Clarity.', 'Vaso transparente.', 'Clear glass.', 'Cristal opaco.', 'Opaque glass.', 'Vaso (Glass)'),
      a('brillante', 'brillante', 'Bright', 'opaco', 'Dull', 'Light.', 'Sol brillante.', 'Bright sun.', 'Color opaco.', 'Dull color.', 'Sol (Sun)')
    ]
  },
  {
    date: '2026-02-25',
    words: [
      v('importar', 'importar', 'To matter', 'Regular AR.', 'Me importa.', 'It matters to me.', 'Te importa.', 'It matters to you.', 'Nada (Nothing)', '', true),
      v('intentar', 'intentar', 'To try', 'Regular AR.', 'Intento leer.', 'I try to read.', 'Intentas ver.', 'You try to see.', 'Leer (Read)', '', true),
      v('alcanzar', 'alcanzar', 'To reach', 'Regular AR.', 'Alcanzo cima.', 'I reach peak.', 'Alcanzas meta.', 'You reach goal.', 'Cima (Peak)', '', true),
      v('fracasar', 'fracasar', 'To fail', 'Regular AR.', 'Fracaso hoy.', 'I fail today.', 'Fracasas no.', 'You do not fail.', 'Hoy (Today)', '', true),
      v('triunfar', 'triunfar', 'To triumph', 'Regular AR.', 'Triunfo.', 'I triumph.', 'Triunfas.', 'You triumph.', 'Siempre (Always)', '', true),
      a('valioso', 'valioso', 'Valuable', 'sin valor', 'Worthless', 'Value.', 'Joya valiosa.', 'Valuable jewel.', 'Cosa sin valor.', 'Worthless thing.', 'Joya (Jewel)'),
      a('económico', 'económico', 'Economic', 'costoso', 'Costly', 'Money.', 'Coche económico.', 'Economic car.', 'Viaje costoso.', 'Costly trip.', 'Coche (Car)'),
      a('gratuito', 'gratuito', 'Free', 'pagado', 'Paid', 'Cost.', 'Entrada gratuita.', 'Free ticket.', 'Evento pagado.', 'Paid event.', 'Entrada (Ticket)')
    ]
  },
  {
    date: '2026-02-26',
    words: [
      v('responder', 'responder', 'To respond', 'Regular ER.', 'Respondo.', 'I respond.', 'Respondes.', 'You respond.', 'Duda (Doubt)', '', true),
      v('afirmar', 'afirmar', 'To affirm', 'Regular AR.', 'Afirmo esto.', 'I affirm this.', 'Afirmas eso.', 'You affirm that.', 'Verdad (Truth)', '', true),
      v('negar', 'negar', 'To deny', 'E->IE.', 'Niego todo.', 'I deny all.', 'Niegas culpa.', 'You deny guilt.', 'Culpa (Guilt)', 'n[ie]go, n[ie]gas, n[ie]ga, negamos, negáis, n[ie]gan', false),
      v('confirmar', 'confirmar', 'To confirm', 'Regular AR.', 'Confirmo cita.', 'I confirm date.', 'Confirmas.', 'You confirm.', 'Cita (Date)', '', true),
      v('rechazar', 'rechazar', 'To reject', 'Regular AR.', 'Rechazo plan.', 'I reject plan.', 'Rechazas oferta.', 'You reject offer.', 'Oferta (Offer)', '', true),
      a('importante', 'importante', 'Important', 'insignificante', 'Insignificant', 'Importance.', 'Dato importante.', 'Important fact.', 'Detalle insignificante.', 'Tiny detail.', 'Dato (Fact)'),
      a('útil', 'útil', 'Useful', 'inútil', 'Useless', 'Utility.', 'Herramienta útil.', 'Useful tool.', 'Cosa inútil.', 'Useless thing.', 'Herramienta (Tool)'),
      a('esencial', 'esencial', 'Essential', 'prescindible', 'Dispensable', 'Necessity.', 'Agua esencial.', 'Essential water.', 'Lujo prescindible.', 'Dispensable luxury.', 'Lujo (Luxury)'),
      a('fundamental', 'fundamental', 'Fundamental', 'secundario', 'Secondary', 'Basis.', 'Base fundamental.', 'Fundamental base.', 'Rol secundario.', 'Secondary role.', 'Base (Base)')
    ]
  },
  {
    date: '2026-02-27',
    words: [
      v('evitar', 'evitar', 'To avoid', 'Regular AR.', 'Evito golpe.', 'I avoid hit.', 'Evitas riesgo.', 'You avoid risk.', 'Riesgo (Risk)', '', true),
      v('formar', 'formar', 'To form', 'Regular AR.', 'Formo equipo.', 'I form team.', 'Formas parte.', 'You form part.', 'Equipo (Team)', '', true),
      v('desarrollar', 'desarrollar', 'To develop', 'Regular AR.', 'Desarrollo app.', 'I develop app.', 'Desarrollas plan.', 'You develop plan.', 'App (App)', '', true),
      v('establecer', 'establecer', 'To establish', 'Irregular Yo (Establezco).', 'Establezco ley.', 'I establish law.', 'Estableces paz.', 'You establish peace.', 'Ley (Law)', 'establez[co], estableces, establece, establecemos, establecéis, establecen', false),
      v('organizar', 'organizar', 'To organize', 'Regular AR.', 'Organizo fiesta.', 'I organize party.', 'Organizas todo.', 'You organize all.', 'Fiesta (Party)', '', true),
      v('planificar', 'planificar', 'To plan', 'Regular AR.', 'Planifico año.', 'I plan year.', 'Planificas viaje.', 'You plan trip.', 'Año (Year)', '', true),
      v('diseñar', 'diseñar', 'To design', 'Regular AR.', 'Diseño casa.', 'I design house.', 'Diseñas ropa.', 'You design clothes.', 'Casa (House)', '', true),
      a('probable', 'probable', 'Probable', 'improbable', 'Improbable', 'Chance.', 'Lluvia probable.', 'Probable rain.', 'Éxito improbable.', 'Improbable success.', 'Lluvia (Rain)'),
      a('cierto', 'cierto', 'True/Certain', 'dudoso', 'Doubtful', 'Truth.', 'Es cierto.', 'It is true.', 'Origen dudoso.', 'Doubtful origin.', 'Origen (Origin)')
    ]
  },
  {
    date: '2026-02-28',
    words: [
      v('sugerir', 'sugerir', 'To suggest', 'E->IE.', 'Sugiero ir.', 'I suggest going.', 'Sugieres ver.', 'You suggest seeing.', 'Ver (See)', 'sug[ie]ro, sug[ie]res, sug[ie]re, sugerimos, sugerís, sug[ie]ren', false),
      v('reconocer', 'reconocer', 'To recognize', 'Irregular Yo (Reconozco).', 'Reconozco voz.', 'I recognize voice.', 'Reconoces cara.', 'You recognize face.', 'Voz (Voice)', 'reconoz[co], reconoces, reconoce, reconocemos, reconocéis, reconocen', false),
      v('identificar', 'identificar', 'To identify', 'Regular AR.', 'Identifico ave.', 'I identify bird.', 'Identificas flor.', 'You identify flower.', 'Ave (Bird)', '', true),
      v('distinguir', 'distinguir', 'To distinguish', 'Irregular Yo (Distingo).', 'Distingo color.', 'I distinguish color.', 'Distingues mal.', 'You distinguish bad.', 'Color (Color)', 'distin[go], distingues, distingue, distinguimos, distinguís, distinguen', false),
      v('comparar', 'comparar', 'To compare', 'Regular AR.', 'Comparo precio.', 'I compare price.', 'Comparas todo.', 'You compare all.', 'Precio (Price)', '', true),
      v('contrastar', 'contrastar', 'To contrast', 'Regular AR.', 'Contrasto idea.', 'I contrast idea.', 'Contrastas luz.', 'You contrast light.', 'Idea (Idea)', '', true),
      v('relacionar', 'relacionar', 'To relate', 'Regular AR.', 'Relaciono dato.', 'I relate data.', 'Relacionas hecho.', 'You relate fact.', 'Hecho (Fact)', '', true),
      v('conectar', 'conectar', 'To connect', 'Regular AR.', 'Conecto cable.', 'I connect cable.', 'Conectas wifi.', 'You connect wifi.', 'Cable (Cable)', '', true),
      a('público', 'público', 'Public', 'privado', 'Private', 'Access.', 'Parque público.', 'Public park.', 'Club privado.', 'Private club.', 'Parque (Park)'),
      a('libre', 'libre', 'Free', 'ocupado', 'Busy/Occupied', 'Status.', 'Día libre.', 'Day off.', 'Baño ocupado.', 'Occupied bathroom.', 'Baño (Bathroom)'),
      a('disponible', 'disponible', 'Available', 'indisponible', 'Unavailable', 'Availability.', 'Plaza disponible.', 'Available seat.', 'Red indisponible.', 'Unavailable network.', 'Plaza (Seat)')
    ]
  },
  {
    date: '2026-03-01',
    words: [
      v('agradecer', 'agradecer', 'To thank', 'Irregular Yo (Agradezco).', 'Agradezco todo.', 'I appreciate all.', 'Agradeces flor.', 'You thank flower.', 'Todo (All)', 'agradez[co], agradeces, agradece, agradecemos, agradecéis, agradecen', false),
      v('nadar', 'nadar', 'To swim', 'Regular AR.', 'Nado bien.', 'I swim well.', 'Nadas rápido.', 'You swim fast.', 'Mar (Sea)', '', true),
      v('flotar', 'flotar', 'To float', 'Regular AR.', 'Floto agua.', 'I float water.', 'Flotas aire.', 'You float air.', 'Agua (Water)', '', true),
      v('hundirse', 'hundirse', 'To sink', 'Reflexive.', 'Me hundo.', 'I sink.', 'Te hundes.', 'You sink.', 'Barco (Boat)', '', true),
      v('volar', 'volar', 'To fly', 'O->UE.', 'Vuelo alto.', 'I fly high.', 'Vuelas lejos.', 'You fly far.', 'Ave (Bird)', 'v[ue]lo, v[ue]las, v[ue]la, volamos, voláis, v[ue]lan', false),
      v('saltar', 'saltar', 'To jump', 'Regular AR.', 'Salto muro.', 'I jump wall.', 'Saltas cuerda.', 'You jump rope.', 'Muro (Wall)', '', true),
      v('trepar', 'trepar', 'To climb', 'Regular AR.', 'Trepo árbol.', 'I climb tree.', 'Trepas roca.', 'You climb rock.', 'Árbol (Tree)', '', true),
      a('famoso', 'famoso', 'Famous', 'desconocido', 'Unknown', 'Fame.', 'Actor famoso.', 'Famous actor.', 'Lugar desconocido.', 'Unknown place.', 'Actor (Actor)'),
      a('común', 'común', 'Common', 'especial', 'Special', 'Rarity.', 'Nombre común.', 'Common name.', 'Día especial.', 'Special day.', 'Nombre (Name)'),
      a('normal', 'normal', 'Normal', 'extraño', 'Strange', 'Normality.', 'Vida normal.', 'Normal life.', 'Ruido extraño.', 'Strange noise.', 'Vida (Life)'),
      a('ordinario', 'ordinario', 'Ordinary', 'extraordinario', 'Extraordinary', 'Quality.', 'Día ordinario.', 'Ordinary day.', 'Talento extraordinario.', 'Extraordinary talent.', 'Talento (Talent)'),
      a('típico', 'típico', 'Typical', 'único', 'Unique', 'Type.', 'Plato típico.', 'Typical dish.', 'Pieza única.', 'Unique piece.', 'Plato (Dish)')
    ]
  },
  {
    date: '2026-03-02',
    words: [
      v('beber', 'beber', 'To drink', 'Regular ER.', 'Bebo agua.', 'I drink water.', 'Bebes vino.', 'You drink wine.', 'Vino (Wine)', '', true),
      v('descansar', 'descansar', 'To rest', 'Regular AR.', 'Descanso hoy.', 'I rest today.', 'Descansas bien.', 'You rest well.', 'Hoy (Today)', '', true),
      v('viajar', 'viajar', 'To travel', 'Regular AR.', 'Viajo lejos.', 'I travel far.', 'Viajas solo.', 'You travel alone.', 'Lejos (Far)', '', true),
      v('entregar', 'entregar', 'To deliver', 'Regular AR.', 'Entrego carta.', 'I deliver letter.', 'Entregas llave.', 'You deliver key.', 'Carta (Letter)', '', true),
      v('recoger', 'recoger', 'To pick up', 'Irregular Yo (Recojo).', 'Recojo mesa.', 'I clear table.', 'Recoges ropa.', 'You pick up clothes.', 'Mesa (Table)', 'reco[j]o, recoges, recoge, recogemos, recogéis, recogen', false),
      v('guardar', 'guardar', 'To keep/save', 'Regular AR.', 'Guardo dinero.', 'I save money.', 'Guardas secreto.', 'You keep secret.', 'Dinero (Money)', '', true),
      v('tirar', 'tirar', 'To throw', 'Regular AR.', 'Tiro bola.', 'I throw ball.', 'Tiras piedra.', 'You throw stone.', 'Bola (Ball)', '', true),
      v('conservar', 'conservar', 'To preserve', 'Regular AR.', 'Conservo foto.', 'I keep photo.', 'Conservas calma.', 'You keep calm.', 'Foto (Photo)', '', true),
      a('natural', 'natural', 'Natural', 'artificial', 'Artificial', 'Origin.', 'Luz natural.', 'Natural light.', 'Flor artificial.', 'Artificial flower.', 'Luz (Light)'),
      a('auténtico', 'auténtico', 'Authentic', 'falso', 'Fake', 'Authenticity.', 'Arte auténtico.', 'Authentic art.', 'Firma falsa.', 'Fake signature.', 'Arte (Art)'),
      a('genuino', 'genuino', 'Genuine', 'imitado', 'Imitated', 'Originality.', 'Cuero genuino.', 'Genuine leather.', 'Voz imitada.', 'Imitated voice.', 'Cuero (Leather)'),
      a('original', 'original', 'Original', 'copiado', 'Copied', 'Creation.', 'Idea original.', 'Original idea.', 'Texto copiado.', 'Copied text.', 'Idea (Idea)')
    ]
  }
];
