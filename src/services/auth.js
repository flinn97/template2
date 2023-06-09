import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { doc, getDocs, collection, getDoc, updateDoc, addDoc, where, query, setDoc, deleteDoc, onSnapshot, querySnapshot, Timestamp, serverTimestamp, orderBy, limit } from "firebase/firestore";
import { db, storage, auth } from '../firbase.config.js';
import { createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged, getAuth, sendPasswordResetEmail, updateEmail, deleteUser } from "firebase/auth";

import spawnPic from "../pics/runesTest1/0green.png";
import spawnLogo from "../pics/runesTest1/1grey.png";
import likeheart from "../pics/runesTest1/0red.png";
import dragon from "../pics/runesTest1/1green.png";
import beholder from "../pics/runesTest1/0grey.png";
import celestial from "../pics/runesTest1/2green.png";
import keep from "../pics/runesTest1/2grey.png";
import kraken from "../pics/runesTest1/purple.png";
import RoutinePage from "../view/routine/RoutinePage.js";
import CardList from "../view/AllCards/cardList.js";
import CardPage from "../view/AllCards/cardPage.js";
import CardsInRoutinePage from "../view/routine/cardsInRoutinePage.js";

class Auth {
    urlEnpoint = "dreamMaker"

    async getCurrentUser() {
        return localStorage.getItem("user");
    }
    async setCurrentUser(student) {
        await localStorage.setItem("user", JSON.stringify(student));
    }
    // getJsonDatabase(componentList){
    //     
    //     let arr = [weapons];
    //     let arrnames=["weapon"];
    //     let data = []
    //     for(const key in arr){
    //         for(const key1 in arr[key].data){
    //             for(const key2 in arr[key].data[key1]){
    //                 arr[key].data[key1][key2].type= arrnames[key];
    //                 data.push(arr[key].data[key1][key2]);
    //             }
    //         }

    //     }
    //     for(const key in data);
    //     componentList.addComponents(data);

    // }

    async getKinstoneMaterial(componentList,) {
        let piclist = [spawnLogo, spawnPic, likeheart, kraken, dragon, beholder, keep, celestial]
        let list = ["obsidian", "petrified wood", "amethyst", "meteorites", "dragonstone", "shadowrock", "thunderstone", "way stone"]
        let i = 0;
        let rawData = [];
        for (let el of list) {
            rawData.push({ type: "element", title: el })
            rawData[i].picURL = piclist[i]
            i++
        }

        await componentList.addComponents(rawData, false);


    }

    async createInitialStages(componentList,) {
        let list = ["Not Started", "First Email", "Second Email", "Follow up", "Nurture", "Not Interested",]
        let rawData = [];
        let i = 0;
        for (let el of list) {

            rawData.push({ type: "tag", order: i, name: el, _id: Math.floor(Math.random() * 10000).toString() })
            i++

        }

        await componentList.addComponents(rawData, false);


    }

