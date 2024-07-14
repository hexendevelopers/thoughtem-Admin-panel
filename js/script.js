import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, ref, set, push, get } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyBe6bcCAYg_HsdDukkQRcQIJC0JGEO6DLw",
    authDomain: "thoughtem-4fa2b.firebaseapp.com",
    databaseURL: "https://thoughtem-4fa2b-default-rtdb.firebaseio.com",
    projectId: "thoughtem-4fa2b",
    storageBucket: "thoughtem-4fa2b.appspot.com",
    messagingSenderId: "337631869633",
    appId: "1:337631869633:web:b2699fac77e801619f3240"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

const projectNameInput = document.getElementById('projectName');
const categoryInput = document.getElementById('category');
const projectTypeInput = document.getElementById('projectType');
const projectFileInput = document.getElementById('projectFile');
const addProjectButton = document.getElementById('addProject');
const messageElement = document.getElementById('message');
const projectsAddedValue = document.getElementById('projectsaddedvalue');

// Fetch and display the total number of projects
async function fetchProjectCount() {
    const projectsRef = ref(database, 'projects');
    const snapshot = await get(projectsRef);
    if (snapshot.exists()) {
        const projects = snapshot.val();
        const projectCount = Object.keys(projects).length;
        projectsAddedValue.textContent = projectCount < 10 ? `0${projectCount}` : projectCount;
    } else {
        projectsAddedValue.textContent = "00";
    }
}

// Initial fetch of project count
fetchProjectCount();

addProjectButton.addEventListener('click', async () => {
    const projectName = projectNameInput.value;
    const category = categoryInput.value;
    const projectType = projectTypeInput.value;
    const projectFile = projectFileInput.files[0];

    if (projectName && category && projectType && projectFile) {
        try {
            // Upload file to Firebase Storage
            const storageRefPath = storageRef(storage, 'projects/' + projectFile.name);
            await uploadBytes(storageRefPath, projectFile);
            const fileURL = await getDownloadURL(storageRefPath);

            // Save project data to Firebase Realtime Database
            const projectsRef = ref(database, 'projects');
            const newProjectRef = push(projectsRef);
            await set(newProjectRef, {
                name: projectName,
                category: category,
                type: projectType,
                fileURL: fileURL
            });

            // Display success message
            messageElement.textContent = 'Project added successfully!';
            messageElement.classList.remove('text-red-500');
            messageElement.classList.add('text-green-500');

            // Reload the project count after a short delay
            setTimeout(() => {
                fetchProjectCount();
                location.reload(); // Refresh the page to clear the form and update the project count
            }, 1000); // Adjust the delay as needed (in milliseconds)
        } catch (error) {
            console.error('Error adding project: ', error);

            // Display error message
            messageElement.textContent = 'Failed to add project.';
            messageElement.classList.remove('text-green-500');
            messageElement.classList.add('text-red-500');
        }
    } else {
        // Display validation message
        messageElement.textContent = 'Please provide a project name, category, project type, and file.';
        messageElement.classList.remove('text-green-500');
        messageElement.classList.add('text-red-500');
    }
});
