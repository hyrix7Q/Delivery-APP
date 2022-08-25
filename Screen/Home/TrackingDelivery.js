import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  RefreshControl,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import CheckBox from "@react-native-community/checkbox";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig/firebaseConfig";
import * as Location from "expo-location";

const TrackingDelivery = ({ navigation, route }) => {
  const [toDepart, setToDepart] = useState();
  const [shipped, setShipped] = useState();
  const [toDestination, setToDestination] = useState();
  const [transfer, setTransfer] = useState();
  const [Delivered, setDelivered] = useState();
  const [payed, setPayed] = useState();
  const [id, setId] = useState("");
  const [infos, setInfos] = useState();
  const { orders } = route.params;
  const [button, setButton] = useState(false);
  const [location, setLocation] = useState();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [status, setStatus] = useState("");
  console.log("ORDERS", orders);

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  const onPanne = () => {
    getCurrentLocation()
      .then(() => {
        if (toDestination) {
          setStatus("toDestination");
        } else if (transfer) {
          setStatus("Transfer");
        } else {
          setStatus("Shipped");
        }
      })
      .then(() => {
        setDoc(doc(db, "breakdownOrders", orders.orderId), {
          clientId: orders?.clientId,
          clientName: orders?.clientName,
          date: orders?.date,
          depart: {
            latitude: location?.coords.latitude,
            longitude: location?.coords.longitude,
          },
          destination: orders?.destination,
          price: orders?.price,
          status: "Not accepted yet",
          typeOfVehicle: orders?.typeOfVehicle,
          oldTrackingStatus: status,
          clientPhoneNumber: orders?.clientPhoneNumber,
          deliveryPhoneNumber: orders?.deliveryPhoneNumber,
        });
      })
      .then(async () => {
        const array = [];
        const snaphot = await getDocs(
          collection(db, "validatedOrders", orders.orderId, "Tracking")
        );
        snaphot.forEach((doc) => {
          array.push(doc.id);
        });

        updateDoc(
          doc(db, "validatedOrders", orders.orderId, "Tracking", array[0]),
          {
            Delivered: { Delivered: true, timestamp: serverTimestamp() },
            Payed: { Payed: true, timestamp: serverTimestamp() },
            Shipped: { Shipped: true, timestamp: serverTimestamp() },
            Transfer: { Transfer: true, timestamp: serverTimestamp() },
            toDepart: { toDepart: true, timestamp: serverTimestamp() },
            toDestination: {
              toDestination: true,
              timestamp: serverTimestamp(),
            },
          }
        ).then(() => {
          fetchId()
            .then((res) => {
              setId(res?.id);
              setInfos(res.data);

              return res.data;
            })
            .then((infos) => {
              setToDepart(infos?.toDepart.toDepart);
              setShipped(infos?.Shipped.Shipped);
              setTransfer(infos?.Transfer.Transfer);
              setToDestination(infos?.toDestination.toDestination);
              setDelivered(infos?.Delivered.Delivered);
              setPayed(infos?.Payed.Payed);
            });
        });
      });
  };

  const onChange = async (func, variable) => {
    func(!variable);

    return !variable;
  };
  const fetchId = async () => {
    setIsRefreshing(true);
    let id = "";
    let data = [];
    const docRef = collection(
      db,
      "validatedOrders",
      orders.orderId,
      "Tracking"
    );
    const snapshot = await getDocs(docRef);

    snapshot.forEach((doc) => {
      id = doc.id;
      data.push(doc.data());
    });
    setIsRefreshing(false);

    return { id: id, data: data[0] };
  };

  useEffect(() => {
    fetchId()
      .then((res) => {
        setId(res?.id);
        setInfos(res.data);

        return res.data;
      })
      .then((infos) => {
        setToDepart(infos?.toDepart.toDepart);
        setShipped(infos?.Shipped.Shipped);
        setTransfer(infos?.Transfer.Transfer);
        setToDestination(infos?.toDestination.toDestination);
        setDelivered(infos?.Delivered.Delivered);
        setPayed(infos?.Payed.Payed);
      });
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{ marginTop: "5%", flex: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => {
            {
              fetchId()
                .then((res) => {
                  setId(res?.id);
                  setInfos(res.data);

                  return res.data;
                })
                .then((infos) => {
                  setToDepart(infos?.toDepart.toDepart);
                  setShipped(infos?.Shipped.Shipped);
                  setTransfer(infos?.Transfer.Transfer);
                  setToDestination(infos?.toDestination.toDestination);
                  setDelivered(infos?.Delivered.Delivered);
                  setPayed(infos?.Payed.Payed);
                });
            }
          }}
        />
      }
    >
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Image
          source={require("../../assets/leftArrow.png")}
          style={{ marginLeft: 20 }}
        />
      </TouchableOpacity>
      <View style={styles.TitleContainer}>
        <View style={{ alignSelf: "center" }}>
          <Text style={styles.TitleText}>Tracking</Text>
        </View>
      </View>
      <View style={{ paddingHorizontal: 40, flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>To Depart :</Text>
          <Switch
            trackColor={{ false: "red", true: "green" }}
            thumbColor={toDepart ? "white" : "white"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => {
              onChange(setToDepart, toDepart).then((res) => {
                updateDoc(
                  doc(db, "validatedOrders", orders.orderId, "Tracking", id),
                  {
                    toDepart: { toDepart: res, timestamp: serverTimestamp() },
                  }
                );
              });
            }}
            value={toDepart}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>Shipped :</Text>
          <Switch
            disabled={!toDepart}
            trackColor={{ false: "red", true: "green" }}
            thumbColor={shipped ? "white" : "white"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => {
              onChange(setShipped, shipped).then((res) => {
                updateDoc(
                  doc(db, "validatedOrders", orders.orderId, "Tracking", id),
                  {
                    Shipped: { Shipped: res, timestamp: serverTimestamp() },
                  }
                );
              });
            }}
            value={shipped}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>Transfer :</Text>
          <Switch
            disabled={!shipped}
            trackColor={{ false: "red", true: "green" }}
            thumbColor={transfer ? "white" : "white"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={async () => {
              onChange(setTransfer, transfer).then((res) => {
                updateDoc(
                  doc(db, "validatedOrders", orders.orderId, "Tracking", id),
                  {
                    Transfer: { Transfer: res, timestamp: serverTimestamp() },
                  }
                );
              });
            }}
            value={transfer}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            To Destination :
          </Text>
          <Switch
            disabled={!transfer}
            trackColor={{ false: "red", true: "green" }}
            thumbColor={toDestination ? "white" : "white"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => {
              onChange(setToDestination, toDestination).then((res) => {
                updateDoc(
                  doc(db, "validatedOrders", orders.orderId, "Tracking", id),
                  {
                    toDestination: {
                      toDestination: res,
                      timestamp: serverTimestamp(),
                    },
                  }
                );
              });
            }}
            value={toDestination}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>Delivered :</Text>
          <Switch
            disabled={!toDestination}
            trackColor={{ false: "red", true: "green" }}
            thumbColor={Delivered ? "white" : "white"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => {
              onChange(setDelivered, Delivered).then((res) => {
                updateDoc(
                  doc(db, "validatedOrders", orders.orderId, "Tracking", id),
                  {
                    Delivered: { Delivered: res, timestamp: serverTimestamp() },
                  }
                );
              });
            }}
            value={Delivered}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>Payed :</Text>
          <Switch
            disabled={!Delivered}
            trackColor={{ false: "red", true: "green" }}
            thumbColor={payed ? "white" : "white"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => {
              onChange(setPayed, payed).then((res) => {
                updateDoc(
                  doc(db, "validatedOrders", orders.orderId, "Tracking", id),
                  {
                    Payed: { Payed: res, timestamp: serverTimestamp() },
                  }
                );
              });
            }}
            value={payed}
          />
        </View>
      </View>
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 20,
          left: 40,

          alignSelf: "center",
        }}
        onPress={() => {
          if (shipped && !Delivered) {
            setButton(true);
          }
        }}
      >
        <Text style={{ color: "#EA0039", fontSize: 16 }}>
          Something went wrong ?
        </Text>
      </TouchableOpacity>
      {button && (
        <TouchableOpacity
          style={{
            marginTop: 30,
            position: "absolute",
            bottom: 20,
            right: 40,
            alignSelf: "center",
          }}
          onPress={onPanne}
        >
          <Text style={{ color: "black", fontSize: 16, fontWeight: "bold" }}>
            Get Current Location
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  TitleText: {
    color: "#EA0039",
    fontSize: 38,
    fontWeight: "bold",
  },

  TitleContainer: {
    marginLeft: "10%",
    marginRight: "30%",
    marginBottom: "17%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
});

export default TrackingDelivery;
