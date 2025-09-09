const Pagination = (onChangePage) => {
  const div = document.createElement("div");
  div.className = "pagination";

  div.innerHTML = `
    <span class="total-items"></span>
    <div>
      <button type="button" class="btn-outline prev-page">prev</button>
      <span class="page-info"></span>
      <button type="button" class="btn-outline next-page">next</button>
    </div>
  `;

  const totalItemsSpan = div.querySelector(".total-items");
  const prevBtn = div.querySelector(".prev-page");
  const nextBtn = div.querySelector(".next-page");
  const pageInfo = div.querySelector(".page-info");

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
