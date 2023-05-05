import React, { Component } from 'react';
import "../../App.css"
import MapComponent from '../../componentListNPM/mapTech/mapComponent';
import ParentFormComponent from '../../componentListNPM/componentForms/parentFormComponent';
import FormWithUpdateAndRun from '../../componentListNPM/componentForms/buttons/formWithUpdateAndRun';
import PrepareUpdateCheckBox from '../../componentListNPM/componentForms/singleForms/prepareUpdateCheckBox';
import RunButton from '../../componentListNPM/componentForms/buttons/runButton';
import ViewMedia from '../../componentListNPM/componentForms/media/viewMediaComponent';
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
export default class CardList extends Component {
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
  }
  render(){
    let app = this.props.app;
    let dispatch = app.dispatch;
    let state = app.state;
    let componentList = state.componentList;
    let styles =state.styles;
    let textList = componentList.getList("routine").map((obj, index)=>{return obj.getJson().name})
    let selectList = componentList.getList("routine").map((obj, index)=>{return obj.getJson()._id});
    let personTextList = componentList.getList("student").map((obj, index)=>{return obj.getJson().name});
    let personSelectList = componentList.getList("student").map((obj, index)=>{return obj.getJson()._id});
    return(
    <div style={{width:"100%", display:"flex", flexDirection:"column", }}>
              <div style={{width:"90%", alignSelf:"center"}}>
      
      <MapComponent name = "card" app={app} theme = "gridMap" filter={{search:state.user.getJson().type==="student"?true:false, attribute:"studentCard"}} cells={[{custom:ViewCards, props:{app:app}}]} />
      </div>
    </div>
    )
  }
}

class TabContent extends Component{
  constructor(props) {
    super(props);
  }
  render(){
    let app = this.props.app;
    let dispatch = app.dispatch;
    let state = app.state;
    let componentList = state.componentList;
    let styles =state.styles;
    let theme = formThemeFactory.getFormsThemeFactory().dreamMaker

    return(
    <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between", borderBottom:"1px solid grey", height:"40px"}}>
      <h1>Cards</h1> 

      {/* TODO: MAKE BUTTONS PRETTY */}
      {(state.checkComplete && state.opps.getUpdater("update").length>0) &&(
        //buttons 
        <div style={{display: "flex", flexDirection: "row"}}>
        <div style={{fontSize:"20px" ,cursor:"pointer", backgroundColor:"red", color:"white", borderRadius:"7px", width:"170px", height:"30px", display:"flex", justifyContent:"center", alignItems:"center"}} onClick={async ()=>{
          await dispatch({checkComplete:false})
          let list= [...state.opps.getUpdater("update")];
          for(const key in list){
            state.opps.removeFromRegister(list[key]);
          }
          state.opps.cleanPrepareRun({del:list});


        }}>
          Delete Selected</div>
          
          {state.user.getJson().type!=='student'&&(
          <div style={{...theme.addButton}} onClick={()=>{dispatch({popupSwitch:"assignToRoutine"})}}>Assign to Routine</div>
          )}
                 {state.user.getJson().type!=='student'&&(

         <div style={{...theme.addButton}} onClick={()=>{dispatch({popupSwitch:"assignToPeople"})}}>Assign to People</div>
         )}
         <div style={{...theme.addButton}} onClick={()=>{dispatch({popupSwitch:"assignToAssingedRoutine"})}}> {state.user.getJson().type!=='student'?"Assign to A Persons Routine":"assign to routine"}</div>

        {/* <div style={{fontSize:"20px", marginLeft:"10px", cursor:"pointer", color:"black", display:"flex", flexDirection:"column"}} >
         
          <ParentFormComponent type ="select" name="owner" defaultValue="none"  theme="default" update={true} label="Send to a person" wrapperStyle={{display:"flex", flexDirection:"column", width:"160px", fontSize:"16px", marginTop:"15px"}}
        selectOptions={personSelectList} textOptions={personTextList}  obj= {state.opps.getUpdater("update")} func={(compList, e)=>{
          debugger
          let {name, value} = e.target;
          let arr = []
          for(let card of compList){
            let obj = {...card.getJson(), _id:Math.floor(Math.random()*100000).toString(),  type:"card", studentID:value, studentCard:true};
            arr.push(obj);
          }
          state.opps.cleanJsonPrepareRun({addassignedCard: arr});
          dispatch({ unMarkCheck:true});
          
          
        }} />
        </div> */}
        
        </div>
        )}

      <div style={{...theme.addButton, height:"30px"}} onClick={()=>{
        if(state.user.getJson().type==="student"){
          
          app.setPopup({operation:"cleanJsonPrepare", operate:"addcard", object:{studentCard:true, type:"card", owner:componentList.getComponent("user")?.getJson()._id, studentID:state.user.getJson()._id} }, "addCard")
        }
        else{
          app.setPopup({operation:"cleanPrepare", operate:"addcard", object:1 }, "addCard")
        }
        
        }}>+ Add Card</div>
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
  }
  render(){
    let app = this.props.app;
    let dispatch = app.dispatch;
    let state = app.state;
    let componentList = state.componentList;
    let styles =state.styles;

    return(
      <div  style={{...styles[this.props.options?.cardType?this.props.options?.cardType:"biggestCard"] }}>   
      <div style={{...styles[this.props.options?.tabType?this.props.options?.tabType: "colorTab1"]}}> <TabContent app={app} /></div>   
      <div style={{...styles[this.props.options?.cardContent? this.props.options.cardContent: "cardContent"], height:"90%"}} className='scroller'>
        <MainContent app={app} />
        </div>
        </div>
    )
  }
}
