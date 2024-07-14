import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, ref, get, remove } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

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

const projectsAddedValue = document.getElementById('projectsaddedvalue');
const projectsList = document.getElementById('projectsList');
const navigateButton = document.getElementById('navigate');

navigateButton.addEventListener('click', () => {
    window.location.href = "index.html";
});

// Fetch and display the total number of projects and their details
async function fetchProjects() {
    const projectsRef = ref(database, 'projects');
    const snapshot = await get(projectsRef);

    if (snapshot.exists()) {
        const projects = snapshot.val();
        const projectCount = Object.keys(projects).length;
        projectsAddedValue.textContent = projectCount < 10 ? `0${projectCount}` : projectCount;

        // Clear the current projects list
        projectsList.innerHTML = '';

        // Create and append project elements to the list
        Object.keys(projects).forEach(key => {
            const project = projects[key];
            const projectElement = document.createElement('div');
            projectElement.className = 'bg-white p-4 mb-4 rounded shadow';

            projectElement.innerHTML = `
                <h3 class="text-xl text-blue font-bold">${project.name}</h3>
                 <p class="text-gray-700"><strong>category:</strong> ${project.type}</p>
                <img width="100" src="${project.fileURL}" alt="${project.name}" class="w-72 rounded-lg h-auto mt-2">
                <button class="delete-button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4" data-key="${key}">Delete</button>
            `;

            projectsList.appendChild(projectElement);
        });

        // Add event listeners to all delete buttons
        const deleteButtons = document.querySelectorAll('.delete-button');
        deleteButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                const key = event.target.getAttribute('data-key');
                await deleteProject(key);
            });
        });
    } else {
        projectsAddedValue.textContent = "00";
        projectsList.innerHTML = '<p class="text-gray-700">No projects found.</p>';
    }
}

// Delete project function
async function deleteProject(key) {
    const projectRef = ref(database, `projects/${key}`);
    await remove(projectRef);
    fetchProjects();
}

// Initial fetch of projects
fetchProjects();

document.getElementById("navigate").addEventListener("click", () => {
    window.location.href = "addproject.html";
});
