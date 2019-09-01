
const command_info = {
    title:'Make Vote',
    desc:'Use this to initate a voting direct message.',
    ex:'!yes USER_ID',
  
    poll:content=>{
        return false;
    }
};


module.exports = Structure=>{
    class UserVote extends Structure.Prompt {
        
        user;

        static get command(){ return command_info; }

        constructor(situation,scope){
            super(situation,scope);

            this.text = Structure.getAvatarURL(scope.user) + ' \n\n***Vote for '+scope.user+'***\n'+
            '**Y** for yes\n'+
            '**N** for no\n'+
            '**P** for potato';

            this.user = scope.user;
        }

        inner_read(message){
            const vote = message.content;

            if(vote.length == 1){
                if(vote == 'Y' || vote == 'y'){
                    return true;
                }else if(vote == 'N' || vote == 'n'){
                    return true;
                }else if(vote == 'P' || vote == 'p'){
                    return true;
                }
            }
            return false;
        }
        read(message){
            const r = this.inner_read(message);

            if(r){
            message.author.send('Thank you for voting.');
            this.situation.set_prompt(null, message);
            }else{
            message.author.send(this.text);
            }

            return r;
        }
    }

    return UserVote;
}
