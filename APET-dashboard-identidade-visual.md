# APET — Guia de Identidade Visual e Customização (Dashboard de Analytics)

> **Objetivo deste arquivo**: servir como *fonte única de verdade* para a IA que irá “vibe codar” a dashboard de análises do site da **APET**. Use este documento para manter consistência visual, tom, componentes, espaçamentos e estados de interação.

---

## 1) DNA visual da marca (o que “parece APET”)

**Palavras‑chave**: institucional, confiável, jurídico/tributário, moderno sem excessos, alto contraste, layout arejado, cartões com cantos arredondados, CTA em vermelho.

**Características observadas no site**
- Fundo **cinza muito claro** (quase branco), com sensação “clean”.
- **Vermelho APET** como cor de destaque (CTAs, links, labels e indicadores).
- Tipografia com **títulos fortes** (peso alto) e corpo discreto.
- Componentes com **bordas arredondadas grandes** (pills/botões e cards).
- Uso recorrente de botões **outline** com um **círculo preenchido** contendo seta.
- Seções com **títulos em caixa alta / negrito**, separadas por linhas finas.
- Cards de conteúdo com imagem/topo e texto abaixo; e blocos de evento em **vermelho**, **preto** e **branco**.

---

## 2) Paleta de cores (tokens)

> As cores abaixo foram inferidas a partir das telas enviadas. Se houver manual oficial, ele deve prevalecer.

### 2.1 Cores principais
- **APET Red (Primary)**: `#B80820`
- **Black (Text/Surface)**: `#0B0B0B`
- **White (Surface)**: `#FFFFFF`

### 2.2 Neutros
- **Background**: `#F0F0F0` (fundo geral)
- **Background alt**: `#F0F0F8` (variação sutil para áreas/linhas)
- **Border**: `#DCDCDC` (linhas divisórias)
- **Text Secondary**: `#555555`
- **Text Muted**: `#777777`
- **Icon Muted**: `#8A8A8A`

### 2.3 Estados
- **Hover Primary**: `#9F071B` (escurecer ~10–15%)
- **Active Primary**: `#870615`
- **Focus Ring**: `rgba(184, 8, 32, 0.25)`
- **Success**: `#1F8A4C` (usar com parcimônia)
- **Warning**: `#B7791F`
- **Error**: `#B80820` (mesma do primary)

### 2.4 Regras de uso
- Vermelho deve ser **1º nível de destaque** (CTA, links, pontos de atenção).
- Evitar gradientes “modernosos”. Se precisar, use **variações muito suaves** do cinza.
- Em gráficos, **não** usar paletas neon. Preferir neutros + 1 cor destaque (vermelho) + tons de cinza.

---

## 3) Tipografia

> O site aparenta usar uma fonte sans moderna com títulos bem pesados. Se for possível capturar a fonte oficial via CSS, use-a. Caso contrário:

**Fallback recomendado (web‑safe moderna):**
- Primária: `Inter`, `system-ui`, `-apple-system`, `Segoe UI`, `Roboto`, `Arial`, `sans-serif`

### 3.1 Escala tipográfica (dashboard)
- **H1 (Página)**: 32px / weight 800 / line-height 1.1
- **H2 (Seção)**: 24px / weight 800 / line-height 1.2
- **H3 (Card Title)**: 16–18px / weight 700 / line-height 1.3
- **Body**: 14–15px / weight 400–500 / line-height 1.6
- **Caption/Meta**: 12–13px / weight 500 / line-height 1.4

### 3.2 Estilo de títulos
- Títulos devem ser **diretos** e com **alto contraste**.
- Títulos de seção podem ser em **caixa alta** (opcional), mantendo espaçamento amplo.

---

## 4) Grid, layout e densidade (estrutura da dashboard)

### 4.1 Estrutura recomendada
- **Sidebar colapsável** (à esquerda)
  - Largura aberta: 260–280px
  - Largura colapsada: 72–80px
  - Fundo: branco com borda direita `#DCDCDC`
