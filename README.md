# B-GOD.STORE — site

Loja online da **BGOD Store**, de moda masculina de alto padrão, em João Pessoa (PB), com envio para todo o Brasil.

Stack: **Next.js 16** (App Router) · **React 19** · **TypeScript** · **Tailwind CSS 4** · **Framer Motion** · **React Three Fiber / three.js** · **Zustand** (sacola persistente) · **Vitest**.

## Rodar localmente

Requer Node.js 20.9 ou superior (testado com Node 24).

```bash
npm install          # instala as dependências
cp .env.example .env.local   # configure as variáveis (veja abaixo)
npm run dev          # http://localhost:3000
```

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento com recarga automática |
| `npm run build` | Build de produção |
| `npm start` | Serve o build de produção |
| `npm test` | Testes unitários (sacola, busca/filtros, integridade do catálogo) |
| `npm run typecheck` | Verificação de tipos TypeScript |

## Variáveis de ambiente

Todas estão documentadas em [`.env.example`](.env.example).

| Variável | Obrigatória | Para quê |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Sim, em produção | Domínio público, usado em links, no sitemap e na mensagem do WhatsApp |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | **Recomendada** | Número do atendimento (ex.: `5583999999999`). Ativa "Pedir no WhatsApp" |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Não | E-mail exibido no rodapé |
| `SHOPIFY_STORE_DOMAIN` / `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Não | Catálogo e pagamento online pela Shopify (o token fica só no servidor) |
| `NEWSLETTER_WEBHOOK_URL` | Não | Liga a seção de newsletter |
| `DEMO_CATALOG` | Não | `1` adiciona itens fictícios com preço para testes. **Não use em produção** |

## Como a compra funciona hoje

1. O cliente escolhe a peça, o **tamanho** e, quando houver, a **cor**.
2. Ele pode tocar em **"Pedir no WhatsApp"**, que abre a conversa já com produto, marca, tamanho e link da peça, ou **adicionar à sacola** e enviar várias peças numa mensagem só.
3. Na finalização, informa nome e cidade/UF ou CEP (opcional), que seguem na mensagem para agilizar o cálculo do frete.
4. A equipe confirma estoque, valor, frete e pagamento no atendimento.

Produtos sem preço cadastrado aparecem como **"Sob consulta"**. O site **não processa pagamentos**. Se a Shopify for configurada, os pedidos com todos os itens precificados ganham também o botão **"Pagar online"**, que leva ao checkout oficial da Shopify.

## Cadastrar e editar produtos

Os produtos ficam em [`src/data/products.ts`](src/data/products.ts):

```ts
product({
  slug: "polo-lacoste-gola-contraste",   // URL: /produto/polo-lacoste-gola-contraste
  name: "Polo Gola Contraste",
  brand: "Lacoste",
  category: "polos",                     // um slug de src/data/categories.ts
  photos: 4,                             // usa /images/produtos/<slug>-1.jpg … -4.jpg
  alt: "Descrição das fotos para acessibilidade",
  colors: ["Branco", "Marinho"],         // opcional
  price: 34990,                          // opcional, em centavos (R$ 349,90). Sem ele: "Sob consulta"
  isNew: true,                           // aparece em Lançamentos
  featured: true,                        // aparece em Destaques
}),
```

- **Fotos:** salve como `public/images/produtos/<slug>-1.jpg`, `-2.jpg` etc. São otimizadas automaticamente (AVIF/WebP), então pode usar o JPG original.
- **Tamanhos com estoque real:** troque `variants` por uma lista como `[{ id: "polo-x-P", size: "P", available: true }, …]`. Sem isso, o cliente escolhe na grade da categoria (`sizes` em `categories.ts`) e o estoque é confirmado no atendimento.
- **Categorias:** edite [`src/data/categories.ts`](src/data/categories.ts).
- Rode `npm test` depois de editar. Os testes conferem slugs duplicados, categorias inválidas e fotos sem texto alternativo.

## Trocar imagens e textos da marca

| O quê | Onde |
| --- | --- |
| Logotipo | `public/brand/logo.jpg` (o atual tem 150 px; o ideal é um SVG ou PNG de 600 px ou mais) |
| Favicon | `src/app/icon.jpg` e `src/app/apple-icon.jpg` |
| Banner editorial, foto institucional, galeria e foto ou vídeo do hero | [`src/data/media.ts`](src/data/media.ts) |
| Cidade, Instagram, CNPJ, razão social e endereço | [`src/data/site.ts`](src/data/site.ts) |
| Políticas (envio, trocas, pagamento, privacidade) | [`src/data/policies.ts`](src/data/policies.ts) |

Use somente fotos da própria BGOD ou com licença de uso comercial.

## Publicar

Recomendado: **Vercel**, que tem suporte nativo ao Next.js.

1. Importe o repositório em vercel.com → *Add New Project*.
2. Em *Environment Variables*, cadastre as variáveis acima (no mínimo `NEXT_PUBLIC_SITE_URL` e `NEXT_PUBLIC_WHATSAPP_NUMBER`).
3. Faça o deploy e conecte o domínio em *Settings → Domains*.

Cada `git push` na branch principal publica uma nova versão.

## Arquitetura

```
src/
  app/                 rotas (home, loja, categoria, produto, sacola, checkout, políticas, API, SEO)
  components/
    three/             coroa 3D (CrownScene) + fallback estático em SVG
    home/              seções da página inicial
    product/ shop/ cart/ layout/ ui/
  data/                catálogo, categorias, mídias, políticas e dados da marca (edite aqui)
  lib/
    commerce/          camada de dados: arquivos locais ou Shopify Storefront API
    cart.ts catalog.ts funções puras (testadas)
  store/cart.ts        sacola persistente (localStorage)
tests/                 Vitest
```

**3D:** a coroa cromada é procedural, sem arquivos `.glb`, e é iluminada por um estúdio virtual. Ela só carrega quando o navegador fica ocioso e pausa fora da tela. Usa resolução reduzida em celulares e cai para uma versão estática em SVG quando o visitante ativa "reduzir movimento", usa economia de dados ou o aparelho não tem WebGL.

## Pendências e integrações

- [ ] **Número do WhatsApp** (`NEXT_PUBLIC_WHATSAPP_NUMBER`)
- [ ] **Preços, tamanhos e estoque** dos produtos
- [ ] Logotipo em alta resolução (SVG ou PNG de 600 px ou mais)
- [ ] Textos oficiais das políticas de envio, trocas, pagamento e privacidade
- [ ] CNPJ, razão social e endereço para o rodapé
- [ ] Domínio e deploy (Vercel)
- [ ] Opcional: Shopify (pagamento online), newsletter e vídeo de campanha para o hero
