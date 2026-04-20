// Array vuoto che verrà popolato dal server
let questions = []; 
let step = 0;
let questionNumber = 0;
let punteggio = 0;

window.addEventListener("load", () => {
    const quiz = document.querySelector("#quiz-screen");
    quiz.classList.add("hidden");
    const results = document.querySelector("#result-screen");
    results.classList.add("hidden");
    const startButton = document.querySelector("#start-btn");
    const start = document.querySelector("#start-screen");
    
    startButton.addEventListener("click", async () => {
        // Mostra il caricamento mentre fetchiamo le domande dal server
        startButton.disabled = true;
        startButton.innerText = "Caricamento...";
        
        try {
            // Chiamata all'endpoint del tuo server cndb
            const response = await fetch('http://localhost:3000/jokes');
            if (!response.ok) throw new Error("Errore di rete");
            
            questions = await response.json();
            
            start.classList.add("hidden");
            quiz.classList.remove("hidden");
            loadQuestion();
            step++;
        } catch (error) {
            console.error("Errore nel recupero delle domande:", error);
            alert("Impossibile connettersi al server. Assicurati che server.js sia in esecuzione sulla porta 3000.");
            startButton.disabled = false;
            startButton.innerText = "Inizia Quiz";
        }
    });
});

function loadQuestion(){
  // Caricare la domanda attuale
  const question = questions[questionNumber];
  
  let number = document.querySelector("#number");
  number.innerText = `Domanda ${questionNumber + 1} di ${questions.length}`;
  
  let q = document.querySelector("#question");
  q.innerText = question.question;
  
  let choices = document.querySelector("#choices");
  // Pulisce le scelte precedenti
  while(choices.firstChild) {
    choices.removeChild(choices.firstChild);
  }
  
  let opt_list = document.createElement("ul");
  
  // Il server invia le risposte unite da "$", quindi le dividiamo per ottenere un array
  const answersList = question.answers.split('$');
  
  answersList.forEach((e, index) => {
    let c = document.createElement("li");
    // Assegnamo come value l'indice + 1 per farlo corrispondere a question.ans (1-4)
    c.innerHTML = `<input type="radio" name="q${questionNumber}" value="${index + 1}"> ${e}`;
    opt_list.appendChild(c);
  });
  choices.appendChild(opt_list);
  
  let next = document.querySelector("#next");
  // Pulisce il bottone "prossima"
  while(next.firstChild) {
    next.removeChild(next.firstChild);
  }
  
  let btn = document.createElement("button");
  btn.innerText = "Prossima domanda";
  btn.addEventListener("click", () => {
    // Recuperare la risposta selezionata
    let selected = document.querySelector(`input[name="q${questionNumber}"]:checked`);
    
    if (selected) {
      // Confrontiamo il valore selezionato con il numero che indica la risposta corretta (ans)
      if (parseInt(selected.value) === question.ans) {
        punteggio++;
      }
      
      if (questionNumber === questions.length - 1) {
        mostraRisultati();
      } else {
        questionNumber++;
        loadQuestion();
      }
    } else {
      alert("Non hai risposto");
    }
  });
  next.appendChild(btn);
}

function mostraRisultati(){
  const quiz = document.querySelector("#quiz-screen");
  quiz.classList.add("hidden");
  const score = document.querySelector("#score");
  score.innerText = `Punteggio conseguito: ${punteggio}`;
  const results = document.querySelector("#result-screen");
  results.classList.remove("hidden");
  const restart = document.querySelector("#restart-btn");
  restart.addEventListener('click', () => {
    window.location.reload();
  });
}