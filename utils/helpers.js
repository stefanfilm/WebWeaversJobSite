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

function and(c1, c2){
    return c1 && c2;
}

function or(c1, c2){
    return c1 || c2;
}

function not(c){
    return !c;
}

module.exports = {formatSalary, formatDate, and, or, not};