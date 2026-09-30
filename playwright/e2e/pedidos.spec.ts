import { test, expect } from '@playwright/test'
import { gerarOrderId } from '../suport/helpers'

test.describe('Consulta de Pedidos', () => {
  test.beforeEach(async ({ page }) => {
    //Arrange
    await page.goto('http://localhost:5173/')
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')
    await page.getByRole('link', { name: 'Consultar Pedido' }).click()
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido')
  })

  test('deve consultar um pedido aprovado', async ({ page }) => {
    //Test data
    const order = {
      orderId: 'VLO-3NEBZS',
      status: 'APROVADO',
      model: 'Velô Sprint',
      color: 'Lunar White',
      customer: {
        name: 'Byung Chul Han',
        email: 'chul.han@teste.com',
      },
      payment: 'À Vista',
    }

    //Act
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(order.orderId)
    await page.getByRole('button', { name: 'Buscar Pedido' }).click()

    //Assert
    await expect(page.getByTestId(`order-result-${order.orderId}`)).toMatchAriaSnapshot(`
    - img
    - paragraph: Pedido
    - paragraph: ${order.orderId}
    - status:
      - img
      - text: ${order.status}
    - img "Velô Sprint"
    - paragraph: Modelo
    - paragraph: Velô Sprint
    - paragraph: Cor
    - paragraph: ${order.color}
    - paragraph: Interior
    - paragraph: cream
    - paragraph: Rodas
    - paragraph: aero Wheels
    - heading "Dados do Cliente" [level=4]
    - paragraph: Nome
    - paragraph: ${order.customer.name}
    - paragraph: Email
    - paragraph: ${order.customer.email}
    - paragraph: Loja de Retirada
    - paragraph
    - paragraph: Data do Pedido
    - paragraph: /\\d+\\/\\d+\\/\\d+/
    - heading "Pagamento" [level=4]
    - paragraph: ${order.payment}
    - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
    `)
  })

  test('deve consultar um pedido reprovado', async ({ page }) => {
    //Test data
    const orderId = 'VLO-C872ZC'

    const order = {
      orderId: 'VLO-C872ZC',
      status: 'REPROVADO',
      model: 'Velô Sprint',
      color: 'Midnight Black',
      customer: {
        name: 'Jhon Fante',
        email: 'jhon@teste.com',
      },
      payment: 'À Vista',
    }

    //Act
    await page.getByRole('textbox', { name: 'Número do Pedido' }).fill(orderId)
    await page.getByRole('button', { name: 'Buscar Pedido' }).click()

    //Assert
    await expect(page.getByTestId(`order-result-${orderId}`)).toMatchAriaSnapshot(`
    - img
    - paragraph: Pedido
    - paragraph: ${orderId}
    - status:
      - img
      - text: ${order.status}
    - img "Velô Sprint"
    - paragraph: Modelo
    - paragraph: ${order.model}
    - paragraph: Cor
    - paragraph: ${order.color}
    - paragraph: Interior
    - paragraph: cream
    - paragraph: Rodas
    - paragraph: sport Wheels
    - heading "Dados do Cliente" [level=4]
    - paragraph: Nome
    - paragraph: ${order.customer.name}
    - paragraph: Email
    - paragraph: ${order.customer.email}
    - paragraph: Loja de Retirada
    - paragraph
    - paragraph: Data do Pedido
    - paragraph: /\\d+\\/\\d+\\/\\d+/
    - heading "Pagamento" [level=4]
    - paragraph: ${order.payment}
    - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
    `)
  })

  test('deve exibir uma mensagem de erro ao consultar um pedido inexistente', async ({ page }) => {
    //Test data
    const orderId = gerarOrderId()

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
})
