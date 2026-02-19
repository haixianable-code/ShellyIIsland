
import { Word } from '../types';
import { n, m, a, v } from '../utils/wordRegistry';

export const EXTRA_CANDIDATES: Word[] = [
  // ==============================================
  // ⏳ PACK F: THE TIME TRAVELER (Past & Future)
  // Category: 'time_traveler'
  // ==============================================
  
  // --- TIME ANCHORS (The Map of Time) ---
  n('pasado', 'pasado', 'The Past', 'time', 'm', 'History.', 'En el pasado.', 'In the past.', 'Olvida el pasado.', 'Forget the past.', 'Cognate.'),
  n('futuro', 'futuro', 'The Future', 'time', 'm', 'Destiny.', 'El futuro es hoy.', 'The future is today.', 'Planes de futuro.', 'Future plans.', 'Cognate.'),
  m('ayer', 'ayer', 'Yesterday', 'time', 'Past.', 'Ayer llovió.', 'Yesterday it rained.', 'Ayer fui al cine.', 'Yesterday I went to the cinema.', 'time_traveler', 'Key past anchor.'),
  m('anoche', 'anoche', 'Last night', 'time', 'Past.', 'Anoche dormí mal.', 'Last night I slept badly.', 'Salí anoche.', 'I went out last night.', 'time_traveler', 'Specific past time.'),
  m('manana_time', 'mañana', 'Tomorrow', 'time', 'Future.', 'Mañana voy.', 'Tomorrow I go.', 'Hasta mañana.', 'See you tomorrow.', 'time_traveler', 'Also means "Morning" (La mañana).'),
  m('luego', 'luego', 'Later', 'time', 'Sequence.', 'Te veo luego.', 'See you later.', 'Primero esto, luego eso.', 'First this, then that.', 'time_traveler', 'Sequence marker.'),
  m('entonces', 'entonces', 'Then/So', 'grammar', 'Sequence.', 'Entonces, ¿qué hacemos?', 'So, what do we do?', 'Era joven entonces.', 'I was young then.', 'time_traveler', 'Story connector.'),
  m('antes', 'antes', 'Before', 'time', 'Sequence.', 'Antes de comer.', 'Before eating.', 'Mucho antes.', 'Much earlier.', 'time_traveler', 'Opposite: Después.'),
  m('despues', 'después', 'After/Later', 'time', 'Sequence.', 'Después de ti.', 'After you.', 'Llámanos después.', 'Call us later.', 'time_traveler', 'Opposite: Antes.'),
  m('nunca', 'nunca', 'Never', 'time', 'Frequency.', 'Nunca digas nunca.', 'Never say never.', 'No voy nunca.', 'I never go.', 'time_traveler', 'Absolute negative.'),
  m('siempre', 'siempre', 'Always', 'time', 'Frequency.', 'Siempre te amaré.', 'I will always love you.', 'Como siempre.', 'Like always.', 'time_traveler', 'Absolute positive.'),
  m('a_veces', 'a veces', 'Sometimes', 'time', 'Frequency.', 'A veces leo.', 'Sometimes I read.', 'Solo a veces.', 'Only sometimes.', 'time_traveler', 'Frequency.'),

  // --- THE ESSENTIAL PAST (Preterite - Completed Actions) ---
  v('fui_ir', 'fui', 'I went (Past)', 'travel', 'Movement.', 'Ayer fui al parque.', 'Yesterday I went to the park.', 'Fui con Ana.', 'I went with Ana.', 'Root: Ir (To go).', undefined, true),
  v('fui_ser', 'fui', 'I was (Past)', 'grammar', 'Identity.', 'Fui profesor.', 'I was a teacher.', 'Fue divertido.', 'It was fun (3rd person).', 'Root: Ser (To be). Same as "I went"!', undefined, true),
  v('hice', 'hice', 'I did/made', 'daily', 'Action.', 'Lo hice yo.', 'I did it myself.', 'No hice nada.', 'I did nothing.', 'Root: Hacer. The "C" becomes "Z" in "Hizo" (He did).', undefined, true),
  v('dije', 'dije', 'I said', 'social', 'Speech.', 'Le dije que no.', 'I told him no.', '¿Qué dije?', 'What did I say?', 'Root: Decir. Irregular stem.', undefined, true),
  v('vi', 'vi', 'I saw', 'body', 'Sight.', 'Te vi ayer.', 'I saw you yesterday.', 'Lo vi en la tele.', 'I saw it on TV.', 'Root: Ver. No accent mark!', undefined, true),
  v('tuve', 'tuve', 'I had', 'daily', 'Possession.', 'Tuve un sueño.', 'I had a dream.', 'Tuve que ir.', 'I had to go.', 'Root: Tener. U-stem.', undefined, true),
  v('estuve', 'estuve', 'I was (State)', 'travel', 'Location.', 'Estuve en casa.', 'I was at home.', 'Estuve enfermo.', 'I was sick.', 'Root: Estar. U-stem.', undefined, true),
  v('pude', 'pude', 'I could', 'abstract', 'Ability.', 'No pude dormir.', 'I could not sleep.', 'Hice lo que pude.', 'I did what I could.', 'Root: Poder.', undefined, true),
  
  // --- THE NOSTALGIC PAST (Imperfect - Used to/Was doing) ---
  v('era', 'era', 'I used to be/Was', 'time', 'Description.', 'Cuando era niño.', 'When I was a child.', 'Ella era guapa.', 'She was pretty.', 'Root: Ser. Describes background.', undefined, true),
  v('tenia', 'tenía', 'I used to have', 'time', 'Description.', 'Tenía pelo largo.', 'I used to have long hair.', 'Tenía miedo.', 'I was afraid.', 'Root: Tener.', undefined, true),
  v('estaba', 'estaba', 'I was (State)', 'time', 'Location.', 'Estaba cansado.', 'I was tired.', 'La puerta estaba abierta.', 'The door was open.', 'Root: Estar.', undefined, true),
  v('habia', 'había', 'There was/were', 'time', 'Existence.', 'Había mucha gente.', 'There were many people.', 'No había nada.', 'There was nothing.', 'Root: Haber (Hay).', undefined, true),

  // --- THE FUTURE (Simple Future) ---
  v('ire', 'iré', 'I will go', 'time', 'Destiny.', 'Iré mañana.', 'I will go tomorrow.', 'No iré.', 'I will not go.', 'Root: Ir.', undefined, true),
  v('hare', 'haré', 'I will do', 'time', 'Promise.', 'Lo haré luego.', 'I will do it later.', 'Haré mi tarea.', 'I will do my homework.', 'Root: Hacer.', undefined, true),
  v('vere', 'veré', 'I will see', 'time', 'Sight.', 'Ya veré.', 'I will see (We shall see).', 'Te veré pronto.', 'I will see you soon.', 'Root: Ver.', undefined, true),
  v('sere', 'seré', 'I will be', 'time', 'Identity.', 'Seré rico.', 'I will be rich.', 'Seré mejor.', 'I will be better.', 'Root: Ser.', undefined, true),

  // ==============================================
  // 🏢 PACK P: THE PROFESSIONAL (Work & Travel - Phase 3)
  // Category: 'citizen'
  // ==============================================
  // --- WORKPLACE (La Oficina) ---
  n('oficina', 'oficina', 'Office', 'work', 'f', 'Workplace.', 'Voy a la oficina.', 'I go to the office.', 'Oficina central.', 'Headquarters.', 'Root of "Officer".'),
  n('reunión', 'reunión', 'Meeting', 'work', 'f', 'Event.', 'Tengo una reunión.', 'I have a meeting.', 'Reunión importante.', 'Important meeting.', 'Verb: Reunirse.'),
  n('jefe', 'jefe', 'Boss', 'work', 'm', 'Person.', 'Mi jefe es bueno.', 'My boss is good.', 'Hola jefe.', 'Hello boss.', 'Fem: Jefa.'),
  n('cliente', 'cliente', 'Client/Customer', 'work', 'm', 'Person.', 'Cliente nuevo.', 'New client.', 'Atención al cliente.', 'Customer service.', 'Ends in E (can be fem: La cliente).'),
  n('empresa', 'empresa', 'Company', 'work', 'f', 'Organization.', 'Empresa grande.', 'Big company.', 'Dueño de la empresa.', 'Owner of the company.', 'Synonym: Compañía.'),
  n('contrato', 'contrato', 'Contract', 'work', 'm', 'Document.', 'Firmar el contrato.', 'Sign the contract.', 'Contrato fijo.', 'Permanent contract.', 'Cognate.'),
  {
    ...n('exito', 'éxito', 'Success', 'abstract', 'm', 'Goal.', 'Gran éxito.', 'Big success.', 'Tener éxito.', 'To be successful.', 'Goal.'),
    nuance: { type: 'warning', label: 'False Friend', note: 'STOP! This is NOT "Exit" (Salida). It means "Success".' }
  },
  n('proyecto', 'proyecto', 'Project', 'work', 'm', 'Task.', 'Nuevo proyecto.', 'New project.', 'Líder de proyecto.', 'Project leader.', 'Cognate.'),
  
  // --- TRANSIT (El Viaje) ---
  n('aeropuerto', 'aeropuerto', 'Airport', 'travel', 'm', 'Place.', 'Al aeropuerto, por favor.', 'To the airport, please.', 'Aeropuerto internacional.', 'International airport.', 'Air-Port.'),
  n('vuelo', 'vuelo', 'Flight', 'travel', 'm', 'Transport.', 'Mi vuelo sale tarde.', 'My flight leaves late.', 'Número de vuelo.', 'Flight number.', 'Verb: Volar.'),
  n('pasaporte', 'pasaporte', 'Passport', 'travel', 'm', 'Document.', 'Su pasaporte, por favor.', 'Your passport, please.', 'Perdí mi pasaporte.', 'I lost my passport.', 'Pass-Port.'),
  n('maleta', 'maleta', 'Suitcase', 'travel', 'f', 'Object.', 'Hacer la maleta.', 'Pack the suitcase.', 'Maleta pesada.', 'Heavy suitcase.', 'Travel essential.'),
  n('hotel', 'hotel', 'Hotel', 'travel', 'm', 'Place.', 'Hotel de lujo.', 'Luxury hotel.', 'Reserva de hotel.', 'Hotel reservation.', 'H is silent.'),
  n('estacion', 'estación', 'Station/Season', 'travel', 'f', 'Place.', 'Estación de tren.', 'Train station.', 'Estación de metro.', 'Subway station.', 'Also means Season (Winter, etc).'),

  // ==============================================
  // 🏙️ PACK E: THE CITIZEN (House, City, Clothes)
  // Category: 'citizen'
  // ==============================================
  
  // --- LA CASA (The House) ---
  n('habitacion', 'habitación', 'Room', 'daily', 'f', 'Space.', 'Mi habitación.', 'My room.', 'Habitación doble.', 'Double room.', 'Suffix -ción is always Feminine.'),
  n('dormitorio', 'dormitorio', 'Bedroom', 'daily', 'm', 'Sleeping.', 'Dormitorio grande.', 'Big bedroom.', 'Muebles de dormitorio.', 'Bedroom furniture.', 'Root: Dormir (to sleep).'),
  n('cocina', 'cocina', 'Kitchen', 'food', 'f', 'Cooking.', 'Cocina limpia.', 'Clean kitchen.', 'Estoy en la cocina.', 'I am in the kitchen.', 'Verb: Cocinar.'),
  n('salon', 'salón', 'Living Room', 'daily', 'm', 'Leisure.', 'En el salón.', 'In the living room.', 'Salón amplio.', 'Spacious living room.', 'Big room suffix -on.'),
  n('puerta', 'puerta', 'Door', 'daily', 'f', 'Access.', 'Abre la puerta.', 'Open the door.', 'Puerta cerrada.', 'Closed door.', 'Port (Puerto) is related.'),
  n('ventana', 'ventana', 'Window', 'daily', 'f', 'View.', 'Mira la ventana.', 'Look at the window.', 'Ventana abierta.', 'Open window.', 'Wind flows through it.'),
  n('pared', 'pared', 'Wall', 'daily', 'f', 'Structure.', 'Pared blanca.', 'White wall.', 'Reloj de pared.', 'Wall clock.', 'Fem: La pared.'),
  n('suelo', 'suelo', 'Floor/Ground', 'daily', 'm', 'Surface.', 'En el suelo.', 'On the floor.', 'Suelo mojado.', 'Wet floor.', 'Also means Soil.'),
  n('techo', 'techo', 'Ceiling/Roof', 'daily', 'm', 'Top.', 'Techo alto.', 'High ceiling.', 'Bajo el techo.', 'Under the roof.', 'Protection.'),
  n('luz', 'luz', 'Light', 'tech', 'f', 'Energy.', 'Enciende la luz.', 'Turn on the light.', 'Luz solar.', 'Sunlight.', 'Fem: La luz.'),
  
  // --- MUEBLES Y OBJETOS (Furniture & Objects) ---
  n('mesa', 'mesa', 'Table', 'daily', 'f', 'Furniture.', 'Ponlo en la mesa.', 'Put it on the table.', 'Mesa redonda.', 'Round table.', 'Essential object.'),
  n('silla', 'silla', 'Chair', 'daily', 'f', 'Sitting.', 'Siéntate en la silla.', 'Sit on the chair.', 'Silla cómoda.', 'Comfortable chair.', 'Pair with Sentarse.'),
  n('cama', 'cama', 'Bed', 'daily', 'f', 'Sleeping.', 'Voy a la cama.', 'I go to bed.', 'Hacer la cama.', 'To make the bed.', 'Time to sleep.'),
  {
    ...n('vaso', 'vaso', 'Glass (Drinking)', 'food', 'm', 'Container.', 'Vaso de agua.', 'Glass of water.', 'Vaso vacío.', 'Empty glass.', 'Container.'),
    nuance: { type: 'warning', label: 'False Friend', note: 'Not "Vase" (Florero). It is a drinking glass.' }
  },
  n('plato', 'plato', 'Plate/Dish', 'food', 'm', 'Eating.', 'Plato limpio.', 'Clean plate.', 'Primer plato.', 'First course.', 'Can mean the meal itself.'),
  n('cuchillo', 'cuchillo', 'Knife', 'food', 'm', 'Tool.', 'Corta con cuchillo.', 'Cut with knife.', 'Cuchillo afilado.', 'Sharp knife.', 'Double L sound.'),
  n('tenedor', 'tenedor', 'Fork', 'food', 'm', 'Tool.', 'Usa el tenedor.', 'Use the fork.', 'Tenedor de plástico.', 'Plastic fork.', 'Sounds like "Tenure".'),
  n('cuchara', 'cuchara', 'Spoon', 'food', 'f', 'Tool.', 'Sopa con cuchara.', 'Soup with spoon.', 'Una cucharada.', 'A spoonful.', 'Fem: La cuchara.'),
  n('reloj', 'reloj', 'Clock/Watch', 'time', 'm', 'Timepiece.', 'Mira el reloj.', 'Look at the watch.', 'Reloj caro.', 'Expensive watch.', 'J is silent/soft.'),
  n('gafas', 'gafas', 'Glasses', 'body', 'f', 'Vision.', 'Llevo gafas.', 'I wear glasses.', 'Gafas de sol.', 'Sunglasses.', 'Always plural.'),
  n('ordenador', 'ordenador', 'Computer', 'tech', 'm', 'Device.', 'Mi ordenador.', 'My computer.', 'Ordenador portátil.', 'Laptop.', 'Spain (LatAm: Computadora).'),
  n('cosa', 'cosa', 'Thing', 'abstract', 'f', 'Object.', '¿Qué es esa cosa?', 'What is that thing?', 'Muchas cosas.', 'Many things.', 'Very common filler.'),

  // --- LA ROPA (Clothing) ---
  n('camisa', 'camisa', 'Shirt', 'daily', 'f', 'Top.', 'Camisa blanca.', 'White shirt.', 'Camisa de botones.', 'Button shirt.', 'Formal shirt.'),
  n('camiseta', 'camiseta', 'T-Shirt', 'daily', 'f', 'Casual.', 'Camiseta negra.', 'Black t-shirt.', 'Camiseta de fútbol.', 'Soccer jersey.', 'Diminutive of Camisa.'),
  n('pantalon', 'pantalón', 'Pants', 'daily', 'm', 'Bottom.', 'Pantalón largo.', 'Long pants.', 'Pantalón vaquero.', 'Jeans.', 'Often plural (Pantalones).'),
  n('zapato', 'zapato', 'Shoe', 'daily', 'm', 'Footwear.', 'Zapatos nuevos.', 'New shoes.', 'Atar los zapatos.', 'Tie the shoes.', 'Pair with Pie.'),
  n('abrigo', 'abrigo', 'Coat', 'daily', 'm', 'Winter.', 'Hace frío, lleva abrigo.', 'It is cold, wear a coat.', 'Abrigo grueso.', 'Thick coat.', 'Root: Abrigar (to shelter).'),
  n('vestido', 'vestido', 'Dress', 'daily', 'm', 'Outfit.', 'Vestido rojo.', 'Red dress.', 'Vestido largo.', 'Long dress.', 'Warning: Masculine (El vestido).'),
  n('falda', 'falda', 'Skirt', 'daily', 'f', 'Outfit.', 'Falda corta.', 'Short skirt.', 'Falda azul.', 'Blue skirt.', 'Fem: La falda.'),
  {
    ...n('ropa', 'ropa', 'Clothes', 'daily', 'f', 'Apparel.', 'Llevo ropa roja.', 'I wear red clothes.', 'Ropa limpia.', 'Clean clothes.', 'Apparel.'),
    nuance: { type: 'warning', label: 'False Friend', note: 'Not "Rope" (Cuerda). It means "Clothes".' }
  },

  // --- LA CIUDAD (The City) ---
  n('ciudad', 'ciudad', 'City', 'travel', 'f', 'Urban.', 'Ciudad grande.', 'Big city.', 'Vivo en la ciudad.', 'I live in the city.', 'Ends in D -> Feminine.'),
  n('pueblo', 'pueblo', 'Town/Village', 'travel', 'm', 'Rural.', 'Pueblo pequeño.', 'Small town.', 'Mi pueblo.', 'My hometown.', 'Can also mean "The People".'),
  n('edificio', 'edificio', 'Building', 'travel', 'm', 'Structure.', 'Edificio alto.', 'Tall building.', 'Entra al edificio.', 'Enter the building.', 'Looks like Edifice.'),
  n('tienda', 'tienda', 'Shop/Store', 'society', 'f', 'Commerce.', 'Voy a la tienda.', 'I go to the store.', 'Tienda de ropa.', 'Clothes shop.', 'Verb: Tender.'),
  n('supermercado', 'supermercado', 'Supermarket', 'food', 'm', 'Commerce.', 'Comprar comida.', 'Buy food.', 'Carro de supermercado.', 'Shopping cart.', 'Cognate.'),
  n('banco', 'banco', 'Bank/Bench', 'society', 'm', 'Finance.', 'Dinero en el banco.', 'Money in the bank.', 'Siéntate en el banco.', 'Sit on the bench.', 'Same word for both.'),
  n('escuela', 'escuela', 'School', 'work', 'f', 'Education.', 'Niños en la escuela.', 'Kids at school.', 'Escuela pública.', 'Public school.', 'Related to Scholar.'),
  n('tren', 'tren', 'Train', 'travel', 'm', 'Transport.', 'Viajar en tren.', 'Travel by train.', 'Estación de tren.', 'Train station.', 'Cognate.'),
  n('autobus', 'autobús', 'Bus', 'travel', 'm', 'Transport.', 'Parada de autobús.', 'Bus stop.', 'Esperar el autobús.', 'Wait for the bus.', 'Short: Bus.'),
  n('avion', 'avión', 'Airplane', 'travel', 'm', 'Transport.', 'Avión rápido.', 'Fast plane.', 'Billete de avión.', 'Plane ticket.', 'Related to Aviation.'),

  // --- INTERACTION VERBS ---
  {
    ...v('abrir', 'abrir', 'To open', 'daily', 'Action.', 'Abro la puerta.', 'I open the door.', 'Abren la tienda.', 'They open the shop.', 'Opposite: Cerrar.', undefined, true),
    tense_forms: {
      past: "abrí, abriste, abrió, abrimos, abristeis, abrieron",
      imperfect: "abría, abrías, abría, abríamos, abríais, abrían",
      future: "abriré, abrirás, abrirá, abriremos, abriréis, abrirán"
    }
  },
  {
    ...v('cerrar', 'cerrar', 'To close', 'daily', 'Action.', 'Cierra la ventana.', 'Close the window.', 'La tienda cierra.', 'The shop closes.', 'Stem E->IE (Cierro).', 'cierro, cierras, cierra, cerramos, cerráis, cierran', false),
    tense_forms: {
      past: "cerré, cerraste, cerró, cerramos, cerrasteis, cerraron",
      imperfect: "cerraba, cerrabas, cerraba, cerrábamos, cerrabais, cerraban",
      future: "cerraré, cerrarás, cerrará, cerraremos, cerraréis, cerrarán"
    }
  },
  {
    ...v('encender', 'encender', 'To turn on/light', 'tech', 'Power.', 'Enciende la luz.', 'Turn on the light.', 'Encender el fuego.', 'Light the fire.', 'Stem E->IE.', 'enciendo, enciendes, enciende, encendemos, encendéis, encienden', false),
    tense_forms: {
      past: "encendí, encendiste, encendió, encendimos, encendisteis, encendieron",
      imperfect: "encendía, encendías, encendía, encendíamos, encendíais, encendían",
      future: "encenderé, encenderás, encenderá, encenderemos, encenderéis, encenderán"
    }
  },
  {
    ...v('apagar', 'apagar', 'To turn off', 'tech', 'Power.', 'Apaga la tele.', 'Turn off the TV.', 'Apaga la luz.', 'Turn off the light.', 'Use for electronics/fire.', undefined, true),
    tense_forms: {
      past: "apagué, apagaste, apagó, apagamos, apagasteis, apagaron",
      imperfect: "apagaba, apagabas, apagaba, apagábamos, apagabais, apagaban",
      future: "apagaré, apagarás, apagará, apagaremos, apagaréis, apagarán"
    }
  },
  {
    ...v('usar', 'usar', 'To use', 'tech', 'Utility.', 'Uso el ordenador.', 'I use the computer.', '¿Puedo usar esto?', 'Can I use this?', 'Cognate.', undefined, true),
    tense_forms: {
      past: "usé, usaste, usó, usamos, usasteis, usaron",
      imperfect: "usaba, usabas, usaba, usábamos, usabais, usaban",
      future: "usaré, usarás, usará, usaremos, usaréis, usarán"
    }
  },
  {
    ...v('romper', 'romper', 'To break', 'daily', 'Destruction.', 'He roto el vaso.', 'I have broken the glass.', 'Se rompió.', 'It broke.', 'Participle: Roto.', undefined, true),
    tense_forms: {
      past: "rompí, rompiste, rompió, rompimos, rompisteis, rompieron",
      imperfect: "rompía, rompías, rompía, rompíamos, rompíais, rompían",
      future: "romperé, romperás, romperá, romperemos, romperéis, romperán"
    }
  },
  {
    ...v('arreglar', 'arreglar', 'To fix/arrange', 'daily', 'Repair.', 'Arreglo el coche.', 'I fix the car.', 'Arreglar la casa.', 'Tidy up the house.', 'Multi-use verb.', undefined, true),
    tense_forms: {
      past: "arreglé, arreglaste, arregló, arreglamos, arreglasteis, arreglaron",
      imperfect: "arreglaba, arreglabas, arreglaba, arreglábamos, arreglabais, arreglaban",
      future: "arreglaré, arreglarás, arreglará, arreglaremos, arreglaréis, arreglarán"
    }
  },
  {
    ...v('limpiar', 'limpiar', 'To clean', 'daily', 'Hygiene.', 'Limpio la cocina.', 'I clean the kitchen.', 'Limpiar el suelo.', 'Clean the floor.', 'Adj: Limpio.', undefined, true),
    tense_forms: {
      past: "limpié, limpiaste, limpió, limpiamos, limpiasteis, limpiaron",
      imperfect: "limpiaba, limpiabas, limpiaba, limpiábamos, limpiabais, limpiaban",
      future: "limpiaré, limpiarás, limpiará, limpiaremos, limpiaréis, limpiarán"
    }
  },

  // --- DEMONSTRATIVES (Pointing Tools) ---
  m('este_dem', 'este', 'This (Masc)', 'grammar', 'Near.', 'Este libro.', 'This book.', 'Este es mi amigo.', 'This is my friend.', 'citizen', 'For masculine nouns nearby.'),
  m('esta_dem', 'esta', 'This (Fem)', 'grammar', 'Near.', 'Esta casa.', 'This house.', 'Esta semana.', 'This week.', 'citizen', 'For feminine nouns nearby.'),
  m('ese_dem', 'ese', 'That (Masc)', 'grammar', 'Far.', 'Ese coche.', 'That car.', 'Quiero ese.', 'I want that one.', 'citizen', 'For masculine nouns further away.'),
  m('esa_dem', 'esa', 'That (Fem)', 'grammar', 'Far.', 'Esa chica.', 'That girl.', 'Esa es la verdad.', 'That is the truth.', 'citizen', 'For feminine nouns further away.'),
  m('esto_dem', 'esto', 'This (Neutral)', 'grammar', 'Unknown.', '¿Qué es esto?', 'What is this?', 'Esto es raro.', 'This is strange.', 'citizen', 'Use when you don\'t know the gender.'),

  // ==============================================
  // 🚑 PACK D: THE SURVIVOR (Health, City, directions)
  // Category: 'survivor'
  // ==============================================
  // --- BODY & HEALTH ---
  n('cuerpo', 'cuerpo', 'Body', 'body', 'm', 'Anatomy.', 'Me duele el cuerpo.', 'My body hurts.', 'Cuerpo humano.', 'Human body.', 'Root of "Corpse".'),
  n('cabeza', 'cabeza', 'Head', 'body', 'f', 'Anatomy.', 'Dolor de cabeza.', 'Headache.', 'Usa la cabeza.', 'Use your head.', 'Fem: La cabeza.'),
  n('mano', 'mano', 'Hand', 'body', 'f', 'Anatomy.', 'Dame la mano.', 'Give me your hand.', 'Mano derecha.', 'Right hand.', 'WARNING: Ends in O but is Feminine (La mano).'),
  n('pie', 'pie', 'Foot', 'body', 'm', 'Anatomy.', 'Estoy de pie.', 'I am standing (on foot).', 'Pie izquierdo.', 'Left foot.', 'Masc: El pie.'),
  n('estomago', 'estómago', 'Stomach', 'body', 'm', 'Anatomy.', 'Me duele el estómago.', 'My stomach hurts.', 'Estómago vacío.', 'Empty stomach.', 'Note accent on ó.'),
  n('dolor', 'dolor', 'Pain', 'body', 'm', 'Sensation.', 'Tengo dolor.', 'I have pain.', 'Sin dolor.', 'Without pain.', 'Verb: Doler.'),
  n('medicina', 'medicina', 'Medicine', 'body', 'f', 'Health.', 'Toma la medicina.', 'Take the medicine.', 'Medicina fuerte.', 'Strong medicine.', 'Cognate.'),
  n('medico', 'médico', 'Doctor', 'body', 'm', 'Profession.', 'Voy al médico.', 'I go to the doctor.', 'Médico bueno.', 'Good doctor.', 'Synonym: Doctor.'),
  n('hospital', 'hospital', 'Hospital', 'body', 'm', 'Place.', '¿Dónde está el hospital?', 'Where is the hospital?', 'Hospital central.', 'Central hospital.', 'H is silent.'),
  {
    ...v('doler', 'doler', 'To hurt', 'body', 'Sensation.', 'Me duele aquí.', 'It hurts here.', 'Me duelen los pies.', 'My feet hurt.', 'Note: Works like Gustar (Me duele). Stem O->UE.', 'duele, duelen (usually)', false),
    tense_forms: {
      past: "dolió, dolieron",
      imperfect: "dolía, dolían",
      future: "dolerá, dolerán"
    }
  },
  {
    ...v('curar', 'curar', 'To cure/heal', 'body', 'Health.', 'El tiempo cura.', 'Time heals.', 'Curar la herida.', 'To heal the wound.', 'Tiempo: Time.', undefined, true),
    tense_forms: {
      past: "curé, curaste, curó, curamos, curasteis, curaron",
      imperfect: "curaba, curabas, curaba, curábamos, curabais, curaban",
      future: "curaré, curarás, curará, curaremos, curaréis, curarán"
    }
  },

  // --- CITY & NAVIGATION ---
  n('calle', 'calle', 'Street', 'travel', 'f', 'Location.', 'En la calle.', 'In the street.', 'Calle mayor.', 'Main street.', 'Double L sounds like Y.'),
  n('bano', 'baño', 'Bathroom', 'daily', 'm', 'Place.', '¿Dónde está el baño?', 'Where is the bathroom?', 'Voy al baño.', 'I go to the bathroom.', 'Essential phrase.'),
  n('mapa', 'mapa', 'Map', 'travel', 'm', 'Tool.', 'Mira el mapa.', 'Look at the map.', 'Mapa mundi.', 'World map.', 'WARNING: Ends in A but is Masculine (El mapa).'),
  n('lugar', 'lugar', 'Place', 'travel', 'm', 'Location.', 'Lugar bonito.', 'Beautiful place.', 'En este lugar.', 'In this place.', 'Plural: Lugares.'),
  n('entrada', 'entrada', 'Entrance', 'travel', 'f', 'Location.', 'Esa es la entrada.', 'That is the entrance.', 'Entrada libre.', 'Free entrance.', 'Opposite: Salida.'),
  n('salida', 'salida', 'Exit', 'travel', 'f', 'Location.', 'Busco la salida.', 'I look for the exit.', 'Salida de emergencia.', 'Emergency exit.', 'Verb: Salir.'),
  m('izquierda', 'izquierda', 'Left', 'travel', 'Direction.', 'A la izquierda.', 'To the left.', 'Mano izquierda.', 'Left hand.', 'survivor', 'Direction.'),
  m('derecha', 'derecha', 'Right', 'travel', 'Direction.', 'A la derecha.', 'To the right.', 'Gira a la derecha.', 'Turn right.', 'survivor', 'Direction.'),
  m('arriba_dir', 'arriba', 'Up/Above', 'travel', 'Direction.', 'Mira arriba.', 'Look up.', 'Está arriba.', 'It is upstairs.', 'survivor', 'Direction.'),
  m('abajo_dir', 'abajo', 'Down/Below', 'travel', 'Direction.', 'Mira abajo.', 'Look down.', 'Está abajo.', 'It is downstairs.', 'survivor', 'Direction.'),

  // --- TRANSACTIONS & NUMBERS ---
  {
    ...v('costar', 'costar', 'To cost', 'society', 'Value.', '¿Cuánto cuesta?', 'How much does it cost?', 'Cuesta mucho.', 'It costs a lot.', 'Note: Stem O->UE.', 'cuesta, cuestan (usually)', false),
    tense_forms: {
      past: "costó, costaron",
      imperfect: "costaba, costaban",
      future: "costará, costarán"
    }
  },
  n('precio', 'precio', 'Price', 'society', 'm', 'Value.', 'Buen precio.', 'Good price.', '¿Qué precio tiene?', 'What price does it have?', 'Cognate.'),
  n('cuenta', 'cuenta', 'Bill/Account', 'society', 'f', 'Payment.', 'La cuenta, por favor.', 'The check, please.', 'Cuenta bancaria.', 'Bank account.', 'Essential for restaurants.'),
  n('tarjeta', 'tarjeta', 'Card', 'society', 'f', 'Payment.', 'Pago con tarjeta.', 'I pay with card.', 'Tarjeta de crédito.', 'Credit card.', 'Pair with Pagar.'),
  n('efectivo', 'efectivo', 'Cash', 'society', 'm', 'Payment.', 'Pago en efectivo.', 'I pay in cash.', 'No tengo efectivo.', 'I have no cash.', 'Essential transaction.'),
  n('billete', 'billete', 'Ticket/Banknote', 'travel', 'm', 'Paper.', 'Billete de tren.', 'Train ticket.', 'Billete de avión.', 'Plane ticket.', 'Also means paper money.'),
  n('numero', 'número', 'Number', 'abstract', 'm', 'Math.', 'Tu número de teléfono.', 'Your phone number.', 'Número uno.', 'Number one.', 'Cognate.'),
  
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
  {
    ...v('contar', 'contar', 'To tell (story)/count', 'social', 'Narrating.', 'Te cuento un secreto.', 'I tell you a secret.', 'Cuenta conmigo.', 'Count on me.', 'Secreto: Secret.', 'cuento, cuentas, cuenta, contamos, contáis, cuentan', true, undefined),
    tense_forms: {
      past: "conté, contaste, contó, contamos, contasteis, contaron",
      imperfect: "contaba, contabas, contaba, contábamos, contabais, contaban",
      future: "contaré, contarás, contará, contaremos, contaréis, contarán"
    }
  },
  {
    ...v('pasar_v', 'pasar', 'To happen/pass', 'abstract', 'Event.', '¿Qué pasó?', 'What happened?', 'El tiempo pasa.', 'Time passes.', 'Tiempo: Time.', undefined, true, undefined),
    tense_forms: {
      past: "pasé, pasaste, pasó, pasamos, pasasteis, pasaron",
      imperfect: "pasaba, pasabas, pasaba, pasábamos, pasabais, pasaban",
      future: "pasaré, pasarás, pasará, pasaremos, pasaréis, pasarán"
    }
  },
  {
    ...v('ocurrir', 'ocurrir', 'To occur', 'abstract', 'Event.', 'Algo extraño ocurrió.', 'Something strange occurred.', 'No se me ocurre nada.', 'Nothing comes to mind.', 'Extraño: Strange.', undefined, true, undefined),
    tense_forms: {
      past: "ocurrí, ocurriste, ocurrió, ocurrimos, ocurristeis, ocurrieron",
      imperfect: "ocurría, ocurrías, ocurría, ocurríamos, ocurríais, ocurrían",
      future: "ocurriré, ocurrirás, ocurrirá, ocurriremos, ocurriréis, ocurrirán"
    }
  },
  a('emocionante', 'emocionante', 'Exciting', 'feelings', 'aburrido', 'Boring', 'Feeling.', 'Fue emocionante.', 'It was exciting.', 'Película emocionante.', 'Exciting movie.', 'Película: Movie.', undefined),

  // ==============================================
  // 📦 PACK B: THE DEBATER (Opinion & Logic)
  // Category: 'debater'
  // ==============================================
  m('por_eso', 'por eso', "That's why", 'grammar', 'Result.', 'Estaba cansado, por eso dormí.', 'I was tired, that is why I slept.', 'Logic', 'Cause and effect.', 'debater', 'Logic bridge.'),
  m('sin_embargo', 'sin embargo', 'However', 'grammar', 'Contrast.', 'Es caro, sin embargo lo compro.', 'It is expensive, however I buy it.', 'Contrast', 'Formal "but".', 'debater', 'Contrast tool.'),
  m('en_mi_opinion', 'en mi opinión', 'In my opinion', 'abstract', 'Viewpoint.', 'En mi opinión, es falso.', 'In my opinion, it is false.', 'Viewpoint', 'Softens statements.', 'debater', 'Opener.'),
  m('claro_que_si', 'claro que sí', 'Of course', 'social', 'Agreement.', '¿Vas a ir? ¡Claro que sí!', 'Are you going? Of course!', 'Agreement', 'Strong yes.', 'debater', 'Agreement.'),
  {
    ...v('acordar', 'estar de acuerdo', 'To agree', 'social', 'Consensus.', 'Estoy de acuerdo contigo.', 'I agree with you.', 'No estamos de acuerdo.', 'We do not agree.', 'Contigo: With you.', undefined, true, undefined),
    tense_forms: {
      past: "estuve de acuerdo, estuviste de acuerdo, estuvo de acuerdo...",
      imperfect: "estaba de acuerdo, estabas de acuerdo, estaba de acuerdo...",
      future: "estaré de acuerdo, estarás de acuerdo, estará de acuerdo..."
    }
  },
  {
    ...v('tener_razon', 'tener razón', 'To be right', 'abstract', 'Correctness.', 'Tienes razón.', 'You are right.', 'No tengo razón.', 'I am not right.', 'Note: Uses "Tener" (to have reason).', undefined, true, undefined),
    tense_forms: {
      past: "tuve razón, tuviste razón, tuvo razón...",
      imperfect: "tenía razón, tenías razón, tenía razón...",
      future: "tendré razón, tendrás razón, tendrá razón..."
    }
  },
  {
    ...v('parecer_op', 'me parece que', 'It seems to me', 'abstract', 'Opinion.', 'Me parece que es bueno.', 'It seems to me it is good.', '¿Qué te parece?', 'What do you think?', 'Bueno: Good.', undefined, true, undefined),
    tense_forms: {
      past: "me pareció que, te pareció que, le pareció que...",
      imperfect: "me parecía que, te parecía que, le parecía que...",
      future: "me parecerá que, te parecerá que, le parecerá que..."
    }
  },
  {
    ...v('discutir', 'discutir', 'To argue/discuss', 'social', 'Conflict.', 'No quiero discutir.', 'I do not want to argue.', 'Discuten mucho.', 'They argue a lot.', 'Mucho: A lot.', undefined, true, undefined),
    tense_forms: {
      past: "discutí, discutiste, discutió, discutimos, discutisteis, discutieron",
      imperfect: "discutía, discutías, discutía, discutíamos, discutíais, discutían",
      future: "discutiré, discutirás, discutirá, discutiremos, discutiréis, discutirán"
    }
  },
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
