
module.exports = Discord=>{



    class Structure {
        static Runtime = require('./types/runtime.js')(Discord,Structure);
        static Situation = require('./types/situation.js')(Structure);
        static Channel = require('./types/channel.js')(Structure);
        static Guild = require('./types/guild.js')(Structure);
        static Prompt = require('./types/prompt.js')(Structure);

        static Prompts = require('./prompt/index.js')(Structure);
    };


    
    return Structure;
}
