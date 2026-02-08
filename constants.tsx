
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

// --- HELPERS (Updated with Level & Topic) ---
// v(id, span, eng, level, topic, tip, ...)
const v = (id: string, s: string, t: string, level: WordLevel, topic: WordTopic, tip: string, ex1: string, ex1t: string, ex2: string, ex2t: string, nn: string, forms: string = '', reg: boolean = true, nuance?: WordNuance): Word => {
  let computedForms = forms;
  if (reg && !computedForms) computedForms = generateRegularForms(s);
  return { id, s, t, level, topic, type: 'verb', category: 'island', reg, forms: computedForms, grammarTip: tip, examples: [{ txt: ex1, eng: ex1t }, { txt: ex2, eng: ex2t }], nounNotes: nn, nuance };
};

const a = (id: string, s: string, t: string, level: WordLevel, topic: WordTopic, ant: string, antT: string, tip: string, ex1: string, ex1t: string, ex2: string, ex2t: string, nn: string, nuance?: WordNuance): Word => {
  let masc = s; let fem = s; if (s.endsWith('o')) fem = s.slice(0, -1) + 'a';
  const forms = `${masc}, ${fem}, ${pluralize(masc)}, ${pluralize(fem)}`;
  return { id, s, t, level, topic, type: 'adj', category: 'island', ant, antT, grammarTip: tip, forms, examples: [{ txt: ex1, eng: ex1t }, { txt: ex2, eng: ex2t }], nounNotes: nn, nuance };
};

const n = (id: string, s: string, t: string, level: WordLevel, topic: WordTopic, gender: 'm' | 'f', tip: string, ex1: string, ex1t: string, ex2: string, ex2t: string, nn: string): Word => {
  const article = gender === 'm' ? 'El' : 'La'; const pluralArticle = gender === 'm' ? 'Los' : 'Las';
  const forms = `${article} ${s}, ${pluralArticle} ${pluralize(s)}`;
  return { id, s, t, level, topic, type: 'noun', category: 'island', forms, grammarTip: `${gender === 'm' ? 'Masc' : 'Fem'}. ${tip}`, examples: [{ txt: ex1, eng: ex1t }, { txt: ex2, eng: ex2t }], nounNotes: nn };
};

const m = (id: string, s: string, t: string, level: WordLevel, topic: WordTopic, tip: string, ex1: string, ex1t: string, ex2: string, ex2t: string, category: string): Word => ({
  id, s, t, level, topic, type: 'misc', category, grammarTip: tip, forms: '', examples: [{ txt: ex1, eng: ex1t }, { txt: ex2, eng: ex2t }], nounNotes: 'Function Word'
});

export const EXTRA_CANDIDATES: Word[] = [
  m('y', 'y', 'And', 'A1', 'grammar', 'Change "y" to "e" if next word starts with "i-".', 'Tú y yo.', 'You and I.', 'Pan y agua.', 'Bread and water.', 'connector'),
  m('o', 'o', 'Or', 'A1', 'grammar', 'Change "o" to "u" if next word starts with "o-".', '¿Té o café?', 'Tea or coffee?', 'Blanco o negro.', 'White or black.', 'connector'),
  m('pero', 'pero', 'But', 'A1', 'grammar', 'Contrast ideas.', 'Pobre pero feliz.', 'Poor but happy.', 'Es tarde pero voy.', 'It is late but I go.', 'connector'),
  m('porque', 'porque', 'Because', 'A1', 'grammar', 'One word = because.', 'Como porque tengo hambre.', 'I eat because hungry.', 'Lloro porque duele.', 'I cry because it hurts.', 'connector'),
  m('si', 'si', 'If', 'A1', 'grammar', 'No accent mark! "Sí" = Yes.', 'Si puedes, ven.', 'If you can, come.', 'Si llueve, no voy.', 'If rains, no go.', 'connector'),
  m('cuando', 'cuando', 'When', 'A1', 'time', 'No accent.', 'Cuando llegues.', 'When you arrive.', 'Cuando como.', 'When I eat.', 'connector'),
  m('ahora', 'ahora', 'Now', 'A1', 'time', 'Right now.', 'Hazlo ahora.', 'Do it now.', 'Ahora o nunca.', 'Now or never.', 'time'),
  n('tiempo', 'tiempo', 'Time/Weather', 'A1', 'nature', 'm', 'Both clock and weather.', 'Hace buen tiempo.', 'Weather is good.', 'No tengo tiempo.', 'No time.', 'Buen (Good)'),
];

export const ISLAND_SLANG = [
  { s: "¡Qué fuerte!", t: "No way!", note: "For shocking news." },
  { s: "Postureo", t: "Showing off", note: "Posing for social media." },
  { s: "Estar de chill", t: "Chilling", note: "Relaxing." }
];

