import {
  View,
  Text,
  Button,
  ScrollView,
  TextInput,
  Image,
  Picker,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import {
  authentication,
  db,
} from "../../firebase/firebaseConfig/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Wilayas } from "./Wilayas";

const Modal = ({ navigation }) => {
  const [data, setData] = React.useState();
  const [type, setType] = React.useState("Car");
  const [name, setName] = React.useState("");
  const [matricule, setMatricule] = React.useState("");
  const [wilaya, setWilaya] = React.useState("");

  const isNotValidForm = !type || !name || !matricule || !wilaya;

  useEffect(() => {
    const getData = async () => {
      const docRef = doc(
        db,
        "users",
        "jobs",
        "delivery",
        authentication.currentUser.uid
      );
      const docSnap = await getDoc(docRef);
      setData(docSnap.data());
    };
    getData();
  }, []);

  const updateProfile = async () => {
    await setDoc(
      doc(db, "users", "jobs", "delivery", authentication.currentUser.uid),
      {
        ...data,
        TypeOfVehicle: type,
        NameOfVehicle: name,
        Matricule: matricule,
        Wilaya: wilaya,
        chosed: false,
        Accepted: false,
        Declined: false,
      }
    ).then(() => {
      navigation.navigate("DeliveryHome");
    });
  };

  return (
    <ScrollView style={{ marginTop: "5%", flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Icon or Text*/}

        <Image
          source={require("../../assets/ProjectIcon.png")}
          style={{ width: 80, height: 80 }}
        />
      </View>
      <View
        style={{
          marginVertical: "4%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 25, fontWeight: "bold" }}>Welcome</Text>
        <Text style={{ fontSize: 25, fontWeight: "bold", color: "#EA0039" }}>
          {" "}
          {authentication.currentUser.displayName}
        </Text>
      </View>
      <View style={{ marginTop: "4%" }}>
        <View style={{ marginBottom: "8%" }}>
          <Text
            style={{
              color: "#EA7800",
              fontSize: 17,
              fontWeight: "bold",
              alignSelf: "center",
            }}
          >
            Step 1 : Type of Vehicle
          </Text>
          <View
            style={{
              marginHorizontal: "25%",

              marginTop: "5%",
            }}
          >
            <Picker
              selectedValue={type}
              style={{ height: 50 }}
              onValueChange={(itemValue, itemIndex) => {
                console.log(itemValue);
                setType(itemValue);
              }}
            >
              <Picker.Item label="Moto" value="Motorcycle" />
              <Picker.Item label="Car" value="Car" />
              <Picker.Item label="Truck" value="Truck" />
            </Picker>
          </View>
        </View>
        <View style={{ marginBottom: "8%", alignSelf: "center" }}>
          <Text style={{ color: "#EA7800", fontSize: 15, fontWeight: "bold" }}>
            Step 2 : The name of the {type}
          </Text>
          <TextInput
            style={{ fontSize: 17, marginTop: "5%" }}
            placeholder="Enter the name! "
            onChangeText={(text) => {
              setName(text);
            }}
            value={name}
            textAlign={"center"}
          />
        </View>
        <View style={{ marginBottom: "8%" }}>
          <View style={{ alignSelf: "center" }}>
            <Text
              style={{ color: "#EA7800", fontSize: 15, fontWeight: "bold" }}
            >
              Step 3 : Vehicle Registration number
            </Text>
          </View>
          <TextInput
            style={{ fontSize: 17, marginTop: "5%" }}
            placeholder="Enter your Vehicle Registration number! "
            textAlign={"center"}
            onChangeText={(text) => {
              setMatricule(text);
            }}
          />
        </View>
        <View style={{ marginBottom: "3%" }}>
          <View style={{ alignSelf: "center" }}>
            <Text
              style={{ color: "#EA7800", fontSize: 15, fontWeight: "bold" }}
            >
              Step 3 : Wilaya
            </Text>
          </View>
          <View
            style={{
              marginHorizontal: "25%",

              marginTop: "5%",
            }}
          >
            <Picker
              selectedValue={type}
              style={{ height: 50 }}
              onValueChange={(itemValue, itemIndex) => setWilaya(itemValue)}
            >
              {Wilayas.map((wilaya, index) => (
                <Picker.Item
                  label={wilaya.name}
                  value={wilaya.name}
                  key={index}
                />
              ))}
            </Picker>
          </View>
        </View>

        <TouchableOpacity
          style={{ alignItems: "center", marginVertical: "5%" }}
          disabled={isNotValidForm}
          onPress={updateProfile}
        >
          <View
            style={[
              {
                width: 220,
                alignItems: "center",
                padding: 10,
                borderRadius: 40,
                bottom: 0,
              },
              isNotValidForm
                ? { backgroundColor: "gray" }
                : { backgroundColor: "#E000FF" },
            ]}
          >
            <Text style={{ fontSize: 19, color: "white" }}>Update Profile</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Modal;
