import { test, expect } from '@playwright/test'

test('deve consultar um pedido aprovado', async ({ page }) => {
  //Test data
  const orderId = 'VLO-3NEBZS'

  //Arrange
  await page.goto('http://localhost:5173/')
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')
  await page.getByRole('link', { name: 'Consultar Pedido' }).click()
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido')

  //Act
  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(orderId)
  await page.getByRole('button', { name: 'Buscar Pedido' }).click()

  // Assert
  await expect(page.getByTestId('order-result-VLO-3NEBZS')).toContainText(orderId)
  await expect(page.getByText('APROVADO')).toBeVisible({ timeout: 10_000 })
})

test('deve exibir uma mensagem de erro ao consultar um pedido inexistente', async ({ page }) => {
  //Test data
  const orderId = 'VLO-XXXX'

  //Arrange
  await page.goto('http://localhost:5173/')
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')
  await page.getByRole('link', { name: 'Consultar Pedido' }).click()
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido')

  //Act
  await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(orderId)
  await page.getByRole('button', { name: 'Buscar Pedido' }).click()

  // Assert
  await expect(page.locator('#root')).toMatchAriaSnapshot(`
    - img
    - heading "Pedido não encontrado" [level=3]
    - paragraph: Verifique o número do pedido e tente novamente
    `)
})
