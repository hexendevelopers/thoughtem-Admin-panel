import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBe6bcCAYg_HsdDukkQRcQIJC0JGEO6DLw",
    authDomain: "thoughtem-4fa2b.firebaseapp.com",
    databaseURL: "https://thoughtem-4fa2b-default-rtdb.firebaseio.com",
    projectId: "thoughtem-4fa2b",
    storageBucket: "thoughtem-4fa2b.appspot.com",
    messagingSenderId: "337631869633",
    appId: "1:337631869633:web:b2699fac77e801619f3240"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

// Reference to the Firebase database
const blogForm = document.getElementById('blogForm');
const messageElement = document.getElementById('message');

// Event listener for form submission
blogForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const title = blogForm.title.value;
    const description = blogForm.description.value;
    const imageFile = blogForm.image.files[0];

    // Validate input
    if (title.trim() === '' || description.trim() === '' || !imageFile) {
        messageElement.textContent = "Please fill in all fields.";
        return;
    }

    // Upload image to Firebase Storage
    const imageStorageRef = storageRef(storage, 'blog_images/' + imageFile.name);

    try {
        await uploadBytes(imageStorageRef, imageFile);
        const imageUrl = await getDownloadURL(imageStorageRef);

        // Save data to Firebase Realtime Database
        const blogRef = ref(database, 'blogPosts');
        await push(blogRef, {
            title: title,
            description: description,
            imageUrl: imageUrl
        });

        // Reset form and display success message
        blogForm.reset();
        messageElement.textContent = "Blog post saved successfully!";
    } catch (error) {
        console.error('Error uploading image or saving blog post:', error);
        messageElement.textContent = "Failed to save blog post.";
    }
});