    async firebaseGetter(value, componentList, attribute, type) {
        let list = componentList.getComponents();
        let IDlist = [];
        for (const key in list) {
            IDlist.push(list[key].getJson()?._id)
        }
        let rawData = [];
        const components = await query(collection(db, this.urlEnpoint + "users", this.urlEnpoint + "APP", "components"), where(attribute, '==', value));
        let comps = await getDocs(components);
        for (const key in comps.docs) {
            let data = comps.docs[key].data()
            if (!IDlist.includes(data._id)) {
                rawData.push(data);
            }
        }
        await componentList.addComponents(rawData, false);
        if (type) {
            return componentList.getList(type, value, attribute)
        }
        else {
            return true;

        }

    }
    async getuser(email, componentList, dispatch) {

        try {

            dispatch({ splash: true });
            let list = componentList.getComponents();
            let IDlist = [];
            for (const key in list) {
                IDlist.push(list[key]?.getJson()?._id)
            }
            let rawData = [];

            let tryQuearyLocal = await localStorage.getItem("tryComps");

            let tryComps;

            if (tryQuearyLocal) {
                tryQuearyLocal = JSON.parse(tryQuearyLocal);


            }
            else {
                let tryQueary = query(collection(db, this.urlEnpoint + "users", this.urlEnpoint + "APP", "components"), where('email', '==', email), limit(1));

                tryComps = await getDocs(tryQueary);
            }


            let oldRawData = await localStorage.getItem("rawData");
            if (oldRawData) {
                oldRawData = JSON.parse(oldRawData);
            }
            let student = undefined;
            if (tryComps?.docs?.length > 0) {
                await localStorage.setItem("tryComps", JSON.stringify(tryComps.docs[0].data()));
                if (!IDlist.includes(tryComps.docs[0].data()?._id) && tryComps.docs[0].data().type === "student") {
                    student = tryComps.docs[0].data();
                    rawData.push(student);
                }
                else {
                    let rd = oldRawData ? [...oldRawData, tryComps.docs[0].data()] : [tryComps.docs[0].data()]


                    await componentList.addComponents(rd, false);
                    let user = componentList.getComponent("user");
                    dispatch({ login: true, keepLogin: true, email: email, user: user, splash: false })
                }
            }
            if (tryQuearyLocal) {
                if (!IDlist.includes(tryQuearyLocal._id) && tryQuearyLocal.type === "student") {
                    student = tryQuearyLocal;
                    rawData.push(student);
                }
                else {
                    let rd = oldRawData ? [...oldRawData, tryQuearyLocal] : [tryQuearyLocal]
                    await componentList.addComponents(rd, false);
                    let user = componentList.getComponent("user");

                    dispatch({ login: true, keepLogin: true, email: email, user: user, splash: false })
                }
            }

            const components = student ? await query(collection(db, this.urlEnpoint + "users", this.urlEnpoint + "APP", "components"), where('studentID', '==', student._id), orderBy("date")) :
                query(collection(db, this.urlEnpoint + "users", this.urlEnpoint + "APP", "components"), where('owner', '==', email), orderBy("date"));
            let comps = await getDocs(components);
            for (const key in comps.docs) {
                let data = comps.docs[key].data()
                if (!IDlist.includes(data._id)) {
                    rawData.push(data);
                }
            }
            if (student) {
                componentList.addComponents(rawData, false)
                const coach = await query(collection(db, this.urlEnpoint + "users", this.urlEnpoint + "APP", "components"), where('_id', '==', student.owner));
                let coachcomps = await getDocs(coach);
                for (const key in coachcomps.docs) {
                    let data = coachcomps.docs[key].data();
                    if (!IDlist.includes(data._id)) {
                        rawData.push(data);
                    }
                }
            } else {
                await componentList.addComponents(rawData, false);
                dispatch({});
                const coaches = await query(collection(db, this.urlEnpoint + "users", this.urlEnpoint + "APP", "components"), where('coachOwner', '==', email));
                let coachcomps = await getDocs(coaches);
                for (const key in coachcomps.docs) {
                    let data = coachcomps.docs[key].data();
                    if (!IDlist.includes(data._id)) {
                        rawData.push(data);
                        let coachQuery = await query(collection(db, this.urlEnpoint + "users", this.urlEnpoint + "APP", "components"), where('owner', '==', data._id));
                        let coachesComps = await getDocs(coachQuery);
                        for (const key in coachesComps.docs) {
                            let data = coachesComps.docs[key].data();
                            if (data.type === "routine" || data.type === "card" || data.type === "assignedCard") {
                                if (data.type === "card") {
                                    data.type = "coachCard"
                                }
                                if (data.type === "routine") {
                                    data.type = "coachRoutine"
                                }
                                if (data.type === "assignedCard") {

                                    data.type = "coachAssignedCard"
                                }
                                rawData.push(data);

                            }
                        }
                    }
                }
            }
            localStorage.setItem("rawData", JSON.stringify(rawData));

            await componentList.addComponents(rawData, false);
            await componentList.sortSelectedList("assignedCard", "order");

            if (dispatch) {
                let user = student ? componentList.getComponent('student', email, "email") : componentList.getComponent('user', email, "owner");
                let routines = componentList.getList("assignedRoutine");
                let currentStudent = componentList.getComponent("student");
                let routine = routines[0]
                if (!student) {
                    dispatch({ login: true, email: email, keepLogin: false, user: user, currentStudent: currentStudent, currentRoutine: routine, splash: false })

                }
                else {


                    let empty = []
                    let arr = [routine !== undefined ? { path: "/assignedRoutine/" + routine.getJson()?._id, comp: CardsInRoutinePage, name: "routine" } : {}];
                    for (let r of routines) {
                        let obj = { path: "/assignedRoutine/" + r.getJson()?._id, comp: CardsInRoutinePage, name: r.getJson()?.name, }
                        arr.push(obj)
                    }
                    dispatch({
                        login: true, email: email, user: user, keepLogin: false, currentStudent: currentStudent, currentRoutine: routine, splash: false,

                        switchCase: [
                            { path: '/', comp: CardPage, name: "My Cards", },
                            ...arr

                        ],
                    })

                }

            }
        }
        catch (e) {
            console.log(e)
        }
    }
    async getCardsInRoutine(id, componentList,) {
        // 

        let list = componentList.getComponents();
        let IDlist = [];
        for (const key in list) {
            IDlist.push(list[key]?.getJson()?._id)
        }
        let rawData = [];
        const components = await query(collection(db, this.urlEnpoint + "users", this.urlEnpoint + "APP", "components"), where('routineID', '==', id), orderBy("date"));
        let comps = await getDocs(components);
        for (const key in comps.docs) {
            let data = comps.docs[key].data()
            if (!IDlist.includes(data._id)) {
                rawData.push(data);
            }
        }
        await componentList.addComponents(rawData, false);

    }

