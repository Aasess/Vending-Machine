// student Name     - student number
// -------------------------------------
// Ashish Neupane   - 8897734
// Nandipati Vamsi  - 8922647
// Bipin Gurung     - 8899022

document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const increaseFontButton = document.getElementById("increaseFont");
  const decreaseFontButton = document.getElementById("decreaseFont");

  let currentFontSize = 16; // Initial font size in pixels
  let currentFontSizeH1 = 32;
  let currentFontSizeH2 = 24;
  let currentFontSizeH3 = 18.72;

  // Get references to h1, h2, and h3 elements
  const h1 = document.querySelector("h1");
  const h2 = document.querySelector("h2");
  const h3 = document.querySelector("h3");

  const deleteButtons = document.querySelectorAll(".delete-btn");

  increaseFontButton.addEventListener("click", function () {
    currentFontSize += 2;
    currentFontSizeH1 += 2;
    currentFontSizeH2 += 2;
    currentFontSizeH3 += 2;
    body.style.fontSize = `${currentFontSize}px`;
    h1.style.fontSize = `${currentFontSizeH1}px`;
    h2.style.fontSize = `${currentFontSizeH2}px`;
    h3.style.fontSize = `${currentFontSizeH3}px`;
  });

  decreaseFontButton.addEventListener("click", function () {
    currentFontSize -= 2;
    currentFontSizeH1 -= 2;
    currentFontSizeH2 -= 2;
    currentFontSizeH3 -= 2;
    body.style.fontSize = `${currentFontSize}px`;
    h1.style.fontSize = `${currentFontSizeH1}px`;
    h2.style.fontSize = `${currentFontSizeH2}px`;
    h3.style.fontSize = `${currentFontSizeH3}px`;
  });

  deleteButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const machineId = this.getAttribute("data-machine-id");
      const productId = this.getAttribute("data-product-id");

      // Confirm the deletion
      if (confirm("Are you sure you want to delete this record?")) {
        // Send an asynchronous request to the server to delete the record
        fetch(`/delete-product/${machineId}/${productId}`, {
          method: "DELETE",
        })
          .then((response) => response.json())
          .then((data) => {
            // Optionally, update the UI or show a message after successful deletion
            console.log(data.message);
            // Reload the page or update the UI as needed
            location.reload();
          })
          .catch((error) => console.error("Error:", error));
      }
    });
  });
});