- **Topbar** (opcional, se precisar de filtros globais)
  - Altura: 64–72px
  - Fundo: transparente ou branco (consistente com o fundo)
- **Área de conteúdo**
  - Container max: 1200–1280px (em desktop)
  - Gutter: 24px

### 4.2 Espaçamento (spacing scale)
Usar uma escala consistente:
- `4, 8, 12, 16, 20, 24, 32, 40, 48`

### 4.3 Cantos e sombras
- **Radius**
  - Cards: 16–20px
  - Pills / botões: 999px
  - Inputs: 12–14px
- **Shadow** (suave, sem “flutuar demais”)
  - `0 8px 24px rgba(0,0,0,0.06)`
  - `0 2px 8px rgba(0,0,0,0.05)`

---

## 5) Componentes — especificações de UI

### 5.1 Botões (padrão APET)
**Padrão principal do site**: botão *outline* em formato pill + círculo preenchido com seta.

**Button / Outline Pill + Arrow**
- Fundo: `#FFFFFF`
- Borda: `1px solid #B80820`
- Texto: `#B80820` (weight 600)
- Altura: 44–48px
- Padding: 18–22px (texto) + espaço para o círculo
- Círculo da seta:
  - Fundo: `#B80820`
  - Ícone seta: `#FFFFFF`
  - Diâmetro: 34–38px
- Hover:
  - borda/texto: `#9F071B`
  - círculo: `#9F071B`

**Button / Solid (usar com moderação)**
- Fundo: `#B80820`
- Texto: `#FFFFFF`
- Hover: `#9F071B`

### 5.2 Links
- Cor: `#B80820`
- Estilo: sublinhado no hover **ou** traço fino abaixo (como “Leia mais”).

### 5.2.1 Cabeçalho de seção (padrão do site)
- Título da seção à esquerda (H2 forte)
- Ação à direita (ex.: “Veja mais”, “Exportar”, “Ver todos”)
- **Divisor horizontal** abaixo: 1px `#DCDCDC`
- Espaçamento: 16–24px entre título e divisor

### 5.2.2 Indicador de páginas (dots / carousel)
- Dots pequenos (diâmetro 6–8px)
- Estado ativo: `#B80820`
- Estado inativo: `#DCDCDC`
- Espaçamento entre dots: 8px

### 5.3 Cards
**Card padrão (KPIs, blocos, tabelas)**
- Fundo: branco
- Borda: opcional (preferir sombra leve)
- Radius: 16–20px
- Padding: 16–24px
- Header com título (H3) + ação (ícone/btn)

**Card de Destaque (Eventos)**
- Variante Vermelha: fundo `#B80820`, texto branco, padrões gráficos bem sutis (opcional).
- Variante Preta: fundo `#0B0B0B`, texto branco.
- CTAs dentro do card: manter o padrão pill.

### 5.4 Badges / Tags
- Formato: pill pequeno
- Altura: 24–28px
- Texto: 12px weight 600
- Variantes:
  - `primary`: fundo `rgba(184,8,32,0.10)` + texto `#B80820`
  - `neutral`: fundo `#F0F0F0` + texto `#555`

### 5.5 Inputs e filtros
- Inputs com radius 12–14px
- Borda: `#DCDCDC`
- Fundo: `#FFFFFF`
- Focus: ring `rgba(184, 8, 32, 0.25)` + borda `#B80820`

### 5.6 Tabelas
- Header fixo (se listas longas)
- Linhas com zebra **muito sutil**: `#FFFFFF` / `#FAFAFA`
- Separadores: `#E6E6E6`
- Coluna de ação: ícones discretos (cinza) + hover vermelho.

### 5.7 KPI Tiles (números do topo)
- Título pequeno (caption) + número grande (H2) + variação (%)
- Variação:
  - Positiva: verde discreto
  - Negativa: vermelho APET

### 5.8 Gráficos
**Estilo**
- Fundo do card branco, gridlines finas `rgba(0,0,0,0.06)`
- Linhas/barras em cinza + destaque em vermelho.
- Tooltips: fundo preto, texto branco, radius 12px.

