(function () {
  "use strict";

  const product = document.querySelector("[data-product]");
  if (!product) return;

  const options = Array.from(product.querySelectorAll(".packaging__option"));
  const skuValue = product.querySelector("[data-sku-value]");
  const priceCurrent = product.querySelector("[data-price-current]");
  const priceOld = product.querySelector("[data-price-old]");
  const priceBlock = product.querySelector(".price");
  const discountNote = product.querySelector("[data-discount-note]");
  const discountValue = product.querySelector("[data-discount-value]");
  const addToCartBtn = product.querySelector("[data-add-to-cart]");
  const toast = document.querySelector("[data-toast]");
  const cartCount = document.querySelector("[data-cart-count]");
  const favButton = product.querySelector("[data-fav]");

  let toastTimer = null;
  let addedTimer = null;
  let cartItems = 0;

  function formatPrice(value) {
    const number = Number(value);
    const hasCents = !Number.isInteger(number);

    return (
      new Intl.NumberFormat("ru-RU", {
        minimumFractionDigits: hasCents ? 2 : 0,
        maximumFractionDigits: 2,
      }).format(number) + "\u00A0₽"
    );
  }

  function calcDiscount(price, oldPrice) {
    if (!oldPrice || oldPrice <= price) return 0;
    return Math.round(((oldPrice - price) / oldPrice) * 100);
  }

  function setActiveOption(activeButton) {
    options.forEach((button) => {
      const isActive = button === activeButton;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-checked", String(isActive));
    });
  }

  function updatePricing(button) {
    const price = Number(button.dataset.price);
    const oldPrice = Number(button.dataset.oldPrice);
    const sku = button.dataset.sku;
    const discount = calcDiscount(price, oldPrice);

    priceBlock.classList.add("is-updating");

    window.setTimeout(() => {
      skuValue.textContent = sku;
      priceCurrent.textContent = formatPrice(price);

      if (oldPrice && oldPrice > price) {
        priceOld.textContent = formatPrice(oldPrice);
        priceOld.classList.remove("is-hidden");
        discountValue.textContent = String(discount);
        discountNote.classList.remove("is-hidden");
      } else {
        priceOld.textContent = "";
        priceOld.classList.add("is-hidden");
        discountNote.classList.add("is-hidden");
      }

      priceBlock.classList.remove("is-updating");
    }, 120);
  }

  function showToast(message) {
    if (!toast) return;

    toast.hidden = false;
    toast.textContent = message;

    requestAnimationFrame(() => {
      toast.classList.add("is-visible");
    });

    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
      window.setTimeout(() => {
        toast.hidden = true;
      }, 250);
    }, 2200);
  }

  options.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.classList.contains("is-active")) return;
      setActiveOption(button);
      updatePricing(button);
    });
  });

  addToCartBtn.addEventListener("click", () => {
    const active = product.querySelector(".packaging__option.is-active");
    if (!active) return;

    const weight = active.dataset.weight;
    const sku = active.dataset.sku;

    addToCartBtn.classList.add("is-added");
    addToCartBtn.querySelector(".btn-cart__text").textContent = "Добавлено";

    cartItems += 1;
    if (cartCount) {
      cartCount.hidden = false;
      cartCount.textContent = String(cartItems);
    }

    showToast(`«Ананасовый улун», ${weight} (арт. ${sku}) — в корзине`);

    window.clearTimeout(addedTimer);
    addedTimer = window.setTimeout(() => {
      addToCartBtn.classList.remove("is-added");
      addToCartBtn.querySelector(".btn-cart__text").textContent = "В корзину";
    }, 1800);
  });

  if (favButton) {
    favButton.addEventListener("click", () => {
      const active = favButton.classList.toggle("is-active");
      favButton.setAttribute("aria-pressed", String(active));
      favButton.setAttribute(
        "aria-label",
        active ? "Убрать из избранного" : "Добавить в избранное"
      );
    });
  }

  const menuToggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-nav]");
  const catalogToggle = document.querySelector("[data-catalog-toggle]");
  const searchToggle = document.querySelector("[data-search-toggle]");
  const search = document.querySelector("[data-search]");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(open));
    });
  }

  if (catalogToggle) {
    catalogToggle.addEventListener("click", (event) => {
      if (!window.matchMedia("(max-width: 991px)").matches) return;
      event.preventDefault();
      const item = catalogToggle.closest(".nav__item--catalog");
      const open = item.classList.toggle("is-open");
      catalogToggle.setAttribute("aria-expanded", String(open));
    });
  }

  if (searchToggle && search) {
    searchToggle.addEventListener("click", () => {
      const open = search.classList.toggle("is-open");
      searchToggle.setAttribute("aria-expanded", String(open));
      if (open) search.querySelector("input").focus();
    });
  }

  document.querySelectorAll("[data-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetId = tab.dataset.tab;
      document.querySelectorAll("[data-tab]").forEach((button) => {
        const selected = button === tab;
        button.classList.toggle("is-active", selected);
        button.setAttribute("aria-selected", String(selected));
        button.tabIndex = selected ? 0 : -1;
      });
      document.querySelectorAll(".tabs__panel").forEach((panel) => {
        panel.hidden = panel.id !== targetId;
      });
    });
  });

  const moreCats = document.querySelector("[data-more-cats]");
  if (moreCats) {
    moreCats.addEventListener("click", () => {
      const open = moreCats.getAttribute("aria-expanded") === "true";
      document.querySelectorAll(".cat-list__extra").forEach((item) => {
        item.hidden = open;
      });
      moreCats.setAttribute("aria-expanded", String(!open));
      moreCats.textContent = open ? "Ещё категории" : "Свернуть";
    });
  }

  const reviewForm = document.querySelector("[data-review-form]");
  if (reviewForm) {
    reviewForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const reviews = document.querySelector("[data-reviews]");
      reviews.innerHTML = '<p class="reviews__thanks">Спасибо! Отзыв сохранён на этой странице.</p>';
    });
  }
})();
