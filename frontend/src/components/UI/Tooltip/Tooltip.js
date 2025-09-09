import "./Tooltip.css";

const createTooltip = (target, text, position = "top") => {
  const tooltip = document.createElement("div");
  tooltip.className = `tooltip tooltip-${position}`;
  tooltip.textContent = text;
  document.body.appendChild(tooltip);

  const show = () => {
    tooltip.style.display = "block";
    const rect = target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    let top, left;

    switch (position) {
      case "top":
        top = rect.top - tooltipRect.height - 8;
        left = rect.left + rect.width / 2 - tooltipRect.width / 2;
        break;
      case "bottom":
        top = rect.bottom + 8;
        left = rect.left + rect.width / 2 - tooltipRect.width / 2;
        break;
      case "left":
        top = rect.top + rect.height / 2 - tooltipRect.height / 2;
        left = rect.left - tooltipRect.width - 8;
        break;
      case "right":
        top = rect.top + rect.height / 2 - tooltipRect.height / 2;
        left = rect.right + 8;
        break;
      default:
        top = rect.top - tooltipRect.height - 8;
        left = rect.left + rect.width / 2 - tooltipRect.width / 2;
    }

    tooltip.style.top = `${top + window.scrollY}px`;
    tooltip.style.left = `${left + window.scrollX}px`;
  };

  const hide = () => {
    tooltip.style.display = "none";
  };

  target.addEventListener("mouseenter", show);
  target.addEventListener("mouseleave", hide);

  return {
    destroy: () => {
      target.removeEventListener("mouseenter", show);
      target.removeEventListener("mouseleave", hide);
      tooltip.remove();
    },
  };
};

export default createTooltip;
