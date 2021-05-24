const copyFunc = () => {
  const btnCopy = document.querySelector("#btnCopy");
  const cutUrl = document.querySelector("#cutUrl");
  btnCopy.addEventListener("click", () => {
    cutUrl.select();
    cutUrl.setSelectionRange(0, 99999); //for mobile device

    document.execCommand("copy");
    // btnCopy.setAttribute("data-toggle", "popover");
    // btnCopy.setAttribute("data-placement", "top");
    // btnCopy.setAttribute("title", "لینک کپی شد");
  });
};

copyFunc();
