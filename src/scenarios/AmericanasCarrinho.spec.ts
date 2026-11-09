import { expect, test } from '../support/fixtures/americanas';

test.describe('Americanas - Carrinho de compras', () => {
  const TERMO = 'mouse gamer';

  test.beforeEach(async ({ americanasPage }) => {
    await americanasPage.acessarHome();
    await americanasPage.pesquisar(TERMO);
    await americanasPage.validarPaginaDeResultados(TERMO);
  });

  test('Abrir um produto da busca, adicioná-lo à cesta e alterar a quantidade', async ({
    americanasPage
  }) => {
    const produto =
      await test.step('Abrir o primeiro produto da busca', async () => {
        return americanasPage.abrirProduto(0);
      });
    const nome = produto.nome;

    await test.step('Validar que a página exibe o mesmo nome e preço do card da busca', async () => {
      await americanasPage.validarPaginaDoProduto(produto);
      await expect(americanasPage.getBotaoCarrinho()).toHaveAccessibleName(
        'Carrinho com 0 item'
      );
    });

    await test.step('Adicionar o produto à cesta', async () => {
      await americanasPage.adicionarAoCarrinho();
      await americanasPage.validarProdutoNaCesta(nome, 1);
      await expect(americanasPage.getBotaoCarrinho()).toHaveAccessibleName(
        'Carrinho com 1 item'
      );
      await expect(americanasPage.getBotaoDiminuirQuantidade()).toBeDisabled();
    });

    await test.step('Aumentar a quantidade do produto para 2', async () => {
      await americanasPage.aumentarQuantidadeNaCesta();
      await americanasPage.validarProdutoNaCesta(nome, 2);
      await expect(americanasPage.getBotaoDiminuirQuantidade()).toBeEnabled();
    });

    await test.step('Diminuir a quantidade do produto de volta para 1', async () => {
      await americanasPage.diminuirQuantidadeNaCesta();
      await americanasPage.validarProdutoNaCesta(nome, 1);
    });
  });
});
