import puppeteer from 'puppeteer';

export type Matcha = {
  title: string;
  type: string;
};

// Function to fetch and parse the matcha links using Puppeteer
export async function getAvailableMatchas() {
  const url = process.env.MARUKYU_ALL_URL ?? '';
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  const availableMatchas = await page.evaluate(() => {
    // Function to find all links with the specified criteria
    function findAvailableMatchas() {
      // Get all links on the page
      const links = document.querySelectorAll(
        'a.woocommerce-loop-product__link'
      );
      const availableMatchas: Matcha[] = [];

      // Iterate through each link
      links.forEach((link) => {
        // Type cast link to HTMLAnchorElement
        const anchor = link as HTMLAnchorElement;

        // Check for the span with the class 'product-flash' and text 'Principal Matcha'
        const productFlashSpan = link.querySelector('span.product-flash');
        const productImageDiv = link.querySelector('div.product-image');

        if (productFlashSpan && productImageDiv) {
          // Assuming product-image div is the parent element containing the pseudo-element
          const computedStyle = window.getComputedStyle(
            productImageDiv,
            '::after'
          );
          if (computedStyle && computedStyle.content.includes('View Detail')) {
            const type = productFlashSpan.textContent ?? 'Unknown';
            // If both conditions are met, add the link to the availableMatchas array
            availableMatchas.push({
              title: anchor.title,
              type,
            });
          }
        }
      });

      // Return the list of matching links
      return availableMatchas;
    }

    return findAvailableMatchas();
  });

  await browser.close();

  return availableMatchas;
}
