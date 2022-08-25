import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig/firebaseConfig";

const Order = ({
  type,
  date,
  price,
  status,
  navigation,
  orderId,
  clientId,
  description,
  deliveryId,
}) => {
  const newDate = new Date(date?.toDate());
  const [canCancel, setCanCancel] = useState(false);

  const onCancel = async () => {
    const docRef = doc(db, "notValidatedOrders", orderId);
    const snapShot = await getDoc(docRef);
    let snapShotData = { ...snapShot.data() };

    if (snapShot.exists()) {
      if (
        snapShot?.data()?.status === "Not accepted yet" ||
        snapShot?.data()?.status === "Refused"
      ) {
        deleteDoc(doc(db, "notValidatedOrders", orderId));
      } else if (snapShot.data().status === "Waiting") {
        setDoc(
          doc(
            db,
            "users",
            "jobs",
            "delivery",
            deliveryId,
            "canceledOrders",
            orderId
          ),
          {
            ...snapShot.data(),
          }
        )
          .then(() => {
            deleteDoc(doc(db, "notValidatedOrders", orderId));
          })
          .then(() => {
            updateDoc(doc(db, "users", "jobs", "delivery", deliveryId), {
              chosed: false,
            });
          })
          .then(() => {
            deleteDoc(
              doc(
                db,
                "users",
                "jobs",
                "delivery",
                deliveryId,
                "requestedOrders",
                orderId
              )
            );
          });
      }
    } else {
      let id = "";
      let data = [];
      const docReff = collection(db, "validatedOrders", orderId, "Tracking");
      const snapshott = await getDocs(docReff);

      snapshott.forEach((doc) => {
        id = doc.id;
        data.push(doc.data());
      });
      console.log(data[0].Shipped);

      if (data[0].Shipped === false || data[0].Shipped?.Shipped === false) {
        const docRefs = doc(db, "validatedOrders", orderId);
        const snapShots = await getDoc(docRefs);

        setDoc(
          doc(
            db,
            "users",
            "jobs",
            "delivery",
            deliveryId,
            "canceledOrders",
            orderId
          ),
          {
            ...snapShots.data(),
          }
        )
          .then(() => {
            deleteDoc(doc(db, "validatedOrders", orderId));
          })
          .then(() => {
            deleteDoc(
              doc(
                db,
                "users",
                "jobs",
                "delivery",
                deliveryId,
                "acceptedOrders",
                orderId
              )
            );
          })
          .then(() => {
            deleteDoc(doc(db, "validatedOrders", orderId, "Tracking", id));
          })
          .then(() => {
            updateDoc(doc(db, "users", "jobs", "delivery", deliveryId), {
              status: "Available",
              chosed: false,
              canceled: true,
            });
          });
      } else {
        Alert.alert(
          "Order has already been Shipped",
          "You can't cancel a shipped order",
          [{ text: "Okay" }]
        );
      }
    }
  };

  const showAlert = async () => {
    Alert.alert(
      "",
      "In order to cancel the order you have to pay 10% of the price !",
      [
        {
          text: "PayPal",
          onPress: () => {
            navigation.navigate("Paypal1", {
              price: price / 10,
            });
          },
        },
        {
          text: "CCP",
          onPress: () => {
            navigation.navigate("Ccp", {
              price: price / 5,
              onCancel,
            });
          },
        },
      ]
    );
  };

  const [Matricule, setMatricule] = useState();

  useEffect(() => {
    const fetchMatricule = async () => {
      const docRef = doc(db, "users", "jobs", "delivery", deliveryId);
      const snapshot = await getDoc(docRef);

      return snapshot.data().Matricule;
    };
    if (status === "Accepted" || status === "Delivered") {
      fetchMatricule().then((res) => {
        setMatricule(res);
      });
    }
  }, []);
  return (
    <View style={styles.orderContainer}>
      <View style={{}}>
        <Text style={{ fontSize: 19, fontWeight: "bold" }}>
          Delivery by {type}
        </Text>
      </View>
      <View style={{ paddingVertical: 7 }}>
        <Text
          style={{ width: "75%", color: "grey", fontSize: 15, marginBottom: 5 }}
          numberOfLines={1}
        >
          {description}
        </Text>

        <Text style={{ width: "75%", color: "grey", fontSize: 15 }}>
          Price : {price}DA
        </Text>
        <Text
          style={{
            width: "75%",
            color:
              status === "Accepted" || status === "Delivered"
                ? "green"
                : status === "Waiting"
                ? "orange"
                : "red",
            fontSize: 15,
          }}
        >
          Status : {status === "Refused" ? "Not accepted yet" : status}
        </Text>
        <Text style={{ width: "75%", color: "grey", fontSize: 15 }}>
          Ordered in : {newDate.toUTCString()}
        </Text>
        {Matricule && (
          <Text style={{ width: "75%", color: "grey", fontSize: 15 }}>
            Matricule : {Matricule}
          </Text>
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <TouchableOpacity
          style={styles.buttons}
          onPress={() => {
            navigation.navigate("Tracking", {
              orderId: orderId,
              clientId: clientId,
              deliveryId: deliveryId,
            });
          }}
        >
          <Text style={styles.buttonTexts}>Tracking</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttons} onPress={showAlert}>
          <Text style={styles.buttonTexts}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  orderContainer: {
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: "80%",
    borderWidth: 0,
    borderColor: "grey",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.41,
    elevation: 10,
    alignSelf: "center",
  },
  buttonTexts: { color: "white", fontSize: 16, fontWeight: "bold" },
  buttons: {
    backgroundColor: "#EA0039",
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 10,
  },
});

export default Order;
