import { Component } from 'react';
import "../../App.css"
import CardListInRoutine from './cardListInRoutine';
import ViewCard from '../AllCards/ViewCard';
// import mummy from "../pics/runesTest1/2red.png";
// import kinstone from "../pics/runesTest1/1red.png";

export default class CardsInRoutinePage extends Component {
  constructor(props) {
    super(props);
      this.state={
        obj: undefined,
        start:false
      }

  }

  componentDidMount(){
    let app = this.props.app;
    let state = app.state;
    let componentList = state.componentList; 
    let URL = window.location.href;
    let id = URL.split('/')[ URL.split('/').length-1];
    let routine= componentList.getComponent("assignedRoutine", id, "_id")
    let card =  componentList.getComponent("assignedCard", id, "routineID")
  app.dispatch({currentCard:card?card: "There are no Cards in this Routine", currentRoutine:routine, linkTouched:true})
  this.setState({start:true})
  }
  async componentDidUpdate(){
    if(this.props.app.state.reloadRoutine){
      await this.setState({start:false});
      await this.props.app.dispatch({reloadRoutine:false});
      this.componentDidMount();
    }
  }
  
  

  render() {
    let app = {...this.props.app};
    let dispatch = app.dispatch;
    let state = app.state;
    let componentList = state.componentList;
    let styles =state.styles;
    let opps = state.opps
    let center = window.innerWidth<state.phoneUIChange? {
      display: "flex",
      flexDirection:"column",
      justifyContent:"center",
      alignItems:"center"
    }: undefined


    return (
      <div style={{...center, width:"100vw", height:"100vh", display:"flex", flexDirection:"row", justifyContent:"space-around"}} >
        {(state.currentCard!==undefined && this.state.start)&&(<>
        { window.innerWidth>state.phoneUIChange?(<>
        
          <CardListInRoutine app={app} type="cardWithTab" options={{tabType:"colorTabWhite", cardType:"tallCard"}}/>
        
        <ViewCard app={app} type="cardWithTab" options={{tabType:"colorTabWhite",  cardType:"biggerCard"}}/></>):(<>
        {state.showPersonRoutine?(<ViewCard app={app} type="cardWithTab" options={{tabType:"colorTabWhite",  cardType:"biggerCard"}}/>):(
        <CardListInRoutine app={app} type="cardWithTab" options={{tabType:"colorTabWhite", cardType:"tallCard"}}/>
)}
        </>)}
        
        </>)}
      </div>
    )

  }
}
