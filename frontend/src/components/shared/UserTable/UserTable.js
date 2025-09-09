import {fetchUsers} from "../../../actions/admins/usersManagement.js";
import Filters from "./Filters.js";
import Table from "./Table.js";
import Pagination from "./Pagination.js";
import "./UserTable.css";
import ErrorMessage from "../../UI/ErrorMessage/ErrorMessage.js";

const UserTable = () => {
    const wrapper = document.createElement("section");
    wrapper.classList.add("user-table-wrapper", "container");

    let page = 1;
    let limit = 10;
    let filters = { username: "", firstName: "", birthdate: "" };
    let sortBy = "first_name";
    let order = "asc";
    let totalPages = 1;
    let totalItems = 0;

    const { box: errorBox, show, hide } = ErrorMessage();
    wrapper.appendChild(errorBox);

    const { table, updateRows } = Table(
        sortField => {
            if (sortBy === sortField) {
                order = order === "asc" ? "desc" : "asc";
            } else {
                sortBy = sortField;
                order = "asc";
            }
            void loadData();
        },
        () => {
            void loadData();
        }
    );

    const filtersComp = Filters(newFilters => {
        filters = newFilters;
        page = 1;
        void loadData();
    });

    const { div: pagination, updateInfo } = Pagination(direction => {
        if (direction === "prev" && page > 1) {
            page--;
            void loadData();
        }
        if (direction === "next" && page < totalPages) {
            page++;
            void loadData();
        }
    });

    const showError = (message) => {
        show(message);
        table.classList.add("hidden");
        pagination.classList.add("hidden");
    };

    const hideError = () => {
        hide();
        table.classList.remove("hidden");
        pagination.classList.remove("hidden");
    };

    const loadData = async () => {
        try {
            const response = await fetchUsers({
                page,
                limit,
                ...filters,
                sortBy,
                order,
            });

            if (!response) {
                showError("No data from the server");
                return;
            }

            updateRows(response.data);
            totalPages = response.pagination.totalPages;
            totalItems = response.pagination.total;
            page = response.pagination.page;
            updateInfo(page, totalPages, totalItems);
            hideError();
        } catch (err) {
            showError(err.message || "Unknown error");
        }
    };

    wrapper.appendChild(filtersComp);
    wrapper.appendChild(table);
    wrapper.appendChild(pagination);

    void loadData();
    return wrapper;
};

export default UserTable;