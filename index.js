"use strict";

// CONSTs & LETs

// drag-drop & browse
const dropArea = document.querySelector(".drag-area");
// const dragText = dropArea.querySelector("header");
const btnImport = dropArea.querySelector(".browse-btn");
const ipFile = dropArea.querySelector("#ip-file");

// past url :-
const ipURL = dropArea.querySelector(".ip-url");
const btnScrap = dropArea.querySelector(".scrape-btn");

// navbar color change
const mainSection = document.querySelector(".main");
const navbar = document.querySelector("nav");
const navContent = document.querySelector(".item");

// Feedback
const feedback = document.querySelector(".ip-feedback");
const btnFeedback = document.querySelector(".btn-feedback");

// Supported Extensions
const validExt = ["text/plain"];

//

// CODE : FUNCTIONS

// CHANGE COLOR
const navbarColorChanger = (action) => {
  action === "add"
    ? navbar.classList.add("scrolled")
    : navbar.classList.remove("scrolled");
};

// LOG content string
const printFile = (file) => {
  const reader = new FileReader();
  reader.onload = (evt) => {
    const fileLinks = evt.target.result;
    console.log(fileLinks);
    console.log(file.name);
  };
  reader.readAsText(file);
};

// CHECK for valid file type
const checkFileType = function (file) {
  let fileType = file.type;
  if (validExt.includes(fileType)) {
    dropArea.classList.add("active");
    // further process
    printFile(file);
    uploadFile(file);
  } else {
    alert(`Not a valid Extensions\nValid Extension : [ .txt ]`);
    dropArea.classList.remove("active");
  }
};

function str2bytes(str) {
  var bytes = new Uint8Array(str.length);
  for (var i = 0; i < str.length; i++) {
    bytes[i] = str.charCodeAt(i);
  }
  return bytes;
}

// SEND file to API
const uploadFile = (file) => {
  toast(`Uploading file : "${file.name}"...`);
  const API_ENDPOINT = "https://scrapper-url.herokuapp.com/urlfile";
  const request = new XMLHttpRequest();
  const formData = new FormData();

  request.open("POST", API_ENDPOINT, true);
  request.onreadystatechange = () => {
    //

    //
    if (request.readyState === 4 && request.status === 200) {
      toast("Downloading file", 7);
      const driveUrl = request.responseText;
      console.log(driveUrl);

      // download automatically
      const driveUrlLink = document.createElement("a");
      driveUrlLink.href = driveUrl;
      driveUrlLink.click();

      driveUrlLink.remove(driveUrlLink);
      dropArea.classList.remove("active");
    }
    //
  };
  formData.append("", file);
  request.send(formData);
};

function saveFile(fileName, urlFile) {
  let a = document.createElement("a");
  a.style = "display: none";
  document.body.appendChild(a);
  a.href = urlFile;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
}

// SEND url to API
const post = (url, control) => {
  if (control == "url") {
    toast("Scrapping URL...");
    const data = {
      url: url,
    };

    const jsonData = JSON.stringify(data);

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      toast("URL Scrapped ✅", 3);
      if (this.readyState === 4) {
        console.log("response :", this.responseText);

        // const a = document.createElement("a");
        // a.href = this.responseText;
        // // Give filename you wish to download
        // a.style.display = "none";

        // document.body.appendChild(a);
        // a.click();

        saveFile("xxx.txt", this.responseText);

        ipURL.value = "";
        ipURL.focus();
      }
    });

    xhr.open("POST", "https://scrapper-url.herokuapp.com/urlinput");

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(jsonData);
  } else if (control == "keyword") {
    toast("Scrapping Keywords Top Url...");
    const data = {
      url: url,
    };

    const jsonData = JSON.stringify(data);

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      toast("URL Scrapped ✅", 3);
      if (this.readyState === 4) {
        console.log("response :", this.responseText);
        toast("Downloading file", 7);
        const driveUrl = this.responseText;
        console.log(driveUrl);

        // download automatically
        const driveUrlLink = document.createElement("a");
        driveUrlLink.href = driveUrl;
        driveUrlLink.click();

        driveUrlLink.remove("a");
      }
    });

    xhr.open("POST", "https://scrapper-url.herokuapp.com/scrapebykey");

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(jsonData);
  }
};

//

// CODE : INPUT Through Button

btnImport.onclick = () => ipFile.click();
ipFile.addEventListener("change", (e) => {
  const file = e.target.files[0];
  checkFileType(file);
});

//

// CODE : INPUT by Drag & Drop

// When file is being drag over the box
dropArea.addEventListener("dragover", (e) => {
  e.preventDefault(); // prevents default behaviour
  dropArea.classList.add("active");
});

// When file is  leaving or moved out of the box.
dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("active");
});

// When file is dropped on the box.
dropArea.addEventListener("drop", (e) => {
  e.preventDefault(); // prevents default behaviour
  const file = e.dataTransfer.files;
  console.log(file[0]);
  checkFileType(file[0]);
});

//

// CODE : INPUT when URL pasted
{
  const scrapURL = () => {
    const url = ipURL.value;
    if (url) {
      // console.log(url);
      var r = new RegExp(/^(ftp|http|https):\/\/[^ "]+$/);

      if (r.test(url)) {
        post(url, "url");
      } else {
        post(url, "keyword");
      }
    }
  };

  btnScrap.addEventListener("click", scrapURL);
  window.addEventListener("keypress", (e) => e.key === "Enter" && scrapURL());
}

// CODE : toast
const toast = (msg = "message", timeInSec = 4) => {
  const toast = `<div class="toastxyx"><p class="toast-txt">${msg}</p></div>`;
  document.getElementById("xxx").insertAdjacentHTML("beforebegin", toast);

  setTimeout(() => {
    document.querySelector(".toastxyx").remove();
  }, timeInSec * 1000);
};
toast("Happy Scrapping!");

// NAVBAR COLOR CHANGE
window.onscroll = function () {
  window.scrollY > mainSection.clientHeight &&
  window.scrollY < mainSection.clientHeight * 2
    ? navbarColorChanger("add")
    : navbarColorChanger("rem");
};

// FEEDBACK HANDLER
btnFeedback.addEventListener("click", () => {
  const ipFeedback = feedback.value ? feedback.value : "empty";
  console.log(ipFeedback);
});

// Delay execution
// const sleep = ms => new Promise(r => setTimeout(r, ms));
