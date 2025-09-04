document.addEventListener("DOMContentLoaded", () => {
  const botaoGerar = document.getElementById("gerar-nome");
  const seletorTema = document.getElementById("tema");
  const elementoNomeGerado = document.getElementById("nome-gerado");

  // Nossas listas de palavras para cada tema
  const palavras = {
    medieval: {
      prefixos: [
        "Ald",
        "Gwen",
        "Thor",
        "El",
        "Merek",
        "Brynn",
        "Faelan",
        "Seraphina",
      ],
      sufixos: [
        "-ion",
        "-dor",
        "-ia",
        "-gard",
        "-fast",
        "-wyn",
        " Blackstone",
        " Ironhand",
      ],
    },
    futurista: {
      prefixos: ["Zorp", "Kry", "Vex", "Jaxon", "Cy", "Nexa", "Xylar", "Riven"],
      sufixos: [
        "-on 7",
        "-tek",
        "-flux",
        "-9",
        "-core",
        "-lar",
        " X-2",
        " Prime",
      ],
    },
    comum: {
      prefixos: [
        "João",
        "Maria",
        "Pedro",
        "Ana",
        "Carlos",
        "Sofia",
        "Lucas",
        "Laura",
      ],
      sufixos: [
        " Silva",
        " Souza",
        " Pereira",
        " Costa",
        " Oliveira",
        " Rodrigues",
        " Ferreira",
        " Almeida",
      ],
    },
  };

  function gerarNome() {
    const temaSelecionado = seletorTema.value;
    const listaDePalavras = palavras[temaSelecionado];

    const prefixoAleatorio =
      listaDePalavras.prefixos[
        Math.floor(Math.random() * listaDePalavras.prefixos.length)
      ];
    const sufixoAleatorio =
      listaDePalavras.sufixos[
        Math.floor(Math.random() * listaDePalavras.sufixos.length)
      ];

    const nomeFinal = prefixoAleatorio + sufixoAleatorio;

    // --- INÍCIO DA MODIFICAÇÃO PARA ANIMAÇÃO ---

    // 1. Remove a classe de animação para poder adicioná-la novamente
    elementoNomeGerado.classList.remove("reveal");

    // 2. Força o navegador a "repintar" o elemento. É um truque necessário
    // para que a animação possa ser reiniciada no mesmo elemento.
    void elementoNomeGerado.offsetWidth;

    // 3. Atualiza o texto e adiciona a classe para animar
    elementoNomeGerado.textContent = nomeFinal;
    elementoNomeGerado.classList.add("reveal");

    // --- FIM DA MODIFICAÇÃO ---
  }

  botaoGerar.addEventListener("click", gerarNome);
});
