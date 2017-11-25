// devuelve la longitud de un vector
function length(vector){
    let sum = 0;
    for(let i = 0; i < vector.length; i++){
        sum += Math.pow(vector[i], 2);
    }
    return Math.sqrt(sum);
}

// normaliza el vector de entrada y lo devuelve (en forma de array)
function normalize(vector){
    var modulo = length(vector);
    let result = new Array(vector.length);
    for(let i = 0; i < result.length; i++){
        result[i] /= modulo;
    }
    return result;
}


// controla que un valor se encuentre dentro de 2 valores maximo y minimo
function clamp(min, actual, max){
    return Math.min(Math.max(actual, min), max);
}