import { expect, test } from '../support/fixtures/americanas';

test.describe('Americanas - Ordenação de resultados', () => {
  const TERMO = 'mouse gamer';
  const PRODUTOS_AVALIADOS = 8;

  test.beforeEach(async ({ americanasPage }) => {
    await americanasPage.acessarHome();
    await americanasPage.pesquisar(TERMO);
    await americanasPage.validarPaginaDeResultados(TERMO);
  });

  test('Ordenar a busca por "menores preços" e validar a ordem crescente dos preços', async ({
    americanasPage
  }) => {
    await test.step('Ordenar os resultados por "menores preços"', async () => {
      await americanasPage.ordenarPor('menores preços');
    });

    const produtos =
      await test.step(`Ler o preço no Pix dos ${PRODUTOS_AVALIADOS} primeiros produtos`, async () => {
        return americanasPage.lerProdutosListados(PRODUTOS_AVALIADOS);
      });

    await test.step('Validar que todos os preços são valores positivos', async () => {
      for (const produto of produtos) {
        expect(produto.precoPix, produto.nome).toBeGreaterThan(0);
      }
    });

    await test.step('Validar que os preços estão em ordem crescente', async () => {
      const precos = produtos.map(produto => produto.precoPix);
      const ordenados = [...precos].sort((a, b) => a - b);
      expect(precos).toEqual(ordenados);
    });
  });
});
