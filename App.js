import { StatusBar } from "expo-status-bar";
import MapView, { Marker, Callout } from "react-native-maps";
import { StyleSheet, Text, View, SafeAreaView, Platform } from "react-native";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Icon from "react-native-vector-icons/FontAwesome";

export default function App() {
	const defaultLocation = {
		coords: {
			latitude: 43.7956669,
			longitude: -79.3502433,
		},
	};
	const defaultRegion = {
		latitude: 43.7956669,
		longitude: -79.3502433,
		latitudeDelta: 0.2,
		longitudeDelta: 0.2,
	};
	const [markersList, setMarkersList] = useState([]);
	const [currentLocation, setCurrentLocation] = useState(defaultLocation);
	const [currentLocationResult, setCurrentLocationResult] = useState("Current Location Result Goes here");
	const mapReference = useRef(null);

	useEffect(() => {
		requestLocationPermission();
		getCurrentLocation();
		getNearbyPOIs();
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

	const getNearbyPOIs = async () => {
		try {
			const response = await axios.get(`https://api.geoapify.com/v2/places?categories=activity,catering&conditions=named&filter=circle:${currentLocation.coords.longitude},${currentLocation.coords.latitude},5000&limit=50&apiKey=234b3cc77c984b28b0da2de092bdaf4a`);

			response.data.features.forEach((point) => {
				markersList.push({ name: point.properties.name, address: point.properties.address_line2, lat: point.properties.lat, lng: point.properties.lon, catering: point.properties.catering });
			});
			setMarkersList([...markersList]);
		} catch (error) {
			console.log("Unable to fetch POIs", error);
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.header}>Here's what's nearby</Text>
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
						>
							<Icon style={{ marginLeft: "auto", flex: 1 }} name={location.catering ? "cutlery" : "ticket"} size={22} />
							<Callout tooltip>
								<View style={styles.calloutContainer}>
									<Text style={styles.calloutTitle}>{location.name}</Text>
									<Text style={styles.calloutDescription}>{location.address}</Text>
								</View>
							</Callout>
						</Marker>
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
	header: {
		fontSize: 20,
		fontStyle: "bold",
	},
	map: {
		borderColor: "black",
		borderWidth: 8,
		width: "90%",
		height: "90%",
	},
	calloutContainer: {
		width: 200,
		backgroundColor: "white",
		borderRadius: 8,
		padding: 10,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		marginBottom: -10,
	},
	calloutTitle: {
		fontWeight: "bold",
		fontSize: 16,
		marginBottom: 5,
	},
	calloutDescription: {
		fontSize: 12,
	},
});
