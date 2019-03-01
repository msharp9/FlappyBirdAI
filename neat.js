const Neat    = neataptic.Neat;
const Methods = neataptic.methods;
const Config  = neataptic.config;
const Architect = neataptic.architect;

/** Turn off warnings */
Config.warnings = false;

// GA settings
const PLAYER_AMOUNT     = 1000;
const ITERATIONS        = 1000;
const START_HIDDEN_SIZE = 1;
const MUTATION_RATE     = 0.6;
const ELITISM_PERCENT   = 0.1;
const INPUTNODES        = 4;
const OUTPUTNODES       = 1;


// Trained population
const USE_TRAINED_POP = true;

// Global vars
let neat;

// Methods.mutation.MOD_ACTIVATION.allowed = [
//   Methods.activation.TANH,
//   Methods.activation.BIPOLAR,
// ];

/** varruct the genetic algorithm */
function initNeat(){
  neat = new Neat(
    INPUTNODES,
    OUTPUTNODES,
    null,
    {
      mutation: [
        Methods.mutation.ADD_NODE,
        Methods.mutation.ADD_NODE,
        Methods.mutation.SUB_NODE,
        Methods.mutation.ADD_CONN,
        Methods.mutation.ADD_CONN,
        Methods.mutation.ADD_CONN,
        Methods.mutation.ADD_CONN,
        Methods.mutation.ADD_CONN,
        Methods.mutation.SUB_CONN,
        Methods.mutation.MOD_WEIGHT,
        Methods.mutation.MOD_WEIGHT,
        Methods.mutation.MOD_WEIGHT,
        Methods.mutation.MOD_WEIGHT,
        Methods.mutation.MOD_WEIGHT,
        Methods.mutation.MOD_WEIGHT,
        Methods.mutation.MOD_WEIGHT,
        Methods.mutation.MOD_WEIGHT,
        Methods.mutation.MOD_WEIGHT,
        Methods.mutation.MOD_WEIGHT,
        Methods.mutation.MOD_WEIGHT,
        Methods.mutation.MOD_WEIGHT,
        Methods.mutation.MOD_WEIGHT,
        Methods.mutation.MOD_BIAS,
        Methods.mutation.MOD_BIAS,
        Methods.mutation.MOD_ACTIVATION,
        Methods.mutation.ADD_GATE,
        Methods.mutation.ADD_GATE,
        Methods.mutation.ADD_GATE,
        Methods.mutation.SUB_GATE,
      ],
      popsize: PLAYER_AMOUNT,
      mutationRate: MUTATION_RATE,
      elitism: Math.round(ELITISM_PERCENT * PLAYER_AMOUNT),
      network: new Architect.Random(
        INPUTNODES,
        START_HIDDEN_SIZE,
        OUTPUTNODES,
        {
          dropout: 0.5
        }
      )
    }
  );

  if(USE_TRAINED_POP){
    neat.population = population;
  }

  // Draw the first genome
  let best = document.getElementById('best');
  let bBox = best.getBBox();
  drawGraph(neat.population[0].graph(bBox.width, bBox.height), '.best');
}

/** Start the evaluation of the current generation */
function startEvaluation(){
  players = [];

  for(let genome in neat.population){
    genome = neat.population[genome];
    players.push(new Player(genome));
  }
}

function calcFitness(genome) {
  // console.log(genome.score/100, genome.pipes*genome.pipes, genome.nodes.length)
  return genome.score/100 + genome.pipes*genome.pipes - genome.nodes.length/5;
}

/** End the evaluation of the current generation */
function endEvaluation(){
  for(let genome in neat.population){
    genome = neat.population[genome];
    genome.score = calcFitness(genome);
  }
  console.log('Generation:', neat.generation, '- average score:', neat.getAverage());

  neat.sort();

  // Draw the best genome
  let best = document.getElementById('best');
  let bBox = best.getBBox();
  drawGraph(neat.population[0].graph(bBox.width, bBox.height), '.best');

  let newPopulation = [];

  // Elitism
  let elitists = [];
  for (let i = 0; i < neat.elitism; i++) {
    elitists.push(neat.population[i]);
  }

  // Breed the next individuals
  for(let i = 0; i < neat.popsize - neat.elitism; i++){
    newPopulation.push(neat.getOffspring());
  }

  // Replace the old population with the new population
  neat.population = newPopulation;
  neat.mutate();

  neat.population.push(...elitists);

  neat.generation++;

  // Reset the scores
  for (i = 0; i < neat.population.length; i++) {
    neat.population[i].score = undefined;
  }
}
