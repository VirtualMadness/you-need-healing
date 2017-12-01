'use strict';
//literales de las traducciones;
let literals = {
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
      debug: true,
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
