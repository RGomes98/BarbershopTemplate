import { redirect } from 'next/navigation';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

import { getDatabase, ref, child, get } from "firebase/database";

import {auth, database} from '../../firebase';

import firebase from 'firebase/app';
import { UserData } from '@/models/UserData';

export const getHairCuts = () => {

    const dbRef = ref(database);
    const user = auth.currentUser


    get(child(dbRef, `haircuts/${user?.uid}`)).then((snapshot) => {
        if (snapshot.exists()) {
            // snapshot gonna be a array of appointments 
            // on firebase will be haircuts -> userID -> randomtimestamp -> appointment
          console.log(snapshot.val());
          redirect("/")

        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });

        
       
  };


  export const getHairCut = (id : string) => {

    const dbRef = ref(database);
    const user = auth.currentUser

    get(child(dbRef, `haircuts/${user?.uid}`)).then((snapshot) => {
        if (snapshot.exists()) {
            // snapshot gonna be a array of appointments 
            // on firebase will be haircuts -> userID -> randomtimestamp -> appointment
            // need to filter bytimeStamp
          console.log(snapshot.val());
        redirect("/")
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });
           
  };