import './App.css';
import { Component } from 'react';
import logo from './pics/DreamMakers.png'
// import Home from './view/home';
import Nav from './componentListNPM/navTech/nav.js';
// import Login from './view/login';
// import Register from './view/register';
import './index.css';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Login from './componentListNPM/componentForms/fullForms/registrationStuff/dreammakerLogin';
import AddRoutine from './view/popups/addRoutine';
import AddCard from './view/popups/addCard';
import AddPerson from './view/popups/addPerson';
import AssignCard from './view/popups/assignPopup';
import ShowCode from './view/popups/ShowCode';
import Splash from './view/popups/splash';
import Register from './view/register';
import CoachAdd from './view/popups/coachAdd';
// import DeletePopup from './view/deletePopup';
// import KeepDel from './view/keepDelete';


//model
/**
 * props
 * template
 * theme
 * type
 * options
 * obj
 * 
 * Options for nav for all current themes
 * logoImageTheme
 * logoImageSyle
 * logoTheme - type
 * logoWrapperTheme
 * logoWrapperStyle
 * navItemTheme
 * navItemStyle
 * obj.navItemTheme
 * obj.navItemStyle
 * activeNavItemTheme
 * activeNavItemStyle
 * obj.activeNavItemTheme
 * obj.activeNavItemStyle
 * singleLinkWrapperTheme
 * singleLinkWrapperStyle
 * obj.singleLinkWrapperTheme
 * obj.singleLinkWrapperStyle
 * activeSingleLinkWrapperTheme
 * activeSingleLinkWrapperStyle
 * obj.activeSingleLinkWrapperTheme
 * obj.activeSingleLinkWrapperStyle
 * obj.linkIcon
 * linkIconTheme
 * linkIconStyle
 * obj.linkIconTheme
 * obj.linkIconStyle
 * notifyTheme
 * notifyStyle
 * obj.notifyTheme
 * obj.notifyStyle
 * linksWrapperTheme
 * linksWrapperStyle
 * linksTheme - type
 * profilePicInnerWrapperTheme
 * profilePicInnerWrapperStyle
 * profilePicImageTheme
 * profilePicImageStyle
 * profilePicWrapperTheme
 * profilePicTheme - type
 * sectionOneStyle
 * sectionOneTheme
 * sectionTwoStyle
 * sectionTwoTheme
 * sectionThreeStyle
 * sectionThreeTheme
 * sectionsContainerStyle
 * sectionsContainerTheme
 * navContainerStyle
 * navContainerTheme
 * 
 */
export default class Dispatch extends Component {
  constructor(props){
    super(props);
  
  }
  componentDidMount(){
    let app = this.props.app
    let state = app.state;
    let dispatch=app.dispatch;
    let student = state.componentList.getComponent("student");
    let routine = state.componentList.getComponent("routine")
    dispatch({currentStudent:student, currentRoutine:routine })
  }


