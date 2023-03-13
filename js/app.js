const resultado = document.querySelector('#resultado');
const formulario = document.querySelector("#formulario");
const paginacionDiv = document.querySelector("#paginacion");

const registrosPorPagina = 40;
let totalPaginas;
let interador;
let paginaActual = 1;


// Wrap every letter in a span
var textWrapper = document.querySelector('.ml1 .letters');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline({loop: true})
  .add({
    targets: '.ml1 .letter',
    scale: [0.3,1],
    opacity: [0,1],
    translateZ: 0,
    easing: "easeOutExpo",
    duration: 600,
    delay: (el, i) => 70 * (i+1)
  }).add({
    targets: '.ml1 .line',
    scaleX: [0,1],
    opacity: [0.5,1],
    easing: "easeOutExpo",
    duration: 700,
    offset: '-=875',
    delay: (el, i, l) => 80 * (l - i)
  }).add({
    targets: '.ml1',
    opacity: 0,
    duration: 1000,
    easing: "easeOutExpo",
    delay: 1000
  });

window.onload = () => {
    formulario.addEventListener('submit', validarFormulario);
}

function validarFormulario(e) {
    e.preventDefault();

    const terminoBusqueda = document.querySelector("#termino").value;

    if (terminoBusqueda === "") {
        mostraAlerta("Aggiunge una parola")

    }

    buscarImagines()
}

function mostraAlerta(mensaje) {

    const existeAlerta = document.querySelector('.bg-red-100');

    if(!existeAlerta) {
        const alerta = document.createElement('p');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');
    
        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block sm:inline">${mensaje}</span>
        `;
    
        formulario.appendChild(alerta);
    
        setTimeout (() => {
            alerta.remove()
        }, 3000);
        
    }  

}


function buscarImagines() {

    const termino = document.querySelector("#termino").value;


    const key = '34365428-42540c58c10ddfb463523751b';
    const url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${registrosPorPagina}&page=${paginaActual}`;

   fetch(url)
   .then(respuesta => respuesta.json())
   .then(resultado => {
        totalPaginas = calcularPaginas(resultado.totalHits)
        console.log(totalPaginas);
        mostrarImagines(resultado.hits)
   })
}

   //GENERADOR QUE VA A REGISTRAR LA CANTIDAD DE ELEMENTOS DE ACUERDO A LAS PAGINAS 

   function *crearPaginador(total) {
        console.log(total);
        for( let i = 1; i<= total; i++) {
            yield i;
        }
    
}

function calcularPaginas(total) {
    return parseInt(Math.ceil( total / registrosPorPagina));
}

function mostrarImagines(imagines) {
    while(resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);

    };

 

    // INTERAR SOBRE EL ARREGLO DE IMAGINES Y CONSTRUIR EL HTML
    imagines.forEach(imagen => {
        const {previewURL, likes, views, largeImageURL } = imagen;

        resultado.innerHTML += `

        <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">

            <div class="bg-white ">

                <img class="w-full max-h-14" src="${previewURL}">

                <div class="p-4"
                    
                    <p class="font-bold"> ${likes} <span class="font-light"> Piace </span> </p>
                    <p class="font-bold"> ${views} <span class="font-light"> Viste </span> </p>

                    <a class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1" 
                    href="${largeImageURL}" target="_blank" rel="noopener noreferrer">
                        Guarda Imagine
                    </a>    
                </div>
            </div>        
        </div>
        `
        
    });

    //LIMPIAR GENERADOR
    while(paginacionDiv.firstChild) {
        paginacionDiv.removeChild(paginacionDiv.firstChild);
    }

    //GENERAR NUEVO HTML
    imprimirPaginador()

}

function imprimirPaginador() {
    interador = crearPaginador(totalPaginas);

    while(true) {
        const {value, done} = interador.next();
        if(done) return;

        //CASO CONTRARIO GENERA UN BOTON POR CADA ELEMENTO EN EL GENERADOR 

        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent = value;
        boton.classList.add('siguiente', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2', 'font-bold', 'mb-4', 'rounded',);

        boton.onclick = () => {
            paginaActual = value;

            buscarImagines();
        }
 
        paginacionDiv.appendChild(boton);



    }


}