    async GetAllData(email, componentList, dispatch) {

        let rawData = [];
        const components = await query(collection(db, "users"));
        // let comps= await getDocs(components);

        let comps = await getDocs(components);


        rawData = [];
        let emails = [];


        for (const key in comps.docs) {

            let data = comps.docs[key].data()
            if (!emails.includes(data.email)) {
                rawData.push(data);
                emails.push(data.email)

            }
        }
        for (const key in emails) {
            const components1 = await query(collection(db, "users", emails[key], "components"));

            let rawData1 = [];

            // let comps= await getDocs(components);
            let comps1 = await onSnapshot(components1, async (querySnapshot) => {


                rawData1 = [];



                for (const key in querySnapshot.docs) {

                    let data = querySnapshot.docs[key].data()
                    rawData1.push(data);
                }

                await componentList.addComponents(rawData1, false);
                if (emails[key] === emails[emails.length - 1]) {
                    await localStorage.setItem("email", JSON.stringify(email));

                    await dispatch({ email: email, login: false });
                }




            });


        }



    }

    async login(email, password, componentList, dispatch) {


        let user;
        await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                user = userCredential.user;
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage)
            });
        if (user) {
            let saveUser = user

            if (componentList !== undefined && dispatch !== undefined) {
                await localStorage.setItem("user", JSON.stringify(saveUser));
                await this.getuser(email, componentList, dispatch);

            }




        }
        return user;
    }
    async registerStudent(obj, email) {
        await setDoc(doc(db, this.urlEnpoint + 'users', email + "@dreammaker.com"), obj);

    }
    async registerStudentWithEmail(email, obj,) {

        await setDoc(doc(db, 'users', email), obj);

    }
    async getStudentsTeacher(email) {
        const docRef = doc(db, this.urlEnpoint + "users", email);
        const docSnap = await getDoc(docRef);
        return docSnap.data();

    }
    async register(email, password, addToCache) {

        let user;
        await createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
            user = userCredential.user;
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage);
        })
        if (addToCache) {
            localStorage.setItem("user", JSON.stringify(user));

        }

        return user;
    }

    async logout() {
        await localStorage.clear();
        let logouser;
        await onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                logouser = user.uid;
                // ...
            }
        })
        if (logouser) {
            await signOut(auth);

        }
        window.location.reload();
    }
    async uploadPics(pic, name) {
        const storageRef = ref(storage, name);
        await uploadBytes(storageRef, pic).then((snapshot) => {
            console.log('Uploaded a blob or file!');
        });
    }
    async downloadPics(name) {
        let src;
        await getDownloadURL(ref(storage, name)).then((url) => {

            src = url;
        })
        return src;
    }
    deletePics(name) {
        //
        const delRef = ref(storage, name);
        // Delete the file
        deleteObject(delRef).then(() => {
            // File deleted successfully
        }).catch((error) => {
            // Uh-oh, an error occurred!
        });
    }
    /**
         * 
         * @param {*} role 
         * @param {*} id 
         * @param {*} changeData 
         * @returns change any data I want.
         */
    async dispatch(obj, email, dispatch) {

        for (const key in obj) {
            let operate = obj[key];
            for (let i = 0; i < operate.length; i++) {
                const delay = ms => new Promise(res => setTimeout(res, ms));
                await delay(1000);
                let component = key !== "del" ? { ...operate[i].getJson() } : operate[i];
                let localData = await localStorage.getItem("rawData");
                if (localData) {
                    localData = JSON.parse(localData);
                }
                switch (key) {
                    case "add":
                        component.collection = email;
                        if (!component.owner) {
                            component.owner = email
                        }
                        if (component.type === "coachCard") {
                            component.type = "card";
                        }
                        if (component.type === "coachAssignedCard") {
                            component.type = "assignedCard";
                        }
                        if (component.type === "coachRoutine") {
                            component.type = "routine";
                        }
                        component.date = await serverTimestamp();
                        if (localData) {
                            localData.push(component);
                        }
                        await setDoc(doc(db, this.urlEnpoint + "users", this.urlEnpoint + "APP", "components", component._id), component);
                        break;
                    case "del":
                        if (localData) {
                            localData = localData.filter(delObj => { return delObj._id !== component });
                        }


                            await deleteDoc(doc(db, this.urlEnpoint + "users", this.urlEnpoint + "APP", "components", component));
                            break;
                    case "update":
                        
                        if (component.type === "coachCard") {
                            component.type = "card";
                        }
                        if (component.type === "coachAssignedCard") {
                            component.type = "assignedCard";
                        }
                        if (component.type === "coachRoutine") {
                            component.type = "routine";
                        }
                        component.date = await serverTimestamp();
                        if (localData) {

                            for (let updateobj of localData) {
                                if (updateobj._id === component._id) {
                                    updateobj = {...component}
                                }
                            }
                        }
                        await updateDoc(doc(db, this.urlEnpoint + "users", this.urlEnpoint + "APP", "components", component._id), component);
                        break;
                }
                if(localData){
                    localData = JSON.stringify(localData);

                }
                localStorage.setItem("rawData", localData)

            }
        }
        if (dispatch) {
            dispatch({ dispatchComplete: true, data: obj })

        }
    }

}

export default new Auth();