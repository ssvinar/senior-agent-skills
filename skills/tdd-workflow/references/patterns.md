# Test patterns

## API route (Next.js route handler)

```ts
import { NextRequest } from 'next/server'
import { GET } from './route'

const call = (qs = '') => GET(new NextRequest(`http://localhost/api/products${qs}`))

it('returns the list', async () => {
  const res = await call()
  expect(res.status).toBe(200)
  expect(Array.isArray((await res.json()).items)).toBe(true)
})

it('rejects a non-numeric limit', async () => {
  expect((await call('?limit=abc')).status).toBe(400)
})
```

Also cover the failure path: make the mocked data layer throw and assert the error response.

## E2E (Playwright)

```ts
import { test, expect } from '@playwright/test'

test('search and filter narrow the list', async ({ page }) => {
  await page.goto('/products')
  await page.getByRole('searchbox', { name: 'Search products' }).fill('lamp')

  const cards = page.getByTestId('product-card')
  await expect(cards.first()).toContainText('lamp', { ignoreCase: true })

  await page.getByRole('button', { name: 'In stock' }).click()
  await expect(cards).toHaveCount(2)
})
```

- Locators: same priority as `react-testing` queries.
- `expect(locator)` assertions retry until they pass; never `waitForTimeout`.
- Seeded test accounts and data; each test sets up its own state.

## Module mocks

Mock SDK clients at the module boundary (`vi.mock` in Vitest, `jest.mock` in Jest, same shape). For HTTP, use MSW (see `react-testing`).

```ts
vi.mock('@/lib/db', () => ({
  db: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(async () => ({ data: [{ id: 1, name: 'Lamp' }], error: null })),
      })),
    })),
  },
}))
```

## File layout

```text
src/components/Button/Button.tsx
src/components/Button/Button.test.tsx   # unit / component
src/app/api/products/route.ts
src/app/api/products/route.test.ts      # integration
e2e/search.spec.ts                      # E2E
```
