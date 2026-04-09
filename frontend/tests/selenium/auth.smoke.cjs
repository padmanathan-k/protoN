const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { spawn } = require("child_process");
const fs = require("fs");

const host = "127.0.0.1";
const port = 4173;
const baseUrl = `http://${host}:${port}`;

const waitForServer = async (url, attempts = 60) => {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        return;
      }
    } catch (error) {
      // Keep retrying until the preview server is ready.
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error(`Timed out waiting for preview server at ${url}`);
};

const startPreviewServer = () =>
  spawn("npm", ["run", "dev", "--", "--host", host, "--port", String(port)], {
    cwd: process.cwd(),
    shell: true,
    stdio: "inherit",
  });

const resolveBrowserBinary = () => {
  const candidates = [
    process.env.CHROME_BIN,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
  ].filter(Boolean);

  return candidates.find((candidate) => fs.existsSync(candidate)) || "";
};

const createDriver = async () => {
  const options = new chrome.Options()
    .addArguments("--headless=new")
    .addArguments("--no-sandbox")
    .addArguments("--disable-dev-shm-usage")
    .addArguments("--window-size=1440,1200");

  const browserBinary = resolveBrowserBinary();

  if (browserBinary) {
    options.setChromeBinaryPath(browserBinary);
  }

  return new Builder().forBrowser("chrome").setChromeOptions(options).build();
};

const run = async () => {
  const preview = startPreviewServer();
  let driver;

  try {
    await waitForServer(baseUrl);
    driver = await createDriver();

    await driver.get(`${baseUrl}/login`);
    await driver.wait(until.elementLocated(By.css("form.auth-card")), 15000);
    await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'go Need')]")), 10000);
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'protoN for Social')]")), 10000);

    const createLink = await driver.findElement(By.linkText("Create profile"));
    await createLink.click();
    await driver.wait(until.urlContains("/register"), 10000);
    await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'go Need')]")), 10000);
  } finally {
    if (driver) {
      await driver.quit();
    }

    preview.kill();
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
