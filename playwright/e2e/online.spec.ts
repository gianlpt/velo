import { test, expect } from '@playwright/test';


test('deve consultar um pedido aprovado', async ({ page }) => {
  // Arrange
  await page.goto('http://localhost:5173/');
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint');

  await page.getByRole('link', { name: 'Consultar Pedido' }).click();
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido');

  // Act
   await page.getByRole('textbox', { name: 'Número do Pedido' }).fill('VLO-KSTF4A');
   await page.getByRole('button', { name: 'Buscar Pedido' }).click();

  // Assert
  const orderCode = 'VLO-KSTF4A';
  const expectedStatus = 'APROVADO';
  
  const orderResult = page
    .locator('div')
    .filter({ hasText: 'Pedido' })
    .filter({ hasText: orderCode })
    .filter({ hasText: expectedStatus })
    .first();
  
  await expect(orderResult).toBeVisible();
  await expect(orderResult).toContainText('Pedido');
  await expect(orderResult).toContainText(orderCode);
  await expect(orderResult).toContainText(expectedStatus);
});

  



