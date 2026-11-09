import { expect, test } from '../support/fixtures/americanas';

test.describe('Americanas - Busca de produtos', () => {
  const TERMO = 'mouse gamer';
  const PRODUTOS_AVALIADOS = 8;

  test.beforeEach(async ({ americanasPage }) => {
    await americanasPage.acessarHome();
  });

  test('Pesquisar "mouse gamer" e validar que os resultados são relevantes', async ({
    americanasPage
  }) => {
    await test.step(`Pesquisar "${TERMO}" pelo campo de busca do cabeçalho`, async () => {
      await americanasPage.pesquisar(TERMO);
    });

    await test.step('Validar a página de resultados da busca', async () => {
      await americanasPage.validarPaginaDeResultados(TERMO);
    });

    await test.step('Validar que a busca encontrou produtos', async () => {
      const quantidade = await americanasPage.obterQuantidadeEncontrada();
      expect(quantidade).toBeGreaterThanOrEqual(PRODUTOS_AVALIADOS);
    });

    await test.step(`Validar que os ${PRODUTOS_AVALIADOS} primeiros produtos citam "mouse"`, async () => {
      await americanasPage.validarRelevanciaDosResultados(
        /mouse/i,
        PRODUTOS_AVALIADOS
      );
    });
  });
});
