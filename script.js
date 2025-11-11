document.addEventListener("DOMContentLoaded", function () {
  const purchasePriceInput = document.getElementById("purchase-price-input");
  const purchasePriceSlider = document.getElementById("purchase-price-slider");
  const downPaymentInput = document.getElementById("down-payment-input");
  const downPaymentSlider = document.getElementById("down-payment-slider");
  const periodRadios = document.querySelectorAll('input[name="period"]');
  const zipCodeInput = document.getElementById("zip-code-input");
  const paymentAmount = document.querySelector(".calculation-results__amount");
  const rateValue = document.querySelector(".detail-item__value:nth-child(1)");
  const aprValue = document.querySelector(".detail-item__value:nth-child(2)");
  const pointsValue = document.querySelector(
    ".detail-item__value:nth-child(3)"
  );
  const ctaButton = document.querySelector(".cta-button");

  function syncPurchasePrice() {
    const value = parseInt(purchasePriceInput.value);
    const min = parseInt(purchasePriceInput.min);
    const max = parseInt(purchasePriceInput.max);

    if (value >= min && value <= max) {
      purchasePriceSlider.value = value;
      validateDownPayment();
      calculatePayment();
    } else {
      purchasePriceInput.value = purchasePriceSlider.value;
    }
  }

  function syncDownPayment() {
    const value = parseInt(downPaymentInput.value);
    const min = parseInt(downPaymentInput.min);
    const max = parseInt(downPaymentInput.max);

    if (value >= min && value <= max) {
      downPaymentSlider.value = value;
      validateDownPayment();
      calculatePayment();
    } else {
      downPaymentInput.value = downPaymentSlider.value;
    }
  }

  function validateDownPayment() {
    const purchasePrice = parseInt(purchasePriceInput.value);
    const downPayment = parseInt(downPaymentInput.value);
    const minDownPayment = purchasePrice * 0.04;

    if (downPayment < minDownPayment) {
      const newDownPayment = Math.ceil(minDownPayment);
      downPaymentInput.value = newDownPayment;
      downPaymentSlider.value = newDownPayment;

      if (
        confirm(
          `Down payment must be at least 4% ($${newDownPayment.toLocaleString()}). Update to this amount?`
        )
      ) {
        calculatePayment();
      }
    }
  }

  function calculatePayment() {
    const purchasePrice = parseInt(purchasePriceInput.value);
    const downPayment = parseInt(downPaymentInput.value);
    const loanAmount = purchasePrice - downPayment;

    if (loanAmount <= 0) {
      showError("Down payment cannot exceed purchase price");
      return;
    }

    let selectedPeriod = "30-year";
    periodRadios.forEach((radio) => {
      if (radio.checked) {
        selectedPeriod = radio.value;
      }
    });

    const result = getSecureCalculation(loanAmount, selectedPeriod);
    paymentAmount.textContent = result.monthlyPayment.toLocaleString();
    rateValue.textContent = result.rate;
    aprValue.textContent = result.apr;
    pointsValue.textContent = result.points;
  }

  function getSecureCalculation(loanAmount, period) {
    const calculations = {
      "5-1-arm": {
        rate: "4.125%",
        apr: "3.892%",
        points: "0.125",
        monthlyPayment: Math.round(loanAmount * 0.00489),
      },
      "15-year": {
        rate: "4.875%",
        apr: "4.215%",
        points: "0.225",
        monthlyPayment: Math.round(loanAmount * 0.00782),
      },
      "30-year": {
        rate: "5.250%",
        apr: "4.418%",
        points: "0.325",
        monthlyPayment: Math.round(loanAmount * 0.00553),
      },
    };

    return calculations[period] || calculations["30-year"];
  }


  function showError(message) {
    alert(`Error: ${message}`);
  }


  function handleGetStarted() {
    const purchasePrice = parseInt(purchasePriceInput.value);
    const downPayment = parseInt(downPaymentInput.value);
    const zipCode = zipCodeInput.value.trim();

    if (purchasePrice < 50000) {
      alert("Purchase price must be at least $50,000");
      purchasePriceInput.focus();
      return;
    }

    if (downPayment < 2000) {
      alert("Down payment must be at least $2,000");
      downPaymentInput.focus();
      return;
    }

    if (downPayment > purchasePrice) {
      alert("Down payment cannot exceed purchase price");
      downPaymentInput.focus();
      return;
    }

    if (!zipCode) {
      if (
        confirm(
          "ZIP code is required for accurate rates. Continue without ZIP code?"
        )
      ) {
        proceedWithApplication();
      }
    } else {
      proceedWithApplication();
    }
  }

  function proceedWithApplication() {
    const purchasePrice = parseInt(purchasePriceInput.value);
    const downPayment = parseInt(downPaymentInput.value);
    const monthlyPayment = paymentAmount.textContent;

    const message =
      `Welcome onboard!\n\n` +
      `• Purchase Price: $${purchasePrice.toLocaleString()}\n` +
      `• Down Payment: $${downPayment.toLocaleString()}\n` +
      `• Estimated Monthly Payment: $${monthlyPayment}\n\n` +
      `Would you like to continue?`;

    if (confirm(message)) {
      alert(
        "Thank you!"
      );
    }
  }

  purchasePriceInput.addEventListener("input", syncPurchasePrice);
  purchasePriceSlider.addEventListener("input", function () {
    purchasePriceInput.value = this.value;
    validateDownPayment();
    calculatePayment();
  });

  downPaymentInput.addEventListener("input", syncDownPayment);
  downPaymentSlider.addEventListener("input", function () {
    downPaymentInput.value = this.value;
    validateDownPayment();
    calculatePayment();
  });

  periodRadios.forEach((radio) => {
    radio.addEventListener("change", calculatePayment);
  });

  ctaButton.addEventListener("click", handleGetStarted);
  purchasePriceInput.addEventListener("blur", function () {
    if (this.value === "" || this.value < this.min) {
      this.value = this.min;
    }
    syncPurchasePrice();
  });

  downPaymentInput.addEventListener("blur", function () {
    if (this.value === "" || this.value < this.min) {
      this.value = this.min;
    }
    syncDownPayment();
  });

  calculatePayment();
});
