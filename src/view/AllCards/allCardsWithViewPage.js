import { Component } from 'react';
import "../../App.css"
import AllCardsList from './AllCardsList';
import ViewCard from './ViewCard';
import CardListInRoutine from '../routine/cardListInRoutine';

// import mummy from "../pics/runesTest1/2red.png";
// import kinstone from "../pics/runesTest1/1red.png";

export default class AllCardsWithView extends Component {
  constructor(props) {
    super(props);
      this.state={
        obj: undefined
      }

  }

  componentDidMount(){
    debugger
    let app = this.props.app;
    let state = app.state;
    let componentList = state.componentList; 
    let URL = window.location.href;
    let id = URL.split('/')[ URL.split('/').length-1];
    let card =  componentList.getComponent("card", id, "_id") 
    if(card===undefined){
      card =  componentList.getComponent("assignedCard", id, "_id")
    }
    if(card ===undefined){
      
      card = componentList.getComponent("coachCard", id, "_id")
      if(card !== undefined){
        app.dispatch({showCoachCards:true})
      }
    }
    app.dispatch({currentCard:card, showCard:true, 
      })
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
      <div  >
        {state.currentCard!==undefined&&(<>
        {window.innerWidth>state.phoneUIChange?(<>
        <div style={{...center, width:"100vw", height:"87.5vh", display:"flex", flexDirection:"row", justifyContent: "space-evenly", marginLeft: "-15vw"}}>
        <AllCardsList app={app} type="cardWithTab" options={{tabType:"colorTabWhite", cardType:"tallCard"}}/>
        
        <ViewCard app={app} style={{}} type="cardWithTab" options={{tabType:"colorTabWhite",  cardType:"biggestCard"}}/>
        </div>
        </>):(<>
        {state.showCard?(<ViewCard app={app} type="cardWithTab" options={{tabType:"colorTabWhite",  cardType:"biggerCard"}}/>):( <AllCardsList app={app} type="cardWithTab" options={{tabType:"colorTabWhite", cardType:"tallCard"}}/>)}</>)}
        </>)}
      </div>
    )

  }
}
