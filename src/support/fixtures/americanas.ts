import { test as base } from '@playwright/test';
import AmericanasPage from '../pages/AmericanasPage';

type AmericanasFixtures = {
  americanasPage: AmericanasPage;
};

// fixture que entrega a página já preparada (pop-ups tratados)
// https://playwright.dev/docs/test-fixtures
export const test = base.extend<AmericanasFixtures>({
  americanasPage: async ({ page }, use) => {
    const americanasPage = new AmericanasPage(page);
    await americanasPage.registrarFechamentoDePopups();
    await use(americanasPage);
  }
});

export { expect } from '@playwright/test';
