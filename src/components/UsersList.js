import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import UserDataService from "../services/UserService";
import { useTable, useSortBy, usePagination } from "react-table";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    retrieveUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchEmail]);

  const retrieveUsers = () => {
    setLoading(true);
    setError(null);
    UserDataService.getAll()
      .then((response) => {
        setUsers(response.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load users");
        setLoading(false);
      });
  };

  const filterUsers = () => {
    if (!searchEmail.trim()) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) =>
        user.email?.toLowerCase().includes(searchEmail.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  const deleteUser = (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    UserDataService.remove(id)
      .then(() => {
        setUsers(users.filter((user) => user.id !== id));
      })
      .catch(() => {
        setError("Failed to delete user");
      });
  };

  const removeAllUsers = () => {
    if (!window.confirm("Are you sure you want to remove ALL users? This cannot be undone.")) return;

    UserDataService.removeAll()
      .then(() => {
        setUsers([]);
      })
      .catch(() => {
        setError("Failed to remove users");
      });
  };

  const exportToCSV = () => {
    if (filteredUsers.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = ["ID", "Email", "Birth Date", "Phone Number", "Created At", "Updated At", "Created By"];
    const csvContent = [
      headers.join(","),
      ...filteredUsers.map((user) =>
        [
          user.id,
          `"${user.email || ""}"`,
          user.birthDate || "",
          `"${user.phoneNumber || ""}"`,
          user.createdAt || "",
          user.updatedAt || "",
          `"${user.createdBy || ""}"`
        ].join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `users_export_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Birth Date",
        accessor: "birthDate",
      },
      {
        Header: "Phone",
        accessor: "phoneNumber",
      },
      {
        Header: "Created At",
        accessor: "createdAt",
        Cell: ({ value }) => value ? new Date(value).toLocaleDateString() : "-"
      },
      {
        Header: "Actions",
        accessor: "actions",
        disableSortBy: true,
        Cell: ({ row }) => (
          <div>
            <button
              className="btn btn-sm btn-outline-primary me-1"
              onClick={() => navigate(`/users/${row.original.id}`)}
              title="Edit"
            >
              <i className="far fa-edit"></i>
            </button>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => deleteUser(row.original.id)}
              title="Delete"
            >
              <i className="fas fa-trash"></i>
            </button>
          </div>
        ),
      },
    ],
    [navigate, users]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: filteredUsers,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Users ({filteredUsers.length})</h4>
        <div>
          <button className="btn btn-success me-2" onClick={exportToCSV}>
            <i className="fas fa-download me-1"></i> Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/add")}>
            <i className="fas fa-plus me-1"></i> Add User
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      <div className="row mb-3">
        <div className="col-md-4">
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
            {searchEmail && (
              <button
                className="btn btn-outline-secondary"
                onClick={() => setSearchEmail("")}
              >
                Clear
              </button>
            )}
          </div>
        </div>
        <div className="col-md-2">
          <select
            className="form-select"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="alert alert-info">
          {searchEmail ? "No users match your search." : "No users found. Add your first user!"}
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-hover" {...getTableProps()}>
              <thead className="table-dark">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                        {column.render("Header")}
                        <span>
                          {column.isSorted ? (column.isSortedDesc ? " ▼" : " ▲") : ""}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center">
            <span>
              Page {pageIndex + 1} of {pageOptions.length}
            </span>
            <div>
              <button
                className="btn btn-outline-primary me-1"
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                {"<<"}
              </button>
              <button
                className="btn btn-outline-primary me-1"
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                {"<"}
              </button>
              <button
                className="btn btn-outline-primary me-1"
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                {">"}
              </button>
              <button
                className="btn btn-outline-primary"
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                {">>"}
              </button>
            </div>
          </div>
        </>
      )}

      {users.length > 0 && (
        <div className="mt-3">
          <button className="btn btn-sm btn-outline-danger" onClick={removeAllUsers}>
            <i className="fas fa-trash-alt me-1"></i> Remove All Users
          </button>
        </div>
      )}
    </div>
  );
};

export default UsersList;
