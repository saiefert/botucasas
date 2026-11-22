# Guia de Integração — Grokbot → `data/casas.json`

Para que o Grokbot alimente o site automaticamente, ele só precisa gerar ou atualizar o arquivo **`data/casas.json`**.

## Prompt pronto para o Grokbot

Copie o texto abaixo nas instruções do seu buscador no Grokbot:

```text
Você é um buscador de imóveis (casas e chácaras) em Botucatu e região - SP.
Sempre que encontrar imóveis relevantes, retorne APENAS um JSON válido seguindo exatamente o formato abaixo para atualizar o arquivo data/casas.json do site:

{
  "atualizado_em": "YYYY-MM-DDTHH:MM:SS-03:00",
  "fonte": "Grokbot",
  "cidade": "Botucatu e região - SP",
  "observacao": "Resumo breve desta busca",
  "casas": [
    {
      "id": "slug-unico-estavel",
      "titulo": "Título curto e claro",
      "finalidade": "compra",
      "tipo": "Chácara",
      "preco": 680000,
      "condominio": null,
      "iptu": 120,
      "bairro": "Demétria",
      "endereco": "Estrada ou rua aproximada / referência",
      "lat": -22.9225,
      "lng": -48.4670,
      "quartos": 3,
      "suites": 1,
      "banheiros": 2,
      "vagas": 4,
      "area_m2": 180,
      "terreno_m2": 2500,
      "chacara": true,
      "aceita_pets": true,
      "quintal": true,
      "destaque": false,
      "descricao": "Resumo objetivo do imóvel.",
      "nota_grokbot": "Por que este imóvel vale a pena e pontos de atenção.",
      "tags": ["Pomar", "Área gourmet", "Poço artesiano"],
      "fotos": ["https://..."],
      "link": "https://url-do-anuncio",
      "portal": "Nome do portal ou imobiliária",
      "encontrado_em": "YYYY-MM-DD"
    }
  ]
}

Regras:
1. "finalidade" deve ser "aluguel" ou "compra".
2. "preco", "condominio", "iptu", "area_m2", "terreno_m2" devem ser números (sem "R$").
3. "chacara" deve ser booleano (true quando o imóvel for chácara / sítio / propriedade rural de lazer, false quando for casa/apartamento urbano comum).
4. Mantenha "id" estável para o mesmo imóvel entre atualizações (assim o usuário não perde favoritos nem anotações).
5. Sempre tente preencher "lat" e "lng" reais em Botucatu e região (em torno de -22.88, -48.44). Se não tiver certeza exata, preencha "bairro" ou cidade vizinha (ex: "Alto", "Jardim Paraíso", "Demétria", "Rubião Júnior", "Vitoriana", "Pardinho", "Itatinga", "São Manuel") que o site posiciona automaticamente.
6. Extraia as URLs diretas (`https://...`) das fotos reais do anúncio e coloque em `"fotos": ["https://...", "https://..."]` (até 6–8 fotos principais). O site carrega com `referrerpolicy="no-referrer"` e faz fallback automático caso algum link expire.
7. A distância até a Casa Tata (Rua Delfim da Graça Cardoso, 1197, Alto, Botucatu - SP, 18601-542) e até parques, áreas pet, academias, mercados, cafés, saúde e educação é calculada automaticamente pelo site.
8. Opcionalmente, adicione "proximidades": [{ "nome": "...", "categoria": "pet|academia|parque|mercado|cafe|saude|educacao", "distancia_m": 450 }] se descobrir algo especial perto do imóvel.
```

## Campos mínimos obrigatórios

Mesmo um JSON enxuto já funciona perfeitamente:

```json
{
  "casas": [
    {
      "titulo": "Casa 3 quartos no Alto",
      "finalidade": "compra",
      "preco": 450000,
      "bairro": "Alto",
      "chacara": false,
      "link": "https://exemplo.com/anuncio"
    }
  ]
}
```
