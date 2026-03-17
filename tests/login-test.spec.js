import { test, expect } from "@playwright/test";

const BASE_URL = "https://www.saucedemo.com/";

async function login(page) {
  await page.locator("#user-name").fill("standard_user");
  await page.locator("#password").fill("secret_sauce");
  await page.locator("#login-button").click();
  await expect(page.locator(".inventory_list")).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.goto(BASE_URL);
});

test("first playwright test", async ({ page }) => {
  await expect(page).toHaveTitle("Swag Labs");
});

test("login error messages", async ({ page }) => {
  await page.locator("#user-name").fill("standard_user");
  await page.locator("#password").fill("secretsauce");
  await page.locator("#login-button").click();

  await expect(page.locator(".error-message-container.error")).toHaveText(
    "Epic sadface: Username and password do not match any user in this service",
  );
});

test("successful login", async ({ page }) => {
  await login(page);
  await expect(page).toHaveTitle("Swag Labs");
});

test("inventory page: open first product detail", async ({ page }) => {
  await login(page);

  const firstItem = page.locator(".inventory_item_name").first();
  await expect(firstItem).toBeVisible();
  await firstItem.click();
});

test("inventory page: check title", async ({ page }) => {
  await login(page);

  const inventoryItemName = page.locator(".inventory_item_name");
  const allTitles = await inventoryItemName.allTextContents();
  console.log(allTitles);
});

test("inventory page: open all and view product details", async ({ page }) => {
  await login(page);

  const firstItem = page.locator(".inventory_item_name").first();
  await expect(firstItem).toBeVisible();
  await firstItem.click();
  await page.locator("#back-to-products").click();
  await page.locator(".inventory_item_name").nth(2).click();
  await page.locator("#back-to-products").click();
});

test("inventory page: add to cart", async ({ page }) => {
  await login(page);

  await page.locator("#add-to-cart-sauce-labs-backpack").click();
  await page.locator("#add-to-cart-sauce-labs-bike-light").click();
  await page.locator("#add-to-cart-sauce-labs-bolt-t-shirt").click();
  await page.locator("#add-to-cart-sauce-labs-fleece-jacket").click();
  await page.locator("#add-to-cart-sauce-labs-onesie").click();
  await page
    .locator('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]')
    .click();
});

test("inventory page: add to cart and remove", async ({ page }) => {
  await login(page);

  await page.locator("#add-to-cart-sauce-labs-backpack").click();
  await page.locator("#add-to-cart-sauce-labs-bike-light").click();
  await page.locator("#add-to-cart-sauce-labs-bolt-t-shirt").click();
  await page.locator("#add-to-cart-sauce-labs-fleece-jacket").click();
  await page.locator("#add-to-cart-sauce-labs-onesie").click();
  await page
    .locator('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]')
    .click();

  await page.locator('[data-test="shopping-cart-link"]').click();

  await page
    .locator('[data-test="remove-test.allthethings()-t-shirt-(red)"]')
    .click();
  await page.locator('[data-test="remove-sauce-labs-bike-light"]').click();
  await page.locator('[data-test="remove-sauce-labs-fleece-jacket"]').click();

  await page.locator("#checkout").click();

  await page.locator("#first-name").fill("John");
  await page.locator("#last-name").fill("Doe");
  await page.locator("#postal-code").fill("12345");
  await page.locator("#continue").click();

  await page.locator("#finish").click();
  await expect(page.locator(".title")).toHaveText("Checkout: Complete!");

  await page.locator("#back-to-products").click();

  await expect(page.locator(".inventory_list")).toBeVisible();
});

test(" Continue shopping from cart", async ({ page }) => {
  await login(page);

  await page.locator("#add-to-cart-sauce-labs-backpack").click();
  await page.locator("#add-to-cart-sauce-labs-bike-light").click();
  await page.locator("#add-to-cart-sauce-labs-bolt-t-shirt").click();
  await page.locator("#add-to-cart-sauce-labs-fleece-jacket").click();
  await page.locator("#add-to-cart-sauce-labs-onesie").click();
  await page
    .locator('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]')
    .click();

  await page.locator('[data-test="shopping-cart-link"]').click();

  await page
    .locator('[data-test="remove-test.allthethings()-t-shirt-(red)"]')
    .click();
  await page.locator('[data-test="remove-sauce-labs-bike-light"]').click();
  await page.locator('[data-test="remove-sauce-labs-fleece-jacket"]').click();

  await page.locator("#continue-shopping").click();

  await expect(page.locator(".inventory_list")).toBeVisible();
});
