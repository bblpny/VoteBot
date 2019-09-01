

module.exports = Structure=>{

    class Prompts {
        static MultipleChoice = require('./multiplechoice.js')(Structure);
        static CastVote = require('./castvote.js')(Structure);
        static UserEntry = require('./userentry.js')(Structure);


        static Vote = Prompts.MultipleChoice;
        static Nominate = require('./nominate.js')(Structure,Prompts);
    };


    return Prompts;
}
