import "./UserTable.css";

const Pagination = (onChangePage) => {
    const div = document.createElement("div");
    div.className = "pagination";

    div.innerHTML = `
        <span id="totalItems"></span>
        <div>
            <button id="prevPage">prev</button>
            <span id="pageInfo"></span>
            <button id="nextPage">next</button>
        </div>
    `;

    const totalItemsSpan = div.querySelector("#totalItems");
    const prevBtn = div.querySelector("#prevPage");
    const nextBtn = div.querySelector("#nextPage");
    const pageInfo = div.querySelector("#pageInfo");

    prevBtn.addEventListener("click", () => onChangePage("prev"));
    nextBtn.addEventListener("click", () => onChangePage("next"));

    const updateInfo = (page, totalPages, totalItems) => {
        totalItemsSpan.textContent = `Total: ${totalItems}`;
        pageInfo.textContent = `Page ${page} of ${totalPages}`;

        prevBtn.disabled = page <= 1;
        nextBtn.disabled = page >= totalPages;
    };

    return { div, updateInfo };
};

export default Pagination;
