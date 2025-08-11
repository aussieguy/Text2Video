async function getApiKey() {
  return await fetchApiKey(); // Fetch the API key from the server
}

getApiKey().then(keys => {
  // Destructure the array returned by fetchApiKey()
  const [apiKey, firebaseApiKey] = keys;

  // Firebase configuration
  const firebaseConfig = {
    apiKey: firebaseApiKey, // Use the Firebase API key
    authDomain: "fir-project-2feb9.firebaseapp.com",
    projectId: "fir-project-2feb9",
    storageBucket: "fir-project-2feb9.firebasestorage.app",
    messagingSenderId: "767297268517",
    appId: "1:767297268517:web:6a8b5e2033841bb61208cc"
  };

  // Firebase initialization
  firebase.initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = firebase.firestore();

  // Retrieve email and password from the form and sign in
  document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally  
    const email = document.getElementById('emailAddress').value;
    const password = document.getElementById('password').value;
    const displayName = document.getElementById('displayName').value;

    // Validate email and password in case user tries to login on the signup page
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in successfully
        window.location.href = 'logged_in_page.html';
      })
      .catch((error) => {
      // Create a new user with email and password
        firebase.auth().createUserWithEmailAndPassword(email, password, displayName)
          .then((userCredential) => {

            // Account created successfully.  Now add the user to Firestore db
            db.collection("users").add({
              email: email,
              credits: "100", // Default credits
              displayName: displayName 
            })
            .then((docRef) => {
              console.log("Document written with ID: ", docRef.id);
              // Signed in successfully.  Now redirect to the logged in page
              window.location.href = 'logged_in_page.html';
            });
            
          })
          .catch((error) => {
            // Handle errors here.  Duplicate emails not allowed.
            if (error.code === 'auth/email-already-in-use') {
              alert("This email is already in use. Please try another one.");
            }
            if (error.code === 'auth/weak-password') {
              alert("Password should be at least 6 characters long.");
            }
            console.error("Error creating account:", error);
            alert("Error creating account: " + error.message);
          });
      });
  });
}).catch(error => {
  console.error("Error fetching API key:", error);
});