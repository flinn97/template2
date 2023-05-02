import React, { Component } from 'react';
import authService from '../../../../services/auth';

export default class Login extends Component {
    constructor(props){
        super(props);
        this.handleChange= this.handleChange.bind(this);
        this.handleSubmission=this.handleSubmission.bind(this);
        this.registerStudent=this.registerStudent.bind(this);
        this.wrapperRef = React.createRef();
        this.setWrapperRef = this.setWrapperRef;
        this.state={
            selectedFile: undefined,
            path: undefined,
            email: "",
            password: "",
            code:false
        }
    }

	handleChange = async (event) => {
        let { name, value } = event.target;
        this.setState({
            [name]: value
        })
        
	};
    async registerStudent(){
        
        let app = this.props.app;
        let state = app.state;
        let componentList=state.componentList;
        let user = await authService.register(this.state.email, this.state.password);
        if(user){
        await authService.firebaseGetter(this.state.id, componentList, "_id");
        let student= await componentList.getComponent("student", this.state.id, "_id");
        await student.setCompState({email:this.state.email});
        
        await authService.setCurrentUser(student.getJson());
        await state.opps.cleanPrepareRun({update:student});
        const delay = ms => new Promise(res => setTimeout(res, ms));
                await delay(2000);
       window.location.reload();
    
        }

    }
   


	async handleSubmission()  {
       
        if(this.state.code){
            let email = this.state.email + "@dreammaker.com";
            let password = this.state.email;
            let user = await authService.login(email, password);
            
            if(user){
                let teacher = await authService.getStudentsTeacher(email);
                let teacherID= Object.values(teacher)[0];
                
                this.setState({
                    studentRegister:true,
                    email:"",
                    password:"",
                    message:"code accepted now enter a new email and password",
                    code:false,
                    id: password,
                    teacherId: teacherID
                })
                await authService.firebaseGetter(teacherID, this.props.app.state.componentList, "_id");
                let user = this.props.app.state.componentList.getComponent("user", teacherID, "_id");
                this.props.app.dispatch({user:user});
            }
            return

        }
        if(this.state.studentRegister){
            this.registerStudent();
            return
        }
        else{
            await authService.login(this.state.email, this.state.password, this.props.app.state.componentList, this.props.app.dispatch)
        }

        
        
	};
    render(){
        let app = this.props.app;
        let state = app.state;
        let dispatch = app.dispatch;
        let component = state.currentComponent;
       
        let styles =state.styles;
        let compJson = component?.getJson();
        let opps = component?.getOperationsFactory();
        let key =compJson?.collection? "update": "add";
        return(
                    <div style={{
                        
                        width: "98vw", 
                        borderRadius: styles?.borders?.radius1,
                        marginLeft:"1vw",
                        marginTop:"3vh",
                        minHeight: "88vh",
                        maxHeight: "50vh",
                        background: styles?.colors?.Grey1,
                        boxShadow: styles?.shadows?.homeShadow,
                        paddingTop: "2vh",
                        paddingLeft: "1vw",
                        paddingRight: "1vw",
                        alignContent: "center",
                        alignItems: "center",
                        alignSelf: "center",
                        }}>
                        <div 
                        style={{display: "flex", flexDirection:"column", justifyContent:"center",
                         alignContent: "center",
                         alignItems: "center",
                         alignSelf: "center",
                        marginTop:styles?.margins?.marginSmallH, width:"100%"}}>
                        <div style={{fontFamily: styles?.fonts?.fontTitle, fontSize: styles?.fonts?.fontHeader5,}}>Login</div>     
                        <div>{this.state.message}</div>                
                     <div style={{marginTop:"2vh",}} >
                    
                            <label htmlFor="lastName"><div style={{fontFamily: styles?.fonts?.fontNormal, marginRight: styles?.margins?.marginSmallW, fontSize: styles?.fonts?.fontHeader1,}}>{this.state.code?"Enter Code":"Email"}</div></label>
                            <input value={this.state.email} style ={{fontFamily: styles?.fonts?.fontNormal, height: "3vh", width: "18vw",
                    borderWidth: styles?.mySpawn?.border ,}} type="text" id="last"   onChange={this.handleChange} name="email"/>
                        </div>
                        {!this.state.code&&(
                        <div style={{marginTop:"2vh", marginBottom:styles?.margins?.marginSmallH}} >
                            <label htmlFor="lastName"><div style={{fontFamily: styles?.fonts?.fontNormal,marginRight: styles?.margins?.marginSmallW, fontSize: styles?.fonts?.fontHeader1,}}>Password</div></label>
                            <input  style ={{fontFamily: styles?.fonts?.fontNormal, height: "3vh",
                    borderWidth: styles?.mySpawn?.border, width: "18vw"}} type="password" id="pwd" value={this.state.password}  onChange={this.handleChange} name="password"/>
                        </div>)}
                        <div>
                         <button style={{...styles?.buttons?.buttonFollow, marginTop:"2vh", fontSize: styles?.fonts?.fontHeader2,}} class= "btn" onClick={this.handleSubmission}>Login</button>
                        <div onClick={()=>{this.setState({code:!this.state.code})}}>{this.state.code?"back":"Have a Code?"}</div>
                     </div>
                     </div>
                 </div>
             )
    }
	
}
//670324
