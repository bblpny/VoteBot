
const command_info = {
  title:'Vote Nominate',
  desc:'Use this to initate a voting direct message.',
  ex:'!nominate USER_ID',

  poll:content=>{

    as_split = content.split(' ',3);

    return 
        as_split.length == 2 && 
        as_split[0] == '!nominate ';
  }
}

function get_avatar_url(user){
    return user.avatarURL || user.defaultAvatarURL;
}


module.exports = Structure=>{

    class NominateMenu extends Structure.Prompt {

        static get command(){ return command_info; }

        user_found = null;
    
        constructor(situation,scope){
            super(situation,scope);

            this.text = 
                '***Enter a discord user id name\n'+
                '> *Example*: ``'+this.author.id+'``';

        }

        check_user_is_valid(){

            const user = this.user_found;

            if(user){
                let indices=[];

                this.channel.votes.forEach(
                    (value,index,array) =>{
                        //console.log(value);
                        if(value.action.user){
                            if(value.action.user.id == user.id){
                                indices.push(index);
                            }
                        }
                    });

                if(indices.length){
                    return 'VOTE_EXISTS';
                }
                
                this.situation.req.guild.members.array().forEach(
                    (value,index,array)=>{
                        if(value.user && value.user.id == user.id){
                            indices.push(index);
                        }
                    });
                
                if(indices.length){
                    return 'USER_EXISTS';
                }

                return null;
            }else{
                return 'NO_VALUE';
            }
        }
    
        read(res){
            const content = res.content;
            if( (content.length == 2) &&
                (content.toLowerCase() == 'ok')){
                if(this.user_found){
                    const err_code = this.check_user_is_valid();
                    if(null == err_code){
    
                        this.situation.channel.votes.push(
                            {
                            text: '*Vote on:* ' + this.user_found,
                            action: {
                                prompt:Structure.Prompts.CastVote,
                                user:this.user_found
                            }
                            }
                        );

                        res.author.send('Success!');
                
                        this.situation.req.channel.send(
                            get_avatar_url(this.user_found) + '\n\n' +
                            this.user_found + '('+this.user_found.tag+') has been nominated by ' +
                            this.situation.author);

                        this.situation.set_prompt(null, res);
                
                        return true;
                    }else{
                        res.author.send('Cannot vote on that user:' + err_code);
                        this.user_found = null;
                    }
                }else{
                    res.author.send(this.text);
                }
                return false;
            }
            
            const state = this.situation;
            try{
                const that = this;
                state.runtime.client.fetchUser(res.content,false)
                .then(found =>{
                    const restore_user = that.user_found;
                    that.user_found = found;
                    
                    let error_code = that.check_user_is_valid();

                    if(null == error_code ){
                        error_code = "\ntype **OK** to submit nomination OR type another user.";
                    }else{
                        that.user_found = restore_user;
                    }

                    state.req.author.send(
                        get_avatar_url(found) + 
                        '\n\nFound user:' +
                        found + '('+found.tag+')'+
                        error_code
                    );
                })
                .catch(err=>{
                    state.req.author.send('Try again.' +err);
                });
                return true;
            }catch(e){
                console.log(e);
                return false;
            }
        }
    }
    return NominateMenu;
}