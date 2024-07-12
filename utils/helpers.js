function formatSalary(salary) {
    return Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(salary);
}

module.exports = {formatSalary};