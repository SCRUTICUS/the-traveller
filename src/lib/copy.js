export const locales = ['nl', 'en', 'fr'];
export const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const assets = name => base + '/' + name;
export const route = (lang, page = 'home') => {
  const booking = { nl: 'boeken', en: 'book', fr: 'reserver' };
  return base + '/' + (lang === 'nl' ? '' : lang + '/') + (page === 'book' ? booking[lang] + '/' : '');
};
export const worlds = ['sahara', 'amazon', 'canyon'];
export const cities = ['gent', 'brussel', 'antwerpen'];
export const prices = {30: 13, 60: 22};
export const content = {
 nl: {
  nav: ['Bestemmingen', 'De ervaring', 'Locaties'], book: 'Boek een wandeling', explore: 'Ontdek de bestemmingen', menu: 'Menu', close: 'Sluiten', home: 'Startpagina', lang: 'Taal', skip: 'Naar de inhoud',
  label: 'Een zintuiglijke VR-ervaring', title: ['Waar brengt jouw', 'volgende wandeling je?'], intro: 'Stap binnen in ons glazen paviljoen. Wandel door een andere wereld met een VR-bril op en voel de wind en de nevel op je huid.',
  slide: 'Volgende bestemming', prev: 'Vorige bestemming', scene: 'In beeld', places: 'Onze bestemmingen', where: 'Kies je', whereEm: 'bestemming.', chooser: 'Drie landschappen. Kies er één voor jouw wandeling.', pick: 'Boek deze wandeling',
  names: ['De Sahara', 'Het Amazonewoud', 'De Grand Canyon'], regions: ['Noord-Afrika', 'Zuid-Amerika', 'Arizona, VS'], terrain: ['Zandduinen', 'Regenwoud', 'Canyon'],
  descriptions: ['Volg de kam van een zandduin terwijl de wind fijne korrels over het zand blaast.', 'Loop onder het bladerdak, langs lianen en door een koele nevel.', 'Wandel langs de rand en kijk uit over lagen rode rots, diep in de kloof.'],
  sensations: ['Wind over de duinen', 'Nevel onder het bladerdak', 'Een bries langs de rotswand'],
  experience: 'De ervaring', inside: 'Binnen in', insideEm: 'het paviljoen.', how: 'Achter het donkere glas begint je wandeling. Kies een landschap en bekijk de bijbehorende zijde van het paviljoen.',
  steps: [['Zet je VR-bril op', 'Kijk om je heen. Het landschap strekt zich in alle richtingen uit.'], ['Zet je eerste stap', 'Op de loopband bepaal je zelf het tempo van je wandeling.'], ['Voel je omgeving', 'Wind en fijne waternevel brengen de wereld om je heen tot leven.']],
  model: 'Interactief model van het glazen paviljoen', citiesLabel: ['Gent','Brussel','Antwerpen'], popups: 'Onze pop-ups', nearby: 'Vertrek vanuit', nearbyEm: 'jouw stad.', locIntro: 'Dezelfde drie werelden, in drie Belgische steden.', cityLink: 'Boek in', demo: 'Schoolproject · fictieve pop-up', back: 'Terug naar de startpagina',
  booking: 'Boek jouw', bookingEm: 'wandeling.', demoNotice: 'Dit is een demoboeking voor een schoolproject. Je hoeft niets te betalen.', destination: 'Bestemming', city: 'Vertrekstad', duration: 'Duur', day: 'Datum', time: 'Startuur', summary: 'Jouw wandeling', confirm: 'Maak mijn demoticket', ticket: 'Jouw demoticket', ticketTitle: 'Klaar voor vertrek.', demoTicket: 'Dit is een voorbeeldticket voor ons schoolproject.', change: 'Pas je keuzes aan', min: 'min', one: 'Eén bestemming per sessie.', chooseTime: 'Kies een startuur', total: 'Totaal', locale: 'nl-BE', ticketAlt: 'Bestemming op je demoticket'
 },
 en: {
  nav: ['Destinations', 'The experience', 'Locations'], book: 'Book a walk', explore: 'Explore destinations', menu: 'Menu', close: 'Close', home: 'Home', lang: 'Language', skip: 'Skip to content',
  label: 'A sensory VR experience', title: ['Where will your', 'next walk take you?'], intro: 'Step inside our glass pavilion and put on a VR headset. Walk through another world with wind and mist against your skin.',
  slide: 'Next destination', prev: 'Previous destination', scene: 'In view', places: 'Our destinations', where: 'Choose your', whereEm: 'destination.', chooser: 'Three landscapes. Pick one for your walk.', pick: 'Book this walk',
  names: ['The Sahara', 'The Amazon rainforest', 'The Grand Canyon'], regions: ['North Africa', 'South America', 'Arizona, USA'], terrain: ['Sand dunes', 'Rainforest', 'Canyon'],
  descriptions: ['Follow the crest of a dune as the wind brushes fine grains across the sand.', 'Walk beneath the canopy, past hanging vines and into a cool mist.', 'Follow the rim and look down at layers of red rock deep in the canyon.'],
  sensations: ['Wind across the dunes', 'Mist beneath the canopy', 'A breeze along the cliffs'],
  experience: 'The experience', inside: 'Inside the', insideEm: 'pavilion.', how: 'Your walk begins behind smoked glass. Choose a landscape to see its face of the pavilion.',
  steps: [['Put on your VR headset', 'Look around. The landscape stretches out in every direction.'], ['Take your first step', 'Walk on the treadmill at your own pace.'], ['Feel the landscape', 'Wind and a fine spray of water bring the world around you to life.']],
  model: 'Interactive model of the glass pavilion', citiesLabel: ['Ghent','Brussels','Antwerp'], popups: 'Our pop-ups', nearby: 'Set out from', nearbyEm: 'your city.', locIntro: 'The same three worlds in three Belgian cities.', cityLink: 'Book in', demo: 'School project · fictional pop-up', back: 'Back to the homepage',
  booking: 'Book your', bookingEm: 'walk.', demoNotice: 'This is a demo booking for a school project. No payment is needed.', destination: 'Destination', city: 'Departure city', duration: 'Duration', day: 'Date', time: 'Start time', summary: 'Your walk', confirm: 'Create my demo ticket', ticket: 'Your demo ticket', ticketTitle: 'Ready to set off.', demoTicket: 'This is a sample ticket for our school project.', change: 'Edit your choices', min: 'min', one: 'One destination per session.', chooseTime: 'Choose a start time', total: 'Total', locale: 'en-GB', ticketAlt: 'Destination on your demo ticket'
 },
 fr: {
  nav: ['Destinations', 'L’expérience', 'Nos villes'], book: 'Réserver une balade', explore: 'Voir les destinations', menu: 'Menu', close: 'Fermer', home: 'Accueil', lang: 'Langue', skip: 'Aller au contenu',
  label: 'Une expérience VR sensorielle', title: ['Où vous mènera', 'votre prochaine balade ?'], intro: 'Entrez dans notre pavillon de verre et enfilez un casque de réalité virtuelle. À chaque pas, sentez le vent et la brume sur votre peau.',
  slide: 'Destination suivante', prev: 'Destination précédente', scene: 'À l’image', places: 'Nos destinations', where: 'Choisissez votre', whereEm: 'destination.', chooser: 'Trois paysages. À vous de choisir celui de votre balade.', pick: 'Réserver cette balade',
  names: ['Le Sahara', 'La forêt amazonienne', 'Le Grand Canyon'], regions: ['Afrique du Nord', 'Amérique du Sud', 'Arizona, États-Unis'], terrain: ['Dunes de sable', 'Forêt tropicale', 'Canyon'],
  descriptions: ['Suivez la crête d’une dune pendant que le vent soulève le sable fin.', 'Marchez sous la canopée, entre les lianes et les nappes de brume fraîche.', 'Longez le bord du canyon et admirez les strates de roche rouge en contrebas.'],
  sensations: ['Le vent sur les dunes', 'La brume sous la canopée', 'La brise le long des falaises'],
  experience: 'L’expérience', inside: 'À l’intérieur', insideEm: 'du pavillon.', how: 'La balade commence derrière les vitres fumées. Choisissez un paysage pour découvrir la facette du pavillon qui lui correspond.',
  steps: [['Enfilez votre casque VR', 'Regardez autour de vous. Le paysage s’étend dans toutes les directions.'], ['Faites le premier pas', 'Avancez à votre rythme sur le tapis de marche.'], ['Ressentez le paysage', 'Le vent et une fine brume donnent vie au monde qui vous entoure.']],
  model: 'Maquette interactive du pavillon de verre', citiesLabel: ['Gand','Bruxelles','Anvers'], popups: 'Nos pop-ups', nearby: 'Partez de', nearbyEm: 'votre ville.', locIntro: 'Les trois mêmes mondes vous attendent dans trois villes belges.', cityLink: 'Réserver à', demo: 'Projet scolaire · pop-up fictif', back: 'Retour à l’accueil',
  booking: 'Réservez votre', bookingEm: 'balade.', demoNotice: 'Cette réservation fictive fait partie d’un projet scolaire. Aucun paiement à effectuer.', destination: 'Destination', city: 'Ville de départ', duration: 'Durée', day: 'Date', time: 'Heure de départ', summary: 'Votre balade', confirm: 'Créer mon billet démo', ticket: 'Votre billet démo', ticketTitle: 'Tout est prêt pour le départ.', demoTicket: 'Ce billet fictif a été créé pour notre projet scolaire.', change: 'Modifier mes choix', min: 'min', one: 'Une destination par séance.', chooseTime: 'Choisissez une heure', total: 'Total', locale: 'fr-BE', ticketAlt: 'Destination de votre billet démo'
 }
};
