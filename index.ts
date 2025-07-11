import { Stagehand, Page, BrowserContext } from "@browserbasehq/stagehand";
import StagehandConfig from "./stagehand.config.js";
import chalk from "chalk";
import boxen from "boxen";
import { drawObserveOverlay, clearOverlays, actWithCache } from "./utils.js";
import { z } from "zod";

/**
 * 🤘 Welcome to Stagehand! Thanks so much for trying us out!
 * 🛠️ CONFIGURATION: stagehand.config.ts will help you configure Stagehand
 *
 * 📝 Check out our docs for more fun use cases, like building agents
 * https://docs.stagehand.dev/
 *
 * 💬 If you have any feedback, reach out to us on Slack!
 * https://stagehand.dev/slack
 *
 * 📚 You might also benefit from the docs for Zod, Browserbase, and Playwright:
 * - https://zod.dev/
 * - https://docs.browserbase.com/
 * - https://playwright.dev/docs/intro
 */
async function main({
  page,
  context,
  stagehand,
}: {
  page: Page; // Playwright Page with act, extract, and observe methods
  context: BrowserContext; // Playwright BrowserContext
  stagehand: Stagehand; // Stagehand instance
}) {
  // Navigate to the Amazon Mexico product page
  await page.goto("https://www.amazon.com.mx/gp/product/B0DDTKHX31?smid=A209UUQT8O7JCV&psc=1");

  // Wait for the page to load
  await page.waitForTimeout(3000);

  // Extract the current price from the Amazon product page
  const priceData = await page.extract({
    instruction: "extract the current price of the product",
    schema: z.object({
      price: z.string().describe("The current price of the product"),
      currency: z.string().optional().describe("The currency symbol or code"),
    }),
  });

  stagehand.log({
    category: "amazon-price-extractor",
    message: `Extracted Product Price`,
    auxiliary: {
      price: {
        value: priceData.price,
        type: "string",
      },
      currency: {
        value: priceData.currency || "MXN",
        type: "string",
      },
    },
  });

  // Log the price to console for easy viewing
  console.log(chalk.green(`\n🏷️ Product Price: ${priceData.price} ${priceData.currency || "MXN"}\n`));

  stagehand.log({
    category: "amazon-price-extractor",
    message: `Metrics`,
    auxiliary: {
      metrics: {
        value: JSON.stringify(stagehand.metrics),
        type: "object",
      },
    },
  });
}

/**
 * This is the main function that runs when you do npm run start
 *
 * YOU PROBABLY DON'T NEED TO MODIFY ANYTHING BELOW THIS POINT!
 *
 */
async function run() {
  const stagehand = new Stagehand({
    ...StagehandConfig,
  });
  await stagehand.init();

  if (StagehandConfig.env === "BROWSERBASE" && stagehand.browserbaseSessionID) {
    console.log(
      boxen(
        `View this session live in your browser: \n${chalk.blue(
          `https://browserbase.com/sessions/${stagehand.browserbaseSessionID}`,
        )}`,
        {
          title: "Browserbase",
          padding: 1,
          margin: 3,
        },
      ),
    );
  }

  const page = stagehand.page;
  const context = stagehand.context;
  await main({
    page,
    context,
    stagehand,
  });
  await stagehand.close();
  console.log(
    `\n🤘 Thanks so much for using Stagehand! Reach out to us on Slack if you have any feedback: ${chalk.blue(
      "https://stagehand.dev/slack",
    )}\n`,
  );
}

run();
