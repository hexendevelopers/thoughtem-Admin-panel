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
const paragraphsContainer = document.getElementById('paragraphsContainer');
const addParagraphButton = document.getElementById('addParagraph');

// Function to add a new paragraph input area
addParagraphButton.addEventListener('click', function() {
    const paragraphDiv = document.createElement('div');
    paragraphDiv.innerHTML = `
        <label for="paragraph" class="block text-sm font-medium text-gray-700">Paragraph</label>
        <textarea name="paragraph" rows="3" class="mt-1 px-3 py-2 border rounded-md block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
    `;
    paragraphsContainer.appendChild(paragraphDiv);
});

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

    // Collect paragraph texts
    const paragraphElements = paragraphsContainer.querySelectorAll('textarea[name="paragraph"]');
    const paragraphs = Array.from(paragraphElements).map(paragraph => paragraph.value);

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
            imageUrl: imageUrl,
            paragraphs: paragraphs
        });

        // Reset form and display success message
        blogForm.reset();
        paragraphsContainer.innerHTML = '';
        messageElement.textContent = "Blog post saved successfully!";
    } catch (error) {
        console.error('Error uploading image or saving blog post:', error);
        messageElement.textContent = "Failed to save blog post.";
    }
});
