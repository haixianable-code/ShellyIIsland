
import { DayPack } from '../types';
import { v, a } from '../utils/wordRegistry';
import { N_SER_ESTAR, N_SABER_CONOCER, N_PEDIR_PREGUNTAR, N_VER_MIRAR, N_HABLAR_DECIR } from './nuances';

export const VOCABULARY_DATA: DayPack[] = [
  {
    id: 'day1',
    title: 'The Identity & The Body',
    words: [
      {
        ...v('ser', 'ser', 'To be (Identity)', 'grammar', 'Permanent traits.', 'Yo soy Juan.', 'I am Juan.', 'Ella es alta.', 'She is tall.', 'Juan: Name. Ella: She.', 'soy, eres, es, somos, sois, son', false, N_SER_ESTAR),
        tense_forms: { past: 'era', future: 'seré' },
        examples: [
          { txt: 'Yo soy Juan.', eng: 'I am Juan.', tense: 'present' },
          { txt: 'Yo era joven.', eng: 'I used to be young.', tense: 'past' },
          { txt: 'Seré rico.', eng: 'I will be rich.', tense: 'future' },
          { txt: 'Ella es alta.', eng: 'She is tall.', tense: 'present' }
        ]
      },
      {
        ...v('estar', 'estar', 'To be (State)', 'grammar', 'Temporary states/location.', 'Estoy feliz.', 'I am happy.', 'Estamos aquí.', 'We are here.', 'Feliz: Happy. Aquí: Here.', 'estoy, estás, está, estamos, estáis, están', false, N_SER_ESTAR),
        tense_forms: { past: 'estaba', future: 'estaré' },
        examples: [
          { txt: 'Estoy feliz.', eng: 'I am happy.', tense: 'present' },
          { txt: 'Estaba en casa.', eng: 'I was at home.', tense: 'past' },
          { txt: 'Estaré allí.', eng: 'I will be there.', tense: 'future' },
          { txt: 'Estamos aquí.', eng: 'We are here.', tense: 'present' }
        ]
      },
      {
        ...v('tener', 'tener', 'To have', 'grammar', 'Possession/Age.', 'Tengo hambre.', 'I am hungry.', 'Tienen un coche.', 'They have a car.', 'Hambre: Hunger. Coche: Car.', 'tengo, tienes, tiene, tenemos, tenéis, tienen', false),
        tense_forms: { past: 'tenía', future: 'tendré' },
        examples: [
          { txt: 'Tengo hambre.', eng: 'I am hungry.', tense: 'present' },
          { txt: 'Tenía miedo.', eng: 'I was afraid.', tense: 'past' },
          { txt: 'Tendré tiempo.', eng: 'I will have time.', tense: 'future' },
          { txt: 'Tienen un coche.', eng: 'They have a car.', tense: 'present' }
        ]
      },
      v('llamarse', 'llamarse', 'To be called', 'social', 'Use for names.', 'Me llamo Ana.', 'My name is Ana.', '¿Cómo te llamas?', 'What is your name?', 'Ana: Name.', 'me llamo, te llamas, se llama, nos llamamos, os llamáis, se llaman', true),
      v('vivir', 'vivir', 'To live', 'life', 'Residence.', 'Vivo en China.', 'I live in China.', '¿Dónde vives?', 'Where do you live?', 'China: Country.', undefined, true),
      v('estudiar', 'estudiar', 'To study', 'work', 'Learning.', 'Estudio español.', 'I study Spanish.', 'Juan estudia mucho.', 'Juan studies a lot.', 'Mucho: A lot.', undefined, true),
      v('trabajar', 'trabajar', 'To work', 'work', 'Employment.', 'Trabajo hoy.', 'I work today.', '¿Dónde trabajas?', 'Where do you work?', 'Hoy: Today.', undefined, true),
      {
        ...v('haber', 'haber', 'There is/are', 'grammar', 'Existence (Hay).', 'Hay un libro.', 'There is a book.', 'No hay agua.', 'There is no water.', 'Libro: Book. Agua: Water.', 'he, has, ha (hay), hemos, habéis, han', false),
        tense_forms: { past: 'había', future: 'habrá' },
        examples: [
          { txt: 'Hay un libro.', eng: 'There is a book.', tense: 'present' },
          { txt: 'Había mucha gente.', eng: 'There were many people.', tense: 'past' },
          { txt: 'Habrá problemas.', eng: 'There will be problems.', tense: 'future' },
          { txt: 'No hay agua.', eng: 'There is no water.', tense: 'present' }
        ]
      },
      {
        ...v('comer', 'comer', 'To eat', 'food', 'Regular meals.', 'Como pan.', 'I eat bread.', '¿Qué comes?', 'What do you eat?', 'Pan: Bread.', undefined, true),
        tense_forms: { past: 'comí', future: 'comeré' },
        examples: [
          { txt: 'Como pan.', eng: 'I eat bread.', tense: 'present' },
          { txt: 'Comí pan ayer.', eng: 'I ate bread yesterday.', tense: 'past' },
          { txt: 'Comeré pan mañana.', eng: 'I will eat bread tomorrow.', tense: 'future' },
          { txt: '¿Qué comes?', eng: 'What do you eat?', tense: 'present' }
        ]
      },
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
      {
        ...v('querer', 'querer', 'To want', 'feelings', 'Desire/Love.', 'Quiero café.', 'I want coffee.', 'Te quiero.', 'I love you.', 'Café: Coffee.', 'quiero, quieres, quiere, queremos, queréis, quieren', false),
        tense_forms: { past: 'quise', future: 'querré' },
        examples: [
          { txt: 'Quiero café.', eng: 'I want coffee.', tense: 'present' },
          { txt: 'Quise ir.', eng: 'I wanted (tried) to go.', tense: 'past' },
          { txt: 'Te querré siempre.', eng: 'I will love you always.', tense: 'future' },
          { txt: 'Te quiero.', eng: 'I love you.', tense: 'present' }
        ]
      },
      {
        ...v('poder', 'poder', 'Can/To be able', 'grammar', 'Ability.', 'Puedo ir.', 'I can go.', '¿Puedes hablar?', 'Can you speak?', 'Ir: To go.', 'puedo, puedes, puede, podemos, podéis, pueden', false),
        tense_forms: { past: 'pude', future: 'podré' },
        examples: [
          { txt: 'Puedo ir.', eng: 'I can go.', tense: 'present' },
          { txt: 'No pude dormir.', eng: 'I could not sleep.', tense: 'past' },
          { txt: 'Podré hacerlo.', eng: 'I will be able to do it.', tense: 'future' },
          { txt: '¿Puedes hablar?', eng: 'Can you speak?', tense: 'present' }
        ]
      },
      {
        ...v('ir', 'ir', 'To go', 'travel', 'Movement away.', 'Voy a casa.', 'I go home.', 'Vamos hoy.', 'We go today.', 'Casa: House.', 'voy, vas, va, vamos, vais, van', false),
        tense_forms: { past: 'fui', future: 'iré' },
        examples: [
          { txt: 'Voy a casa.', eng: 'I go home.', tense: 'present' },
          { txt: 'Fui a casa ayer.', eng: 'I went home yesterday.', tense: 'past' },
          { txt: 'Iré a casa mañana.', eng: 'I will go home tomorrow.', tense: 'future' },
          { txt: 'Vamos hoy.', eng: 'We go today.', tense: 'present' }
        ]
      },
      v('venir', 'venir', 'To come', 'travel', 'Movement toward.', 'Vengo ahora.', 'I come now.', '¿Vienes?', 'Are you coming?', 'Ahora: Now.', 'vengo, vienes, viene, venimos, venís, vienen', false),
      v('traer', 'traer', 'To bring', 'daily', 'Bringing here.', 'Traigo la llave.', 'I bring the key.', '¿Qué traes?', 'What do you bring?', 'Llave: Key.', 'traigo, traes, trae, traemos, traéis, traen', false),
      v('llevar', 'llevar', 'To take/wear', 'daily', 'Taking there.', 'Llevo mi bolso.', 'I carry my bag.', 'Lleva ropa azul.', 'He wears blue clothes.', 'Bolso: Bag. Ropa: Clothes.', undefined, true),
      {
        ...v('saber', 'saber', 'To know (Fact)', 'grammar', 'Information.', 'Sé tu nombre.', 'I know your name.', 'No sé nada.', 'I know nothing.', 'Nombre: Name.', 'sé, sabes, sabe, sabemos, sabéis, saben', false, N_SABER_CONOCER),
        tense_forms: { past: 'sabía', future: 'sabré' },
        examples: [
          { txt: 'Sé tu nombre.', eng: 'I know your name.', tense: 'present' },
          { txt: 'Yo no sabía.', eng: 'I did not know.', tense: 'past' },
          { txt: 'Lo sabré pronto.', eng: 'I will know it soon.', tense: 'future' },
          { txt: 'No sé nada.', eng: 'I know nothing.', tense: 'present' }
        ]
      },
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
      {
        ...v('decir', 'decir', 'To say', 'grammar', 'Expression.', 'Digo la verdad.', 'I say the truth.', 'Él dice hola.', 'He says hello.', 'Verdad: Truth.', 'digo, dices, dice, decimos, decís, dicen', false, N_HABLAR_DECIR),
        tense_forms: { past: 'dije', future: 'diré' },
        examples: [
          { txt: 'Digo la verdad.', eng: 'I say the truth.', tense: 'present' },
          { txt: 'Dije que no.', eng: 'I said no.', tense: 'past' },
          { txt: 'Diré la verdad.', eng: 'I will tell the truth.', tense: 'future' },
          { txt: 'Él dice hola.', eng: 'He says hello.', tense: 'present' }
        ]
      },
      v('hablar', 'hablar', 'To speak', 'social', 'Conversation.', 'Hablo español.', 'I speak Spanish.', 'Ellos hablan.', 'They speak.', 'Español: Spanish.', undefined, true, N_HABLAR_DECIR),
      v('leer', 'leer', 'To read', 'work', 'Reading.', 'Leo un libro.', 'I read a book.', '¿Qué lees?', 'What do you read?', 'Libro: Book.', 'leo, lees, lee, leemos, leéis, leen', true),
      v('escribir', 'escribir', 'To write', 'work', 'Writing.', 'Escribo cartas.', 'I write letters.', 'Él escribe.', 'He writes.', 'Cartas: Letters.', undefined, true),
      v('llamar_v', 'llamar', 'To call', 'social', 'Phone or shout.', 'Llamo a mamá.', 'I call mom.', '¿Me llamas?', 'Are you calling me?', 'Mamá: Mom.', undefined, true),
      v('enviar', 'enviar', 'To send', 'work', 'Dispatch.', 'Envío un email.', 'I send an email.', 'Ellos envían.', 'They send.', 'Email: Email.', 'envío, envías, envía, enviamos, enviáis, envían', true),
      v('recibir', 'recibir', 'To receive', 'work', 'Accepting.', 'Recibo el paquete.', 'I receive the package.', '¿Recibes esto?', 'Do you receive this?', 'Paquete: Package.', undefined, true),
      v('preguntar', 'preguntar', 'To ask', 'social', 'Inquiry.', 'Pregunto hoy.', 'I ask today.', 'Juan pregunta.', 'Juan asks.', 'Hoy: Today.', undefined, true, N_PEDIR_PREGUNTAR),
      v('responder', 'responder', 'To answer', 'social', 'Reply.', 'Respondo ahora.', 'I answer now.', 'Ella responde.', 'She answers.', 'Ahora: Now.', undefined, true),
      {
        ...v('escuchar', 'escuchar', 'To listen', 'social', 'Hearing intent.', 'Escucho música.', 'I listen to music.', '¿Me escuchas?', 'Do you listen to me?', 'Música: Music.', undefined, true),
        nuance: { type: 'warning', label: 'Grammar Trap', note: 'Includes "to". Never say "Escuchar a música". Just "Escuchar música".' }
      },
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
      {
        ...v('ver_v', 'ver', 'To see', 'body', 'Sight.', 'Veo el sol.', 'I see the sun.', 'Juan ve todo.', 'Juan sees everything.', 'Sol: Sun.', 'veo, ves, ve, vemos, veis, ven', false, N_VER_MIRAR),
        tense_forms: { past: 'vi', future: 'veré' },
        examples: [
          { txt: 'Veo el sol.', eng: 'I see the sun.', tense: 'present' },
          { txt: 'Te vi ayer.', eng: 'I saw you yesterday.', tense: 'past' },
          { txt: 'Ya veré.', eng: 'I will see (We shall see).', tense: 'future' },
          { txt: 'Juan ve todo.', eng: 'Juan sees everything.', tense: 'present' }
        ]
      },
      v('mirar', 'mirar', 'To look/watch', 'body', 'Intentional sight.', 'Miro la tele.', 'I watch TV.', '¿Qué miras?', 'What are you looking at?', 'Tele: TV.', undefined, true, N_VER_MIRAR),
      v('oír', 'oír', 'To hear', 'body', 'Sound.', 'Oigo un ruido.', 'I hear a noise.', '¿Me oyes?', 'Do you hear me?', 'Ruido: Noise.', 'oigo, oyes, oye, oímos, oís, oyen', false),
      v('sentir', 'sentir', 'To feel', 'feelings', 'Sensation.', 'Siento calor.', 'I feel heat.', '¿Qué sientes?', 'What do you feel?', 'Calor: Heat.', 'siento, sientes, siente, sentimos, sentís, sienten', false),
      v('gustar', 'gustar', 'To like', 'feelings', 'Pleasure.', 'Me gusta.', 'I like it.', 'Nos gusta.', 'We like it.', 'Note: Used with indirect object pronouns.', 'gusta, gustan (usually)', false),
      v('encantar', 'encantar', 'To love/enchant', 'feelings', 'Strong liking.', 'Me encanta.', 'I love it.', 'Te encanta.', 'You love it.', 'Note: Similar to gustar.', 'encanta, encanta (usually)', false),
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
      {
        ...v('pagar', 'pagar', 'To pay', 'society', 'Payment.', 'Pago hoy.', 'I pay today.', 'Juan paga el té.', 'Juan pays for the tea.', 'Té: Tea.', 'pago, pagas, paga, pagamos, pagáis, pagan', true),
        nuance: { type: 'warning', label: 'Grammar Trap', note: 'Includes "for". Never say "Pagar por la cena". Just "Pagar la cena".' }
      },
      v('comprar', 'comprar', 'To buy', 'society', 'Purchase.', 'Compro pan.', 'I buy bread.', 'Él compra ropa.', 'He buys clothes.', 'Pan: Bread. Ropa: Clothes.', undefined, true),
      v('vender', 'vender', 'To sell', 'society', 'Selling.', 'Vendo mi coche.', 'I sell my car.', 'Ellos venden.', 'They sell.', 'Coche: Car.', undefined, true),
      {
        ...v('buscar', 'buscar', 'To look for', 'daily', 'Searching.', 'Busco mi llave.', 'I look for my key.', '¿Qué buscas?', 'What are you looking for?', 'Llave: Key.', undefined, true),
        nuance: { type: 'warning', label: 'Grammar Trap', note: 'Includes "for". Never say "Buscar por/para". Just "Buscar algo".' }
      },
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
      {
        ...v('hacer_v', 'hacer', 'To do/make', 'daily', 'Action.', 'Hago la comida.', 'I make food.', '¿Qué haces?', 'What are you doing?', 'Comida: Food.', 'hago, haces, hace, hacemos, hacéis, hacen', false),
        tense_forms: { past: 'hice', future: 'haré' },
        examples: [
          { txt: 'Hago la comida.', eng: 'I make food.', tense: 'present' },
          { txt: 'Lo hice yo.', eng: 'I did it myself.', tense: 'past' },
          { txt: 'Lo haré mañana.', eng: 'I will do it tomorrow.', tense: 'future' },
          { txt: '¿Qué haces?', eng: 'What are you doing?', tense: 'present' }
        ]
      },
      v('crear', 'crear', 'To create', 'art', 'Innovation.', 'Creo arte.', 'I create art.', 'Ellos crean.', 'They create.', 'Arte: Art.', undefined, true),
      v('pintar', 'pintar', 'To paint', 'art', 'Drawing.', 'Pinto un cuadro.', 'I paint a picture.', 'Ana pinta.', 'Ana paints.', 'Cuadro: Picture.', undefined, true),
      v('cantar', 'cantar', 'To sing', 'art', 'Vocal art.', 'Canto hoy.', 'I sing today.', 'Ella canta.', 'She sings.', 'Hoy: Today.', undefined, true),
      v('bailar', 'bailar', 'To dance', 'art', 'Movement.', 'Bailo bien.', 'I dance well.', '¿Bailamos?', 'Shall we dance?', 'Bien: Well.', undefined, true),
      v('tocar', 'tocar', 'To play (inst)/touch', 'art', 'Music/Touch.', 'Toco el piano.', 'I play piano.', 'No toques.', "Don't touch.", 'Piano: Piano.', undefined, true),
      {
        ...v('jugar', 'jugar', 'To play (game)', 'social', 'Games/Sport.', 'Juego al fútbol.', 'I play football.', 'Ellos juegan.', 'They play.', 'Fútbol: Football.', 'juego, juegas, juega, jugamos, jugáis, juegan', false),
        nuance: { type: 'warning', label: 'Preposition', note: 'Sports require "a". Jugar AL fútbol (a + el).' }
      },
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
