import { Component } from 'react';
import "../../App.css"
import CardList from './cardList';

// import mummy from "../pics/runesTest1/2red.png";
// import kinstone from "../pics/runesTest1/1red.png";

export default class CardPage extends Component {
  constructor(props) {
    super(props);
      this.state={
        obj: undefined
      }

  }
  async componentDidMount(){
    let app = {...this.props.app};
    let state = app.state;
    let componentList = state.componentList;
    let component = componentList.getComponent("card");

    await this.props.app.dispatch({
      linkTouched:false,
      currentCard:component,
      linkChange: "Cards",
        changeActiveLink: true,
        showRoutine:false,
        showPerson:false,
        showCard:false,
        showPersonRoutine:false,
    })

    
  }

  
  

  render() {
    let app = {...this.props.app};
    let dispatch = app.dispatch;
    let state = app.state;
    let componentList = state.componentList;
    let styles =state.styles;
    let opps = state.opps
    let center = window.innerWidth<1200? {
      display: "flex",
      flexDirection:"column",
      justifyContent:"center",
      alignItems:"center"
    }: undefined


    return (
      <div style={{...center, width:"100vw", height:"100vh", display:"flex", flexDirection:"row"}} >
        
        <CardList app={app} type="cardWithTab" options={{tabType:"colorTabWhite"}}/>
      </div>
    )

  }
}
