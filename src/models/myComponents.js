import BaseClass from "../componentListNPM/baseClass";
import auth from "../services/auth.js";
import moment from 'moment';
class componentBase extends BaseClass{
    constructor(opps){
        super(opps);
        this.createUUID=this.createUUID.bind(this);

    }
    json;
    startobj={
        date: "",
        _id: "",
        description: "",
        title: "",
        owner: "",
        user: "",
        type: "",
        
        collection:"",
    }

    userInfo={
        about: "",
        picURL:"",
        email: "",
        firstName:"",
        lastName:"",
        password:"",
        phone: "",
        role: "",
        date: "",
        pics: "",
        
        collection:""
    }
    createUUID(length){
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789-#';
        var charactersLength = characters.length;
        for(var i =0; i<length; i++){
            result +=characters.charAt(Math.floor(Math.random()*charactersLength));
        }
        return result;
    }


    
    

}



class UserThings extends componentBase{
    constructor(opps){
        super(opps);
        
    }
    json= {
        ...this.userInfo, 
        role:"teacher",
        type: "user",
        signUpDate: moment().format('L'),
        paidCustomer: false,
        _id: ""
    }

    
    
}

class Tag extends componentBase{
   
    json= {
        
        type: "tag",
        name: "",
        tagType: "",
        _id: ""
        
       

    }

    
    
}

class Student extends componentBase{
   
    json= {
        
        type: "student",
        name: "",
        notes: "",
        email:"",
        phone:"",
        _id: ""

    }

    
    
}

class Card extends componentBase{
    json={
        type:'card',
        picURLs: undefined,
        name: "",
        _id: "",
        studentCard:false,
        routineIDs: {}
        

    }
    async getPicSrc(path){
        let obj={}
        for(const key in path){
            let pic = await auth.downloadPics(path[key]);
            obj["media"+this.createUUID(3)]= pic;
        }
        obj = {...obj, ...this.json.picURLs}

        
        this.json.picURLs = obj
        
    }
   
}
class CoachCard extends componentBase{
    json={
        type:'coachCard',
        picURLs: undefined,
        name: "",
        _id: "",
        studentCard:false,
        routineIDs: {}
        

    }
    async getPicSrc(path){
        let obj={}
        for(const key in path){
            let pic = await auth.downloadPics(path[key]);
            obj["media"+this.createUUID(3)]= pic;
        }
        obj = {...obj, ...this.json.picURLs}

        
        this.json.picURLs = obj
        
    }
   
}
class AssignedCard extends componentBase{
    json={
        type:'assignedCard',
        picURLs: undefined,
        name: "",
        _id: "",
        routineIDs: {}
        

    }
    async getPicSrc(path){
        let obj={}
        for(const key in path){
            let pic = await auth.downloadPics(path[key]);
            obj["media"+this.createUUID(3)]= pic;
        }
        obj = {...obj, ...this.json.picURLs}

        
        this.json.picURLs = obj
        
    }
   
}
class CoachAssignedCard extends componentBase{
    json={
        type:'coachAssignedCardcard',
        picURLs: undefined,
        name: "",
        _id: "",
        routineIDs: {}
        

    }
    async getPicSrc(path){
        let obj={}
        for(const key in path){
            let pic = await auth.downloadPics(path[key]);
            obj["media"+this.createUUID(3)]= pic;
        }
        obj = {...obj, ...this.json.picURLs}

        
        this.json.picURLs = obj
        
    }
   
}
class Routine extends componentBase{
    json={
        type:"routine",
        name: "",
        _id: "",
        order:{},
        picURL:""
    }
    async getPicSrc(path){
        
        
            let pic = await auth.downloadPics(path);
        

        
        this.json.picURL = pic
        
    }
}
class CoachRoutine extends componentBase{
    json={
        type:"coachRoutine",
        name: "",
        _id: "",
        order:{},
        picURL:""
    }
    async getPicSrc(path){
        
        
            let pic = await auth.downloadPics(path);
        

        
        this.json.picURL = pic
        
    }
}


class AssignedRoutine extends componentBase{
    json={
        type:"assignedRoutine",
        name: "",
        _id: "",
        studentID:"",
        order:{}
    }
}





function forFactory(){
    return { user: UserThings, tag:Tag, student:Student,card:Card, routine:Routine, assignedRoutine: AssignedRoutine, assignedCard:AssignedCard, coachAssignedCard:CoachAssignedCard, coachCard:CoachCard, coachRoutine:CoachRoutine  }
}


export {forFactory}
