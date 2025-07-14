import { StatusBar } from "expo-status-bar";
import MapView from "react-native-maps";
import { StyleSheet, Text, View, SafeAreaView, Platform } from "react-native";

export default function App() {
	return (
		<SafeAreaView style={styles.container}>
			<Text>Open up App.js to start working on your app!</Text>
			<MapView style={styles.map} />
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