  render(){
    let app = this.props.app;
    let state = app.state;
    let styles =state.styles;
    let center = window.innerWidth<1200? {
      display: "flex",
      flexDirection:"column",
      justifyContent:"center",
      alignItems:"center"
    }: undefined
  return (
<BrowserRouter>

{state.splash&&(<Splash app={app} />)}
{(!state.login || state.keepLogin)&&(
  <div style={{zIndex: state.keepLogin&& ("-10000"), opacity:state.keepLogin&& ("0"), position: state.keepLogin&&("absolute")}}>
    {window.location.href.includes("signup")?(
<Register app={app} />
):(
  <Login app={app } />
  )}
  
  </div>
)}
{state.login&&(
  
    <div style={{
      width:"100%", 
      height:"96vh",
      }}>
        {state.user&&(<>
     <Nav  app={app} type="sideBarNav"  template="legato"  theme="legato"
     options={{
      logo:logo,
      
     }}
  
     
     /> 
     {/* //notification: int variable of watching something? Or string pointing to type that gets info from object for notification. Object contains function for notifications, and it goes and interacts with it. Either give it a string or a User Object. */}
    <div style={{...styles.page1}}>
    {(state.popupSwitch==="addRoutine"&& state.currentComponent?.getJson().type==="routine")&& <AddRoutine app={app} type="popup" options={{cardType: "smallCard" }} handleClose={()=>{app.dispatch({popupSwitch:"",currentComponent:undefined})}}/>}
    {(state.popupSwitch==="addAPerson")&& <CoachAdd app={app} type="popup" options={{cardType: "smallestCard" }} handleClose={()=>{app.dispatch({popupSwitch:"",currentComponent:undefined})}}/>}
    {(state.popupSwitch==="addRoutine"&& state.currentComponent?.getJson().type==="coachRoutine")&& <AddRoutine app={app} type="popup" options={{cardType: "smallCard" }} handleClose={()=>{app.dispatch({popupSwitch:"",currentComponent:undefined})}}/>}

    {(state.popupSwitch==="updateRoutine"&& state.currentComponent?.getJson().type==="routine")&& <AddRoutine app={app} type="popup" options={{cardType: "smallCard" }} handleClose={()=>{app.dispatch({popupSwitch:"",currentComponent:undefined})}}/>}

    {(state.popupSwitch==="addAssignedRoutine"&& state.currentComponent?.getJson().type==="assignedRoutine")&& <AddRoutine app={app} type="popup" options={{cardType: "smallCard" }} handleClose={()=>{app.dispatch({popupSwitch:"",currentComponent:undefined})}}/>}
    {(state.popupSwitch==="updateAssignedRoutine"&& state.currentComponent?.getJson().type==="assignedRoutine")&& <AddRoutine app={app} type="popup" options={{cardType: "smallCard" }} handleClose={()=>{app.dispatch({popupSwitch:"",currentComponent:undefined})}}/>}
    {(state.popupSwitch==="updateAssignedRoutine"&& state.currentComponent?.getJson().type==="coachRoutine")&& <AddRoutine app={app} type="popup" options={{cardType: "smallCard" }} handleClose={()=>{app.dispatch({popupSwitch:"",currentComponent:undefined})}}/>}

    {(state.popupSwitch==="addCard"&& state.currentComponent?.getJson().type==="coachCard")&& <AddCard app={app} type="popup" options={{cardType: "biggestCard" }} handleClose={()=>{app.dispatch({popupSwitch:"",currentComponent:undefined})}}/>}

    {(state.popupSwitch==="addCard"&& state.currentComponent?.getJson().type==="card")&& <AddCard app={app} type="popup" options={{cardType: "biggestCard" }} handleClose={()=>{app.dispatch({popupSwitch:"",currentComponent:undefined})}}/>}
    {(state.popupSwitch==="updateCard"&& state.currentComponent?.getJson().type==="card")&& <AddCard app={app} type="popup" options={{cardType: "biggestCard" }} handleClose={()=>{app.dispatch({popupSwitch:"",currentComponent:undefined})}}/>}
    {(state.popupSwitch==="updateCard"&& state.currentComponent?.getJson().type==="coachCard")&& <AddCard app={app} type="popup" options={{cardType: "biggestCard" }} handleClose={()=>{app.dispatch({popupSwitch:"",currentComponent:undefined})}}/>}

    {(state.popupSwitch==="updateCard"&& state.currentComponent?.getJson().type==="coachAssignedCard")&& <AddCard app={app} type="popup" options={{cardType: "biggestCard" }} handleClose={()=>{app.dispatch({popupSwitch:"",currentComponent:undefined})}}/>}

    {(state.popupSwitch==="updateCard"&& state.currentComponent?.getJson().type==="assignedCard")&& <AddCard app={app} type="popup" options={{cardType: "biggestCard" }} handleClose={()=>{app.dispatch({popupSwitch:"",currentComponent:undefined})}}/>}
    {(state.popupSwitch==="code")&& <ShowCode app={app} type="popup" options={{cardType: "smallCard" }} handleClose={()=>{app.dispatch({popupSwitch:"",currentComponent:undefined})}}/>}
    {(state.popupSwitch==="editStudent"&& state.currentComponent?.getJson().type==="student")&& <AddPerson app={app} type="popup" options={{cardType: "tallerCard" }} handleClose={()=>{app.dispatch({popupSwitch:"",currentComponent:undefined})}}/>}

    {(state.popupSwitch==="addStudent"&& state.currentComponent?.getJson().type==="student")&& <AddPerson app={app} type="popup" options={{cardType: "tallerCard" }} handleClose={()=>{app.dispatch({popupSwitch:"",currentComponent:undefined})}}/>}
    {(state.popupSwitch==="addAssignedCard"&& state.currentComponent?.getJson().type==="assignedCard")&& <AddCard app={app} type="popup" options={{cardType: "biggerCard" }} handleClose={()=>{app.dispatch({popupSwitch:"",currentComponent:undefined})}}/>}
    {(state.popupSwitch==="assignToRoutine")&& <AssignCard app={app} type="popup" options={{cardType: "smallCard" }} handleClose={()=>{app.dispatch({popupSwitch:"",currentComponent:undefined})}}/>}
    {(state.popupSwitch==="assignToAssingedRoutine")&& <AssignCard app={app} type="popup" options={{cardType: "smallCard" }} handleClose={()=>{app.dispatch({popupSwitch:"",currentComponent:undefined})}}/>}
        {(state.popupSwitch==="assignToRoutineToPeople")&& <AssignCard app={app} type="popup" options={{cardType: "smallCard" }} handleClose={()=>{app.dispatch({popupSwitch:"",currentComponent:undefined})}}/>}

    {(state.popupSwitch==="assignToPeople")&& <AssignCard app={app} type="popup" options={{cardType: "smallCard" }} handleClose={()=>{app.dispatch({popupSwitch:"",currentComponent:undefined})}}/>}

     <Routes>
      {state.switchCase?.map((obj, index)=>
        <Route path={obj.path} element={<obj.comp app={app}/>} />
      )}
      {/* <Route path="/signup" element={<Register app={app} />} /> */}
      {state.idSwitchCase?.map((obj, index) =>
                <Route path={obj.path + "/:id"} element={<obj.comp app={app} />} />

              )}

      {state.switchCase?.filter(obj => obj.idLink === true).map((obj, index) =>
                <Route path={obj.path + "/:id"} element={<obj.idLinkComp app={app} />} />

              )}
    
</Routes>
</div>
</>)}
     </div>
       )}


     </BrowserRouter>
  )}
}