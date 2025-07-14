import { StatusBar } from "expo-status-bar";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, Text, View, SafeAreaView, Platform } from "react-native";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";

export default function App() {
	const defaultRegion = {
		latitude: 43.7956669,
		longitude: -79.3502433,
		latitudeDelta: 0.2,
		longitudeDelta: 0.2,
	};
	const [markersList, setMarkersList] = useState([
		{ name: "CF FairView Mall", lat: 43.7787512, lng: -79.3447072 },
		{ name: "North York General Hospital", lat: 43.7696717, lng: -79.3629892 },
	]);

	const mapReference = useRef(null);

	useEffect(() => {
		requestLocationPermission();
	}, []);

	const requestLocationPermission = async () => {
		try {
			const permissionObject = await Location.requestForegroundPermissionsAsync();

			if (permissionObject.status === "granted") {
				console.log("Permission Granted!");
				//Alert.alert("Success", "Permission Granted!");
			} else {
				console.log("Permission Denied!");
				//Alert.alert("Failure", "Permission Denied!");
			}
		} catch (error) {
			console.log(`Error while requesting permission: ${JSON.stringify(error)}`);
		}
	};

	const getCurrentLocation = async () => {
		try {
			const location = await Location.getCurrentPositionAsync({
				accuracy: Location.Accuracy.Highest,
			});

			/*
      Current Location Object
      {"coords":
        {
          "accuracy":5,
          "longitude":-122.084,
          "altitude":5,
          "heading":0,
          "latitude":37.4219983,
          "altitudeAccuracy":0.5,
          "speed":0.0030715973116457462
        },
        "mocked":false,
        "timestamp":1752177246412
      }
        */

			if (location !== undefined) {
				console.log(`Current Location: ${JSON.stringify(location)}`);
				setCurrentLocation(location);
				setCurrentLocationResult(`Latitude: ${location.coords.latitude}\nLongitude: ${location.coords.longitude}`);

				const newLocationRegion = {
					latitude: location.coords.latitude,
					longitude: location.coords.longitude,
					latitudeDelta: 0.2,
					longitudeDelta: 0.2,
				};

				if (mapReference.current) {
					mapReference.current.animateToRegion(newLocationRegion);
				} else {
					console.log("MapView reference is not available!");
				}
			}
		} catch (error) {
			console.log(`Error while fetching current location: ${error.message}`);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<Text>Open up App.js to start working on your app!</Text>
			<MapView style={styles.map} ref={mapReference} initialRegion={defaultRegion}>
				{markersList.map((location, index) => {
					return (
						<Marker
							key={index}
							coordinate={{
								latitude: location.lat,
								longitude: location.lng,
							}}
							title={location.name}
						/>
					);
				})}
			</MapView>
			<StatusBar style="auto" />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
		paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
	},
	map: {
		width: "100%",
		height: "100%",
	},
});
