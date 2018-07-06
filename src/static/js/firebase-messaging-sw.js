importScripts('https://www.gstatic.com/firebasejs/4.1.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.1.2/firebase-messaging.js');
var config = {
	apiKey: "AIzaSyCvt-sddXFg7Kjrttu42O6nagQIbo58bbY",
	authDomain: "android-blend-4b456.firebaseapp.com",
	databaseURL: "https://android-blend-4b456.firebaseio.com",
	projectId: "android-blend-4b456",
	storageBucket: "android-blend-4b456.appspot.com",
	messagingSenderId: "1024370094646"
};
firebase.initializeApp(config);
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload){
	alert('Hello');
});