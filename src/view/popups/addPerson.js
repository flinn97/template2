import React, { Component } from 'react';
import "../../App.css"
import MapComponent from '../../componentListNPM/mapTech/mapComponent';
import ParentFormComponent from '../../componentListNPM/componentForms/parentFormComponent';
import FormWithUpdateAndRun from '../../componentListNPM/componentForms/buttons/formWithUpdateAndRun';
import RunButton from '../../componentListNPM/componentForms/buttons/runButton';
import pic1 from '../../pics/place1.png';
import pic2 from '../../pics/place2.png';
import pic3 from '../../pics/place3.png';
import pic4 from '../../pics/place4.png';
import pic5 from '../../pics/place5.png';
import pic6 from '../../pics/place6.png';
import pic7 from '../../pics/place7.png';
import auth from '../../services/auth';
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
export default class AddPerson extends Component {
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

      card: <Card app={app} options={this.props.options} type={this.props.type}/>,
      cardWithTab: <CardWithTab app={app} options={this.props.options} type={this.props.type}/>,
      popup: <Popup app={app} handleClose={this.props.handleClose}  options={this.props.options} type={this.props.type}/>,
      popupWithTab: <PopupWithTab app={app} handleClose={this.props.handleClose} options={this.props.options} type={this.props.type}/>
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
    this.getRandomPicture = this.getRandomPicture.bind(this)
    this.state = {}

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
    <div style={{display:"flex", flexDirection:"column", alignItems:"center", width:"100%", position:"relative", height:"100%"}}>
      <div style={{fontSize:"24px"}}>Add Person</div>
      <ParentFormComponent app = {app} name="name" theme="default" placeholder="name"/>
      <ParentFormComponent app = {app} name="phone" theme="default" placeholder="phone"/>
      <ParentFormComponent app = {app} name="address" theme="default" placeholder="address"/>
      <ParentFormComponent app = {app} name="lesson" theme="default" placeholder="lesson"/>
      <ParentFormComponent app = {app} name="note" theme="default" type="textArea" placeholder="note"/>
      <div style={{position:"absolute", bottom:"10px"}}>
      <RunButton app={app}  theme="default" onClick={async ()=>{
                  let id = state.currentComponent.getJson()?._id

        if(state.popupSwitch!=="editStudent"){
          await state.currentComponent.setCompState({picURL:this.getRandomPicture()})
          await auth.register(id + "@dreammaker.com", id);
          await auth.registerStudent({ email: app.state.email }, id);
        }
        
        await state.opps.run();
        
        dispatch({currentComponent:undefined, popupSwitch:state.popupSwitch!=="editStudent"?"code":"", code:id});
      }}/>
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

    return(
    <div style={{display:"flex", flexDirection:"row", justifyContent:"space-between"}}>
      
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
      <div className='scroller'  style={{ ...styles[this.props.type?this.props.type:"biggestCard"] }}>   
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
      <div  style={{...styles[this.props.type?this.props.type:"biggestCard"] }}>   
      <div style={{...styles[this.props.options?.tabType?this.props.options?.tabType: "colorTab1"]}}> <TabContent app={app} /></div>   
      <div style={{...styles[this.props.options?.cardContent? this.props.options.cardContent: "cardContent"]}} className='scroller'>
        <MainContent app={app} />
        </div>
        </div>
    )
  }
}
