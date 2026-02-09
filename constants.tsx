
import { Word, DayPack, WordNuance, WordLevel, WordTopic } from './types';
import { pluralize, generateRegularForms } from './utils/grammar';

export const SRS_INTERVALS = [0, 1, 3, 7, 14, 30, 90, 180];
export const TODAY_SIMULATED = new Date().toISOString().split('T')[0];

// --- NUANCE DEFINITIONS ---
const N_SER_ESTAR: WordNuance = { type: 'warning', label: 'Identity vs State', note: 'Ser is for permanent traits (origin, name). Estar is for locations and temporary states (feelings).' };
const N_SABER_CONOCER: WordNuance = { type: 'warning', label: 'Knowledge Types', note: 'Saber is for facts or skills. Conocer is for being familiar with people or places.' };
const N_PEDIR_PREGUNTAR: WordNuance = { type: 'warning', label: 'Requests', note: 'Pedir is to ask for an object or action. Preguntar is to ask for information.' };
const N_VER_MIRAR: WordNuance = { type: 'warning', label: 'Seeing', note: 'Ver is the ability to see (passive). Mirar is to look at or watch with intent (active).' };
const N_HABLAR_DECIR: WordNuance = { type: 'warning', label: 'Speaking', note: 'Hablar is the act of talking/speaking a language. Decir is to say something specific.' };

// --- HELPERS ---
const v = (id: string, s: string, t: string, topic: WordTopic, tip: string, ex1: string, ex1t: string, ex2: string, ex2t: string, nn: string, forms?: string, reg?: boolean, nuance?: WordNuance): Word => {
  const effectiveReg = reg ?? true;
  let computedForms = forms || '';
  if (effectiveReg && !computedForms) computedForms = generateRegularForms(s);
  return { id, s, t, level: 'A1', topic, type: 'verb', category: 'island', reg: effectiveReg, forms: computedForms, grammarTip: tip, examples: [{ txt: ex1, eng: ex1t }, { txt: ex2, eng: ex2t }], nounNotes: nn, nuance };
};

const a = (id: string, s: string, t: string, topic: WordTopic, ant: string, antT: string, tip: string, ex1: string, ex1t: string, ex2: string, ex2t: string, nn: string, nuance?: WordNuance): Word => {
  let masc = s; let fem = s; if (s.endsWith('o')) fem = s.slice(0, -1) + 'a';
  const forms = `${masc}, ${fem}, ${pluralize(masc)}, ${pluralize(fem)}`;
  return { id, s, t, level: 'A1', topic, type: 'adj', category: 'island', ant, antT, grammarTip: tip, forms, examples: [{ txt: ex1, eng: ex1t }, { txt: ex2, eng: ex2t }], nounNotes: nn, nuance };
};

const n = (id: string, s: string, t: string, topic: WordTopic, gender: 'm' | 'f', tip: string, ex1: string, ex1t: string, ex2: string, ex2t: string, notes: string): Word => {
  const article = gender === 'm' ? 'El' : 'La'; const pluralArticle = gender === 'm' ? 'Los' : 'Las';
  const forms = `${article} ${s}, ${pluralArticle} ${pluralize(s)}`;
  return { id, s, t, level: 'A1', topic, type: 'noun', category: 'loot', forms, grammarTip: `${gender === 'm' ? 'Masc' : 'Fem'}. ${tip}`, examples: [{ txt: ex1, eng: ex1t }, { txt: ex2, eng: ex2t }], nounNotes: notes };
};

const m = (id: string, s: string, t: string, topic: WordTopic, tip: string, ex1: string, ex1t: string, ex2: string, ex2t: string, category: string, notes: string): Word => ({
  id, s, t, level: 'A1', topic, type: 'misc', category, grammarTip: tip, forms: '', examples: [{ txt: ex1, eng: ex1t }, { txt: ex2, eng: ex2t }], nounNotes: notes
});

