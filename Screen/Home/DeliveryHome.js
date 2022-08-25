import {
  View,
  Text,
  Button,
  Alert,
  TouchableOpacity,
  Image,
  Switch,
  RefreshControl,
  ScrollView,
} from "react-native";
import React, {
  useEffect,
  useState,
  useLayoutEffect,
  useCallback,
} from "react";
import {
  authentication,
  db,
} from "../../firebase/firebaseConfig/firebaseConfig";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { deleteUser, signOut } from "firebase/auth";
import MapScreen from "./Client/MapScreen";
import * as Location from "expo-location";

const DeliveryHome = ({ navigation }) => {
  const user = authentication.currentUser;
  const [data, setData] = React.useState();
  const [location, setLocation] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [isEnabled, setIsEnabled] = useState();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [availableButton, setAvailableButton] = useState();
  const [isAccepted, setIsAccepted] = useState();

  const toggleSwitch = async () => {
    setIsEnabled((previousState) => !previousState);
  };
  const fetchStatus = async () => {
    setIsRefreshing(true);
    const q = doc(
      db,
      "users",
      "jobs",
      "delivery",
      authentication.currentUser.uid
    );
    const snapshot = await getDoc(q);

    if (snapshot.exists()) {
      setIsEnabled(snapshot.data().status === "Available" ? true : false);
    }
    console.log("HEEEEEEEEEERE");
    setIsRefreshing(false);
  };
  useEffect(() => {
    fetchStatus();
  }, [navigation]);

  useEffect(() => {
    const fetchDeliveryStatus = async () => {
      const docRef = collection(db, "validatedOrders");
      const q = query(
        docRef,
        where("deliveryId", "==", authentication.currentUser.uid),
        where("status", "!=", "Delivered")
      );
      const snapshot = await getDocs(q);
      let Status = [];

      snapshot.forEach((doc) => {
        Status.push(1);
      });

      return Status.length;
    };

    fetchDeliveryStatus().then((res) => {
      if (res) {
        setAvailableButton(false);
      } else {
        setAvailableButton(true);
      }
    });
  }, []);

  useLayoutEffect(() => {
    const fetchModal = async () => {
      const length = [];
      const docRef = doc(
        db,
        "users",
        "jobs",
        "delivery",
        authentication.currentUser.uid
      );
      const snapShot = await getDoc(docRef);

      if (!snapShot?.data().Wilaya) {
        navigation.navigate("Modal");
      }
    };

    fetchModal();
  }, []);

  useLayoutEffect(() => {
    const isAcceptedFetch = async () => {
      const docRef = doc(
        db,
        "users",
        "jobs",
        "delivery",
        authentication.currentUser.uid
      );
      const snapShot = await getDoc(docRef);

      if (snapShot?.data()?.Accepted) {
        return { accepted: true };
      }

      if (!snapShot?.data()?.Accepted) {
        if (snapShot?.data()?.Declined) {
          return { Declined: true, accepted: false };
        }
      }
      return { accepted: false, Declined: false };
    };
    isAcceptedFetch().then((res) => {
      setIsAccepted(res);
    });
  }, []);

  const onSubmit = async () => {
    await updateDoc(
      doc(db, "users", "jobs", "delivery", authentication.currentUser.uid),
      {
        status: isEnabled ? "Available" : "notAvailable",
        currentLocation: {
          lat: location.coords.latitude,
          long: location.coords.longitude,
        },
      }
    );
    Alert.alert("You are now available ", "", [{ text: "Okay" }]);
  };

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  const deleteAccount = async () => {
    let user = authentication.currentUser;
    let id = authentication.currentUser.uid;
    deleteUser(user)
      .then(() => {
        deleteDoc(doc(db, "users", "jobs", "delivery", id));
      })
      .catch((error) => {
        Alert.alert("Error has occurred", error.message, [{ text: "Okay" }]);
      });
  };

  return (
    <>
      {isAccepted?.accepted ? (
        <ScrollView
          contentContainerStyle={{ flex: 1, backgroundColor: "#EA0039" }}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={fetchStatus} />
          }
        >
          <View
            style={{
              backgroundColor: "#EA0039",
              height: 200,
              zIndex: -1,
              paddingTop: 50,
            }}
          >
            <TouchableOpacity
              style={{ marginTop: -30, paddingLeft: 10 }}
              onPress={() => {
                navigation.toggleDrawer();
              }}
            >
              <Image
                source={require("../../assets/drawer.png")}
                style={{ height: 45, width: 45 }}
              />
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                marginRight: "6%",
                justifyContent: "center",
              }}
            >
              <View style={{ marginLeft: "4%" }}>
                <Text
                  style={{
                    color: "white",
                    fontSize: 60,
                    letterSpacing: 20,
                    fontWeight: "600",
                    fontFamily: "pop",
                  }}
                >
                  Tawsil
                </Text>
                <Text
                  style={{
                    color: "white",
                    fontSize: 20,
                    fontWeight: "600",
                    alignSelf: "center",
                    position: "relative",
                    bottom: 10,
                    fontFamily: "pop",
                  }}
                >
                  For Fast Delivery
                </Text>
              </View>
              {/* <Image
            source={require("../../../assets/clientHomeIcon.png")}
            style={{ height: 160, width: 160 }}
            /> */}
            </View>
          </View>
          <View
            style={{
              height: "85%",
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25,
              backgroundColor: "white",
              zIndex: 1,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 20,
                marginTop: 25,
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "600" }}>
                Are you available?
              </Text>
              <Switch
                disabled={!availableButton}
                trackColor={{ false: "red", true: "green" }}
                thumbColor={isEnabled ? "white" : "white"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </View>
            <TouchableOpacity
              style={{
                width: "70%",
                alignSelf: "center",
                marginTop: 40,
              }}
              onPress={getCurrentLocation}
            >
              <View
                style={{
                  borderWidth: 0.3,
                  borderColor: "grey",

                  borderRadius: 25,
                  padding: 10,
                  flexDirection: "row",
                  paddingHorizontal: 20,
                  justifyContent: "center",
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
                <View style={{ flexGrow: 1, alignSelf: "center" }}>
                  <Text
                    style={{ color: "black", fontWeight: "bold", fontSize: 16 }}
                  >
                    Set Current Location
                  </Text>
                </View>
                <Image
                  source={
                    location
                      ? require("../../assets/true.png")
                      : require("../../assets/false.png")
                  }
                  style={{ height: 25, width: 25 }}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#EA0039",
                marginTop: 70,
                alignSelf: "center",
                paddingHorizontal: 40,
                paddingVertical: 10,
                borderRadius: 25,
              }}
              onPress={onSubmit}
              disabled={!location}
            >
              <Text
                style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
              >
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : isAccepted?.Declined ? (
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
          <Text
            style={{
              paddingHorizontal: 40,
              fontSize: 20,
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            Sorry your request has been Refused by the Admin ! Maybe try to
            register again ! and insert more clear information
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: "#EA0039",
              alignSelf: "center",
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}
            onPress={deleteAccount}
          >
            <Text style={{ color: "white" }}>Okay</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            marginTop: "5%",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 18 }}>
            Your request to join this company as a Delivery man has been sent to
            our support ! For now your Request has not been accepted yet ! Check
            again later !
          </Text>

          <TouchableOpacity
            onPress={() => {
              signOut(authentication);
            }}
            style={{
              position: "absolute",
              bottom: 0,
              marginBottom: 40,
              backgroundColor: "#EA0039",
              paddingHorizontal: 40,
              paddingVertical: 10,
              borderRadius: 25,
            }}
          >
            <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default DeliveryHome;
