const loginForm = $(".login-form");

const logoutBtn = $("#logout-btn");

const loginHandler = async (event) => {
    try {
        event.preventDefault();
        const username = $("#username").val();
        const password = $("#password").val();
        console.log(username);
        console.log(password);
        const res = await $.ajax({
            url: "/api/user/login",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ username, password })
        });

        if (res) document.location.replace("/");
    } catch (error) {
        alert("Failed to login");
    }

    $("#username").val("");
    $("#password").val("");
};

const logoutHandler = async () => {
    try {
        await $.ajax({
            url: "/api/user/logout",
            method: "POST",
            contentType: "application/json",
            complete: (xhr, status) => {
                if (xhr.status === 204)
                    window.location.replace("/login");
                else
                    alert("Failed to logout");
            }
        });
    } catch (error) {
        alert("Internal error, please try again later");
    }
};

$(document).ready( () => {
    loginForm.on("submit", loginHandler);
    logoutBtn.on("click", logoutHandler);
});