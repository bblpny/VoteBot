

module.exports = Structure=>{

    class Prompt {
        text ="";
        situation = null;
        back = null;
        ahead = null;
        bound = false;

        constructor(situation, scope){
            this.situation = situation;
            this.scope = scope;
            this.bound = false;
        }

        // init is invoked when the text of this prompt has been sent.
        init(){

        }
        
        // bind is invoked after the user received the text.
        bind(){
            
            if(this.back && !(this.back.ahead === this)){

                if(this.back.ahead){
                    // do something to some other prompt?
                }

                this.back.ahead = this;
            }

            if(this.ahead && (!(this.ahead === this))){

                // do something?
                this.ahead = null;
            }

            this.situation.prompt = this;
        }

        // invoked when the data of text or whatever.. next refreshing
        // if reset is true. then reset saved values.
        refresh(reset){
            
        }

        // read is called with every message that is sent by the user.
        read(res){
            return true;
        }

        get author() {
            return (this.situation && this.situation.author) || null;
        }

        get member() {
            return (this.situation && this.situation.member) || null;
        }

        get channel() {
            return (this.situation && this.situation.channel) || null;
        }

        get guild() {
            return (this.situation && this.situation.guild) || null;
        }

        get runtime() {
            return (this.situation && this.situation.runtime) || null;
        }
    }

    return Prompt;
}