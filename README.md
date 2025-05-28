# Mundo Psicodélico Festival - Landing Page

Landing page oficial do Mundo Psicodélico Festival, desenvolvida para promover o evento, captar leads para pré-venda e apresentar a experiência audiovisual do festival.

## ✨ Principais Recursos

- **ScrollTrigger com vídeo sincronizado**: Efeito de vídeo controlado pelo scroll no desktop e autoplay/loop otimizado no mobile.
- **Cartões empilhados animados**: Cards de serviços com animação GSAP, responsivos e acessíveis.
- **Galeria de imagens local**: Imagens otimizadas e carregadas localmente para máxima performance.
- **Formulário de pré-venda integrado ao RD Station**: Captação de leads com feedback visual.
- **Loader animado**: Tela de carregamento com fallback para evitar travamentos.
- **Acessibilidade**: Melhores práticas de navegação, contraste, foco e responsividade.
- **Otimização de performance**: CSS e JS purgados, carregamento adiado, imagens otimizadas, fontes web modernas.

## 📁 Estrutura de Pastas

```
/
├── css/
│   ├── main.purged.css         # CSS principal otimizado
│   ├── plugins.purged.css      # Plugins e Bootstrap otimizados
│   └── loaders/loader.css      # Loader animado
├── img/
│   ├── backgrounds/            # Vídeos e imagens de fundo
│   ├── carrosel/               # Imagens do carrossel
│   ├── galeria/                # Imagens da galeria local
│   ├── logos/                  # Logos do evento
│   └── stack/                  # Imagens dos cards de serviços
├── js/
│   ├── app.js                  # Lógica principal da página
│   ├── scrollTrigger.js        # Sincronização de vídeo com scroll
│   ├── gallery-init.js         # Inicialização da galeria
│   ├── libs.min.js             # jQuery, Modernizr, plugins
│   └── zoomScroll.js           # Efeito de zoom extra
├── index.html                  # Página principal
├── robots.txt                  # SEO e rastreamento
└── ...
```

## 🚀 Instalação e Uso Local

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repo>
   cd <pasta-do-projeto>
   ```
2. **Garanta que todas as imagens estejam nas pastas corretas** (`img/galeria/`, `img/backgrounds/`, etc).
3. **Abra o `index.html` em seu navegador** (não requer backend para funcionar).

## 🛠️ Principais Tecnologias
- **HTML5, CSS3, JavaScript ES6**
- **GSAP 3 (ScrollTrigger, ScrollToPlugin)**
- **jQuery (apenas para plugins legados)**
- **Bootstrap 5 (parcial, via CSS purgado)**
- **RD Station Forms**
- **PhotoSwipe (galeria de imagens)**
- **Phosphor Icons**

## ⚡ Otimizações de Performance
- CSS e JS purgados para remover código não usado.
- Carregamento adiado de CSS/JS não críticos (`preload` + `onload`).
- Imagens locais e otimizadas (use formatos `.webp` sempre que possível).
- Loader com timeout para evitar travamento se imagens falharem.
- ScrollTrigger só ativa o vídeo após o carregamento do primeiro frame.
- No mobile, vídeos usam autoplay+loop e não dependem do scroll.

## ♿ Acessibilidade
- Meta viewport sem restrições de zoom.
- Campos de formulário com labels e acessíveis a leitores de tela.
- Contraste de cores e foco visível.
- Navegação por teclado garantida.

## 🌐 SEO e Boas Práticas
- `robots.txt` configurado para permitir rastreamento e bloquear áreas sensíveis.
- Metatags de descrição, keywords, author e Open Graph.
- URLs amigáveis e imagens com `alt` descritivo.


## 👨‍💻 Customização
- Para trocar vídeos, altere os arquivos em `img/backgrounds/` e ajuste os atributos `data-video-desktop`/`data-video-mobile` no HTML.
- Para adicionar/remover cards ou imagens, edite o HTML e coloque os arquivos nas pastas corretas.
- Para alterar cores, fontes ou animações, edite os arquivos em `css/` e `js/`.


---

**Mundo Psicodélico Festival** — Todos os direitos reservados. 