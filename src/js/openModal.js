
function openModal() {
    document.getElementById("modal").style.display = "flex";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

const buttons = document.querySelectorAll(".date-container button, .professional-container button, .time-container button");
const timeContainer = document.getElementById("time-container");
const confirmButton = document.getElementById("confirm-button");
let selectedCount = 0;

buttons.forEach(button => {
    button.addEventListener("click", function() {
        this.parentElement.querySelectorAll("button").forEach(btn => btn.classList.remove("selected"));
        this.classList.add("selected");
        if (document.querySelector(".date-container .selected") && document.querySelector(".professional-container .selected")) {
            timeContainer.style.display = "block";
        }
        if (document.querySelector(".date-container .selected") && document.querySelector(".professional-container .selected") && document.querySelector(".time-container .selected")) {
            confirmButton.classList.add("active");
            confirmButton.removeAttribute("disabled");
        }
    });
});