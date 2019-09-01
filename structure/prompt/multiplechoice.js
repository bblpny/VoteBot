
const command_info = {
  title:'Private Vote',
  desc:'Use this to initate a voting direct message.',
  ex:'!vote',
  poll:content=>{return '!vote' == content;}
}

function options_str(menu_array){
  let o = '';
  let n = 1;

  for (let i = menu_array.length - 1; i >= 0; i=i-1){
      o = o + '**``'+n.toString() + '``)**\t' + menu_array[i].text + '\n';
      n = n + 1;
  }

  return o;
}


module.exports=Structure=>{

  class VoteMenu extends Structure.Prompt {
    
    static get command(){ return command_info; }
    
    menu=[];
    menu_source=[];
    selection=-1;

    constructor(situation,scope){
      super(situation,scope);
      this.menu_source = scope.menu||this.menu_source;
    }

    reset_menu(){
      const menu_inst=this.menu;
      this.menu_source.forEach(
        (value,index,source)=>{
          
          if(index<menu_inst.length){
            do{
              menu_inst.push(null);
            }while(index<this.length);
          }else if(index<this.length){
            menu_inst[index]=value;
            return;
          }
          menu_inst.push(value);
        },this.menu
      );

      this.text = 
        '*Dear* ' + this.user +
        ",\n\t***Please*** **make a selection**:\n\n"+
        options_str(this.menu);

      this.selection = -1;
    }

    init(){
      super.init();
      this.reset_menu();
    }

    refresh(reset){
      if(reset){
        this.reset_menu();
      }
    }
    
    read(res){
      let int_value = 0;

      try{
        int_value = parseInt(res.content);
      }catch(e){
        console.log(e);
        return false;
      }

      if(int_value > 0 && int_value <= this.menu.length){
        this.situation.set_prompt(
          this.menu[this.menu.length - int_value].action,
          res
        );
        return true;
      }
      return false;
    }
  }

  return VoteMenu;
}