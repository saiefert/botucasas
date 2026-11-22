# Botucatu Imóveis

Site estático limpo e interativo para ajudar a encontrar casas e chácaras em **Botucatu e região — SP**, pensado para ser publicado no **GitHub Pages** a partir da branch `main` (raiz) e atualizado facilmente pelo **Grokbot** usando um único arquivo JSON.

## Estrutura do projeto

- `index.html` — página principal (lista + filtros + painel de detalhes + mapa interativo).
- `assets/css/style.css` — visual limpo e responsivo (mobile-first + split desktop).
- `assets/js/app.js` — mapa (Leaflet), ícones SVG customizados, marcação de **chácara (`true`/`false`)**, distância automática até a **Casa Tata** (Rua Delfim da Graça Cardoso, 1197 — Alto, Botucatu - SP, 18601-542), raio de proximidade, notas pessoais em `localStorage`, comparador e pré-visualização de JSON.
- `data/casas.json` — **arquivo principal que o Grokbot atualiza** com os imóveis encontrados.
- `data/casas.schema.json` — schema JSON formal com todos os campos aceitos.
- `data/botucatu-pois.json` — catálogo embutido de pontos de interesse em Botucatu e região (Casa Tata como ponto de referência, áreas pet, parques e natureza, academias, mercados, cafés, saúde e educação).
- `GROKBOT.md` — guia e prompt pronto para copiar e colar no Grokbot.
- `.nojekyll` e `404.html` — suporte direto ao GitHub Pages, sem etapa de build.

## Como testar localmente

Sem build nem dependências para instalar. Na pasta do projeto:

```bash
python -m http.server 8000
```

Abra `http://localhost:8000` no navegador.

## Como publicar no GitHub Pages

1. Crie um repositório público no GitHub e faça push desta pasta para a branch `main`.
2. Em **Settings → Pages**, selecione **Deploy from a branch** → `main` → `/ (root)`.
3. Em poucos segundos o site estará no ar. Sempre que o Grokbot atualizar `data/casas.json` (via commit/PR/API do GitHub), o site reflete os novos imóveis automaticamente.

## Como o Grokbot atualiza o site

Basta substituir o arquivo [`data/casas.json`](data/casas.json) mantendo a estrutura simples:

```json
{
  "atualizado_em": "2026-11-22T16:30:00-03:00",
  "fonte": "Grokbot",
  "cidade": "Botucatu e região - SP",
  "casas": [
    {
      "id": "chacara-demetria-01",
      "titulo": "Chácara arborizada no Bairro Demétria",
      "finalidade": "compra",
      "preco": 680000,
      "bairro": "Demétria",
      "lat": -22.9225,
      "lng": -48.4670,
      "quartos": 3,
      "banheiros": 2,
      "vagas": 4,
      "area_m2": 180,
      "terreno_m2": 2500,
      "chacara": true,
      "aceita_pets": true,
      "quintal": true,
      "nota_grokbot": "Terreno amplo com pomar e fácil acesso à Rod. Gastão Dal Farra.",
      "link": "https://..."
    }
  ]
}
```

- Se `lat` e `lng` não vierem no JSON, o site posiciona o imóvel automaticamente pelo `bairro` ou cidade da região (Botucatu, Rubião Júnior, Demétria, Vitoriana, Pardinho, Itatinga, São Manuel, Pratânia, Bofete, Anhembi).
- A propriedade `"chacara"` (`true` ou `false`) marca e filtra chácaras no mapa, nos cards, no comparador e nos detalhes.
- A distância até a **Casa Tata** (Rua Delfim da Graça Cardoso, 1197, Alto, Botucatu - SP, 18601-542) e para **áreas pet, parques, academias, mercados, cafés, saúde e educação** é calculada automaticamente no navegador.
- Você também pode passar uma URL externa via query string: `?json=https://raw.githubusercontent.com/.../casas.json`.
- Veja [`GROKBOT.md`](GROKBOT.md) para o prompt pronto de integração.
