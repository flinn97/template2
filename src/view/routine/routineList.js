import React, { Component } from 'react';
import "../../App.css"
import MapComponent from '../../componentListNPM/mapTech/mapComponent';
import ParentFormComponent from '../../componentListNPM/componentForms/parentFormComponent';
import FormWithUpdateAndRun from '../../componentListNPM/componentForms/buttons/formWithUpdateAndRun';
import PrepareUpdateCheckBox from '../../componentListNPM/componentForms/singleForms/prepareUpdateCheckBox';
import RunButton from '../../componentListNPM/componentForms/buttons/runButton';
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
export default class Routine extends Component {
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
    let selectList = componentList.getList("student").map((obj, index)=>{return obj.getJson()._id});
    let textList = componentList.getList("student").map((obj, index)=>{return obj.getJson().name});

    return(
    <div>

{(state.checkComplete && state.opps.getUpdater("update").length>0) &&(
        <>
        <div style={{fontSize:"20px", marginTop:"30px" ,cursor:"pointer", backgroundColor:"red", color:"white", borderRadius:"7px", width:"170px", height:"30px", display:"flex", justifyContent:"center", alignItems:"center"}}  onClick={async ()=>{
          await dispatch({checkComplete:false})
          let list= [...state.opps.getUpdater("update")];
          for(const key in list){
            state.opps.removeFromRegister(list[key]);
          }
          state.opps.cleanPrepareRun({del:list});


        }}>
          Delete</div>
          <div onClick={()=>{dispatch({popupSwitch:"assignToRoutineToPeople"})}}>Assign Routine</div>

        {/* <div style={{fontSize:"20px", marginLeft:"10px", cursor:"pointer", color:"red"}} onClick={()=>{
        }}>
         
          <ParentFormComponent type ="select" name="routineIDs" defaultValue="none" theme="default" update={true}
        selectOptions={selectList} textOptions={textList} obj= {state.opps.getUpdater("update")} func={async (compList, e)=>{
          debugger
          let {name, value} = e.target;
          let arr = [];
          let cardArr = []
          for(let routine of compList){
            let obj = {...routine.getJson(),_id:Math.floor(Math.random()*100000).toString(), studentID:value,ogRoutineID:routine.getJson()._id, type:"assignedRoutine"};
            arr.push(obj);
            let cardList = componentList.getList("assignedCard", routine.getJson()._id, "routineID");
            for(let card of cardList){
              cardArr.push({...card.getJson(), routineID:obj._id,studentID:value,ogRoutineID:routine.getJson()._id, type:"assignedCard",_id:Math.floor(Math.random()*100000).toString(), })
            }
           

          }

          
          await state.opps.cleanJsonPrepare({addassignedRoutine: arr});
          state.opps.jsonPrepareRun({addassignedCard:cardArr});
          
          dispatch({ unMarkCheck:true});
          
          
        }} />
        </div> */}
        
        </>
        )}
      <MapComponent name ="routine"  app={app} cells={[{custom: PrepareUpdateCheckBox, props:{app:app}},'name', 'delete']} delOptions={{name:"X"}} functions={{cells:[1], functions:[(comp)=>{
        dispatch({currentRoutine:comp, showRoutine:true})
      }]}}/>

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

    return(
      <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between", borderBottom:"1px solid grey", padding:"10px", }}>
      <h1>Routines</h1>
    </div>
      // {/* <h1>Routine</h1> <div onClick={()=>{app.setPopup({operation:"cleanPrepare", operate:"addroutine", object:1 }, "addRoutine")}}>+ Add Routine</div> */}
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
    let theme = formThemeFactory.getFormsThemeFactory().dreamMaker


    return(
      <div  style={{...styles[this.props.options?.cardType?this.props.options?.cardType:"biggestCard"], position:"relative" }}>   
      <div style={{...styles[this.props.options?.tabType?this.props.options?.tabType: "colorTab1"]}}> <TabContent app={app} /></div>   
      <div style={{...styles[this.props.options?.cardContent? this.props.options.cardContent: "cardContent"]}} className='scroller'>
        <MainContent app={app} />
        </div>
        <div style={{height:"100px", position:"absolute", bottom:0, width:"100%", borderTop:"1px solid gray", display:"flex", justifyContent:"center", alignItems:"center", zIndex:"100"}}>
              <div style={{...theme.addButton}} onClick={()=>{app.setPopup({operation:"cleanPrepare", operate:"addroutine", object:1 }, "addRoutine")}}>
                  Add Routine
              </div>
            </div>
        </div>
    )
  }
}
