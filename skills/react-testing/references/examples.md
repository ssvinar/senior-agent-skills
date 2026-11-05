# React testing examples

## Provider helper

```tsx
// test-utils.tsx
import { render, type RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactElement } from 'react'

export function renderWithProviders(ui: ReactElement, options?: RenderOptions) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>, options)
}

export * from '@testing-library/react'
```

Add the app's other providers (theme, router, i18n) inside the same tree.

## Form submit with MSW

```tsx
test('saves the profile', async () => {
  server.use(http.post('/api/profile', () => HttpResponse.json({ ok: true }, { status: 201 })))
  const user = userEvent.setup()
  renderWithProviders(<ProfileForm />)

  await user.type(screen.getByLabelText('Display name'), 'Sam')
  await user.click(screen.getByRole('button', { name: /save/i }))

  expect(await screen.findByText(/saved/i)).toBeInTheDocument()
})
```

## Error boundary

Silence the expected `console.error` for this test only and restore it, so real errors elsewhere stay visible.

```tsx
const Thrower = () => {
  throw new Error('fail')
}

test('shows the fallback when a child throws', () => {
  const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
  try {
    render(
      <ErrorBoundary fallback={<p>Could not load</p>}>
        <Thrower />
      </ErrorBoundary>,
    )
    expect(screen.getByText('Could not load')).toBeInTheDocument()
  } finally {
    spy.mockRestore()
  }
})
```

## Suspense

```tsx
test('shows the fallback, then the data', async () => {
  renderWithProviders(
    <Suspense fallback={<p>Loading</p>}>
      <OrderSummary id="7" />
    </Suspense>,
  )
  expect(screen.getByText('Loading')).toBeInTheDocument()
  expect(await screen.findByText('Order 7')).toBeInTheDocument()
})
```
