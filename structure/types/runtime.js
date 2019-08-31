

module.exports = (Discord,Structure)=>{
  class Runtime {
    client;
    guilds;
    channels;
    situations;
    private_situations;
  
    constructor(){
      const that = this;
      this.situations = {};
      this.private_situations = {};
      this.guilds = {};
      this.channels = {};
  
      this.client = new Discord.Client();

      this.client.on('ready', ()=>{that.on_ready(this);});
      this.client.on('error', err=>{that.on_err(err,this);});
      this.client.on('message', message=>{that.on_message(message,this);});
      this.client.on('messageReactionAdd', messageReaction=>{
        that.on_messageReaction(messageReaction,this);
      });
      console.log('made runtime:'+this);
    }
    on_err(err){
      console.log('err:'+err);
    }
    on_ready(context){
        console.log('Client logged in:' + this.client.user.tag);
    }
  
    recall(author){
      return this.situations[author.id] || null;
    }
  
    find_channel(channel_id){
      return this.channels[channel_id] || null;
    }
  
    find_guild(guild_id){
      return this.guilds[guild_id] || null;
    }
  
    summon_guild(guild_id){
      let found = this.find_guild(guild_id);
  
      if (found == null){
        found = new Structure.Guild(this, guild_id);
        this.guilds[guild_id] = found;
      }
  
      return found;
    }
  
    start_situation(message, initialize){
      let found = this.private_situations[message.author.id];
  
      if (found){
        if(found.channel_id != message.channel.id){
          found.destroy();
          found=null;
        }
      }
      if(!found){
        const guild = this.summon_guild(message.channel.guild.id);
  
        if(guild){
          const channel = guild.summon_channel(message.channel.id);
          if(channel){
            found = initialize(channel, message) || null;
          }
        }
      }
  
      return found;
    }
  
    get_state(message, initialize){
  
      if(message){
        const author = message.author;
        if(author){
          //console.log(author.bot);
          if(!author.bot){
            const channel_type = message.channel.type;
            if('dm' == channel_type){
              //console.log(this.private_situations);
              return this.private_situations[
                author.id
              ] || null;
  
            }else if('text' == channel_type){
              if('!vote' == message.content){
                message.delete();
                return this.start_situation(message, initialize);
              }
            }
          }
        }else{
          //console.log('no author');
        }
      }
    }
  
    on_message(res, context){
  
      const state = this.get_state(res,
        function(channel, dup_res){
          const situation = new Structure.Situation(channel, dup_res);
          situation.set_prompt({
            prompt:Structure.Prompts.Vote,
            menu:channel.votes
          });
          return situation;
        });
  
      if(state){
        if(state.registered){
          const run_prompt = state.prompt;
  
          if(run_prompt){
  
            if(res.content == 'BACK'){
              if(!run_prompt.back){
                state.destroy();
                res.author.send('Buhbye');
              }else{
                state.prompt = run_prompt.back;
                res.author.send('NAVIGATED BACKWARD!!!! CHEATS\n'+state.prompt.text);
              }
            }else{
              //console.log('running prompt');
              const rv=run_prompt.read(res);
              //console.log('prompt returned:'+rv);
            }
          }else{
            //console.log('no prompt');
          }
        }else{
          //console.log('unregistered state');
        }
      }else{
        //console.log('found no state:' + res);
      }
    }
  
    on_messageReaction(res, context){
  
    }
  }
  return Runtime;
}