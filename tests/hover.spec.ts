import { test, expect } from "@playwright/test";

// Hover across cards like a real user, then park off-card.
// The wash must track the hovered card and vanish off-card.
test("wash tracks hover and clears off-card", async ({ page }) => {
  await page.goto("/");
  const title = page.getByRole("heading", { name: /sketchbook/i });
  const wash = page.locator('img[aria-hidden="true"]');

  const washSrc = async () =>
    (await wash.count()) > 0
      ? wash.first().getAttribute("src")
      : null;

  // park off-card first: expect blank
  await title.hover();
  expect(await washSrc()).toBe(null);

  // hover three different cards: wash must appear and change
  const seen = new Set<string | null>();
  for (const name of ["Open vendela", "Open shu", "Open angelina"]) {
    await page.getByRole("button", { name }).hover();
    seen.add(await washSrc());
  }
  expect([...seen].filter(Boolean).length).toBeGreaterThan(1);

  // park off-card (header): expect blank again
  await title.hover();
  expect(await washSrc()).toBe(null);
});

test("card does not oscillate when hovered at its bottom edge", async ({
  page,
}) => {
  await page.goto("/");
  const card = page.getByRole("button", { name: "Open vendela" });
  const label = card.locator("span").last();
  const box = await label.boundingBox();
  if (!box) throw new Error("no label box");
  // park on the bottom label row, the jiggle trigger spot
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(300);
  const tops: number[] = [];
  for (let i = 0; i < 5; i++) {
    tops.push((await card.boundingBox())?.y ?? -1);
    await page.waitForTimeout(200);
  }
  expect(new Set(tops).size).toBe(1);
});
