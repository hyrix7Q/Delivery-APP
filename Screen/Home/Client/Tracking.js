import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig/firebaseConfig";

const Tracking = ({ route, navigation }) => {
  const { clientId, orderId, deliveryId } = route.params;

  const [id, setId] = useState("");
  const [infos, setInfos] = useState();
  const [date, setDate] = useState();

  const onConfirm = async () => {
    updateDoc(doc(db, "validatedOrders", orderId, "Tracking", id), {
      Confirmed: { Confirmed: true, timestamp: serverTimestamp() },
    })
      .then(() => {
        updateDoc(doc(db, "validatedOrders", orderId), {
          status: "Delivered",
        });
      })
      .then(() => {
        updateDoc(doc(db, "users", "jobs", "delivery", deliveryId), {
          chosed: false,
        });
      })
      .then(() => {
        navigation.navigate("Home");
      });
  };

  const fetchId = async () => {
    let id = "";
    let data = [];
    const docRef = collection(db, "validatedOrders", orderId, "Tracking");
    const snapshot = await getDocs(docRef);

    snapshot.forEach((doc) => {
      id = doc.id;
      data.push(doc.data());
    });

    return { id: id, data: data[0] };
  };
  useEffect(() => {
    const fetchId = async () => {
      let id = "";
      let data = [];
      const docRef = collection(db, "validatedOrders", orderId, "Tracking");
      const snapshot = await getDocs(docRef);

      snapshot.forEach((doc) => {
        id = doc.id;
        data.push(doc.data());
      });

      return { id: id, data: data[0] };
    };
    fetchId().then((res) => {
      setId(res?.id);
      setInfos(res.data);
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
          <Text style={styles.TitleText}>Tracking</Text>
        </View>
      </View>
      {infos?.toDepart ? (
        <View>
          <ScrollView
            contentContainerStyle={{
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <View style={{ maxWidth: "60%", marginRight: 5 }}>
              <View style={{ backgroundColor: "#EA0039" }}>
                <Text
                  style={{
                    color: "white",
                    fontSize: 20,
                    fontWeight: "bold",
                    alignSelf: "center",
                    paddingVertical: 8,
                  }}
                >
                  Date
                </Text>
              </View>
              {infos?.toDepart && (
                <View style={[styles.width, styles.backgroundColorOne]}>
                  <Text style={styles.timestampText}>
                    {new Date(infos?.toDepart.timestamp.toDate()).toUTCString()}
                  </Text>
                </View>
              )}
              {infos?.Shipped && (
                <View style={[styles.width, styles.backgroundColorTwo]}>
                  <Text style={styles.timestampText}>
                    {new Date(infos?.Shipped.timestamp.toDate()).toUTCString()}
                  </Text>
                </View>
              )}
              {infos?.Transfer && (
                <View style={[styles.width, styles.backgroundColorOne]}>
                  <Text style={styles.timestampText}>
                    {new Date(infos?.Transfer.timestamp.toDate()).toUTCString()}
                  </Text>
                </View>
              )}
              {infos?.toDestination && (
                <View style={[styles.width, styles.backgroundColorTwo]}>
                  <Text style={styles.timestampText}>
                    {new Date(
                      infos?.toDestination.timestamp.toDate()
                    ).toUTCString()}
                  </Text>
                </View>
              )}
              {infos?.Delivered && (
                <View style={[styles.width, styles.backgroundColorOne]}>
                  <Text style={styles.timestampText}>
                    {new Date(
                      infos?.Delivered.timestamp.toDate()
                    ).toUTCString()}
                  </Text>
                </View>
              )}
            </View>
            <View>
              <View style={{ backgroundColor: "#EA0039" }}>
                <Text
                  style={{
                    color: "white",
                    fontSize: 20,
                    fontWeight: "bold",
                    alignSelf: "center",
                    paddingVertical: 8,
                  }}
                >
                  Status
                </Text>
              </View>
              {infos?.toDepart && (
                <View
                  style={[
                    styles.width,
                    styles.backgroundColorOne,
                    { width: "100%" },
                  ]}
                >
                  <Text style={styles.timestampText}>To Depart</Text>
                </View>
              )}
              {infos?.Shipped && (
                <View
                  style={[
                    styles.width,
                    styles.backgroundColorTwo,
                    { width: "100%" },
                  ]}
                >
                  <Text style={styles.timestampText}>Shipped</Text>
                </View>
              )}
              {infos?.Transfer && (
                <View
                  style={[
                    styles.width,
                    styles.backgroundColorOne,
                    { width: "100%" },
                  ]}
                >
                  <Text style={styles.timestampText}>Transfer</Text>
                </View>
              )}
              {infos?.toDestination && (
                <View
                  style={[
                    styles.width,
                    styles.backgroundColorTwo,
                    { width: "100%" },
                  ]}
                >
                  <Text style={styles.timestampText}>In Destination</Text>
                </View>
              )}
              {infos?.Delivered && (
                <View
                  style={[
                    styles.width,
                    styles.backgroundColorOne,
                    { width: "100%" },
                  ]}
                >
                  <Text style={styles.timestampText}>Delivered</Text>
                </View>
              )}
            </View>
          </ScrollView>

          {infos?.Payed.Payed && !infos?.Confirmed.Confirmed && (
            <TouchableOpacity
              style={{
                paddingHorizontal: 40,
                paddingVertical: 10,
                backgroundColor: "#EA0039",
                alignItems: "center",
                alignSelf: "center",
                borderRadius: 20,
                marginTop: 40,
              }}
              onPress={onConfirm}
            >
              <Text
                style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
              >
                Confirm Delivery
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 18 }}>
            Delivering has not started yet... Check again later
          </Text>
        </View>
      )}
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
  width: {
    maxWidth: "100%",
    height: 60,
    paddingHorizontal: 5,
    alignSelf: "center",
    marginTop: 5,
  },
  timestampText: {
    fontSize: 19,
    alignSelf: "center",
  },
  backgroundColorOne: {
    backgroundColor: "#CBCBCB",
  },
  backgroundColorTwo: {
    backgroundColor: "#F0F0F0",
  },
});

export default Tracking;
