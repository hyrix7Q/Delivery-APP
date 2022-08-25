import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import {
  deleteDoc,
  doc,
  onSnapshot,
  addDoc,
  setDoc,
  updateDoc,
  getDoc,
  collection,
} from "firebase/firestore";
import {
  authentication,
  db,
} from "../../firebase/firebaseConfig/firebaseConfig";

const Map = ({ route, navigation }) => {
  const { order } = route.params;
  const [refusedOrders, setRefusedOrder] = useState([]);

  const onAccept = async () => {
    await setDoc(doc(db, "validatedOrders", order.orderId), {
      ...order,
    })
      .then(async () => {
        const snaphot = await getDoc(
          doc(db, "users", "jobs", "delivery", authentication.currentUser.uid)
        );
        const phoneNumber = snaphot.data().phoneNumber;
        updateDoc(doc(db, "validatedOrders", order.orderId), {
          status: "Accepted",
          deliveryName: authentication.currentUser.displayName,
          deliveryId: authentication.currentUser.uid,
          deliveryPhoneNumber: phoneNumber,
        });
      })
      .then(() => {
        deleteDoc(doc(db, "notValidatedOrders", order.orderId));
        deleteDoc(
          doc(
            db,
            "users",
            "jobs",
            "delivery",
            authentication.currentUser.uid,
            "requestedOrders",
            order.orderId
          )
        );
        setDoc(
          doc(
            db,
            "users",
            "jobs",
            "delivery",
            authentication.currentUser.uid,
            "acceptedOrders",
            order.orderId
          ),
          {
            ...order,
          }
        );
      })
      .then(() => {
        addDoc(collection(db, "validatedOrders", order.orderId, "Tracking"), {
          toDepart: false,
          Shipped: false,
          Transfer: false,
          toDestination: false,
          Delivered: false,
          Payed: false,
          Confirmed: false,
        });
      })
      .then(() => {
        updateDoc(
          doc(db, "users", "jobs", "delivery", authentication.currentUser.uid),
          {
            status: "Not Available",
          }
        );
      })
      .then(() => {
        navigation.navigate("DeliveryHome");
      });
  };

  const fetch = async () => {
    let refusedOrder = [order.orderId];

    const snapshot = await getDoc(
      doc(db, "users", "jobs", "delivery", authentication.currentUser.uid)
    );

    if (snapshot.exists()) {
      snapshot.data().refusedOrders
        ? refusedOrder.push(...snapshot.data().refusedOrders)
        : null;
    }

    return refusedOrder;
  };

  const onRefuse = async () => {
    fetch()
      .then((res) => {
        updateDoc(
          doc(db, "users", "jobs", "delivery", authentication.currentUser.uid),
          {
            refusedOrders: res,
          }
        );
      })
      .then(() => {
        deleteDoc(
          doc(
            db,
            "users",
            "jobs",
            "delivery",
            authentication.currentUser.uid,
            "requestedOrders",
            order.orderId
          )
        );
      })
      .then(() => {
        updateDoc(doc(db, "notValidatedOrders", order.orderId), {
          status: "Refused",
        });
      })
      .then(() => {
        updateDoc(
          doc(db, "users", "jobs", "delivery", authentication.currentUser.uid),
          {
            chosed: false,
          }
        );
      })
      .then(() => {
        navigation.navigate("DeliveryHome");
      });
  };

  return (
    <View style={{ flex: 1, marginTop: "5%" }}>
      <View style={{ height: "60%" }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{ position: "absolute", top: 5, left: 0, zIndex: 1000 }}
        >
          <Image
            source={require("../../assets/leftArrow.png")}
            style={{ marginLeft: 20 }}
          />
        </TouchableOpacity>
        <MapView
          mapType="mutedStandard"
          style={{ flex: 1 }}
          initialRegion={{
            latitude: order?.depart.latitude,
            longitude: order?.depart.longitude,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5,
          }}
        >
          <Marker
            coordinate={{
              latitude: order?.depart.latitude,
              longitude: order?.depart.longitude,
            }}
            draggable={false}
          >
            <View style={{ alignItems: "center" }}>
              <Text
                style={{ fontSize: 16, fontWeight: "bold", color: "black" }}
              >
                Depart
              </Text>
              <Image source={require("../../assets/depart.png")} />
            </View>
          </Marker>
          <Marker
            pinColor={"#474744"}
            coordinate={{
              latitude: order?.destination.latitude,
              longitude: order?.destination.longitude,
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Text
                style={{ fontSize: 16, fontWeight: "bold", color: "black" }}
              >
                Destination
              </Text>
              <Image source={require("../../assets/destination2.png")} />
            </View>
          </Marker>
        </MapView>
      </View>
      <View style={{ height: "40%", marginTop: 10 }}>
        <View style={{ Height: "auto", maxHeight: 150, alignItems: "center" }}>
          <Text style={{ fontSize: 17, color: "black", fontWeight: "bold" }}>
            Order Description:
          </Text>
          <ScrollView
            contentContainerStyle={{
              width: "80%",
            }}
          >
            <Text style={{ fontSize: 16, color: "grey" }}>
              {order.description}
            </Text>
          </ScrollView>
        </View>

        <View
          style={{
            marginTop: "auto",
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginBottom: 25,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "green",
              paddingHorizontal: 25,
              paddingVertical: 7,
              borderRadius: 10,
            }}
            onPress={() => {
              onAccept();
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
              Accept
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "red",
              paddingHorizontal: 25,
              paddingVertical: 7,
              borderRadius: 10,
            }}
            onPress={() => {
              onRefuse(order?.orderId);
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
              Decline
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Map;
