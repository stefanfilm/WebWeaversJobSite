function formatSalary(salary) {
    return Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(salary);
}

function formatDate(dateString) { 
    const date = new Date(dateString);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();

    return `${mm}/${dd}/${yyyy}`;
}

module.exports = {formatSalary, formatDate};