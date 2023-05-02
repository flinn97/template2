import React, { Component } from 'react';
import "../../App.css"
import MapComponent from '../../componentListNPM/mapTech/mapComponent';
import ParentFormComponent from '../../componentListNPM/componentForms/parentFormComponent';
import FormWithUpdateAndRun from '../../componentListNPM/componentForms/buttons/formWithUpdateAndRun';
import pic1 from '../../pics/place1.png';
import pic2 from '../../pics/place2.png';
import pic3 from '../../pics/place3.png';
import pic4 from '../../pics/place4.png';
import pic5 from '../../pics/place5.png';
import pic6 from '../../pics/place6.png';
import pic7 from '../../pics/place7.png';
import auth from '../../services/auth';
import ViewCards from '../components/viewMediaForMap';
import formThemeFactory from '../../componentListNPM/componentForms/formThemes/formThemeFactory';


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
export default class ViewPerson extends Component {
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
    this.state={}
  }
  // async componentDidMount(){
  //   debugger
  //   let app = this.props.app;
  //   let dispatch = app.dispatch;
  //   let state = app.state;
  //   let componentList = state.componentList;
  //   let currentStudent = state.currentStudent;
  //   if(currentStudent){
  //     await auth.firebaseGetter(currentStudent.getJson()._id, componentList,"studentID" )

  //   }
  //   dispatch({})
    

  // }

  render(){
    let app = this.props.app;
    let dispatch = app.dispatch;
    let state = app.state;
    let componentList = state.componentList;
    let styles =state.styles;
    let theme = formThemeFactory.getFormsThemeFactory().dreamMaker

    

    return(
    <div style={{marginLeft:"100px"}}>
      {state.viewPersonTab==="routine"|| !state.viewPersonTab?(<>
        <div style={{...theme.addButton}} onClick={()=>{app.setPopup({operation:"cleanJsonPrepare", operate:"addassignedRoutine", object:{type:"assignedRoutine", studentID:state.currentStudent.getJson()._id,} }, "addAssignedRoutine")}}>Add Routine</div>
    {state.currentStudent&&(
      <MapComponent app={app} name="assignedRoutine" filter = {{search:state.currentStudent?.getJson()._id, attribute:"studentID"}} cells={["name", "delete"]} delOptions={{name:"X"}} linkOptions={{cells:[0], path:["/assignedroutine/"]}}/>
      )} </>):(<>
      <div style={{...theme.addButton, height:"30px"}} onClick={()=>{app.setPopup({operation:"cleanJsonPrepare", operate:"addcard", object:{type:"card", studentID:state.currentStudent.getJson()._id, studentCard:true} }, "addCard")}}>+ Add Card</div>
      <MapComponent app={app} name = "card" filter={{search: state.currentStudent?.getJson()._id, attribute:"studentID"}} theme="gridMap" cells= {[{custom:ViewCards, props:{app:app, student:true}}]} />
      </>)}
    </div>
   
    )
  }
}

class TabContent extends Component{
  constructor(props) {
    super(props);
    this.getRandomPicture = this.getRandomPicture.bind(this)
    this.state={}

  }
  getRandomPicture() {
    const pictures = [
      pic1,
      pic2,
      pic3,
      pic4,
      pic5,
      pic6,
      pic7,
    ];
  
    const randomIndex = Math.floor(Math.random() * pictures.length);
    return pictures[randomIndex];
  }
  render(){
    let app = this.props.app;
    let dispatch = app.dispatch;
    let state = app.state;
    let componentList = state.componentList;
    let styles =state.styles;

    return(
    <div style={{display:"flex", flexDirection:"column", width:"100%", justifyContent:"center", alignItems:"center", borderBottom:"1px solid grey"}}>
      <img src = {this.getRandomPicture()}  style={{width:"100px", height:"100px", borderRadius:"50%"}}/>
       <div style={{marginTop:"10px", fontSize:"24px"}}> {state.currentStudent?.getJson().name}</div>
       <div style={{display:"flex", flexDirection:"row", width:"100%"}}>
       <div onClick={()=>{dispatch({viewPersonTab:"routine"})}} style={{marginTop:"50px", fontSize:"20px", alignSelf:"flex-start", marginLeft:'50px', marginBottom:"10px"}}>Assigned Routines</div>
       <div onClick={()=>{dispatch({viewPersonTab:"cards"})}} style={{marginTop:"50px", fontSize:"20px", alignSelf:"flex-start", marginLeft:'50px', marginBottom:"10px"}}>Cards</div>
       <div>
      <div><div style={{textDecoration:"underline", color:"blue"}} onClick={()=>{
        navigator.clipboard.writeText(state.currentStudent.getJson()._id)
        this.setState({copied:"copied to clipboard"})
      }}>{state.currentStudent.getJson()._id}</div> {this.state.copied}</div>
    </div>
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
      <div className='scroller'  style={{ ...styles[this.props.options?.cardType?this.props.options?.cardType:"biggestCard"] }}>   
            <div  style={{...styles[this.props.options?.cardContent? this.props.options.cardContent: "cardContent"]}}>
              <MainContent app={app} />
            </div>
      </div>
    )
  }
}

class CardWithTab extends Component{
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
      <div  style={{...styles[this.props.options?.cardType?this.props.options?.cardType:"biggestCard"] }}>   
      <div style={{...styles[this.props.options?.tabType?this.props.options?.tabType: "colorTab1"], height:"250px"}}> <TabContent app={app} /></div>   
      <div style={{...styles[this.props.options?.cardContent? this.props.options.cardContent: "cardContent"], height:"66%"}} className='scroller'>
        <MainContent app={app} />
        </div>
        </div>
    )
  }
}
