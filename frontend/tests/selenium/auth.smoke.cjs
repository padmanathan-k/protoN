const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { spawn } = require("child_process");
const fs = require("fs");
const net = require("net");
const chromedriver = require("chromedriver");

const host = "127.0.0.1";
let port = 4173;
let baseUrl = `http://${host}:${port}`;

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

const getFreePort = async () =>
  new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, host, () => {
      const address = server.address();
      const freePort = typeof address === "object" && address ? address.port : 4173;
      server.close(() => resolve(freePort));
    });
    server.on("error", reject);
  });

const startPreviewServer = () =>
  spawn("npm", ["run", "preview", "--", "--host", host, "--port", String(port), "--strictPort"], {
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

  const service = new chrome.ServiceBuilder(chromedriver.path);

  return new Builder().forBrowser("chrome").setChromeOptions(options).setChromeService(service).build();
};

const run = async () => {
  port = await getFreePort();
  baseUrl = `http://${host}:${port}`;
  console.log(`Starting preview server at ${baseUrl}`);
  const preview = startPreviewServer();
  let driver;

  preview.on("exit", (code) => {
    console.log(`Preview server exited with code ${code}`);
  });

  try {
    await waitForServer(baseUrl);
    console.log("Preview server is ready");
    driver = await createDriver();
    console.log("Chrome driver started");

    await driver.get(`${baseUrl}/login`);
    console.log("Opened login page");
    await driver.wait(until.elementLocated(By.css("form.auth-card")), 15000);
    console.log("Auth card located");
    await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'go Need')]")), 10000);
    console.log("Submit button located");
    await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'protoN for Social')]")), 10000);

    const createLink = await driver.findElement(By.linkText("Create profile"));
    await createLink.click();
    await driver.wait(until.urlContains("/register"), 10000);
    await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'go Need')]")), 10000);
    console.log("Register screen verified");
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