// --- 30-DAY CURRICULUM ---
export const VOCABULARY_DATA: DayPack[] = [
  {
    id: 'day-1',
    title: 'Day 1: The Foundation',
    words: [
      v('ser', 'ser', 'To be (Essence)', 'A1', 'daily', 'Permanent traits.', 'Soy de aquí.', 'I am from here.', 'Eres alto.', 'You are tall.', 'Aquí (Here)', '[soy], [eres], [es], [somos], [sois], [son]', false, N_SER_ESTAR),
      v('estar', 'estar', 'To be (State)', 'A1', 'daily', 'Temporary/Location.', 'Estoy bien.', 'I am well.', 'Estás en casa.', 'You are home.', 'Casa (House)', 'est[oy], est[ás], est[á], estamos, estáis, est[án]', false, N_SER_ESTAR),
      v('tener', 'tener', 'To have', 'A1', 'daily', 'Age/Possession.', 'Tengo frío.', 'I am cold.', 'Tienes un gato.', 'You have a cat.', 'Gato (Cat)', 'ten[go], t[ie]nes, t[ie]ne, tenemos, tenéis, t[ie]nen', false),
      v('hacer', 'hacer', 'To do/make', 'A1', 'work', 'Weather/Actions.', 'Hago la cama.', 'I make bed.', 'Hace sol.', 'It is sunny.', 'Cama (Bed)', 'ha[go], haces, hace, hacemos, hacéis, hacen', false),
      v('ir', 'ir', 'To go', 'A1', 'travel', 'Destination.', 'Voy al mar.', 'I go to sea.', 'Vas lejos.', 'You go far.', 'Mar (Sea)', '[voy], [vas], [va], [vamos], [vais], [van]', false),
      v('poder', 'poder', 'To be able', 'A1', 'abstract', 'O->UE.', 'Puedo ver.', 'I can see.', 'No puedes comer.', 'Cannot eat.', 'Ver (See)', 'p[ue]do, p[ue]des, p[ue]de, podemos, podéis, p[ue]den', false),
      v('saber', 'saber', 'To know', 'A1', 'abstract', 'Facts/Skills.', 'Sé cocinar.', 'I know cooking.', 'Sabes el camino.', 'Know the way.', 'Camino (Way)', '[sé], sabes, sabe, sabemos, sabéis, saben', false, N_SABER_CONOCER),
      v('querer', 'querer', 'To want', 'A1', 'feelings', 'E->IE.', 'Quiero agua.', 'Want water.', 'Quieres comer.', 'Want to eat.', 'Agua (Water)', 'qu[ie]ro, qu[ie]res, qu[ie]re, queremos, queréis, qu[ie]ren', false),
      v('ver', 'ver', 'To see', 'A1', 'daily', 'Vision.', 'Veo el sol.', 'I see sun.', 'Ves la luna.', 'See moon.', 'Luna (Moon)', 'v[eo], ves, ve, vemos, veis, ven', false, N_VER_MIRAR),
      v('dar', 'dar', 'To give', 'A1', 'social', 'Yo Doy.', 'Doy una flor.', 'Give flower.', 'Das amor.', 'Give love.', 'Flor (Flower)', 'd[oy], das, da, damos, dais, dan', false),
      a('grande', 'grande', 'Big', 'A1', 'daily', 'pequeño', 'Small', 'Shortens to "gran".', 'Isla grande.', 'Big island.', 'Ojo grande.', 'Big eye.', 'Ojo (Eye)'),
      a('bueno', 'bueno', 'Good', 'A1', 'daily', 'malo', 'Bad', 'Shortens to "buen".', 'Buen día.', 'Good day.', 'Libro bueno.', 'Good book.', 'Día (Day)'),
      a('nuevo', 'nuevo', 'New', 'A1', 'daily', 'viejo', 'Old', 'Brand new vs New to you.', 'Coche nuevo.', 'New car.', 'Nuevo coche.', 'New (to me) car.', 'Coche (Car)'),
      a('alto', 'alto', 'Tall/High', 'A1', 'daily', 'bajo', 'Short', 'Height.', 'Edificio alto.', 'Tall building.', 'Muro alto.', 'High wall.', 'Edificio (Building)'),
      a('largo', 'largo', 'Long', 'A1', 'daily', 'corto', 'Short', 'Not "Large"!', 'Pelo largo.', 'Long hair.', 'Camino largo.', 'Long road.', 'Pelo (Hair)'),
      a('mucho', 'mucho', 'Many', 'A1', 'abstract', 'poco', 'Few', 'Quantity.', 'Mucho dinero.', 'Much money.', 'Muchas gracias.', 'Many thanks.', 'Dinero (Money)'),
      a('mayor', 'mayor', 'Older', 'A1', 'social', 'menor', 'Younger', 'Comparison.', 'Hermano mayor.', 'Older brother.', 'Problema mayor.', 'Major problem.', 'Hermano (Brother)'),
      a('mejor', 'mejor', 'Better', 'A1', 'abstract', 'peor', 'Worse', 'Irregular.', 'Es mejor.', 'It is better.', 'Mejor amigo.', 'Best friend.', 'Amigo (Friend)'),
      a('abierto', 'abierto', 'Open', 'A1', 'daily', 'cerrado', 'Closed', 'State.', 'Puerta abierta.', 'Open door.', 'Ojos abiertos.', 'Open eyes.', 'Puerta (Door)'),
      a('posible', 'posible', 'Possible', 'A1', 'abstract', 'imposible', 'Impossible', 'Feasibility.', 'Es posible.', 'It is possible.', 'Misión posible.', 'Possible mission.', 'Misión (Mission)')
    ]
  },
  {
    id: 'day-2',
    title: 'Day 2: Senses & Colors',
    words: [
      v('decir', 'decir', 'To say', 'A1', 'social', 'Go-verb.', 'Digo hola.', 'I say hello.', 'Dices adiós.', 'You say bye.', 'Hola (Hello)', 'di[go], d[ic]es, d[ic]e, decimos, decís, d[ic]en', false),
      v('venir', 'venir', 'To come', 'A1', 'travel', 'Go-verb.', 'Vengo aquí.', 'I come here.', 'Vienes tarde.', 'Come late.', 'Tarde (Late)', 'ven[go], v[ie]nes, v[ie]ne, venimos, venís, v[ie]nen', false),
      v('oír', 'oír', 'To hear', 'A1', 'daily', 'Irregular.', 'Oigo ruido.', 'Hear noise.', 'Oyes música.', 'Hear music.', 'Ruido (Noise)', 'oi[go], o[y]es, o[y]e, oímos, oís, o[y]en', false, N_OIR_ESCUCHAR),
      v('gustar', 'gustar', 'To like', 'A1', 'feelings', 'Backwards.', 'Me gusta.', 'I like it.', 'Te gusta.', 'You like it.', 'Me (To me)', 'gusto, gustas, gusta, gustamos, gustáis, gustan', true),
      v('comer', 'comer', 'To eat', 'A1', 'food', 'Regular.', 'Como pan.', 'Eat bread.', 'Comes fruta.', 'Eat fruit.', 'Pan (Bread)', '', true),
      v('beber', 'beber', 'To drink', 'A1', 'food', 'Regular.', 'Bebo agua.', 'Drink water.', 'Bebes vino.', 'Drink wine.', 'Vino (Wine)', '', true),
      v('dormir', 'dormir', 'To sleep', 'A1', 'daily', 'O->UE.', 'Duermo bien.', 'Sleep well.', 'Duermes mucho.', 'Sleep a lot.', 'Bien (Well)', 'd[ue]rmo, d[ue]rmes, d[ue]rme, dormimos, dormís, d[ue]rmen', false),
      v('jugar', 'jugar', 'To play', 'A1', 'daily', 'U->UE.', 'Juego fútbol.', 'Play soccer.', 'Juegas bien.', 'Play well.', 'Fútbol (Soccer)', 'j[ue]go, j[ue]gas, j[ue]ga, jugamos, jugáis, j[ue]gan', false, N_TOCAR_JUGAR),
      v('hablar', 'hablar', 'To speak', 'A1', 'social', 'Regular.', 'Hablo español.', 'Speak Spanish.', 'Hablas rápido.', 'Speak fast.', 'Rápido (Fast)', '', true),
      v('llamar', 'llamar', 'To call', 'A1', 'social', 'Regular.', 'Llamo a mamá.', 'Call mom.', 'Llamas un taxi.', 'Call taxi.', 'Mamá (Mom)', '', true),
      a('rojo', 'rojo', 'Red', 'A1', 'art', '', '', 'Color.', 'Coche rojo.', 'Red car.', 'Flor roja.', 'Red flower.', 'Flor (Flower)'),
      a('azul', 'azul', 'Blue', 'A1', 'art', '', '', 'Color.', 'Cielo azul.', 'Blue sky.', 'Mar azul.', 'Blue sea.', 'Cielo (Sky)'),
      a('blanco', 'blanco', 'White', 'A1', 'art', 'negro', 'Black', 'Color.', 'Nieve blanca.', 'White snow.', 'Casa blanca.', 'White house.', 'Nieve (Snow)'),
      a('negro', 'negro', 'Black', 'A1', 'art', 'blanco', 'White', 'Color.', 'Gato negro.', 'Black cat.', 'Noche negra.', 'Black night.', 'Noche (Night)'),
      a('verde', 'verde', 'Green', 'A1', 'art', '', '', 'Color.', 'Árbol verde.', 'Green tree.', 'Luz verde.', 'Green light.', 'Árbol (Tree)'),
      a('amarillo', 'amarillo', 'Yellow', 'A1', 'art', '', '', 'Color.', 'Sol amarillo.', 'Yellow sun.', 'Flor amarilla.', 'Yellow flower.', 'Sol (Sun)'),
      a('dulce', 'dulce', 'Sweet', 'A1', 'food', 'salado', 'Salty', 'Taste.', 'Fruta dulce.', 'Sweet fruit.', 'Caramelo dulce.', 'Sweet candy.', 'Fruta (Fruit)'),
      a('fuerte', 'fuerte', 'Strong', 'A1', 'body', 'débil', 'Weak', 'Strength.', 'Café fuerte.', 'Strong coffee.', 'Viento fuerte.', 'Strong wind.', 'Viento (Wind)'),
      a('claro', 'claro', 'Clear', 'A1', 'art', 'oscuro', 'Dark', 'Light.', 'Día claro.', 'Clear day.', 'Agua clara.', 'Clear water.', 'Agua (Water)'),
      a('oscuro', 'oscuro', 'Dark', 'A1', 'art', 'claro', 'Light', 'Light.', 'Cuarto oscuro.', 'Dark room.', 'Noche oscura.', 'Dark night.', 'Cuarto (Room)')
    ]
  },
  {
    id: 'day-3',
    title: 'Day 3: Movement',
    words: [
      v('salir', 'salir', 'To leave', 'A1', 'travel', 'Go-verb.', 'Salgo ahora.', 'Leave now.', 'Sales pronto.', 'Leave soon.', 'Pronto (Soon)', 'sal[go], sales, sale, salimos, salís, salen', false),
      v('entrar', 'entrar', 'To enter', 'A1', 'travel', 'Regular.', 'Entro en casa.', 'Enter home.', 'Entras ahí.', 'Enter there.', 'Ahí (There)', '', true),
      v('volver', 'volver', 'To return', 'A1', 'travel', 'O->UE.', 'Vuelvo tarde.', 'Return late.', 'Vuelves a casa.', 'Return home.', 'Tarde (Late)', 'v[ue]lvo, v[ue]lves, v[ue]lve, volvemos, volvéis, v[ue]lven', false),
      v('caer', 'caer', 'To fall', 'A2', 'daily', 'Irregular.', 'Caigo bien.', 'I am liked.', 'Caes al suelo.', 'Fall to ground.', 'Suelo (Ground)', 'cai[go], caes, cae, caemos, caéis, caen', false),
      v('traer', 'traer', 'To bring', 'A2', 'daily', 'Irregular.', 'Traigo pan.', 'Bring bread.', 'Traes vino.', 'Bring wine.', 'Vino (Wine)', 'trai[go], traes, trae, traemos, traéis, traen', false, N_LLEVAR_TRAER),
      v('llegar', 'llegar', 'To arrive', 'A1', 'travel', 'Regular.', 'Llego hoy.', 'Arrive today.', 'Llegas mañana.', 'Arrive tomorrow.', 'Hoy (Today)', '', true),
      v('llevar', 'llevar', 'To carry/wear', 'A1', 'daily', 'Regular.', 'Llevo gafas.', 'Wear glasses.', 'Llevas una caja.', 'Carry box.', 'Gafas (Glasses)', '', true, N_LLEVAR_TRAER),
      v('andar', 'andar', 'To walk', 'A1', 'travel', 'Regular.', 'Ando mucho.', 'Walk a lot.', 'Andas rápido.', 'Walk fast.', 'Mucho (A lot)', '', true),
      v('correr', 'correr', 'To run', 'A1', 'travel', 'Regular.', 'Corro rápido.', 'Run fast.', 'Corres lejos.', 'Run far.', 'Lejos (Far)', '', true),
      v('viajar', 'viajar', 'To travel', 'A1', 'travel', 'Regular.', 'Viajo en tren.', 'Travel by train.', 'Viajas solo.', 'Travel alone.', 'Tren (Train)', '', true),
      a('pequeño', 'pequeño', 'Small', 'A1', 'daily', 'grande', 'Big', 'Size.', 'Mundo pequeño.', 'Small world.', 'Casa pequeña.', 'Small house.', 'Mundo (World)'),
      a('malo', 'malo', 'Bad', 'A1', 'abstract', 'bueno', 'Good', 'Quality.', 'Día malo.', 'Bad day.', 'Idea mala.', 'Bad idea.', 'Idea (Idea)'),
      a('viejo', 'viejo', 'Old', 'A1', 'daily', 'nuevo', 'New', 'Age.', 'Libro viejo.', 'Old book.', 'Ropa vieja.', 'Old clothes.', 'Libro (Book)'),
      a('bajo', 'bajo', 'Short', 'A1', 'daily', 'alto', 'Tall', 'Height.', 'Techo bajo.', 'Low ceiling.', 'Precio bajo.', 'Low price.', 'Techo (Ceiling)'),
      a('corto', 'corto', 'Short', 'A1', 'daily', 'largo', 'Long', 'Length.', 'Tiempo corto.', 'Short time.', 'Vida corta.', 'Short life.', 'Tiempo (Time)'),
      a('poco', 'poco', 'Little/Few', 'A1', 'abstract', 'mucho', 'Much', 'Quantity.', 'Poco dinero.', 'Little money.', 'Poca gente.', 'Few people.', 'Gente (People)'),
      a('menor', 'menor', 'Younger', 'A2', 'social', 'mayor', 'Older', 'Comparison.', 'Hermana menor.', 'Younger sister.', 'Mal menor.', 'Lesser evil.', 'Hermana (Sister)'),
      a('peor', 'peor', 'Worse', 'A1', 'abstract', 'mejor', 'Better', 'Comparison.', 'Es peor.', 'It is worse.', 'Peor enemigo.', 'Worst enemy.', 'Enemigo (Enemy)'),
      a('cerrado', 'cerrado', 'Closed', 'A1', 'daily', 'abierto', 'Open', 'State.', 'Tienda cerrada.', 'Closed shop.', 'Caso cerrado.', 'Case closed.', 'Tienda (Shop)'),
      a('imposible', 'imposible', 'Impossible', 'A1', 'abstract', 'posible', 'Possible', 'Feasibility.', 'Nada imposible.', 'Nothing impossible.', 'Misión imposible.', 'Mission impossible.', 'Nada (Nothing)')
    ]
  },
  {
    id: 'day-4',
    title: 'Day 4: Mind & Emotion',
    words: [
      v('pensar', 'pensar', 'To think', 'A2', 'abstract', 'E->IE.', 'Pienso eso.', 'Think so.', 'Piensas bien.', 'Think well.', 'Eso (That)', 'p[ie]nso, p[ie]nsas, p[ie]nsa, pensamos, pensáis, p[ie]nsan', false),
      v('creer', 'creer', 'To believe', 'A2', 'abstract', 'Regular.', 'Creo en ti.', 'Believe in you.', 'Crees en Dios.', 'Believe in God.', 'Ti (You)', '', true),
      v('sentir', 'sentir', 'To feel', 'A2', 'feelings', 'E->IE.', 'Siento pena.', 'Feel pity.', 'Sientes frío.', 'Feel cold.', 'Pena (Pity)', 's[ie]nto, s[ie]ntes, s[ie]nte, sentimos, sentís, s[ie]nten', false),
      v('entender', 'entender', 'To understand', 'A2', 'abstract', 'E->IE.', 'Entiendo todo.', 'Understand all.', 'Entiendes nada.', 'Understand nothing.', 'Todo (All)', 'ent[ie]ndo, ent[ie]ndes, ent[ie]nde, entendemos, entendéis, ent[ie]nden', false),
      v('conocer', 'conocer', 'To know', 'A2', 'social', 'Irregular.', 'Conozco a Ana.', 'Know Ana.', 'Conoces París.', 'Know Paris.', 'Ana (Name)', 'conoz[co], conoces, conoce, conocemos, conocéis, conocen', false, N_SABER_CONOCER),
      v('recordar', 'recordar', 'To remember', 'A2', 'abstract', 'O->UE.', 'Recuerdo tu cara.', 'Recall face.', 'Recuerdas el día.', 'Recall day.', 'Cara (Face)', 'rec[ue]rdo, rec[ue]rdas, rec[ue]rda, recordamos, recordáis, rec[ue]rdan', false),
      v('olvidar', 'olvidar', 'To forget', 'A2', 'abstract', 'Regular.', 'Olvido nombres.', 'Forget names.', 'Olvidas todo.', 'Forget all.', 'Nombres (Names)', '', true),
      v('esperar', 'esperar', 'To wait/hope', 'A2', 'abstract', 'Regular.', 'Espero el bus.', 'Wait for bus.', 'Esperas ganar.', 'Hope to win.', 'Bus (Bus)', '', true),
      v('buscar', 'buscar', 'To search', 'A1', 'daily', 'Regular.', 'Busco trabajo.', 'Look for work.', 'Buscas las llaves.', 'Look for keys.', 'Trabajo (Work)', '', true),
      v('encontrar', 'encontrar', 'To find', 'A2', 'daily', 'O->UE.', 'Encuentro paz.', 'Find peace.', 'Encuentras oro.', 'Find gold.', 'Paz (Peace)', 'enc[ue]ntro, enc[ue]ntras, enc[ue]ntra, encontramos, encontráis, enc[ue]ntran', false),
      a('feliz', 'feliz', 'Happy', 'A1', 'feelings', 'triste', 'Sad', 'Emotion.', 'Soy feliz.', 'I am happy.', 'Final feliz.', 'Happy ending.', 'Final (Ending)'),
      a('triste', 'triste', 'Sad', 'A1', 'feelings', 'feliz', 'Happy', 'Emotion.', 'Estoy triste.', 'I am sad.', 'Canción triste.', 'Sad song.', 'Canción (Song)'),
      a('inteligente', 'inteligente', 'Intelligent', 'A1', 'social', 'tonto', 'Stupid', 'Mind.', 'Chica inteligente.', 'Smart girl.', 'Perro inteligente.', 'Smart dog.', 'Chica (Girl)'),
      a('tonto', 'tonto', 'Silly', 'A1', 'social', 'listo', 'Smart', 'Mind.', 'No seas tonto.', 'Don\'t be silly.', 'Pregunta tonta.', 'Silly question.', 'Pregunta (Question)'),
      a('interesante', 'interesante', 'Interesting', 'A1', 'abstract', 'aburrido', 'Boring', 'Mind.', 'Libro interesante.', 'Interesting book.', 'Vida interesante.', 'Interesting life.', 'Vida (Life)'),
      a('aburrido', 'aburrido', 'Boring', 'A1', 'abstract', 'divertido', 'Fun', 'Ser=Boring, Estar=Bored.', 'Estoy aburrido.', 'I am bored.', 'Es aburrido.', 'It is boring.', 'Es (It is)'),
      a('importante', 'importante', 'Important', 'A1', 'abstract', '', '', 'Value.', 'Cosa importante.', 'Important thing.', 'Día importante.', 'Important day.', 'Cosa (Thing)'),
      a('necesario', 'necesario', 'Necessary', 'A2', 'abstract', 'innecesario', 'Unnecessary', 'Need.', 'Es necesario.', 'It is necessary.', 'Mal necesario.', 'Necessary evil.', 'Mal (Evil)'),
      a('solo', 'solo', 'Alone', 'A2', 'social', 'juntos', 'Together', 'Social.', 'Estoy solo.', 'I am alone.', 'Café solo.', 'Black coffee.', 'Café (Coffee)'),
      a('juntos', 'juntos', 'Together', 'A1', 'social', 'separados', 'Separated', 'Social.', 'Vamos juntos.', 'Go together.', 'Estamos juntos.', 'Are together.', 'Vamos (We go)')
    ]
  },
  {
    id: 'day-5',
    title: 'Day 5: Daily Routine',
    words: [
      v('lavar', 'lavar', 'To wash', 'A1', 'daily', 'Regular.', 'Lavo la ropa.', 'Wash clothes.', 'Lavas el coche.', 'Wash car.', 'Ropa (Clothes)', '', true),
      v('limpiar', 'limpiar', 'To clean', 'A1', 'daily', 'Regular.', 'Limpio la casa.', 'Clean house.', 'Limpias la mesa.', 'Clean table.', 'Mesa (Table)', '', true),
      v('cocinar', 'cocinar', 'To cook', 'A1', 'food', 'Regular.', 'Cocino arroz.', 'Cook rice.', 'Cocinas muy bien.', 'Cook well.', 'Arroz (Rice)', '', true),
      v('comprar', 'comprar', 'To buy', 'A1', 'daily', 'Regular.', 'Compro pan.', 'Buy bread.', 'Compras leche.', 'Buy milk.', 'Leche (Milk)', '', true),
      v('vender', 'vender', 'To sell', 'A1', 'work', 'Regular.', 'Vendo flores.', 'Sell flowers.', 'Vendes libros.', 'Sell books.', 'Libros (Books)', '', true),
      v('abrir', 'abrir', 'To open', 'A1', 'daily', 'Regular.', 'Abro la puerta.', 'Open door.', 'Abres la caja.', 'Open box.', 'Puerta (Door)', '', true),
      v('cerrar', 'cerrar', 'To close', 'A1', 'daily', 'E->IE.', 'Cierro los ojos.', 'Close eyes.', 'Cierras la boca.', 'Close mouth.', 'Boca (Mouth)', 'c[ie]rro, c[ie]rras, c[ie]rra, cerramos, cerráis, c[ie]rran', false),
      v('poner', 'poner', 'To put', 'A1', 'daily', 'Go-verb.', 'Pongo la mesa.', 'Set table.', 'Pones sal.', 'Put salt.', 'Sal (Salt)', 'pon[go], pones, pone, ponemos, ponéis, ponen', false),
      v('tomar', 'tomar', 'To take/drink', 'A1', 'daily', 'Regular.', 'Tomo café.', 'Take coffee.', 'Tomas el bus.', 'Take bus.', 'Bus (Bus)', '', true),
      v('vivir', 'vivir', 'To live', 'A1', 'daily', 'Regular.', 'Vivo aquí.', 'Live here.', 'Vives bien.', 'Live well.', 'Aquí (Here)', '', true),
      a('limpio', 'limpio', 'Clean', 'A1', 'daily', 'sucio', 'Dirty', 'Hygiene.', 'Agua limpia.', 'Clean water.', 'Aire limpio.', 'Clean air.', 'Aire (Air)'),
      a('sucio', 'sucio', 'Dirty', 'A1', 'daily', 'limpio', 'Clean', 'Hygiene.', 'Suelo sucio.', 'Dirty floor.', 'Mano sucia.', 'Dirty hand.', 'Suelo (Floor)'),
      a('lleno', 'lleno', 'Full', 'A2', 'daily', 'vacío', 'Empty', 'Capacity.', 'Vaso lleno.', 'Full glass.', 'Luna llena.', 'Full moon.', 'Vaso (Glass)'),
      a('vacío', 'vacío', 'Empty', 'A2', 'daily', 'lleno', 'Full', 'Capacity.', 'Caja vacía.', 'Empty box.', 'Calle vacía.', 'Empty street.', 'Calle (Street)'),
      a('seco', 'seco', 'Dry', 'A2', 'nature', 'mojado', 'Wet', 'State.', 'Ropa seca.', 'Dry clothes.', 'Clima seco.', 'Dry climate.', 'Clima (Climate)'),
      a('mojado', 'mojado', 'Wet', 'A2', 'nature', 'seco', 'Dry', 'State.', 'Pelo mojado.', 'Wet hair.', 'Suelo mojado.', 'Wet floor.', 'Pelo (Hair)'),
      a('caliente', 'caliente', 'Hot', 'A1', 'nature', 'frío', 'Cold', 'Temp.', 'Agua caliente.', 'Hot water.', 'Plato caliente.', 'Hot dish.', 'Plato (Dish)'),
      a('frío', 'frío', 'Cold', 'A1', 'nature', 'caliente', 'Hot', 'Temp.', 'Viento frío.', 'Cold wind.', 'Invierno frío.', 'Cold winter.', 'Invierno (Winter)'),
      a('rápido', 'rápido', 'Fast', 'A1', 'travel', 'lento', 'Slow', 'Speed.', 'Coche rápido.', 'Fast car.', 'Comida rápida.', 'Fast food.', 'Comida (Food)'),
      a('lento', 'lento', 'Slow', 'A1', 'travel', 'rápido', 'Fast', 'Speed.', 'Tortuga lenta.', 'Slow turtle.', 'Internet lento.', 'Slow internet.', 'Tortuga (Turtle)')
    ]
  },
  {
    id: 'day-6',
    title: 'Day 6: Communication',
    words: [
      v('preguntar', 'preguntar', 'To ask', 'A1', 'social', 'Regular.', 'Pregunto por qué.', 'Ask why.', 'Preguntas la hora.', 'Ask time.', 'Hora (Time)', '', true, N_PEDIR_PREGUNTAR),
      v('contestar', 'contestar', 'To answer', 'A2', 'social', 'Regular.', 'Contesto todo.', 'Answer all.', 'Contestas mal.', 'Answer badly.', 'Mal (Badly)', '', true),
      v('escribir', 'escribir', 'To write', 'A1', 'art', 'Regular.', 'Escribo cartas.', 'Write letters.', 'Escribes libros.', 'Write books.', 'Cartas (Letters)', '', true),
      v('leer', 'leer', 'To read', 'A1', 'art', 'Regular.', 'Leo noticias.', 'Read news.', 'Lees mucho.', 'Read a lot.', 'Noticias (News)', '', true),
      v('escuchar', 'escuchar', 'To listen', 'A1', 'daily', 'Regular.', 'Escucho música.', 'Listen to music.', 'Escuchas bien.', 'Listen well.', 'Música (Music)', '', true, N_OIR_ESCUCHAR),
      v('enseñar', 'enseñar', 'To teach', 'A2', 'social', 'Regular.', 'Enseño español.', 'Teach Spanish.', 'Enseñas fotos.', 'Show photos.', 'Fotos (Photos)', '', true),
      v('aprender', 'aprender', 'To learn', 'A1', 'social', 'Regular.', 'Aprendo rápido.', 'Learn fast.', 'Aprendes a leer.', 'Learn to read.', 'Rápido (Fast)', '', true),
      v('estudiar', 'estudiar', 'To study', 'A1', 'social', 'Regular.', 'Estudio arte.', 'Study art.', 'Estudias hoy.', 'Study today.', 'Arte (Art)', '', true),
      v('comprender', 'comprender', 'To comprehend', 'A2', 'abstract', 'Regular.', 'Comprendo.', 'I comprehend.', 'Comprendes.', 'You comprehend.', 'Sí (Yes)', '', true),
      v('explicar', 'explicar', 'To explain', 'A2', 'social', 'Regular.', 'Explico la regla.', 'Explain rule.', 'Explicas el plan.', 'Explain plan.', 'Regla (Rule)', '', true),
      a('fácil', 'fácil', 'Easy', 'A1', 'abstract', 'difícil', 'Difficult', 'Difficulty.', 'Es fácil.', 'It is easy.', 'Español fácil.', 'Easy Spanish.', 'Español (Spanish)'),
      a('difícil', 'difícil', 'Difficult', 'A1', 'abstract', 'fácil', 'Easy', 'Difficulty.', 'Trabajo difícil.', 'Hard work.', 'Vida difícil.', 'Hard life.', 'Trabajo (Work)'),
      a('correcto', 'correcto', 'Correct', 'A2', 'abstract', 'incorrecto', 'Incorrect', 'Accuracy.', 'Respuesta correcta.', 'Correct answer.', 'Es correcto.', 'It is correct.', 'Respuesta (Answer)'),
      a('falso', 'falso', 'False', 'A2', 'abstract', 'verdadero', 'True', 'Truth.', 'Amigo falso.', 'Fake friend.', 'Noticia falsa.', 'Fake news.', 'Noticia (News)'),
      a('libre', 'libre', 'Free', 'A2', 'social', 'ocupado', 'Busy', 'Availability.', 'Soy libre.', 'I am free.', 'Silla libre.', 'Free chair.', 'Silla (Chair)'),
      a('ocupado', 'ocupado', 'Busy', 'A2', 'social', 'libre', 'Free', 'Availability.', 'Estoy ocupado.', 'I am busy.', 'Línea ocupada.', 'Busy line.', 'Línea (Line)'),
      a('público', 'público', 'Public', 'B1', 'society', 'privado', 'Private', 'Social.', 'Baño público.', 'Public toilet.', 'Vida pública.', 'Public life.', 'Baño (Toilet)'),
      a('privado', 'privado', 'Private', 'B1', 'society', 'público', 'Public', 'Social.', 'Fiesta privada.', 'Private party.', 'Número privado.', 'Private number.', 'Fiesta (Party)'),
      a('listo', 'listo', 'Ready/Smart', 'A2', 'daily', '', '', 'Ser=Smart, Estar=Ready.', 'Estoy listo.', 'I am ready.', 'Es listo.', 'He is smart.', 'Él (He)'),
      a('seguro', 'seguro', 'Sure/Safe', 'A2', 'abstract', 'inseguro', 'Unsure', 'Certainty.', 'Estoy seguro.', 'I am sure.', 'Lugar seguro.', 'Safe place.', 'Lugar (Place)')
    ]
  },
  {
    id: 'day-7',
    title: 'Day 7: Exchange',
    words: [
      v('pagar', 'pagar', 'To pay', 'A1', 'work', 'Regular.', 'Pago la cuenta.', 'Pay bill.', 'Pagas tú.', 'You pay.', 'Cuenta (Bill)', '', true),
      v('costar', 'costar', 'To cost', 'A1', 'work', 'O->UE.', 'Cuesta mucho.', 'Costs a lot.', 'Cuestan poco.', 'Cost little.', 'Poco (Little)', 'c[ue]sto, c[ue]stas, c[ue]sta, costamos, costáis, c[ue]stan', false),
      v('cambiar', 'cambiar', 'To change', 'A2', 'abstract', 'Regular.', 'Cambio dinero.', 'Change money.', 'Cambias de idea.', 'Change mind.', 'Idea (Mind)', '', true),
      v('deber', 'deber', 'To owe/must', 'A2', 'work', 'Regular.', 'Debo ir.', 'Must go.', 'Debes dinero.', 'Owe money.', 'Dinero (Money)', '', true),
      v('necesitar', 'necesitar', 'To need', 'A1', 'daily', 'Regular.', 'Necesito ayuda.', 'Need help.', 'Necesitas tiempo.', 'Need time.', 'Ayuda (Help)', '', true),
      v('ganar', 'ganar', 'To win/earn', 'A2', 'work', 'Regular.', 'Gano dinero.', 'Earn money.', 'Ganas el juego.', 'Win game.', 'Juego (Game)', '', true),
      v('perder', 'perder', 'To lose', 'A2', 'work', 'E->IE.', 'Pierdo peso.', 'Lose weight.', 'Pierdes tiempo.', 'Lose time.', 'Peso (Weight)', 'p[ie]rdo, p[ie]rdes, p[ie]rde, perdemos, perdéis, p[ie]rden', false),
      v('ayudar', 'ayudar', 'To help', 'A1', 'social', 'Regular.', 'Ayudo en casa.', 'Help at home.', 'Ayudas a mamá.', 'Help mom.', 'Casa (Home)', '', true),
      v('recibir', 'recibir', 'To receive', 'A2', 'work', 'Regular.', 'Recibo email.', 'Receive email.', 'Recibes cartas.', 'Receive letters.', 'Cartas (Letters)', '', true),
      v('enviar', 'enviar', 'To send', 'A2', 'work', 'Regular.', 'Envío flores.', 'Send flowers.', 'Envías dinero.', 'Send money.', 'Flores (Flowers)', '', true),
      a('rico', 'rico', 'Rich/Tasty', 'A1', 'work', 'pobre', 'Poor', 'Wealth.', 'Hombre rico.', 'Rich man.', 'País rico.', 'Rich country.', 'País (Country)', N_RICO),
      a('pobre', 'pobre', 'Poor', 'A1', 'work', 'rico', 'Rich', 'Wealth.', 'Mujer pobre.', 'Poor woman.', 'Idea pobre.', 'Poor idea.', 'Mujer (Woman)'),
      a('caro', 'caro', 'Expensive', 'A1', 'work', 'barato', 'Cheap', 'Cost.', 'Coche caro.', 'Expensive car.', 'Vida cara.', 'Expensive life.', 'Coche (Car)'),
      a('barato', 'barato', 'Cheap', 'A1', 'work', 'caro', 'Expensive', 'Cost.', 'Vino barato.', 'Cheap wine.', 'Ropa barata.', 'Cheap clothes.', 'Vino (Wine)'),
      a('gratis', 'gratis', 'Free (Cost)', 'A2', 'work', 'pagado', 'Paid', 'Cost.', 'Entrada gratis.', 'Free entry.', 'Comida gratis.', 'Free food.', 'Entrada (Entry)'),
      a('propio', 'propio', 'Own', 'A2', 'abstract', 'ajeno', 'Others', 'Possession.', 'Casa propia.', 'Own house.', 'Ojos propios.', 'Own eyes.', 'Ojos (Eyes)'),
      a('ajeno', 'ajeno', 'Others', 'B1', 'society', 'propio', 'Own', 'Possession.', 'Dolor ajeno.', 'Others\' pain.', 'Cosa ajena.', 'Other\'s thing.', 'Dolor (Pain)'),
      a('útil', 'útil', 'Useful', 'A2', 'abstract', 'inútil', 'Useless', 'Utility.', 'Herramienta útil.', 'Useful tool.', 'Dato útil.', 'Useful fact.', 'Dato (Fact)'),
      a('inútil', 'inútil', 'Useless', 'A2', 'abstract', 'útil', 'Useful', 'Utility.', 'Es inútil.', 'It is useless.', 'Gasto inútil.', 'Useless expense.', 'Gasto (Expense)'),
      a('suficiente', 'suficiente', 'Enough', 'A2', 'abstract', 'insuficiente', 'Insufficient', 'Quantity.', 'Es suficiente.', 'It is enough.', 'Dinero suficiente.', 'Enough money.', 'Dinero (Money)')
    ]
  },
  {
    id: 'day-8',
    title: 'Day 8: Creation',
    words: [
      v('crear', 'crear', 'To create', 'A2', 'art', 'Regular.', 'Creo arte.', 'Create art.', 'Creas mundos.', 'Create worlds.', 'Mundo (World)', '', true),
      v('construir', 'construir', 'To build', 'A2', 'work', 'Irregular.', 'Construyo casas.', 'Build houses.', 'Construyes puentes.', 'Build bridges.', 'Casas (Houses)', 'constru[y]o, constru[y]es, constru[y]e, construimos, construís, constru[y]en', false),
      v('romper', 'romper', 'To break', 'A2', 'daily', 'Regular.', 'Rompo el vaso.', 'Break glass.', 'Rompes la ley.', 'Break law.', 'Ley (Law)', '', true),
      v('cortar', 'cortar', 'To cut', 'A2', 'daily', 'Regular.', 'Corto papel.', 'Cut paper.', 'Cortas pelo.', 'Cut hair.', 'Papel (Paper)', '', true),
      v('pegar', 'pegar', 'To stick/hit', 'A2', 'art', 'Regular.', 'Pego el sello.', 'Stick stamp.', 'Pegas fuerte.', 'Hit hard.', 'Sello (Stamp)', '', true),
      v('pintar', 'pintar', 'To paint', 'A1', 'art', 'Regular.', 'Pinto paredes.', 'Paint walls.', 'Pintas cuadros.', 'Paint pictures.', 'Paredes (Walls)', '', true),
      v('arreglar', 'arreglar', 'To fix', 'A2', 'daily', 'Regular.', 'Arreglo el coche.', 'Fix car.', 'Arreglas todo.', 'Fix everything.', 'Todo (Everything)', '', true),
      v('preparar', 'preparar', 'To prepare', 'A1', 'daily', 'Regular.', 'Preparo cena.', 'Prepare dinner.', 'Preparas café.', 'Prepare coffee.', 'Cena (Dinner)', '', true),
      v('usar', 'usar', 'To use', 'A1', 'daily', 'Regular.', 'Uso el móvil.', 'Use mobile.', 'Usas gafas.', 'Use glasses.', 'Móvil (Mobile)', '', true),
      v('funcionar', 'funcionar', 'To function', 'A2', 'tech', 'Regular.', 'Funciona bien.', 'Works well.', 'No funciona.', 'Doesn\'t work.', 'Bien (Well)', '', true),
      a('roto', 'roto', 'Broken', 'A2', 'daily', 'entero', 'Whole', 'State.', 'Vaso roto.', 'Broken glass.', 'Corazón roto.', 'Broken heart.', 'Vaso (Glass)'),
      a('entero', 'entero', 'Whole', 'A2', 'abstract', 'roto', 'Broken', 'State.', 'Día entero.', 'Whole day.', 'Mundo entero.', 'Whole world.', 'Mundo (World)'),
      a('perfecto', 'perfecto', 'Perfect', 'A1', 'abstract', 'imperfecto', 'Imperfect', 'Quality.', 'Día perfecto.', 'Perfect day.', 'Nadie es perfecto.', 'No one is perfect.', 'Nadie (No one)'),
      a('bonito', 'bonito', 'Pretty', 'A1', 'art', 'feo', 'Ugly', 'Beauty.', 'Flor bonita.', 'Pretty flower.', 'Pueblo bonito.', 'Pretty town.', 'Pueblo (Town)'),
      a('feo', 'feo', 'Ugly', 'A1', 'art', 'bonito', 'Pretty', 'Beauty.', 'Pato feo.', 'Ugly duck.', 'Clima feo.', 'Ugly weather.', 'Clima (Weather)'),
      a('hermoso', 'hermoso', 'Beautiful', 'A2', 'art', 'horrible', 'Horrible', 'Beauty.', 'Mujer hermosa.', 'Beautiful woman.', 'Paisaje hermoso.', 'Beautiful landscape.', 'Paisaje (Landscape)'),
      a('maravilloso', 'maravilloso', 'Wonderful', 'A2', 'feelings', 'terrible', 'Terrible', 'Quality.', 'Vida maravillosa.', 'Wonderful life.', 'Idea maravillosa.', 'Wonderful idea.', 'Vida (Life)'),
      a('terrible', 'terrible', 'Terrible', 'A2', 'feelings', 'maravilloso', 'Wonderful', 'Quality.', 'Dolor terrible.', 'Terrible pain.', 'Noticia terrible.', 'Terrible news.', 'Noticia (News)'),
      a('simple', 'simple', 'Simple', 'A2', 'abstract', 'complejo', 'Complex', 'Complexity.', 'Plan simple.', 'Simple plan.', 'Vida simple.', 'Simple life.', 'Plan (Plan)'),
      a('complejo', 'complejo', 'Complex', 'B1', 'abstract', 'simple', 'Simple', 'Complexity.', 'Sistema complejo.', 'Complex system.', 'Tema complejo.', 'Complex topic.', 'Tema (Topic)')
    ]
  },
  {
    id: 'day-9',
    title: 'Day 9: Position',
    words: [
      v('subir', 'subir', 'To go up', 'A2', 'travel', 'Regular.', 'Subo escaleras.', 'Go up stairs.', 'Subes fotos.', 'Upload photos.', 'Escaleras (Stairs)', '', true),
      v('bajar', 'bajar', 'To go down', 'A2', 'travel', 'Regular.', 'Bajo rápido.', 'Go down fast.', 'Bajas el precio.', 'Lower price.', 'Precio (Price)', '', true),
      v('quedar', 'quedar', 'To stay', 'A2', 'travel', 'Regular.', 'Me quedo.', 'I stay.', 'Quedan dos.', 'Two remain.', 'Dos (Two)', '', true),
      v('esperar', 'esperar', 'To wait', 'A2', 'travel', 'Regular.', 'Espero aquí.', 'Wait here.', 'Esperas fuera.', 'Wait outside.', 'Fuera (Outside)', '', true),
      v('parar', 'parar', 'To stop', 'A2', 'travel', 'Regular.', 'Paro el coche.', 'Stop car.', 'No paras.', 'Don\'t stop.', 'Coche (Car)', '', true),
      v('seguir', 'seguir', 'To follow', 'A2', 'travel', 'E->I.', 'Sigo el camino.', 'Follow path.', 'Sigues recto.', 'Continue straight.', 'Camino (Path)', 's[i]go, s[i]gues, s[i]gue, seguimos, seguís, s[i]guen', false),
      v('empezar', 'empezar', 'To start', 'A2', 'daily', 'E->IE.', 'Empiezo hoy.', 'Start today.', 'Empiezas mañana.', 'Start tomorrow.', 'Hoy (Today)', 'emp[ie]zo, emp[ie]zas, emp[ie]za, empezamos, empezáis, emp[ie]zan', false),
      v('terminar', 'terminar', 'To finish', 'A2', 'daily', 'Regular.', 'Termino el libro.', 'Finish book.', 'Terminas tarde.', 'Finish late.', 'Libro (Book)', '', true),
      v('nacer', 'nacer', 'To be born', 'A2', 'life', 'Irregular.', 'Nazco en abril.', 'Born in April.', 'Naces en mayo.', 'Born in May.', 'Abril (April)', 'naz[co], naces, nace, nacemos, nacéis, nacen', false),
      v('morir', 'morir', 'To die', 'A2', 'life', 'O->UE.', 'Muero de risa.', 'Die of laughter.', 'Mueres de amor.', 'Die of love.', 'Risa (Laughter)', 'm[ue]ro, m[ue]res, m[ue]re, morimos, morís, m[ue]ren', false),
      a('primero', 'primero', 'First', 'A1', 'abstract', 'último', 'Last', 'Order.', 'Primer día.', 'First day.', 'Primera vez.', 'First time.', 'Vez (Time)'),
      a('último', 'último', 'Last', 'A1', 'abstract', 'primero', 'First', 'Order.', 'Último mes.', 'Last month.', 'Última hora.', 'Last hour.', 'Mes (Month)'),
      a('próximo', 'próximo', 'Next', 'A2', 'time', 'anterior', 'Previous', 'Order.', 'Próximo año.', 'Next year.', 'Próxima parada.', 'Next stop.', 'Año (Year)'),
      a('anterior', 'anterior', 'Previous', 'A2', 'time', 'posterior', 'Later', 'Order.', 'Día anterior.', 'Previous day.', 'Vida anterior.', 'Previous life.', 'Día (Day)'),
      a('cerca', 'cerca', 'Close', 'A1', 'travel', 'lejos', 'Far', 'Distance.', 'Está cerca.', 'It is close.', 'Casa cerca.', 'House nearby.', 'Casa (House)'),
      a('lejos', 'lejos', 'Far', 'A1', 'travel', 'cerca', 'Close', 'Distance.', 'Está lejos.', 'It is far.', 'Viaje lejos.', 'Travel far.', 'Viaje (Trip)'),
      a('derecho', 'derecho', 'Right', 'A1', 'travel', 'izquierdo', 'Left', 'Direction.', 'Mano derecha.', 'Right hand.', 'Lado derecho.', 'Right side.', 'Mano (Hand)'),
      a('izquierdo', 'izquierdo', 'Left', 'A1', 'travel', 'derecho', 'Right', 'Direction.', 'Pie izquierdo.', 'Left foot.', 'Ojo izquierdo.', 'Left eye.', 'Pie (Foot)'),
      a('arriba', 'arriba', 'Up', 'A1', 'travel', 'abajo', 'Down', 'Direction.', 'Mira arriba.', 'Look up.', 'Piso de arriba.', 'Upstairs.', 'Mira (Look)'),
      a('abajo', 'abajo', 'Down', 'A1', 'travel', 'arriba', 'Up', 'Direction.', 'Mira abajo.', 'Look down.', 'Piso de abajo.', 'Downstairs.', 'Piso (Floor)')
    ]
  },
  {
    id: 'day-10',
    title: 'Day 10: Abstract',
    words: [
      v('cambiar', 'cambiar', 'To change', 'A2', 'abstract', 'Regular.', 'Cambio de plan.', 'Change plan.', 'Cambias el mundo.', 'Change world.', 'Plan (Plan)', '', true),
      v('ocurrir', 'ocurrir', 'To occur', 'A2', 'abstract', 'Regular.', 'Ocurre a veces.', 'Occurs sometimes.', '¿Qué ocurre?', 'What is happening?', 'A veces (Sometimes)', '', true),
      v('parecer', 'parecer', 'To seem', 'A2', 'abstract', 'Irregular.', 'Parece fácil.', 'Seems easy.', 'Pareces cansado.', 'Seem tired.', 'Cansado (Tired)', 'parez[co], pareces, parece, parecemos, parecéis, aparecen', false),
      v('servir', 'servir', 'To serve', 'A2', 'daily', 'E->I.', 'Sirvo café.', 'Serve coffee.', 'Sirve para esto.', 'Works for this.', 'Esto (This)', 's[i]rvo, s[i]rves, s[i]rve, servimos, servís, s[i]rven', false),
      v('permitir', 'permitir', 'To allow', 'B1', 'society', 'Regular.', 'Permito pasar.', 'Allow passing.', 'Permites fotos.', 'Allow photos.', 'Pasar (Pass)', '', true),
      v('repetir', 'repetir', 'To repeat', 'A2', 'daily', 'E->I.', 'Repito la clase.', 'Repeat class.', 'Repites el curso.', 'Repeat course.', 'Clase (Class)', 'rep[i]to, rep[i]tes, rep[i]te, repetimos, repetís, rep[i]ten', false),
      v('decidir', 'decidir', 'To decide', 'A2', 'abstract', 'Regular.', 'Decido ir.', 'Decide to go.', 'Decides tú.', 'You decide.', 'Tú (You)', '', true),
      v('suponer', 'suponer', 'To suppose', 'B1', 'abstract', 'Go-verb.', 'Supongo que sí.', 'Suppose so.', 'Supones mal.', 'Suppose wrong.', 'Sí (Yes)', 'supon[go], supones, supone, suponemos, suponéis, suponen', false),
      v('cumplir', 'cumplir', 'To fulfill', 'B1', 'society', 'Regular.', 'Cumplo años.', 'Turn years.', 'Cumples promesa.', 'Keep promise.', 'Años (Years)', '', true),
      v('olvidar', 'olvidar', 'To forget', 'A2', 'abstract', 'Regular.', 'Olvido la llave.', 'Forget key.', 'Olvidas todo.', 'Forget all.', 'Llave (Key)', '', true),
      a('real', 'real', 'Real', 'A2', 'abstract', 'irreal', 'Unreal', 'Reality.', 'Vida real.', 'Real life.', 'Mundo real.', 'Real world.', 'Mundo (World)'),
      a('falso', 'falso', 'False', 'A2', 'abstract', 'verdadero', 'True', 'Truth.', 'Nombre falso.', 'Fake name.', 'Alarma falsa.', 'False alarm.', 'Alarma (Alarm)'),
      a('igual', 'igual', 'Equal/Same', 'A2', 'abstract', 'diferente', 'Different', 'Comparison.', 'Es igual.', 'It is same.', 'Da igual.', 'Doesn\'t matter.', 'Da (Gives)'),
      a('diferente', 'diferente', 'Different', 'A1', 'abstract', 'igual', 'Same', 'Comparison.', 'Es diferente.', 'It is different.', 'Gente diferente.', 'Different people.', 'Gente (People)'),
      a('normal', 'normal', 'Normal', 'A1', 'abstract', 'raro', 'Weird', 'Normality.', 'Día normal.', 'Normal day.', 'Es normal.', 'It is normal.', 'Día (Day)'),
      a('raro', 'raro', 'Weird', 'A2', 'abstract', 'común', 'Common', 'Frequency.', 'Bicho raro.', 'Weirdo.', 'Caso raro.', 'Rare case.', 'Caso (Case)'),
      a('extraño', 'extraño', 'Strange', 'B1', 'abstract', 'conocido', 'Known', 'Familiarity.', 'Ruido extraño.', 'Strange noise.', 'Hombre extraño.', 'Strange man.', 'Ruido (Noise)'),
      a('loco', 'loco', 'Crazy', 'A1', 'feelings', 'cuerdo', 'Sane', 'Mind.', 'Mundo loco.', 'Crazy world.', 'Estás loco.', 'You are crazy.', 'Estás (You are)'),
      a('serio', 'serio', 'Serious', 'A2', 'feelings', 'gracioso', 'Funny', 'Personality.', 'Hombre serio.', 'Serious man.', 'Problema serio.', 'Serious problem.', 'Problema (Problem)'),
      a('gracioso', 'gracioso', 'Funny', 'A2', 'feelings', 'serio', 'Serious', 'Personality.', 'Chiste gracioso.', 'Funny joke.', 'Cara graciosa.', 'Funny face.', 'Chiste (Joke)')
    ]
  },
  {
    id: 'day-11',
    title: 'Day 11: Nature',
    words: [
      v('llover', 'llover', 'To rain', 'A2', 'nature', 'O->UE.', 'Llueve mucho.', 'Rains a lot.', 'Va a llover.', 'Going to rain.', 'Mucho (A lot)', 'll[ue]ve (impersonal)', false),
      v('nevar', 'nevar', 'To snow', 'A2', 'nature', 'E->IE.', 'Nieva hoy.', 'Snows today.', 'Nieve blanca.', 'White snow.', 'Hoy (Today)', 'n[ie]va (impersonal)', false),
      v('brillar', 'brillar', 'To shine', 'A2', 'nature', 'Regular.', 'El sol brilla.', 'Sun shines.', 'Brillas hoy.', 'Shine today.', 'Sol (Sun)', '', true),
      v('quemar', 'quemar', 'To burn', 'A2', 'nature', 'Regular.', 'El fuego quema.', 'Fire burns.', 'Me quemo.', 'I burn.', 'Fuego (Fire)', '', true),
      v('crecer', 'crecer', 'To grow', 'A2', 'nature', 'Irregular.', 'Crezco rápido.', 'Grow fast.', 'La planta crece.', 'Plant grows.', 'Planta (Plant)', 'crez[co], creces, crece, crecemos, crecéis, crecen', false),
      v('florecer', 'florecer', 'To bloom', 'B1', 'nature', 'Irregular.', 'Florece en mayo.', 'Blooms in May.', 'Flores florecen.', 'Flowers bloom.', 'Mayo (May)', 'florez[co], floreces, florece, florecemos, florecéis, florecen', false),
      v('volar', 'volar', 'To fly', 'A2', 'nature', 'O->UE.', 'Vuelo lejos.', 'Fly far.', 'El pájaro vuela.', 'Bird flies.', 'Pájaro (Bird)', 'v[ue]lo, v[ue]las, v[ue]la, volamos, voláis, v[ue]lan', false),
      v('nadar', 'nadar', 'To swim', 'A1', 'nature', 'Regular.', 'Nado en el mar.', 'Swim in sea.', 'Nadas bien.', 'Swim well.', 'Mar (Sea)', '', true),
      v('pescar', 'pescar', 'To fish', 'A2', 'nature', 'Regular.', 'Pesco en el río.', 'Fish in river.', 'Pescas nada.', 'Catch nothing.', 'Río (River)', '', true),
      v('cazar', 'cazar', 'To hunt', 'B1', 'nature', 'Regular.', 'El gato caza.', 'Cat hunts.', 'Cazo ideas.', 'Hunt ideas.', 'Gato (Cat)', '', true),
      a('natural', 'natural', 'Natural', 'A1', 'nature', 'artificial', 'Artificial', 'Nature.', 'Luz natural.', 'Natural light.', 'Agua natural.', 'Plain water.', 'Luz (Light)'),
      a('salvaje', 'salvaje', 'Wild', 'A2', 'nature', 'doméstico', 'Domestic', 'Nature.', 'Animal salvaje.', 'Wild animal.', 'Vida salvaje.', 'Wild life.', 'Animal (Animal)'),
      a('fresco', 'fresco', 'Fresh', 'A2', 'nature', 'podrido', 'Rotten', 'State.', 'Aire fresco.', 'Fresh air.', 'Agua fresca.', 'Fresh water.', 'Aire (Air)'),
      a('puro', 'puro', 'Pure', 'A2', 'nature', 'impuro', 'Impure', 'Quality.', 'Aire puro.', 'Pure air.', 'Alma pura.', 'Pure soul.', 'Alma (Soul)'),
      a('profundo', 'profundo', 'Deep', 'B1', 'nature', 'superficial', 'Shallow', 'Dimension.', 'Mar profundo.', 'Deep sea.', 'Sueño profundo.', 'Deep sleep.', 'Mar (Sea)'),
      a('plano', 'plano', 'Flat', 'B1', 'nature', 'rugoso', 'Rugged', 'Texture.', 'Tierra plana.', 'Flat earth.', 'Superficie plana.', 'Flat surface.', 'Tierra (Earth)'),
      a('redondo', 'redondo', 'Round', 'A2', 'abstract', 'cuadrado', 'Square', 'Shape.', 'Mesa redonda.', 'Round table.', 'Mundo redondo.', 'Round world.', 'Mesa (Table)'),
      a('cuadrado', 'cuadrado', 'Square', 'A2', 'abstract', 'redondo', 'Round', 'Shape.', 'Caja cuadrada.', 'Square box.', 'Metro cuadrado.', 'Square meter.', 'Caja (Box)'),
      a('brillante', 'brillante', 'Bright', 'A2', 'nature', 'opaco', 'Dull', 'Light.', 'Estrella brillante.', 'Bright star.', 'Futuro brillante.', 'Bright future.', 'Estrella (Star)'),
      a('transparente', 'transparente', 'Transparent', 'B1', 'nature', 'opaco', 'Opaque', 'Light.', 'Agua transparente.', 'Clear water.', 'Cristal transparente.', 'Clear glass.', 'Agua (Water)')
    ]
  }
];
