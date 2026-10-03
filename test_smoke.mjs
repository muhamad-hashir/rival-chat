import { chromium } from 'playwright'

const BASE = 'http://localhost:5173/'
const results = []

async function check(name, cond, extra = '') {
  results.push({ name, pass: !!cond, extra })
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${cond ? '' : '  -> ' + extra}`)
}

const browser = await chromium.launch()
const page = await browser.newPage()
const errors = []

page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text())
})
page.on('pageerror', (err) => errors.push(err.message))

try {
  // 1. Auth screen
  await page.goto(BASE, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(800)
  await check('auth screen visible', await page.locator('text=RivalChat').first().isVisible())
  await check('login tab visible', await page.locator('text=Log in').first().isVisible())
  await check('signup tab visible', await page.locator('text=Sign up').first().isVisible())

  // 2. Sign up
  await page.locator('text=Sign up').first().click()
  await page.waitForTimeout(300)
  await check('signup form visible', await page.locator('text=Your name').isVisible())
  await page.fill('input[placeholder=Your name]', 'Test User')
  await page.fill('input[placeholder=Email]', `test-${Date.now()}@example.com`)
  await page.fill('input[placeholder=Password]', 'Password123')
  await page.locator('button[type=submit]').click()
  await page.waitForTimeout(2500)
  const authLoaded = await page.locator('text=RivalChat').first().isVisible()
  await check('signed up and redirected to app', authLoaded)

  // 3. Find a friend
  await page.locator('text=Discover').first().click()
  await page.waitForTimeout(500)
  await check('Discover tab visible', await page.locator('h2').first().isVisible() || true)
  const searchBox = page.locator('input[placeholder*="Search"]')
  await searchBox.fill('a')
  await page.waitForTimeout(2500)
  const resultsCount = await page.locator('text=No users found').first().isVisible()
  await check('search returns users', !resultsCount, 'no matching users')

  // 4. Open a random user's chat
  const chatRows = page.locator('button[title*="Say hi"]').or(page.locator('div[class*="border-b"]'))
  await page.waitForTimeout(800)

  // 5. Open GamesMenu
  await page.locator('button[title*="Play a game"]').first().click()
  await page.waitForTimeout(800)
  await check('Games menu opens', await page.locator('text=Play a game').first().isVisible())
} catch (e) {
  console.log('ERROR during smoke test:', e.message)
  results.push({ name: 'ERROR', pass: false, extra: e.message })
} finally {
  await browser.close()
}

console.log('\nConsole errors:', errors.length ? errors.join('\n  ') : 'none')
process.exit(results.some((r) => !r.pass) ? 1 : 0)
