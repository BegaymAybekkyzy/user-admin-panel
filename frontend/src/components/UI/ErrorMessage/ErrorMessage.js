import "./ErrorMessage.css";

const ErrorMessage = () => {
    const box = document.createElement("div");
    box.classList.add("error-message", "hidden");

    const show = (message) => {
        box.textContent = `Error: ${message}`;
        box.classList.remove("hidden");
    };

    const hide = () => {
        box.classList.add("hidden");
        box.textContent = "";
    };

    return { box, show, hide };
};

export default ErrorMessage;
