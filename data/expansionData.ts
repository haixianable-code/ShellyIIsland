
import { Word } from '../types';
import { n, m, a, v } from '../utils/wordRegistry';

export const EXTRA_CANDIDATES: Word[] = [
  // ==============================================
  // 📦 PACK A: THE STORYTELLER (Narrative & Time)
  // Category: 'storyteller'
  // ==============================================
  m('de_repente', 'de repente', 'Suddenly', 'time', 'Plot twist.', 'De repente, gritó.', 'Suddenly, he shouted.', 'Sequence', 'Sudden action.', 'storyteller', 'Story connector.'),
  m('habia_una_vez', 'había una vez', 'Once upon a time', 'time', 'Story start.', 'Había una vez un rey.', 'Once upon a time there was a king.', 'Opening', 'Classic fairy tale start.', 'storyteller', 'Story opener.'),
  m('al_final', 'al final', 'In the end', 'time', 'Conclusion.', 'Al final, ganó.', 'In the end, he won.', 'Ending', 'Summary.', 'storyteller', 'Story closer.'),
  m('mientras', 'mientras', 'While/Meanwhile', 'time', 'Simultaneity.', 'Yo leía mientras él comía.', 'I read while he ate.', 'Time', 'Two actions at once.', 'storyteller', 'Simultaneity.'),
  m('ayer_noche', 'anoche', 'Last night', 'time', 'Past.', 'Anoche salí.', 'Last night I went out.', 'Time', 'Specific past time.', 'storyteller', 'Past anchor.'),
  m('antetier', 'anteayer', 'Day before yesterday', 'time', 'Past.', 'Fue anteayer.', 'It was the day before yesterday.', 'Time', '2 days ago.', 'storyteller', 'Past anchor.'),
  v('contar', 'contar', 'To tell (story)/count', 'social', 'Narrating.', 'Te cuento un secreto.', 'I tell you a secret.', 'Cuenta conmigo.', 'Count on me.', 'Secreto: Secret.', 'cuento, cuentas, cuenta, contamos, contáis, cuentan', true, undefined),
  v('pasar_v', 'pasar', 'To happen/pass', 'abstract', 'Event.', '¿Qué pasó?', 'What happened?', 'El tiempo pasa.', 'Time passes.', 'Tiempo: Time.', undefined, true, undefined),
  v('ocurrir', 'ocurrir', 'To occur', 'abstract', 'Event.', 'Algo extraño ocurrió.', 'Something strange occurred.', 'No se me ocurre nada.', 'Nothing comes to mind.', 'Extraño: Strange.', undefined, true, undefined),
  a('emocionante', 'emocionante', 'Exciting', 'feelings', 'aburrido', 'Boring', 'Feeling.', 'Fue emocionante.', 'It was exciting.', 'Película emocionante.', 'Exciting movie.', 'Película: Movie.', undefined),

  // ==============================================
  // 📦 PACK B: THE DEBATER (Opinion & Logic)
  // Category: 'debater'
  // ==============================================
  m('por_eso', 'por eso', "That's why", 'grammar', 'Result.', 'Estaba cansado, por eso dormí.', 'I was tired, that is why I slept.', 'Logic', 'Cause and effect.', 'debater', 'Logic bridge.'),
  m('sin_embargo', 'sin embargo', 'However', 'grammar', 'Contrast.', 'Es caro, sin embargo lo compro.', 'It is expensive, however I buy it.', 'Contrast', 'Formal "but".', 'debater', 'Contrast tool.'),
  m('en_mi_opinion', 'en mi opinión', 'In my opinion', 'abstract', 'Viewpoint.', 'En mi opinión, es falso.', 'In my opinion, it is false.', 'Viewpoint', 'Softens statements.', 'debater', 'Opener.'),
  m('claro_que_si', 'claro que sí', 'Of course', 'social', 'Agreement.', '¿Vas a ir? ¡Claro que sí!', 'Are you going? Of course!', 'Agreement', 'Strong yes.', 'debater', 'Agreement.'),
  v('acordar', 'estar de acuerdo', 'To agree', 'social', 'Consensus.', 'Estoy de acuerdo contigo.', 'I agree with you.', 'No estamos de acuerdo.', 'We do not agree.', 'Contigo: With you.', undefined, true, undefined),
  v('tener_razon', 'tener razón', 'To be right', 'abstract', 'Correctness.', 'Tienes razón.', 'You are right.', 'No tengo razón.', 'I am not right.', 'Note: Uses "Tener" (to have reason).', undefined, true, undefined),
  v('parecer_op', 'me parece que', 'It seems to me', 'abstract', 'Opinion.', 'Me parece que es bueno.', 'It seems to me it is good.', '¿Qué te parece?', 'What do you think?', 'Bueno: Good.', undefined, true, undefined),
  v('discutir', 'discutir', 'To argue/discuss', 'social', 'Conflict.', 'No quiero discutir.', 'I do not want to argue.', 'Discuten mucho.', 'They argue a lot.', 'Mucho: A lot.', undefined, true, undefined),
  n('tema', 'tema', 'Topic/Subject', 'abstract', 'm', 'Discussion.', 'Cambiemos de tema.', "Let's change the subject.", 'Tema interesante.', 'Interesting topic.', 'Note: Greek origin (ends in -a but Masculine).'),
  n('opinion', 'opinión', 'Opinion', 'abstract', 'f', 'Thought.', 'Es mi opinión.', 'It is my opinion.', 'Buena opinión.', 'Good opinion.', 'Note: Abstract noun.'),

  // ==============================================
  // 📦 PACK C: COGNATE BOOST (Quick Fluency)
  // Category: 'cognates'
  // ==============================================
  n('problema', 'problema', 'Problem', 'abstract', 'm', 'Difficulty.', 'No hay problema.', 'No problem.', 'Problema grande.', 'Big problem.', 'Note: Masculine! El problema.'),
  n('sistema', 'sistema', 'System', 'tech', 'm', 'Structure.', 'El sistema solar.', 'The solar system.', 'Sistema nuevo.', 'New system.', 'Note: Masculine! El sistema.'),
  n('programa', 'programa', 'Program', 'tech', 'm', 'Plan/Software.', 'Programa de TV.', 'TV program.', 'Programa útil.', 'Useful program.', 'Note: Masculine! El programa.'),
  n('posibilidad', 'posibilidad', 'Possibility', 'abstract', 'f', 'Chance.', 'Hay una posibilidad.', 'There is a possibility.', 'Posibilidad real.', 'Real possibility.', 'Suffix: -ty -> -dad.'),
  n('realidad', 'realidad', 'Reality', 'abstract', 'f', 'Fact.', 'Es la realidad.', 'It is reality.', 'Realidad virtual.', 'Virtual reality.', 'Suffix: -ty -> -dad.'),
  n('actividad', 'actividad', 'Activity', 'daily', 'f', 'Action.', 'Actividad física.', 'Physical activity.', 'Muchas actividades.', 'Many activities.', 'Suffix: -ty -> -dad.'),
  n('accion', 'acción', 'Action', 'abstract', 'f', 'Movement.', 'Película de acción.', 'Action movie.', 'Tomar acción.', 'Take action.', 'Suffix: -tion -> -ción.'),
  n('solucion', 'solución', 'Solution', 'abstract', 'f', 'Answer.', 'Tengo la solución.', 'I have the solution.', 'Solución fácil.', 'Easy solution.', 'Suffix: -tion -> -ción.'),
  n('decision', 'decisión', 'Decision', 'abstract', 'f', 'Choice.', 'Buena decisión.', 'Good decision.', 'Tomar una decisión.', 'Make a decision.', 'Suffix: -sion -> -sión.'),
  a('diferente', 'diferente', 'Different', 'abstract', 'igual', 'Same', 'Comparison.', 'Es muy diferente.', 'It is very different.', 'Opinión diferente.', 'Different opinion.', 'Cognate.'),
  a('excelente', 'excelente', 'Excellent', 'abstract', 'terrible', 'Terrible', 'Quality.', 'Trabajo excelente.', 'Excellent work.', 'Idea excelente.', 'Excellent idea.', 'Cognate.'),
  a('posible', 'posible', 'Possible', 'abstract', 'imposible', 'Impossible', 'Chance.', 'Es posible.', 'It is possible.', 'Misión posible.', 'Mission possible.', 'Cognate.'),

  // ==============================================
  // 🏝️ LEGACY SURVIVAL LOOT (The Originals)
  // Category: 'loot' (Restored for compatibility)
  // ==============================================
  n('amigo', 'amigo', 'Friend', 'social', 'm', 'Companion.', 'Es mi amigo.', 'He is my friend.', 'Buen amigo.', 'Good friend.', 'Note: Feminine is Amiga.'),
  n('casa', 'casa', 'House/Home', 'daily', 'f', 'Living place.', 'Estoy en casa.', 'I am at home.', 'Casa grande.', 'Big house.', 'Note: "En casa" means at home.'),
  n('libro', 'libro', 'Book', 'work', 'm', 'Reading.', 'Leo un libro.', 'I read a book.', 'Libro viejo.', 'Old book.', 'Note: Verb Leer.'),
  n('perro', 'perro', 'Dog', 'nature', 'm', 'Pet.', 'Tengo un perro.', 'I have a dog.', 'Perro gordo.', 'Fat dog.', 'Note: Fem is Perra.'),
  n('gato', 'gato', 'Cat', 'nature', 'm', 'Pet.', 'Gato pequeño.', 'Small cat.', 'Mi gato duerme.', 'My cat sleeps.', 'Note: Known for independence.'),
  n('agua', 'agua', 'Water', 'food', 'f', 'Vital liquid.', 'Bebo agua.', 'I drink water.', 'Agua fría.', 'Cold water.', 'Note: El agua (s), Las arrows (p).'),
  n('cafe', 'café', 'Coffee', 'food', 'm', 'Drink.', 'Quiero un café.', 'I want a coffee.', 'Café solo.', 'Black coffee.', 'Note: Solo = plain/black.'),
  n('pan', 'pan', 'Bread', 'food', 'm', 'Basic food.', 'Como pan.', 'I eat bread.', 'Pan rico.', 'Tasty bread.', 'Note: Pair with Comer.'),
  n('coche', 'coche', 'Car', 'travel', 'm', 'Vehicle.', 'Mi coche is nuevo.', 'My car is new.', 'Voy en coche.', 'I go by car.', 'Note: Carro in LatAm.'),
  n('dinero', 'dinero', 'Money', 'society', 'm', 'Currency.', 'No tengo dinero.', 'I have no money.', 'Mucho dinero.', 'A lot of money.', 'Note: Uncountable logic.'),
  n('llave', 'llave', 'Key', 'daily', 'f', 'Tool.', 'Busco la llave.', 'I look for my key.', 'Llaves de casa.', 'House keys.', 'Note: Plural is Llaves.'),
  n('movil', 'móvil', 'Mobile Phone', 'tech', 'm', 'Device.', 'Uso mi móvil.', 'I use my mobile.', 'Móvil nuevo.', 'New phone.', 'Note: Celular in LatAm.'),
  n('ropa', 'ropa', 'Clothes', 'daily', 'f', 'Apparel.', 'Llevo ropa roja.', 'I wear red clothes.', 'Ropa limpia.', 'Clean clothes.', 'Note: Usually singular for "clothes".'),
  n('bolso', 'bolso', 'Bag', 'daily', 'm', 'Carrier.', 'Llevo mi bolso.', 'I carry my bag.', 'Bolso negro.', 'Black bag.', 'Note: Smaller than Maleta.'),
  n('familia', 'familia', 'Family', 'social', 'f', 'Relatives.', 'Mi familia.', 'My family.', 'Familia grande.', 'Large family.', 'Note: Singular in Spanish.'),
  n('madre', 'madre', 'Mother', 'social', 'f', 'Parent.', 'Mi madre es Ana.', 'My mother is Ana.', 'Madre joven.', 'Young mother.', 'Note: Mom is Mamá.'),
  n('padre', 'padre', 'Father', 'social', 'm', 'Parent.', 'Mi padre trabaja.', 'My father works.', 'Padre bueno.', 'Good father.', 'Note: Dad is Papá.'),
  n('hermano', 'hermano', 'Brother', 'social', 'm', 'Sibling.', 'Tengo un hermano.', 'I have a brother.', 'Hermano mayor.', 'Older brother.', 'Note: Sister is Hermana.'),
  n('hijo', 'hijo', 'Son', 'social', 'm', 'Child.', 'Es mi hijo.', 'He is my son.', 'Hijo pequeño.', 'Small son.', 'Note: Daughter is Hija.'),
  n('gente', 'gente', 'People', 'social', 'f', 'Humans.', 'Hay mucha gente.', 'There are many people.', 'Gente feliz.', 'Happy people.', 'Note: Always singular (La gente).'),
  n('persona', 'persona', 'Person', 'social', 'f', 'Individual.', 'Una persona.', 'One person.', 'Buena persona.', 'Good person.', 'Note: Always feminine gender.'),
  
  // --- PURPLE TOOLS (Existing) ---
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
];
