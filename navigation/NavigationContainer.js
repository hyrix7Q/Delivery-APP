import { View, Text } from "react-native";
import React, { useEffect, useLayoutEffect, useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  AdminDrawerNavigator,
  AdminNavigator,
  AuthNavigator,
  DeliveryDrawerNavigator,
  DeliveryHomeNavigator,
  DrawerNavigator,
} from "./NavigationApp";
import { onAuthStateChanged } from "firebase/auth";
import { authentication, db } from "../firebase/firebaseConfig/firebaseConfig";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";

const NavContainer = () => {
  const [user, setUser] = React.useState();
  const [job, setJob] = React.useState();
  const [isAdmin, setIsAdmin] = React.useState(false);

  onAuthStateChanged(authentication, (user) => {
    console.log("user", user);
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
  });

  useEffect(() => {
    const getJobs = async () => {
      if (user) {
        if (authentication.currentUser.email === "admin@gmail.com") {
          setIsAdmin(true);
        } else {
          const docRef = doc(
            db,
            "users",
            "jobs",
            "delivery",
            authentication.currentUser.uid
          );
          const docSnap = await getDoc(docRef);

          if (docSnap?.exists()) {
            return "delivery";
          } else {
            const docRefClient = doc(
              db,
              "users",
              "jobs",
              "client",
              authentication.currentUser.uid
            );
            const docSnapClient = await getDoc(docRefClient);

            if (docSnapClient?.exists()) {
              return "client";
            }
          }
        }
      }
    };
    getJobs()
      .then((res) => {
        console.log("res", res);
        setJob(res);
      })
      .then(() => {
        console.log("job", job);
      });
  }, [user]);

  return (
    <NavigationContainer>
      {!user && <AuthNavigator />}
      {user && isAdmin && <AdminDrawerNavigator />}
      {user && job === "delivery" && <DeliveryDrawerNavigator />}
      {user && job === "client" && <DrawerNavigator />}
    </NavigationContainer>
  );
};

export default NavContainer;
