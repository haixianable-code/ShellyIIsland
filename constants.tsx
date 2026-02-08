
import { Word } from './types';
import { pluralize, generateRegularForms } from './utils/grammar';

export const SRS_INTERVALS = [0, 1, 3, 7, 14, 30, 90, 180];
export const TODAY_SIMULATED = new Date().toISOString().split('T')[0];

// Helper to create Verb
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

// Helper to create Adjective
const a = (id: string, s: string, t: string, ant: string, antT: string, tip: string, ex1: string, ex1t: string, ex2: string, ex2t: string, nn: string): Word => {
  let masc = s;
  let fem = s;
  if (s.endsWith('o')) fem = s.slice(0, -1) + 'a';
  const mascPl = pluralize(masc);
  const femPl = pluralize(fem);
  const forms = `${masc}, ${fem}, ${mascPl}, ${femPl}`;
  return {
    id, s, t, type: 'adj', category: 'island', ant, antT, grammarTip: tip, forms,
    examples: [{ txt: ex1, eng: ex1t }, { txt: ex2, eng: ex2t }], nounNotes: nn
  };
};

// Helper to create Noun
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

// Helper for Misc
const m = (id: string, s: string, t: string, tip: string, ex1: string, ex1t: string, ex2: string, ex2t: string, category: string): Word => ({
  id, s, t, type: 'misc', category, grammarTip: tip, forms: '',
  examples: [{ txt: ex1, eng: ex1t }, { txt: ex2, eng: ex2t }], nounNotes: 'Function Word'
});

export const EXTRA_CANDIDATES: Word[] = [
  m('y', 'y', 'And', 'Change "y" to "e" if the next word starts with "i-" or "hi-" (e.g., madre e hija).', 'Tú y yo.', 'You and I.', 'Pan y agua.', 'Bread and water.', 'connector'),
  m('o', 'o', 'Or', 'Change "o" to "u" if the next word starts with "o-" or "ho-" (e.g., siete u ocho).', '¿Té o café?', 'Tea or coffee?', 'Blanco o negro.', 'White or black.', 'connector'),
  m('pero', 'pero', 'But', 'Use to contrast ideas. If the first part is negative and you correct it, use "Sino" instead.', 'Pobre pero feliz.', 'Poor but happy.', 'Es tarde pero voy.', 'It is late but I go.', 'connector'),
  m('porque', 'porque', 'Because', 'Note: "Por qué" = Why? "Porque" = Because. "El porqué" = The reason.', 'Como porque tengo hambre.', 'I eat because I am hungry.', 'Lloro because it hurts.', 'I cry because it hurts.', 'connector'),
  m('si', 'si', 'If', 'No accent mark! "Sí" (with accent) means Yes.', 'Si puedes, ven.', 'If you can, come.', 'Si llueve, no voy.', 'If it rains, I do not go.', 'connector'),
  m('que', 'que', 'That / Than', 'The most common connector.', 'El libro que leo.', 'The book that I read.', 'Más alto que tú.', 'Taller than you.', 'connector'),
  m('cuando', 'cuando', 'When', 'No accent.', 'Cuando llegues.', 'When you arrive.', 'Cuando como.', 'When I eat.', 'connector'),
  m('como', 'como', 'Like / As', 'Used for comparisons.', 'Fuerte como un toro.', 'Strong as a bull.', 'Trabajo como chef.', 'I work as a chef.', 'connector'),
  m('aunque', 'aunque', 'Although / Even if', 'Use subjunctive if hypothetical.', 'Aunque llueva.', 'Even if it rains.', 'Aunque es tarde.', 'Although it is late.', 'connector'),
  m('mientras', 'mientras', 'While', 'Two actions at the same time.', 'Leo mientras como.', 'I read while I eat.', 'Mientras tanto.', 'Meanwhile.', 'connector'),
  m('pues', 'pues', 'Well / Since', 'Common filler word.', 'Pues... no sé.', 'Well... I do not know.', 'Hazlo, pues puedes.', 'Do it, since you can.', 'connector'),
  m('ni', 'ni', 'Nor / Neither', 'Used in negatives.', 'Ni agua ni pan.', 'Neither water nor bread.', 'No tengo ni idea.', 'I have no idea.', 'connector'),
  m('tambien', 'también', 'Also / Too', 'Positive agreement.', 'Yo también.', 'Me too.', 'Ella viene también.', 'She comes also.', 'connector'),
  m('tampoco', 'tampoco', 'Neither', 'Negative agreement.', 'Yo tampoco.', 'Me neither.', 'No voy tampoco.', 'I am not going either.', 'connector'),
  m('ademas', 'además', 'Besides / Furthermore', 'Adds information.', 'Además, es barato.', 'Besides, it is cheap.', 'Además de eso.', 'Besides that.', 'connector'),
  m('asi', 'así', 'Like this / So', 'Manner.', 'Hazlo así.', 'Do it like this.', 'Es así.', 'It is like that.', 'connector'),
  m('entonces', 'entonces', 'Then / So', 'Sequence.', 'Y entonces se fue.', 'And then he left.', '¿Entonces qué?', 'So what?', 'connector'),
  m('luego', 'luego', 'Later / Then', 'Time sequence.', 'Hasta luego.', 'See you later.', 'Primero como, luego duermo.', 'First I eat, then I sleep.', 'connector'),
  m('sino', 'sino', 'But rather', 'Correct alternative.', 'No es rojo, sino azul.', 'It is not red, but blue.', 'No hablo, sino escucho.', 'I do not speak, but listen.', 'connector'),
  m('donde', 'donde', 'Where', 'Relative pronoun.', 'La casa donde vivo.', 'The house where I live.', 'Donde quieras.', 'Wherever you want.', 'connector'),
  m('ahora', 'ahora', 'Now', 'Right now.', 'Hazlo ahora.', 'Do it now.', 'Ahora o nunca.', 'Now or never.', 'time'),
  n('tiempo', 'tiempo', 'Time / Weather', 'm', 'Both clock and weather.', 'Hace buen tiempo.', 'The weather is good.', 'No tengo tiempo.', 'I have no time.', 'Buen (Good)'),
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
  {
    date: '2026-02-06',
    words: [
      v('sentir', 'sentir', 'To feel', 'E->IE.', 'Siento frío.', 'I feel cold.', 'Sientes dolor.', 'You feel pain.', 'Dolor (Pain)', 's[ie]nto, s[ie]ntes, s[ie]nte, sentimos, sentís, s[ie]nten', false),
      v('tomar', 'tomar', 'To take/drink', 'Regular AR.', 'Tomo café.', 'I drink coffee.', 'Tomas the bus.', 'You take the bus.', 'Bus (Bus)', '', true),
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
      v('usar', 'usar', 'To use', 'Regular AR.', 'Uso the car.', 'I use the car.', 'Usas la red.', 'You use the net.', 'Red (Net)', '', true),
      v('mirar', 'mirar', 'To look', 'Regular AR.', 'Miro the sea.', 'I look at the sea.', 'Miras the tv.', 'You watch TV.', 'Mar (Sea)', '', true),
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
      v('parecer', 'parecer', 'To seem', 'Irregular Yo (Parezco).', 'Parezco feliz.', 'I seem happy.', 'Pareces triste.', 'You seem sad.', 'Feliz (Happy)', 'parez[co], pareces, parece, parecemos, parecéis, aparecen', false),
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
  }
];
