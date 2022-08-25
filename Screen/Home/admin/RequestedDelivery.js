import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig/firebaseConfig";

const RequestedDelivery = ({ navigation }) => {
  const [deliverys, setDeliverys] = useState();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const requestedDeliverys = async () => {
    setIsRefreshing(true);

    const docRef = collection(db, "users", "jobs", "delivery");
    const q = query(
      docRef,
      where("Accepted", "==", false),
      where("Declined", "==", false)
    );
    const snapshot = await getDocs(q);
    let deliverys = [];

    snapshot.forEach((doc) => {
      deliverys.push({ docId: doc.id, ...doc.data() });
    });
    setIsRefreshing(false);

    return deliverys;
  };
  useEffect(() => {
    requestedDeliverys().then((res) => {
      setDeliverys(res);
    });
  }, []);

  const onAccept = async (id) => {
    const docRef = doc(db, "users", "jobs", "delivery", id);
    await updateDoc(docRef, {
      Accepted: true,
    });
  };

  const onDecline = async (id) => {
    const docRef = doc(db, "users", "jobs", "delivery", id);
    updateDoc(docRef, {
      Declined: true,
    }).then(() => {
      requestedDeliverys().then((res) => {
        setDeliverys(res);
      });
    });
  };

  return (
    <ScrollView
      contentContainerStyle={{
        marginTop: "5%",
        flex: 1,
        backgroundColor: "#F6F6F6",
      }}
    >
      <View>
        <ScrollView
          contentContainerStyle={styles.TitleContainer}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => {
                requestedDeliverys().then((res) => {
                  setDeliverys(res);
                });
              }}
            />
          }
        >
          <TouchableOpacity
            style={{ marginRight: 30 }}
            onPress={() => {
              navigation.toggleDrawer();
            }}
          >
            <Image
              source={require("../../../assets/drawer2.png")}
              style={{ height: 35, width: 35 }}
            />
          </TouchableOpacity>
          <View style={{ alignSelf: "center" }}>
            <Text style={styles.TitleText}>Requested Deliverys</Text>
          </View>
        </ScrollView>
      </View>
      <View style={{ flex: 1, paddingHorizontal: 50 }}>
        <ScrollView contentContainerStyle={{}}>
          {deliverys?.map((delivery, index) => (
            <View
              key={index}
              style={{
                marginTop: 5,
                alignSelf: "center",
                paddingVertical: 10,
                marginBottom: 30,
                backgroundColor: "white",
                borderColor: "grey",
                borderWidth: 0,
                width: "95%",
                shadowColor: "#000",
                borderRadius: 10,
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowOpacity: 0.5,
                shadowRadius: 1.41,
                elevation: 10,
              }}
            >
              <View style={{ alignItems: "center" }}>
                <View style={{ alignItems: "center", marginBottom: 10 }}>
                  <Image
                    source={require("../../../assets/avatar.png")}
                    style={{ height: 60, width: 60 }}
                  />
                  <Text
                    style={{
                      marginTop: 5,
                      marginLeft: 10,
                      fontSize: 18,
                      fontWeight: "bold",
                      alignSelf: "center",
                    }}
                  >
                    {delivery.displayName}
                  </Text>
                </View>
                <View style={{ marginBottom: 20 }}>
                  <Text style={styles.text}>
                    {" "}
                    Wilaya : <Text style={styles.text}>{delivery.Wilaya}</Text>
                  </Text>
                  <Text style={styles.text}>
                    {" "}
                    Type Of Vehicle :{" "}
                    <Text style={styles.text}>{delivery.TypeOfVehicle}</Text>
                  </Text>
                  <Text style={styles.text}>
                    {" "}
                    Name Of The {delivery.TypeOfVehicle} :
                    <Text style={styles.text}>{delivery.NameOfVehicle}</Text>{" "}
                  </Text>
                  <Text style={styles.text}>
                    {" "}
                    Matricule :{" "}
                    <Text style={styles.text}>{delivery.Matricule}</Text>
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      backgroundColor: "green",
                      paddingHorizontal: 25,
                      paddingVertical: 7,
                      marginRight: 10,
                      borderRadius: 10,
                    }}
                    onPress={() => {
                      onAccept(delivery.docId);
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
                    >
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
                      onDecline(delivery.docId);
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 16,
                        fontWeight: "bold",
                      }}
                    >
                      Decline
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  text: { color: "grey", fontSize: 16 },
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

export default RequestedDelivery;
