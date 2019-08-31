

module.exports = Structure=>{
    class Channel {
        guild;
        id;
        situations;
        votes;

        constructor(guild, id){
            this.guild = guild;
            this.id = id;
            this.situations = {};
            const that = this;

            this.votes= [{
                text:'Nominate',
                action:{
                    prompt:Structure.Prompts.Nominate
                }
            }];

            console.log('made channel:'+this);
        }

        nominate(state,res){
        }
        get runtime() {
            return (this.guild && this.guild.runtime)||null;
        }

        find_situation(author){
            return this.situations[author] || null;
        }

        destroy(){

            this.situations.slice(0).forEach(
            (value,index,array)=>{
                if(value)value.destroy();
            });

            if(this.guild &&
                this == this.guild.find_channel(this.id)
            ){
                let place = this.guild.channels;
                delete place[this.id];
            }
        }
        
        
    }
    return Channel;
}