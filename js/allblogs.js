import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, ref, onValue, remove, update } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { getStorage, ref as storageRef, deleteObject } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";

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
const blogsListElement = document.getElementById('blogsList');

// Fetch and display blog posts
const blogPostsRef = ref(database, 'blogPosts');
onValue(blogPostsRef, (snapshot) => {
    blogsListElement.innerHTML = '';
    snapshot.forEach((childSnapshot) => {
        const blogPost = childSnapshot.val();
        const blogPostKey = childSnapshot.key;

        const blogElement = document.createElement('div');
        blogElement.className = 'p-4 bg-gray-100 rounded shadow-md';
        blogElement.innerHTML = `
            <h3 class="text-xl font-bold">${blogPost.title}</h3>
            <p>${blogPost.description}</p>
            <img src="${blogPost.imageUrl}" alt="${blogPost.title}" class="w-32 h-32 object-cover">
            <button class="show-edit-btn bg-blue-500 text-white py-2 px-4 rounded mt-2" data-key="${blogPostKey}">Edit</button>
            <div class="edit-fields hidden">
                <input type="text" class="edit-title mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value="${blogPost.title}">
                <textarea class="edit-description mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">${blogPost.description}</textarea>
                <div class="message mt-2 text-green-600"></div>
                <button class="save-btn bg-green-500 text-white py-2 px-4 rounded mt-2" data-key="${blogPostKey}">Save</button>
                <button class="delete-btn bg-red-500 text-white py-2 px-4 rounded mt-2" data-key="${blogPostKey}" data-image="${blogPost.imageUrl}">Delete</button>
            </div>
        `;
        blogsListElement.appendChild(blogElement);
    });

    // Add event listeners for show-edit, save, and delete buttons
    document.querySelectorAll('.show-edit-btn').forEach(button => {
        button.addEventListener('click', handleShowEdit);
    });
    document.querySelectorAll('.save-btn').forEach(button => {
        button.addEventListener('click', handleSave);
    });
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', handleDelete);
    });
});

// Handle show-edit button click
function handleShowEdit(event) {
    const blogElement = event.target.closest('div');
    const editFields = blogElement.querySelector('.edit-fields');
    editFields.classList.toggle('hidden');
}

// Handle save button click
async function handleSave(event) {
    const blogPostKey = event.target.dataset.key;
    const blogElement = event.target.closest('div');
    const newTitle = blogElement.querySelector('.edit-title').value;
    const newDescription = blogElement.querySelector('.edit-description').value;
    const messageElement = blogElement.querySelector('.message');

    const blogPostRef = ref(database, `blogPosts/${blogPostKey}`);

    if (newTitle.trim() !== '' && newDescription.trim() !== '') {
        try {
            await update(blogPostRef, {
                title: newTitle,
                description: newDescription
            });
            messageElement.textContent = 'Blog post updated successfully!';
        } catch (error) {
            console.error('Error updating blog post:', error);
            messageElement.textContent = 'Failed to update blog post.';
        }
    } else {
        messageElement.textContent = 'Please fill in all fields.';
    }
}

// Handle delete button click
async function handleDelete(event) {
    const blogPostKey = event.target.dataset.key;
    const imageUrl = event.target.dataset.image;
    const blogPostRef = ref(database, `blogPosts/${blogPostKey}`);
    const imageStorageRef = storageRef(storage, `blog_images/${imageUrl.split('%2F')[1].split('?')[0]}`);
    const blogElement = event.target.closest('div');
    const messageElement = blogElement.querySelector('.message');

    try {
        await remove(blogPostRef);
        await deleteObject(imageStorageRef);
        blogElement.remove();
        messageElement.textContent = 'Blog post deleted successfully!';
    } catch (error) {
        console.error('Error deleting blog post:', error);
        messageElement.textContent = 'Failed to delete blog post.';
    }
}
 


document.getElementById("navigate").addEventListener("click", () => {
    window.location.href = "addblog.html";
});
