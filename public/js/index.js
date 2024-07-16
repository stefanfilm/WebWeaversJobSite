const loginForm = $(".login-form");
const uploadForm = $("#upload-form");
const editProfile = $(".edit-form");
const signupForm = $(".signup-form");
const newJobForm = $("#new-job-form");

const logoutBtn = $("#logout-btn");
const applyBtn = $("#apply-btn");
const cancelBtn = $("#cancel-btn");

const salaryInput = $("#salary");

const loginHandler = async (event) => {
    try {
        event.preventDefault();
        const username = $("#username").val();
        const password = $("#password").val();
        const isRecruiter = $("#is-recruiter").prop("checked");
        const res = await $.ajax({
            url: "/api/user/login",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ username, password, isRecruiter }),
            success: res => {
                console.log(res);
                if (res) {
                    window.location.replace("/");
                } else {
                    alert("username or password is incorrect!");
                }
            }
        });

        console.log(res);
        // if (res) document.location.replace("/");
    } catch (error) {
        alert("Username or Password is incorrect");
    }

    cleanInput();
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

    if (first_name.length === 0 || last_name.length === 0 || job_title === 0) {
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
const signupHandler = async (event) => {
    event.preventDefault();
    try {
        const email = $("#email").val();
        const username = $("#username").val();
        const password = $("#password").val();
        const confirmPassword = $("#confirm-password").val();
        const isRecruiter = !!$("#company-name").val();
        const location = $("#location").val();


        if (password !== confirmPassword) {
            alert("Password does not match");
            return;
        }

        const first_name = $("#first-name").val();
        const last_name = $("#last-name").val();
        const job_title = $("#job-title").val();
        const company_name = $("#company-name").val();

        const res = await $.ajax({
            url: "/api/user/signup",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                first_name,
                last_name,
                username,
                password,
                email,
                job_title,
                company_name,
                isRecruiter,
                location,
            }),
            error: (xhr) => {
                // const res = JSON.parse(xhr);
                // alert(res);
                alert(xhr.responseJSON.message);
            }
        });
        if (res) window.location.replace("/");
    } catch (error) {
        // alert("Fail to sign up");
        console.log("SIGN UP fails");
    }
    cleanInput();
}

const applicationHandler = async (event) => {
    try {
        event.preventDefault();
        const jobId = $(".job-detail").data("jobId");
        await $.ajax({
            url: `/api/user/job/${jobId}`,
            method: "POST",
            success: res => {
                if (res) {
                    window.location.replace(`/job/${jobId}`);
                }
            }, error: xhr => {
                alert(xhr.responseJSON.message);
            }
        });
    } catch (error) {
        alert("Internal error");
    }
}

const cancelApplicationHandler = async (event) => {
    try {
        event.preventDefault();
        const jobId = $(".job-detail").data("jobId");
        await $.ajax({
            url: `/api/user/job/${jobId}`,
            method: "DELETE",
            success: res => {
                if (res) {
                    window.location.replace(`/job/${jobId}`);
                }
            }, error: xhr => {
                alert("Cannot delete this application");
            }
        })
    } catch (error) {
        alert("Failed to cancle application");
    }
}

const newJobHandler = async (event) => {
    try {
        event.preventDefault();
        const title = $("#new-job-title").val();
        const job_description = $("#new-job-description").val();
        const salary = parseFloat($("#salary").val());

        await $.ajax({
            url: "/api/user/newjob",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ title, salary, job_description }),
            success: res => {
                if (res) {
                    window.location.replace("/dashboard");
                } else {
                    alert("Fail to create a new job post");
                }
            }
        });
    } catch (error) {
        alert("Something went wrong, please try again later!");
    }
}

const salaryInputHandler = (event) => {
    const key = event.key;
    const isNumber = /^[0-9]$/;
    const isNavigationKey = ["Backspace", "ArrowLeft", "ArrowRight", "Delete", "Tab", "."].includes(key);

    if (!isNumber.test(key) && !isNavigationKey) {
        event.preventDefault();
        return;
    };
}

const cleanInput = () => {
    $("#email").val("");
    $("#username").val("");
    $("#password").val("");
    $("#confirm-password").val("");
    $("#first-name").val("");
    $("#last-name").val("");
    $("#job-title").val("");
}

$(document).ready(() => {
    loginForm.on("submit", loginHandler);
    uploadForm.on("submit", uploadHandler);
    editProfile.on("submit", editProfileHandler);
    signupForm.on("submit", signupHandler);
    newJobForm.on("submit", newJobHandler);
    logoutBtn.on("click", logoutHandler);
    applyBtn.on("click", applicationHandler);
    cancelBtn.on("click", cancelApplicationHandler);
    salaryInput.on("keydown", salaryInputHandler);
});