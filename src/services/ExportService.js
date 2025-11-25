import http from "../http-common";

const exportToCSV = (users) => {
  const headers = ["ID", "Name", "Email", "Phone", "Status", "Created Date"];
  const csvContent = [
    headers.join(","),
    ...users.map(user =>
      [
        user.id,
        `"${user.name}"`,
        user.email,
        user.phone || "",
        user.status || "active",
        user.createdAt || ""
      ].join(",")
    )
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `users_export_${new Date().getTime()}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportToJSON = (users) => {
  const jsonContent = JSON.stringify(users, null, 2);
  const blob = new Blob([jsonContent], { type: "application/json" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `users_export_${new Date().getTime()}.json`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const requestServerExport = (format = "csv", filters = {}) => {
  return http.post("/export/users", {
    format,
    filters
  }, {
    responseType: "blob"
  });
};

const ExportService = {
  exportToCSV,
  exportToJSON,
  requestServerExport
};

export default ExportService;
