import React, { Component } from 'react';
import "../../App.css"
import MapComponent from '../../componentListNPM/mapTech/mapComponent';
import ParentFormComponent from '../../componentListNPM/componentForms/parentFormComponent';
import FormWithUpdateAndRun from '../../componentListNPM/componentForms/buttons/formWithUpdateAndRun';
import formThemeFactory from '../../componentListNPM/componentForms/formThemes/formThemeFactory';
import MapSortUpDown from '../../componentListNPM/mapTech/MapSortUpDown';

/**
 * condensed version of the cards.
 * Works with themes.
 * props
 * theme
 * type
 * app
 * options
 * options can include cardType, cardContent, tabType, 
 */
export default class CardListInRoutine extends Component {
  constructor(props) {
    super(props);
    

  }


  /**
   * 
   * OPTIONS
   */


  render() {
    let app = {...this.props.app};
    let dispatch = app.dispatch;
    let state = app.state;
    let componentList = state.componentList;
    let styles =state.styles;
    
    
    if(this.props.theme){
      if(Object.prototype.toString.call(this.props.theme) === "[object String]"){
        styles = state.themeFactory.getThemeFactory()[this.props.theme];
      }
      else{
        styles= this.props.theme;
      }
    }
    app.state.styles=styles
    




    //********CARD ASSIGN********/

    let cards={

      card: <Card app={{...app, state:{...app.state, styles:styles} }} options={this.props.options} type={this.props.type}/>,
      cardWithTab: <CardWithTab app={{...app, state:{...app.state, styles:styles}}} options={this.props.options} type={this.props.type}/>,
      popup: <Popup app={{...app, state:{...app.state, styles:styles} }} handleClose={this.props.handleClose}  options={this.props.options} type={this.props.type}/>,
      popupWithTab: <PopupWithTab app={{...app, state:{...app.state, styles:styles}}} handleClose={this.props.handleClose} options={this.props.options} type={this.props.type}/>
//popupType={this.props.popupType} popupTab={this.props.popupTab}
    
    }
    
    //*********CARD ASSIGN********/





    return (
      <div >
        
        {cards[this.props.type? this.props.type: "card"]}
        </div>

    )
  }
}



//********CONTENTS********/
class MainContent extends Component{
  constructor(props) {
    super(props);
    this.state={

      routine:undefined
    }

  }
  componentDidMount(){
    let app = this.props.app;
    let state = app.state;
    let componentList = state.componentList; 
    let URL = window.location.href;
    let id = URL.split('/')[ URL.split('/').length-1];
    let routine = URL.includes("assigned")? componentList.getComponent("assignedRoutine", id): componentList.getComponent("routine", id);
    this.setState({routine:routine})
  }
 
  render(){
    let app = this.props.app;
    let dispatch = app.dispatch;
    let state = app.state;
    let componentList = state.componentList;
    let styles =state.styles;
    

    return(
    <div style={{marginTop:"40px"}}>
      {this.state.routine&&(
      <MapComponent name = "assignedCard" filter={{search:this.state.routine.getJson()._id, attribute:"routineID"}} app={app} cells={['name', {custom: MapSortUpDown, props:{app:app}}, 'delete']} delOptions={{name:"X"}} functions={{cells:[0], functions:[(comp)=>{
        dispatch({currentCard:comp, showPersonRoutine:true})
      }]}}/>
      )}
    </div>
    )
  }
}

class TabContent extends Component{
  constructor(props) {
    super(props);
    this.state={

    }
  }
  componentDidMount(){
    let app = this.props.app;
    let state = app.state;
    let componentList = state.componentList; 
    let URL = window.location.href;
    let id = URL.split('/')[ URL.split('/').length-1];
    let routine = URL.includes("assigned")? componentList.getComponent("assignedRoutine", id): componentList.getComponent("routine", id);
    this.setState({routine:routine})
  }
  render(){
    let app = this.props.app;
    let dispatch = app.dispatch;
    let state = app.state;
    let componentList = state.componentList;
    let styles =state.styles;

    return(
    <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between", borderBottom:"1px solid grey", padding:"10px", position:"relative" }}>
      <h1>{state.currentStudent?.getJson().name.split(" ")[0]}'s {this.state.routine?.getJson().name} Cards</h1>
      <div style={{position:"absolute", right:0, zIndex:1000}}>
      {state.user.getJson().type==="user"&&(
        <div onClick={async ()=>{
          await state.opps.cleanPrepare({update: this.state.routine})
          dispatch({popupSwitch:"assignToRoutineToPeople"})}} >Add Routine to a persons routine</div>
      )}
          {state.user.getJson().type==="user"&&(
        <div onClick={ async ()=>{
          debugger
          let routine = {...this.state.routine.getJson(), type:"routine", studentID:"", _id:Math.floor(Math.random()*100000).toString()}
          let cards = componentList.getList("assignedCard", this.state.routine.getJson()._id, "routineID");
          let arr= [];
          for(let card of cards){
            let obj = {...card.getJson(), _id:undefined, studentID:"", routineID:routine._id, type:"assignedCard"}
            arr.push(obj)
          }
          await state.opps.cleanJsonPrepare({addroutine:routine});
          state.opps.jsonPrepareRun({addassignedCard:arr});
          

        }}>Copy Routine</div>)}
        <div onClick={()=>{app.setPopup({operation:"cleanPrepare", operate:"update", object:this.state.routine}, "updateAssignedRoutine")}}>Edit Routine</div>
      </div>
      

    </div>
    )
  }
}

