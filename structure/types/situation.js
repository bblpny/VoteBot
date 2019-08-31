
module.exports = Structure=>{
  class Situation {
    channel;
    req;
    prompt = null;
    registered = false;

    constructor(channel, req){
      this.channel = channel;
      this.req = req;
      this.prompt = null;
      this.registered = false;
      console.log('made situation:'+this);
    }

    register(){
      if((!this.registered)){
        if(this.channel){

          if(this.channel.guild){

            if(this.channel.guild.runtime){

              this.runtime.situations[this.member_id] = this;
              this.channel.situations[this.author_id] = this;
              this.runtime.private_situations[this.author_id] = this;

              this.registered= true;
              console.log('did register situation');

            }else{
                console.log('no runtime');
            }
          }else{
              console.log('no guild');
          }
        }else{
          console.log('no channel');
        }
      }
    }
    get alive(){ return this.req && this.channel &&
      this === this.channel.find_situation(this.author_id);
    }
    do_destroy(){
      let place = this.channel.situations;
      delete place[this.author_id];
      place = this.channel.runtime;

      if( place ){
        place = place.situations;
        delete place[this.member_id];

        place = this.channel.runtime.private_situations;
        delete place[this.author_id];
      }

      this.channel = null;
    }
    destroy(){
      if(this.alive){
        this.do_destroy();
      }
    }

    get guild(){
      return (this.channel && this.channel.guild) || null;
    }

    get runtime(){
      return (this.channel &&
        this.channel.guild && this.channel.guild.runtime) || null;
    }

    get author() {
      return (this.req && this.req.author) || null;
    }

    get author_id() {
      return (this.req && this.req.author && this.req.author.id) || "";
    }

    get member() {
      return (this.req && this.req.member) || null;
    }

    get member_id() {
      return (this.req && this.req.member)
    }

    set_prompt(scope,req){
      if(scope){
        const new_prompt = new scope.prompt(
          this, scope
        );

        new_prompt.back = this.prompt;

        const that = this;

        new_prompt.init();

        return this.req.author
          .send(new_prompt.text)
          .then((sent)=>{
            that.register();
            that.prompt = new_prompt;
            console.log('set prompt:'+that);
            that.prompt.bind();
            that.req.author.send('<:alone_potato:614729321197862942>');
          });
      }else if(this.alive){
        const p = this.req.author.send(
          ' type ``!vote`` **in the channel** for another action. <:out_of_order:614729574026182685>'
          );

        this.do_destroy();
        return p;
      }
    }
  }
  return Situation;
}