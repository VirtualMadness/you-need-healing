'use strict';
//literales de las traducciones;
var literals = {
        es: {
          translation: {
            "1_jugador": "1 Jugador",
            "2_jugadores": "2 Jugadores",
            "creditos": "Créditos",
            "ajustes": "Ajustes",
            "lenguaje": "Lenguaje: ",
            "pantalla_completa": "Pantalla Completa",
            "dificultad": "Dificultad",  
            "facil": "Nivel 1 - Fácil",
            "medio": "Nivel 2 - Normal",
            "dificil": "Nivel 3 - Difícil",
            "jugar": "Jugar",
            "volumen_musica": "Volumen de la Música:",
            "volumen_efectos": "Volumen de Efectos:",
            "salir": "salir",
            "proximamente": "Próximamente",
            "creado_por": "Creado por:",
            "programador_artista2D"  : "Programador / Artista 2D",
            "programador": "Programador",
            "diseñador": "Diseñador",
            "artista2D": "Artista 2D",
            "aviso_portrait": "Este juego esta diseñado para mostrarse en modo apaisado.", 
            "cambiar": "Cambiar",
            "aviso_webapp": "Puedes añadir este juego a tu pantalla de inicio gracias a la tecnología 'Progressive Web App'.",
            "puesto": "#",
            "jugador": "Jugador",
            "puntos": "Puntos",
            "cargando": "Cargando...",
            "reintentar": "Reintentar",
          }
        },
        en: {
          translation: {
            "1_jugador": "1 Player",
            "2_jugadores": "2 Players",
            "creditos": "Credits",
            "ajustes": "settings",
            "lenguaje": "Language: ",  
            "pantalla_completa": "Full screen",
            "dificultad": "Difficulty",
            "facil": "Level 1 - Easy",
            "medio": "Level 2 - Normal",
            "dificil": "Level 3 - Hard",
            "jugar": "Play",
            "volumen_musica": "Music volume:",
            "volumen_efectos": "Effects volume:",
            "salir": "Exit",
            "proximamente": "Coming Soon",
            "creado_por": "Created by:",
            "programador_artista2D"  : "Programmer / 2D Artist",
            "programador": "Programmer",
            "diseñador": "Designer",
            "artista2D": "2D Artist",
            "aviso_portrait": "This game has been designed for being played in landscape mode.", 
            "cambiar": "Change",
            "aviso_webapp": "You can add this game to your home screen thanks to 'Progressive Web App' tecnology.",
            "puesto": "#",
            "jugador": "Player",
            "puntos": "Points",
            "cargando": "Loading...",
            "reintentar": "Retry",
          }
        },
        fr: {
          translation: {
            "1_jugador": "1 Joueur",
            "2_jugadores": "2 Joueurs",
            "creditos": "Crédits",
            "ajustes": "Configuration",
            "lenguaje": "Langue: ",
            "pantalla_completa": "Plein Écran",
            "dificultad": "Difficulté",
            "facil": "Niveau 1 - Facile",
            "medio": "Niveau 2 - Normal",
            "dificil": "Niveau 3 - Difficile",
            "jugar": "Jouer",
            "volumen_musica": "Volume de la Musique",
            "volumen_efectos": "Volume d'effets",
            "salir": "sortir",
            "proximamente": "Comming soon",
            "creado_por": "Créé par:",
            "programador_artista2D"  : "Programmeur / Artiste 2D ",
            "programador": "Programmeur",
            "diseñador": "Concepteur",
            "artista2D": "Artiste 2D",
            "aviso_portrait": "Ce jeu a été conçu pour être joué en mode paysage.", 
            "cambiar": "Changer",
            "aviso_webapp": "Vous pouvez ajouter ce jeu à votre écran d'accueil grâce à la technologie 'Progressive Web App'.",
            "puesto": "#",
            "jugador": "Joueur",
            "puntos": "Points",  
            "cargando": "Loading...",
            "reintentar": "Réessayer",
          }
        },
        de: {
          translation: {
            "1_jugador": "1 spieler",
            "2_jugadores": "2 spieler",
            "creditos": "Kredite",
            "ajustes": "Konfiguration",
            "lenguaje": "sprache: ",
            "pantalla_completa": "Vollbild",
            "dificultad": "schwierigkeit",
            "facil": "Ebene 1 - Einfach",
            "medio": "Ebene 2 - Mittel",
            "dificil": "Ebene 3 - schwer",
            "jugar": "Abspielen",
            "volumen_musica": "Musik-Lautstärke",
            "volumen_efectos": "Lautstärke der Effekte",
            "salir": "Herausgehen",
            "proximamente": "Arrive Bientôt",
            "creado_por": "Erstellt von:",
            "programador_artista2D"  : "Programmierer / 2D-Künstler ",
            "programador": "Programmierer",
            "diseñador": "Designer",
            "artista2D": "2D-Künstler",
            "aviso_portrait": "Dieses spiel wurde für die Wiedergabe im Querformat entwickelt.", 
            "cambiar": "Ändern",
            "aviso_webapp": "sie können dieses spiel dank der Technologie zu Ihrem startbildschirm hinzufügen 'Progressive Web App'.",
            "puesto": "#",
            "jugador": "spieler",
            "puntos": "Punkte",
            "cargando": "Laden...",
            "reintentar": "Retrying",
          }
        },
        it: {
          translation: {
            "1_jugador": "1 Giocatore",
            "2_jugadores": "2 giocatori",
            "creditos": "Crediti",
            "ajustes": "Configuración",
            "lenguaje": "Lingua: ",
            "pantalla_completa": "Schermo Intero",
            "dificultad": "Difficoltà",
            "facil": "Livello 1 - Facile",
            "medio": "Livello 2 - Mezzi",
            "dificil": "Livello 3 - Difficile",
            "jugar": "Giocare",
            "volumen_musica": "Volume di Musica",
            "volumen_efectos": "Volume di Effetti",
            "salir": "Vieni Fuori",
            "proximamente": "Prossimamente",
            "creado_por": "Creato da:",
            "programador_artista2D"  : "Programmatore / Artista 2D",
            "programador": "Programmatore",
            "diseñador": "Disegnatore",
            "artista2D": "Artista 2D",
            "aviso_portrait": "Questo gioco è stato progettato per essere giocato in modalità orizzontale.", 
            "cambiar": "Modificare",
            "aviso_webapp": "È possibile aggiungere questo gioco alla schermata iniziale grazie alla tecnologia 'Progressive Web App'.",
            "puesto": "#",
            "jugador": "Giocatore",
            "puntos": "Punti",
            "cargando": "Caricando...",
            "reintentar": "Riprovare",  
          }
    }
          
}

/*var jqJson = $.getJSON("https://raw.githubusercontent.com/VirtualMadness/you-need-healing/master/assets/localization.json")
.done(function(result){
    console.log("peticion realizada con exito");
    console.log(result);
}).fail(function(result){
    console.log("peticion fallida");
}).always(function(){
    console.log("peticion completa");
});*/


//inicia el plugin para traduciones i18next
function init_i18n(){
    i18next
        .use(i18nextBrowserLanguageDetector)
        .init({
      lng: 'es',
      debug: false,
      resources: literals,
    }, function(err, t) {
      // init set content
      updateContent();
    });
}

function updateContent() {
    var valores = $(".traducible").each(function(){
        $(this).html(i18next.t($(this).prop("title")));
    });
    /*
    for(var i = 0; i < valores.length; i++){
        var item = valores[i];
        item.innerHTML = i18next.t(item.title);
    }*/
    //cambia el texto para mostrar el lenguaje seleccionado
    //$("#lang").html(i18next.language);
}

function changeLng(lng) {
  i18next.changeLanguage(lng);
}

i18next.on('languageChanged', () => {
  updateContent();
});
