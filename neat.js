const Neat    = neataptic.Neat;
const Methods = neataptic.methods;
const Config  = neataptic.config;
const Architect = neataptic.architect;

/** Turn off warnings */
Config.warnings = false;

// GA settings
const PLAYER_AMOUNT     = 50;
const ITERATIONS        = 1000;
const START_HIDDEN_SIZE = 1;
const MUTATION_RATE     = 0.3;
const ELITISM_PERCENT   = 0.1;
const INPUTNODES        = 3;
const OUTPUTNODES       = 1;


// Trained population
const USE_TRAINED_POP = true;

// Global vars
let neat;

/** varruct the genetic algorithm */
function initNeat(){
  neat = new Neat(
    INPUTNODES,
    OUTPUTNODES,
    null,
    {
      mutation: [
        Methods.mutation.ADD_NODE,
        Methods.mutation.SUB_NODE,
        Methods.mutation.ADD_CONN,
        Methods.mutation.SUB_CONN,
        Methods.mutation.MOD_WEIGHT,
        Methods.mutation.MOD_BIAS,
        Methods.mutation.MOD_ACTIVATION,
        Methods.mutation.ADD_GATE,
        Methods.mutation.SUB_GATE,
        Methods.mutation.ADD_SELF_CONN,
        Methods.mutation.SUB_SELF_CONN,
        Methods.mutation.ADD_BACK_CONN,
        Methods.mutation.SUB_BACK_CONN
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
          ,
        }
      )
    }
  );

  if(USE_TRAINED_POP){
    neat.population = population;
  }
}

/** Start the evaluation of the current generation */
function startEvaluation(){
  players = [];

  for(let genome in neat.population){
    genome = neat.population[genome];
    players.push(new Player(genome));
  }
}

/** End the evaluation of the current generation */
function endEvaluation(){
  console.log('Generation:', neat.generation, '- average score:', neat.getAverage());

  neat.sort();
  let newPopulation = [];

  // Elitism
  for(let i = 0; i < neat.elitism; i++){
    newPopulation.push(neat.population[i]);
  }

  // Breed the next individuals
  for(let i = 0; i < neat.popsize - neat.elitism; i++){
    newPopulation.push(neat.getOffspring());
  }

  // Replace the old population with the new population
  neat.population = newPopulation;
  neat.mutate();

  neat.generation++;
}
