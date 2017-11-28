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
            "dificil": "Nivel 3 - Dificil",
            "jugar": "Jugar",
            "volumen_musica": "Volumen de la Música:",
            "volumen_efectos": "Volumen de Efectos:",
            "salir":"Salir",
          }
        },
        en: {
          translation: {
            "1_jugador": "1 Player",
            "2_jugadores": "2 Players",
            "creditos": "Credits",
            "ajustes": "Settings",
            "lenguaje": "Language: ",  
            "pantalla_completa": "Full Screen",
            "dificultad": "Difficulty",
            "facil": "Level 1 - Easy",
            "medio": "Level 2 - Normal",
            "dificil": "Level 3 - Hard",
            "jugar":"Play",
            "volumen_musica": "Music volume:",
            "volumen_efectos": "Effects volume:",
            "salir":"Exit",
          }
        },
        fr: {
          translation: {
            "1_jugador": "1 Joueur",
            "2_jugadores": "2 Joueurs",
            "creditos": "Crédits",
            "ajustes": "Configuration",
            "lenguaje": "Langue sélectionnée: ",              
          }
        },
        de: {
          translation: {
            "1_jugador": "1 Spieler",
            "2_jugadores": "2 Spieler",
            "creditos": "Kredite",
            "ajustes": "Konfiguration",
            "lenguaje": "Ausgewählte Sprache: ",              
          }
        },
        it: {
          translation: {
            "1_jugador": "1 Giocatore",
            "2_jugadores": "2 giocatori",
            "creditos": "Crediti",
            "ajustes": "Configuración",
            "lenguaje": "Lingua selezionata: ",              
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