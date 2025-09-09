import "./Modal.css";

const createModal = () => {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay hidden";

  const modal = document.createElement("div");
  modal.className = "modal";

  const header = document.createElement("div");
  header.className = "modal-header";

  const title = document.createElement("h2");
  title.className = "modal-title";
  title.textContent = "Modal";

  const closeBtn = document.createElement("button");
  closeBtn.className = "modal-close";
  closeBtn.innerHTML = "&times;";

  header.appendChild(title);
  header.appendChild(closeBtn);

  const body = document.createElement("div");
  body.className = "modal-body";

  const footer = document.createElement("div");
  footer.className = "modal-footer";

  modal.appendChild(header);
  modal.appendChild(body);
  modal.appendChild(footer);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  closeBtn.addEventListener("click", () => hide());
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) hide();
  });

  const show = ({ title: t, content, footerButtons }) => {
    title.textContent = t || "Modal";
    body.innerHTML = "";
    footer.innerHTML = "";

    if (typeof content === "string") {
      body.innerHTML = content;
    } else if (content instanceof HTMLElement) {
      body.appendChild(content);
    }

    if (footerButtons && Array.isArray(footerButtons)) {
      footerButtons.forEach((btn) => {
        const button = document.createElement("button");
        button.textContent = btn.label;
        button.className = btn.class || "modal-btn";
        button.addEventListener("click", btn.onClick);
        footer.appendChild(button);
      });
    }

    overlay.classList.remove("hidden");
  };

  const hide = () => {
    overlay.classList.add("hidden");
  };

  return { show, hide, overlay };
};

export default createModal;
