const Discord =  require('discord.js');
const CuddleBotFactory = require('./structure/index.js');
const CuddleBot = CuddleBotFactory(Discord);



console.log(
  (new CuddleBot.Runtime())
  .client.login(
    'NjE2MDk4OTcyNzkyMTI3NjE4.XWia6g.oPIrAHSbOj3pTxm1SEoh_6Plprk'
    )
    );
