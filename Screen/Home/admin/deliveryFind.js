import {
  View,
  Text,
  TouchableOpacity,
  Button,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig/firebaseConfig";

const DeliveryFind = ({ route, navigation }) => {
  const { order, fromRefused, fromBreakDown } = route.params;
  const [deliveryMen, setDeliveryMen] = useState();

  function calcCrow(lat1, lon1, lat2, lon2) {
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }

  // Converts numeric degrees to radians
  function toRad(Value) {
    return (Value * Math.PI) / 180;
  }
  {
    /*  calcCrow(
    order.depart.latitude,
    order.depart.longitude,
    doc.data().currentLocation.lat,
    doc.data().currentLocation.long
),*/
  }

  const onChose = async (deliveryId) => {
    await setDoc(
      doc(
        db,
        "users",
        "jobs",
        "delivery",
        deliveryId,
        "requestedOrders",
        order.orderId
      ),
      {
        ...order,
      }
    );
    updateDoc(doc(db, "notValidatedOrders", order.orderId), {
      status: "Waiting",
      deliveryId: deliveryId,
    })
      .then(() => {
        updateDoc(doc(db, "users", "jobs", "delivery", deliveryId), {
          chosed: true,
        });
      })
      .then(() => {
        Alert.alert("Delivery man chosen!", "Search for another order ", [
          {
            text: "Okay",
            onPress: () => {
              navigation.navigate("Home");
            },
          },
        ]);
      });
  };

  useEffect(() => {
    const fetchDelivery = async () => {
      const deliverys = [];
      const deliverysTwo = [];
      console.log(order.typeOfVehicle);
      const q = query(
        collection(db, "users", "jobs", "delivery"),
        where("chosed", "==", false),
        where("status", "==", "Available"),
        where("TypeOfVehicle", "==", order.typeOfVehicle),
        where("Accepted", "==", true)
      );
      const snapshot = await getDocs(q);

      console.log("ORDER", order);
      snapshot.forEach((doc) => {
        deliverys.push({
          DeliveryId: doc.id,
          ...doc.data(),
          distance: calcCrow(
            order.depart.latitude,
            order.depart.longitude,
            doc.data().currentLocation.lat,
            doc.data().currentLocation.long
          ),
        });
      });
      snapshot.forEach((doc) => {
        if (!doc.data().refusedOrders?.includes(order.orderId)) {
          deliverysTwo.push({
            DeliveryId: doc.id,
            ...doc.data(),
            distance: calcCrow(
              order.depart.latitude,
              order.depart.longitude,
              doc.data().currentLocation.lat,
              doc.data().currentLocation.long
            ),
          });
        }
      });

      return fromRefused ? deliverysTwo : deliverys;
    };

    fetchDelivery().then((res) => {
      res?.sort(function (a, b) {
        return a.distance - b.distance;
      });
      console.log("HEEERE", res);
      setDeliveryMen(res);
    });
  }, []);
  return (
    <View style={{ marginTop: "5%" }}>
      <TouchableOpacity
        style={{ marginRight: 30, marginLeft: 20 }}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Image source={require("../../../assets/leftArrow.png")} style={{}} />
      </TouchableOpacity>
      <View style={styles.TitleContainer}>
        <View style={{ alignSelf: "center" }}>
          <Text style={styles.TitleText}>Available Delivery men</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ marginTop: 20 }}>
        {deliveryMen?.map((delivery, index) => (
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: 20,
              marginBottom: 10,
              borderWidth: 0,
              borderColor: "grey",
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 5,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.5,
              shadowRadius: 1.41,
              elevation: 2,
            }}
          >
            <View
              style={{
                flexGrow: 1,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View>
                <Image
                  source={require("../../../assets/avatar.png")}
                  style={{ height: 55, width: 55, borderRadius: 22.5 }}
                />
              </View>
              <View style={{ marginLeft: 5 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {delivery.displayName}
                </Text>
              </View>
            </View>
            {!fromBreakDown && (
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  paddingHorizontal: 30,
                  backgroundColor: "#EA0039",
                  borderRadius: 10,
                }}
                onPress={() => {
                  onChose(delivery.DeliveryId);
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
                >
                  Pick
                </Text>
              </TouchableOpacity>
            )}
            {fromBreakDown && (
              <View style={{ alignSelf: "center", marginRight: 10 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  {delivery.phoneNumber}
                </Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  TitleText: {
    color: "#EA0039",
    fontSize: 38,
    fontWeight: "bold",
  },
  TitleContainer: {
    marginTop: "7%",

    marginLeft: "10%",
    marginRight: "30%",
    marginBottom: "10%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});

export default DeliveryFind;
