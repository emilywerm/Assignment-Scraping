// get puppeteer packages
const puppeteer = require("puppeteer");
const fs = require("fs/promises");

async function scrapeAmazonProduct(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  // Extracting product information
  const productName = await page.$eval("#productTitle", (data) =>
    data.textContent.trim()
  );
  const starRating = await page.$eval(".a-icon-star span.a-icon-alt", (data) =>
    data.textContent.trim()
  );
  const totalRatings = await page.$eval("#acrCustomerReviewText", (data) =>
    data.textContent.trim()
  );
  const productImage = await page.$eval("#landingImage", (data) =>
    data.getAttribute("src")
  );
  const productPrice = await page.$eval(
    "#corePriceDisplay_desktop_feature_div > div.a-section.a-spacing-none.aok-align-center.aok-relative > span.a-price.aok-align-center.reinventPricePriceToPayMargin.priceToPay",
    (data) => data.textContent.trim()
  );

  await browser.close();

  // Prepare the data to write to a file
  const productData = `${productName}\n${starRating}\n${totalRatings}\n${productImage}\n${productPrice}`;

  // Write the data to a file named product1.txt
  await fs.writeFile("product3.txt", productData);

  return productData;
}

// Fetch the URL from command line arguments
const url = process.argv[2];

if (!url) {
  console.error("Please provide a valid Amazon product URL.");
  process.exit(1);
}

scrapeAmazonProduct(url)
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
