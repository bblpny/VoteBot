
module.exports = Structure=>{

    class UserEntry extends Structure.Prompt {

        user_found = null;
        allow_members = false;
        check_vote_duplicates = false;
    
        constructor(situation,scope){
            super(situation,scope);
            
            this.allow_members = 
                (scope.allow_members || this.allow_members) && true;

            this.check_vote_duplicates = 
                (scope.check_vote_duplicates || this.check_vote_duplicates) && true;

            this.text =
                '***Enter a discord user id name\n'+
                '> *Example*: ``'+this.author.id+'``';

        }

        check_user_is_valid(){

            const user = this.user_found;

            if(user){
                let indices=[];

                if(this.check_vote_duplicates){
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
                }
                
                if(!this.allow_members){
                    this.situation.req.guild.members.array().forEach(
                        (value,index,array)=>{
                            if(value.user && value.user.id == user.id){
                                indices.push(index);
                            }
                        });
                    if(indices.length){
                        return 'USER_EXISTS';
                    }
                }
                

                return null;
            }else{
                return 'NO_VALUE';
            }
        }

        ok(res){

        }
    
        read(res){
            const content = res.content;
            if( (content.length == 2) &&
                (content.toLowerCase() == 'ok')){
                if(this.user_found){
                    const err_code = this.check_user_is_valid();
                    if(null == err_code){
    
                
                        return this.ok(res);
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

                    if(null != error_code ){
                        that.user_found = restore_user;
                    }

                    state.req.author.send(
                        Structure.createRichEmbed()
                        .setColor('#0099ff')
                        .setTitle('Found '+found.tag)
                        .setThumbnail(Structure.getAvatarURL(found))
                        .setDescription('' + found + ' ' + 
                            ((error_code && ('cannot be selected! Enter another user.'))||'successfully.')
                            )
                        .setFooter(error_code || 'type OK to confirm or enter another user id.')
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
    return UserEntry;
}