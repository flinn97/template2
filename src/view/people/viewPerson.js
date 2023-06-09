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
    let app = { ...this.props.app };
    let dispatch = app.dispatch;
    let state = app.state;
    let componentList = state.componentList;
    let styles = state.styles;


    if (this.props.theme) {
      if (Object.prototype.toString.call(this.props.theme) === "[object String]") {
        styles = state.themeFactory.getThemeFactory()[this.props.theme];
      }
      else {
        styles = this.props.theme;
      }
    }
    app.state.styles = styles





    //********CARD ASSIGN********/

    let cards = {

      card: <Card app={{ ...app, state: { ...app.state, styles: styles } }} options={this.props.options} type={this.props.type} />,
      cardWithTab: <CardWithTab app={{ ...app, state: { ...app.state, styles: styles } }} options={this.props.options} type={this.props.type} />,
      popup: <Popup app={{ ...app, state: { ...app.state, styles: styles } }} handleClose={this.props.handleClose} options={this.props.options} type={this.props.type} />,
      popupWithTab: <PopupWithTab app={{ ...app, state: { ...app.state, styles: styles } }} handleClose={this.props.handleClose} options={this.props.options} type={this.props.type} />
      //popupType={this.props.popupType} popupTab={this.props.popupTab}

    }

    //*********CARD ASSIGN********/





    return (
      <div >

        {cards[this.props.type ? this.props.type : "card"]}
      </div>

    )
  }
}



//********CONTENTS********/
class MainContent extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  // async componentDidMount(){
  //   
  //   let app = this.props.app;
  //   let dispatch = app.dispatch;
  //   let state = app.state;
  //   let componentList = state.componentList;
  //   let currentStudent = state.currentStudent;
  //   if(currentStudent){
  //     await auth.firebaseGetter(currentStudent.getJson()?._id, componentList,"studentID" )

  //   }
  //   dispatch({})


  // }

  render() {
    let app = this.props.app;
    let dispatch = app.dispatch;
    let state = app.state;
    let componentList = state.componentList;
    let styles = state.styles;
    let theme = formThemeFactory.getFormsThemeFactory().dreamMaker



    return (
      <div style={{ marginLeft:"35px"}}>
        {state.currentStudent && (<>
          {state.viewPersonTab === "routine" && (
            <MapComponent app={app} name="coachRoutine" filter={{ search: state.currentStudent?.getJson()?._id, attribute: "owner" }} cells={[{img:"picURL", imgStyle:{width:"25px", height:"25px"}}, "name", "delete"]} delOptions={{ name: "X" }} linkOptions={{ cells: [0, 1], path: ["/coachroutine/"] }} />
          )}
          {state.viewPersonTab === "assignedRoutine" && (

            <MapComponent app={app} name="assignedRoutine" filter={{ search: state.currentStudent?.getJson()?._id, attribute: "studentID" }} cells={[{img:"picURL", imgStyle:{width:"25px", height:"25px"}},"name", "delete"]} delOptions={{ name: "X" }} linkOptions={{ cells: [0, 1], path: ["/assignedroutine/"] }} />
          )}




          {state.viewPersonTab === "cards" && (
            <MapComponent app={app} name="card" filter={{ search: state.currentStudent?.getJson()?._id, attribute: "studentID" }} theme="gridMap" cells={[{ custom: ViewCards, props: { app: app, student: true } }]} />

          )}

          {state.viewPersonTab === "coachCards" && (

            <MapComponent app={app} name="coachCard" filter={{ search: state.currentStudent?.getJson()?._id, attribute: "owner" }} theme="gridMap" cells={[{ custom: ViewCards, props: { app: app, student: true } }]} />

          )}

        </>)}
      </div>

    )
  }
}

