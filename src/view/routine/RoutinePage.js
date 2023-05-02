import { Component } from 'react';
import "../../App.css"
import PeopleList from '../people/peopleList';
import Routine from './routineList';
import ViewRoutine from './viewRoutine';

// import mummy from "../pics/runesTest1/2red.png";
// import kinstone from "../pics/runesTest1/1red.png";

export default class RoutinePage extends Component {
  constructor(props) {
    super(props);
      this.state={
        obj: undefined
      }

  }
  componentDidMount(){
    let app = {...this.props.app};
    let state = app.state;
    let componentList = state.componentList;
    let component = componentList.getComponent("card");

     this.props.app.dispatch({
      currentCard:component,
      linkChange: "Routines",
        changeActiveLink: true,
        showRoutine:false,
        showPerson:false,
        showCard:false,
        showPersonRoutine:false
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
      <div style={{...center, width:"100vw", height:"100vh", display:"flex", flexDirection:"row", justifyContent:"space-around"}} >
        {window.innerWidth>state.phoneUIChange?(<>
        <Routine app={app} type="cardWithTab" options={{tabType:"colorTabWhite", cardType:"tallCard"}}/>
        
        <ViewRoutine app={app} type="cardWithTab" options={{tabType:"colorTabWhite",  cardType:"biggerCard"}}/>
        </>):(<>
        {state.showRoutine?(<ViewRoutine app={app} type="cardWithTab" options={{tabType:"colorTabWhite",  cardType:"biggerCard"}}/>):(
        <Routine app={app} type="cardWithTab" options={{tabType:"colorTabWhite", cardType:"tallCard"}}/>)}
        </>)}
      </div>
    )

  }
}