**Regras**
- Não usar “3D”, sombras fortes ou muitos efeitos.
- Sempre exibir unidades (R$, %, qtd.) e período.

### 5.9 Navegação
**Sidebar**
- Ícones lineares (stroke) e simples.
- Item ativo:
  - barra lateral ou highlight suave `rgba(184,8,32,0.10)`
  - texto `#B80820`
- Item hover: fundo `#F7F7F7`

**Breadcrumbs** (opcional)
- Cinza, com última etapa em preto.

### 5.10 Modais e toasts
- Modal: fundo branco, radius 20px, sombra suave.
- Toast: canto inferior direito, borda sutil, ícone pequeno.
- Mensagens: linguagem institucional e objetiva.

---

## 6) Tom de texto (microcopy)

**Estilo**: profissional, objetivo, sem gírias.

**Padrões**
- Botões: verbos curtos — “Ver detalhes”, “Exportar”, “Filtrar”, “Aplicar”, “Limpar”.
- Datas/períodos: “Últimos 7 dias”, “Mês atual”, “Comparar com período anterior”.
- Estados vazios:
  - “Nenhum dado encontrado para os filtros selecionados.”
  - “Ajuste o período ou remova filtros para visualizar resultados.”

---

## 7) Acessibilidade e consistência

- Contraste mínimo WCAG AA (principalmente textos sobre vermelho/preto).
- Foco visível em todos os elementos interativos.
- Tamanho mínimo clicável: 40px.
- Não depender apenas de cor para indicar status (usar ícone/label).

---

## 8) Regras para NÃO parecer “dashboard genérica de IA”

1. **Consistência**: sempre a mesma escala de spacing, radius e shadow.
2. **Hierarquia clara**: 1 título de página, 2–3 KPIs principais, depois detalhes.
3. **Poucas cores**: neutros + vermelho APET.
4. **Componentes reaproveitáveis**: cards e botões iguais em todas as telas.
5. **Sem excesso de gráficos**: priorizar 3–5 insights por tela.
6. **CTA padronizado** (pill outline + seta) como assinatura visual.

---

## 9) Tokens em formato copiável (para a IA)

```json
{
  "brand": {
    "name": "APET",
    "primary": "#B80820",
    "black": "#0B0B0B",
    "bg": "#F0F0F0",
    "border": "#DCDCDC"
  },
  "radius": {
    "card": 18,
    "input": 14,
    "pill": 999
  },
  "shadow": {
    "sm": "0 2px 8px rgba(0,0,0,0.05)",
    "md": "0 8px 24px rgba(0,0,0,0.06)"
  },
  "spacing": [4, 8, 12, 16, 20, 24, 32, 40, 48],
  "typography": {
    "fontFamily": "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    "h1": {"size": 32, "weight": 800, "lineHeight": 1.1},
    "h2": {"size": 24, "weight": 800, "lineHeight": 1.2},
    "h3": {"size": 18, "weight": 700, "lineHeight": 1.3},
    "body": {"size": 14, "weight": 500, "lineHeight": 1.6},
    "caption": {"size": 12, "weight": 600, "lineHeight": 1.4}
  },
  "components": {
    "ctaOutlinePill": {
      "height": 46,
      "border": "#B80820",
      "text": "#B80820",
      "arrowCircle": {"bg": "#B80820", "fg": "#FFFFFF", "size": 36}
    }
  }
}
```

---

## 10) Checklist rápido (antes de finalizar qualquer tela)

- [ ] Fundo cinza claro e cards brancos, com sombras suaves.
- [ ] Vermelho apenas para ações/destaques.
- [ ] CTA principal sempre no padrão pill outline + círculo com seta.
- [ ] Espaçamento consistente (escala definida).
- [ ] Tipografia com títulos bem fortes e corpo discreto.
- [ ] Estados de hover/focus implementados.
- [ ] Nada de gradientes chamativos, neon ou “efeitos IA”.

