import { Component } from 'react';
import "../../App.css"
import PeopleList from './peopleList';
import ViewPerson from './viewPerson';

// import mummy from "../pics/runesTest1/2red.png";
// import kinstone from "../pics/runesTest1/1red.png";

export default class PeoplePage extends Component {
  constructor(props) {
    super(props);
      this.state={
        obj: undefined
      }

  }
  componentDidMount(){
    this.props.app.dispatch({
      
      linkChange: "people",
        changeActiveLink: true,
        showPerson:false,
        showRoutine:false,
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
    let center = window.innerWidth<1000? {
      display: "flex",
      flexDirection:"column",
      justifyContent:"center",
      alignItems:"center"
    }: undefined

    return (
      <div style={{...center, width:"100vw", height:"100vh", display:"flex", flexDirection:"row", justifyContent:"space-around"}} >
        {window.innerWidth>state.phoneUIChange?(<>
        <PeopleList app={app} type="cardWithTab" options={{tabType:"colorTabWhite", cardType:"tallCard"}}/>
        
        <ViewPerson app={app} type="cardWithTab" options={{tabType:"colorTabWhite",  cardType:"biggerCard"}}/>

        </>):(<>
        {state.showPerson?(<ViewPerson app={app} type="cardWithTab" options={{tabType:"colorTabWhite",  cardType:"biggerCard"}}/>):(
          <PeopleList app={app} type="cardWithTab" options={{tabType:"colorTabWhite", cardType:"tallCard"}}/>
        )}
        </>)}
      </div>
    )

  }
}
