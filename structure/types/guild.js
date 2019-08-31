

module.exports = Structure=>{
  class Guild {
    runtime;
    id;
    channels;

    constructor(runtime, id){
      this.runtime = runtime;
      this.id = id;
      this.channels = {};
      console.log('made guild:'+this);
    }

    find_channel(channel_id){
      return this.channels[channel_id] || null;
    }

    summon_channel(channel_id){
      let found = this.find_channel(channel_id);

      if (found == null){
        found = new Structure.Channel(this, channel_id);
        this.channels[channel_id] = found;
      }

      return found;
    }
    destroy(){

      this.channels.slice(0).forEach(
        (value,index,array)=>{
          if(value)value.destroy();
        });

      if(this.runtime &&
          this == this.runtime.find_guild(this.id)
        ){
          let place = this.runtime.guilds;
          delete place[this.id];
      }
    }
  }
  return Guild;
}