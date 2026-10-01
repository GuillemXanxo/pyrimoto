document.addEventListener("DOMContentLoaded", () => {

const header = document.querySelector(".site-header-home");

if (!header) {
return;
}

const updateHeader = () => {

if (window.scrollY > 40) {
  header.classList.add("is-scrolled");
} else {
  header.classList.remove("is-scrolled");
}


};

updateHeader();

window.addEventListener("scroll", updateHeader, {
passive: true
});

});