
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
  };

module.exports = (Structure,Prompts)=>{

    class Nominate extends Prompts.UserEntry {
        allow_members = false;
        check_vote_duplicates = true;

        ok(res){
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
                Structure.getAvatarURL(this.user_found) + '\n\n' +
                this.user_found + '('+this.user_found.tag+') has been nominated by ' +
                this.situation.author);

            this.situation.set_prompt(null, res);
        }
    }

    return Nominate;
}