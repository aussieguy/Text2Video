async function getApiKey() {
  return await fetchApiKey(); // Fetch all the API keys from the server
}

let firebaseApiKey,apiKey;
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

  // Check if user is already signed in
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in so redirect to Success.html
      window.location.href = 'logged_in_page.html';
    } else {
      // Make form visible
      document.getElementById('login_in').style.display = 'block';
    };
  });

  // Retrieve email and password from the form and sign in
  document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally  
    const email = document.getElementById('emailAddress').value;
    const password = document.getElementById('password').value;

    // Validate email and password 
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in successfully
      const user = userCredential.user;
      window.location.href = 'logged_in_page.html';
    })
    .catch((error) => {
      // Incorrect email or password
      console.log("Incorrect email or password:", email, password);
    });

  });
});



