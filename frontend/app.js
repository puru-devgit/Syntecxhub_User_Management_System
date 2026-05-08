const API_URL = "http://localhost:5000/api/users";

/* =========================
   TAB SWITCHING
========================= */

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

if (loginTab && registerTab) {

    loginTab.addEventListener("click", () => {

        loginTab.classList.add("active");
        registerTab.classList.remove("active");

        loginForm.classList.remove("hidden");
        registerForm.classList.add("hidden");

    });

    registerTab.addEventListener("click", () => {

        registerTab.classList.add("active");
        loginTab.classList.remove("active");

        registerForm.classList.remove("hidden");
        loginForm.classList.add("hidden");

    });

}


/* =========================
   REGISTER USER
========================= */

if (registerForm) {

    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const name = document.getElementById("registerName").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;

        try {

            const res = await fetch(`${API_URL}/register`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    email,
                    password
                })

            });

            const data = await res.json();

            if (res.ok) {

                alert("Registration Successful ✅");

                registerForm.reset();

                registerTab.classList.remove("active");
                loginTab.classList.add("active");

                registerForm.classList.add("hidden");
                loginForm.classList.remove("hidden");

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.log(error);

        }

    });

}


/* =========================
   LOGIN USER
========================= */

if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        try {

            const res = await fetch(`${API_URL}/login`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })

            });

            const data = await res.json();

            if (res.ok) {

                localStorage.setItem("token", data.token);

                alert("Login Successful ✅");

                window.location.href = "dashboard.html";

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.log(error);

        }

    });

}


/* =========================
   FETCH USERS
========================= */

const userTableBody = document.getElementById("userTableBody");

async function fetchUsers() {

    const token = localStorage.getItem("token");

    if (!token) return;

    try {

        const res = await fetch(API_URL, {

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        const users = await res.json();

        if (!userTableBody) return;

        userTableBody.innerHTML = "";

        document.getElementById("totalUsers").innerText = users.length;

        users.forEach(user => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>

                <td>

                    <button 
                        class="action-btn edit-btn"
                        onclick="editUser('${user._id}', '${user.name}', '${user.email}')">
                        Edit
                    </button>

                    <button 
                        class="action-btn delete-btn"
                        onclick="deleteUser('${user._id}')">
                        Delete
                    </button>

                </td>
            `;

            userTableBody.appendChild(row);

        });

    } catch (error) {

        console.log(error);

    }

}


/* =========================
   ADD USER
========================= */

const addUserForm = document.getElementById("addUserForm");

if (addUserForm) {

    addUserForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {

            const res = await fetch(`${API_URL}/register`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    email,
                    password
                })

            });

            const data = await res.json();

            if (res.ok) {

                alert("User Added ✅");

                addUserForm.reset();

                fetchUsers();

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.log(error);

        }

    });

}


/* =========================
   DELETE USER
========================= */

async function deleteUser(id) {

    const token = localStorage.getItem("token");

    if (!confirm("Delete this user?")) return;

    try {

        await fetch(`${API_URL}/${id}`, {

            method: "DELETE",

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        fetchUsers();

    } catch (error) {

        console.log(error);

    }

}


/* =========================
   EDIT USER
========================= */

async function editUser(id, oldName, oldEmail) {

    const token = localStorage.getItem("token");

    const name = prompt("Enter new name", oldName);
    const email = prompt("Enter new email", oldEmail);

    if (!name || !email) return;

    try {

        await fetch(`${API_URL}/${id}`, {

            method: "PUT",

            headers: {

                "Content-Type": "application/json",

                Authorization: `Bearer ${token}`

            },

            body: JSON.stringify({
                name,
                email
            })

        });

        fetchUsers();

    } catch (error) {

        console.log(error);

    }

}


/* =========================
   SEARCH USERS
========================= */

const searchInput = document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("keyup", () => {

        const value = searchInput.value.toLowerCase();

        const rows = document.querySelectorAll("#userTableBody tr");

        rows.forEach(row => {

            const text = row.innerText.toLowerCase();

            row.style.display = text.includes(value)
                ? ""
                : "none";

        });

    });

}


/* =========================
   LOGOUT
========================= */

function logout() {

    localStorage.removeItem("token");

    window.location.href = "index.html";

}


/* =========================
   AUTO LOAD USERS
========================= */

fetchUsers();



/* =========================
   SIDEBAR NAVIGATION
========================= */

const navItems = document.querySelectorAll(".nav-item");

navItems.forEach(item => {

    item.addEventListener("click", () => {

        navItems.forEach(nav => {
            nav.classList.remove("active");
        });

        item.classList.add("active");

        const sections =
            document.querySelectorAll(".section-content");

        sections.forEach(section => {

            section.classList.add("hidden-section");

        });

        const target =
            document.getElementById(
                item.dataset.section
            );

        if (target) {

            target.classList.remove("hidden-section");

        }

    });

});