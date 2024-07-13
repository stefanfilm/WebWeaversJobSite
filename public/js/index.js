const loginForm = $(".login-form");
const uploadForm = $("#upload-form");
const editProfile = $(".edit-form");
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

const uploadHandler = async (event) => {
    event.preventDefault();

    const imgFile = new FormData(uploadForm[0]);

    await $.ajax({
        url: "/api/user/upload",
        method: "POST",
        data: imgFile,
        processData: false,
        contentType: false,
        success: (res) => {
            console.log(res);
            if (res) {
                console.log(res);
                console.log("Success");
                $("#img-profile").attr("src", res.imgUrl);
                window.location.replace("/profile");
            } else {
                alert("Cannot upload image");
            }
        }, error: () => {
            alert("Failed to upload image");
        }
    });
}

const editProfileHandler = async (event) => {
    event.preventDefault();
    const first_name = $("#first-name").val();
    const last_name = $("#last-name").val();
    const job_title = $("#job-title").val();

    if(first_name.length === 0 || last_name.length === 0 || job_title === 0){
        alert("Input field cannot be empty");
        return;
    }

    await $.ajax({
        url: "/api/user/profile",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ first_name, last_name, job_title }),
        success: res => {
            console.log(res);
            if (res) {
                window.location.replace("/profile");
            }
        }, error: () => {
            alert("Failed to update data");
        }
    });
}

$(document).ready(() => {
    loginForm.on("submit", loginHandler);
    uploadForm.on("submit", uploadHandler);
    editProfile.on("submit", editProfileHandler);
    logoutBtn.on("click", logoutHandler);
});