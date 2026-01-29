// client/src/formValidation.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".app .form");
  if (!form) return;

  const usernameInput = form.querySelector("input[name='username']");
  const passwordInput = form.querySelector("input[name='password']");
  
  const formErrorBox = form.querySelector(".form-error-box");
  const usernameError = form.querySelector("#username-error");
  const passwordError = form.querySelector("#password-error");

  // Utility to clear previous errors
  const clearErrors = () => {
    [usernameInput, passwordInput].forEach(input => input.classList.remove("input-error"));
    [usernameError, passwordError].forEach(el => {
      if (el) el.textContent = "";
    });
    if (formErrorBox) formErrorBox.style.display = "none";
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();

    let hasError = false;

    // --- Username validation ---
    if (!usernameInput.value.trim()) {
      usernameInput.classList.add("input-error");
      if (usernameError) usernameError.textContent = "Username is required.";
      hasError = true;
    }

    // --- Password validation ---
    if (!passwordInput.value.trim()) {
      passwordInput.classList.add("input-error");
      if (passwordError) passwordError.textContent = "Password is required.";
      hasError = true;
    }

    if (hasError) return;

    // --- Submit form to backend ---
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameInput.value,
          password: passwordInput.value
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Show backend error in red top box
        if (formErrorBox) {
          formErrorBox.textContent = data.message || "Invalid credentials.";
          formErrorBox.style.display = "block";
        }
        return;
      }

      // Success — redirect or update UI
      window.location.href = "/dashboard";

    } catch (err) {
      if (formErrorBox) {
        formErrorBox.textContent = "Network error. Please try again.";
        formErrorBox.style.display = "block";
      }
    }
  });
});
