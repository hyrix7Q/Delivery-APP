import { async } from "@firebase/util";
import React from "react";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import {
  authentication,
  db,
} from "../../firebase/firebaseConfig/firebaseConfig";
import Order from "../../models/order";
export const FETCH_ORDERS = "FETCH_ORDERS";
export const GET_JOB = "GET_JOB";

export const fetchOrders = () => {
  return async (dispatch) => {
    const ordersArray = [];

    const p = query(
      collection(db, "validatedOrders"),
      where("clientId", "==", authentication.currentUser.uid)
    );
    const FirstQuerySnapshot = await getDocs(p);
    const q = query(
      collection(db, "notValidatedOrders"),
      where("clientId", "==", authentication.currentUser.uid),
      orderBy("date", "desc")
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      ordersArray.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    FirstQuerySnapshot.forEach((doc) => {
      ordersArray.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    dispatch({
      type: FETCH_ORDERS,
      orders: ordersArray,
    });
  };
};
