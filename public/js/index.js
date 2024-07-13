const loginForm = $(".login-form");
const uploadForm = $("#upload-form");

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
            if(res) {
                console.log(res);
                console.log("Success");
                $("#img-profile").attr("src", res.imgUrl);
            }else{
                alert("Cannot upload image");
            }
        },error: () => {
            alert("Failed to upload image");
        }
    });
}

$(document).ready( () => {
    loginForm.on("submit", loginHandler);
    uploadForm.on("submit", uploadHandler);
    logoutBtn.on("click", logoutHandler);
});