# Prova 03 - Testes E2E com Playwright (Americanas)

[![Build and Tests](https://github.com/CasagrandeVictor/prova03-unit-test-VictorCasagrande/actions/workflows/node.js.yml/badge.svg?branch=master)](https://github.com/CasagrandeVictor/prova03-unit-test-VictorCasagrande/actions/workflows/node.js.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=CasagrandeVictor_prova03-unit-test-VictorCasagrande&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=CasagrandeVictor_prova03-unit-test-VictorCasagrande)

Testes end-to-end do site [americanas.com.br](https://www.americanas.com.br) escritos com [Microsoft Playwright](https://playwright.dev), executados no GitHub Actions e analisados pelo SonarCloud.

## Casos de teste

| Arquivo | Caso de teste | O que é validado |
|---|---|---|
| `AmericanasBusca.spec.ts` | Busca de produtos | URL e título da página de resultados, quantidade de produtos encontrados e relevância dos 8 primeiros resultados para "mouse gamer" |
| `AmericanasOrdenacao.spec.ts` | Ordenação por menor preço | Ordenação "menores preços" aplicada e preços no Pix dos 8 primeiros produtos em ordem crescente |
| `AmericanasCarrinho.spec.ts` | Carrinho de compras | Página do produto com o mesmo nome e preço do card da busca, inclusão na cesta, contador do carrinho e alteração da quantidade (1 → 2 → 1) |

## Como executar

1. Instale o [Node.js](https://nodejs.org/) (versão 22 ou superior)
1. `npm ci` para instalar as dependências
1. `npx playwright install msedge` para instalar o navegador (Microsoft Edge)
1. `npm test` para executar os testes
1. `npm run show-report` para abrir o relatório HTML

Outros comandos úteis:

- `npm run ui` abre o modo interativo (UI Mode) do Playwright
- `npm run debug` executa os testes passo a passo no inspector
- `npm run ci` limpa os artefatos, formata, verifica o código e roda os testes

Os artefatos (relatório, prints e traces das falhas) ficam em `./artifacts`.

## Estrutura do projeto

```
src/
├── scenarios/                 # casos de teste (*.spec.ts)
└── support/
    ├── elements/              # mapeamento dos elementoss (locators) de cada tela
    ├── fixtures/              # fixtures do Playwright (test.extend)
    └── pages/                 # page objects com as ações e validações
```

## Boas práticas do Playwright aplicadas

- **Locators orientados ao usuário** (`getByRole`, `getByText`), conforme [Locators](https://playwright.dev/docs/locators)
- **Asserções web-first** com espera automática (`toBeVisible`, `toHaveText`, `toHaveURL`), sem `waitForTimeout`, conforme [Best Practices](https://playwright.dev/docs/best-practices)
- **`page.addLocatorHandler`** para fechar o pop-up promocional e o banner de cookies sempre que aparecerem
- **Fixtures** (`test.extend`) para entregar o page object pronto a cada teste, conforme [Fixtures](https://playwright.dev/docs/test-fixtures)
- **`test.step`** para organizar o relatório por etapas
- **Configuração de CI** com `baseURL`, `forbidOnly`, `retries`, `trace` e `screenshot` em falhas, conforme [Continuous Integration](https://playwright.dev/docs/ci)

## Pipeline

O workflow `.github/workflows/node.js.yml` roda em todo push/PR na `master`, diariamente às 12h (UTC) e manualmente (`workflow_dispatch`):

1. **Run E2E Tests**: instala as dependências, verifica a formatação (Prettier), instala o Edge e executa os testes. O relatório fica disponível como artefato da execução.
2. **Run SonarCloud**: análise estática do código no SonarCloud (requer o secret `SONAR_TOKEN`).
