# Agenda da Vila

Site do projeto de extensão UCSal 65 anos (Vila Universitária, Campus Pituaçu), feito em React + Vite.

## Rodar

```bash
npm install
npm run dev      # abre em http://localhost:5173
npm run build    # gera a pasta dist/ para publicar (GitHub Pages, Vercel, Netlify)
```

## Estrutura

- `src/data.js`: todos os dados (áreas, estimativa de barulho, plantas, relatos de diagnóstico, Semana Vila Viva)
- `src/lib.jsx`: localStorage, cálculo do status ao vivo e componentes pequenos
- `src/components/`: uma seção por arquivo (Header, Agora, Quando, Onde, Jardim, Relatar, Semana)
- `public/img/`: fotos da Vila

## QR Codes das placas

Cada placa aponta para o site com `?planta=N`, que abre direto o canteiro N:
`https://SEU-ENDERECO/?planta=1` até `?planta=5`.

## Protótipo

Votos, relatos, adoções e respostas ficam salvos só no navegador (localStorage).
Para uso real com várias pessoas, troque as funções de `src/lib.jsx` por um banco (ex.: Supabase).
