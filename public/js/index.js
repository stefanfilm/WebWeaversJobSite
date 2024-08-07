const loginForm = $(".login-form");
const uploadForm = $("#upload-form");
const editProfile = $(".edit-form");
const signupForm = $(".signup-form");
const newJobForm = $("#new-job-form");
const jobEditorForm = $("#job-editor-form");

const logoutBtn = $("#logout-btn");
const applyBtn = $("#apply-btn");
const cancelBtn = $("#cancel-btn");
const deleteBtn = $("#delete-btn");

const salaryInput = $("#salary");

const loginHandler = async (event) => {
    try {
        event.preventDefault();
        const username = $("#username").val();
        const password = $("#password").val();
        const isRecruiter = $("#is-recruiter").prop("checked");
        await $.ajax({
            url: "/api/user/login",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({ username, password, isRecruiter }),
            success: res => {
                if (res) {
                    window.location.replace("/");
                }
            }, error: xhr => {
                if (xhr.status === 404) {
                    // Show user-friendly message for 404 error
                    $('#error-message').text('The login endpoint was not found. Please contact support.');
                } else if (xhr.status === 401) {
                    // Show message for unauthorized error
                    $('#error-message').text('Invalid username or password. Please try again.');
                } else {
                    // Show generic error message
                    $('#error-message').text('An unexpected error occurred. Please try again later.');
                }
            }
        });
    } catch (error) {
        alert(error.responseJSON.message);
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
            if (res) {
                $("#img-profile").attr("src", res.imgUrl);
                window.location.replace("/profile");
            }
        }, error: () => {
            alert("Failed to upload image");
        }
    });
}

const editProfileHandler = async (event) => {
    try {
        event.preventDefault();
        const first_name = $("#first-name").val();
        const last_name = $("#last-name").val();
        const job_title = $("#job-title").val();

        const company_name = $("#company-name").val();
        const location = $("#location").val();
        if (!userInfoValidation(first_name, last_name)) return;
        if (!recruiterValidation(company_name, location)) return;

        await $.ajax({
            url: "/api/user/profile",
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify({ first_name, last_name, job_title, company_name, location }),
            success: res => {
                console.log(res);
                if (res) {
                    window.location.replace("/profile");
                }
            }, error: () => {
                alert("Failed to update data");
            }
        });
    } catch (error) {
        res.status(500).json("")
    }
}
const signupHandler = async (event) => {
    event.preventDefault();
    try {
        // account information
        const email = $("#email").val();
        const username = $("#username").val();
        const password = $("#password").val();
        const confirmPassword = $("#confirm-password").val();

        // personal or organization information
        const first_name = $("#first-name").val();
        const last_name = $("#last-name").val();
        const job_title = $("#job-title").val();
        const isRecruiter = $("#company-name").val();
        const company_name = $("#company-name").val();
        const location = $("#location").val();

        if (!accountValidation(username, password, confirmPassword)) return;
        if (!userInfoValidation(first_name, last_name)) return;
        if (!recruiterValidation(company_name, location)) return;

        console.log("isRecruiter :>>", isRecruiter);

        await $.ajax({
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
            }), success: res => {
                if (res)
                    window.location.replace("/");
            },
            error: (xhr) => {
                alert(xhr.responseJSON.message);
            }
        });
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

        if (!jobValidation(title, job_description)) return;

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

const jobEditHandler = async (event) => {
    try {
        event.preventDefault();
        const jobId = jobEditorForm.data("jobId");
        const title = $("#new-job-title").val();
        const salary = parseFloat($("#salary").val());
        const job_description = $("#new-job-description").val();

        if (!jobValidation(title, job_description)) return;

        $.ajax({
            url: `/api/user/dashboard/edit/job/${jobId}`,
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify({ title, salary, job_description }),
            success: res => {
                if (res) {
                    window.location.replace(`/dashboard/edit/job/${jobId}`);
                }
            }
        })
    } catch (error) {
        alert("Internal error");
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

const deleteHandler = async () => {
    try {
        const jobId = $(".job-detail").data("jobId");
        await $.ajax({
            url: `/api/user/dashboard/job/${jobId}`,
            method: "DELETE",
            success: res => {
                if (res) {
                    window.location.replace("/dashboard");
                }
            }, error: xhr => {
                alert(xhr.responseJSON.message);
            }
        })
    } catch (error) {
        console.log("Failed to delete");
    }
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

const accountValidation = (username, password, confirmPassword) => {
    if (username.length < 6) {
        alert("Username must have at least 5 characters");
        return false;
    }

    if (password.length < 6) {
        alert("Password must have at least 5 characters");
        return false;
    }

    if (password !== confirmPassword) {
        alert("Password does not match");
        return false;
    }

    return true;
}

const userInfoValidation = (firstName, lastName) => {
    if (firstName === undefined) return true;

    if (firstName.trim().length === 0) {
        alert("First name cannot be empty");
        return false;
    }
    if (lastName.trim().length === 0) {
        alert("Last name cannot be empty");
        return false;
    }

    return true;
}

const recruiterValidation = (company_name, location) => {
    if (company_name === undefined) return true;

    if (company_name.trim().length === 0) {
        alert("Company name cannot be empty");
        return false;
    }
    if (location.trim().length === 0) {
        alert("Location cannot be empty");
        return false;
    }

    return true;
}

const jobValidation = (title, description) => {
    if (title.length === 0) {
        alert("Title cannot be empty");
        return false;
    }
    if (description.length === 0) {
        alert("Job description cannot be empty");
        return false;
    }
    return true;
}

$(document).ready(() => {
    loginForm.on("submit", loginHandler);
    uploadForm.on("submit", uploadHandler);
    editProfile.on("submit", editProfileHandler);
    signupForm.on("submit", signupHandler);
    newJobForm.on("submit", newJobHandler);
    jobEditorForm.on("submit", jobEditHandler);
    logoutBtn.on("click", logoutHandler);
    applyBtn.on("click", applicationHandler);
    cancelBtn.on("click", cancelApplicationHandler);
    deleteBtn.on("click", deleteHandler);
    salaryInput.on("keydown", salaryInputHandler);
});