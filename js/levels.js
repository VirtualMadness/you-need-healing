/* tipy puede ser::
nd: caja no destruible,
d: caja destruible,
dmg: caja que hace daño
rba: spawner robo-bola tipo A
rbb: spawner robo-bola tipo B
ra: spawner robo-araña
rl: spawner rodo-laarto
*/

//las posiciones en coordenadas del mapa de javi contando que el 0.0 esta arriba a la izquierda (cuadricula del cuaderno, p.e. 3.5 si cae en medio de un cuadro)
let lvl1 = [
    {
        "x": 3.5,
        "y": 3.5,
        "rot": 0,
        "scaleX": 1,
        "scaleY": 1,
        "type": "nd",
    },
    {
        "x": 4.5,
        "y": 8.5,
        "rot": 0,
        "scaleX": 1,
        "scaleY": 1,
        "type": "nd",
    },
    {
        "x": 9.5,
        "y": 4.5,
        "rot": 0,
        "scaleX": 1,
        "scaleY": 1,
        "type": "dmg",
    }
]
