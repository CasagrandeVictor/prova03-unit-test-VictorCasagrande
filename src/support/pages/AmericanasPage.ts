import { Locator, Page, expect } from '@playwright/test';
import AmericanasElements from '../elements/AmericanasElements';
import BasePage from './BasePage';

export type ProdutoListado = {
  nome: string;
  precoPix: number;
};

// converte "R$ 1.234,56 no Pix" em 1234.56
export function converterPreco(texto: string): number {
  const valor = /R\$\s*([\d.]+,\d{2})/.exec(texto);
  if (!valor) {
    throw new Error(`Preço não encontrado no texto: "${texto}"`);
  }
  return Number(valor[1].replace(/\./g, '').replace(',', '.'));
}

// converte 1234.56 em "R$ 1.234,56"
export function formatarPreco(valor: number): string {
  const [inteiro, centavos] = valor.toFixed(2).split('.');
  return `R$ ${inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${centavos}`;
}

export default class AmericanasPage extends BasePage {
  readonly elements: AmericanasElements;

  constructor(readonly page: Page) {
    super(page);
    this.page = page;
    this.elements = new AmericanasElements(page);
  }

  // o pop-up promocional e o banner de cookies podem aparecer a qualquer
  // momento (ou não aparecer); os handlers os fecham sempre que surgirem,
  // sem esperas fixas - https://playwright.dev/docs/api/class-page#page-add-locator-handler
  async registrarFechamentoDePopups(): Promise<void> {
    const fecharPromocao = this.elements.getBotaoFecharPopupPromocional();
    await this.page.addLocatorHandler(fecharPromocao, async () => {
      await fecharPromocao.click();
    });

    const fecharCookies = this.elements.getBotaoFecharBannerCookies();
    await this.page.addLocatorHandler(fecharCookies, async () => {
      await fecharCookies.click();
    });
  }

  async acessarHome(): Promise<void> {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(this.page).toHaveTitle(/Americanas/);
    await expect(this.elements.getCampoBusca()).toBeVisible();
  }

  async pesquisar(termo: string): Promise<void> {
    const campoBusca = this.elements.getCampoBusca();
    await campoBusca.fill(termo);
    await expect(campoBusca).toHaveValue(termo);
    await campoBusca.press('Enter');
  }

  async validarPaginaDeResultados(termo: string): Promise<void> {
    const url = new RegExp(`/s\\?q=${termo.replace(/ /g, '\\+')}`);
    await expect(this.page).toHaveURL(url);
    await expect(this.elements.getTituloResultadoBusca()).toHaveText(
      `Resultados para: ${termo}`
    );
    await expect(this.elements.getQuantidadeEncontrada()).toBeVisible();
    await expect(this.elements.getCardsProdutos().first()).toBeVisible();
  }

  async obterQuantidadeEncontrada(): Promise<number> {
    const texto = await this.elements.getQuantidadeEncontrada().innerText();
    return Number(/(\d+)/.exec(texto)![1]);
  }

  async validarRelevanciaDosResultados(
    termo: RegExp,
    quantidadeAvaliada: number
  ): Promise<void> {
    const cards = this.elements.getCardsProdutos();
    await expect(cards.nth(quantidadeAvaliada - 1)).toBeVisible();
    for (let i = 0; i < quantidadeAvaliada; i++) {
      await expect(this.elements.getNomeDoProduto(cards.nth(i))).toHaveText(
        termo
      );
    }
  }

  async ordenarPor(opcao: string): Promise<void> {
    const botaoOrdenar = this.elements.getBotaoOrdenar();
    await botaoOrdenar.click();
    await this.elements.getOpcaoOrdenacao(opcao).click();
    await expect(botaoOrdenar).toContainText(opcao);
  }

  async lerProdutosListados(quantidade: number): Promise<ProdutoListado[]> {
    const cards = this.elements.getCardsProdutos();
    await expect(cards.nth(quantidade - 1)).toBeVisible();

    const produtos: ProdutoListado[] = [];
    for (let i = 0; i < quantidade; i++) {
      const card = cards.nth(i);
      const precoPix = this.elements.getPrecoPixDoProduto(card);
      await expect(precoPix).toBeVisible();
      produtos.push({
        nome: await this.elements.getNomeDoProduto(card).innerText(),
        precoPix: converterPreco(await precoPix.innerText())
      });
    }
    return produtos;
  }

  // abre o produto e devolve o nome e o preço no Pix exibidos no card da busca
  async abrirProduto(indice: number): Promise<ProdutoListado> {
    const card = this.elements.getCardsProdutos().nth(indice);
    const nome = (
      await this.elements.getNomeDoProduto(card).innerText()
    ).trim();
    expect(nome).not.toBe('');
    const precoPix = converterPreco(
      await this.elements.getPrecoPixDoProduto(card).innerText()
    );
    await card.click();
    return { nome, precoPix };
  }

  async validarPaginaDoProduto(produto: ProdutoListado): Promise<void> {
    await expect(this.page).toHaveURL(/americanas\.com\.br\/.+\/p/);
    await expect(this.elements.getNomeProdutoNaPagina()).toHaveText(
      produto.nome
    );
    await expect(this.elements.getRotuloPixNaPagina()).toBeVisible();
    await expect(
      this.elements.getPrecoNaPagina(formatarPreco(produto.precoPix))
    ).toBeVisible();
    await expect(this.elements.getBotaoComprar()).toBeEnabled();
  }

  async adicionarAoCarrinho(): Promise<void> {
    await this.elements.getBotaoComprar().click();
    await expect(this.elements.getCesta()).toBeVisible();
  }

  async validarProdutoNaCesta(nome: string, quantidade: number): Promise<void> {
    const itens = this.elements.getItensDaCesta();
    await expect(itens).toHaveCount(1);
    await expect(itens.first()).toContainText(nome);
    await expect(this.elements.getQuantidadeNaCesta()).toHaveValue(
      String(quantidade)
    );
    await expect(this.elements.getSubtotalDaCesta()).toContainText(
      `(${quantidade} products)`
    );
  }

  async aumentarQuantidadeNaCesta(): Promise<void> {
    await this.elements.getBotaoAumentarQuantidade().click();
  }

  async diminuirQuantidadeNaCesta(): Promise<void> {
    await this.elements.getBotaoDiminuirQuantidade().click();
  }

  getBotaoCarrinho(): Locator {
    return this.elements.getBotaoCarrinho();
  }

  getBotaoDiminuirQuantidade(): Locator {
    return this.elements.getBotaoDiminuirQuantidade();
  }
}
