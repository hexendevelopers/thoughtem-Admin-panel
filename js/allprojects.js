import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase, ref, get, remove } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "thoughtem-4fa2b.firebaseapp.com",
    databaseURL: "https://thoughtem-4fa2b-default-rtdb.firebaseio.com",
    projectId: "thoughtem-4fa2b",
    storageBucket: "thoughtem-4fa2b.appspot.com",
    messagingSenderId: "337631869633",
    appId: "1:337631869633:web:b2699fac77e801619f3240"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const projectsListElement = document.getElementById('projectsList');
const projectsAddedValueElement = document.getElementById('projectsaddedvalue');

// Fetch and display the total number of projects
async function fetchProjectCount() {
    const projectsRef = ref(database, 'projects');
    const snapshot = await get(projectsRef);
    if (snapshot.exists()) {
        const projects = snapshot.val();
        const projectCount = Object.keys(projects).length;
        projectsAddedValueElement.textContent = projectCount < 10 ? `0${projectCount}` : projectCount;
    } else {
        projectsAddedValueElement.textContent = "00";
    }
}

// Fetch and display all projects
async function fetchProjects() {
    const projectsRef = ref(database, 'projects');
    const snapshot = await get(projectsRef);

    if (snapshot.exists()) {
        const projects = snapshot.val();
        projectsListElement.innerHTML = '';
        for (const projectId in projects) {
            const project = projects[projectId];
            const projectElement = document.createElement('div');
            projectElement.classList.add('mb-4', 'p-4', 'border', 'rounded-md', 'bg-gray-50');
            projectElement.innerHTML = `
                <h3 class="text-lg font-semibold mb-2">${project.name}</h3>
                <img width="200" src="${project.fileURL}" alt="${project.name}" class="mb-2 max-w-full h-auto"/>
                <button class="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-700 delete-button" data-id="${projectId}">
                    Delete
                </button>
            `;
            projectsListElement.appendChild(projectElement);
        }

        // Add delete event listeners
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', async (event) => {
                const projectId = event.target.getAttribute('data-id');
                await deleteProject(projectId);
            });
        });
    } else {
        projectsListElement.innerHTML = '<p class="text-center text-gray-500">No projects found.</p>';
    }
}

// Delete a project
async function deleteProject(projectId) {
    const projectRef = ref(database, 'projects/' + projectId);
    await remove(projectRef);
    fetchProjects(); // Refresh the project list
}

// Fetch initial data
fetchProjectCount();
fetchProjects();




document.getElementById("navigate").addEventListener("click", () => {
    window.location.href = "addproject.html";
});

