import firebase from "firebase/app";
import "firebase/database"
import "firebase/auth"

//Code from https://colinhacks.com/essays/nextjs-firebase-authentication

const CLIENT_CONFIG = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    appId: ""
} //Add your configuration here

firebase.initializeApp(CLIENT_CONFIG);
const db = firebase.database();
const auth = firebase.auth();

const getAccess = async () => {
    const user = await auth.signInWithEmailAndPassword('', '').catch(error => {
        console.error("Error signing in with password and email", error);
    });

    console.log(user)
}

const userExist = async (id: string) => {
    try {
        const ref = db.ref().child('UserAccess').child(id);
        let result = await ref.once('value');
        console.log(result.val());
        return result.val();
    } catch (error) {
        console.log(error)
        return false;
    }

}

const getApp = async (id: string) => {
    try {
        const ref = db.ref().child('Apps').child(id);
        let result = await ref.once('value');
        console.log(result.val());
        return result.val();
    } catch (error) {
        console.log(error)
        return false;
    }
}

export { getAccess, userExist, getApp };