class TabContent extends Component {
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
  render() {
    let app = this.props.app;
    let dispatch = app.dispatch;
    let state = app.state;
    let componentList = state.componentList;
    let styles = state.styles;
    let theme = formThemeFactory.getFormsThemeFactory().dreamMaker


    return (
      <div style={{ display: "flex", flexDirection: "column", width: "100%", justifyContent: "top", alignItems: "center", borderBottom: "1px solid grey"}}>
        <img src={state.currentStudent?.getJson()?.picURL? state.currentStudent.getJson().picURL:this.getRandomPicture()} style={{ width: "10vh", height: "10vh", borderRadius: "50%" }} />
        <div style={{ marginTop: "1vh", fontSize: "1.5rem", cursor:"pointer" }} onClick={()=>{app.setPopup({operation:"cleanPrepare", operate:"update", object:state.currentStudent}, "editStudent")}}> {state.currentStudent?.getJson()?.type === "user" ? state.currentStudent?.getJson()?.firstName + " " + state.currentStudent?.getJson()?.lastName : state.currentStudent?.getJson()?.name}</div>
        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>

          <div>
            <div style={{ marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>
              <div style={{ textDecoration: "underline", color: "blue", margin: "1vh 0px" }} onClick={() => {
                navigator.clipboard.writeText(state.currentStudent.getJson()?._id)
                this.setState({ copied: "copied to clipboard" })
              }}>{state.currentStudent?.getJson()?._id}
              </div> {this.state.copied}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "row", alignContent: "center", justifyContent: "space-evenly", margin: "0px 20px"}}>
<div style={{ display: "flex", flexDirection: "row", alignContent: "center" , margin: "1rem 20px"}}>
            {state.currentStudent?.getJson()?.type === "user" && (<div onClick={() => { dispatch({ viewPersonTab: "routine" }) }} style={{ fontSize: "1.5rem", marginTop: "auto", marginBottom: "auto", padding: "1vh" }}>Routines</div>)}
            {state.currentStudent?.getJson()?.type !== "user" && (<div onClick={() => { dispatch({ viewPersonTab: "assignedRoutine" }) }} style={{ fontSize: "1.5rem", marginTop: "auto", marginBottom: "auto", padding: "1vh" }}>Routines</div>)}
            {state.currentStudent?.getJson()?.type !== "user" && (<div onClick={() => { dispatch({ viewPersonTab: "cards" }) }} style={{ fontSize: "1.5rem", marginTop: "auto", marginBottom: "auto", padding: "1vh" }}>Cards</div>)}
            {state.currentStudent?.getJson()?.type === "user" && (<div onClick={() => { dispatch({ viewPersonTab: "coachCards" }) }} style={{ fontSize: "1.5rem", marginTop: "auto", marginBottom: "auto", padding: "1vh" }}>Cards</div>)}
            </div>

            {state.viewPersonTab === "routine" || !state.viewPersonTab || state.viewPersonTab === "assignedRoutine" ? (

              <div style={{ ...theme.addButton, marginLeft: "auto", marginTop: "auto", marginBottom: "1rem"}} onClick={() => { app.setPopup({ operation: "cleanJsonPrepare", operate: state.currentStudent.getJson()?.type === "user" ? "addcoachRoutine" : "addassignedRoutine", object: state.currentStudent.getJson()?.type === "user" ? { type: "coachRoutine", owner: state.currentStudent.getJson()?._id, } : { type: "assignedRoutine", studentID: state.currentStudent.getJson()?._id, } }, state.currentStudent.getJson()?.type === "user" ? "addRoutine" : "addAssignedRoutine") }}>Add Routine</div>
            ) : (<div style={{ ...theme.addButton, marginLeft: "auto", marginTop: "auto", marginBottom: "1rem" }} onClick={() => { app.setPopup({ operation: "cleanJsonPrepare", operate: "addcard", object: state.currentStudent.getJson()?.type === "user" ? { type: "coachCard", owner: state.currentStudent.getJson()?._id, } : { type: "card", studentID: state.currentStudent.getJson()?._id, studentCard: true } }, "addCard") }}>+ Add Card</div>)}


          </div>

        </div>
      </div>
    )
  }
}

/**Popups */
class Popup extends Component {
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

  render() {
    let app = this.props.app;
    let dispatch = app.dispatch;
    let state = app.state;
    let componentList = state.componentList;
    let styles = state.styles;

    return (
      <div className="popup-box" style={{ zIndex: "1010" }}>
        <div ref={this.wrapperRef} className="popupCard" style={{ zIndex: "1010", ...styles[this.props.options?.cardType ? this.props.options?.cardType : "biggestCard"] }}>
          <div style={ ///EXIT BUTTON
            styles.buttons.closeicon
          } onClick={this.props.handleClose}>x</div>

          <div className='scroller' style={{ ...styles[this.props.options?.cardContent ? this.props.options.cardContent : "cardContent"] }}>
            <MainContent app={app} />
          </div>


        </div>



      </div>
    )
  }
}
class PopupWithTab extends Component {
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
  render() {
    let app = this.props.app;
    let dispatch = app.dispatch;
    let state = app.state;
    let componentList = state.componentList;
    let styles = state.styles;

    return (
      <div className="popup-box" style={{ zIndex: "1010" }}>
        <div ref={this.wrapperRef} className="popupCard" style={{ zIndex: "1010", ...styles[this.props.options?.cardType ? this.props.options?.cardType : "biggestCard"] }}>

          <div style={{ ...styles[this.props.options?.tabType ? this.props.options?.tabType : "colorTab1"] }}> <TabContent app={app} /> <div style={ ///EXIT BUTTON
            styles.buttons.closeicon
          } onClick={this.props.handleClose}>x</div></div>
          <div className='scroller' style={{ ...styles[this.props.options?.cardContent ? this.props.options.cardContent : "cardContent"] }}>
            <MainContent app={app} />
          </div>
        </div>




      </div>
    )
  }
}





//********CARDs********/
class Card extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let app = this.props.app;
    let dispatch = app.dispatch;
    let state = app.state;
    let componentList = state.componentList;
    let styles = state.styles;

    return (
      <div className='scroller' style={{ ...styles[this.props.options?.cardType ? this.props.options?.cardType : "biggestCard"] }}>
        <div style={{ ...styles[this.props.options?.cardContent ? this.props.options.cardContent : "cardContent"] }}>
          <MainContent app={app} />
        </div>
      </div>
    )
  }
}

class CardWithTab extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let app = this.props.app;
    let dispatch = app.dispatch;
    let state = app.state;
    let componentList = state.componentList;
    let styles = state.styles;

    return (
      <div style={{ ...styles[this.props.options?.cardType ? this.props.options?.cardType : "biggestCard"] }}>
        {state.currentStudent&&(<>
        <div style={{ ...styles[this.props.options?.tabType ? this.props.options?.tabType : "colorTab1"], height: "12rem + 10vh" }}> <TabContent app={app} /></div>
        <div style={{ ...styles[this.props.options?.cardContent ? this.props.options.cardContent : "cardContent"], height: "55vh" }} className='scroller'>
          <MainContent app={app} />
        </div>
        </>)}
      </div>
    )
  }
}
