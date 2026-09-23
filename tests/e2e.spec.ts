import { test, expect } from "@playwright/test";

const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 800 },
];

for (const vp of viewports) {
  test(`layout ${vp.name} renders 9 cards without page scroll`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /sketchbook/i })
    ).toBeVisible();
    await expect(page.getByRole("button", { name: /Open / })).toHaveCount(
      9
    );
    const noXScroll = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1
    );
    expect(noXScroll).toBe(true);
    await page.screenshot({ path: `test-results/home-${vp.name}.png` });
    expect(errors).toEqual([]);
  });
}

test("keyboard open/close returns focus to the card", async ({ page }) => {
  await page.goto("/");
  const first = page.getByRole("button", { name: "Open vendela" });
  await first.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("button", { name: "Close detail view" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(first).toBeFocused();
});

test("reveal plays, pauses, resumes from the same frame", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open vendela" }).click();
  const bar = page.getByRole("progressbar");
  await expect(bar).toBeVisible();
  const v1 = Number(await bar.getAttribute("aria-valuenow"));
  await page.waitForTimeout(1500);
  const v2 = Number(await bar.getAttribute("aria-valuenow"));
  expect(v2).toBeGreaterThan(v1);
  await page.getByRole("button", { name: "Pause reveal" }).click();
  const paused = await bar.getAttribute("aria-valuenow");
  await page.waitForTimeout(800);
  expect(await bar.getAttribute("aria-valuenow")).toBe(paused);
  await page.getByRole("button", { name: "Resume reveal" }).click();
  await page.waitForTimeout(800);
  const resumed = Number(await bar.getAttribute("aria-valuenow"));
  expect(resumed).toBeGreaterThan(Number(paused));
});

for (const vp of viewports) {
  test(`detail mid-reveal ${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto("/");
    await page.getByRole("button", { name: "Open vendela" }).click();
    const bar = page.getByRole("progressbar");
    await expect(bar).toBeVisible();
    await page.waitForFunction(
      () => Number(document.querySelector('[role=progressbar]')?.getAttribute("aria-valuenow") ?? 0) > 30
    );
    await page.screenshot({ path: `test-results/detail-${vp.name}.png` });
    await expect(
      page.getByRole("button", { name: "Close detail view" })
    ).toBeVisible();
  });
}

test("wash clears on close when nothing hovered", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open vendela" }).click();
  const wash = page.locator('img[aria-hidden="true"]').first();
  await expect(wash).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Close detail view" })
  ).toBeHidden();
  await expect(page.locator('img[aria-hidden="true"]')).toHaveCount(0);
});

test("strip is keyboard-focusable and wheel-scrolls", async ({ page }) => {
  await page.goto("/");
  const strip = page.getByRole("region", { name: /archive/i });
  await strip.focus();
  await expect(strip).toBeFocused();
  const moved = await page.evaluate(() => {
    const el = document.querySelector("[role=region]") as HTMLElement;
    const before = el.scrollLeft;
    el.dispatchEvent(
      new WheelEvent("wheel", { deltaY: 300, bubbles: true, cancelable: true })
    );
    return el.scrollLeft > before;
  });
  expect(moved).toBe(true);
});