/**Popups */
class Popup extends Component{
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
    this.setWrapperRef = this.setWrapperRef;
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
}
componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
}
handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
       this.props.handleClose();
    }
}
  
  render(){
    let app = this.props.app;
    let dispatch = app.dispatch;
    let state = app.state;
    let componentList = state.componentList;
    let styles =state.styles;
    
    return(
      <div className="popup-box" style={{ zIndex: "1010" }}>
      <div ref={this.wrapperRef}  className="popupCard" style={{ zIndex: "1010", ...styles[this.props.options?.cardType? this.props.options?.cardType:"biggestCard"] }}>
      <div style={ ///EXIT BUTTON
                      styles.buttons.closeicon
                  } onClick={this.props.handleClose}>x</div>
          
          <div className='scroller' style={{...styles[this.props.options?.cardContent? this.props.options.cardContent: "cardContent"]}}>
        <MainContent app={app} />
        </div>
          
      
      </div>



      </div>
    )
  }
}
class PopupWithTab extends Component{
  constructor(props) {
    super(props);
    this.wrapperRef = React.createRef();
    this.setWrapperRef = this.setWrapperRef;
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
}
componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
}
handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
       this.props.handleClose();
    }
}
  render(){
    let app = this.props.app;
    let dispatch = app.dispatch;
    let state = app.state;
    let componentList = state.componentList;
    let styles =state.styles;
    
    return(
      <div  className="popup-box" style={{ zIndex: "1010" }}>
      <div ref={this.wrapperRef}  className="popupCard" style={{ zIndex: "1010", ...styles[this.props.options?.cardType? this.props.options?.cardType:"biggestCard"]  }}>
      
      <div style={{...styles[this.props.options?.tabType?this.props.options?.tabType: "colorTab1"]}}> <TabContent app={app} /> <div style={ ///EXIT BUTTON
                      styles.buttons.closeicon
                  } onClick={this.props.handleClose}>x</div></div>   
      <div className='scroller' style={{...styles[this.props.options?.cardContent? this.props.options.cardContent: "cardContent"]}}>
        <MainContent app={app} />
        </div>
        </div>
        



      </div>
    )
  }
}
  




//********CARDs********/
class Card extends Component{
  constructor(props) {
    super(props);
  }
  render(){
    let app = this.props.app;
    let dispatch = app.dispatch;
    let state = app.state;
    let componentList = state.componentList;
    let styles =state.styles;

    return(
      <div className='scroller'  style={{ ...styles[this.props.options?.cardType?this.props.options?.cardType:"biggestCard"]}}>   
            <div style={{...styles[this.props.options?.cardContent? this.props.options.cardContent: "cardContent"]}}>
              <MainContent app={app} />
            </div>
            
      </div>
    )
  }
}

class CardWithTab extends Component{
  constructor(props) {
    super(props);
    this.state={
      id:undefined
    }
  }
  componentDidMount(){
    let app = this.props.app;
    let state = app.state;
    let componentList = state.componentList; 
    let URL = window.location.href;
    let id = URL.split('/')[ URL.split('/').length-1];
    this.setState({id:id})
  }
  render(){
    let app = this.props.app;
    let dispatch = app.dispatch;
    let state = app.state;
    let componentList = state.componentList;
    let styles =state.styles;
    let theme = formThemeFactory.getFormsThemeFactory().dreamMaker

    return(
      <div  style={{...styles[this.props.options?.cardType?this.props.options?.cardType:"biggestCard"], position:"relative"  }}>   
      <div style={{...styles[this.props.options?.tabType?this.props.options?.tabType: "colorTab1"]}}> <TabContent app={app} /></div>   
      <div style={{...styles[this.props.options?.cardContent? this.props.options.cardContent: "cardContent"]}} className='scroller'>
        <MainContent app={app} />
        </div>
        <div style={{height:"100px", position:"absolute", bottom:0, width:"100%", borderTop:"1px solid gray", display:"flex", justifyContent:"center", alignItems:"center", zIndex:"100"}}>
              <div style={{...theme.addButton}} onClick={()=>{
                debugger
                let order = componentList.getList("assignedCard", this.state.id, "routineID").length
                let obj = state.user.getJson().type ==="student"? {studentID:state.user.getJson()._id, routineID:this.state.id, type:"assignedCard", order:order, owner:componentList.getComponent("user").getJson()._id} :{studentID:state.currentStudent.getJson()._id, routineID:this.state.id, type:"assignedCard", order:order}
                app.setPopup({operation:"cleanJsonPrepare", operate:"addassignedCard", object:obj }, "addAssignedCard")}}>
                  Add Card
              </div>
            </div>
        </div>
    )
  }
}