// --- MAIN VOCABULARY DATA (10 DAYS, 10V + 10A EACH) ---
export const VOCABULARY_DATA: DayPack[] = [
  {
    id: 'day1',
    title: 'The Identity & The Body',
    words: [
      v('ser', 'ser', 'To be (Identity)', 'grammar', 'Permanent traits.', 'Yo soy Juan.', 'I am Juan.', 'Ella es alta.', 'She is tall.', 'Juan: Name. Ella: She.', 'soy, eres, es, somos, sois, son', false, N_SER_ESTAR),
      v('estar', 'estar', 'To be (State)', 'grammar', 'Temporary states/location.', 'Estoy feliz.', 'I am happy.', 'Estamos aquí.', 'We are here.', 'Feliz: Happy. Aquí: Here.', 'estoy, estás, está, estamos, estáis, están', false, N_SER_ESTAR),
      v('tener', 'tener', 'To have', 'grammar', 'Possession/Age.', 'Tengo hambre.', 'I am hungry.', 'Tienen un coche.', 'They have a car.', 'Hambre: Hunger. Coche: Car.', 'tengo, tienes, tiene, tenemos, tenéis, tienen', false),
      v('llamarse', 'llamarse', 'To be called', 'social', 'Use for names.', 'Me llamo Ana.', 'My name is Ana.', '¿Cómo te llamas?', 'What is your name?', 'Ana: Name.', 'me llamo, te llamas, se llama, nos llamamos, os llamáis, se llaman', true),
      v('vivir', 'vivir', 'To live', 'life', 'Residence.', 'Vivo en China.', 'I live in China.', '¿Dónde vives?', 'Where do you live?', 'China: Country.', undefined, true),
      v('estudiar', 'estudiar', 'To study', 'work', 'Learning.', 'Estudio español.', 'I study Spanish.', 'Juan estudia mucho.', 'Juan studies a lot.', 'Mucho: A lot.', undefined, true),
      v('trabajar', 'trabajar', 'To work', 'work', 'Employment.', 'Trabajo hoy.', 'I work today.', '¿Dónde trabajas?', 'Where do you work?', 'Hoy: Today.', undefined, true),
      v('haber', 'haber', 'There is/are', 'grammar', 'Existence (Hay).', 'Hay un libro.', 'There is a book.', 'No hay agua.', 'There is no water.', 'Libro: Book. Agua: Water.', 'he, has, ha (hay), hemos, habéis, han', false),
      v('comer', 'comer', 'To eat', 'food', 'Regular meals.', 'Como pan.', 'I eat bread.', '¿Qué comes?', 'What do you eat?', 'Pan: Bread.', undefined, true),
      v('beber', 'beber', 'To drink', 'food', 'Liquids.', 'Bebo agua.', 'I drink water.', 'Juan bebe café.', 'Juan drinks coffee.', 'Café: Coffee.', undefined, true),
      a('grande', 'grande', 'Big', 'quantity', 'pequeño', 'Small', 'Size.', 'Casa grande.', 'Big house.', 'Perro grande.', 'Big dog.', 'Casa: House. Perro: Dog.'),
      a('pequeño', 'pequeño', 'Small', 'quantity', 'grande', 'Big', 'Size.', 'Gato pequeño.', 'Small cat.', 'Coche pequeño.', 'Small car.', 'Gato: Cat. Coche: Car.'),
      a('bueno', 'bueno', 'Good', 'feelings', 'malo', 'Bad', 'Quality.', 'Buen día.', 'Good day.', 'Es bueno.', 'It is good.', 'Día: Day.'),
      a('malo', 'malo', 'Bad', 'feelings', 'bueno', 'Good', 'Quality.', 'Día malo.', 'Bad day.', 'Es malo.', 'It is bad.', 'Día: Day.'),
      a('nuevo', 'nuevo', 'New', 'time', 'viejo', 'Old', 'Freshness.', 'Móvil nuevo.', 'New mobile.', 'Zapato nuevo.', 'New shoe.', 'Móvil: Mobile. Zapato: Shoe.'),
      a('viejo', 'viejo', 'Old', 'time', 'nuevo', 'New', 'Age.', 'Reloj viejo.', 'Old clock.', 'Libro viejo.', 'Old book.', 'Reloj: Clock. Libro: Book.'),
      a('alto', 'alto', 'Tall', 'body', 'bajo', 'Short', 'Height.', 'Chico alto.', 'Tall boy.', 'Torre alta.', 'Tall tower.', 'Chico: Boy. Torre: Tower.'),
      a('bajo', 'bajo', 'Short', 'body', 'alto', 'Tall', 'Height.', 'Hombre bajo.', 'Short man.', 'Mesa baja.', 'Low table.', 'Hombre: Man. Mesa: Table.'),
      a('gordo', 'gordo', 'Fat', 'body', 'delgado', 'Thin', 'Weight.', 'Gato gordo.', 'Fat cat.', 'Hombre gordo.', 'Fat man.', 'Gato: Cat.'),
      a('delgado', 'delgado', 'Thin', 'body', 'gordo', 'Fat', 'Weight.', 'Chica delgada.', 'Thin girl.', 'Perro delgado.', 'Thin dog.', 'Chica: Girl.')
    ]
  },
  {
    id: 'day2',
    title: 'Movement & Desires',
    words: [
      v('querer', 'querer', 'To want', 'feelings', 'Desire/Love.', 'Quiero café.', 'I want coffee.', 'Te quiero.', 'I love you.', 'Café: Coffee.', 'quiero, quieres, quiere, queremos, queréis, quieren', false),
      v('poder', 'poder', 'Can/To be able', 'grammar', 'Ability.', 'Puedo ir.', 'I can go.', '¿Puedes hablar?', 'Can you speak?', 'Ir: To go.', 'puedo, puedes, puede, podemos, podéis, pueden', false),
      v('ir', 'ir', 'To go', 'travel', 'Movement away.', 'Voy a casa.', 'I go home.', 'Vamos hoy.', 'We go today.', 'Casa: House.', 'voy, vas, va, vamos, vais, van', false),
      v('venir', 'venir', 'To come', 'travel', 'Movement toward.', 'Vengo ahora.', 'I come now.', '¿Vienes?', 'Are you coming?', 'Ahora: Now.', 'vengo, vienes, viene, venimos, venís, vienen', false),
      v('traer', 'traer', 'To bring', 'daily', 'Bringing here.', 'Traigo la llave.', 'I bring the key.', '¿Qué traes?', 'What do you bring?', 'Llave: Key.', 'traigo, traes, trae, traemos, traéis, traen', false),
      v('llevar', 'llevar', 'To take/wear', 'daily', 'Taking there.', 'Llevo mi bolso.', 'I carry my bag.', 'Lleva ropa azul.', 'He wears blue clothes.', 'Bolso: Bag. Ropa: Clothes.', undefined, true),
      v('saber', 'saber', 'To know (Fact)', 'grammar', 'Information.', 'Sé tu nombre.', 'I know your name.', 'No sé nada.', 'I know nothing.', 'Nombre: Name.', 'sé, sabes, sabe, sabemos, sabéis, saben', false, N_SABER_CONOCER),
      v('conocer', 'conocer', 'To know (People)', 'social', 'Familiarity.', 'Conozco a Juan.', 'I know Juan.', '¿Conoces Madrid?', 'Do you know Madrid?', 'Madrid: City.', 'conozco, conoces, conoce, conocemos, conocéis, conocen', false, N_SABER_CONOCER),
      v('preferir', 'preferir', 'To prefer', 'feelings', 'Preference.', 'Prefiero el té.', 'I prefer tea.', '¿Qué prefieres?', 'What do you prefer?', 'Té: Tea.', 'prefiero, prefieres, prefiere, preferimos, preferís, prefieren', false),
      v('necesitar', 'necesitar', 'To need', 'daily', 'Requirement.', 'Necesito ayuda.', 'I need help.', '¿Qué necesitas?', 'What do you need?', 'Ayuda: Help.', undefined, true),
      a('largo', 'largo', 'Long', 'quantity', 'corto', 'Short', 'Length.', 'Pelo largo.', 'Long hair.', 'Camino largo.', 'Long path.', 'Pelo: Hair.'),
      a('corto', 'corto', 'Short', 'quantity', 'largo', 'Long', 'Length.', 'Vestido corto.', 'Short dress.', 'Tiempo corto.', 'Short time.', 'Vestido: Dress.'),
      a('ancho', 'ancho', 'Wide', 'quantity', 'estrecho', 'Narrow', 'Width.', 'Calle ancha.', 'Wide street.', 'Río ancho.', 'Wide river.', 'Calle: Street.'),
      a('estrecho', 'estrecho', 'Narrow', 'quantity', 'ancho', 'Wide', 'Width.', 'Camino estrecho.', 'Narrow path.', 'Puerta estrecha.', 'Narrow door.', 'Camino: Path.'),
      a('guapo', 'guapo', 'Handsome', 'body', 'feo', 'Ugly', 'Beauty.', 'Chico guapo.', 'Handsome boy.', 'Eres guapa.', 'You are pretty.', 'Chico: Boy.'),
      a('feo', 'feo', 'Ugly', 'body', 'guapo', 'Handsome', 'Appearance.', 'Perro feo.', 'Ugly dog.', 'Día feo.', 'Ugly day.', 'Perro: Dog.'),
      a('joven', 'joven', 'Young', 'time', 'mayor', 'Older', 'Age.', 'Hombre joven.', 'Young man.', 'Es joven.', 'She is young.', 'Hombre: Man.'),
      a('mayor', 'mayor', 'Older/Adult', 'time', 'joven', 'Young', 'Age.', 'Hermano mayor.', 'Older brother.', 'Gente mayor.', 'Old people.', 'Hermano: Brother.'),
      a('rico', 'rico', 'Rich/Tasty', 'food', 'pobre', 'Pobre', 'Status/Flavor.', 'Hombre rico.', 'Rich man.', 'Sopa rica.', 'Tasty soup.', 'Sopa: Soup.'),
      a('pobre', 'pobre', 'Poor', 'society', 'rico', 'Rich', 'Status.', 'País pobre.', 'Poor country.', 'Pobre perro.', 'Poor dog.', 'País: Country.')
    ]
  },
  {
    id: 'day3',
    title: 'Routine & Habits',
    words: [
      v('despertarse', 'despertarse', 'To wake up', 'daily', 'Ending sleep.', 'Me despierto.', 'I wake up.', '¿Te despiertas?', 'Do you wake up?', 'Note: Stem changes e-ie.', 'me despierto, te despiertas, se despierta, nos despertamos, os despertáis, se despiertan', false),
      v('levantarse', 'levantarse', 'To get up', 'daily', 'Leaving bed.', 'Me levanto tarde.', 'I get up late.', 'Juan se levanta.', 'Juan gets up.', 'Tarde: Late.', undefined, true),
      v('ducharse', 'ducharse', 'To shower', 'daily', 'Cleaning body.', 'Me ducho hoy.', 'I shower today.', '¿Te duchas?', 'Do you shower?', 'Hoy: Today.', undefined, true),
      v('lavarse', 'lavarse', 'To wash', 'daily', 'Cleaning parts.', 'Me lavo las manos.', 'I wash my hands.', 'Se lava.', 'He washes.', 'Manos: Hands.', undefined, true),
      v('vestirse', 'vestirse', 'To dress', 'daily', 'Putting on clothes.', 'Me visto ahora.', 'I dress now.', '¿Te vistes?', 'Are you dressing?', 'Note: Stem changes e-i.', 'me visto, te vistes, se viste, nos vestimos, os vestís, se visten', false),
      v('desayunar', 'desayunar', 'To have breakfast', 'food', 'First meal.', 'Desayuno café.', 'I have coffee for breakfast.', '¿Qué desayunas?', 'What do you breakfast?', 'Café: Coffee.', undefined, true),
      v('almorzar', 'almorzar', 'To have lunch', 'food', 'Midday meal.', 'Almuerzo arroz.', 'I lunch rice.', 'Juan almuerza.', 'Juan lunches.', 'Arroz: Rice.', 'almuerzo, almuerzas, almuerza, almorzamos, almorzáis, almuerzan', false),
      v('cenar', 'cenar', 'To have dinner', 'food', 'Night meal.', 'Ceno sopa.', 'I dinner soup.', 'Cenamos juntos.', 'We dinner together.', 'Sopa: Soup.', undefined, true),
      v('salir', 'salir', 'To go out', 'travel', 'Leaving a place.', 'Salgo de casa.', 'I leave the house.', 'Juan sale hoy.', 'Juan goes out today.', 'Casa: House.', 'salgo, sales, sale, salimos, salís, salen', false),
      v('volver', 'volver', 'To return', 'travel', 'Coming back.', 'Vuelvo tarde.', 'I return late.', 'Vuelven mañana.', 'They return tomorrow.', 'Tarde: Late.', 'vuelvo, vuelves, vuelve, volvemos, volvéis, vuelven', false),
      a('limpio', 'limpio', 'Clean', 'daily', 'sucio', 'Dirty', 'State.', 'Coche limpio.', 'Clean car.', 'Agua limpia.', 'Clean water.', 'Coche: Car.'),
      a('sucio', 'sucio', 'Dirty', 'daily', 'limpio', 'Clean', 'State.', 'Ropa sucia.', 'Dirty clothes.', 'Suelo sucio.', 'Dirty floor.', 'Ropa: Clothes.'),
      a('rápido', 'rápido', 'Fast', 'travel', 'lento', 'Slow', 'Speed.', 'Coche rápido.', 'Fast car.', 'Es rápido.', 'It is fast.', 'Coche: Car.'),
      a('lento', 'lento', 'Slow', 'travel', 'rápido', 'Fast', 'Speed.', 'Tren lento.', 'Slow train.', 'Es muy lento.', 'It is very slow.', 'Tren: Train.'),
      a('temprano', 'temprano', 'Early', 'time', 'tarde', 'Late', 'Time.', 'Llego temprano.', 'I arrive early.', 'Muy temprano.', 'Very early.', 'Note: Used as adverb too.'),
      a('tarde_adj', 'tarde', 'Late', 'time', 'temprano', 'Early', 'Time.', 'Llego tarde.', 'I arrive late.', 'Es tarde.', 'It is late.', 'Note: "Tarde" is also evening.'),
      a('cansado', 'cansado', 'Tired', 'feelings', 'enérgico', 'Energetic', 'Feeling.', 'Estoy cansado.', 'I am tired.', 'Ana está cansada.', 'Ana is tired.', 'Ana: Name.'),
      a('ocupado', 'ocupado', 'Busy', 'work', 'libre', 'Free', 'Status.', 'Estoy ocupado.', 'I am busy.', 'Día ocupado.', 'Busy day.', 'Día: Day.'),
      a('libre', 'libre', 'Free', 'work', 'ocupado', 'Busy', 'Availability.', 'Estoy libre.', 'I am free.', 'Tiempo libre.', 'Free time.', 'Tiempo: Time.'),
      a('listo', 'listo', 'Ready/Smart', 'feelings', 'tonto', 'Stupid', 'State/Trait.', 'Estoy listo.', 'I am ready.', 'Es muy listo.', 'He is very smart.', 'Note: Estar listo = Ready, Ser listo = Smart.')
    ]
  },
  {
    id: 'day4',
    title: 'Work & Communication',
    words: [
      v('decir', 'decir', 'To say', 'grammar', 'Expression.', 'Digo la verdad.', 'I say the truth.', 'Él dice hola.', 'He says hello.', 'Verdad: Truth.', 'digo, dices, dice, decimos, decís, dicen', false, N_HABLAR_DECIR),
      v('hablar', 'hablar', 'To speak', 'social', 'Conversation.', 'Hablo español.', 'I speak Spanish.', 'Ellos hablan.', 'They speak.', 'Español: Spanish.', undefined, true, N_HABLAR_DECIR),
      v('leer', 'leer', 'To read', 'work', 'Reading.', 'Leo un libro.', 'I read a book.', '¿Qué lees?', 'What do you read?', 'Libro: Book.', 'leo, lees, lee, leemos, leéis, leen', true),
      v('escribir', 'escribir', 'To write', 'work', 'Writing.', 'Escribo cartas.', 'I write letters.', 'Él escribe.', 'He writes.', 'Cartas: Letters.', undefined, true),
      v('llamar_v', 'llamar', 'To call', 'social', 'Phone or shout.', 'Llamo a mamá.', 'I call mom.', '¿Me llamas?', 'Are you calling me?', 'Mamá: Mom.', undefined, true),
      v('enviar', 'enviar', 'To send', 'work', 'Dispatch.', 'Envío un email.', 'I send an email.', 'Ellos envían.', 'They send.', 'Email: Email.', 'envío, envías, envía, enviamos, enviáis, envían', true),
      v('recibir', 'recibir', 'To receive', 'work', 'Accepting.', 'Recibo el paquete.', 'I receive the package.', '¿Recibes esto?', 'Do you receive this?', 'Paquete: Package.', undefined, true),
      v('preguntar', 'preguntar', 'To ask', 'social', 'Inquiry.', 'Pregunto hoy.', 'I ask today.', 'Juan pregunta.', 'Juan asks.', 'Hoy: Today.', undefined, true, N_PEDIR_PREGUNTAR),
      v('responder', 'responder', 'To answer', 'social', 'Reply.', 'Respondo ahora.', 'I answer now.', 'Ella responde.', 'She answers.', 'Ahora: Now.', undefined, true),
      v('escuchar', 'escuchar', 'To listen', 'social', 'Hearing intent.', 'Escucho música.', 'I listen to music.', '¿Me escuchas?', 'Do you listen to me?', 'Música: Music.', undefined, true),
      a('fácil', 'fácil', 'Easy', 'work', 'difícil', 'Difficult', 'Quality.', 'Tarea fácil.', 'Easy task.', 'Es fácil.', 'It is easy.', 'Tarea: Task.'),
      a('difícil', 'difícil', 'Difficult', 'work', 'fácil', 'Easy', 'Quality.', 'Examen difícil.', 'Difficult exam.', 'Muy difícil.', 'Very difficult.', 'Examen: Exam.'),
      a('importante', 'importante', 'Important', 'work', 'irrelevante', 'Irrelevant', 'Priority.', 'Cita importante.', 'Important appointment.', 'Es importante.', 'It is important.', 'Cita: Appointment.'),
      a('útil', 'útil', 'Useful', 'work', 'inútil', 'Useless', 'Value.', 'Libro útil.', 'Useful book.', 'Es muy útil.', 'It is very useful.', 'Libro: Book.'),
      a('caro', 'caro', 'Expensive', 'society', 'barato', 'Cheap', 'Price.', 'Coche caro.', 'Expensive car.', 'Es muy caro.', 'It is very expensive.', 'Coche: Car.'),
      a('barato', 'barato', 'Cheap', 'society', 'caro', 'Expensive', 'Price.', 'Pan barato.', 'Cheap bread.', 'Es barato.', 'It is cheap.', 'Pan: Bread.'),
      a('interesante', 'interesante', 'Interesting', 'art', 'aburrido', 'Boring', 'Trait.', 'Libro interesante.', 'Interesting book.', 'Muy interesante.', 'Very interesting.', 'Libro: Book.'),
      a('aburrido', 'aburrido', 'Boring', 'art', 'interesante', 'Interesting', 'Trait.', 'Cine aburrido.', 'Boring cinema.', 'Estoy aburrido.', 'I am bored.', 'Cine: Cinema. Note: Ser=Boring, Estar=Bored.'),
      a('correcto', 'correcto', 'Correct', 'grammar', 'incorrecto', 'Incorrect', 'Accuracy.', 'Frase correcta.', 'Correct phrase.', 'Es correcto.', 'It is correct.', 'Frase: Phrase.'),
      a('falso', 'falso', 'False', 'grammar', 'verdadero', 'True', 'Accuracy.', 'Noticia falsa.', 'False news.', 'Es falso.', 'It is false.', 'Noticia: News.')
    ]
  },
  {
    id: 'day5',
    title: 'Senses & Emotions',
    words: [
      v('ver_v', 'ver', 'To see', 'body', 'Sight.', 'Veo el sol.', 'I see the sun.', 'Juan ve todo.', 'Juan sees everything.', 'Sol: Sun.', 'veo, ves, ve, vemos, veis, ven', false, N_VER_MIRAR),
      v('mirar', 'mirar', 'To look/watch', 'body', 'Intentional sight.', 'Miro la tele.', 'I watch TV.', '¿Qué miras?', 'What are you looking at?', 'Tele: TV.', undefined, true, N_VER_MIRAR),
      v('oír', 'oír', 'To hear', 'body', 'Sound.', 'Oigo un ruido.', 'I hear a noise.', '¿Me oyes?', 'Do you hear me?', 'Ruido: Noise.', 'oigo, oyes, oye, oímos, oís, oyen', false),
      v('sentir', 'sentir', 'To feel', 'feelings', 'Sensation.', 'Siento calor.', 'I feel heat.', '¿Qué sientes?', 'What do you feel?', 'Calor: Heat.', 'siento, sientes, siente, sentimos, sentís, sienten', false),
      v('gustar', 'gustar', 'To like', 'feelings', 'Pleasure.', 'Me gusta.', 'I like it.', 'Nos gusta.', 'We like it.', 'Note: Used with indirect object pronouns.', 'gusta, gustan (usually)', false),
      v('encantar', 'encantar', 'To love/enchant', 'feelings', 'Strong liking.', 'Me encanta.', 'I love it.', 'Te encanta.', 'You love it.', 'Note: Similar to gustar.', 'encanta, encantan (usually)', false),
      v('amar', 'amar', 'To love', 'feelings', 'Deep love.', 'Amo a Ana.', 'I love Ana.', 'Nos amamos.', 'We love each other.', 'Ana: Name.', undefined, true),
      v('odiar', 'odiar', 'To hate', 'feelings', 'Dislike.', 'Odio el frío.', 'I hate the cold.', 'Ellos odian.', 'They hate.', 'Frío: Cold.', undefined, true),
      v('reír', 'reír', 'To laugh', 'feelings', 'Mirth.', 'Río mucho.', 'I laugh a lot.', 'Juan ríe.', 'Juan laughs.', 'Mucho: A lot.', 'río, ríes, ríe, reímos, reís, ríen', false),
      v('llorar', 'llorar', 'To cry', 'feelings', 'Sadness.', 'Lloro hoy.', 'I cry today.', 'No llores.', "Don't cry.", 'Hoy: Today.', undefined, true),
      a('feliz', 'feliz', 'Happy', 'feelings', 'triste', 'Sad', 'Mood.', 'Soy feliz.', 'I am happy.', 'Gente feliz.', 'Happy people.', 'Gente: People.'),
      a('triste', 'triste', 'Sad', 'feelings', 'feliz', 'Happy', 'Mood.', 'Estoy triste.', 'I am sad.', 'Día triste.', 'Sad day.', 'Día: Day.'),
      a('alegre', 'alegre', 'Cheerful', 'feelings', 'triste', 'Sad', 'Trait.', 'Hombre alegre.', 'Cheerful man.', 'Es muy alegre.', 'It is very cheerful.', 'Hombre: Man.'),
      a('enojado', 'enojado', 'Angry', 'feelings', 'tranquilo', 'Calm', 'Mood.', 'Estoy enojado.', 'I am angry.', 'Ana está enojada.', 'Ana is angry.', 'Ana: Name.'),
      a('serio', 'serio', 'Serious', 'feelings', 'divertido', 'Funny', 'Trait.', 'Padre serio.', 'Serious father.', 'Es serio.', 'It is serious.', 'Padre: Father.'),
      a('amable', 'amable', 'Kind', 'social', 'grosero', 'Rude', 'Trait.', 'Chica amable.', 'Kind girl.', 'Muy amable.', 'Very kind.', 'Chica: Girl.'),
      a('nervioso', 'nervioso', 'Nervous', 'feelings', 'tranquilo', 'Calm', 'Mood.', 'Estoy nervioso.', 'I am nervous.', 'Examen nervioso.', 'Nervous exam.', 'Examen: Exam.'),
      a('tranquilo', 'tranquilo', 'Calm/Quiet', 'feelings', 'nervioso', 'Nervous', 'State.', 'Mar tranquilo.', 'Calm sea.', 'Está tranquilo.', 'It is quiet.', 'Mar: Sea.'),
      a('tímido', 'tímido', 'Shy', 'social', 'atrevido', 'Bold', 'Trait.', 'Niño tímido.', 'Shy boy.', 'Soy tímido.', 'I am shy.', 'Niño: Boy.'),
      a('valiente', 'valiente', 'Brave', 'feelings', 'cobarde', 'Cowardly', 'Trait.', 'Perro valiente.', 'Brave dog.', 'Es valiente.', 'He is brave.', 'Perro: Dog.')
    ]
  },
  {
    id: 'day6',
    title: 'Social & Trade',
    words: [
      v('dar', 'dar', 'To give', 'social', 'Donation.', 'Doy un regalo.', 'I give a gift.', 'Él da ayuda.', 'He gives help.', 'Regalo: Gift. Ayuda: Help.', 'doy, das, da, damos, dais, dan', false),
      v('pedir', 'pedir', 'To ask for', 'social', 'Request.', 'Pido agua.', 'I ask for water.', 'Él pide pan.', 'He asks for bread.', 'Agua: Water. Pan: Bread.', 'pido, pides, pide, pedimos, pedís, piden', false, N_PEDIR_PREGUNTAR),
      v('ayudar', 'ayudar', 'To help', 'social', 'Assistance.', 'Ayudo a Juan.', 'I help Juan.', 'Nos ayudan.', 'They help us.', 'Juan: Name.', undefined, true),
      v('quedar', 'quedar', 'To stay/meet', 'social', 'Remaining/Appointment.', 'Me quedo aquí.', 'I stay here.', 'Quedamos hoy.', 'We meet today.', 'Aquí: Here. Hoy: Today.', undefined, true),
      v('invitar', 'invitar', 'To invite', 'social', 'Invitation.', 'Invito a Ana.', 'I invite Ana.', 'Él invita.', 'He invites.', 'Ana: Name.', undefined, true),
      v('pagar', 'pagar', 'To pay', 'society', 'Payment.', 'Pago hoy.', 'I pay today.', 'Juan paga el té.', 'Juan pays for the tea.', 'Té: Tea.', 'pago, pagas, paga, pagamos, pagáis, pagan', true),
      v('comprar', 'comprar', 'To buy', 'society', 'Purchase.', 'Compro pan.', 'I buy bread.', 'Él compra ropa.', 'He buys clothes.', 'Pan: Bread. Ropa: Clothes.', undefined, true),
      v('vender', 'vender', 'To sell', 'society', 'Selling.', 'Vendo mi coche.', 'I sell my car.', 'Ellos venden.', 'They sell.', 'Coche: Car.', undefined, true),
      v('buscar', 'buscar', 'To look for', 'daily', 'Searching.', 'Busco mi llave.', 'I look for my key.', '¿Qué buscas?', 'What are you looking for?', 'Llave: Key.', undefined, true),
      v('encontrar', 'encontrar', 'To find', 'daily', 'Discovery.', 'Encuentro dinero.', 'I find money.', 'Ella encuentra.', 'She finds.', 'Dinero: Money.', 'encuentro, encuentras, encuentra, encontramos, encontráis, encuentran', false),
      a('famoso', 'famoso', 'Famous', 'social', 'desconocido', 'Unknown', 'Trait.', 'Actor famoso.', 'Famous actor.', 'Es famoso.', 'He is famous.', 'Actor: Actor.'),
      a('desconocido', 'desconocido', 'Unknown', 'social', 'famoso', 'Famous', 'Trait.', 'Lugar desconocido.', 'Unknown place.', 'Gente desconocida.', 'Unknown people.', 'Lugar: Place.'),
      a('generoso', 'generoso', 'Generous', 'social', 'tacaño', 'Stingy', 'Trait.', 'Hombre generoso.', 'Generous man.', 'Muy generoso.', 'Very generous.', 'Hombre: Man.'),
      a('tacaño', 'tacaño', 'Stingy', 'social', 'generoso', 'Generous', 'Trait.', 'Hombre tacaño.', 'Stingy man.', 'Es tacaño.', 'He is stingy.', 'Hombre: Man.'),
      a('abierto', 'abierto', 'Open', 'daily', 'cerrado', 'Closed', 'State/Trait.', 'Puerta abierta.', 'Open door.', 'Es abierto.', 'He is open (social).', 'Puerta: Door.'),
      a('cerrado', 'cerrado', 'Closed', 'daily', 'abierto', 'Open', 'State/Trait.', 'Ventana cerrada.', 'Closed window.', 'Es cerrado.', 'He is closed (social).', 'Ventana: Window.'),
      a('pesado', 'pesado', 'Heavy/Annoying', 'quantity', 'ligero', 'Light', 'Weight/Annoyance.', 'Maleta pesada.', 'Heavy suitcase.', 'Es pesado.', 'He is annoying.', 'Maleta: Suitcase.'),
      a('ligero', 'ligero', 'Light', 'quantity', 'pesado', 'Heavy', 'Weight.', 'Ropa ligera.', 'Light clothes.', 'Es ligero.', 'It is light.', 'Ropa: Clothes.'),
      a('fuerte', 'fuerte', 'Strong', 'body', 'débil', 'Weak', 'Power.', 'Hombre fuerte.', 'Strong man.', 'Viento fuerte.', 'Strong wind.', 'Viento: Wind.'),
      a('débil', 'débil', 'Weak', 'body', 'fuerte', 'Strong', 'Power.', 'Niño débil.', 'Weak boy.', 'Es débil.', 'He is weak.', 'Niño: Boy.')
    ]
  },
  {
    id: 'day7',
    title: 'Creation & Play',
    words: [
      v('hacer_v', 'hacer', 'To do/make', 'daily', 'Action.', 'Hago la comida.', 'I make food.', '¿Qué haces?', 'What are you doing?', 'Comida: Food.', 'hago, haces, hace, hacemos, hacéis, hacen', false),
      v('crear', 'crear', 'To create', 'art', 'Innovation.', 'Creo arte.', 'I create art.', 'Ellos crean.', 'They create.', 'Arte: Art.', undefined, true),
      v('pintar', 'pintar', 'To paint', 'art', 'Drawing.', 'Pinto un cuadro.', 'I paint a picture.', 'Ana pinta.', 'Ana paints.', 'Cuadro: Picture.', undefined, true),
      v('cantar', 'cantar', 'To sing', 'art', 'Vocal art.', 'Canto hoy.', 'I sing today.', 'Ella canta.', 'She sings.', 'Hoy: Today.', undefined, true),
      v('bailar', 'bailar', 'To dance', 'art', 'Movement.', 'Bailo bien.', 'I dance well.', '¿Bailamos?', 'Shall we dance?', 'Bien: Well.', undefined, true),
      v('tocar', 'tocar', 'To play (inst)/touch', 'art', 'Music/Touch.', 'Toco el piano.', 'I play piano.', 'No toques.', "Don't touch.", 'Piano: Piano.', undefined, true),
      v('jugar', 'jugar', 'To play (game)', 'social', 'Games/Sport.', 'Juego al fútbol.', 'I play football.', 'Ellos juegan.', 'They play.', 'Fútbol: Football.', 'juego, juegas, juega, jugamos, jugáis, juegan', false),
      v('practicar', 'practicar', 'To practice', 'work', 'Exercise.', 'Practico tenis.', 'I practice tennis.', 'Él practica.', 'He practices.', 'Tenis: Tenis.', undefined, true),
      v('ganar', 'ganar', 'To win/earn', 'society', 'Victory/Salary.', 'Gano el juego.', 'I win the game.', 'Gano dinero.', 'I earn money.', 'Juego: Game. Dinero: Money.', undefined, true),
      v('perder', 'perder', 'To lose', 'society', 'Defeat/Misplace.', 'Pierdo la llave.', 'I lose the key.', 'Ellos pierden.', 'They lose.', 'Llave: Key.', 'pierdo, pierdes, pierde, perdemos, perdéis, pierden', false),
      a('divertido', 'divertido', 'Funny/Fun', 'social', 'aburrido', 'Boring', 'Trait.', 'Juego divertido.', 'Fun game.', 'Es divertido.', 'It is fun.', 'Juego: Game.'),
      a('aburrido_day7', 'aburrido', 'Boring', 'social', 'divertido', 'Fun', 'Trait.', 'Libro aburrido.', 'Boring book.', 'Es aburrido.', 'It is boring.', 'Libro: Book.'),
      a('talentoso', 'talentoso', 'Talented', 'art', 'mediocre', 'Mediocre', 'Trait.', 'Chica talentosa.', 'Talented girl.', 'Es talentosa.', 'She is talented.', 'Chica: Girl.'),
      a('inteligente', 'inteligente', 'Intelligent', 'work', 'tonto', 'Stupid', 'Trait.', 'Hombre inteligente.', 'Intelligent man.', 'Muy inteligente.', 'Very intelligent.', 'Hombre: Man.'),
      a('tonto', 'tonto', 'Stupid', 'social', 'inteligente', 'Intelligent', 'Trait.', 'Gato tonto.', 'Stupid cat.', 'No seas tonto.', "Don't be stupid.", 'Gato: Cat.'),
      a('capaz', 'capaz', 'Capable', 'work', 'incapaz', 'Incapable', 'Skill.', 'Soy capaz.', 'I am capable.', 'Es capaz.', 'He is capable.', 'Note: Followed by "de".'),
      a('incapaz', 'incapaz', 'Incapable', 'work', 'capaz', 'Capable', 'Skill.', 'Es incapaz.', 'He is incapable.', 'Incapaz de ir.', 'Incapable of going.', 'Ir: To go.'),
      a('activo', 'activo', 'Active', 'body', 'perezoso', 'Lazy', 'Trait.', 'Niño activo.', 'Active boy.', 'Es muy activo.', 'He is very active.', 'Niño: Boy.'),
      a('perezoso', 'perezoso', 'Lazy', 'body', 'activo', 'Active', 'Trait.', 'Perro perezoso.', 'Lazy dog.', 'Soy perezoso.', 'I am lazy.', 'Perro: Dog.'),
      a('especial', 'especial', 'Special', 'abstract', 'común', 'Common', 'Trait.', 'Día especial.', 'Special day.', 'Eres especial.', 'You are special.', 'Día: Day.')
    ]
  },
  {
    id: 'day8',
    title: 'Nature & Travel',
    words: [
      v('viajar', 'viajar', 'To travel', 'travel', 'Journey.', 'Viajo mucho.', 'I travel a lot.', '¿Viajas solo?', 'Do you travel alone?', 'Mucho: A lot.', undefined, true),
      v('volar', 'volar', 'To fly', 'travel', 'Air travel.', 'Vuelo hoy.', 'I fly today.', 'Los pájaros vuelan.', 'Birds fly.', 'Hoy: Today. Pájaros: Birds.', 'vuelo, vuelas, vuela, volamos, voláis, vuelan', false),
      v('subir', 'subir', 'To go up', 'travel', 'Ascend.', 'Subo al tren.', 'I get on the train.', 'Juan sube.', 'Juan goes up.', 'Tren: Train.', undefined, true),
      v('bajar', 'bajar', 'To go down', 'travel', 'Descend.', 'Bajo del bus.', 'I get off the bus.', 'Él baja.', 'He goes down.', 'Bus: Bus.', undefined, true),
      v('entrar', 'entrar', 'To enter', 'travel', 'Coming in.', 'Entro en casa.', 'I enter the house.', 'Ellos entran.', 'They enter.', 'Casa: House.', undefined, true),
      v('esperar', 'esperar', 'To wait/hope', 'travel', 'Waiting.', 'Espero el bus.', 'I wait for the bus.', 'Espero que sí.', 'I hope so.', 'Bus: Bus.', undefined, true),
      v('parar', 'parar', 'To stop', 'travel', 'Ceasing.', 'Paro aquí.', 'I stop here.', 'El tren para.', 'The train stops.', 'Aquí: Here. Tren: Train.', undefined, true),
      v('continuar', 'continuar', 'To continue', 'travel', 'Ongoing.', 'Continuo hoy.', 'I continue today.', 'Él continua.', 'He continues.', 'Hoy: Today.', 'continúo, continúas, continúa, continuamos, continuáis, continúan', true),
      v('llover', 'llover', 'To rain', 'nature', 'Weather.', 'Llueve mucho.', 'It rains a lot.', 'Va a llover.', 'It will rain.', 'Mucho: A lot.', 'llueve (only)', false),
      v('brillar', 'brillar', 'To shine', 'nature', 'Light.', 'El sol brilla.', 'The sun shines.', 'Brilla mucho.', 'It shines a lot.', 'Sol: Sun.', undefined, true),
      a('cerca', 'cerca', 'Near', 'travel', 'lejos', 'Far', 'Distance.', 'Está cerca.', 'It is near.', 'Cerca de aquí.', 'Near here.', 'Note: Used as adverb too.'),
      a('lejos', 'lejos', 'Far', 'travel', 'cerca', 'Near', 'Distance.', 'Está lejos.', 'It is far.', 'Muy lejos.', 'Very far.', 'Note: Used as adverb too.'),
      a('hermoso', 'hermoso', 'Beautiful', 'nature', 'feo', 'Ugly', 'Trait.', 'Playa hermosa.', 'Beautiful beach.', 'Es hermoso.', 'It is beautiful.', 'Playa: Beach.'),
      a('horrible', 'horrible', 'Horrible', 'feelings', 'hermoso', 'Beautiful', 'Trait.', 'Día horrible.', 'Horrible day.', 'Es horrible.', 'It is horrible.', 'Día: Day.'),
      a('cómodo', 'cómodo', 'Comfortable', 'daily', 'incómodo', 'Uncomfortable', 'Trait.', 'Sofá cómodo.', 'Comfortable sofa.', 'Es cómodo.', 'It is comfortable.', 'Sofá: Sofa.'),
      a('incómodo', 'incómodo', 'Uncomfortable', 'daily', 'cómodo', 'Comfortable', 'Trait.', 'Silla incómoda.', 'Uncomfortable chair.', 'Muy incómodo.', 'Very uncomfortable.', 'Silla: Silla.'),
      a('caliente', 'caliente', 'Hot', 'nature', 'frío', 'Cold', 'Temp.', 'Agua caliente.', 'Hot water.', 'Está caliente.', 'It is hot.', 'Agua: Water.'),
      a('frío_adj', 'frío', 'Cold', 'nature', 'caliente', 'Hot', 'Temp.', 'Viento frío.', 'Cold wind.', 'Tengo frío.', 'I am cold.', 'Viento: Wind.'),
      a('seco', 'seco', 'Dry', 'nature', 'mojado', 'Wet', 'State.', 'Suelo seco.', 'Dry floor.', 'Vino seco.', 'Dry wine.', 'Suelo: Floor.'),
      a('mojado', 'mojado', 'Wet', 'nature', 'seco', 'Dry', 'State.', 'Pelo mojado.', 'Wet hair.', 'Está mojado.', 'It is wet.', 'Pelo: Pelo.')
    ]
  },
  {
    id: 'day9',
    title: 'Mind & Logic',
    words: [
      v('pensar', 'pensar', 'To think', 'abstract', 'Cognition.', 'Pienso mucho.', 'I think a lot.', '¿Qué piensas?', 'What do you think?', 'Mucho: A lot.', 'pienso, piensas, piensa, pensamos, pensáis, piensan', false),
      v('creer', 'creer', 'To believe', 'abstract', 'Belief.', 'Creo que sí.', 'I believe so.', 'No te creo.', "I don't believe you.", 'Sí: Yes.', 'creo, cree, cree, creemos, creéis, creen', true),
      v('recordar', 'recordar', 'To remember', 'abstract', 'Memory.', 'Recuerdo tu cara.', 'I remember your face.', 'No recuerdo.', "I don't remember.", 'Cara: Face.', 'recuerdo, recuerdas, recuerda, recordamos, recordáis, recuerdan', false),
      v('olvidar', 'olvidar', 'To forget', 'abstract', 'Loss of memory.', 'Olvido todo.', 'I forget everything.', '¿Me olvidas?', 'Do you forget me?', 'Todo: Everything.', undefined, true),
      v('entender', 'entender', 'To understand', 'abstract', 'Logic.', 'Entiendo ahora.', 'I understand now.', '¿Entiendes?', 'Do you understand?', 'Ahora: Now.', 'entiendo, entiendes, entiende, entendemos, entendéis, entienden', false),
      v('comprender', 'comprender', 'To comprehend', 'abstract', 'Deep understanding.', 'Comprendo el plan.', 'I comprehend the plan.', 'Él comprende.', 'He comprehends.', 'Plan: Plan.', undefined, true),
      v('parecer', 'parecer', 'To seem/look like', 'abstract', 'Appearance.', 'Parece fácil.', 'It seems easy.', 'Te pareces a él.', 'You look like him.', 'Fácil: Easy.', 'parezco, pareces, parece, parecemos, parecéis, parecen', false),
      v('decidir', 'decidir', 'To decide', 'abstract', 'Choice.', 'Decido hoy.', 'I decide today.', 'Juan decide.', 'Juan decides.', 'Hoy: Today.', undefined, true),
      v('intentar', 'intentar', 'To try', 'abstract', 'Attempt.', 'Intento ir.', 'I try to go.', 'Él lo intenta.', 'He tries it.', 'Ir: To go.', undefined, true),
      v('lograr', 'lograr', 'To achieve', 'work', 'Success.', 'Logro mi meta.', 'I achieve my goal.', 'Él lo logra.', 'He achieves it.', 'Meta: Goal.', undefined, true),
      a('seguro', 'seguro', 'Sure/Safe', 'abstract', 'peligroso', 'Dangerous', 'Status.', 'Estoy seguro.', 'I am sure.', 'Lugar seguro.', 'Safe place.', 'Lugar: Place.'),
      a('peligroso', 'peligroso', 'Dangerous', 'society', 'seguro', 'Safe', 'Status.', 'Perro peligroso.', 'Dangerous dog.', 'Es peligroso.', 'It is dangerous.', 'Perro: Dog.'),
      a('posible_day9', 'posible', 'Possible', 'abstract', 'imposible', 'Impossible', 'Likelihood.', 'Es posible.', 'It is possible.', 'Todo es posible.', 'Everything is possible.', ''),
      a('imposible', 'imposible', 'Impossible', 'abstract', 'posible', 'Possible', 'Likelihood.', 'Es imposible.', 'It is imposible.', 'Nada es imposible.', 'Nothing is impossible.', 'Nada: Nothing.'),
      a('real', 'real', 'Real', 'abstract', 'ficticio', 'Fictitious', 'Nature.', 'Vida real.', 'Real life.', 'Es real.', 'It is real.', 'Vida: Life.'),
      a('ficticio', 'ficticio', 'Fictitious', 'art', 'real', 'Real', 'Nature.', 'Cuento ficticio.', 'Fictitious story.', 'Es ficticio.', 'It is fictitious.', 'Cuento: Story.'),
      a('lógico', 'lógico', 'Logical', 'abstract', 'absurdo', 'Absurd', 'Logic.', 'Plan lógico.', 'Logical plan.', 'Es lógico.', 'It is logical.', 'Plan: Plan.'),
      a('extraño', 'extraño', 'Strange', 'abstract', 'normal', 'Normal', 'Nature.', 'Ruido extraño.', 'Strange noise.', 'Es extraño.', 'It is strange.', 'Ruido: Noise.'),
      a('simple', 'simple', 'Simple', 'abstract', 'complejo', 'Complex', 'Complexity.', 'Idea simple.', 'Simple idea.', 'Es simple.', 'It is simple.', 'Idea: Idea.'),
      a('complejo', 'complejo', 'Complex', 'work', 'simple', 'Simple', 'Complexity.', 'Sistema complejo.', 'Complex system.', 'Es complejo.', 'It is complex.', 'Sistema: System.')
    ]
  },
  {
    id: 'day10',
    title: 'Life & Growth',
    words: [
      v('nacer', 'nacer', 'To be born', 'life', 'Beginning.', 'Nazco en mayo.', 'I am born in May.', 'Él nace hoy.', 'He is born today.', 'Mayo: May. Hoy: Today.', 'nazco, naces, nace, nacemos, nacéis, nacen', false),
      v('crecer', 'crecer', 'To grow', 'life', 'Growth.', 'Crezco mucho.', 'I grow a lot.', 'La planta crece.', 'The plant grows.', 'Planta: Plant.', 'crezco, creces, crece, crecemos, crecéis, crecen', false),
      v('cambiar', 'cambiar', 'To change', 'abstract', 'Modification.', 'Cambio mi vida.', 'I change my life.', 'Todo cambia.', 'Everything changes.', 'Vida: Life.', undefined, true),
      v('mejorar', 'mejorar', 'To improve', 'work', 'Betterment.', 'Mejoro mi español.', 'I improve my Spanish.', 'Él mejora.', 'He improves.', 'Español: Spanish.', undefined, true),
      v('empezar', 'empezar', 'To start', 'abstract', 'Initiation.', 'Empiezo hoy.', 'I start today.', 'La clase empieza.', 'The class starts.', 'Clase: Class.', 'empiezo, empiezas, empieza, empezamos, empezáis, piensan', false),
      v('terminar', 'terminar', 'To end', 'abstract', 'Completion.', 'Termino mi café.', 'I finish my coffee.', 'La película termina.', 'The movie ends.', 'Café: Coffee. Película: Movie.', undefined, true),
      v('aprender', 'aprender', 'To learn', 'work', 'Knowledge gain.', 'Aprendo mucho.', 'I learn a lot.', '¿Qué aprendes?', 'What do you learn?', 'Mucho: A lot.', undefined, true),
      v('enseñar', 'enseñar', 'To teach/show', 'work', 'Instruct.', 'Enseño español.', 'I teach Spanish.', '¿Me enseñas?', 'Do you show me?', 'Español: Spanish.', undefined, true),
      v('prometer', 'prometer', 'To promise', 'social', 'Commitment.', 'Prometo ir.', 'I promise to go.', 'Él promete.', 'He promises.', 'Ir: To go.', undefined, true),
      v('cumplir', 'cumplir', 'To fulfill/turn (age)', 'life', 'Completion.', 'Cumplo mi palabra.', 'I fulfill my word.', 'Cumplo 20 años.', 'I turn 20.', 'Palabra: Word. Años: Years.', undefined, true),
      a('maravilloso', 'maravilloso', 'Wonderful', 'feelings', 'horrible', 'Horrible', 'Trait.', 'Mundo maravilloso.', 'Wonderful world.', 'Es maravilloso.', 'It is wonderful.', 'Mundo: World.'),
      a('estupendo', 'estupendo', 'Great', 'feelings', 'malo', 'Bad', 'Trait.', 'Día estupendo.', 'Great day.', '¡Estupendo!', 'Great!', 'Día: Day.'),
      a('increíble', 'increíble', 'Incredible', 'abstract', 'creíble', 'Believable', 'Trait.', 'Idea increíble.', 'Incredible idea.', 'Es increíble.', 'It is incredible.', 'Idea: Idea.'),
      a('natural', 'natural', 'Natural', 'nature', 'artificial', 'Artificial', 'Nature.', 'Agua natural.', 'Natural water.', 'Es natural.', 'It is natural.', 'Agua: Water.'),
      a('artificial', 'artificial', 'Artificial', 'tech', 'natural', 'Natural', 'Nature.', 'Luz artificial.', 'Artificial light.', 'Es artificial.', 'It is artificial.', 'Luz: Luz.'),
      a('duro', 'duro', 'Hard/Tough', 'nature', 'suave', 'Soft', 'Texture/Difficulty.', 'Pan duro.', 'Hard bread.', 'Trabajo duro.', 'Hard work.', 'Pan: Bread. Trabajo: Job.'),
      a('suave', 'suave', 'Soft/Smooth', 'nature', 'duro', 'Hard', 'Texture.', 'Pelo suave.', 'Soft hair.', 'Es suave.', 'It is soft.', 'Pelo: Pelo.'),
      a('claro_adj', 'claro', 'Clear/Light (color)', 'nature', 'oscuro', 'Dark', 'Luminosity.', 'Agua clara.', 'Clear water.', 'Azul claro.', 'Light blue.', 'Agua: Water. Azul: Blue.'),
      a('oscuro_adj', 'oscuro', 'Dark', 'nature', 'claro', 'Clear', 'Luminosity.', 'Noche oscura.', 'Dark night.', 'Verde oscuro.', 'Dark green.', 'Noche: Night. Verde: Green.'),
      a('perfecto', 'perfecto', 'Perfect', 'abstract', 'imperfecto', 'Imperfect', 'Quality.', 'Mundo perfecto.', 'Perfect world.', 'Es perfecto.', 'It is perfect.', 'Mundo: World.')
    ]
  }
];

