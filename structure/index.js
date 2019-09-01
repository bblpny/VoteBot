
const size_str = 'size=';


module.exports = Discord=>{



    class Structure {
        
        static createAttachment(args){
            return new Discord.Attachment(args);
        }

        static createRichEmbed(args){
            return new Discord.RichEmbed(args);
        }

        static getAvatarURL(user, size){
            const input_url = user.avatarURL || user.defaultAvatarURL;


            if(input_url && size){
                const size_key = input_url.lastIndexOf(size_str);
                const value_key = size_key + size_str.length;
                
                if(size_key && size_key > 0 && 
                    (value_key <= input_url.length)){

                    const end_key_value = 
                        ((value_key < input_url.length) &&
                            input_url.indexOf(
                                '&', value_key));

                    if(end_key_value > value_key){
                        return input_url.substr(0, value_key) +
                            size.toString() +
                            input_url.substr(end-key_value);
                    }else{
                        return input_url.substr(0, value_key) +
                            size.toString();
                    }
                }
            }
            return input_url;
        }

        static Runtime = require('./types/runtime.js')(Discord,Structure);
        static Situation = require('./types/situation.js')(Structure);
        static Channel = require('./types/channel.js')(Structure);
        static Guild = require('./types/guild.js')(Structure);
        static Prompt = require('./types/prompt.js')(Structure);

        static Prompts = require('./prompt/index.js')(Structure);
    };


    
    return Structure;
}
