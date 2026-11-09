import { Locator, Page } from '@playwright/test';
import BaseElements from './BaseElements';

export default class AmericanasElements extends BaseElements {
  constructor(readonly page: Page) {
    super(page);
    this.page = page;
  }

  // banner de cookies (LGPD) exibido no rodapé da página; o botão "Aceitar"
  // fica parcialmente coberto por "Preferências", por isso usamos o "×"
  getBotaoFecharBannerCookies(): Locator {
    return this.page
      .getByRole('dialog', { name: 'cookieconsent' })
      .getByRole('button', { name: 'Fechar banner de cookies' });
  }

  // pop-up promocional ("oferta do dia") que cobre a página ao carregar
  getBotaoFecharPopupPromocional(): Locator {
    return this.page
      .locator('.ins-element-close-button')
      .getByRole('button', { name: 'Close' });
  }

  // o cabeçalho possui dois campos de busca (desktop e mobile); apenas um fica visível
  getCampoBusca(): Locator {
    return this.page
      .getByRole('textbox', { name: 'busque aqui seu produto' })
      .filter({ visible: true });
  }

  getBotaoCarrinho(): Locator {
    return this.page.getByRole('button', { name: /^Carrinho com/ });
  }

  // ---------- resultados da busca ----------

  getTituloResultadoBusca(): Locator {
    return this.page.getByRole('heading', { level: 1 });
  }

  getListagemProdutos(): Locator {
    return this.page.getByRole('region', { name: 'Listagem de produtos' });
  }

  getQuantidadeEncontrada(): Locator {
    return this.getListagemProdutos().getByText(/\d+ produtos? encontrados?/);
  }

  // cada produto é um link que contém o nome do produto como heading nível 3
  getCardsProdutos(): Locator {
    return this.getListagemProdutos()
      .getByRole('link')
      .filter({ has: this.page.getByRole('heading', { level: 3 }) });
  }

  getNomeDoProduto(card: Locator): Locator {
    return card.getByRole('heading', { level: 3 });
  }

  getPrecoPixDoProduto(card: Locator): Locator {
    return card.getByRole('paragraph').filter({ hasText: /no Pix/ });
  }

  getBotaoOrdenar(): Locator {
    return this.page.getByRole('button', { name: /ordenar por/ });
  }

  getOpcaoOrdenacao(nome: string): Locator {
    return this.page.getByRole('menuitem', { name: nome, exact: true });
  }

  // ---------- página do produto ----------

  getNomeProdutoNaPagina(): Locator {
    return this.page.getByRole('heading', { level: 1 });
  }

  getRotuloPixNaPagina(): Locator {
    return this.page.getByText('no Pix', { exact: true }).first();
  }

  getPrecoNaPagina(preco: string): Locator {
    return this.page.getByText(preco, { exact: true }).first();
  }

  getBotaoComprar(): Locator {
    return this.page.getByRole('button', { name: 'Comprar', exact: true });
  }

  // ---------- cesta (carrinho lateral) ----------

  getCesta(): Locator {
    return this.page
      .getByRole('dialog')
      .filter({ has: this.page.getByRole('heading', { name: /minha cesta/ }) });
  }

  getItensDaCesta(): Locator {
    return this.getCesta()
      .getByRole('listitem')
      .filter({
        has: this.page.getByRole('article')
      });
  }

  getQuantidadeNaCesta(): Locator {
    return this.getCesta().getByRole('textbox', { name: 'Quantity' });
  }

  getBotaoAumentarQuantidade(): Locator {
    return this.getCesta().getByRole('button', { name: 'Increment Quantity' });
  }

  getBotaoDiminuirQuantidade(): Locator {
    return this.getCesta().getByRole('button', { name: 'Decrement Quantity' });
  }

  getSubtotalDaCesta(): Locator {
    return this.getCesta()
      .getByRole('listitem')
      .filter({ hasText: /subtotal/i });
  }
}
