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
export default class AllCardsList extends Component {
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
    this.state = {

      routine: undefined
    }

  }


  render() {
    let app = this.props.app;
    let dispatch = app.dispatch;
    let state = app.state;
    let componentList = state.componentList;
    let styles = state.styles;


    return (
      <div style={{}}>
        {state.currentCard?.getJson().routineID !== "" && state.currentCard?.getJson().routineID !== undefined ? (<MapComponent name="assignedCard" filter={{ search: state.currentRoutine?.getJson()._id, attribute: "routineID" }} app={app} cells={['name',{custom: MapSortUpDown, props:{app:app}}, 'delete']} delOptions={{name:'X'}} functions={{
          cells: [0], functions: [(comp) => {
            dispatch({ currentCard: comp })
          }]
        }} />) : (
          <div>
            {state.currentCard?.getJson().studentID !== "" && state.currentCard?.getJson().studentID !== undefined ? (
              <MapComponent name="card" filter={{ search: state.currentStudent.getJson()._id, attribute: "studentID" }} app={app} cells={['name', 'delete']} delOptions={{name:"X"}} functions={{
                cells: [0], functions: [(comp) => {
                  dispatch({ currentCard: comp, showCard:true })
                }]
              }} />
            ) : (
              <MapComponent name="card" filter={{ search: false, attribute: "studentCard" }} app={app} cells={['name', 'delete']} delOptions={{name:"X"}} functions={{
                cells: [0], functions: [(comp) => {
                  dispatch({ currentCard: comp, showCard:true })
                }]
              }} />
            )}
          </div>
        )}


      </div>
    )
  }
}

class TabContent extends Component {
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
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", borderBottom: "1px solid grey", padding: "10px", }}>
        <div>{state.currentCard?.getJson().studentID !== "" && state.currentCard?.getJson().studentID !== undefined ? (<h1>{state.currentStudent?.getJson().name}'s Cards</h1>) : (
          <div>
            {state.currentCard?.getJson().routineID !== "" && state.currentCard?.getJson().routineID !== undefined ? (
              <h1>
                {state.currentRoutine?.getJson().name}: Cards
              </h1>
            ) : (
              <h1>
                My Cards
              </h1>
            )}
          </div>
        )}</div>
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
    this.state = {
      id: undefined
    }
  }
  componentDidMount() {
    debugger
    let app = this.props.app;
    let state = app.state;
    let componentList = state.componentList;
    let URL = window.location.href;
    let id = URL.split('/')[URL.split('/').length - 1];
    let component= componentList.getComponent("assignedCard", id, "_id");
    if(component){
      let routine = componentList.getComponent("routine", component.getJson().routineID, "_id");
      app.dispatch({currentRoutine:routine})
    }
    
    this.setState({ id: id })
    console.log(state.currentCard)
  }
  render() {
    let app = this.props.app;
    let dispatch = app.dispatch;
    let state = app.state;
    let componentList = state.componentList;
    let styles = state.styles;
    let theme = formThemeFactory.getFormsThemeFactory().dreamMaker

    return (
      <div style={{ ...styles[this.props.options?.cardType ? this.props.options?.cardType : "biggestCard"], position: "relative" }}>
        <div style={{ ...styles[this.props.options?.tabType ? this.props.options?.tabType : "colorTab1"] }}> <TabContent app={app} /></div>
        <div style={{ ...styles[this.props.options?.cardContent ? this.props.options.cardContent : "cardContent"] }} className='scroller'>
          <MainContent app={app} />
        </div>


        <div style={{ height: "100px", position: "absolute", bottom: 0, width: "100%", borderTop: "1px solid gray", display: "flex", justifyContent: "center", alignItems: "center", zIndex: "100" }}>
          {state.currentCard!==undefined &&state.currentCard!==""?(<>
          {state.currentCard?.getJson().routineID !== "" && state.currentCard?.getJson().routineID !== undefined ? (
            
            <div style={{ ...theme.addButton, height: "30px" }} 
            onClick={() => {
              let order = componentList.getList("assignedCard", state.currentRoutine?.getJson()._id, "routineID").length

              app.setPopup({ operation: "cleanJsonPrepare", operate: "addassignedCard", object: { routineID: state.currentRoutine?.getJson()._id, order:order, type:"assignedCard" } }, "addAssignedCard")


            }}>Add Card</div>
            
          ) : (
            <div>
             
                {state.currentCard?.getJson().studentID !== "" && state.currentCard?.getJson().studentID !== undefined ? (
                  <div style={{ ...theme.addButton, height: "30px" }} onClick={() => {


                    app.setPopup({ operation: "cleanJsonPrepare", operate: "addcard", object: { studentCard: true, type: "card", studentID: state.currentStudent?.getJson()._id } }, "addCard")



                  }}>Add Card</div>
                ) : (
                  <div style={{ ...theme.addButton, height: "30px" }} onClick={() => {
                    if (state.user.getJson().type === "student") {

                      app.setPopup({ operation: "cleanJsonPrepare", operate: "addcard", object: { studentCard: true, type: "card", owner: componentList.getComponent("user")?.getJson()._id, studentID: state.user.getJson()._id } }, "addCard")
                    }
                    else {
                      app.setPopup({ operation: "cleanPrepare", operate: "addcard", object: 1 }, "addCard")
                    }

                  }}>Add Card</div>
                )}
              
            </div>)}
         </> ): (

<div style={{ ...theme.addButton, height: "30px" }} onClick={() => {
  if (state.user.getJson().type === "student") {

    app.setPopup({ operation: "cleanJsonPrepare", operate: "addcard", object: { studentCard: true, type: "card", owner: componentList.getComponent("user")?.getJson()._id, studentID: state.user.getJson()._id } }, "addCard")
  }
  else {
    app.setPopup({ operation: "cleanPrepare", operate: "addcard", object: 1 }, "addCard")
  }

}}>Add Card</div>
)}

        </div>
      </div>
    )
  }
}
