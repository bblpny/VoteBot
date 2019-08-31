

module.exports = Structure=>{

    class Prompts {
        static Vote = require('./vote.js')(Structure);
        static CastVote = require('./cast.js')(Structure);
        static Nominate = require('./nominate.js')(Structure);
    };


    return Prompts;
}
