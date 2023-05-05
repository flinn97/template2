import React, { Component } from 'react';
import "../../App.css"
import MapComponent from '../../componentListNPM/mapTech/mapComponent';
import ParentFormComponent from '../../componentListNPM/componentForms/parentFormComponent';
import FormWithUpdateAndRun from '../../componentListNPM/componentForms/buttons/formWithUpdateAndRun';

import ViewMedia from '../../componentListNPM/componentForms/media/viewMediaComponent';
import { async } from 'videojs-record';
import arr from '../../pics/dreamArrow.png'
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
export default class ViewCard extends Component {
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
    this.getPics = this.getPics.bind(this)
    this.state = {}
  }

  getPics() {

    let app = { ...this.props.app };
    let dispatch = app.dispatch;
    let state = app.state;
    let componentList = state.componentList;
    if (state.currentCard) {
      let card = state.currentCard;
      let arr = []
      if (card === "There are no Cards in this Routine") {
        return
      }
      for (const key in card.getJson().picURLs) {
        arr.push(card.getJson().picURLs[key]);
      }


      return (arr)
    }
  }


  render() {
    let app = this.props.app;
    let dispatch = app.dispatch;
    let state = app.state;
    let componentList = state.componentList;
    let styles = state.styles;
    let pics = this.getPics()


    return (
      <div>
        {state.currentCard !== "There are no Cards in this Routine" && (<>
          <div style={{ display: 'flex', flexDirection: "column", alignItems: "center", margin: "1% 5%",}}>
            <div style={{fontSize: "1.5rem"}} id="uploadDescription" dangerouslySetInnerHTML={{ __html: state.currentCard.getJson().description }}></div>
            {pics.map((img, index) =>
              <div style={{}} key={index}>

                <img src={img} style={{ objectFit: "cover", width: "100%" }} />
              </div>
            )}
          </div>

          {/* <ViewMedia  disablePlayButton= {true} scale={1} media={pics}  /> */}
        </>)}
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
    let theme = formThemeFactory.getFormsThemeFactory().dreamMaker


    return (
      <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "top", alignItems: "top", borderBottom: "1px solid grey", fontSize: "2.5vh", height: "15vh" }}>
        {state.currentCard !== "There are no Cards in this Routine" && (<>
          <div style={{ display: "flex", flexDirection: "column", textAlign: "center", justifyContent: "top", alignItems: "top", width: "100%", padding: "10px 0px 0px"}}>
          <div style={{paddingBottom: "5px", fontWeight: "bold"}}><>{state.currentCard?.getJson()?.name}</></div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              {state.user.getJson().type === "user" && (
                <div style={{...theme.addButton, margin: "0px 5px", width: "25%", fontSize: "1.75vh"}} onClick={async () => {
                  await state.opps.cleanPrepare({ update: state.currentCard });
                  dispatch({ popupSwitch: "assignToRoutine" })
                }}>Assign to Routine</div>
              )}

              {state.user.getJson().type === "user" && (
                <div style={{...theme.addButton, margin: "0px 5px", width: "25%", fontSize: "1.75vh"}} onClick={async () => {
                  await state.opps.cleanPrepare({ update: state.currentCard });
                  dispatch({ popupSwitch: "assignToPeople" })
                }}>Assign to Person</div>
              )}

              <div style={{...theme.addButton, margin: "0px 5px", width: "25%", fontSize: "1.75vh"}} onClick={async () => {
                await state.opps.cleanPrepare({ update: state.currentCard });
                dispatch({ popupSwitch: "assignToAssingedRoutine" })
              }}>
              
              {state.user.getJson().type === "user" ? "Assign to Persons Routine" : "Assign to another routine"}</div>
              <div style={{...theme.addButton, margin: "0px 5px", width: "25%", fontSize: "1.75vh"}} onClick={async () => {
                let obj = { ...state.currentCard.getJson(), _id: undefined, studentCard: state.user.getJson().type === "user" ? false : true, studentID: state.user.getJson().type === "user" ? "" : state.user.getJson()._id, routineID: "", type: "card" }
                state.opps.cleanJsonPrepareRun({ addcard: obj })
              }}>Copy Card</div>
            </div>
            <div style={{fontSize: "1.75vh", borderRadius: "1rem", backgroundColor: "grey", color: "white", cursor: 'pointer', margin: ".25rem", width: "8rem", marginLeft: "auto", marginRight: "auto", padding: ".25rem"}} >Edit Card</div>

            <div style={{ cursor: 'pointer' }} onClick={() => {
              if (state.user.getJson().type === "student") {

                app.setPopup({ operation: "cleanPrepare", operate: "update", object: state.currentCard }, "updateCard")
              }
              else {
                app.setPopup({ operation: "cleanPrepare", operate: "update", object: state.currentCard }, "updateCard")
              }

            }}>

            </div>
          </div>
        </>)}
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
      <div style={{ ...styles[this.props.options?.cardType ? this.props.options?.cardType : "biggestCard"], width: window.innerWidth < state.phoneUIChange ? "70vw" : "35vw", position: 'relative' }}>
        <div style={{ ...styles[this.props.options?.tabType ? this.props.options?.tabType : "colorTab1"], height: "150px" }}> <TabContent app={app} /></div>
        <div style={{ ...styles[this.props.options?.cardContent ? this.props.options.cardContent : "cardContent"], height: "70%" }} className='scroller'>
          <MainContent app={app} />
        </div>
        <div onClick={() => {
          debugger
          let list = state.showPersonRoutine ? componentList.getList("card", state.currentStudent.getJson()._id, "studentID") : (state.showCard && !state.showRoutine) ? componentList.getList("card", false, "studentCard") : componentList.getList("assignedCard", state.currentRoutine.getJson()._id, "routineID");
          let index = list.indexOf(state.currentCard);
          let newComp = undefined
          if (index === 0) {
            newComp = list[list.length - 1];
          }
          else {
            newComp = list[index - 1]
          }
          dispatch({ currentCard: newComp });

        }}
          style={{ background: "white", borderRadius: "50%", width: "70px", height: "70px", display: "flex", justifyContent: "center", alignItems: "center", position: "absolute", top: "50%", left: "-100px" }}><img src={arr} /></div>
        <div onClick={() => {
          debugger
          let list = state.showPersonRoutine ? componentList.getList("assignedCard", state.currentRoutine.getJson()._id, "routineID") : (state.showCard && !state.showRoutine) ? componentList.getList("card", false, "studentCard") : componentList.getList("assignedCard", state.currentRoutine.getJson()._id, "routineID");
          let index = list.indexOf(state.currentCard);
          let newComp = undefined
          if (list[index] === list[list.length - 1]) {
            newComp = list[0];
          }
          else {
            newComp = list[index + 1]
          }
          dispatch({ currentCard: newComp });

        }} style={{ background: "white", borderRadius: "50%", width: "70px", height: "70px", display: "flex", justifyContent: "center", alignItems: "center", position: "absolute", top: "50%", right: "-100px" }}><img style={{ transform: "rotate(180deg)" }} src={arr} /></div>

      </div>
    )
  }
}