// --- EXPANSION CANDIDATES (150+ NOUNS AND TOOLS) ---
export const EXTRA_CANDIDATES: Word[] = [
  // --- SURVIVAL ESSENTIALS (Day 1-3 Loot) ---
  n('amigo', 'amigo', 'Friend', 'social', 'm', 'Companion.', 'Es mi amigo.', 'He is my friend.', 'Buen amigo.', 'Good friend.', 'Note: Feminine is Amiga.'),
  n('casa', 'casa', 'House/Home', 'daily', 'f', 'Living place.', 'Estoy en casa.', 'I am at home.', 'Casa grande.', 'Big house.', 'Note: "En casa" means at home.'),
  n('libro', 'libro', 'Book', 'work', 'm', 'Reading.', 'Leo un libro.', 'I read a book.', 'Libro viejo.', 'Old book.', 'Note: Verb Leer.'),
  n('perro', 'perro', 'Dog', 'nature', 'm', 'Pet.', 'Tengo un perro.', 'I have a dog.', 'Perro gordo.', 'Fat dog.', 'Note: Fem is Perra.'),
  n('gato', 'gato', 'Cat', 'nature', 'm', 'Pet.', 'Gato pequeño.', 'Small cat.', 'Mi gato duerme.', 'My cat sleeps.', 'Note: Known for independence.'),
  n('agua', 'agua', 'Water', 'food', 'f', 'Vital liquid.', 'Bebo agua.', 'I drink water.', 'Agua fría.', 'Cold water.', 'Note: El agua (s), Las aguas (p).'),
  n('cafe', 'café', 'Coffee', 'food', 'm', 'Drink.', 'Quiero un café.', 'I want a coffee.', 'Café solo.', 'Black coffee.', 'Note: Solo = plain/black.'),
  n('pan', 'pan', 'Bread', 'food', 'm', 'Basic food.', 'Como pan.', 'I eat bread.', 'Pan rico.', 'Tasty bread.', 'Note: Pair with Comer.'),
  n('coche', 'coche', 'Car', 'travel', 'm', 'Vehicle.', 'Mi coche is nuevo.', 'My car is new.', 'Voy en coche.', 'I go by car.', 'Note: Carro in LatAm.'),
  n('dinero', 'dinero', 'Money', 'society', 'm', 'Currency.', 'No tengo dinero.', 'I have no money.', 'Mucho dinero.', 'A lot of money.', 'Note: Uncountable logic.'),
  n('llave', 'llave', 'Key', 'daily', 'f', 'Tool.', 'Busco la llave.', 'I look for the key.', 'Llaves de casa.', 'House keys.', 'Note: Plural is Llaves.'),
  n('movil', 'móvil', 'Mobile Phone', 'tech', 'm', 'Device.', 'Uso mi móvil.', 'I use my mobile.', 'Móvil nuevo.', 'New phone.', 'Note: Celular in LatAm.'),
  n('ropa', 'ropa', 'Clothes', 'daily', 'f', 'Apparel.', 'Llevo ropa roja.', 'I wear red clothes.', 'Ropa limpia.', 'Clean clothes.', 'Note: Usually singular for "clothes".'),
  n('bolso', 'bolso', 'Bag', 'daily', 'm', 'Carrier.', 'Llevo mi bolso.', 'I carry my bag.', 'Bolso negro.', 'Black bag.', 'Note: Smaller than Maleta.'),
  
  // --- ANATOMY & FAMILY (Loot) ---
  n('familia', 'familia', 'Family', 'social', 'f', 'Relatives.', 'Mi familia.', 'My family.', 'Familia grande.', 'Large family.', 'Note: Singular in Spanish.'),
  n('madre', 'madre', 'Mother', 'social', 'f', 'Parent.', 'Mi madre es Ana.', 'My mother is Ana.', 'Madre joven.', 'Young mother.', 'Note: Mom is Mamá.'),
  n('padre', 'padre', 'Father', 'social', 'm', 'Parent.', 'Mi padre trabaja.', 'My father works.', 'Padre bueno.', 'Good father.', 'Note: Dad is Papá.'),
  n('hermano', 'hermano', 'Brother', 'social', 'm', 'Sibling.', 'Tengo un hermano.', 'I have a brother.', 'Hermano mayor.', 'Older brother.', 'Note: Sister is Hermana.'),
  n('hijo', 'hijo', 'Son', 'social', 'm', 'Child.', 'Es mi hijo.', 'He is my son.', 'Hijo pequeño.', 'Small son.', 'Note: Daughter is Hija.'),
  n('gente', 'gente', 'People', 'social', 'f', 'Humans.', 'Hay mucha gente.', 'There are many people.', 'Gente feliz.', 'Happy people.', 'Note: Always singular (La gente).'),
  n('persona', 'persona', 'Person', 'social', 'f', 'Individual.', 'Una persona.', 'One person.', 'Buena persona.', 'Good person.', 'Note: Always feminine gender.'),
  n('cabeza', 'cabeza', 'Head', 'body', 'f', 'Top part.', 'Me duele la cabeza.', 'My head hurts.', 'Cabeza alta.', 'Head high.', 'Note: Body parts often use "La".'),
  n('mano', 'mano', 'Hand', 'body', 'f', 'Body part.', 'Lávate las manos.', 'Wash your hands.', 'Mano derecha.', 'Right hand.', 'Note: Feminine despite ending in -o.'),
  n('ojo', 'ojo', 'Eye', 'body', 'm', 'Organ.', 'Ojos azules.', 'Blue eyes.', 'Abre los ojos.', 'Open your eyes.', 'Note: Plural is Ojos.'),
  n('boca', 'boca', 'Mouth', 'body', 'f', 'Organ.', 'Cierra la boca.', 'Close your mouth.', 'Boca grande.', 'Big mouth.', 'Note: Important for eating.'),
  n('corazon', 'corazón', 'Heart', 'body', 'm', 'Vital organ.', 'Mi corazón.', 'My heart.', 'Buen corazón.', 'Good heart.', 'Note: Symbol of love.'),

  // --- FOOD & DINING (Loot) ---
  n('leche', 'leche', 'Milk', 'food', 'f', 'Liquid.', 'Café con leche.', 'Coffee with milk.', 'Leche fría.', 'Cold milk.', 'Note: Essential for breakfast.'),
  n('te', 'té', 'Tea', 'food', 'm', 'Drink.', 'Quiero un té.', 'I want a tea.', 'Té verde.', 'Green tea.', 'Note: Accent on "té" distinguishes it.'),
  n('vino', 'vino', 'Wine', 'food', 'm', 'Drink.', 'Vino tinto.', 'Red wine.', 'Bebo vino.', 'I drink wine.', 'Note: Popular in Spain.'),
  n('fruta', 'fruta', 'Fruit', 'food', 'f', 'Food.', 'Como mucha fruta.', 'I eat a lot of fruit.', 'Fruta dulce.', 'Sweet fruit.', 'Note: General term.'),
  n('arroz', 'arroz', 'Rice', 'food', 'm', 'Grain.', 'Como arroz.', 'I eat rice.', 'Arroz blanco.', 'White rice.', 'Note: Common side dish.'),
  n('azucar', 'azúcar', 'Sugar', 'food', 'm', 'Sweetener.', 'Sin azúcar.', 'Without sugar.', 'Azúcar dulce.', 'Sweet sugar.', 'Note: Can be m or f, usually m.'),
  n('sal', 'sal', 'Salt', 'food', 'f', 'Seasoning.', 'Pásame la sal.', 'Pass me the salt.', 'Sal fina.', 'Fine salt.', 'Note: Opposite of Sugar.'),

  // --- URBAN & HOME (Loot) ---
  n('ciudad', 'ciudad', 'City', 'travel', 'f', 'Metropolis.', 'Ciudad grande.', 'Large city.', 'Vivo en la ciudad.', 'I live in the city.', 'Note: Nouns in -dad are feminine.'),
  n('pueblo', 'pueblo', 'Town/People', 'travel', 'm', 'Village.', 'Pueblo pequeño.', 'Small town.', 'Mi pueblo.', 'My town.', 'Note: Also means "the people/nation".'),
  n('calle', 'calle', 'Street', 'travel', 'f', 'Road.', 'Calle ancha.', 'Wide street.', 'Cruza la calle.', 'Cross the street.', 'Note: Used in addresses.'),
  n('tienda', 'tienda', 'Shop/Store', 'society', 'f', 'Commerce.', 'Voy a la tienda.', 'I go to the shop.', 'Tienda de ropa.', 'Clothing store.', 'Note: Verb is Comprar.'),
  n('mercado', 'mercado', 'Market', 'society', 'm', 'Trade.', 'Mercado libre.', 'Free market.', 'Fruta del mercado.', 'Fruit from the market.', 'Note: Typical for food.'),
  n('oficina', 'oficina', 'Office', 'work', 'f', 'Workplace.', 'Estoy en la oficina.', 'I am in the office.', 'Oficina nueva.', 'New office.', 'Note: Pair with Trabajar.'),
  n('mesa', 'mesa', 'Table', 'daily', 'f', 'Furniture.', 'Mesa de madera.', 'Wooden table.', 'En la mesa.', 'On the table.', 'Note: Essential for dining.'),
  n('silla', 'silla', 'Chair', 'daily', 'f', 'Furniture.', 'Silla cómoda.', 'Comfortable chair.', 'Siéntate en la silla.', 'Sit on the chair.', 'Note: Pair with Sentarse.'),
  n('cama', 'cama', 'Bed', 'daily', 'f', 'Furniture.', 'Voy a la cama.', 'I go to bed.', 'Cama grande.', 'Large bed.', 'Note: Pair with Dormir.'),
  n('ventana', 'ventana', 'Window', 'daily', 'f', 'Opening.', 'Abre la ventana.', 'Open the window.', 'Ventana sucia.', 'Dirty window.', 'Note: Pair with Mirar.'),
  n('puerta', 'puerta', 'Door', 'daily', 'f', 'Opening.', 'Cierra la puerta.', 'Close the door.', 'Puerta abierta.', 'Open door.', 'Note: Pair with Salir.'),

  // --- NATURE & EARTH (Loot) ---
  n('mar', 'mar', 'Sea', 'nature', 'm', 'Ocean.', 'El mar is azul.', 'The sea is blue.', 'Nado en el mar.', 'I swim in the sea.', 'Note: Usually masculine.'),
  n('rio', 'río', 'River', 'nature', 'm', 'Waterway.', 'Río largo.', 'Long river.', 'Agua del río.', 'River water.', 'Note: Accent on i.'),
  n('montaña', 'montaña', 'Mountain', 'nature', 'f', 'Peak.', 'Montaña alta.', 'High mountain.', 'Subo la montaña.', 'I climb the mountain.', 'Note: Contains ñ.'),
  n('bosque', 'bosque', 'Forest', 'nature', 'm', 'Woods.', 'Bosque oscuro.', 'Dark forest.', 'Árboles del bosque.', 'Forest trees.', 'Note: Quiet place.'),
  n('arbol', 'árbol', 'Tree', 'nature', 'm', 'Plant.', 'Árbol verde.', 'Green tree.', 'Bajo el árbol.', 'Under the tree.', 'Note: Plural is Árboles.'),
  n('flor', 'flor', 'Flower', 'nature', 'f', 'Plant part.', 'Flor hermosa.', 'Beautiful flower.', 'Doy una flor.', 'I give a flower.', 'Note: Feminine despite ending.'),
  n('tierra', 'tierra', 'Earth/Soil', 'nature', 'f', 'Ground.', 'Tierra fértil.', 'Fertile soil.', 'Toda la tierra.', 'All the earth.', 'Note: Also planet Earth.'),
  n('cielo', 'cielo', 'Sky/Heaven', 'nature', 'm', 'Above.', 'Cielo despejado.', 'Clear sky.', 'Miro al cielo.', 'I look at the sky.', 'Note: Beautiful color.'),
  n('sol', 'sol', 'Sun', 'nature', 'm', 'Star.', 'Hace sol.', 'It is sunny.', 'El sol brilla.', 'The sun shines.', 'Note: Pair with Brillar.'),
  n('luna', 'luna', 'Moon', 'nature', 'f', 'Satellite.', 'Luna llena.', 'Full moon.', 'Veo la luna.', 'I see the moon.', 'Note: At night.'),
  n('estrella', 'estrella', 'Star', 'nature', 'f', 'Celestial.', 'Estrella fugaz.', 'Shooting star.', 'Mil estrellas.', 'A thousand stars.', 'Note: Brightness.'),

  // --- TIME & ABSTRACT (Loot) ---
  n('semana', 'semana', 'Week', 'time', 'f', '7 days.', 'Esta semana.', 'This week.', 'Semana santa.', 'Holy week.', 'Note: Lunes to Domingo.'),
  n('mes', 'mes', 'Month', 'time', 'm', '30 days.', 'El mes próximo.', 'Next month.', 'Mes de mayo.', 'Month of May.', 'Note: Plural is Meses.'),
  n('año', 'año', 'Year', 'time', 'm', '365 days.', 'Año nuevo.', 'New year.', 'Tengo 20 años.', 'I am 20 years old.', 'Note: Use "Tener" for age.'),
  n('verdad', 'verdad', 'Truth', 'abstract', 'f', 'Fact.', 'Digo la verdad.', 'I say the truth.', 'Es verdad.', 'It is true.', 'Note: Opposite of Mentira.'),
  n('mentira', 'mentira', 'Lie', 'abstract', 'f', 'Falsehood.', 'Es una mentira.', 'It is a lie.', 'No digas mentiras.', "Don't tell lies.", 'Note: Avoid these!'),

  // --- PURPLE TOOLS (Connectors & Interrogatives) ---
  m('y_tool', 'y', 'And', 'grammar', 'Addition.', 'Juan y Ana.', 'Juan and Ana.', 'Addition', 'Becomes "e" before i/hi.', 'connector', 'Essential Bridge.'),
  m('o_tool', 'o', 'Or', 'grammar', 'Choice.', '¿Té o café?', 'Tea or coffee?', 'Choice', 'Becomes "u" before o/ho.', 'connector', 'Decision Key.'),
  m('pero_tool', 'pero', 'But', 'grammar', 'Contrast.', 'Es caro, pero bueno.', 'Expensive but good.', 'Contrast', 'Connects opposite ideas.', 'connector', 'Logic Bridge.'),
  m('porque_tool', 'porque', 'Because', 'grammar', 'Reason.', 'Como porque tengo hambre.', 'I eat because I am hungry.', 'Reason', 'Explains the why.', 'connector', 'The Explainer.'),
  m('aunque_tool', 'aunque', 'Although', 'grammar', 'Concession.', 'Aunque llueva, voy.', 'Although it rains, I go.', 'Concession', 'Higher A1 level tool.', 'connector', 'Advanced Bridge.'),
  m('si_tool', 'si', 'If', 'grammar', 'Condition.', 'Si quieres, vamos.', 'If you want, we go.', 'Condition', 'No accent (unlike Sí=Yes).', 'connector', 'Condition Key.'),
  
  m('que_q', '¿qué?', 'What?', 'grammar', 'Inquiry.', '¿Qué is esto?', 'What is this?', 'Question', 'Identifies objects.', 'interrogative', 'Universal Key.'),
  m('quien_q', '¿quién?', 'Who?', 'grammar', 'Inquiry.', '¿Quién is él?', 'Who is he?', 'Question', 'Identifies people.', 'interrogative', 'Person Key.'),
  m('donde_q', '¿dónde?', 'Where?', 'grammar', 'Inquiry.', '¿Dónde estás?', 'Where are you?', 'Question', 'Identifies location.', 'interrogative', 'Map Key.'),
  m('cuando_q', '¿cuándo?', 'When?', 'grammar', 'Inquiry.', '¿Cuándo vienes?', 'When are you coming?', 'Question', 'Identifies time.', 'interrogative', 'Time Key.'),
  m('como_q', '¿cómo?', 'How?', 'grammar', 'Inquiry.', '¿Cómo estás?', 'How are you?', 'Question', 'Identifies manner.', 'interrogative', 'State Key.'),
  m('por_que_q', '¿por qué?', 'Why?', 'grammar', 'Inquiry.', '¿Por qué ríes?', 'Why do you laugh?', 'Question', 'Asks for reason (two words).', 'interrogative', 'Reason Key.'),
  m('cuanto_q', '¿cuánto?', 'How much?', 'grammar', 'Inquiry.', '¿Cuánto cuesta?', 'How much does it cost?', 'Question', 'Asks for quantity.', 'interrogative', 'Price Key.'),

  // --- PURPLE TOOLS (Adverbs & Time) ---
  m('hoy_tool', 'hoy', 'Today', 'time', 'Present.', 'Hoy is lunes.', 'Today is Monday.', 'Present', 'Current day.', 'adverb', 'Time Tool.'),
  m('mañana_tool', 'mañana', 'Tomorrow', 'time', 'Future.', 'Mañana voy.', 'I go tomorrow.', 'Future', 'Next day.', 'adverb', 'Time Tool.'),
  m('ayer_tool', 'ayer', 'Yesterday', 'time', 'Past.', 'Ayer comí.', 'I ate yesterday.', 'Past', 'Previous day.', 'adverb', 'Time Tool.'),
  m('ahora_tool', 'ahora', 'Now', 'time', 'Immediate.', 'Hazlo ahora.', 'Do it now.', 'Immediate', 'The present moment.', 'adverb', 'Action Tool.'),
  m('luego_tool', 'luego', 'Later', 'time', 'Sequence.', 'Hasta luego.', 'See you later.', 'Sequence', 'In the near future.', 'adverb', 'Time Tool.'),
  m('antes_tool', 'antes', 'Before', 'time', 'Sequence.', 'Antes de comer.', 'Before eating.', 'Sequence', 'Earlier than.', 'adverb', 'Logic Tool.'),
  m('despues_tool', 'después', 'After', 'time', 'Sequence.', 'Después de ir.', 'After going.', 'Sequence', 'Later than.', 'adverb', 'Logic Tool.'),
  m('siempre_tool', 'siempre', 'Always', 'time', 'Frequency.', 'Siempre te amo.', 'I always love you.', 'Frequency', '100% of the time.', 'adverb', 'Frequency Tool.'),
  m('nunca_tool', 'nunca', 'Never', 'time', 'Frequency.', 'Nunca fumo.', 'I never smoke.', 'Frequency', '0% of the time.', 'adverb', 'Frequency Tool.'),
  
  m('aqui_tool', 'aquí', 'Here', 'travel', 'Place.', 'Estoy aquí.', 'I am here.', 'Place', 'This location.', 'adverb', 'Locative.'),
  m('alli_tool', 'allí', 'There', 'travel', 'Place.', 'Está allí.', 'It is there.', 'Place', 'That location.', 'adverb', 'Locative.'),
  m('muy_tool', 'muy', 'Very', 'grammar', 'Degree.', 'Muy bien.', 'Very well.', 'Degree', 'Intensifier.', 'adverb', 'Degree Tool.'),
  m('mas_tool', 'más', 'More', 'grammar', 'Degree.', 'Más café.', 'More coffee.', 'Degree', 'Additional.', 'adverb', 'Degree Tool.'),
  m('menos_tool', 'menos', 'Less', 'grammar', 'Degree.', 'Menos azúcar.', 'Less sugar.', 'Degree', 'Reduction.', 'adverb', 'Degree Tool.'),
  
  // --- PURPLE TOOLS (Quantifiers & Logic) ---
  m('todo_tool', 'todo', 'All/Everything', 'grammar', 'Total.', 'Todo está listo.', 'Everything is ready.', 'Total', 'Universal quantifier.', 'misc', 'Logic Key.'),
  m('nada_tool', 'nada', 'Nothing', 'grammar', 'Zero.', 'No tengo nada.', 'I have nothing.', 'Zero', 'The void.', 'misc', 'Logic Key.'),
  m('algo_tool', 'algo', 'Something', 'grammar', 'Indefinite.', 'Quiero algo.', 'I want something.', 'Indefinite', 'A thing.', 'misc', 'Logic Key.'),
  m('alguien_tool', 'alguien', 'Someone', 'social', 'Indefinite.', '¿Hay alguien?', 'Is someone there?', 'Indefinite', 'A person.', 'misc', 'Logic Key.'),
  m('nadie_tool', 'nadie', 'No one', 'social', 'Zero.', 'Nadie sabe.', 'No one knows.', 'Zero', 'Zero people.', 'misc', 'Logic Key.'),
  
  // --- PURPLE TOOLS (Prepositions) ---
  m('con_tool', 'con', 'With', 'grammar', 'Company.', 'Voy con él.', 'I go with him.', 'Company', 'Connection.', 'preposition', 'Bridge Tool.'),
  m('sin_tool', 'sin', 'Without', 'grammar', 'Lack.', 'Sin miedo.', 'Without fear.', 'Lack', 'Disconnection.', 'preposition', 'Bridge Tool.'),
  m('para_tool', 'para', 'For/To', 'grammar', 'Purpose.', 'Es para ti.', 'It is for you.', 'Purpose', 'The goal.', 'preposition', 'Purpose Key.'),
  m('por_tool', 'por', 'By/For/Through', 'grammar', 'Cause.', 'Por la mañana.', 'In the morning.', 'Cause/Path', 'Broad usage.', 'preposition', 'Universal Bridge.'),

// --- ADVANCED BODY PARTS (Loot) ---我粘贴的
  n('espalda', 'espalda', 'Back', 'body', 'f', 'Body part.', 'Me duele la espalda.', 'My back hurts.', 'Espalda recta.', 'Straight back.', 'Note: Important for posture.'),
  n('pierna', 'pierna', 'Leg', 'body', 'f', 'Body part.', 'Piernas largas.', 'Long legs.', 'Me duele la pierna.', 'My leg hurts.', 'Note: Plural is Piernas.'),
  n('brazo', 'brazo', 'Arm', 'body', 'm', 'Body part.', 'Brazo fuerte.', 'Strong arm.', 'Levanta el brazo.', 'Lift your arm.', 'Note: Plural is Brazos.'),
  n('hombro', 'hombro', 'Shoulder', 'body', 'm', 'Body part.', 'Hombros anchos.', 'Wide shoulders.', 'Me duele el hombro.', 'My shoulder hurts.', 'Note: Plural is Hombros.'),
  n('oreja', 'oreja', 'Ear', 'body', 'f', 'Outer ear.', 'Orejas pequeñas.', 'Small ears.', 'Tengo dos orejas.', 'I have two ears.', 'Note: Inner ear is Oído.'),
  n('nariz', 'nariz', 'Nose', 'body', 'f', 'Face part.', 'Nariz fría.', 'Cold nose.', 'Respiro por la nariz.', 'I breathe through my nose.', 'Note: Plural is Narices.'),
  n('cuello', 'cuello', 'Neck', 'body', 'm', 'Body part.', 'Cuello largo.', 'Long neck.', 'Llevo un collar.', 'I wear a necklace.', 'Note: Connects head to body.'),
  n('rodilla', 'rodilla', 'Knee', 'body', 'f', 'Joint.', 'Me duele la rodilla.', 'My knee hurts.', 'Dobla la rodilla.', 'Bend the knee.', 'Note: Plural is Rodillas.'),
  n('pie', 'pie', 'Foot', 'body', 'm', 'Lower limb.', 'Pies grandes.', 'Big feet.', 'Voy a pie.', 'I go on foot.', 'Note: "A pie" means walking.'),
  n('dedo', 'dedo', 'Finger/Toe', 'body', 'm', 'Digit.', 'Diez dedos.', 'Ten fingers.', 'Dedo largo.', 'Long finger.', 'Note: Use for hand or foot.'),

  // --- CLOTHING & ACCESSORIES (Loot) ---
  n('camisa', 'camisa', 'Shirt', 'daily', 'f', 'Apparel.', 'Camisa blanca.', 'White shirt.', 'Llevo una camisa.', 'I wear a shirt.', 'Note: Usually buttoned.'),
  n('pantalon', 'pantalón', 'Pants', 'daily', 'm', 'Apparel.', 'Pantalón azul.', 'Blue pants.', 'Pantalón corto.', 'Shorts.', 'Note: Often plural "pantalones".'),
  n('zapato', 'zapato', 'Shoe', 'daily', 'm', 'Footwear.', 'Zapato nuevo.', 'New shoe.', 'Me quito los zapatos.', 'I take off my shoes.', 'Note: Plural is Zapatos.'),
  n('sombrero', 'sombrero', 'Hat', 'daily', 'm', 'Headwear.', 'Sombrero grande.', 'Big hat.', 'Lleva sombrero.', 'He wears a hat.', 'Note: Iconic in culture.'),
  n('falda', 'falda', 'Skirt', 'daily', 'f', 'Apparel.', 'Falda corta.', 'Short skirt.', 'Ella lleva falda.', 'She wears a skirt.', 'Note: Plural is Faldas.'),
  n('vestido', 'vestido', 'Dress', 'daily', 'm', 'Apparel.', 'Vestido hermoso.', 'Beautiful dress.', 'Quiero ese vestido.', 'I want that dress.', 'Note: Also past participle of vestir.'),
  n('calcetin', 'calcetín', 'Sock', 'daily', 'm', 'Footwear.', 'Calcetín rojo.', 'Red sock.', 'Busco mi calcetín.', 'I look for my sock.', 'Note: Plural is Calcetines.'),
  n('abrigo', 'abrigo', 'Coat', 'daily', 'm', 'Outerwear.', 'Abrigo negro.', 'Black coat.', 'Tengo frío, uso abrigo.', 'I am cold, I use a coat.', 'Note: For winter.'),
  n('gafas', 'gafas', 'Glasses', 'daily', 'f', 'Eyewear.', 'Gafas de sol.', 'Sunglasses.', 'Uso gafas.', 'I use glasses.', 'Note: Always plural (Las gafas).'),
  n('chaqueta', 'chaqueta', 'Jacket', 'daily', 'f', 'Outerwear.', 'Chaqueta ligera.', 'Light jacket.', 'Dame la chaqueta.', 'Give me the jacket.', 'Note: Shorter than abrigo.'),

  // --- ANIMAL KINGDOM (Loot) ---
  n('leon', 'león', 'Lion', 'nature', 'm', 'Wild animal.', 'León fuerte.', 'Strong lion.', 'El rey león.', 'The lion king.', 'Note: Plural is Leones.'),
  n('elefante', 'elefante', 'Elephant', 'nature', 'm', 'Wild animal.', 'Elefante grande.', 'Big elephant.', 'Veo un elefante.', 'I see an elephant.', 'Note: Known for memory.'),
  n('serpiente', 'serpiente', 'Snake', 'nature', 'f', 'Reptile.', 'Serpiente larga.', 'Long snake.', 'Cuidado, una serpiente.', 'Careful, a snake.', 'Note: Dangerous animals.'),
  n('pajaro', 'pájaro', 'Bird', 'nature', 'm', 'Avian.', 'Pájaro azul.', 'Blue bird.', 'El pájaro vuela.', 'The bird flies.', 'Note: General term.'),
  n('pez', 'pez', 'Fish', 'nature', 'm', 'Aquatic.', 'Pez de colores.', 'Goldfish.', 'El pez nada.', 'The fish swims.', 'Note: Pescado when cooked.'),
  n('caballo', 'caballo', 'Horse', 'nature', 'm', 'Mammal.', 'Caballo rápido.', 'Fast horse.', 'Monto a caballo.', 'I ride a horse.', 'Note: "A caballo" = riding.'),
  n('vaca', 'vaca', 'Cow', 'nature', 'f', 'Farm animal.', 'Vaca gorda.', 'Fat cow.', 'La vaca da leche.', 'The cow gives milk.', 'Note: Important for food.'),
  n('oveja', 'oveja', 'Sheep', 'nature', 'f', 'Farm animal.', 'Oveja blanca.', 'White sheep.', 'Cuento ovejas.', 'I count sheep.', 'Note: Known for wool.'),
  n('cerdo', 'cerdo', 'Pig', 'nature', 'm', 'Farm animal.', 'Cerdo rosa.', 'Pink pig.', 'El cerdo come mucho.', 'The pig eats a lot.', 'Note: Also means "dirty".'),
  n('conejo', 'conejo', 'Rabbit', 'nature', 'm', 'Mammal.', 'Conejo pequeño.', 'Small rabbit.', 'El conejo salta.', 'The rabbit jumps.', 'Note: Long ears.'),

  // --- JOBS & IDENTITY (Loot) ---
  n('medico', 'médico', 'Doctor', 'work', 'm', 'Profession.', 'Soy médico.', 'I am a doctor.', 'Médico bueno.', 'Good doctor.', 'Note: Fem is Médica.'),
  n('profesor', 'profesor', 'Teacher', 'work', 'm', 'Profession.', 'Mi profesor.', 'My teacher.', 'Profesor serio.', 'Serious teacher.', 'Note: Fem is Profesora.'),
  n('estudiante', 'estudiante', 'Student', 'work', 'm', 'Role.', 'Soy estudiante.', 'I am a student.', 'Estudiante aplicado.', 'Diligent student.', 'Note: Same for m/f.'),
  n('policia', 'policía', 'Police', 'society', 'm', 'Force.', 'Llama a la policía.', 'Call the police.', 'Policía local.', 'Local police.', 'Note: Same for m/f.'),
  n('cocinero', 'cocinero', 'Cook/Chef', 'work', 'm', 'Profession.', 'Buen cocinero.', 'Good cook.', 'El cocinero trabaja.', 'The chef works.', 'Note: Verb is Cocinar.'),
  n('camarero', 'camarero', 'Waiter', 'work', 'm', 'Profession.', 'Camarero, la cuenta.', 'Waiter, the bill.', 'Él es camarero.', 'He is a waiter.', 'Note: In a restaurant.'),
  n('ingeniero', 'ingeniero', 'Engineer', 'work', 'm', 'Profession.', 'Ingeniero civil.', 'Civil engineer.', 'Soy ingeniero.', 'I am an engineer.', 'Note: Professional role.'),
  n('arquitecto', 'arquitecto', 'Architect', 'work', 'm', 'Profession.', 'Arquitecto famoso.', 'Famous architect.', 'Ella es arquitecta.', 'She is an architect.', 'Note: Designs buildings.'),
  n('dentista', 'dentista', 'Dentist', 'work', 'm', 'Profession.', 'Voy al dentista.', 'I go to the dentist.', 'Buen dentista.', 'Good dentist.', 'Note: Same for m/f.'),
  n('bombero', 'bombero', 'Firefighter', 'society', 'm', 'Profession.', 'Bombero valiente.', 'Brave firefighter.', 'Viene el bombero.', 'The firefighter comes.', 'Note: Extinguishes fire.'),

  // --- ESSENTIAL LOCATIONS (Loot) ---
  n('playa', 'playa', 'Beach', 'travel', 'f', 'Location.', 'Voy a la playa.', 'I go to the beach.', 'Playa hermosa.', 'Beautiful beach.', 'Note: For summer.'),
  n('hospital', 'hospital', 'Hospital', 'society', 'm', 'Location.', 'Estoy en el hospital.', 'I am in the hospital.', 'Hospital grande.', 'Big hospital.', 'Note: Starts with silent h.'),
  n('escuela', 'escuela', 'School', 'work', 'f', 'Location.', 'Voy a la escuela.', 'I go to school.', 'Escuela nueva.', 'New school.', 'Note: Pair with Estudiar.'),
  n('restaurante', 'restaurante', 'Restaurant', 'food', 'm', 'Location.', 'Ceno en el restaurante.', 'I dine at the restaurant.', 'Buen restaurante.', 'Good restaurant.', 'Note: Pair with Comer.'),
  n('parque', 'parque', 'Park', 'nature', 'm', 'Location.', 'Juego en el parque.', 'I play in the park.', 'Parque verde.', 'Green park.', 'Note: For walking.'),
  n('hotel', 'hotel', 'Hotel', 'travel', 'm', 'Location.', 'Busco un hotel.', 'I look for a hotel.', 'Hotel caro.', 'Expensive hotel.', 'Note: For travelers.'),
  n('aeropuerto', 'aeropuerto', 'Airport', 'travel', 'm', 'Location.', 'Voy al aeropuerto.', 'I go to the airport.', 'Aeropuerto grande.', 'Big airport.', 'Note: For flying.'),
  n('estacion', 'estación', 'Station', 'travel', 'f', 'Location.', 'Estación de tren.', 'Train station.', '¿Dónde está la estación?', 'Where is the station?', 'Note: End in -ción = Fem.'),

  // --- ADVANCED PURPLE TOOLS (Adverbs & Logic) ---
  m('casi_tool', 'casi', 'Almost', 'grammar', 'Logic.', 'Casi termino.', 'I almost finish.', 'Logic', 'Approximation.', 'adverb', 'The Nudger.'),
  m('apenas_tool', 'apenas', 'Hardly', 'grammar', 'Logic.', 'Apenas como.', 'I hardly eat.', 'Logic', 'Scarcity.', 'adverb', 'The Minimalist.'),
  m('demasiado_tool', 'demasiado', 'Too much', 'grammar', 'Degree.', 'Es demasiado caro.', 'It is too expensive.', 'Degree', 'Excess.', 'adverb', 'The Maximizer.'),
  m('todavia_tool', 'todavía', 'Still', 'time', 'Continuity.', 'Todavía estoy aquí.', 'I am still here.', 'Continuity', 'Persistent state.', 'adverb', 'The Anchored.'),
  m('ya_tool', 'ya', 'Already', 'time', 'Completion.', 'Ya comí.', 'I already ate.', 'Time', 'Indicates past action.', 'adverb', 'The Done Key.'),
  m('pronto_tool', 'pronto', 'Soon', 'time', 'Future.', 'Vengo pronto.', 'I come soon.', 'Time', 'In a short time.', 'adverb', 'The Impatient.'),
  m('despacio_tool', 'despacio', 'Slowly', 'grammar', 'Manner.', 'Habla despacio.', 'Speak slowly.', 'Manner', 'Low speed.', 'adverb', 'The Calm Tool.'),
  m('tambien_tool', 'también', 'Also', 'grammar', 'Addition.', 'Yo también.', 'Me too.', 'Addition', 'Agreement.', 'misc', 'The Joiner.'),
  m('tampoco_tool', 'tampoco', 'Neither', 'grammar', 'Negation.', 'Yo tampoco.', 'Me neither.', 'Negation', 'Disagreement.', 'misc', 'The Excluder.'),
  m('entonces_tool', 'entonces', 'Then', 'time', 'Sequence.', 'Entonces, vamos.', 'Then, let us go.', 'Sequence', 'Result of logic.', 'adverb', 'The Weaver.'),
  m('ademas_tool', 'además', 'Besides/Also', 'grammar', 'Addition.', 'Además, es bueno.', 'Besides, it is good.', 'Addition', 'Extra info.', 'adverb', 'The Stacker.'),
  m('quizas_tool', 'quizás', 'Maybe', 'abstract', 'Doubt.', 'Quizás voy.', 'Maybe I go.', 'Doubt', 'Uncertainty.', 'adverb', 'The Dreamer.'),
  
  // --- THE RAINBOW (Colors - Adjectives) ---
  a('rojo', 'rojo', 'Red', 'nature', 'azul', 'Blue', 'Primary color.', 'Coche rojo.', 'Red car.', 'Flor roja.', 'Red flower.', 'Note: Fem is Roja.'),
  a('azul', 'azul', 'Blue', 'nature', 'rojo', 'Red', 'Primary color.', 'Cielo azul.', 'Blue sky.', 'Mar azul.', 'Blue sea.', 'Note: Same for m/f.'),
  a('verde', 'verde', 'Green', 'nature', 'marrón', 'Brown', 'Nature color.', 'Árbol verde.', 'Green tree.', 'Hierba verde.', 'Green grass.', 'Note: Same for m/f.'),
  a('amarillo', 'amarillo', 'Yellow', 'nature', 'morado', 'Purple', 'Sun color.', 'Sol amarillo.', 'Yellow sun.', 'Flor amarilla.', 'Yellow flower.', 'Note: Fem is Amarilla.'),
  a('blanco', 'blanco', 'White', 'nature', 'negro', 'Black', 'Bright color.', 'Nieve blanca.', 'White snow.', 'Papel blanco.', 'White paper.', 'Note: Fem is Blanca.'),
  a('negro', 'negro', 'Black', 'nature', 'blanco', 'White', 'Dark color.', 'Gato negro.', 'Black cat.', 'Noche negra.', 'Black night.', 'Note: Fem is Negra.'),
  a('gris', 'gris', 'Grey', 'nature', 'blanco', 'White', 'Neutral color.', 'Día gris.', 'Grey day.', 'Pelo gris.', 'Grey hair.', 'Note: Same for m/f.'),
  a('rosa', 'rosa', 'Pink', 'nature', 'rojo', 'Red', 'Soft color.', 'Flor rosa.', 'Pink flower.', 'Vestido rosa.', 'Pink dress.', 'Note: Often stays "rosa" for f.'),
  a('naranja_adj', 'naranja', 'Orange', 'nature', 'azul', 'Blue', 'Fruit color.', 'Coche naranja.', 'Orange car.', 'Fruta naranja.', 'Orange fruit.', 'Note: Same for m/f.'),
  a('morado', 'morado', 'Purple', 'nature', 'amarillo', 'Yellow', 'Royal color.', 'Flor morada.', 'Purple flower.', 'Uvas moradas.', 'Purple grapes.', 'Note: Fem is Morada.'),

  // --- THE CALENDAR (Days of the Week - Misc/Time) ---
  m('lunes', 'lunes', 'Monday', 'time', '1st day.', 'Hoy es lunes.', 'Today is Monday.', 'Time', 'Starts with L.', 'time', 'The Starter.'),
  m('martes', 'martes', 'Tuesday', 'time', '2nd day.', 'Mañana es martes.', 'Tomorrow is Tuesday.', 'Time', 'Day of Mars.', 'time', 'The Follower.'),
  m('miercoles', 'miércoles', 'Wednesday', 'time', '3rd day.', 'Es miércoles.', 'It is Wednesday.', 'Time', 'Hump day.', 'time', 'The Peak.'),
  m('jueves', 'jueves', 'Thursday', 'time', '4th day.', 'Casi es viernes.', 'It is almost Friday.', 'Time', 'Day of Jupiter.', 'time', 'The Near.'),
  m('viernes', 'viernes', 'Friday', 'time', '5th day.', '¡Por fin es viernes!', 'Finally it is Friday!', 'Time', 'Party starts.', 'time', 'The Celebration.'),
  m('sabado', 'sábado', 'Saturday', 'time', 'Weekend.', 'Sábado libre.', 'Free Saturday.', 'Time', 'Rest day.', 'time', 'The Rest.'),
  m('domingo', 'domingo', 'Sunday', 'time', 'Weekend.', 'Domingo de sol.', 'Sunny Sunday.', 'Time', 'Family day.', 'time', 'The Peace.'),

  // --- THE CALENDAR (Months of the Year - Misc/Time) ---
  m('enero', 'enero', 'January', 'time', '1st month.', 'Enero es frío.', 'January is cold.', 'Time', 'New Year.', 'time', 'Beginning.'),
  m('febrero', 'febrero', 'February', 'time', 'Short month.', 'Mes de febrero.', 'Month of February.', 'Time', 'Love month.', 'time', 'Shorty.'),
  m('marzo', 'marzo', 'March', 'time', 'Spring.', 'Marzo viene.', 'March comes.', 'Time', 'Windy month.', 'time', 'Breeze.'),
  m('abril', 'abril', 'April', 'time', 'Rainy.', 'Abril lluvioso.', 'Rainy April.', 'Time', 'Showers.', 'time', 'Growth.'),
  m('mayo', 'mayo', 'May', 'time', 'Flowers.', 'Flores de mayo.', 'May flowers.', 'Time', 'Mother day.', 'time', 'Bloom.'),
  m('junio', 'junio', 'June', 'time', 'Summer.', 'Junio es calor.', 'June is heat.', 'Time', 'Vacation start.', 'time', 'Solstice.'),
  m('julio', 'julio', 'July', 'time', 'Hot.', 'Mes de julio.', 'Month of July.', 'Time', 'Beach time.', 'time', 'Heat.'),
  m('agosto', 'agosto', 'August', 'time', 'Holiday.', 'Agosto en la playa.', 'August at the beach.', 'Time', 'Vacation peak.', 'time', 'Relax.'),
  m('septiembre', 'septiembre', 'September', 'time', 'Autumn.', 'Septiembre llega.', 'September arrives.', 'Time', 'Back to school.', 'time', 'Return.'),
  m('octubre', 'octubre', 'October', 'time', 'Fall.', 'Mes de octubre.', 'Month of October.', 'Time', 'Leaves fall.', 'time', 'Amber.'),
  m('noviembre', 'noviembre', 'November', 'time', 'Cold.', 'Noviembre gris.', 'Grey November.', 'Time', 'Remembering.', 'time', 'Fading.'),
  m('diciembre', 'diciembre', 'December', 'time', 'Last month.', 'Feliz diciembre.', 'Happy December.', 'Time', 'Celebration.', 'time', 'Closure.'),

  // --- THE NUMBERS (1-10 - Misc/Quantity) ---
  m('uno', 'uno', 'One', 'quantity', 'Number 1.', 'Tengo uno.', 'I have one.', 'Quantity', 'Becomes "un" before nouns.', 'misc', 'The Unit.'),
  m('dos', 'dos', 'Two', 'quantity', 'Number 2.', 'Dos cafés.', 'Two coffees.', 'Quantity', 'Dual.', 'misc', 'The Pair.'),
  m('tres', 'tres', 'Three', 'quantity', 'Number 3.', 'Tres libros.', 'Three books.', 'Quantity', 'Trio.', 'misc', 'The Triangle.'),
  m('cuatro', 'cuatro', 'Four', 'quantity', 'Number 4.', 'Cuatro patas.', 'Four legs.', 'Quantity', 'Square.', 'misc', 'The Base.'),
  m('cinco', 'cinco', 'Five', 'quantity', 'Number 5.', 'Cinco dedos.', 'Five fingers.', 'Quantity', 'Hand count.', 'misc', 'The Hand.'),
  m('seis', 'seis', 'Six', 'quantity', 'Number 6.', 'Seis meses.', 'Six months.', 'Quantity', 'Half dozen.', 'misc', 'The Half.'),
  m('siete', 'siete', 'Seven', 'quantity', 'Number 7.', 'Siete días.', 'Seven days.', 'Quantity', 'Week count.', 'misc', 'The Week.'),
  m('ocho', 'ocho', 'Eight', 'quantity', 'Number 8.', 'Ocho horas.', 'Eight hours.', 'Quantity', 'Octopus.', 'misc', 'The Octo.'),
  m('nueve', 'nueve', 'Nine', 'quantity', 'Number 9.', 'Nueve vidas.', 'Nine lives.', 'Quantity', 'Cat myth.', 'misc', 'The Near.'),
  m('diez', 'diez', 'Ten', 'quantity', 'Number 10.', 'Diez euros.', 'Ten euros.', 'Quantity', 'Base ten.', 'misc', 'The Decade.'),

  // --- THE NUMBERS (11-20 - Misc/Quantity) ---
  m('once', 'once', 'Eleven', 'quantity', 'Number 11.', 'Once jugadores.', 'Eleven players.', 'Quantity', 'Soccer team.', 'misc', 'The Team.'),
  m('doce', 'doce', 'Twelve', 'quantity', 'Number 12.', 'Doce uvas.', 'Twelve grapes.', 'Quantity', 'The Dozen.', 'misc', 'The Dozen.'),
  m('trece', 'trece', 'Thirteen', 'quantity', 'Number 13.', 'Trece personas.', 'Thirteen people.', 'Quantity', 'Unlucky for some.', 'misc', 'The Odd.'),
  m('catorce', 'catorce', 'Fourteen', 'quantity', 'Number 14.', 'Catorce días.', 'Fourteen days.', 'Quantity', 'Fortnight.', 'misc', 'The Fortnight.'),
  m('quince', 'quince', 'Fifteen', 'quantity', 'Number 15.', 'Quince años.', 'Fifteen years.', 'Quantity', 'Quinceañera.', 'misc', 'The Quince.'),
  m('dieciseis', 'dieciséis', 'Sixteen', 'quantity', 'Number 16.', 'Dieciséis hoy.', 'Sixteen today.', 'Quantity', '10+6.', 'misc', 'The Teen.'),
  m('diecisiete', 'diecisiete', 'Seventeen', 'quantity', 'Number 17.', 'Diecisiete más.', 'Seventeen more.', 'Quantity', '10+7.', 'misc', 'The Teen.'),
  m('dieciocho', 'dieciocho', 'Eighteen', 'quantity', 'Number 18.', 'Dieciocho años.', 'Eighteen years.', 'Quantity', 'Adult age.', 'misc', 'The Adult.'),
  m('diecinueve', 'diecinueve', 'Nineteen', 'quantity', 'Number 19.', 'Diecinueve mil.', 'Nineteen thousand.', 'Quantity', '10+9.', 'misc', 'The Last Teen.'),
  m('veinte', 'veinte', 'Twenty', 'quantity', 'Number 20.', 'Veinte minutos.', 'Twenty minutes.', 'Quantity', 'The Score.', 'misc', 'The Score.'),

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
