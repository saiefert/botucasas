/* Botucatu Imóveis — Mobile-First Native-Feel Map App + Grokbot JSON Feed */
(() => {
  "use strict";

  const STORAGE_KEYS = {
    prefs: "botucatu_imoveis_user_prefs_v1",
    previewJson: "botucatu_imoveis_preview_json_v1",
  };

  const RADIUS_STEPS = [500, 1000, 2000, 5000];
  const BASEMAP_STEPS = [
    { id: "clean", label: "Clean" },
    { id: "streets", label: "Ruas" },
    { id: "satellite", label: "Satélite" },
  ];

  // Category catalog with crisp custom SVG icons & harmonious colors (foco em rotina diária de carro, saúde, farmácias e plantas)
  const CATEGORIES = {
    referencia: {
      id: "referencia",
      label: "Casa Tata",
      plural: "Casa Tata (Referência)",
      color: "#be185d",
      defaultOn: true,
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5L12 3l9 7.5"/><path d="M5.5 9.5V20h13V9.5"/><path d="M12 16.8s-3.1-2-3.1-4.1c0-1.1.8-1.9 1.8-1.9.6 0 1 .3 1.3.8.3-.5.7-.8 1.3-.8 1 0 1.8.8 1.8 1.9 0 2.1-3.1 4.1-3.1 4.1z" fill="currentColor" stroke="none"/></svg>`,
    },
    farmacia: {
      id: "farmacia",
      label: "Farmácias",
      plural: "Farmácias e drogarias",
      color: "#e11d48",
      defaultOn: true,
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8v8M8 12h8"/></svg>`,
    },
    saude: {
      id: "saude",
      label: "Hospitais & Saúde",
      plural: "Hospitais e pronto atendimento",
      color: "#dc2626",
      defaultOn: true,
      icon: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6V4z"/></svg>`,
    },
    mercado: {
      id: "mercado",
      label: "Mercados",
      plural: "Mercados",
      color: "#2563eb",
      defaultOn: true,
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h16l-1.5 9.5a2 2 0 0 1-2 1.5h-9a2 2 0 0 1-2-1.5L4 9z"/><path d="M8.5 9L11 4.5M15.5 9L13 4.5"/></svg>`,
    },
    cafe: {
      id: "cafe",
      label: "Padarias",
      plural: "Padarias e cafés",
      color: "#9a522a",
      defaultOn: true,
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9z"/><path d="M16 10.5h2a2.5 2.5 0 0 1 0 5h-2M7 5.5v1.5M11 4.5v2.5"/></svg>`,
    },
    plantas: {
      id: "plantas",
      label: "Plantas & Viveiros",
      plural: "Floriculturas, hortos e viveiros",
      color: "#15803d",
      defaultOn: true,
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21v-8"/><path d="M12 13c0-4.5 3.5-8 8-8 0 4.5-3.5 8-8 8z" fill="currentColor" fill-opacity="0.22"/><path d="M12 15c0-3.8-3-6.5-7-6.5 0 3.8 3 6.5 7 6.5z" fill="currentColor" fill-opacity="0.22"/><path d="M8 21h8"/></svg>`,
    },
    parque: {
      id: "parque",
      label: "Parques",
      plural: "Parques e natureza",
      color: "#16a34a",
      defaultOn: true,
      icon: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3L6.2 11.5h3.1L5.5 17.5h5.2V21h2.6v-3.5h5.2l-3.8-6h3.1L12 3z"/></svg>`,
    },
    pet: {
      id: "pet",
      label: "Área pet",
      plural: "Áreas para pets",
      color: "#d97724",
      defaultOn: false,
      icon: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="7.5" cy="9.5" r="2.1"/><circle cx="12" cy="7.2" r="2.2"/><circle cx="16.5" cy="9.5" r="2.1"/><circle cx="18.7" cy="13.7" r="1.8"/><path d="M12 11.4c-2.6 0-5.1 2.2-5.1 4.9 0 1.7 1.3 2.7 2.8 2.7 1 0 1.6-.3 2.3-.3s1.3.3 2.3.3c1.5 0 2.8-1 2.8-2.7 0-2.7-2.5-4.9-5.1-4.9z"/></svg>`,
    },
    academia: {
      id: "academia",
      label: "Academias",
      plural: "Academias",
      color: "#4f46e5",
      defaultOn: false,
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8v8M18 8v8M3.5 10v4M20.5 10v4M6 12h12"/></svg>`,
    },
    educacao: {
      id: "educacao",
      label: "Educação",
      plural: "Escolas e UNESP",
      color: "#7c3aed",
      defaultOn: false,
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 9.5L12 5l9.5 4.5L12 14 2.5 9.5z"/><path d="M6.5 11.5v4.5c0 1.4 2.5 2.8 5.5 2.8s5.5-1.4 5.5-2.8v-4.5"/></svg>`,
    },
  };

  const UI_ICONS = {
    heart: `<svg viewBox="0 0 20 20" fill="none"><path d="M10 16.5C10 16.5 3.5 12.2 3.5 7.4C3.5 5.2 5.2 3.5 7.3 3.5C8.6 3.5 9.6 4.2 10 5.1C10.4 4.2 11.4 3.5 12.7 3.5C14.8 3.5 16.5 5.2 16.5 7.4C16.5 12.2 10 16.5 10 16.5Z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>`,
    compare: `<svg viewBox="0 0 20 20" fill="none"><rect x="2.5" y="4" width="6" height="12" rx="1.5" stroke="currentColor" stroke-width="1.7"/><rect x="11.5" y="4" width="6" height="12" rx="1.5" stroke="currentColor" stroke-width="1.7"/></svg>`,
    pin: `<svg viewBox="0 0 20 20" fill="none"><path d="M10 17.5s5.5-4.7 5.5-9.2a5.5 5.5 0 1 0-11 0c0 4.5 5.5 9.2 5.5 9.2z" stroke="currentColor" stroke-width="1.7"/><circle cx="10" cy="8.3" r="2" stroke="currentColor" stroke-width="1.6"/></svg>`,
    bed: `<svg viewBox="0 0 20 20" fill="none"><path d="M3 14.5V6.5M3 11.5h14v3M17 11.5V9a2 2 0 0 0-2-2H8.5v4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6" cy="8.8" r="1.2" fill="currentColor"/></svg>`,
    bath: `<svg viewBox="0 0 20 20" fill="none"><path d="M4 10.5h12v1.5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-1.5zM5.5 10.5V6a2 2 0 0 1 2-2h.5a1.5 1.5 0 0 1 1.5 1.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    car: `<svg viewBox="0 0 20 20" fill="none"><path d="M3.5 12.5l1.3-4.1A2 2 0 0 1 6.7 7h6.6a2 2 0 0 1 1.9 1.4l1.3 4.1v2.5h-1.8v-1.2H5.3V15H3.5v-2.5z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="6.5" cy="11.8" r="1" fill="currentColor"/><circle cx="13.5" cy="11.8" r="1" fill="currentColor"/></svg>`,
    area: `<svg viewBox="0 0 20 20" fill="none"><rect x="3.5" y="3.5" width="13" height="13" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M7 13l6-6M10.5 7H13v2.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    external: `<svg viewBox="0 0 20 20" fill="none"><path d="M11 4h5v5M16 4l-7 7M8.5 5.5H5.5a1.5 1.5 0 0 0-1.5 1.5v7.5A1.5 1.5 0 0 0 5.5 16H13a1.5 1.5 0 0 0 1.5-1.5v-3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    homeHeart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5L12 3l9 7.5"/><path d="M5.5 9.5V20h13V9.5"/><path d="M12 16.8s-3.1-2-3.1-4.1c0-1.1.8-1.9 1.8-1.9.6 0 1 .3 1.3.8.3-.5.7-.8 1.3-.8 1 0 1.8.8 1.8 1.9 0 2.1-3.1 4.1-3.1 4.1z" fill="currentColor" stroke="none"/></svg>`,
    chacara: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3L7 10h2.8L6 15.5h12L14.2 10H17L12 3z" fill="currentColor" fill-opacity="0.18"/><path d="M12 15.5V21M7 21h10"/></svg>`,
    eye: `<svg viewBox="0 0 20 20" fill="none"><path d="M2 10c1.4-2.9 4.5-5 8-5s6.6 2.1 8 5c-1.4 2.9-4.5 5-8 5s-6.6-2.1-8-5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="10" cy="10" r="2.3" stroke="currentColor" stroke-width="1.7"/></svg>`,
    eyeOff: `<svg viewBox="0 0 20 20" fill="none"><path d="M3 3l14 14M8.5 8.5a2.5 2.5 0 0 0 3 3M5.6 5.8C3.9 7 2.7 8.5 2 10c1.4 2.9 4.5 5 8 5 1.4 0 2.7-.3 3.9-.9M8.3 5.2c.5-.1 1.1-.2 1.7-.2 3.5 0 6.6 2.1 8 5-.5 1.1-1.3 2.1-2.2 2.9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    star: `<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 1.8l2.45 4.97 5.48.8-3.96 3.86.94 5.46L10 14.32l-4.91 2.57.94-5.46-3.96-3.86 5.48-.8L10 1.8z"/></svg>`,
    shieldAlert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l7.5 3v5.5c0 4.8-3.2 8.7-7.5 9.8-4.3-1.1-7.5-5-7.5-9.8V6L12 3z"/><path d="M12 8.5v4.5"/><circle cx="12" cy="16.2" r="0.9" fill="currentColor" stroke="none"/></svg>`,
    trafficAlert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3L21 12L12 21L3 12L12 3z"/><path d="M12 8.2v4.3"/><circle cx="12" cy="15.8" r="0.9" fill="currentColor" stroke="none"/></svg>`,
  };

  // CrimeReports-style crime catalog (1 icon per group of related crimes — consulted by Grokbot via GROKBOT.md & data/crimes.schema.json)
  const CRIME_TYPES = {
    homicidio: {
      id: "homicidio",
      label: "Homicídio / Letal",
      short: "Homicídio, latrocínio, feminicídio",
      color: "#991b1b",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.8 4.2C19.8 8.6 17.4 12.2 12.6 16.2L9.4 13L19.8 4.2z" fill="currentColor"/><path d="M8 11.8l5.8 5.8" stroke-width="2.1"/><path d="M10.2 15.2L5.5 19.9" stroke-width="3.2"/></svg>`,
    },
    roubo: {
      id: "roubo",
      label: "Roubo / Assalto",
      short: "Assalto, mão armada, arrastão",
      color: "#dc2626",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11c0-3.5 3.4-6 8-6s8 2.5 8 6v2.2c0 3.2-3.4 5.8-8 5.8s-8-2.6-8-5.8V11z"/><path d="M4.5 11.5h15v2.2c0 .6-.5 1.1-1.1 1.1h-3.3c-.9 0-1.5-.5-2-1.2l-1.1-1.4-1.1 1.4c-.5.7-1.1 1.2-2 1.2H5.6c-.6 0-1.1-.5-1.1-1.1v-2.2z" fill="currentColor" fill-opacity="0.3"/><circle cx="8.8" cy="12.6" r="1" fill="currentColor" stroke="none"/><circle cx="15.2" cy="12.6" r="1" fill="currentColor" stroke="none"/></svg>`,
    },
    furto: {
      id: "furto",
      label: "Furto",
      short: "Celular, bike, comércio, fios",
      color: "#d97706",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="14.5" cy="5.5" r="2"/><path d="M12.5 9.5l-3 2.5-2.5-.5"/><path d="M12.5 9.5l3 2 2.5-1"/><path d="M12.5 9.5l-1.5 5 3.5 2.5-.5 3.5"/><path d="M11 14.5l-3.5 2.5-2 3"/><path d="M4.5 9.5c0-1 .8-1.8 1.8-1.8h1.4c1 0 1.8.8 1.8 1.8v2.2a2.5 2.5 0 0 1-5 0V9.5z" fill="currentColor" fill-opacity="0.28"/></svg>`,
    },
    invasao: {
      id: "invasao",
      label: "Invasão / Arromb.",
      short: "Arrombamento, invasão domiciliar",
      color: "#b45309",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 11L12 4l8.5 7"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9.5 20v-7.5l4.8-1.4V20" fill="currentColor" fill-opacity="0.28"/><circle cx="12.6" cy="15.8" r="0.9" fill="currentColor" stroke="none"/></svg>`,
    },
    veiculo: {
      id: "veiculo",
      label: "Veículo (Furto/Roubo)",
      short: "Carro, moto, caminhonete",
      color: "#ca8a04",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 13.5l1.6-4.4A2 2 0 0 1 7 7.8h6.2"/><path d="M3.5 13.5h17v4h-2v-1.3H5.5v1.3h-2v-4z"/><path d="M20.5 13.5l-1.1-3"/><circle cx="7" cy="13.5" r="1.2" fill="currentColor" stroke="none"/><circle cx="17" cy="13.5" r="1.2" fill="currentColor" stroke="none"/><path d="M18.5 4v4"/><circle cx="18.5" cy="10.2" r="0.9" fill="currentColor" stroke="none"/></svg>`,
    },
    trafico: {
      id: "trafico",
      label: "Tráfico / Drogas",
      short: "Entorpecentes, ponto de tráfico",
      color: "#7c3aed",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.5 6.5l7 7a4.2 4.2 0 1 1-6 6l-7-7a4.2 4.2 0 1 1 6-6z"/><path d="M8.5 15.5l7-7"/><path d="M11.5 18.5a4.2 4.2 0 0 0 6-6l-2-2-6 6 2 2z" fill="currentColor" fill-opacity="0.3"/></svg>`,
    },
    agressao: {
      id: "agressao",
      label: "Agressão / Violência",
      short: "Lesão corporal, briga, ameaça",
      color: "#ea580c",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 11.5V8.3a1.5 1.5 0 0 1 3 0V11M9 11V7a1.5 1.5 0 0 1 3 0v4M12 11V7.3a1.5 1.5 0 0 1 3 0V11M15 11V8.5a1.5 1.5 0 0 1 3 0v5c0 2.9-1.9 5-4.8 5.4V21H8.8v-2.2C6.9 18 6 16.3 6 14.3v-2.8z" fill="currentColor" fill-opacity="0.22"/><path d="M6 11.5h6.5a1.5 1.5 0 0 1 0 3H9.2"/></svg>`,
    },
    violencia_domestica: {
      id: "violencia_domestica",
      label: "Violência Doméstica",
      short: "Maria da Penha, medida protetiva",
      color: "#e11d48",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 11L12 4l8.5 7"/><path d="M6 10.5V20h12v-9.5"/><path d="M12 10.5v4"/><circle cx="12" cy="17.2" r="1" fill="currentColor" stroke="none"/></svg>`,
    },
    violencia_sexual: {
      id: "violencia_sexual",
      label: "Crime Sexual",
      short: "Estupro, importunação, assédio",
      color: "#9d174d",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l7.5 3v5.5c0 4.8-3.2 8.7-7.5 9.8-4.3-1.1-7.5-5-7.5-9.8V6L12 3z"/><path d="M9.2 9.2l5.6 5.6M14.8 9.2l-5.6 5.6"/></svg>`,
    },
    arma: {
      id: "arma",
      label: "Arma / Disparo",
      short: "Tiroteio, disparo, porte ilegal",
      color: "#be123c",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="6.5"/><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/><path d="M12 3v3.2M12 17.8V21M3 12h3.2M17.8 12H21"/></svg>`,
    },
    incendio: {
      id: "incendio",
      label: "Incêndio Criminoso",
      short: "Fogo criminoso, explosivo",
      color: "#c2410c",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.5 3.5c.8 3.2-1.8 4.8-1.8 7 0 1.2.9 2 2 2 1.5 0 2.3-1.3 2.5-3 2 1.8 3.3 4.1 3.3 6.5a6.5 6.5 0 1 1-13 0c0-3.2 2-5.6 4.2-7.8 1-1 2.1-2.5 2.8-4.7z" fill="currentColor" fill-opacity="0.25"/></svg>`,
    },
    vandalismo: {
      id: "vandalismo",
      label: "Vandalismo / Dano",
      short: "Depredação, pichação, dano",
      color: "#475569",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="7.5" y="9" width="9" height="11.5" rx="1.8"/><path d="M9.5 9V6.8a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V9"/><path d="M12 5.8V4.2M15.5 4.5l2-1M16.5 7h2"/></svg>`,
    },
    estelionato: {
      id: "estelionato",
      label: "Estelionato / Golpe",
      short: "Golpe presencial, fraude, extorsão",
      color: "#0369a1",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="6" width="17" height="12" rx="2.2"/><path d="M3.5 10.2h17"/><path d="M14.2 13.3l2.6 2.6M16.8 13.3l-2.6 2.6"/></svg>`,
    },
    operacao_policial: {
      id: "operacao_policial",
      label: "Operação / Prisão",
      short: "Mandado, flagrante, receptação",
      color: "#1d4ed8",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="7.5" cy="14.5" r="3.8"/><circle cx="16.5" cy="14.5" r="3.8"/><path d="M9.6 11.3l1.2-2.8a1.4 1.4 0 0 1 2.4 0l1.2 2.8"/><path d="M11 8.5h2"/></svg>`,
    },
    outro: {
      id: "outro",
      label: "Outra Ocorrência",
      short: "Outros registros policiais",
      color: "#334155",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4L3.5 19h17L12 4z" fill="currentColor" fill-opacity="0.2"/><path d="M12 10v4.2"/><circle cx="12" cy="16.8" r="0.9" fill="currentColor" stroke="none"/></svg>`,
    },
  };

  // Traffic accidents catalog (road-warning sign pins — consulted by Grokbot via GROKBOT.md & data/transito.schema.json)
  const TRAFFIC_TYPES = {
    fatal: {
      id: "fatal",
      label: "Acidente Fatal",
      short: "Acidente com óbito / vítima fatal",
      color: "#991b1b",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4.5v15M7 9.5h10"/></svg>`,
    },
    atropelamento: {
      id: "atropelamento",
      label: "Atropelamento",
      short: "Pedestre atropelado na via",
      color: "#dc2626",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="5.5" r="2"/><path d="M12 8.5l-1 5.5-3 4.5M11 14l4.5 1.5 2 3M8.5 11l3.5-1.5 3.5 1.5"/></svg>`,
    },
    moto: {
      id: "moto",
      label: "Acidente de Moto",
      short: "Queda ou colisão com motocicleta",
      color: "#ea580c",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6.2" cy="16.5" r="2.8"/><circle cx="17.8" cy="16.5" r="2.8"/><path d="M9 16.5h4.2l2.3-5.2h-4l-1.5 3H8M14.2 7.5h3l1.3 3.8"/></svg>`,
    },
    colisao: {
      id: "colisao",
      label: "Colisão / Batida",
      short: "Batida entre veículos, cruzamento",
      color: "#d97706",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 15l1.3-3.8a1.6 1.6 0 0 1 1.5-1.1h4.2l1.2 2.4H3.5v3.5h1.5v-1h5.8"/><path d="M20.5 15l-1.3-3.8a1.6 1.6 0 0 0-1.5-1.1h-3.2l-.8 2.4h6.8v3.5h-1.5v-1h-4.8"/><path d="M12 4.5v3M9.5 6l1.5 1.8M14.5 6L13 7.8"/></svg>`,
    },
    capotamento: {
      id: "capotamento",
      label: "Capotamento / Tomb.",
      short: "Veículo capotado ou saída de pista",
      color: "#b45309",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.5 14.5l1.5-3.5a2 2 0 0 1 1.8-1.2h6.4a2 2 0 0 1 1.8 1.2l1.5 3.5H5.5z" transform="rotate(180 12 13)"/><path d="M18.5 7.5A7.5 7.5 0 0 0 6 7.5"/><path d="M16 4.8l2.8 2.7-3.2.8"/></svg>`,
    },
    ciclista: {
      id: "ciclista",
      label: "Ciclista / Bike",
      short: "Bicicleta, bike elétrica, ciclovia",
      color: "#0d9488",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6.2" cy="16.2" r="3"/><circle cx="17.8" cy="16.2" r="3"/><path d="M6.2 16.2L10.3 9.5h4l3.5 6.7M10.3 9.5l1.7 6.7H6.2M9.2 7h2.8M14.3 9.5l1.1-2.5H18"/></svg>`,
    },
    onibus_caminhao: {
      id: "onibus_caminhao",
      label: "Ônibus / Caminhão",
      short: "Veículo pesado, carreta, ônibus",
      color: "#0369a1",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="7" width="11.5" height="9" rx="1.5"/><path d="M14.5 10h3.8l2.2 2.8V16h-6v-6z"/><circle cx="7" cy="17.2" r="1.7"/><circle cx="17.5" cy="17.2" r="1.7"/></svg>`,
    },
    embriaguez: {
      id: "embriaguez",
      label: "Embriaguez / Perigo",
      short: "Bafômetro, racha, fuga do local",
      color: "#7c3aed",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="2"/><path d="M5 11h5M14 11h5M12 14v5.5"/><path d="M4.5 4.5l15 15"/></svg>`,
    },
    rodovia: {
      id: "rodovia",
      label: "Rodovia / Trevo",
      short: "Rodovia, trevo, contorno, vicinal",
      color: "#475569",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 20L10 4M17 20L14 4M12 6.5v2.5M12 12v2.5M12 17.5V20"/></svg>`,
    },
    outro: {
      id: "outro",
      label: "Outro Acidente",
      short: "Pane/incêndio, carga, animal na via",
      color: "#ca8a04",
      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4.5L3.8 19h16.4L12 4.5z" fill="currentColor" fill-opacity="0.22"/><path d="M12 10v4"/><circle cx="12" cy="16.5" r="0.9" fill="currentColor" stroke="none"/></svg>`,
    },
  };

  const TRAFFIC_GRAVIDADE_LABELS = {
    fatal: "Fatal",
    grave: "Grave",
    leve: "Leve",
    sem_vitimas: "Sem vítimas",
  };

  const GROKBOT_PROMPT = `Você é um buscador de imóveis (casas e chácaras) em Botucatu e região - SP.
Sempre que encontrar imóveis relevantes, retorne APENAS um JSON válido seguindo exatamente o formato abaixo para atualizar o arquivo data/casas.json do site:

{
  "atualizado_em": "2026-11-22T16:30:00-03:00",
  "fonte": "Grokbot",
  "cidade": "Botucatu e região - SP",
  "observacao": "Resumo breve desta rodada de busca",
  "casas": [
    {
      "id": "chacara-demetria-01",
      "titulo": "Chácara arborizada com pomar no Demétria",
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
      "nova": true,
      "destaque": false,
      "descricao": "Resumo objetivo do imóvel.",
      "nota_grokbot": "Por que este imóvel vale a pena e pontos de atenção.",
      "tags": ["Pomar", "Área gourmet", "Poço artesiano"],
      "fotos": ["https://url-direta-da-foto-1.jpg", "https://url-direta-da-foto-2.jpg"],
      "link": "https://url-do-anuncio",
      "portal": "Nome do portal",
      "encontrado_em": "2026-11-22"
    }
  ]
}

Regras:
- "finalidade": "aluguel" ou "compra".
- "chacara": true se for chácara / sítio / propriedade rural de lazer, false se for imóvel urbano comum.
- "nova": true quando for novidade recém-adicionada na atualização (exibe estrelinha e selo Nova no mapa ao lado do valor), false para imóveis já listados anteriormente.
- "fotos": extraia as URLs reais (https://...) das imagens do anúncio (até 6-8 fotos); o site faz fallback automático se algum link falhar.
- "preco", "condominio", "iptu", "area_m2", "terreno_m2": números sem "R$".
- Mantenha o mesmo "id" para o mesmo imóvel entre atualizações (preserva favoritos e anotações).
- Se não tiver "lat" e "lng" exatas, preencha "bairro" ou cidade vizinha (ex: "Alto", "Jardim Paraíso", "Demétria", "Rubião Júnior", "Vitoriana", "Pardinho", "Itatinga", "São Manuel") que o site posiciona no mapa automaticamente.
- A distância até a Casa Tata (Rua Delfim da Graça Cardoso, 1197, Alto, Botucatu - SP, 18601-542) e até parques, áreas pet, academias e mercados é calculada automaticamente pelo site.`;

  const STATUS_OPTIONS = [
    { id: "", label: "Em análise" },
    { id: "visitar", label: "Quero visitar" },
    { id: "visitada", label: "Visitado" },
    { id: "descartada", label: "Descartado" },
  ];

  // App state
  const state = {
    activeTab: "mapa", // mobile tab: "mapa" | "lista" | "salvas" | "crimes"
    sidebarMode: "imoveis", // desktop sidebar mode: "imoveis" | "crimes"
    savedFilter: "all", // "all" | "fav" | "visitar" | "visitada"
    cityData: null,
    publishedFeed: null,
    activeFeed: null,
    isPreview: false,
    houses: [],
    filteredHouses: [],
    allPois: [],
    referenceAnchors: [],
    liveOsmPoisByHouse: {},
    crimesFeed: null,
    crimes: [],
    showCrimes: true,
    crimeLegendOpen: false,
    crimePeriodDays: 0, // 0 | 1 | 3 | 7 | 15 | 30 | 90 | 365 | "custom"
    crimeDateFrom: "",
    crimeDateTo: "",
    crimeQuery: "",
    crimePrecisao: "todas", // "todas" | "rua" | "bairro"
    crimeSort: "recente", // "recente" | "antigo" | "tipo" | "bairro" | "perto"
    crimeTypesExpanded: false,
    activeCrimeTypes: new Set(Object.keys(CRIME_TYPES)),
    reportKind: "crimes", // "crimes" | "transito"
    trafficFeed: null,
    traffic: [],
    showTraffic: true,
    trafficPeriodDays: 0, // 0 | 1 | 3 | 7 | 15 | 30 | 90 | 365 | "custom"
    trafficDateFrom: "",
    trafficDateTo: "",
    trafficQuery: "",
    trafficPrecisao: "todas", // "todas" | "rua" | "bairro"
    trafficSort: "recente", // "recente" | "antigo" | "tipo" | "bairro" | "perto"
    trafficTypesExpanded: false,
    activeTrafficTypes: new Set(Object.keys(TRAFFIC_TYPES)),
    selectedHouseId: null,
    drawerOpen: false,
    hoveredHouseId: null,
    compareIds: [],
    activePhotoIndex: 0,
    radiusMeters: 1000,
    basemap: "clean",
    activeCategories: new Set(
      Object.values(CATEGORIES)
        .filter((c) => c.defaultOn)
        .map((c) => c.id)
    ),
    filters: {
      query: "",
      finalidade: "todas",
      chacara: "todas", // "todas" | "sim" | "nao"
      minQuartos: 0,
      sort: "casa_tata",
      pets: false,
      quintal: false,
      novas: false,
      favoritas: false,
      ocultos: false,
      near: new Set(),
    },
    prefs: loadPrefs(),
  };

  // Leaflet references
  let map = null;
  let baseLayers = {};
  let currentBaseLayer = null;
  let referenciaLayer = null;
  let poiLayer = null;
  let crimeLayer = null;
  let trafficLayer = null;
  let houseLayer = null;
  let selectionLayer = null;
  let routeHighlightLayer = null;
  const houseMarkers = new Map();
  const poiMarkers = new Map();
  const crimeMarkers = new Map();
  const trafficMarkers = new Map();
  const anchorMarkers = new Map();

  // DOM Elements
  const el = {
    searchInput: document.getElementById("searchInput"),
    clearSearchBtn: document.getElementById("clearSearchBtn"),
    openFiltersBtn: document.getElementById("openFiltersBtn"),
    filterCountBadge: document.getElementById("filterCountBadge"),
    feedStatus: document.getElementById("feedStatus"),
    feedStatusText: document.getElementById("feedStatusText"),
    openCrimeReportBtn: document.getElementById("openCrimeReportBtn"),
    headerCrimeCount: document.getElementById("headerCrimeCount"),
    openTrafficReportBtn: document.getElementById("openTrafficReportBtn"),
    headerTrafficCount: document.getElementById("headerTrafficCount"),
    compareOpenBtn: document.getElementById("compareOpenBtn"),
    compareCount: document.getElementById("compareCount"),
    mobileCompareBtn: document.getElementById("mobileCompareBtn"),
    mobileCompareCount: document.getElementById("mobileCompareCount"),
    navListCount: document.getElementById("navListCount"),
    navSavedDot: document.getElementById("navSavedDot"),
    navCrimesCount: document.getElementById("navCrimesCount"),
    crimeReportView: document.getElementById("crimeReportView"),
    sortFilter: document.getElementById("sortFilter"),
    sheetSortSelect: document.getElementById("sheetSortSelect"),
    resultsCount: document.getElementById("resultsCount"),
    resetFiltersBtn: document.getElementById("resetFiltersBtn"),
    savedSubtitle: document.getElementById("savedSubtitle"),
    listingsContainer: document.getElementById("listingsContainer"),
    emptyState: document.getElementById("emptyState"),
    emptyTitle: document.getElementById("emptyTitle"),
    emptyDesc: document.getElementById("emptyDesc"),
    emptyResetBtn: document.getElementById("emptyResetBtn"),
    drawerBackdrop: document.getElementById("drawerBackdrop"),
    detailDrawer: document.getElementById("detailDrawer"),
    drawerGrab: document.getElementById("drawerGrab"),
    closeDrawerBtn: document.getElementById("closeDrawerBtn"),
    drawerPeekMapBtn: document.getElementById("drawerPeekMapBtn"),
    drawerCompareBtn: document.getElementById("drawerCompareBtn"),
    drawerHideBtn: document.getElementById("drawerHideBtn"),
    drawerFavBtn: document.getElementById("drawerFavBtn"),
    drawerBody: document.getElementById("drawerBody"),
    poiCategoryBar: document.getElementById("poiCategoryBar"),
    crimeLegendPanel: document.getElementById("crimeLegendPanel"),
    mapCarousel: document.getElementById("mapCarousel"),
    mapCarouselWrap: document.getElementById("mapCarouselWrap"),
    cycleRadiusBtn: document.getElementById("cycleRadiusBtn"),
    cycleRadiusLabel: document.getElementById("cycleRadiusLabel"),
    cycleBasemapBtn: document.getElementById("cycleBasemapBtn"),
    cycleBasemapLabel: document.getElementById("cycleBasemapLabel"),
    fitBoundsBtn: document.getElementById("fitBoundsBtn"),
    fitBoundsMobileBtn: document.getElementById("fitBoundsMobileBtn"),
    mapHint: document.getElementById("mapHint"),
    filtersModal: document.getElementById("filtersModal"),
    sheetClearFiltersBtn: document.getElementById("sheetClearFiltersBtn"),
    sheetApplyFiltersBtn: document.getElementById("sheetApplyFiltersBtn"),
    compareModal: document.getElementById("compareModal"),
    compareBody: document.getElementById("compareBody"),
    toast: document.getElementById("toast"),
  };

  function isDesktop() {
    return window.innerWidth >= 840;
  }

  // ==================== UTILITIES ====================

  function loadPrefs() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.prefs);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          favorites: parsed.favorites || {},
          hidden: parsed.hidden || {},
          status: parsed.status || {},
          notes: parsed.notes || {},
        };
      }
    } catch (_) {}
    return { favorites: {}, hidden: {}, status: {}, notes: {} };
  }

  function savePrefs() {
    try {
      localStorage.setItem(STORAGE_KEYS.prefs, JSON.stringify(state.prefs));
    } catch (_) {}
    updateSavedIndicators();
  }

  function getHiddenHousesCount() {
    return state.houses.filter((h) => Boolean(state.prefs.hidden[h.id])).length;
  }

  function getNovaHousesCount() {
    return state.houses.filter((h) => !state.prefs.hidden[h.id] && Boolean(h.nova)).length;
  }

  function updateSavedIndicators() {
    const hiddenCount = getHiddenHousesCount();
    const novaCount = getNovaHousesCount();
    const savedCount = state.houses.filter(
      (h) =>
        !state.prefs.hidden[h.id] &&
        (state.prefs.favorites[h.id] || state.prefs.status[h.id] || state.prefs.notes[h.id])
    ).length;
    el.navSavedDot.hidden = savedCount === 0 && hiddenCount === 0;

    document.querySelectorAll('[data-toggle="ocultos"], [data-saved-filter="ocultos"]').forEach((btn) => {
      btn.hidden = hiddenCount === 0;
    });
    document.querySelectorAll("[data-hidden-count]").forEach((span) => {
      span.textContent = String(hiddenCount);
    });

    document.querySelectorAll('[data-toggle="novas"]').forEach((btn) => {
      btn.hidden = novaCount === 0;
    });
    document.querySelectorAll("[data-nova-count]").forEach((span) => {
      span.textContent = String(novaCount);
    });

    if (hiddenCount === 0 && state.savedFilter === "ocultos") {
      state.savedFilter = "all";
      document.querySelectorAll("[data-saved-filter]").forEach((b) => {
        b.classList.toggle("is-active", b.dataset.savedFilter === "all");
      });
    }
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalizeText(str) {
    return String(str ?? "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function parseNumber(val) {
    if (typeof val === "number" && Number.isFinite(val)) return val;
    if (typeof val === "string") {
      const cleaned = val
        .replace(/[^\d,.-]/g, "")
        .replace(/\.(?=\d{3}(\D|$))/g, "")
        .replace(",", ".");
      const n = Number(cleaned);
      return Number.isFinite(n) ? n : 0;
    }
    return 0;
  }

  function formatCurrency(val) {
    const n = parseNumber(val);
    if (!n) return "Sob consulta";
    return n.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    });
  }

  function formatCompactPrice(val, finalidade) {
    const n = parseNumber(val);
    if (!n) return "Consultar";
    if (n >= 1000000) {
      const m = (n / 1000000).toFixed(2).replace(/\.?0+$/, "").replace(".", ",");
      return `R$ ${m} mi`;
    }
    if (finalidade === "compra" || n >= 20000) {
      return `R$ ${Math.round(n / 1000)} mil`;
    }
    return `R$ ${n.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`;
  }

  function formatDistance(meters) {
    if (!Number.isFinite(meters)) return "—";
    if (meters < 1000) return `${Math.round(meters / 10) * 10 || 10} m`;
    return `${(meters / 1000).toFixed(1).replace(".", ",")} km`;
  }

  function walkMinutes(meters) {
    return Math.max(1, Math.round(meters / 76));
  }

  function driveMinutes(meters) {
    // Realistic pace for Botucatu & region: ~28 km/h urban up to 5 km, ~55 km/h highway/rural beyond 5 km
    if (!Number.isFinite(meters)) return 0;
    if (meters <= 5000) return Math.max(2, Math.round(meters / 465));
    const urbanPart = 5000 / 465;
    const regionalPart = (meters - 5000) / 915;
    return Math.max(2, Math.round(urbanPart + regionalPart));
  }

  function roadApproxMeters(straightMeters) {
    // Road winding factor for Botucatu hills and regional roads (~1.24x straight line)
    return Math.round(straightMeters * 1.24);
  }

  function getAnchorIcon() {
    return UI_ICONS.homeHeart;
  }

  function buildGoogleMapsDirUrl(house, anchor) {
    const dest = anchor.endereco ? encodeURIComponent(anchor.endereco) : `${anchor.lat},${anchor.lng}`;
    return `https://www.google.com/maps/dir/?api=1&origin=${house.lat},${house.lng}&destination=${dest}`;
  }

  function formatDateShort(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  }

  function hashString(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return Math.abs(h);
  }

  function haversine(lat1, lng1, lat2, lng2) {
    const R = 6371000;
    const toRad = (deg) => (deg * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  let toastTimer = null;
  function showToast(msg) {
    el.toast.textContent = msg;
    el.toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.toast.hidden = true;
    }, 2600);
  }

  function buildHouseIllustration(house, compact = false) {
    const palettes = [
      { sky: "#e6f1eb", hill: "#c6dfd1", wall: "#ffffff", roof: "#1b5e43", accent: "#d46a34", tree: "#2c7a57" },
      { sky: "#f3ece4", hill: "#dfd3c5", wall: "#ffffff", roof: "#3b5249", accent: "#d97724", tree: "#4c7c63" },
      { sky: "#e8eff5", hill: "#cad9e5", wall: "#ffffff", roof: "#244761", accent: "#d46a34", tree: "#2f7556" },
      { sky: "#edf2e7", hill: "#d1dfc4", wall: "#ffffff", roof: "#4a5d3b", accent: "#c76c3a", tree: "#3b7644" },
    ];
    const p = house.chacara
      ? { sky: "#e5f3ea", hill: "#b7dcbf", wall: "#fffdf8", roof: "#9a4b26", accent: "#1b5e43", tree: "#1e7a46" }
      : palettes[hashString(house.id || house.titulo) % palettes.length];
    const isSobrado = !house.chacara && normalizeText(house.tipo).includes("sobrado");
    const bairroLabel = escapeHtml(house.bairro || "Botucatu - SP");
    const footerCaption = house.chacara ? `Chácara · ${bairroLabel}` : `${bairroLabel} · Botucatu e região`;

    return `
      <svg class="house-card__placeholder" viewBox="0 0 420 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ilustração de ${escapeHtml(house.titulo)}">
        <rect width="420" height="200" fill="${p.sky}"/>
        <circle cx="348" cy="46" r="24" fill="#fff" opacity="0.7"/>
        ${house.chacara ? `<path d="M0 148 Q110 108 235 136 T420 124 L420 200 L0 200 Z" fill="#cde6d2"/>` : ""}
        <path d="M0 162 Q105 130 220 152 T420 144 L420 200 L0 200 Z" fill="${p.hill}"/>
        <g opacity="0.92">
          <rect x="64" y="122" width="6" height="32" rx="3" fill="#6b5848"/>
          <circle cx="67" cy="108" r="22" fill="${p.tree}"/>
          <circle cx="54" cy="116" r="14" fill="${p.tree}" opacity="0.85"/>
          <rect x="332" y="124" width="6" height="30" rx="3" fill="#6b5848"/>
          <circle cx="335" cy="111" r="20" fill="${p.tree}"/>
          <circle cx="350" cy="119" r="13" fill="${p.tree}" opacity="0.8"/>
          ${
            house.chacara
              ? `<rect x="100" y="128" width="5" height="24" rx="2.5" fill="#6b5848"/>
                 <circle cx="102" cy="117" r="15" fill="${p.tree}" opacity="0.88"/>
                 <rect x="304" y="128" width="5" height="24" rx="2.5" fill="#6b5848"/>
                 <circle cx="306" cy="118" r="14" fill="${p.tree}" opacity="0.86"/>`
              : ""
          }
        </g>
        ${
          isSobrado
            ? `
          <rect x="136" y="74" width="148" height="82" rx="4" fill="${p.wall}" stroke="#17211d" stroke-opacity="0.14" stroke-width="2"/>
          <rect x="128" y="66" width="164" height="12" rx="3" fill="${p.roof}"/>
          <rect x="150" y="90" width="42" height="22" rx="3" fill="${p.sky}" stroke="${p.roof}" stroke-width="1.5"/>
          <rect x="228" y="90" width="42" height="22" rx="3" fill="${p.sky}" stroke="${p.roof}" stroke-width="1.5"/>
          <rect x="197" y="122" width="26" height="34" rx="3" fill="${p.accent}"/>
          <rect x="150" y="124" width="34" height="20" rx="3" fill="${p.sky}"/>
          <rect x="236" y="124" width="34" height="20" rx="3" fill="${p.sky}"/>
        `
            : `
          <polygon points="118,104 210,56 302,104" fill="${p.roof}"/>
          <rect x="136" y="100" width="148" height="56" rx="3" fill="${p.wall}" stroke="#17211d" stroke-opacity="0.14" stroke-width="2"/>
          <rect x="196" y="120" width="28" height="36" rx="3" fill="${p.accent}"/>
          <rect x="152" y="116" width="30" height="22" rx="3" fill="${p.sky}" stroke="${p.roof}" stroke-width="1.5"/>
          <rect x="238" y="116" width="30" height="22" rx="3" fill="${p.sky}" stroke="${p.roof}" stroke-width="1.5"/>
        `
        }
        ${compact ? "" : `<text x="210" y="183" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="11" font-weight="600" fill="#17211d" opacity="0.56">${footerCaption}</text>`}
      </svg>
    `;
  }

  // ==================== DATA NORMALIZATION & PROXIMITY ENGINE ====================

  function resolveHouseCoords(raw, index) {
    let lat = Number(raw.lat);
    let lng = Number(raw.lng);
    let approx = false;

    if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat === 0 || lng === 0) {
      approx = true;
      const bairros = state.cityData?.bairros || {};
      const key = normalizeText(raw.bairro || "");
      let match = bairros[key];
      if (!match && key) {
        const foundKey = Object.keys(bairros).find((k) => key.includes(k) || k.includes(key));
        if (foundKey) match = bairros[foundKey];
      }
      const base = match || state.cityData?.centro || { lat: -22.8858, lng: -48.4450 };
      const seed = hashString(`${raw.id || raw.titulo || index}`);
      const angle = (seed % 360) * (Math.PI / 180);
      const dist = 0.0014 + (seed % 7) * 0.00035;
      lat = Number((base.lat + Math.sin(angle) * dist).toFixed(5));
      lng = Number((base.lng + Math.cos(angle) * dist).toFixed(5));
    }
    return { lat, lng, approx };
  }

  function computeHouseProximities(house) {
    const items = [];

    for (const poi of state.allPois) {
      const dist = haversine(house.lat, house.lng, poi.lat, poi.lng);
      items.push({
        id: poi.id,
        nome: poi.nome,
        categoria: poi.categoria,
        lat: poi.lat,
        lng: poi.lng,
        detalhe: poi.detalhe || "",
        distance: dist,
        source: poi.source || "botucatu",
      });
    }

    if (Array.isArray(house.rawProximidades)) {
      house.rawProximidades.forEach((p, idx) => {
        if (normalizeText(p.categoria) === "ciclovia") return;
        const cat = CATEGORIES[p.categoria] && p.categoria !== "referencia" ? p.categoria : "parque";
        const hasCoords = Number.isFinite(Number(p.lat)) && Number.isFinite(Number(p.lng));
        const dist = Number.isFinite(Number(p.distancia_m))
          ? Number(p.distancia_m)
          : hasCoords
          ? haversine(house.lat, house.lng, Number(p.lat), Number(p.lng))
          : 450;
        items.push({
          id: `custom-${house.id}-${idx}`,
          nome: p.nome || "Ponto próximo",
          categoria: cat,
          lat: hasCoords ? Number(p.lat) : house.lat,
          lng: hasCoords ? Number(p.lng) : house.lng,
          detalhe: p.detalhe || "Informado pelo Grokbot",
          distance: dist,
          source: "grokbot",
        });
      });
    }

    const liveOsm = state.liveOsmPoisByHouse[house.id] || [];
    for (const p of liveOsm) {
      const dist = haversine(house.lat, house.lng, p.lat, p.lng);
      items.push({ ...p, distance: dist, source: "osm" });
    }

    items.sort((a, b) => a.distance - b.distance);

    const nearestByCat = {};
    for (const item of items) {
      if (!nearestByCat[item.categoria]) nearestByCat[item.categoria] = item;
    }

    const scoreFromDist = (d, ideal = 350, max = 2500) => {
      if (!Number.isFinite(d)) return 30;
      if (d <= ideal) return 98;
      if (d >= max) return 28;
      return Math.round(98 - ((d - ideal) / (max - ideal)) * 70);
    };

    const saudeScore = Math.round(
      scoreFromDist(nearestByCat.farmacia?.distance, 500, 3200) * 0.55 +
        scoreFromDist(nearestByCat.saude?.distance, 900, 5000) * 0.45
    );
    const rotinaScore = Math.round(
      scoreFromDist(nearestByCat.mercado?.distance, 550, 3200) * 0.55 +
        scoreFromDist(nearestByCat.cafe?.distance, 550, 3200) * 0.45
    );
    const plantasBase = Math.round(
      scoreFromDist(nearestByCat.plantas?.distance, 600, 3500) * 0.6 +
        scoreFromDist(nearestByCat.parque?.distance, 600, 3500) * 0.4
    );
    const scores = {
      saude: saudeScore,
      rotina: rotinaScore,
      plantas: Math.min(100, plantasBase + (house.quintal || house.chacara ? 10 : 0)),
      parque: Math.min(100, Math.round(scoreFromDist(nearestByCat.parque?.distance, 500, 3200) + (house.chacara ? 8 : 0))),
    };

    house.nearby = items;
    house.nearestByCat = nearestByCat;
    house.scores = scores;
    house.overallScore = Math.round(
      scores.saude * 0.34 +
        scores.rotina * 0.32 +
        scores.plantas * 0.22 +
        scores.parque * 0.12
    );

    // Daily car routine highlights (Mercado, Padaria, Farmácia, Saúde/Hospital, Plantas/Viveiro)
    const dailyCats = [
      { cat: "farmacia", label: "Farmácia mais próxima" },
      { cat: "mercado", label: "Mercado mais próximo" },
      { cat: "cafe", label: "Padaria mais próxima" },
      { cat: "saude", label: "Hospital / Saúde" },
      { cat: "plantas", label: "Plantas / Viveiro" },
    ];
    house.dailyRoutine = dailyCats
      .map((entry) => {
        const nearest = nearestByCat[entry.cat];
        if (!nearest) return null;
        const road = roadApproxMeters(nearest.distance);
        return {
          ...nearest,
          routineLabel: entry.label,
          roadMeters: road,
          driveMin: driveMinutes(road),
          walkMin: walkMinutes(nearest.distance),
        };
      })
      .filter(Boolean);

    // Distance to reference anchor(s) — Casa Tata
    house.commutes = state.referenceAnchors.map((anchor) => {
      const straight = haversine(house.lat, house.lng, anchor.lat, anchor.lng);
      const road = roadApproxMeters(straight);
      return {
        ...anchor,
        straightMeters: straight,
        roadMeters: road,
        driveMin: driveMinutes(road),
        walkMin: walkMinutes(road),
      };
    });

    const casaTata = house.commutes.find((c) => c.tipo === "casa_tata") || house.commutes[0];
    house.casaTataDist = casaTata ? casaTata.roadMeters : Infinity;
  }

  function ingestFeed(feed, isPreview = false) {
    if (!feed || !Array.isArray(feed.casas)) {
      throw new Error('O JSON precisa conter um array "casas": [ ... ].');
    }

    state.activeFeed = feed;
    state.isPreview = isPreview;

    // Reference anchors: defaults from botucatu-pois.json (Casa Tata), optionally overridable via JSON
    const defaultAnchors = Array.isArray(state.cityData?.referencia) ? state.cityData.referencia : [];
    const customAnchors =
      Array.isArray(feed.referencia) && feed.referencia.length ? feed.referencia : defaultAnchors;
    state.referenceAnchors = customAnchors.filter(
      (a) => a && a.nome && Number.isFinite(Number(a.lat)) && Number.isFinite(Number(a.lng))
    );

    const basePois = (state.cityData?.pois || [])
      .filter((p) => p && CATEGORIES[p.categoria] && p.categoria !== "referencia")
      .map((p) => ({ ...p, source: "botucatu" }));
    const extraPois = Array.isArray(feed.pontos_extras)
      ? feed.pontos_extras
          .filter(
            (p) =>
              p &&
              p.nome &&
              normalizeText(p.categoria) !== "ciclovia" &&
              Number.isFinite(Number(p.lat)) &&
              Number.isFinite(Number(p.lng))
          )
          .map((p, idx) => ({
            id: p.id || `extra-${idx}`,
            nome: p.nome,
            categoria: CATEGORIES[p.categoria] && p.categoria !== "referencia" ? p.categoria : "parque",
            lat: Number(p.lat),
            lng: Number(p.lng),
            detalhe: p.detalhe || "Adicionado via JSON",
            source: "extra",
          }))
      : [];

    state.allPois = [...basePois, ...extraPois];

    state.houses = feed.casas.map((raw, i) => {
      const finalidadeNorm =
        normalizeText(raw.finalidade).includes("comp") || normalizeText(raw.finalidade).includes("vend")
          ? "compra"
          : "aluguel";
      const coords = resolveHouseCoords(raw, i);
      const id = String(raw.id || `imovel-${i + 1}-${hashString(raw.titulo || String(i))}`);
      const isFotoUrl = (s) =>
        /^https?:\/\//i.test(s) || /^(?:\.\/)?assets\//i.test(s);
      const rawFotos = Array.isArray(raw.fotos)
        ? raw.fotos
        : typeof raw.foto === "string"
        ? [raw.foto]
        : typeof raw.imagem === "string"
        ? [raw.imagem]
        : [];
      const fotosClean = [
        ...new Set(
          rawFotos
            .filter((u) => typeof u === "string" && isFotoUrl(u.trim()))
            .map((u) => u.trim())
        ),
      ];
      const isChacara = Boolean(raw.chacara);
      const isNova = typeof raw.nova === "boolean" ? raw.nova : normalizeText(raw.nova) === "true";

      const house = {
        id,
        titulo: String(raw.titulo || `Imóvel em ${raw.bairro || "Botucatu"}`),
        finalidade: finalidadeNorm,
        tipo: String(raw.tipo || (isChacara ? "Chácara" : "Casa")),
        preco: parseNumber(raw.preco),
        condominio: raw.condominio != null ? parseNumber(raw.condominio) : null,
        iptu: raw.iptu != null ? parseNumber(raw.iptu) : null,
        bairro: String(raw.bairro || "Botucatu"),
        endereco: String(raw.endereco || ""),
        lat: coords.lat,
        lng: coords.lng,
        approxCoords: coords.approx,
        quartos: Number(raw.quartos) || 0,
        suites: Number(raw.suites) || 0,
        banheiros: Number(raw.banheiros) || 0,
        vagas: Number(raw.vagas) || 0,
        area_m2: parseNumber(raw.area_m2),
        terreno_m2: parseNumber(raw.terreno_m2),
        chacara: isChacara,
        aceita_pets: raw.aceita_pets !== false,
        quintal: Boolean(raw.quintal),
        nova: isNova,
        destaque: Boolean(raw.destaque),
        descricao: String(raw.descricao || ""),
        nota_grokbot: String(raw.nota_grokbot || ""),
        tags: Array.isArray(raw.tags) ? raw.tags.map(String) : [],
        fotos: fotosClean,
        link: typeof raw.link === "string" ? raw.link.trim() : "",
        portal: String(raw.portal || feed.fonte || ""),
        encontrado_em: String(raw.encontrado_em || feed.atualizado_em || ""),
        rawProximidades: Array.isArray(raw.proximidades) ? raw.proximidades : [],
      };
      computeHouseProximities(house);
      return house;
    });

    const updatedLabel = formatDateShort(feed.atualizado_em);
    const countLabel = `${state.houses.length} ${state.houses.length === 1 ? "imóvel" : "imóveis"}`;
    el.feedStatusText.textContent = `${updatedLabel ? `Atualizado em ${updatedLabel} · ` : ""}${countLabel}`;

    updateSavedIndicators();

    if (state.selectedHouseId && !state.houses.some((h) => h.id === state.selectedHouseId)) {
      closeDrawer(true);
    }

    renderPoiLayers();
    applyFiltersAndRender(true);
  }

  // ==================== CRIMES ENGINE (CRIMEREPORTS STYLE) ====================

  function resolveCrimeType(rawTipo) {
    const norm = normalizeText(rawTipo || "").replace(/[\s/-]+/g, "_");
    if (!norm) return "outro";
    if (CRIME_TYPES[norm]) return norm;

    const text = normalizeText(rawTipo || "");
    if (/\b(homicidio|latrocinio|feminicidio|assassinato|execucao|cadaver|morte violenta|tentativa de homicidio)\b/.test(text)) {
      return "homicidio";
    }
    if (/\b(maria da penha|violencia domestica|medida protetiva|domestica)\b/.test(text)) {
      return "violencia_domestica";
    }
    if (/\b(estupro|sexual|importunacao|assedio|abuso|ato obsceno)\b/.test(text)) {
      return "violencia_sexual";
    }
    if (/\b(veiculo|carro|moto|motocicleta|caminhonete|automovel|caminhao)\b/.test(text)) {
      return "veiculo";
    }
    if (/\b(invasao|arrombamento|burglary|residencia|domiciliar|violacao de domicilio)\b/.test(text)) {
      return "invasao";
    }
    if (/\b(roubo|assalto|arrastao|sequestro|mao armada)\b/.test(text)) {
      return "roubo";
    }
    if (/\b(furto|subtracao|larceny|theft)\b/.test(text)) {
      return "furto";
    }
    if (/\b(trafico|droga|entorpecente|cocaina|maconha|crack|biqueira|narcotic)\b/.test(text)) {
      return "trafico";
    }
    if (/\b(tiroteio|disparo|arma|armamento|municao|pistola|revolver|tiro)\b/.test(text)) {
      return "arma";
    }
    if (/\b(incendio|fogo|explosivo|arson)\b/.test(text)) {
      return "incendio";
    }
    if (/\b(vandalismo|dano|depredacao|pichacao|quebra)\b/.test(text)) {
      return "vandalismo";
    }
    if (/\b(estelionato|golpe|fraude|extorsao|falsificacao)\b/.test(text)) {
      return "estelionato";
    }
    if (/\b(agressao|lesao corporal|espancamento|esfaqueamento|briga|ameaca|vias de fato|violencia)\b/.test(text)) {
      return "agressao";
    }
    if (/\b(operacao|prisao|mandado|foragido|captura|flagrante|receptacao|policial)\b/.test(text)) {
      return "operacao_policial";
    }
    return "outro";
  }

  function resolveCrimeCoords(raw, index) {
    const rawLat = Number(raw.lat);
    const rawLng = Number(raw.lng);
    const hasValidCoords =
      Number.isFinite(rawLat) && Number.isFinite(rawLng) && rawLat !== 0 && rawLng !== 0;

    if (hasValidCoords) {
      const precNorm = normalizeText(raw.precisao || "");
      const precisao = precNorm === "rua" ? "rua" : precNorm === "bairro" ? "bairro" : raw.endereco ? "rua" : "bairro";
      return { lat: rawLat, lng: rawLng, precisao };
    }

    const bairros = state.cityData?.bairros || {};
    const bairroKey = normalizeText(raw.bairro || "");
    const cidadeKey = normalizeText(raw.cidade || "");
    let match = bairros[bairroKey] || bairros[cidadeKey];
    if (!match && bairroKey) {
      const k = Object.keys(bairros).find((key) => bairroKey.includes(key) || key.includes(bairroKey));
      if (k) match = bairros[k];
    }
    if (!match && cidadeKey) {
      const k = Object.keys(bairros).find((key) => cidadeKey.includes(key) || key.includes(cidadeKey));
      if (k) match = bairros[k];
    }
    const base = match || state.cityData?.centro || { lat: -22.8858, lng: -48.4450 };
    const seed = hashString(`crime-${raw.id || raw.titulo || index}`);
    const angle = (seed % 360) * (Math.PI / 180);
    const dist = 0.0009 + (seed % 5) * 0.00025;
    return {
      lat: Number((base.lat + Math.sin(angle) * dist).toFixed(5)),
      lng: Number((base.lng + Math.cos(angle) * dist).toFixed(5)),
      precisao: "bairro",
    };
  }

  function parseCrimeDateMs(dateStr) {
    if (!dateStr) return 0;
    const s = String(dateStr).trim();
    const iso = /^\d{4}-\d{2}-\d{2}$/.test(s) ? `${s}T12:00:00-03:00` : s;
    const t = Date.parse(iso);
    return Number.isFinite(t) ? t : 0;
  }

  function formatCrimeDate(dateStr) {
    if (!dateStr) return "";
    const ms = parseCrimeDateMs(dateStr);
    if (!ms) return String(dateStr);
    return new Date(ms).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function ingestCrimes(rawData) {
    if (!rawData) {
      state.crimesFeed = null;
      state.crimes = [];
      return;
    }

    const list = Array.isArray(rawData)
      ? rawData
      : Array.isArray(rawData.ocorrencias)
      ? rawData.ocorrencias
      : Array.isArray(rawData.crimes)
      ? rawData.crimes
      : [];

    state.crimesFeed = Array.isArray(rawData) ? null : rawData;

    const normalized = list
      .filter((item) => item && typeof item === "object")
      .map((raw, idx) => {
        const tipo = resolveCrimeType(raw.tipo);
        const coords = resolveCrimeCoords(raw, idx);
        const linkRaw = typeof raw.link === "string" ? raw.link.trim() : "";
        const link = /^https?:\/\//i.test(linkRaw) ? linkRaw : "";
        const dataStr = String(raw.data || "").trim();
        const dateMs = parseCrimeDateMs(dataStr);
        const id = String(raw.id || `crime-${idx + 1}-${hashString(`${raw.titulo || tipo}-${dataStr}`)}`);

        return {
          id,
          data: dataStr,
          dateMs,
          tipo,
          tipoOriginal: String(raw.tipo || ""),
          titulo: String(raw.titulo || CRIME_TYPES[tipo].label),
          cidade: String(raw.cidade || "Botucatu"),
          bairro: String(raw.bairro || ""),
          endereco: String(raw.endereco || ""),
          lat: coords.lat,
          lng: coords.lng,
          displayLat: coords.lat,
          displayLng: coords.lng,
          precisao: coords.precisao,
          fonte: String(raw.fonte || state.crimesFeed?.fonte || ""),
          link,
          descricao: String(raw.descricao || raw.resumo || ""),
        };
      });

    normalized.sort((a, b) => (b.dateMs || 0) - (a.dateMs || 0));

    // Gently spiral-offset crimes that share virtually identical coordinates (e.g. precisao="bairro") so every pin is clickable
    const buckets = new Map();
    for (const c of normalized) {
      const key = `${c.lat.toFixed(4)},${c.lng.toFixed(4)}`;
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(c);
    }
    for (const group of buckets.values()) {
      if (group.length <= 1) continue;
      group.forEach((c, i) => {
        if (i === 0) return;
        const angle = (i * 137.508 * Math.PI) / 180;
        const radius = 0.00038 + Math.floor(i / 6) * 0.00028;
        c.displayLat = Number((c.lat + Math.sin(angle) * radius).toFixed(5));
        c.displayLng = Number((c.lng + Math.cos(angle) * radius).toFixed(5));
      });
    }

    state.crimes = normalized;
  }

  const CRIME_PERIOD_OPTIONS = [
    { value: "0", label: "Todos" },
    { value: "1", label: "Hoje" },
    { value: "3", label: "3 dias" },
    { value: "7", label: "7 dias" },
    { value: "15", label: "15 dias" },
    { value: "30", label: "30 dias" },
    { value: "90", label: "90 dias" },
    { value: "365", label: "1 ano" },
    { value: "custom", label: "Período" },
  ];

  function formatRelativeCrimeDate(dateStr) {
    const ms = parseCrimeDateMs(dateStr);
    if (!ms) return "";
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const diffDays = Math.round((today.getTime() - ms) / 86400000);
    if (diffDays <= 0) return "hoje";
    if (diffDays === 1) return "ontem";
    if (diffDays < 30) return `há ${diffDays} dias`;
    const months = Math.floor(diffDays / 30);
    return months === 1 ? "há 1 mês" : `há ${months} meses`;
  }

  function getCrimesMatchingPeriod() {
    if (state.crimePeriodDays === "custom") {
      const from = state.crimeDateFrom;
      const to = state.crimeDateTo;
      if (!from && !to) return state.crimes;
      return state.crimes.filter((c) => {
        if (!c.data) return false;
        if (from && c.data < from) return false;
        if (to && c.data > to) return false;
        return true;
      });
    }
    const days = Number(state.crimePeriodDays) || 0;
    if (!days) return state.crimes;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const cutoff = startOfToday.getTime() - (days - 1) * 86400000;
    return state.crimes.filter((c) => c.dateMs && c.dateMs >= cutoff);
  }

  function getFilteredCrimes({ ignoreTypes = false } = {}) {
    const q = normalizeText(state.crimeQuery);
    const selectedHouse = state.selectedHouseId
      ? state.houses.find((h) => h.id === state.selectedHouseId)
      : null;

    const list = getCrimesMatchingPeriod().filter((c) => {
      if (!ignoreTypes && !state.activeCrimeTypes.has(c.tipo)) return false;
      if (state.crimePrecisao !== "todas" && c.precisao !== state.crimePrecisao) return false;
      if (q) {
        const ct = CRIME_TYPES[c.tipo] || CRIME_TYPES.outro;
        const hay = normalizeText(
          `${c.titulo} ${c.bairro} ${c.endereco} ${c.cidade} ${c.fonte} ${c.descricao} ${ct.label} ${ct.short} ${c.tipoOriginal} ${c.data}`
        );
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    list.sort((a, b) => {
      if (state.crimeSort === "antigo") return (a.dateMs || 0) - (b.dateMs || 0);
      if (state.crimeSort === "tipo") {
        const la = (CRIME_TYPES[a.tipo] || CRIME_TYPES.outro).label;
        const lb = (CRIME_TYPES[b.tipo] || CRIME_TYPES.outro).label;
        const cmp = la.localeCompare(lb, "pt-BR");
        return cmp !== 0 ? cmp : (b.dateMs || 0) - (a.dateMs || 0);
      }
      if (state.crimeSort === "bairro") {
        const cmp = (a.bairro || "").localeCompare(b.bairro || "", "pt-BR");
        return cmp !== 0 ? cmp : (b.dateMs || 0) - (a.dateMs || 0);
      }
      if (state.crimeSort === "perto" && selectedHouse) {
        const da = haversine(selectedHouse.lat, selectedHouse.lng, a.lat, a.lng);
        const db = haversine(selectedHouse.lat, selectedHouse.lng, b.lat, b.lng);
        return da - db;
      }
      return (b.dateMs || 0) - (a.dateMs || 0);
    });

    return list;
  }

  function getVisibleCrimes() {
    return getFilteredCrimes();
  }

  // ==================== TRAFFIC ACCIDENTS ENGINE ====================

  function resolveTrafficType(rawTipo) {
    const norm = normalizeText(rawTipo || "").replace(/[\s/-]+/g, "_");
    if (!norm) return "outro";
    if (TRAFFIC_TYPES[norm]) return norm;

    const text = normalizeText(rawTipo || "");
    if (/\b(fatal|morte|obito|morre|morreu|vitima fatal)\b/.test(text)) return "fatal";
    if (/\b(atropelamento|atropela|pedestre)\b/.test(text)) return "atropelamento";
    if (/\b(ciclista|bicicleta|bike|patinete|ciclovia)\b/.test(text)) return "ciclista";
    if (/\b(embriaguez|alcool|bafometro|embriagado|racha|direcao perigosa|fuga)\b/.test(text)) return "embriaguez";
    if (/\b(capotamento|capota|tombamento|tomba|saida de pista|ribanceira)\b/.test(text)) return "capotamento";
    if (/\b(onibus|caminhao|carreta|bi-trem|bitrem|pesado|van escolar)\b/.test(text)) return "onibus_caminhao";
    if (/\b(moto|motocicleta|motoneta|motoboy|motociclista)\b/.test(text)) return "moto";
    if (/\b(rodovia|estrada|trevo|contorno|anel viario|vicinal|sp-\d+|br-\d+|pr-\d+)\b/.test(text)) return "rodovia";
    if (/\b(colisao|batida|engavetamento|choque|abalroamento|cruzamento)\b/.test(text)) return "colisao";
    return "outro";
  }

  function resolveTrafficGravidade(rawGrav, resolvedTipo) {
    const g = normalizeText(rawGrav || "").replace(/[\s-]+/g, "_");
    if (TRAFFIC_GRAVIDADE_LABELS[g]) return g;
    if (g.includes("fatal") || g.includes("morte") || g.includes("obito")) return "fatal";
    if (g.includes("grave")) return "grave";
    if (g.includes("leve") || g.includes("ferido")) return "leve";
    if (g.includes("sem") || g.includes("material") || g.includes("dano")) return "sem_vitimas";
    return resolvedTipo === "fatal" ? "fatal" : "";
  }

  function ingestTraffic(rawData) {
    if (!rawData) {
      state.trafficFeed = null;
      state.traffic = [];
      return;
    }

    const list = Array.isArray(rawData)
      ? rawData
      : Array.isArray(rawData.ocorrencias)
      ? rawData.ocorrencias
      : Array.isArray(rawData.acidentes)
      ? rawData.acidentes
      : [];

    state.trafficFeed = Array.isArray(rawData) ? null : rawData;

    const normalized = list
      .filter((item) => item && typeof item === "object")
      .map((raw, idx) => {
        const tipo = resolveTrafficType(raw.tipo);
        const coords = resolveCrimeCoords(raw, idx + 10000);
        const linkRaw = typeof raw.link === "string" ? raw.link.trim() : "";
        const link = /^https?:\/\//i.test(linkRaw) ? linkRaw : "";
        const dataStr = String(raw.data || "").trim();
        const dateMs = parseCrimeDateMs(dataStr);
        const id = String(raw.id || `transito-${idx + 1}-${hashString(`${raw.titulo || tipo}-${dataStr}`)}`);

        return {
          id,
          data: dataStr,
          dateMs,
          tipo,
          tipoOriginal: String(raw.tipo || ""),
          gravidade: resolveTrafficGravidade(raw.gravidade, tipo),
          titulo: String(raw.titulo || TRAFFIC_TYPES[tipo].label),
          cidade: String(raw.cidade || "Botucatu"),
          bairro: String(raw.bairro || ""),
          endereco: String(raw.endereco || ""),
          lat: coords.lat,
          lng: coords.lng,
          displayLat: coords.lat,
          displayLng: coords.lng,
          precisao: coords.precisao,
          fonte: String(raw.fonte || state.trafficFeed?.fonte || ""),
          link,
          descricao: String(raw.descricao || raw.resumo || ""),
        };
      });

    normalized.sort((a, b) => (b.dateMs || 0) - (a.dateMs || 0));

    const buckets = new Map();
    for (const t of normalized) {
      const key = `${t.lat.toFixed(4)},${t.lng.toFixed(4)}`;
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(t);
    }
    for (const group of buckets.values()) {
      if (group.length <= 1) continue;
      group.forEach((t, i) => {
        if (i === 0) return;
        const angle = ((i * 137.508 + 45) * Math.PI) / 180;
        const radius = 0.00038 + Math.floor(i / 6) * 0.00028;
        t.displayLat = Number((t.lat + Math.sin(angle) * radius).toFixed(5));
        t.displayLng = Number((t.lng + Math.cos(angle) * radius).toFixed(5));
      });
    }

    state.traffic = normalized;
  }

  function getTrafficMatchingPeriod() {
    if (state.trafficPeriodDays === "custom") {
      const from = state.trafficDateFrom;
      const to = state.trafficDateTo;
      if (!from && !to) return state.traffic;
      return state.traffic.filter((t) => {
        if (!t.data) return false;
        if (from && t.data < from) return false;
        if (to && t.data > to) return false;
        return true;
      });
    }
    const days = Number(state.trafficPeriodDays) || 0;
    if (!days) return state.traffic;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const cutoff = startOfToday.getTime() - (days - 1) * 86400000;
    return state.traffic.filter((t) => t.dateMs && t.dateMs >= cutoff);
  }

  function getFilteredTraffic({ ignoreTypes = false } = {}) {
    const q = normalizeText(state.trafficQuery);
    const selectedHouse = state.selectedHouseId
      ? state.houses.find((h) => h.id === state.selectedHouseId)
      : null;

    const list = getTrafficMatchingPeriod().filter((t) => {
      if (!ignoreTypes && !state.activeTrafficTypes.has(t.tipo)) return false;
      if (state.trafficPrecisao !== "todas" && t.precisao !== state.trafficPrecisao) return false;
      if (q) {
        const tt = TRAFFIC_TYPES[t.tipo] || TRAFFIC_TYPES.outro;
        const gravLabel = TRAFFIC_GRAVIDADE_LABELS[t.gravidade] || "";
        const hay = normalizeText(
          `${t.titulo} ${t.bairro} ${t.endereco} ${t.cidade} ${t.fonte} ${t.descricao} ${tt.label} ${tt.short} ${t.tipoOriginal} ${gravLabel} ${t.data}`
        );
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    list.sort((a, b) => {
      if (state.trafficSort === "antigo") return (a.dateMs || 0) - (b.dateMs || 0);
      if (state.trafficSort === "tipo") {
        const la = (TRAFFIC_TYPES[a.tipo] || TRAFFIC_TYPES.outro).label;
        const lb = (TRAFFIC_TYPES[b.tipo] || TRAFFIC_TYPES.outro).label;
        const cmp = la.localeCompare(lb, "pt-BR");
        return cmp !== 0 ? cmp : (b.dateMs || 0) - (a.dateMs || 0);
      }
      if (state.trafficSort === "bairro") {
        const cmp = (a.bairro || "").localeCompare(b.bairro || "", "pt-BR");
        return cmp !== 0 ? cmp : (b.dateMs || 0) - (a.dateMs || 0);
      }
      if (state.trafficSort === "perto" && selectedHouse) {
        const da = haversine(selectedHouse.lat, selectedHouse.lng, a.lat, a.lng);
        const db = haversine(selectedHouse.lat, selectedHouse.lng, b.lat, b.lng);
        return da - db;
      }
      return (b.dateMs || 0) - (a.dateMs || 0);
    });

    return list;
  }

  function getVisibleTraffic() {
    return getFilteredTraffic();
  }

  function countActiveTrafficFilters() {
    let n = 0;
    if (String(state.trafficPeriodDays) !== "0") n++;
    if (state.trafficQuery.trim()) n++;
    if (state.trafficPrecisao !== "todas") n++;
    if (state.activeTrafficTypes.size < Object.keys(TRAFFIC_TYPES).length) n++;
    return n;
  }

  function countActiveCrimeFilters() {
    let n = 0;
    if (String(state.crimePeriodDays) !== "0") n++;
    if (state.crimeQuery.trim()) n++;
    if (state.crimePrecisao !== "todas") n++;
    if (state.activeCrimeTypes.size < Object.keys(CRIME_TYPES).length) n++;
    return n;
  }

  function syncCrimeBadges() {
    const visibleCrimes = getVisibleCrimes().length;
    const visibleTraffic = getVisibleTraffic().length;
    const totalAlerts = visibleCrimes + visibleTraffic;
    const hasAlerts = state.crimes.length > 0 || state.traffic.length > 0;
    const reportOpen = isCrimeReportOpen();

    if (el.navCrimesCount) {
      el.navCrimesCount.textContent = String(totalAlerts);
      el.navCrimesCount.hidden = !hasAlerts;
    }
    if (el.headerCrimeCount) {
      el.headerCrimeCount.textContent = String(visibleCrimes);
      el.headerCrimeCount.hidden = state.crimes.length === 0;
    }
    if (el.headerTrafficCount) {
      el.headerTrafficCount.textContent = String(visibleTraffic);
      el.headerTrafficCount.hidden = state.traffic.length === 0;
    }
    if (el.openCrimeReportBtn) {
      const active = reportOpen && state.reportKind === "crimes";
      el.openCrimeReportBtn.classList.toggle("is-active", active);
      el.openCrimeReportBtn.setAttribute("aria-pressed", String(active));
    }
    if (el.openTrafficReportBtn) {
      const active = reportOpen && state.reportKind === "transito";
      el.openTrafficReportBtn.classList.toggle("is-active", active);
      el.openTrafficReportBtn.setAttribute("aria-pressed", String(active));
    }
  }

  function refreshCrimeViews() {
    syncCrimeBadges();
    renderPoiCategoryDock();
    renderCrimeLayer();
    renderTrafficLayer();
    renderCrimeLegendPanel();
    updateCrimeReportContent();
    if (state.selectedHouseId && state.drawerOpen) {
      const house = state.houses.find((h) => h.id === state.selectedHouseId);
      if (house) renderDetailDrawer(house);
    }
  }

  function resetActiveReportFilters() {
    if (state.reportKind === "transito") {
      state.trafficPeriodDays = 0;
      state.trafficDateFrom = "";
      state.trafficDateTo = "";
      state.trafficQuery = "";
      state.trafficPrecisao = "todas";
      state.trafficSort = "recente";
      state.activeTrafficTypes = new Set(Object.keys(TRAFFIC_TYPES));
    } else {
      state.crimePeriodDays = 0;
      state.crimeDateFrom = "";
      state.crimeDateTo = "";
      state.crimeQuery = "";
      state.crimePrecisao = "todas";
      state.crimeSort = "recente";
      state.activeCrimeTypes = new Set(Object.keys(CRIME_TYPES));
    }
    syncReportInputsFromState();
    refreshCrimeViews();
  }

  function syncReportInputsFromState() {
    const isTraffic = state.reportKind === "transito";
    const searchEl = document.getElementById("crimeSearchInput");
    if (searchEl) searchEl.value = isTraffic ? state.trafficQuery : state.crimeQuery;
    const fromEl = document.getElementById("crimeDateFromInput");
    if (fromEl) fromEl.value = isTraffic ? state.trafficDateFrom : state.crimeDateFrom;
    const toEl = document.getElementById("crimeDateToInput");
    if (toEl) toEl.value = isTraffic ? state.trafficDateTo : state.crimeDateTo;
  }

  function isCrimeReportOpen() {
    return isDesktop() ? state.sidebarMode === "crimes" : state.activeTab === "crimes";
  }

  function openCrimeReport(kind = null) {
    if (kind === "crimes" || kind === "transito") {
      state.reportKind = kind;
    }
    state.crimeLegendOpen = false;
    if (state.reportKind === "transito") state.showTraffic = true;
    else state.showCrimes = true;

    if (state.drawerOpen) closeDrawer(false);
    if (isDesktop()) {
      state.sidebarMode = "crimes";
      document.body.dataset.sidebarMode = "crimes";
    } else {
      state.activeTab = "crimes";
      document.body.dataset.tab = "crimes";
      document.querySelectorAll("[data-nav-tab]").forEach((btn) => {
        btn.classList.toggle("is-active", btn.dataset.navTab === "crimes");
      });
    }
    renderCrimeReport();
    syncReportInputsFromState();
    refreshCrimeViews();
  }

  function closeCrimeReport() {
    if (isDesktop()) {
      state.sidebarMode = "imoveis";
      document.body.dataset.sidebarMode = "imoveis";
      syncCrimeBadges();
      renderPoiCategoryDock();
    } else {
      switchMobileTab("mapa");
    }
  }

  function focusCrimeOnMap(crimeId) {
    const crime = state.crimes.find((c) => c.id === crimeId);
    if (!crime) return;
    if (!state.showCrimes || !state.activeCrimeTypes.has(crime.tipo)) {
      state.showCrimes = true;
      state.activeCrimeTypes.add(crime.tipo);
      refreshCrimeViews();
    }
    if (!isDesktop()) {
      switchMobileTab("mapa");
    }
    if (map) {
      map.flyTo([crime.displayLat, crime.displayLng], Math.max(map.getZoom(), 15), { duration: 0.5 });
      const entry = crimeMarkers.get(crime.id);
      if (entry) setTimeout(() => entry.marker.openPopup(), 420);
    }
  }

  function focusTrafficOnMap(trafficId) {
    const item = state.traffic.find((t) => t.id === trafficId);
    if (!item) return;
    if (!state.showTraffic || !state.activeTrafficTypes.has(item.tipo)) {
      state.showTraffic = true;
      state.activeTrafficTypes.add(item.tipo);
      refreshCrimeViews();
    }
    if (!isDesktop()) {
      switchMobileTab("mapa");
    }
    if (map) {
      map.flyTo([item.displayLat, item.displayLng], Math.max(map.getZoom(), 15), { duration: 0.5 });
      const entry = trafficMarkers.get(item.id);
      if (entry) setTimeout(() => entry.marker.openPopup(), 420);
    }
  }

  let crimeReportShellReady = false;
  function renderCrimeReport() {
    if (!el.crimeReportView) return;
    if (!crimeReportShellReady) {
      el.crimeReportView.innerHTML = `
        <div class="crime-report__head">
          <div class="crime-report__head-top">
            <div class="crime-report__title-wrap">
              <h2>
                <span class="crime-report__title-ico" id="crimeReportTitleIco">${UI_ICONS.shieldAlert}</span>
                <span id="crimeReportTitleText">Relatório de Crimes</span>
              </h2>
              <p id="crimeReportSubtitle">Carregando ocorrências…</p>
            </div>
            <button type="button" class="crime-report__back-btn" id="crimeReportBackBtn">← Imóveis</button>
          </div>

          <div class="report-mode-switch" role="tablist" aria-label="Tipo de relatório">
            <button type="button" class="report-mode-tab is-active" data-report-kind="crimes" role="tab" aria-selected="true">
              ${UI_ICONS.shieldAlert}
              <span>Crimes</span>
              <span class="report-mode-tab__cnt" id="reportTabCrimesCnt">0</span>
            </button>
            <button type="button" class="report-mode-tab" data-report-kind="transito" role="tab" aria-selected="false">
              ${UI_ICONS.trafficAlert}
              <span>Trânsito</span>
              <span class="report-mode-tab__cnt" id="reportTabTrafficCnt">0</span>
            </button>
          </div>

          <div class="crime-hidden-banner" id="crimeHiddenMapBanner" hidden>
            <span id="crimeHiddenMapText">Os pinos estão ocultos no mapa</span>
            <button type="button" id="crimeShowOnMapBtn">Mostrar no mapa</button>
          </div>

          <label class="crime-searchbox" aria-label="Buscar por bairro, rua, título ou fonte">
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.9"/>
              <path d="M13.5 13.5L17 17" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/>
            </svg>
            <input id="crimeSearchInput" type="search" placeholder="Bairro, rua, título, fonte…" autocomplete="off" enterkeyhint="search">
            <button id="clearCrimeSearchBtn" class="crime-searchbox__clear" type="button" hidden aria-label="Limpar busca">×</button>
          </label>

          <div class="crime-report__filter-block">
            <div class="crime-report__filter-head">
              <span>Período / Data</span>
            </div>
            <div class="crime-date-chips" id="crimeDateChips" role="group" aria-label="Filtrar por data">
              ${CRIME_PERIOD_OPTIONS.map(
                (opt) =>
                  `<button type="button" class="crime-date-chip" data-report-period="${opt.value}">${opt.label}</button>`
              ).join("")}
            </div>
            <div class="crime-date-range" id="crimeDateRangeBox" hidden>
              <label>
                <span>De</span>
                <input type="date" id="crimeDateFromInput">
              </label>
              <label>
                <span>Até</span>
                <input type="date" id="crimeDateToInput">
              </label>
            </div>
          </div>

          <div class="crime-report__filter-block">
            <div class="crime-report__filter-head">
              <span id="crimeReportTypesLabel">Tipos de crime (CrimeReports)</span>
              <span class="crime-report__filter-links">
                <button type="button" id="reportCrimeAllTypesBtn">Todos</button>
                <button type="button" id="reportCrimeClearTypesBtn">Nenhum</button>
                <button type="button" id="reportCrimeExpandTypesBtn">Ver 15 ▾</button>
              </span>
            </div>
            <div class="crime-type-chips" id="crimeReportTypeChips" role="group" aria-label="Filtrar por tipo"></div>
          </div>

          <div class="crime-report__controls-row">
            <div class="segmented" role="group" aria-label="Precisão do local">
              <button type="button" class="segmented__btn is-active" data-crime-prec="todas">Todas</button>
              <button type="button" class="segmented__btn" data-crime-prec="rua">Rua</button>
              <button type="button" class="segmented__btn" data-crime-prec="bairro">Bairro</button>
            </div>
            <select id="crimeSortSelect" class="select-pill" aria-label="Ordenar ocorrências">
              <option value="recente">Mais recentes</option>
              <option value="antigo">Mais antigas</option>
              <option value="tipo">Tipo</option>
              <option value="bairro">Bairro (A–Z)</option>
              <option value="perto">Perto do imóvel</option>
            </select>
          </div>

          <div class="crime-report__meta">
            <span id="crimeReportMetaCount">0 ocorrências</span>
            <button type="button" class="link-btn" id="resetCrimeFiltersBtn" hidden>Limpar filtros</button>
          </div>
        </div>

        <div class="crime-report__summary" id="crimeReportSummary" hidden></div>
        <div class="crime-report__list" id="crimeReportList" role="list"></div>
      `;

      document.getElementById("crimeReportBackBtn").addEventListener("click", closeCrimeReport);
      document.getElementById("crimeShowOnMapBtn").addEventListener("click", () => {
        if (state.reportKind === "transito") state.showTraffic = true;
        else state.showCrimes = true;
        refreshCrimeViews();
      });

      el.crimeReportView.querySelectorAll("[data-report-kind]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const kind = btn.dataset.reportKind;
          if (kind === state.reportKind) return;
          state.reportKind = kind;
          syncReportInputsFromState();
          refreshCrimeViews();
        });
      });

      const searchInput = document.getElementById("crimeSearchInput");
      const clearSearchBtn = document.getElementById("clearCrimeSearchBtn");
      searchInput.addEventListener("input", () => {
        if (state.reportKind === "transito") state.trafficQuery = searchInput.value;
        else state.crimeQuery = searchInput.value;
        clearSearchBtn.hidden = !searchInput.value;
        refreshCrimeViews();
      });
      clearSearchBtn.addEventListener("click", () => {
        searchInput.value = "";
        if (state.reportKind === "transito") state.trafficQuery = "";
        else state.crimeQuery = "";
        clearSearchBtn.hidden = true;
        refreshCrimeViews();
      });

      el.crimeReportView.querySelectorAll("[data-report-period]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const val = btn.dataset.reportPeriod;
          const parsed = val === "custom" ? "custom" : Number(val) || 0;
          if (state.reportKind === "transito") state.trafficPeriodDays = parsed;
          else state.crimePeriodDays = parsed;
          refreshCrimeViews();
        });
      });

      const fromInput = document.getElementById("crimeDateFromInput");
      const toInput = document.getElementById("crimeDateToInput");
      fromInput.addEventListener("change", () => {
        if (state.reportKind === "transito") {
          state.trafficDateFrom = fromInput.value;
          state.trafficPeriodDays = "custom";
        } else {
          state.crimeDateFrom = fromInput.value;
          state.crimePeriodDays = "custom";
        }
        refreshCrimeViews();
      });
      toInput.addEventListener("change", () => {
        if (state.reportKind === "transito") {
          state.trafficDateTo = toInput.value;
          state.trafficPeriodDays = "custom";
        } else {
          state.crimeDateTo = toInput.value;
          state.crimePeriodDays = "custom";
        }
        refreshCrimeViews();
      });

      document.getElementById("reportCrimeAllTypesBtn").addEventListener("click", () => {
        if (state.reportKind === "transito") state.activeTrafficTypes = new Set(Object.keys(TRAFFIC_TYPES));
        else state.activeCrimeTypes = new Set(Object.keys(CRIME_TYPES));
        refreshCrimeViews();
      });
      document.getElementById("reportCrimeClearTypesBtn").addEventListener("click", () => {
        if (state.reportKind === "transito") state.activeTrafficTypes.clear();
        else state.activeCrimeTypes.clear();
        refreshCrimeViews();
      });
      document.getElementById("reportCrimeExpandTypesBtn").addEventListener("click", () => {
        if (state.reportKind === "transito") state.trafficTypesExpanded = !state.trafficTypesExpanded;
        else state.crimeTypesExpanded = !state.crimeTypesExpanded;
        updateCrimeReportContent();
      });

      el.crimeReportView.querySelectorAll("[data-crime-prec]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (state.reportKind === "transito") state.trafficPrecisao = btn.dataset.crimePrec;
          else state.crimePrecisao = btn.dataset.crimePrec;
          refreshCrimeViews();
        });
      });

      const sortSelect = document.getElementById("crimeSortSelect");
      sortSelect.addEventListener("change", () => {
        if (state.reportKind === "transito") state.trafficSort = sortSelect.value;
        else state.crimeSort = sortSelect.value;
        refreshCrimeViews();
      });

      document.getElementById("resetCrimeFiltersBtn").addEventListener("click", resetActiveReportFilters);
      crimeReportShellReady = true;
    }

    updateCrimeReportContent();
  }

  function updateCrimeReportContent() {
    if (!crimeReportShellReady || !el.crimeReportView) return;

    const isTraffic = state.reportKind === "transito";
    el.crimeReportView.classList.toggle("crime-report--traffic", isTraffic);

    const catalog = isTraffic ? TRAFFIC_TYPES : CRIME_TYPES;
    const allItems = isTraffic ? state.traffic : state.crimes;
    const feedMeta = isTraffic ? state.trafficFeed : state.crimesFeed;
    const activeTypes = isTraffic ? state.activeTrafficTypes : state.activeCrimeTypes;
    const periodVal = isTraffic ? state.trafficPeriodDays : state.crimePeriodDays;
    const queryVal = isTraffic ? state.trafficQuery : state.crimeQuery;
    const precVal = isTraffic ? state.trafficPrecisao : state.crimePrecisao;
    const sortVal = isTraffic ? state.trafficSort : state.crimeSort;
    const expanded = isTraffic ? state.trafficTypesExpanded : state.crimeTypesExpanded;
    const showOnMap = isTraffic ? state.showTraffic : state.showCrimes;

    const filtered = isTraffic ? getFilteredTraffic() : getFilteredCrimes();
    const baseWithoutTypes = isTraffic
      ? getFilteredTraffic({ ignoreTypes: true })
      : getFilteredCrimes({ ignoreTypes: true });
    const countsByType = {};
    for (const item of baseWithoutTypes) {
      countsByType[item.tipo] = (countsByType[item.tipo] || 0) + 1;
    }

    const titleIcoEl = document.getElementById("crimeReportTitleIco");
    if (titleIcoEl) titleIcoEl.innerHTML = isTraffic ? UI_ICONS.trafficAlert : UI_ICONS.shieldAlert;
    const titleTextEl = document.getElementById("crimeReportTitleText");
    if (titleTextEl) titleTextEl.textContent = isTraffic ? "Acidentes de Trânsito" : "Relatório de Crimes";

    const tabCrimesCnt = document.getElementById("reportTabCrimesCnt");
    if (tabCrimesCnt) tabCrimesCnt.textContent = String(getVisibleCrimes().length);
    const tabTrafficCnt = document.getElementById("reportTabTrafficCnt");
    if (tabTrafficCnt) tabTrafficCnt.textContent = String(getVisibleTraffic().length);

    el.crimeReportView.querySelectorAll("[data-report-kind]").forEach((btn) => {
      const on = btn.dataset.reportKind === state.reportKind;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-selected", String(on));
    });

    const updatedLabel = feedMeta?.atualizado_em ? formatDateShort(feedMeta.atualizado_em) : "";
    const subEl = document.getElementById("crimeReportSubtitle");
    if (subEl) {
      const fileLabel = isTraffic ? "data/transito.json" : "data/crimes.json";
      subEl.textContent =
        allItems.length === 0
          ? `Pronto para receber registros de ${fileLabel}`
          : `${allItems.length} ${allItems.length === 1 ? "registro total" : "registros totais"}${updatedLabel ? ` · Atualizado ${updatedLabel}` : ""}`;
    }

    const hiddenBanner = document.getElementById("crimeHiddenMapBanner");
    const hiddenText = document.getElementById("crimeHiddenMapText");
    if (hiddenBanner) hiddenBanner.hidden = showOnMap;
    if (hiddenText) {
      hiddenText.textContent = isTraffic
        ? "Pinos de acidentes estão ocultos no mapa"
        : "Pinos de crimes estão ocultos no mapa";
    }

    const searchEl = document.getElementById("crimeSearchInput");
    if (searchEl) {
      searchEl.placeholder = isTraffic
        ? "Avenida, rodovia, bairro, moto, fonte…"
        : "Bairro, rua, título, fonte…";
    }
    const clearSearchBtn = document.getElementById("clearCrimeSearchBtn");
    if (clearSearchBtn) clearSearchBtn.hidden = !queryVal;

    el.crimeReportView.querySelectorAll("[data-report-period]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.reportPeriod === String(periodVal));
    });
    const rangeBox = document.getElementById("crimeDateRangeBox");
    if (rangeBox) rangeBox.hidden = periodVal !== "custom";

    el.crimeReportView.querySelectorAll("[data-crime-prec]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.crimePrec === precVal);
    });

    const sortSelect = document.getElementById("crimeSortSelect");
    if (sortSelect) sortSelect.value = sortVal;

    const typesLabelEl = document.getElementById("crimeReportTypesLabel");
    if (typesLabelEl) {
      typesLabelEl.textContent = isTraffic ? "Tipos de acidente" : "Tipos de crime (CrimeReports)";
    }
    const totalTypesCount = Object.keys(catalog).length;
    const expandBtn = document.getElementById("reportCrimeExpandTypesBtn");
    if (expandBtn) {
      expandBtn.textContent = expanded ? "Recolher ▴" : `Ver ${totalTypesCount} ▾`;
    }

    const typesContainer = document.getElementById("crimeReportTypeChips");
    if (typesContainer) {
      typesContainer.classList.toggle("is-expanded", expanded);
      const orderedTypes = Object.values(catalog).sort((a, b) => {
        const ca = countsByType[a.id] || 0;
        const cb = countsByType[b.id] || 0;
        if (cb !== ca) return cb - ca;
        return 0;
      });
      typesContainer.innerHTML = orderedTypes
        .map((ct) => {
          const cnt = countsByType[ct.id] || 0;
          const isOn = activeTypes.has(ct.id);
          return `
            <button type="button" class="crime-type-chip ${isOn ? "" : "is-off"} ${cnt === 0 ? "is-empty" : ""}" data-report-crime-type="${ct.id}" aria-pressed="${isOn}" title="${escapeHtml(ct.label)} — ${escapeHtml(ct.short)}">
              <span class="crime-type-chip__ico" style="background:${ct.color}">${ct.icon}</span>
              <span>${escapeHtml(ct.label)}</span>
              <span class="crime-type-chip__cnt">${cnt}</span>
            </button>
          `;
        })
        .join("");

      typesContainer.querySelectorAll("[data-report-crime-type]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.dataset.reportCrimeType;
          if (activeTypes.has(id)) activeTypes.delete(id);
          else activeTypes.add(id);
          refreshCrimeViews();
        });
      });
    }

    const activeFilters = isTraffic ? countActiveTrafficFilters() : countActiveCrimeFilters();
    const singularNoun = isTraffic ? "acidente" : "ocorrência";
    const pluralNoun = isTraffic ? "acidentes" : "ocorrências";
    const metaEl = document.getElementById("crimeReportMetaCount");
    if (metaEl) {
      metaEl.textContent =
        allItems.length === 0
          ? isTraffic
            ? "Nenhum acidente cadastrado ainda"
            : "Nenhuma ocorrência cadastrada ainda"
          : filtered.length === allItems.length
          ? `${filtered.length} ${filtered.length === 1 ? singularNoun : pluralNoun} no relatório`
          : `Mostrando ${filtered.length} de ${allItems.length} ${pluralNoun}`;
    }
    const resetBtn = document.getElementById("resetCrimeFiltersBtn");
    if (resetBtn) resetBtn.hidden = activeFilters === 0;

    const summaryEl = document.getElementById("crimeReportSummary");
    if (summaryEl) {
      if (filtered.length === 0) {
        summaryEl.hidden = true;
        summaryEl.innerHTML = "";
      } else {
        const filteredCounts = {};
        for (const item of filtered) filteredCounts[item.tipo] = (filteredCounts[item.tipo] || 0) + 1;
        const topStats = Object.entries(filteredCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([tipo, count]) => {
            const ct = catalog[tipo] || catalog.outro;
            return `
              <span class="crime-stat-pill">
                <span class="crime-stat-pill__dot" style="background:${ct.color}">${ct.icon}</span>
                <span>${count} ${escapeHtml(ct.label)}</span>
              </span>
            `;
          })
          .join("");
        summaryEl.hidden = false;
        summaryEl.innerHTML = topStats;
      }
    }

    const listEl = document.getElementById("crimeReportList");
    if (!listEl) return;

    if (allItems.length === 0) {
      const fileLabel = isTraffic ? "data/transito.json" : "data/crimes.json";
      listEl.innerHTML = `
        <div class="crime-report__empty">
          <h3>${isTraffic ? "Nenhum acidente em data/transito.json" : "Nenhuma ocorrência em data/crimes.json"}</h3>
          <p>Assim que o Grokbot adicionar registros em <code>${fileLabel}</code>, eles aparecerão aqui com filtros por data, bairro e tipo.</p>
        </div>
      `;
      return;
    }

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div class="crime-report__empty">
          <h3>${isTraffic ? "Nenhum acidente com esses filtros" : "Nenhuma ocorrência com esses filtros"}</h3>
          <p>Tente ampliar o período de data (ex.: 30 dias ou Todos) ou reativar os tipos no filtro acima.</p>
          <button type="button" class="btn-primary btn-sm" id="emptyCrimeResetBtn">Limpar filtros do relatório</button>
        </div>
      `;
      const btn = document.getElementById("emptyCrimeResetBtn");
      if (btn) btn.addEventListener("click", resetActiveReportFilters);
      return;
    }

    const selectedHouse = state.selectedHouseId
      ? state.houses.find((h) => h.id === state.selectedHouseId)
      : null;

    listEl.innerHTML = filtered
      .map((item) => {
        const ct = catalog[item.tipo] || catalog.outro;
        const rel = formatRelativeCrimeDate(item.data);
        const dateLabel = item.data ? `${formatCrimeDate(item.data)}${rel ? ` · ${rel}` : ""}` : "";
        const locParts = [item.bairro, item.endereco].filter(Boolean);
        if (item.cidade && normalizeText(item.cidade) !== "botucatu") locParts.push(item.cidade);
        const precPill =
          item.precisao === "rua"
            ? `<span class="crime-prec-pill crime-prec-pill--rua">Rua</span>`
            : `<span class="crime-prec-pill crime-prec-pill--bairro">Bairro aprox.</span>`;
        const gravPill =
          isTraffic && item.gravidade && TRAFFIC_GRAVIDADE_LABELS[item.gravidade]
            ? `<span class="traffic-grav-pill traffic-grav-pill--${item.gravidade}">${TRAFFIC_GRAVIDADE_LABELS[item.gravidade]}</span>`
            : "";
        const distBadge = selectedHouse
          ? `<span>· ${formatDistance(haversine(selectedHouse.lat, selectedHouse.lng, item.lat, item.lng))} do imóvel</span>`
          : "";
        return `
          <article class="crime-card" style="--crime-color:${ct.color}" data-crime-card-id="${escapeHtml(item.id)}" role="listitem">
            <div class="crime-card__top">
              <span class="crime-card__type" style="background:${ct.color}">${ct.icon}<span>${escapeHtml(ct.label)}</span></span>
              ${dateLabel ? `<span class="crime-card__date">${escapeHtml(dateLabel)}</span>` : ""}
            </div>
            <h3 class="crime-card__title">${escapeHtml(item.titulo)}</h3>
            <p class="crime-card__loc">
              <span>${escapeHtml(locParts.join(" · ") || item.cidade || "Botucatu")}</span>
              ${gravPill}
              ${precPill}
              ${distBadge}
            </p>
            ${item.descricao ? `<p class="crime-card__desc">${escapeHtml(item.descricao)}</p>` : ""}
            <div class="crime-card__foot">
              <span class="crime-card__source">${item.fonte ? `Fonte: ${escapeHtml(item.fonte)}` : "Registro local"}</span>
              <div class="crime-card__actions">
                <button type="button" class="crime-card__btn crime-card__btn--map" data-focus-crime="${escapeHtml(item.id)}">Ver no mapa</button>
                ${
                  item.link
                    ? `<a class="crime-card__btn" href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer">Matéria ↗</a>`
                    : ""
                }
              </div>
            </div>
          </article>
        `;
      })
      .join("");

    listEl.querySelectorAll(".crime-card").forEach((card) => {
      const id = card.dataset.crimeCardId;
      const item = allItems.find((x) => x.id === id);
      card.addEventListener("click", (e) => {
        if (e.target.closest("a")) return;
        if (isTraffic) focusTrafficOnMap(id);
        else focusCrimeOnMap(id);
      });
      card.addEventListener("mouseenter", () => {
        if (!item) return;
        if (isTraffic) {
          const entry = trafficMarkers.get(id);
          if (entry) {
            const pin = entry.marker.getElement()?.querySelector(".traffic-pin");
            if (pin) pin.classList.add("is-highlighted");
          }
          if (selectedHouse) highlightRouteToTraffic(selectedHouse, item);
        } else {
          const entry = crimeMarkers.get(id);
          if (entry) {
            const pin = entry.marker.getElement()?.querySelector(".crime-pin");
            if (pin) pin.classList.add("is-highlighted");
          }
          if (selectedHouse) highlightRouteToCrime(selectedHouse, item);
        }
      });
      card.addEventListener("mouseleave", () => clearRouteHighlight());
    });
  }

  // ==================== MAP INITIALIZATION & LAYERS ====================

  function initMap() {
    const center = state.cityData?.centro || { lat: -22.8858, lng: -48.4450 };

    map = L.map("map", {
      center: [center.lat, center.lng],
      zoom: 13,
      zoomControl: false,
      preferCanvas: true,
    });

    L.control.zoom({ position: "topright" }).addTo(map);

    baseLayers = {
      clean: L.layerGroup([
        L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
          attribution: "Tiles &copy; Esri &mdash; Esri, HERE, Garmin, &copy; OpenStreetMap contributors",
          maxZoom: 19,
          maxNativeZoom: 16,
        }),
        L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}", {
          maxZoom: 19,
          maxNativeZoom: 16,
        }),
      ]),
      streets: L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }),
      satellite: L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "Tiles &copy; Esri",
          maxZoom: 19,
        }
      ),
    };

    currentBaseLayer = baseLayers.clean.addTo(map);

    selectionLayer = L.layerGroup().addTo(map);
    routeHighlightLayer = L.layerGroup().addTo(map);
    poiLayer = L.layerGroup().addTo(map);
    crimeLayer = L.layerGroup().addTo(map);
    trafficLayer = L.layerGroup().addTo(map);
    referenciaLayer = L.layerGroup().addTo(map);
    houseLayer = L.layerGroup().addTo(map);

    map.on("click", () => {
      clearRouteHighlight();
    });
  }

  function setBasemap(name) {
    if (!baseLayers[name] || name === state.basemap) return;
    state.basemap = name;
    if (currentBaseLayer) map.removeLayer(currentBaseLayer);
    currentBaseLayer = baseLayers[name].addTo(map);

    const meta = BASEMAP_STEPS.find((b) => b.id === name);
    if (meta) el.cycleBasemapLabel.textContent = meta.label;
    document.querySelectorAll("[data-basemap]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.basemap === name);
    });
  }

  function setRadius(meters) {
    state.radiusMeters = meters;
    el.cycleRadiusLabel.textContent = meters < 1000 ? `${meters}m` : `${(meters / 1000).toString().replace(".", ",")}km`;
    document.querySelectorAll("[data-radius]").forEach((b) => {
      b.classList.toggle("is-active", Number(b.dataset.radius) === meters);
    });

    if (state.filters.near.size > 0) applyFiltersAndRender(false);
    renderPoiLayers();
    if (state.selectedHouseId) {
      const house = state.houses.find((h) => h.id === state.selectedHouseId);
      if (house) {
        renderSelectionOverlay(house);
        if (state.drawerOpen) renderDetailDrawer(house);
      }
    }
  }

  function renderPoiCategoryDock() {
    el.poiCategoryBar.innerHTML = Object.values(CATEGORIES)
      .map((cat) => {
        const isOn = state.activeCategories.has(cat.id);
        return `
          <button type="button" class="cat-toggle ${isOn ? "is-on" : ""}" data-cat="${cat.id}" aria-pressed="${isOn}">
            <span class="cat-toggle__dot" style="background:${cat.color}">${cat.icon}</span>
            <span>${cat.label}</span>
          </button>
        `;
      })
      .join("");

    el.poiCategoryBar.querySelectorAll(".cat-toggle[data-cat]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const catId = btn.dataset.cat;
        if (state.activeCategories.has(catId)) state.activeCategories.delete(catId);
        else state.activeCategories.add(catId);

        const on = state.activeCategories.has(catId);
        btn.classList.toggle("is-on", on);
        btn.setAttribute("aria-pressed", String(on));
        renderPoiLayers();
        if (state.selectedHouseId) {
          const house = state.houses.find((h) => h.id === state.selectedHouseId);
          if (house) renderSelectionOverlay(house);
        }
      });
    });
  }

  function renderCrimeLegendPanel() {
    if (!el.crimeLegendPanel) return;
    if (!state.showCrimes || !state.crimeLegendOpen) {
      el.crimeLegendPanel.hidden = true;
      return;
    }

    const periodCrimes = getCrimesMatchingPeriod();
    const visibleCrimes = getVisibleCrimes();
    const countsByType = {};
    for (const c of periodCrimes) {
      countsByType[c.tipo] = (countsByType[c.tipo] || 0) + 1;
    }

    const updatedLabel = state.crimesFeed?.atualizado_em ? formatDateShort(state.crimesFeed.atualizado_em) : "";
    const subText =
      state.crimes.length === 0
        ? "Aguardando ocorrências em data/crimes.json"
        : `${visibleCrimes.length} de ${periodCrimes.length} ${periodCrimes.length === 1 ? "ocorrência" : "ocorrências"}${updatedLabel ? ` · Atualizado ${updatedLabel}` : ""}`;

    const periods = [
      { days: 0, label: "Todos" },
      { days: 30, label: "30d" },
      { days: 90, label: "90d" },
      { days: 365, label: "1 ano" },
    ];

    const legendItemsHtml = Object.values(CRIME_TYPES)
      .map((ct) => {
        const count = countsByType[ct.id] || 0;
        const isOn = state.activeCrimeTypes.has(ct.id);
        return `
          <button type="button" class="crime-legend-item ${isOn ? "" : "is-off"} ${count === 0 ? "is-empty" : ""}" data-crime-type="${ct.id}" aria-pressed="${isOn}" title="${escapeHtml(ct.label)} — ${escapeHtml(ct.short)}">
            <span class="crime-legend-item__ico" style="background:${ct.color}">${ct.icon}</span>
            <span class="crime-legend-item__text">
              <strong>${escapeHtml(ct.label)}</strong>
              <small>${escapeHtml(ct.short)}</small>
            </span>
            <span class="crime-legend-item__cnt">${count}</span>
          </button>
        `;
      })
      .join("");

    el.crimeLegendPanel.hidden = false;
    el.crimeLegendPanel.innerHTML = `
      <div class="crime-panel__head">
        <div>
          <h3><span style="width:16px;height:16px;color:#b91c1c;display:inline-grid;place-items:center">${UI_ICONS.shieldAlert}</span> Mapa de Crimes</h3>
          <p>${escapeHtml(subText)}</p>
        </div>
        <button type="button" class="crime-panel__close" id="closeCrimeLegendBtn" aria-label="Fechar legenda">×</button>
      </div>

      ${
        state.crimes.length === 0
          ? `<p class="crime-panel__empty-note">Nenhuma ocorrência cadastrada ainda em <code>data/crimes.json</code>. Abaixo está o catálogo completo de ícones estilo CrimeReports que o Grokbot pode usar.</p>`
          : `<div class="crime-panel__toolbar">
              <div class="crime-period-row" role="group" aria-label="Filtrar período">
                ${periods
                  .map(
                    (p) =>
                      `<button type="button" class="crime-period-pill ${state.crimePeriodDays === p.days ? "is-active" : ""}" data-crime-period="${p.days}">${p.label}</button>`
                  )
                  .join("")}
              </div>
              <div class="crime-panel__quick">
                <button type="button" id="crimeSelectAllBtn">Todos</button>
                <button type="button" id="crimeClearAllBtn">Limpar</button>
              </div>
            </div>`
      }

      <div class="crime-legend-grid">${legendItemsHtml}</div>

      <div class="crime-panel__foot">
        <span><span class="crime-prec-pill crime-prec-pill--rua">Rua</span> pino exato</span>
        <span><span class="crime-prec-pill crime-prec-pill--bairro">Bairro</span> borda tracejada (aprox.)</span>
      </div>
    `;

    const closeBtn = document.getElementById("closeCrimeLegendBtn");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        state.crimeLegendOpen = false;
        renderPoiCategoryDock();
        renderCrimeLegendPanel();
      });
    }

    el.crimeLegendPanel.querySelectorAll("[data-crime-period]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.crimePeriodDays = Number(btn.dataset.crimePeriod) || 0;
        renderPoiCategoryDock();
        renderCrimeLayer();
        renderCrimeLegendPanel();
        if (state.selectedHouseId && state.drawerOpen) {
          const house = state.houses.find((h) => h.id === state.selectedHouseId);
          if (house) renderDetailDrawer(house);
        }
      });
    });

    const allBtn = document.getElementById("crimeSelectAllBtn");
    if (allBtn) {
      allBtn.addEventListener("click", () => {
        state.activeCrimeTypes = new Set(Object.keys(CRIME_TYPES));
        renderPoiCategoryDock();
        renderCrimeLayer();
        renderCrimeLegendPanel();
      });
    }

    const clearBtn = document.getElementById("crimeClearAllBtn");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        state.activeCrimeTypes.clear();
        renderPoiCategoryDock();
        renderCrimeLayer();
        renderCrimeLegendPanel();
      });
    }

    el.crimeLegendPanel.querySelectorAll("[data-crime-type]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const typeId = btn.dataset.crimeType;
        if (state.activeCrimeTypes.has(typeId)) state.activeCrimeTypes.delete(typeId);
        else state.activeCrimeTypes.add(typeId);
        renderPoiCategoryDock();
        renderCrimeLayer();
        renderCrimeLegendPanel();
      });
    });
  }

  function createCrimePopupHtml(crime, house) {
    const ct = CRIME_TYPES[crime.tipo] || CRIME_TYPES.outro;
    const locParts = [crime.bairro, crime.endereco].filter(Boolean);
    if (crime.cidade && normalizeText(crime.cidade) !== "botucatu") {
      locParts.push(crime.cidade);
    }
    const precLabel = crime.precisao === "rua" ? "Local exato (rua)" : "Aproximado (bairro)";
    const precClass = crime.precisao === "rua" ? "crime-prec-pill--rua" : "crime-prec-pill--bairro";

    let distHtml = "";
    if (house) {
      const d = haversine(house.lat, house.lng, crime.lat, crime.lng);
      distHtml = `<div class="crime-popup__dist">${formatDistance(d)} do imóvel selecionado${d <= 2500 ? ` · ${walkMinutes(d)} min a pé` : ""}</div>`;
    }

    return `
      <div class="crime-popup">
        <div class="crime-popup__head">
          <span class="crime-popup__badge" style="background:${ct.color}">${ct.icon}<span>${escapeHtml(ct.label)}</span></span>
          ${crime.data ? `<span class="crime-popup__date">${escapeHtml(formatCrimeDate(crime.data))}</span>` : ""}
        </div>
        <h4 class="crime-popup__title">${escapeHtml(crime.titulo)}</h4>
        ${locParts.length ? `<p class="crime-popup__loc"><strong>Local:</strong> ${escapeHtml(locParts.join(" · "))}</p>` : ""}
        ${crime.descricao ? `<p class="crime-popup__desc">${escapeHtml(crime.descricao)}</p>` : ""}
        ${distHtml}
        <div class="crime-popup__meta">
          <span class="crime-prec-pill ${precClass}">${precLabel}</span>
          <div class="crime-popup__source">
            <span>${crime.fonte ? `Fonte: ${escapeHtml(crime.fonte)}` : "Registro local"}</span>
            ${crime.link ? `<a href="${escapeHtml(crime.link)}" target="_blank" rel="noopener noreferrer">Ver matéria ↗</a>` : ""}
          </div>
        </div>
      </div>
    `;
  }

  function renderCrimeLayer() {
    if (!map || !crimeLayer) return;
    crimeLayer.clearLayers();
    crimeMarkers.clear();

    if (!state.showCrimes) return;

    const selectedHouse = state.selectedHouseId
      ? state.houses.find((h) => h.id === state.selectedHouseId)
      : null;

    for (const crime of getVisibleCrimes()) {
      const ct = CRIME_TYPES[crime.tipo] || CRIME_TYPES.outro;
      let stateClass = "";
      if (selectedHouse) {
        const d = haversine(selectedHouse.lat, selectedHouse.lng, crime.lat, crime.lng);
        stateClass = d <= state.radiusMeters ? "is-inside" : "is-dimmed";
      }
      const approxClass = crime.precisao === "bairro" ? "crime-pin--approx" : "";

      const icon = L.divIcon({
        className: "crime-pin-wrap",
        html: `<div class="crime-pin ${approxClass} ${stateClass}" style="background:${ct.color}" title="${escapeHtml(ct.label)}: ${escapeHtml(crime.titulo)}">${ct.icon}</div>`,
        iconSize: [0, 0],
      });

      const marker = L.marker([crime.displayLat, crime.displayLng], {
        icon,
        zIndexOffset: stateClass === "is-inside" ? 310 : 140,
      }).addTo(crimeLayer);

      marker.bindPopup(() => createCrimePopupHtml(crime, selectedHouse));
      marker.on("mouseover", () => {
        if (selectedHouse) highlightRouteToCrime(selectedHouse, crime);
      });
      marker.on("mouseout", () => clearRouteHighlight());

      crimeMarkers.set(crime.id, { marker, crime });
    }
  }

  function highlightRouteToCrime(house, crime) {
    clearRouteHighlight();
    if (!house || !crime || !map) return;
    const ct = CRIME_TYPES[crime.tipo] || CRIME_TYPES.outro;
    const dist = haversine(house.lat, house.lng, crime.lat, crime.lng);

    L.polyline(
      [
        [house.lat, house.lng],
        [crime.displayLat, crime.displayLng],
      ],
      {
        color: ct.color,
        weight: 3.2,
        opacity: 0.9,
        dashArray: "5 5",
        interactive: false,
      }
    ).addTo(routeHighlightLayer);

    const midLat = (house.lat + crime.displayLat) / 2;
    const midLng = (house.lng + crime.displayLng) / 2;
    L.marker([midLat, midLng], {
      interactive: false,
      zIndexOffset: 710,
      icon: L.divIcon({
        className: "dist-tag-wrap",
        html: `<span class="dist-tag" style="background:${ct.color}">${escapeHtml(ct.label)} · ${formatDistance(dist)}</span>`,
        iconSize: [0, 0],
      }),
    }).addTo(routeHighlightLayer);

    const entry = crimeMarkers.get(crime.id);
    if (entry) {
      const domEl = entry.marker.getElement()?.querySelector(".crime-pin");
      if (domEl) domEl.classList.add("is-highlighted");
    }
  }

  function createTrafficPopupHtml(item, house) {
    const tt = TRAFFIC_TYPES[item.tipo] || TRAFFIC_TYPES.outro;
    const locParts = [item.bairro, item.endereco].filter(Boolean);
    if (item.cidade && normalizeText(item.cidade) !== "botucatu") {
      locParts.push(item.cidade);
    }
    const precLabel = item.precisao === "rua" ? "Local exato (rua)" : "Aproximado (bairro)";
    const precClass = item.precisao === "rua" ? "crime-prec-pill--rua" : "crime-prec-pill--bairro";
    const gravBadge =
      item.gravidade && TRAFFIC_GRAVIDADE_LABELS[item.gravidade]
        ? `<span class="traffic-grav-pill traffic-grav-pill--${item.gravidade}">${TRAFFIC_GRAVIDADE_LABELS[item.gravidade]}</span>`
        : "";

    let distHtml = "";
    if (house) {
      const d = haversine(house.lat, house.lng, item.lat, item.lng);
      distHtml = `<div class="crime-popup__dist traffic-popup__dist">${formatDistance(d)} do imóvel selecionado${d <= 2500 ? ` · ${walkMinutes(d)} min a pé` : ""}</div>`;
    }

    return `
      <div class="crime-popup">
        <div class="crime-popup__head">
          <span class="crime-popup__badge" style="background:${tt.color}">${tt.icon}<span>${escapeHtml(tt.label)}</span></span>
          ${item.data ? `<span class="crime-popup__date">${escapeHtml(formatCrimeDate(item.data))}</span>` : ""}
        </div>
        <h4 class="crime-popup__title">${escapeHtml(item.titulo)}</h4>
        ${locParts.length ? `<p class="crime-popup__loc"><strong>Local:</strong> ${escapeHtml(locParts.join(" · "))}</p>` : ""}
        ${item.descricao ? `<p class="crime-popup__desc">${escapeHtml(item.descricao)}</p>` : ""}
        ${distHtml}
        <div class="crime-popup__meta">
          <div style="display:flex;gap:5px;flex-wrap:wrap;align-items:center">
            ${gravBadge}
            <span class="crime-prec-pill ${precClass}">${precLabel}</span>
          </div>
          <div class="crime-popup__source traffic-popup__source">
            <span>${item.fonte ? `Fonte: ${escapeHtml(item.fonte)}` : "Registro local"}</span>
            ${item.link ? `<a href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer">Ver matéria ↗</a>` : ""}
          </div>
        </div>
      </div>
    `;
  }

  function renderTrafficLayer() {
    if (!map || !trafficLayer) return;
    trafficLayer.clearLayers();
    trafficMarkers.clear();

    if (!state.showTraffic) return;

    const selectedHouse = state.selectedHouseId
      ? state.houses.find((h) => h.id === state.selectedHouseId)
      : null;

    for (const item of getVisibleTraffic()) {
      const tt = TRAFFIC_TYPES[item.tipo] || TRAFFIC_TYPES.outro;
      let stateClass = "";
      if (selectedHouse) {
        const d = haversine(selectedHouse.lat, selectedHouse.lng, item.lat, item.lng);
        stateClass = d <= state.radiusMeters ? "is-inside" : "is-dimmed";
      }
      const approxClass = item.precisao === "bairro" ? "traffic-pin--approx" : "";

      const icon = L.divIcon({
        className: "traffic-pin-wrap",
        html: `<div class="traffic-pin ${approxClass} ${stateClass}" style="background:${tt.color}" title="${escapeHtml(tt.label)}: ${escapeHtml(item.titulo)}">${tt.icon}</div>`,
        iconSize: [0, 0],
      });

      const marker = L.marker([item.displayLat, item.displayLng], {
        icon,
        zIndexOffset: stateClass === "is-inside" ? 305 : 135,
      }).addTo(trafficLayer);

      marker.bindPopup(() => createTrafficPopupHtml(item, selectedHouse));
      marker.on("mouseover", () => {
        if (selectedHouse) highlightRouteToTraffic(selectedHouse, item);
      });
      marker.on("mouseout", () => clearRouteHighlight());

      trafficMarkers.set(item.id, { marker, item });
    }
  }

  function highlightRouteToTraffic(house, item) {
    clearRouteHighlight();
    if (!house || !item || !map) return;
    const tt = TRAFFIC_TYPES[item.tipo] || TRAFFIC_TYPES.outro;
    const dist = haversine(house.lat, house.lng, item.lat, item.lng);

    L.polyline(
      [
        [house.lat, house.lng],
        [item.displayLat, item.displayLng],
      ],
      {
        color: tt.color,
        weight: 3.2,
        opacity: 0.9,
        dashArray: "5 5",
        interactive: false,
      }
    ).addTo(routeHighlightLayer);

    const midLat = (house.lat + item.displayLat) / 2;
    const midLng = (house.lng + item.displayLng) / 2;
    L.marker([midLat, midLng], {
      interactive: false,
      zIndexOffset: 710,
      icon: L.divIcon({
        className: "dist-tag-wrap",
        html: `<span class="dist-tag" style="background:${tt.color}">${escapeHtml(tt.label)} · ${formatDistance(dist)}</span>`,
        iconSize: [0, 0],
      }),
    }).addTo(routeHighlightLayer);

    const entry = trafficMarkers.get(item.id);
    if (entry) {
      const domEl = entry.marker.getElement()?.querySelector(".traffic-pin");
      if (domEl) domEl.classList.add("is-highlighted");
    }
  }

  function createPoiPopupHtml(poi, house) {
    const cat = CATEGORIES[poi.categoria] || CATEGORIES.parque;
    let distHtml = "";
    if (house) {
      const d = Number.isFinite(poi.distance)
        ? poi.distance
        : haversine(house.lat, house.lng, poi.lat, poi.lng);
      distHtml =
        d <= 2500
          ? `<div class="poi-popup__dist">${formatDistance(d)} do imóvel · ${walkMinutes(d)} min a pé</div>`
          : `<div class="poi-popup__dist">${formatDistance(d)} do imóvel · ${driveMinutes(roadApproxMeters(d))} min de carro</div>`;
    }
    return `
      <div class="poi-popup">
        <div class="poi-popup__cat" style="color:${cat.color}">
          <span style="width:14px;height:14px;display:inline-grid;place-items:center">${cat.icon}</span>
          <span>${cat.label}</span>
        </div>
        <h4 class="poi-popup__title">${escapeHtml(poi.nome)}</h4>
        ${poi.detalhe ? `<p class="poi-popup__desc">${escapeHtml(poi.detalhe)}</p>` : ""}
        ${distHtml}
      </div>
    `;
  }

  function renderPoiLayers() {
    if (!map) return;
    poiLayer.clearLayers();
    referenciaLayer.clearLayers();
    poiMarkers.clear();
    anchorMarkers.clear();

    const selectedHouse = state.selectedHouseId
      ? state.houses.find((h) => h.id === state.selectedHouseId)
      : null;

    // 0. Reference Anchor (Casa Tata)
    if (state.activeCategories.has("referencia")) {
      for (const anchor of state.referenceAnchors) {
        const cor = anchor.cor || "#be185d";
        const icon = L.divIcon({
          className: "anchor-pin-wrap",
          html: `
            <div class="anchor-pin" style="--anchor-color:${cor}">
              <span class="anchor-pin__ico">${getAnchorIcon(anchor)}</span>
              <span>${escapeHtml(anchor.nome)}</span>
            </div>
          `,
          iconSize: [0, 0],
        });

        const marker = L.marker([anchor.lat, anchor.lng], {
          icon,
          zIndexOffset: 540,
        }).addTo(referenciaLayer);

        marker.bindPopup(() => {
          let distBlock = "";
          if (selectedHouse) {
            const straight = haversine(selectedHouse.lat, selectedHouse.lng, anchor.lat, anchor.lng);
            const road = roadApproxMeters(straight);
            const dirUrl = buildGoogleMapsDirUrl(selectedHouse, anchor);
            const walkPart = road <= 5000 ? ` · 🚶 ${walkMinutes(road)} min` : "";
            distBlock = `
              <div class="poi-popup__dist">
                Do imóvel selecionado: ~${formatDistance(road)} (${formatDistance(straight)} linha reta)<br>
                🚗 ${driveMinutes(road)} min de carro${walkPart}
                <div style="margin-top:6px"><a href="${dirUrl}" target="_blank" rel="noopener noreferrer" style="color:${cor};font-weight:700">Ver rota no Google Maps ↗</a></div>
              </div>
            `;
          } else if (state.filteredHouses.length > 0) {
            const nearCount = state.filteredHouses.filter((h) => h.casaTataDist <= 5000).length;
            distBlock = `
              <div class="poi-popup__dist">
                ${nearCount} de ${state.filteredHouses.length} imóveis a até 5 km da Casa Tata.<br>
                <span style="font-weight:500;color:var(--ink-muted)">Toque em qualquer imóvel para ver a distância no mapa.</span>
              </div>
            `;
          }
          return `
            <div class="poi-popup">
              <div class="poi-popup__cat" style="color:${cor}">
                <span style="width:14px;height:14px;display:inline-grid;place-items:center">${getAnchorIcon(anchor)}</span>
                <span>Ponto de referência</span>
              </div>
              <h4 class="poi-popup__title">${escapeHtml(anchor.nome)}</h4>
              <p class="poi-popup__desc"><strong>${escapeHtml(anchor.subtitulo || "")}</strong><br>${escapeHtml(anchor.endereco || anchor.detalhe || "")}</p>
              ${distBlock}
            </div>
          `;
        });

        marker.on("mouseover", () => {
          if (selectedHouse) highlightRouteToAnchor(selectedHouse, anchor);
        });
        marker.on("mouseout", () => clearRouteHighlight());

        anchorMarkers.set(anchor.id, { marker, anchor });
      }
    }

    const poisToRender = [...state.allPois];
    if (selectedHouse && state.liveOsmPoisByHouse[selectedHouse.id]) {
      poisToRender.push(...state.liveOsmPoisByHouse[selectedHouse.id]);
    }

    for (const poi of poisToRender) {
      if (!state.activeCategories.has(poi.categoria)) continue;
      const cat = CATEGORIES[poi.categoria];
      if (!cat) continue;

      let stateClass = "";
      if (selectedHouse) {
        const d = haversine(selectedHouse.lat, selectedHouse.lng, poi.lat, poi.lng);
        stateClass = d <= state.radiusMeters ? "is-inside" : "is-dimmed";
      }

      const icon = L.divIcon({
        className: "poi-pin-wrap",
        html: `<div class="poi-pin ${stateClass}" style="background:${cat.color}" title="${escapeHtml(poi.nome)}">${cat.icon}</div>`,
        iconSize: [0, 0],
      });

      const marker = L.marker([poi.lat, poi.lng], {
        icon,
        zIndexOffset: stateClass === "is-inside" ? 260 : 80,
      }).addTo(poiLayer);

      marker.bindPopup(() => createPoiPopupHtml(poi, selectedHouse));
      marker.on("mouseover", () => {
        if (selectedHouse) highlightRouteToPoi(selectedHouse, poi);
      });
      marker.on("mouseout", () => clearRouteHighlight());

      poiMarkers.set(poi.id, { marker, poi });
    }

    renderCrimeLayer();
    renderTrafficLayer();
  }

  function renderHouseMarkers() {
    if (!map) return;
    houseLayer.clearLayers();
    houseMarkers.clear();

    for (const house of state.filteredHouses) {
      const isSelected = house.id === state.selectedHouseId;
      const isFav = Boolean(state.prefs.favorites[house.id]);
      const isHidden = Boolean(state.prefs.hidden[house.id]);
      const pinClass = [
        "house-pin",
        house.finalidade === "compra" ? "house-pin--compra" : "house-pin--aluguel",
        house.chacara ? "house-pin--chacara" : "",
        house.nova ? "house-pin--nova" : "",
        isHidden ? "house-pin--hidden" : "",
        isSelected ? "is-selected" : "",
        house.id === state.hoveredHouseId ? "is-hovered" : "",
      ]
        .filter(Boolean)
        .join(" ");

      const icon = L.divIcon({
        className: "house-pin-wrap",
        html: `
          <div class="${pinClass}" data-house-pin="${escapeHtml(house.id)}">
            ${
              house.chacara
                ? `<span class="house-pin__chacara" title="Chácara" aria-label="Chácara">${UI_ICONS.chacara}</span>`
                : `<span class="house-pin__dot"></span>`
            }
            <span>${escapeHtml(formatCompactPrice(house.preco, house.finalidade))}</span>
            ${house.nova ? `<span class="house-pin__new" title="Novidade" aria-label="Novidade">${UI_ICONS.star}<span>Nova</span></span>` : ""}
            ${isFav ? '<span class="house-pin__heart" aria-label="Favorito">♥</span>' : ""}
          </div>
        `,
        iconSize: [0, 0],
      });

      const marker = L.marker([house.lat, house.lng], {
        icon,
        zIndexOffset: isSelected ? 600 : house.nova ? 450 : 350,
      }).addTo(houseLayer);

      marker.on("click", (e) => {
        L.DomEvent.stopPropagation(e);
        if (!isDesktop() && state.activeTab === "mapa" && state.selectedHouseId !== house.id) {
          focusHouseOnMap(house.id, { fly: true, scrollCarousel: true });
        } else {
          openHouseDetails(house.id, { fly: true });
        }
      });
      marker.on("mouseover", () => setHoveredHouse(house.id));
      marker.on("mouseout", () => setHoveredHouse(null));

      houseMarkers.set(house.id, marker);
    }
  }

  function renderSelectionOverlay(house) {
    selectionLayer.clearLayers();
    clearRouteHighlight();
    if (!house || !map) return;

    L.circle([house.lat, house.lng], {
      radius: state.radiusMeters,
      color: "#1b5e43",
      weight: 1.8,
      dashArray: "6 6",
      fillColor: "#1b5e43",
      fillOpacity: 0.065,
      interactive: false,
    }).addTo(selectionLayer);

    if (state.radiusMeters >= 1000) {
      L.circle([house.lat, house.lng], {
        radius: 500,
        color: "#1b5e43",
        weight: 1,
        opacity: 0.3,
        dashArray: "3 5",
        fill: false,
        interactive: false,
      }).addTo(selectionLayer);
    }

    const drawnCats = new Set();
    for (const item of house.nearby) {
      if (item.distance > state.radiusMeters) break;
      if (!state.activeCategories.has(item.categoria)) continue;
      if (drawnCats.has(item.categoria)) continue;
      drawnCats.add(item.categoria);

      const cat = CATEGORIES[item.categoria];
      L.polyline(
        [
          [house.lat, house.lng],
          [item.lat, item.lng],
        ],
        {
          color: cat.color,
          weight: 2,
          opacity: 0.55,
          dashArray: "4 6",
          interactive: false,
        }
      ).addTo(selectionLayer);
    }

    // Distance connector to Casa Tata when Referência layer is active
    if (state.activeCategories.has("referencia") && Array.isArray(house.commutes)) {
      for (const c of house.commutes) {
        const cor = c.cor || "#be185d";
        L.polyline(
          [
            [house.lat, house.lng],
            [c.lat, c.lng],
          ],
          {
            color: cor,
            weight: 2.8,
            opacity: 0.78,
            dashArray: "7 6",
            interactive: false,
          }
        ).addTo(selectionLayer);

        const midLat = (house.lat + c.lat) / 2;
        const midLng = (house.lng + c.lng) / 2;
        L.marker([midLat, midLng], {
          interactive: false,
          zIndexOffset: 560,
          icon: L.divIcon({
            className: "dist-tag-wrap",
            html: `<span class="dist-tag" style="background:${cor}">${escapeHtml(c.nome)}: ~${formatDistance(c.roadMeters)} · ${c.driveMin} min</span>`,
            iconSize: [0, 0],
          }),
        }).addTo(selectionLayer);
      }
    }
  }

  function highlightRouteToAnchor(house, anchor) {
    clearRouteHighlight();
    if (!house || !anchor || !map) return;
    const cor = anchor.cor || "#be185d";
    const road = roadApproxMeters(haversine(house.lat, house.lng, anchor.lat, anchor.lng));

    L.polyline(
      [
        [house.lat, house.lng],
        [anchor.lat, anchor.lng],
      ],
      {
        color: cor,
        weight: 4,
        opacity: 0.96,
        dashArray: "8 5",
        interactive: false,
      }
    ).addTo(routeHighlightLayer);

    const midLat = (house.lat + anchor.lat) / 2;
    const midLng = (house.lng + anchor.lng) / 2;
    L.marker([midLat, midLng], {
      interactive: false,
      zIndexOffset: 760,
      icon: L.divIcon({
        className: "dist-tag-wrap",
        html: `<span class="dist-tag" style="background:${cor}">${escapeHtml(anchor.nome)} · ~${formatDistance(road)} · ${driveMinutes(road)} min carro</span>`,
        iconSize: [0, 0],
      }),
    }).addTo(routeHighlightLayer);
  }

  function highlightRouteToPoi(house, poi) {
    clearRouteHighlight();
    if (!house || !poi || !map) return;
    const cat = CATEGORIES[poi.categoria] || CATEGORIES.parque;
    const dist = Number.isFinite(poi.distance)
      ? poi.distance
      : haversine(house.lat, house.lng, poi.lat, poi.lng);

    L.polyline(
      [
        [house.lat, house.lng],
        [poi.lat, poi.lng],
      ],
      {
        color: cat.color,
        weight: 3.4,
        opacity: 0.95,
        dashArray: "6 6",
        interactive: false,
      }
    ).addTo(routeHighlightLayer);

    const midLat = (house.lat + poi.lat) / 2;
    const midLng = (house.lng + poi.lng) / 2;
    const labelText =
      dist <= 2500
        ? `${formatDistance(dist)} · ${walkMinutes(dist)} min a pé`
        : `${formatDistance(dist)} · ${driveMinutes(roadApproxMeters(dist))} min carro`;

    L.marker([midLat, midLng], {
      interactive: false,
      zIndexOffset: 700,
      icon: L.divIcon({
        className: "dist-tag-wrap",
        html: `<span class="dist-tag" style="background:${cat.color}">${escapeHtml(labelText)}</span>`,
        iconSize: [0, 0],
      }),
    }).addTo(routeHighlightLayer);

    const entry = poiMarkers.get(poi.id);
    if (entry) {
      const domEl = entry.marker.getElement()?.querySelector(".poi-pin");
      if (domEl) domEl.classList.add("is-highlighted");
    }
  }

  function clearRouteHighlight() {
    if (routeHighlightLayer) routeHighlightLayer.clearLayers();
    document.querySelectorAll(".poi-pin.is-highlighted, .crime-pin.is-highlighted, .traffic-pin.is-highlighted").forEach((n) => n.classList.remove("is-highlighted"));
  }

  function fitMapToHouses() {
    if (!map) return;
    const points = state.filteredHouses.map((h) => [h.lat, h.lng]);
    if (state.activeCategories.has("referencia")) {
      state.referenceAnchors.forEach((a) => points.push([a.lat, a.lng]));
    }
    if (points.length === 0) {
      const c = state.cityData?.centro || { lat: -22.8858, lng: -48.4450 };
      map.flyTo([c.lat, c.lng], 13, { duration: 0.5 });
      return;
    }
    if (points.length === 1) {
      map.flyTo(points[0], 14, { duration: 0.5 });
      return;
    }
    const bounds = L.latLngBounds(points);
    const padBottom = isDesktop() ? 70 : 155;
    const padTop = isDesktop() ? 70 : 130;
    map.fitBounds(bounds, {
      paddingTopLeft: [36, padTop],
      paddingBottomRight: [56, padBottom],
      maxZoom: 14,
      animate: true,
    });
  }

  // ==================== FILTERING, LISTINGS & MOBILE MAP CAROUSEL ====================

  function countActiveFilters() {
    const f = state.filters;
    let n = 0;
    if (f.finalidade !== "todas") n++;
    if (f.chacara !== "todas") n++;
    if (f.minQuartos > 0) n++;
    if (f.pets) n++;
    if (f.quintal) n++;
    if (f.novas) n++;
    if (f.favoritas) n++;
    if (f.ocultos) n++;
    n += f.near.size;
    return n;
  }

  function syncFilterControlsUI() {
    const f = state.filters;
    const activeCount = countActiveFilters();
    el.filterCountBadge.textContent = String(activeCount);
    el.filterCountBadge.hidden = activeCount === 0;
    el.openFiltersBtn.classList.toggle("has-active", activeCount > 0);

    document.querySelectorAll("[data-finalidade]").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.finalidade === f.finalidade);
    });
    document.querySelectorAll("[data-chacara]").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.chacara === f.chacara);
    });
    document.querySelectorAll("[data-chacara-quick]").forEach((b) => {
      b.classList.toggle("is-active", f.chacara === b.dataset.chacaraQuick);
    });
    document.querySelectorAll("[data-quartos]").forEach((b) => {
      b.classList.toggle("is-active", Number(b.dataset.quartos) === f.minQuartos);
    });
    document.querySelectorAll("[data-toggle]").forEach((b) => {
      b.classList.toggle("is-active", Boolean(f[b.dataset.toggle]));
    });
    document.querySelectorAll("[data-near]").forEach((b) => {
      b.classList.toggle("is-active", f.near.has(b.dataset.near));
    });
    el.sortFilter.value = f.sort;
    el.sheetSortSelect.value = f.sort;
  }

  function getHousesForCurrentList() {
    if (!isDesktop() && state.activeTab === "salvas") {
      return state.houses.filter((h) => {
        const isHidden = Boolean(state.prefs.hidden[h.id]);
        if (state.savedFilter === "ocultos") return isHidden;
        if (isHidden) return false;
        const isFav = Boolean(state.prefs.favorites[h.id]);
        const st = state.prefs.status[h.id] || "";
        const hasNote = Boolean(state.prefs.notes[h.id]);
        if (state.savedFilter === "fav") return isFav;
        if (state.savedFilter === "visitar") return st === "visitar";
        if (state.savedFilter === "visitada") return st === "visitada";
        return isFav || Boolean(st) || hasNote;
      });
    }
    return state.filteredHouses;
  }

  function applyFiltersAndRender(shouldFitBounds = false) {
    const f = state.filters;
    const q = normalizeText(f.query);
    const hiddenCount = getHiddenHousesCount();
    const novaCount = getNovaHousesCount();
    if (hiddenCount === 0 && f.ocultos) {
      f.ocultos = false;
    }
    if (novaCount === 0 && f.novas) {
      f.novas = false;
    }

    let list = state.houses.filter((h) => {
      const isHidden = Boolean(state.prefs.hidden[h.id]);
      if (f.ocultos) {
        if (!isHidden) return false;
      } else if (isHidden) {
        return false;
      }
      if (f.finalidade !== "todas" && h.finalidade !== f.finalidade) return false;
      if (f.chacara === "sim" && !h.chacara) return false;
      if (f.chacara === "nao" && h.chacara) return false;
      if (f.minQuartos > 0 && h.quartos < f.minQuartos) return false;
      if (f.pets && !h.aceita_pets) return false;
      if (f.quintal && !h.quintal) return false;
      if (f.novas && !h.nova) return false;
      if (f.favoritas && !state.prefs.favorites[h.id]) return false;

      for (const cat of f.near) {
        const nearest = h.nearestByCat[cat];
        if (!nearest || nearest.distance > state.radiusMeters) return false;
      }

      if (q) {
        const hay = normalizeText(
          `${h.titulo} ${h.bairro} ${h.endereco} ${h.tipo} ${h.descricao} ${h.nota_grokbot} ${h.tags.join(" ")} ${h.chacara ? "chacara sitio rural campo" : "urbano casa"} ${h.nova ? "nova novidade novo" : ""}`
        );
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    list.sort((a, b) => {
      if (f.sort === "novas") {
        if (a.nova !== b.nova) return a.nova ? -1 : 1;
        return a.casaTataDist - b.casaTataDist;
      }
      if (f.sort === "casa_tata") return a.casaTataDist - b.casaTataDist;
      if (f.sort === "farmacia") return (a.nearestByCat.farmacia?.distance ?? Infinity) - (b.nearestByCat.farmacia?.distance ?? Infinity);
      if (f.sort === "saude") return (a.nearestByCat.saude?.distance ?? Infinity) - (b.nearestByCat.saude?.distance ?? Infinity);
      if (f.sort === "mercado") return (a.nearestByCat.mercado?.distance ?? Infinity) - (b.nearestByCat.mercado?.distance ?? Infinity);
      if (f.sort === "plantas") return (a.nearestByCat.plantas?.distance ?? Infinity) - (b.nearestByCat.plantas?.distance ?? Infinity);
      if (f.sort === "chacara") {
        if (a.chacara !== b.chacara) return a.chacara ? -1 : 1;
        return a.casaTataDist - b.casaTataDist;
      }
      if (f.sort === "preco_asc") return (a.preco || Infinity) - (b.preco || Infinity);
      if (f.sort === "preco_desc") return (b.preco || 0) - (a.preco || 0);
      if (f.sort === "area_desc") return (b.area_m2 || 0) - (a.area_m2 || 0);
      if (f.sort === "terreno_desc") return (b.terreno_m2 || 0) - (a.terreno_m2 || 0);
      if (f.sort === "recente") return String(b.encontrado_em).localeCompare(String(a.encontrado_em));
      return (
        b.overallScore +
        (b.destaque ? 4 : 0) -
        (a.overallScore + (a.destaque ? 4 : 0))
      );
    });

    state.filteredHouses = list;
    updateSavedIndicators();
    syncFilterControlsUI();

    const visibleTotal = Math.max(0, state.houses.length - hiddenCount);
    el.navListCount.textContent = String(list.length);
    el.sheetApplyFiltersBtn.textContent =
      list.length === 1 ? "Ver 1 imóvel" : `Ver ${list.length} imóveis`;
    if (f.ocultos) {
      el.resultsCount.textContent =
        list.length === hiddenCount
          ? `Mostrando ${list.length} ${list.length === 1 ? "imóvel oculto" : "imóveis ocultos"}`
          : `Mostrando ${list.length} de ${hiddenCount} ${hiddenCount === 1 ? "imóvel oculto" : "imóveis ocultos"}`;
    } else if (list.length === visibleTotal) {
      el.resultsCount.textContent =
        hiddenCount > 0
          ? `${list.length} ${list.length === 1 ? "imóvel" : "imóveis"} em Botucatu e região (${hiddenCount} ${hiddenCount === 1 ? "oculto" : "ocultos"})`
          : `${list.length} ${list.length === 1 ? "imóvel" : "imóveis"} em Botucatu e região`;
    } else {
      el.resultsCount.textContent =
        hiddenCount > 0
          ? `Mostrando ${list.length} de ${visibleTotal} imóveis (${hiddenCount} ${hiddenCount === 1 ? "oculto" : "ocultos"})`
          : `Mostrando ${list.length} de ${visibleTotal} imóveis`;
    }
    el.resetFiltersBtn.hidden = countActiveFilters() === 0 && !f.query;

    renderListings();
    renderMapCarousel();
    renderHouseMarkers();
    if (shouldFitBounds) fitMapToHouses();
  }

  function renderListings() {
    const list = getHousesForCurrentList();
    const isSavedView = !isDesktop() && state.activeTab === "salvas";
    const hiddenCount = getHiddenHousesCount();
    const visibleTotal = Math.max(0, state.houses.length - hiddenCount);

    if (isSavedView) {
      if (state.savedFilter === "ocultos") {
        el.savedSubtitle.textContent = `${list.length} ${list.length === 1 ? "imóvel oculto" : "imóveis ocultos"} neste aparelho`;
      } else {
        el.savedSubtitle.textContent = `${list.length} ${list.length === 1 ? "imóvel salvo" : "imóveis salvos"} neste aparelho`;
      }
    }

    if (list.length === 0) {
      el.listingsContainer.innerHTML = "";
      el.emptyState.hidden = false;
      el.emptyResetBtn.dataset.emptyAction = "reset";
      if (isSavedView) {
        el.emptyTitle.textContent = "Nenhum imóvel salvo ainda";
        el.emptyDesc.textContent = "Toque no coração ou adicione uma anotação em qualquer imóvel no mapa para acompanhá-lo aqui.";
        el.emptyResetBtn.textContent = "Explorar no mapa";
      } else if (!state.filters.ocultos && hiddenCount > 0 && visibleTotal === 0) {
        el.emptyTitle.textContent = "Todos os imóveis estão ocultos";
        el.emptyDesc.textContent = "Você ocultou todos os imóveis da lista. Abra o filtro Ocultos para reexibir algum.";
        el.emptyResetBtn.textContent = `Ver ocultos (${hiddenCount})`;
        el.emptyResetBtn.dataset.emptyAction = "show-hidden";
      } else {
        el.emptyTitle.textContent = "Nenhum imóvel com esses filtros";
        el.emptyDesc.textContent = "Tente remover um filtro de proximidade ou ampliar a busca em Botucatu e região.";
        el.emptyResetBtn.textContent = "Mostrar todos os imóveis";
      }
      return;
    }

    el.emptyState.hidden = true;
    el.listingsContainer.innerHTML = list.map(renderHouseCard).join("");

    el.listingsContainer.querySelectorAll(".house-card").forEach((card) => {
      const id = card.dataset.houseId;
      card.addEventListener("click", (e) => {
        if (e.target.closest("[data-card-action]") || e.target.closest(".card-go-btn")) return;
        openHouseDetails(id, { fly: true });
      });
      card.addEventListener("mouseenter", () => setHoveredHouse(id));
      card.addEventListener("mouseleave", () => setHoveredHouse(null));
    });

    el.listingsContainer.querySelectorAll("[data-card-action]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = btn.dataset.houseId;
        const action = btn.dataset.cardAction;
        if (action === "fav") toggleFavorite(id);
        if (action === "hide") toggleHidden(id);
        if (action === "compare") toggleCompare(id);
      });
    });

    el.listingsContainer.querySelectorAll("img[data-fallback-house]").forEach((img) => {
      img.addEventListener("error", () => {
        const house = state.houses.find((h) => h.id === img.dataset.fallbackHouse);
        if (!house) return;
        const nextIdx = (Number(img.dataset.photoIdx) || 0) + 1;
        if (nextIdx < house.fotos.length) {
          img.dataset.photoIdx = String(nextIdx);
          img.src = house.fotos[nextIdx];
        } else {
          img.outerHTML = buildHouseIllustration(house);
        }
      });
    });
  }

  function renderHouseCard(house) {
    const isFav = Boolean(state.prefs.favorites[house.id]);
    const isHidden = Boolean(state.prefs.hidden[house.id]);
    const isCmp = state.compareIds.includes(house.id);
    const isSelected = house.id === state.selectedHouseId;
    const statusId = state.prefs.status[house.id] || "";
    const statusObj = STATUS_OPTIONS.find((s) => s.id === statusId && s.id);

    const mediaHtml = house.fotos.length
      ? `<img src="${escapeHtml(house.fotos[0])}" alt="${escapeHtml(house.titulo)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" data-photo-idx="0" data-fallback-house="${escapeHtml(house.id)}">`
      : buildHouseIllustration(house);

    const highlightCats = ["farmacia", "mercado", "cafe", "plantas"]
      .map((cid) => house.nearestByCat[cid])
      .filter(Boolean)
      .slice(0, 4);

    const nearbyPills = highlightCats
      .map((item) => {
        const cat = CATEGORIES[item.categoria];
        const drive = driveMinutes(roadApproxMeters(item.distance));
        return `
          <span class="near-pill" title="${escapeHtml(item.nome)} (${cat.label})">
            <span class="near-pill__dot" style="background:${cat.color}">${cat.icon}</span>
            <span>${drive} min 🚗</span>
          </span>
        `;
      })
      .join("");

    const specs = [
      house.quartos ? `<span class="spec">${UI_ICONS.bed} ${house.quartos} qto${house.quartos > 1 ? "s" : ""}</span>` : "",
      house.banheiros ? `<span class="spec">${UI_ICONS.bath} ${house.banheiros}</span>` : "",
      house.vagas ? `<span class="spec">${UI_ICONS.car} ${house.vagas}</span>` : "",
      house.area_m2 ? `<span class="spec">${UI_ICONS.area} ${house.area_m2} m²</span>` : "",
      house.terreno_m2 && house.chacara ? `<span class="spec">Terreno ${house.terreno_m2.toLocaleString("pt-BR")} m²</span>` : "",
    ]
      .filter(Boolean)
      .join("");

    const commuteStrip = (house.commutes || [])
      .map(
        (c) => `
          <div class="commute-chip" title="${escapeHtml(c.nome)} — ${escapeHtml(c.endereco || "")}">
            <span class="commute-chip__ico" style="background:${c.cor || "#be185d"}">${getAnchorIcon(c)}</span>
            <div class="commute-chip__text">
              <span>${escapeHtml(c.nome)}</span>
              <strong>~${formatDistance(c.roadMeters)} · ${c.driveMin} min carro</strong>
            </div>
          </div>
        `
      )
      .join("");

    return `
      <article class="house-card ${isSelected ? "is-selected" : ""} ${house.nova ? "house-card--nova" : ""} ${isHidden ? "house-card--hidden" : ""}" data-house-id="${escapeHtml(house.id)}" role="listitem">
        <div class="house-card__media">
          ${mediaHtml}
          <div class="house-card__badges">
            ${house.nova ? `<span class="pill-badge pill-badge--nova">${UI_ICONS.star} Nova</span>` : ""}
            <span class="pill-badge pill-badge--${house.finalidade}">${house.finalidade === "compra" ? "Compra" : "Aluguel"}</span>
            ${house.chacara ? `<span class="pill-badge pill-badge--chacara">${UI_ICONS.chacara} Chácara</span>` : ""}
            ${house.destaque ? '<span class="pill-badge pill-badge--destaque">Destaque</span>' : ""}
            ${isHidden ? `<span class="pill-badge pill-badge--hidden">${UI_ICONS.eyeOff} Oculto</span>` : ""}
            ${statusObj ? `<span class="pill-badge pill-badge--status">${escapeHtml(statusObj.label)}</span>` : ""}
          </div>
          <div class="house-card__top-actions">
            <button type="button" class="card-action-btn ${isCmp ? "is-cmp" : ""}" data-card-action="compare" data-house-id="${escapeHtml(house.id)}" title="Comparar" aria-label="Comparar">
              ${UI_ICONS.compare}
            </button>
            <button type="button" class="card-action-btn card-action-btn--hide ${isHidden ? "is-hidden" : ""}" data-card-action="hide" data-house-id="${escapeHtml(house.id)}" title="${isHidden ? "Reexibir imóvel" : "Ocultar imóvel"}" aria-label="${isHidden ? "Reexibir imóvel" : "Ocultar imóvel"}">
              ${isHidden ? UI_ICONS.eye : UI_ICONS.eyeOff}
            </button>
            <button type="button" class="card-action-btn ${isFav ? "is-fav" : ""}" data-card-action="fav" data-house-id="${escapeHtml(house.id)}" title="Favoritar" aria-label="Favoritar">
              ${UI_ICONS.heart}
            </button>
          </div>
        </div>

        <div class="house-card__body">
          <div class="house-card__price-row">
            <div class="house-card__price">
              ${formatCurrency(house.preco)}
              ${house.finalidade === "aluguel" && house.preco ? "<small>/mês</small>" : ""}
            </div>
            <span class="house-card__score">Entorno ${house.overallScore}</span>
          </div>

          <h3 class="house-card__title">${escapeHtml(house.titulo)}</h3>
          <p class="house-card__loc">${UI_ICONS.pin} <span>${escapeHtml(house.bairro)}${house.endereco ? ` · ${escapeHtml(house.endereco)}` : ""}</span></p>

          ${specs ? `<div class="house-card__specs">${specs}</div>` : ""}
          ${commuteStrip ? `<div class="house-card__commute">${commuteStrip}</div>` : ""}
          ${nearbyPills ? `<div class="house-card__nearby">${nearbyPills}</div>` : ""}
          ${house.nota_grokbot ? `<p class="house-card__bot">${escapeHtml(house.nota_grokbot)}</p>` : ""}
          ${
            house.link
              ? `<div class="house-card__footer-cta">
                  <span class="card-details-hint">Ver detalhes e entorno</span>
                  <a class="card-go-btn" href="${escapeHtml(house.link)}" target="_blank" rel="noopener noreferrer">Ir para o imóvel ${UI_ICONS.external}</a>
                </div>`
              : ""
          }
        </div>
      </article>
    `;
  }

  // Mobile swipeable horizontal peek-cards floating over the map
  function renderMapCarousel() {
    if (state.filteredHouses.length === 0) {
      el.mapCarouselWrap.hidden = true;
      el.mapCarousel.innerHTML = "";
      return;
    }

    el.mapCarouselWrap.hidden = false;
    el.mapCarousel.innerHTML = state.filteredHouses
      .map((h) => {
        const isSelected = h.id === state.selectedHouseId;
        const thumbHtml = h.fotos.length
          ? `<img src="${escapeHtml(h.fotos[0])}" alt="${escapeHtml(h.titulo)}" loading="lazy" decoding="async" referrerpolicy="no-referrer" data-photo-idx="0" data-fallback-compact="${escapeHtml(h.id)}">`
          : buildHouseIllustration(h, true);

        const nearTop = ["farmacia", "mercado", "plantas"]
          .map((c) => h.nearestByCat[c])
          .filter(Boolean)
          .slice(0, 3)
          .map((item) => {
            const cat = CATEGORIES[item.categoria];
            const drive = driveMinutes(roadApproxMeters(item.distance));
            return `
              <span class="peek-near" title="${escapeHtml(item.nome)}">
                <span class="peek-near__dot" style="background:${cat.color}">${cat.icon}</span>
                <span>${drive}m 🚗</span>
              </span>
            `;
          })
          .join("");

        const commuteMini = (h.commutes || [])
          .map(
            (c) => `
              <span class="peek-commute">
                <span class="peek-commute__dot" style="background:${c.cor || "#be185d"}"></span>
                <span>${escapeHtml(c.nome)} ~${formatDistance(c.roadMeters)} · ${c.driveMin} min</span>
              </span>
            `
          )
          .join("");

        return `
          <div class="peek-card ${isSelected ? "is-selected" : ""}" data-peek-id="${escapeHtml(h.id)}" role="button" tabindex="0">
            <div class="peek-card__thumb">
              ${thumbHtml}
              <span class="peek-card__tag ${h.finalidade === "compra" ? "peek-card__tag--compra" : ""}">${h.finalidade === "compra" ? "Compra" : "Aluguel"}</span>
              ${h.chacara ? '<span class="peek-chacara-badge">Chácara</span>' : ""}
            </div>
            <div class="peek-card__info">
              <div class="peek-card__top">
                <span class="peek-card__price-wrap">
                  <span class="peek-card__price">${formatCompactPrice(h.preco, h.finalidade)}${h.finalidade === "aluguel" ? "<small>/mês</small>" : ""}</span>
                  ${h.nova ? `<span class="peek-nova-badge">${UI_ICONS.star} Nova</span>` : ""}
                </span>
                <span class="peek-card__score">${h.overallScore}</span>
              </div>
              <p class="peek-card__title">${escapeHtml(h.titulo)}</p>
              <p class="peek-card__sub">${escapeHtml(h.bairro)}${h.quartos ? ` · ${h.quartos} qtos` : ""}${h.area_m2 ? ` · ${h.area_m2}m²` : ""}</p>
              ${commuteMini ? `<div class="peek-card__commute">${commuteMini}</div>` : ""}
              <div class="peek-card__foot">
                <div class="peek-card__near">${nearTop}</div>
                ${
                  h.link
                    ? `<a class="peek-go-link" href="${escapeHtml(h.link)}" target="_blank" rel="noopener noreferrer" aria-label="Ir para o imóvel">Ir ${UI_ICONS.external}</a>`
                    : ""
                }
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    el.mapCarousel.querySelectorAll(".peek-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        if (e.target.closest(".peek-go-link")) return;
        openHouseDetails(card.dataset.peekId, { fly: true });
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openHouseDetails(card.dataset.peekId, { fly: true });
        }
      });
    });

    el.mapCarousel.querySelectorAll("img[data-fallback-compact]").forEach((img) => {
      img.addEventListener("error", () => {
        const house = state.houses.find((h) => h.id === img.dataset.fallbackCompact);
        if (!house) return;
        const nextIdx = (Number(img.dataset.photoIdx) || 0) + 1;
        if (nextIdx < house.fotos.length) {
          img.dataset.photoIdx = String(nextIdx);
          img.src = house.fotos[nextIdx];
        } else {
          img.outerHTML = buildHouseIllustration(house, true);
        }
      });
    });
  }

  let carouselScrollTimer = null;
  function handleCarouselScroll() {
    if (isDesktop() || state.activeTab !== "mapa") return;
    clearTimeout(carouselScrollTimer);
    carouselScrollTimer = setTimeout(() => {
      const cards = [...el.mapCarousel.querySelectorAll(".peek-card")];
      if (!cards.length) return;
      const center = el.mapCarousel.scrollLeft + el.mapCarousel.clientWidth / 2;
      let closestCard = cards[0];
      let minDelta = Infinity;
      for (const c of cards) {
        const cardCenter = c.offsetLeft + c.offsetWidth / 2;
        const delta = Math.abs(center - cardCenter);
        if (delta < minDelta) {
          minDelta = delta;
          closestCard = c;
        }
      }
      const id = closestCard.dataset.peekId;
      if (id && id !== state.selectedHouseId) {
        focusHouseOnMap(id, { fly: true, scrollCarousel: false });
      }
    }, 110);
  }

  function setHoveredHouse(houseId) {
    if (state.hoveredHouseId === houseId) return;
    const prev = state.hoveredHouseId;
    state.hoveredHouseId = houseId;

    if (prev) {
      const prevPin = document.querySelector(`[data-house-pin="${CSS.escape(prev)}"]`);
      if (prevPin) prevPin.classList.remove("is-hovered");
      const prevCard = document.querySelector(`.house-card[data-house-id="${CSS.escape(prev)}"]`);
      if (prevCard) prevCard.classList.remove("is-hovered");
    }
    if (houseId) {
      const pin = document.querySelector(`[data-house-pin="${CSS.escape(houseId)}"]`);
      if (pin) pin.classList.add("is-hovered");
      const card = document.querySelector(`.house-card[data-house-id="${CSS.escape(houseId)}"]`);
      if (card) card.classList.add("is-hovered");
    }
  }

  function focusHouseOnMap(houseId, { fly = true, scrollCarousel = true } = {}) {
    const house = state.houses.find((h) => h.id === houseId);
    if (!house) return;

    state.selectedHouseId = houseId;
    el.mapHint.classList.add("is-hidden");

    renderHouseMarkers();
    renderPoiLayers();
    renderSelectionOverlay(house);

    el.mapCarousel.querySelectorAll(".peek-card").forEach((c) => {
      c.classList.toggle("is-selected", c.dataset.peekId === houseId);
    });

    if (scrollCarousel && !isDesktop()) {
      const card = el.mapCarousel.querySelector(`.peek-card[data-peek-id="${CSS.escape(houseId)}"]`);
      if (card) card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }

    if (fly && map) {
      const zoom = state.radiusMeters <= 500 ? 15 : state.radiusMeters <= 1000 ? 14 : state.radiusMeters <= 2000 ? 13 : 12;
      map.flyTo([house.lat - (isDesktop() ? 0 : 0.0014), house.lng], Math.max(map.getZoom(), zoom), {
        duration: 0.55,
      });
    }
  }

  // ==================== HOUSE DETAIL SHEET / DRAWER ====================

  function openHouseDetails(houseId, { fly = true } = {}) {
    const house = state.houses.find((h) => h.id === houseId);
    if (!house) return;

    state.activePhotoIndex = 0;
    state.drawerOpen = true;
    focusHouseOnMap(houseId, { fly, scrollCarousel: true });

    renderDetailDrawer(house);
    el.detailDrawer.classList.add("is-open");
    el.detailDrawer.setAttribute("aria-hidden", "false");
    el.drawerBackdrop.hidden = isDesktop();
  }

  function closeDrawer(clearSelection = false) {
    state.drawerOpen = false;
    el.detailDrawer.classList.remove("is-open");
    el.detailDrawer.setAttribute("aria-hidden", "true");
    el.drawerBackdrop.hidden = true;

    if (clearSelection) {
      state.selectedHouseId = null;
      el.mapHint.classList.remove("is-hidden");
      if (selectionLayer) selectionLayer.clearLayers();
      clearRouteHighlight();
      renderHouseMarkers();
      renderPoiLayers();
      document.querySelectorAll(".house-card.is-selected, .peek-card.is-selected").forEach((c) => {
        c.classList.remove("is-selected");
      });
    }
  }

  function syncDrawerHideButton(isHidden) {
    if (!el.drawerHideBtn) return;
    el.drawerHideBtn.classList.toggle("is-hidden-active", isHidden);
    el.drawerHideBtn.innerHTML = isHidden ? UI_ICONS.eye : UI_ICONS.eyeOff;
    el.drawerHideBtn.title = isHidden ? "Reexibir imóvel" : "Ocultar imóvel";
    el.drawerHideBtn.setAttribute("aria-label", isHidden ? "Reexibir imóvel" : "Ocultar imóvel");
  }

  function renderDetailDrawer(house) {
    const isFav = Boolean(state.prefs.favorites[house.id]);
    const isHidden = Boolean(state.prefs.hidden[house.id]);
    const isCmp = state.compareIds.includes(house.id);
    const currentStatus = state.prefs.status[house.id] || "";
    const currentNote = state.prefs.notes[house.id] || "";

    el.drawerFavBtn.classList.toggle("is-active", isFav);
    el.drawerCompareBtn.classList.toggle("is-compare-active", isCmp);
    syncDrawerHideButton(isHidden);

    const hasPhotos = house.fotos.length > 0;
    const currentPhotoIdx = hasPhotos
      ? ((state.activePhotoIndex % house.fotos.length) + house.fotos.length) % house.fotos.length
      : 0;
    const photoUrl = hasPhotos ? house.fotos[currentPhotoIdx] : null;
    const heroHtml = photoUrl
      ? `
        <img src="${escapeHtml(photoUrl)}" alt="${escapeHtml(house.titulo)}" id="drawerHeroImg" decoding="async" referrerpolicy="no-referrer" data-photo-idx="${currentPhotoIdx}">
        ${
          house.fotos.length > 1
            ? `<span class="detail-hero__counter">${currentPhotoIdx + 1} / ${house.fotos.length}</span>
              <div class="detail-hero__nav">
                <button type="button" id="prevPhotoBtn" aria-label="Foto anterior">‹</button>
                <button type="button" id="nextPhotoBtn" aria-label="Próxima foto">›</button>
              </div>`
            : ""
        }
      `
      : buildHouseIllustration(house);

    const costParts = [];
    if (house.condominio) costParts.push(`Condomínio ${formatCurrency(house.condominio)}`);
    if (house.iptu) costParts.push(`IPTU ${formatCurrency(house.iptu)}/mês`);
    if (house.preco && house.area_m2) {
      costParts.push(`${formatCurrency(Math.round(house.preco / house.area_m2))}/m²`);
    }

    const featureTags = [
      house.chacara ? { text: "Chácara (true)", accent: true } : { text: "Não é chácara", accent: false },
      house.aceita_pets ? { text: "Aceita pets", accent: true } : null,
      house.quintal ? { text: "Com quintal", accent: true } : null,
      house.terreno_m2 ? { text: `Terreno ${house.terreno_m2.toLocaleString("pt-BR")} m²`, accent: false } : null,
      ...house.tags.map((t) => ({ text: t, accent: false })),
    ].filter(Boolean);

    const lifeMeta = [
      { key: "saude", label: "Farmácia & Saúde", color: CATEGORIES.farmacia.color },
      { key: "rotina", label: "Mercado & Padaria", color: CATEGORIES.mercado.color },
      { key: "plantas", label: "Plantas & Jardim", color: CATEGORIES.plantas.color },
      { key: "parque", label: "Parques & Verde", color: CATEGORIES.parque.color },
    ];

    const lifeBarsHtml = lifeMeta
      .map(
        (m) => `
      <div class="life-row">
        <span class="life-row__label">
          <span style="width:8px;height:8px;border-radius:50%;background:${m.color};flex:none"></span>
          ${m.label}
        </span>
        <div class="life-row__bar">
          <div class="life-row__fill" style="width:${house.scores[m.key]}%;background:${m.color}"></div>
        </div>
        <span class="life-row__val">${house.scores[m.key]}</span>
      </div>
    `
      )
      .join("");

    const insideRadius = house.nearby.filter((item) => item.distance <= state.radiusMeters);
    const nearbyDisplay = insideRadius.length >= 4 ? insideRadius.slice(0, 14) : house.nearby.slice(0, 8);

    const nearbyHtml = nearbyDisplay
      .map((item) => {
        const cat = CATEGORIES[item.categoria] || CATEGORIES.parque;
        const timeStr =
          item.distance <= 2500
            ? `${walkMinutes(item.distance)} min a pé`
            : `${driveMinutes(roadApproxMeters(item.distance))} min carro`;
        return `
          <button type="button" class="nearby-item" data-nearby-id="${escapeHtml(item.id)}">
            <span class="nearby-item__ico" style="background:${cat.color}">${cat.icon}</span>
            <span class="nearby-item__info">
              <span class="nearby-item__name">${escapeHtml(item.nome)}</span>
              <span class="nearby-item__sub">${escapeHtml(cat.label)}${item.source === "osm" ? " · OpenStreetMap" : item.source === "grokbot" ? " · Grokbot" : ""}</span>
            </span>
            <span class="nearby-item__dist">
              <strong>${formatDistance(item.distance)}</strong>
              <small>${timeStr}</small>
            </span>
          </button>
        `;
      })
      .join("");

    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${house.lat},${house.lng}`;
    const streetViewUrl = `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${house.lat},${house.lng}`;
    const osmLoaded = Boolean(state.liveOsmPoisByHouse[house.id]);

    const periodCrimes = getCrimesMatchingPeriod();
    const crimesWithDist = periodCrimes
      .map((c) => ({ ...c, distance: haversine(house.lat, house.lng, c.lat, c.lng) }))
      .sort((a, b) => a.distance - b.distance);
    const crimesInsideRadius = crimesWithDist.filter((c) => c.distance <= state.radiusMeters);
    const crimesToDisplay = (crimesInsideRadius.length ? crimesInsideRadius : crimesWithDist.slice(0, 3)).slice(0, 8);
    const crimesListHtml = crimesToDisplay
      .map((c) => {
        const ct = CRIME_TYPES[c.tipo] || CRIME_TYPES.outro;
        const subParts = [ct.label, c.data ? formatCrimeDate(c.data) : "", c.precisao === "bairro" ? "Aprox. bairro" : "Rua", c.fonte].filter(Boolean);
        return `
          <button type="button" class="crime-nearby-item" data-nearby-crime-id="${escapeHtml(c.id)}">
            <span class="crime-nearby-item__ico" style="background:${ct.color}">${ct.icon}</span>
            <span class="crime-nearby-item__info">
              <span class="crime-nearby-item__title">${escapeHtml(c.titulo)}</span>
              <span class="crime-nearby-item__sub">${escapeHtml(subParts.join(" · "))}</span>
            </span>
            <span class="crime-nearby-item__dist">
              <strong>${formatDistance(c.distance)}</strong>
              <small>${c.distance <= state.radiusMeters ? "No raio" : "Mais próx."}</small>
            </span>
          </button>
        `;
      })
      .join("");
    const safetySectionHtml =
      state.crimes.length === 0
        ? `<div class="detail-section">
            <div class="detail-section__head">
              <h3>Segurança no entorno</h3>
              <small style="color:var(--ink-subtle);font-size:11.5px">data/crimes.json</small>
            </div>
            <div class="crime-summary-banner crime-summary-banner--calm">
              <span>Sem ocorrências cadastradas ainda em data/crimes.json.</span>
              <button type="button" class="link-btn" data-open-crime-legend>Relatório</button>
            </div>
          </div>`
        : `<div class="detail-section">
            <div class="detail-section__head">
              <h3>Segurança no entorno (${formatDistance(state.radiusMeters)})</h3>
              <button type="button" class="link-btn" data-open-crime-legend>Abrir relatório</button>
            </div>
            <div class="crime-summary-banner ${crimesInsideRadius.length === 0 ? "crime-summary-banner--calm" : ""}">
              <span>${
                crimesInsideRadius.length === 0
                  ? `Nenhuma ocorrência registrada em até ${formatDistance(state.radiusMeters)}`
                  : `${crimesInsideRadius.length} ${crimesInsideRadius.length === 1 ? "ocorrência registrada" : "ocorrências registradas"} em até ${formatDistance(state.radiusMeters)}`
              }</span>
            </div>
            ${crimesListHtml ? `<div class="crime-nearby-list">${crimesListHtml}</div>` : ""}
          </div>`;

    const periodTraffic = getTrafficMatchingPeriod();
    const trafficWithDist = periodTraffic
      .map((t) => ({ ...t, distance: haversine(house.lat, house.lng, t.lat, t.lng) }))
      .sort((a, b) => a.distance - b.distance);
    const trafficInsideRadius = trafficWithDist.filter((t) => t.distance <= state.radiusMeters);
    const trafficToDisplay = (trafficInsideRadius.length ? trafficInsideRadius : trafficWithDist.slice(0, 3)).slice(0, 8);
    const trafficListHtml = trafficToDisplay
      .map((t) => {
        const tt = TRAFFIC_TYPES[t.tipo] || TRAFFIC_TYPES.outro;
        const subParts = [tt.label, t.data ? formatCrimeDate(t.data) : "", t.precisao === "bairro" ? "Aprox. bairro" : "Rua", t.fonte].filter(Boolean);
        return `
          <button type="button" class="crime-nearby-item" data-nearby-traffic-id="${escapeHtml(t.id)}">
            <span class="crime-nearby-item__ico" style="background:${tt.color}">${tt.icon}</span>
            <span class="crime-nearby-item__info">
              <span class="crime-nearby-item__title">${escapeHtml(t.titulo)}</span>
              <span class="crime-nearby-item__sub">${escapeHtml(subParts.join(" · "))}</span>
            </span>
            <span class="crime-nearby-item__dist">
              <strong style="color:#b45309">${formatDistance(t.distance)}</strong>
              <small>${t.distance <= state.radiusMeters ? "No raio" : "Mais próx."}</small>
            </span>
          </button>
        `;
      })
      .join("");
    const trafficSectionHtml =
      state.traffic.length === 0
        ? `<div class="detail-section">
            <div class="detail-section__head">
              <h3>Trânsito no entorno</h3>
              <small style="color:var(--ink-subtle);font-size:11.5px">data/transito.json</small>
            </div>
            <div class="crime-summary-banner crime-summary-banner--calm">
              <span>Sem acidentes cadastrados ainda em data/transito.json.</span>
              <button type="button" class="link-btn" data-open-traffic-report>Relatório</button>
            </div>
          </div>`
        : `<div class="detail-section">
            <div class="detail-section__head">
              <h3>Trânsito no entorno (${formatDistance(state.radiusMeters)})</h3>
              <button type="button" class="link-btn" data-open-traffic-report>Abrir relatório</button>
            </div>
            <div class="crime-summary-banner ${trafficInsideRadius.length === 0 ? "crime-summary-banner--calm" : "traffic-summary-banner"}">
              <span>${
                trafficInsideRadius.length === 0
                  ? `Nenhum acidente registrado em até ${formatDistance(state.radiusMeters)}`
                  : `${trafficInsideRadius.length} ${trafficInsideRadius.length === 1 ? "acidente registrado" : "acidentes registrados"} em até ${formatDistance(state.radiusMeters)}`
              }</span>
            </div>
            ${trafficListHtml ? `<div class="crime-nearby-list">${trafficListHtml}</div>` : ""}
          </div>`;

    const referenceCardsHtml = (house.commutes || [])
      .map((c) => {
        const cor = c.cor || "#be185d";
        const dirUrl = buildGoogleMapsDirUrl(house, c);
        const walkSpan = c.roadMeters <= 5000 ? `<span>🚶 ${c.walkMin} min a pé</span>` : "";
        return `
          <div class="routine-card" data-routine-id="${escapeHtml(c.id)}">
            <div class="routine-card__top">
              <span class="routine-card__ico" style="background:${cor}">${getAnchorIcon(c)}</span>
              <div class="routine-card__title">
                <strong>${escapeHtml(c.nome)}</strong>
                <small>${escapeHtml(c.subtitulo || c.endereco || "")}</small>
              </div>
              <div class="routine-card__dist">
                <strong>~${formatDistance(c.roadMeters)}</strong>
                <small>${c.driveMin} min carro</small>
              </div>
            </div>
            <div class="routine-card__modes">
              <div class="routine-card__times">
                <span>🚗 ${c.driveMin} min</span>
                ${walkSpan}
                <span>📏 ${formatDistance(c.straightMeters)} reta</span>
              </div>
              <div class="routine-card__actions">
                <button type="button" class="routine-mini-btn" data-show-anchor="${escapeHtml(c.id)}">Ver no mapa</button>
                <a class="routine-mini-btn" href="${dirUrl}" target="_blank" rel="noopener noreferrer">Rota Maps ↗</a>
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    const dailyRoutineHtml = (house.dailyRoutine || [])
      .map((item) => {
        const cat = CATEGORIES[item.categoria] || CATEGORIES.mercado;
        const dirUrl = buildGoogleMapsDirUrl(house, item);
        return `
          <div class="routine-card" data-nearby-routine-id="${escapeHtml(item.id)}">
            <div class="routine-card__top">
              <span class="routine-card__ico" style="background:${cat.color}">${cat.icon}</span>
              <div class="routine-card__title">
                <strong>${escapeHtml(item.routineLabel)}</strong>
                <small>${escapeHtml(item.nome)}</small>
              </div>
              <div class="routine-card__dist">
                <strong>🚗 ${item.driveMin} min</strong>
                <small>~${formatDistance(item.roadMeters)}</small>
              </div>
            </div>
            <div class="routine-card__modes">
              <div class="routine-card__times">
                <span>🚗 ${item.driveMin} min carro</span>
                ${item.distance <= 1500 ? `<span>🚶 ${item.walkMin} min a pé</span>` : ""}
              </div>
              <div class="routine-card__actions">
                <button type="button" class="routine-mini-btn" data-show-nearby="${escapeHtml(item.id)}">Ver no mapa</button>
                <a class="routine-mini-btn" href="${dirUrl}" target="_blank" rel="noopener noreferrer">Rota ↗</a>
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    el.drawerBody.innerHTML = `
      <div class="detail-hero">${heroHtml}</div>

      <div class="detail-section">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px;flex-wrap:wrap">
          ${house.nova ? `<span class="pill-badge pill-badge--nova">${UI_ICONS.star} Nova</span>` : ""}
          <span class="pill-badge pill-badge--${house.finalidade}">${house.finalidade === "compra" ? "Compra" : "Aluguel"}</span>
          <span class="pill-badge">${escapeHtml(house.tipo)}</span>
          ${house.chacara ? `<span class="pill-badge pill-badge--chacara">${UI_ICONS.chacara} Chácara</span>` : ""}
          ${house.portal ? `<span class="pill-badge">${escapeHtml(house.portal)}</span>` : ""}
          ${house.approxCoords ? `<span class="pill-badge">Posição aprox. pelo bairro</span>` : ""}
        </div>

        <p class="detail-price">
          ${formatCurrency(house.preco)}${house.finalidade === "aluguel" && house.preco ? `<span style="font-family:var(--font-sans);font-size:14px;font-weight:500;color:var(--ink-subtle)"> /mês</span>` : ""}
        </p>
        ${costParts.length ? `<p class="detail-costs">${escapeHtml(costParts.join(" · "))}</p>` : ""}

        <h2 class="detail-title">${escapeHtml(house.titulo)}</h2>
        <p class="detail-address">${escapeHtml(house.bairro)}${house.endereco ? ` · ${escapeHtml(house.endereco)}` : ""} · Botucatu e região, SP</p>

        ${
          house.link
            ? `<div class="detail-top-cta">
                <a class="btn-primary" href="${escapeHtml(house.link)}" target="_blank" rel="noopener noreferrer">Ir para o imóvel ${UI_ICONS.external}</a>
              </div>`
            : ""
        }

        <div class="detail-specs-grid">
          <div class="spec-box"><strong>${house.quartos || "—"}</strong><span>Quartos${house.suites ? ` (${house.suites}s)` : ""}</span></div>
          <div class="spec-box"><strong>${house.banheiros || "—"}</strong><span>Banheiros</span></div>
          <div class="spec-box"><strong>${house.vagas || "—"}</strong><span>Vagas</span></div>
          <div class="spec-box"><strong>${house.area_m2 ? `${house.area_m2}m²` : "—"}</strong><span>Área útil</span></div>
        </div>

        ${
          featureTags.length
            ? `<div class="detail-tags">${featureTags
                .map((t) => `<span class="detail-tag ${t.accent ? "detail-tag--accent" : ""}">${escapeHtml(t.text)}</span>`)
                .join("")}</div>`
            : ""
        }

        ${house.descricao ? `<p style="margin:14px 0 0;color:var(--ink-muted);font-size:13.5px;line-height:1.6">${escapeHtml(house.descricao)}</p>` : ""}

        ${
          house.nota_grokbot
            ? `<div class="grokbot-box">
                <div class="grokbot-box__label">✦ Observações e destaques</div>
                <p>${escapeHtml(house.nota_grokbot)}</p>
              </div>`
            : ""
        }
      </div>

      ${
        referenceCardsHtml
          ? `<div class="detail-section">
              <div class="detail-section__head">
                <h3>Distância até a Casa Tata</h3>
                <small style="color:var(--ink-subtle);font-size:11.5px">CEP 18601-542</small>
              </div>
              <div class="routine-grid">${referenceCardsHtml}</div>
            </div>`
          : ""
      }

      ${
        dailyRoutineHtml
          ? `<div class="detail-section">
              <div class="detail-section__head">
                <h3>Rotina diária (de carro)</h3>
                <small style="color:var(--ink-subtle);font-size:11.5px">Saúde, compras e plantas</small>
              </div>
              <div class="routine-grid">${dailyRoutineHtml}</div>
            </div>`
          : ""
      }

      <div class="detail-section">
        <div class="detail-section__head">
          <h3>O que tem por perto (${formatDistance(state.radiusMeters)})</h3>
          <span class="house-card__score">Nota ${house.overallScore}/100</span>
        </div>

        <div class="lifestyle-bars">${lifeBarsHtml}</div>

        <div class="nearby-list">${nearbyHtml}</div>

        <button type="button" class="btn-outline osm-scan-btn" id="osmScanBtn" ${osmLoaded ? "disabled" : ""}>
          ${osmLoaded ? "✓ Lugares extras do OpenStreetMap carregados" : "Explorar mais lugares ao vivo (OpenStreetMap)"}
        </button>
      </div>

      ${safetySectionHtml}
      ${trafficSectionHtml}

      <div class="detail-section">
        <div class="detail-section__head">
          <h3>Minhas anotações</h3>
          <small style="color:var(--ink-subtle);font-size:11.5px">Salvo no aparelho</small>
        </div>
        <div class="status-pills">
          ${STATUS_OPTIONS.map(
            (opt) =>
              `<button type="button" class="status-pill ${currentStatus === opt.id ? "is-active" : ""}" data-status-val="${opt.id}">${opt.label}</button>`
          ).join("")}
        </div>
        <textarea class="notes-area" id="drawerNotesInput" placeholder="Ex: Vista linda, estrada de terra boa, perguntar sobre escritura ou poço…">${escapeHtml(currentNote)}</textarea>
      </div>

      <div class="detail-section">
        <div class="detail-cta-row">
          <a class="btn-outline" href="${mapsUrl}" target="_blank" rel="noopener noreferrer">Google Maps</a>
          <a class="btn-outline" href="${streetViewUrl}" target="_blank" rel="noopener noreferrer">Street View</a>
        </div>
      </div>
    `;

    const heroImg = document.getElementById("drawerHeroImg");
    if (heroImg) {
      let failedTries = 0;
      heroImg.addEventListener("error", () => {
        failedTries++;
        if (failedTries < house.fotos.length) {
          state.activePhotoIndex = (state.activePhotoIndex + 1) % house.fotos.length;
          heroImg.src = house.fotos[state.activePhotoIndex];
          const counter = el.drawerBody.querySelector(".detail-hero__counter");
          if (counter) counter.textContent = `${state.activePhotoIndex + 1} / ${house.fotos.length}`;
        } else {
          heroImg.outerHTML = buildHouseIllustration(house);
        }
      });
    }
    const prevBtn = document.getElementById("prevPhotoBtn");
    const nextBtn = document.getElementById("nextPhotoBtn");
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener("click", () => {
        state.activePhotoIndex = (state.activePhotoIndex - 1 + house.fotos.length) % house.fotos.length;
        renderDetailDrawer(house);
      });
      nextBtn.addEventListener("click", () => {
        state.activePhotoIndex = (state.activePhotoIndex + 1) % house.fotos.length;
        renderDetailDrawer(house);
      });

      const heroBox = el.drawerBody.querySelector(".detail-hero");
      if (heroBox) {
        let startX = 0;
        heroBox.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
        heroBox.addEventListener("touchend", (e) => {
          const dx = e.changedTouches[0].clientX - startX;
          if (Math.abs(dx) > 40) {
            state.activePhotoIndex =
              dx < 0
                ? (state.activePhotoIndex + 1) % house.fotos.length
                : (state.activePhotoIndex - 1 + house.fotos.length) % house.fotos.length;
            renderDetailDrawer(house);
          }
        }, { passive: true });
      }
    }

    // Wire Casa Tata reference card
    el.drawerBody.querySelectorAll("[data-show-anchor]").forEach((btn) => {
      const anchor = (house.commutes || []).find((c) => c.id === btn.dataset.showAnchor);
      if (!anchor) return;
      btn.addEventListener("mouseenter", () => highlightRouteToAnchor(house, anchor));
      btn.addEventListener("mouseleave", () => clearRouteHighlight());
      btn.addEventListener("click", () => {
        if (!state.activeCategories.has("referencia")) {
          state.activeCategories.add("referencia");
          renderPoiCategoryDock();
          renderPoiLayers();
        }
        if (!isDesktop()) {
          closeDrawer(false);
          switchMobileTab("mapa");
        }
        highlightRouteToAnchor(house, anchor);
        const bounds = L.latLngBounds([
          [house.lat, house.lng],
          [anchor.lat, anchor.lng],
        ]);
        map.fitBounds(bounds, {
          paddingTopLeft: [50, isDesktop() ? 80 : 140],
          paddingBottomRight: [50, isDesktop() ? 80 : 165],
          maxZoom: 15,
          animate: true,
        });
        const entry = anchorMarkers.get(anchor.id);
        if (entry) setTimeout(() => entry.marker.openPopup(), 450);
      });
    });

    el.drawerBody.querySelectorAll("[data-show-nearby]").forEach((btn) => {
      const item = house.nearby.find((n) => n.id === btn.dataset.showNearby);
      if (!item) return;
      btn.addEventListener("mouseenter", () => highlightRouteToPoi(house, item));
      btn.addEventListener("mouseleave", () => clearRouteHighlight());
      btn.addEventListener("click", () => {
        if (!state.activeCategories.has(item.categoria)) {
          state.activeCategories.add(item.categoria);
          renderPoiCategoryDock();
          renderPoiLayers();
        }
        if (!isDesktop()) {
          closeDrawer(false);
          switchMobileTab("mapa");
        }
        highlightRouteToPoi(house, item);
        map.flyTo([(house.lat + item.lat) / 2, (house.lng + item.lng) / 2], 15, { duration: 0.5 });
        const markerEntry = poiMarkers.get(item.id);
        if (markerEntry) setTimeout(() => markerEntry.marker.openPopup(), 450);
      });
    });

    el.drawerBody.querySelectorAll(".nearby-item").forEach((btn) => {
      const item = house.nearby.find((n) => n.id === btn.dataset.nearbyId);
      if (!item) return;

      btn.addEventListener("mouseenter", () => highlightRouteToPoi(house, item));
      btn.addEventListener("mouseleave", () => clearRouteHighlight());
      btn.addEventListener("click", () => {
        if (!state.activeCategories.has(item.categoria)) {
          state.activeCategories.add(item.categoria);
          renderPoiCategoryDock();
          renderPoiLayers();
        }
        if (!isDesktop()) {
          closeDrawer(false);
          switchMobileTab("mapa");
        }
        highlightRouteToPoi(house, item);
        map.flyTo([(house.lat + item.lat) / 2, (house.lng + item.lng) / 2], 15, { duration: 0.5 });
        const markerEntry = poiMarkers.get(item.id);
        if (markerEntry) setTimeout(() => markerEntry.marker.openPopup(), 450);
      });
    });

    const osmBtn = document.getElementById("osmScanBtn");
    if (osmBtn && !osmLoaded) {
      osmBtn.addEventListener("click", () => fetchLiveOsmPois(house, osmBtn));
    }

    el.drawerBody.querySelectorAll("[data-open-crime-legend]").forEach((btn) => {
      btn.addEventListener("click", () => {
        openCrimeReport("crimes");
      });
    });

    el.drawerBody.querySelectorAll("[data-open-traffic-report]").forEach((btn) => {
      btn.addEventListener("click", () => {
        openCrimeReport("transito");
      });
    });

    el.drawerBody.querySelectorAll("[data-nearby-traffic-id]").forEach((btn) => {
      const item = state.traffic.find((t) => t.id === btn.dataset.nearbyTrafficId);
      if (!item) return;
      btn.addEventListener("mouseenter", () => highlightRouteToTraffic(house, item));
      btn.addEventListener("mouseleave", () => clearRouteHighlight());
      btn.addEventListener("click", () => {
        if (!state.showTraffic || !state.activeTrafficTypes.has(item.tipo)) {
          state.showTraffic = true;
          state.activeTrafficTypes.add(item.tipo);
          refreshCrimeViews();
        }
        if (!isDesktop()) {
          closeDrawer(false);
          switchMobileTab("mapa");
        }
        highlightRouteToTraffic(house, item);
        map.flyTo([item.displayLat, item.displayLng], Math.max(map.getZoom(), 15), { duration: 0.5 });
        const entry = trafficMarkers.get(item.id);
        if (entry) setTimeout(() => entry.marker.openPopup(), 450);
      });
    });

    el.drawerBody.querySelectorAll("[data-nearby-crime-id]").forEach((btn) => {
      const crime = state.crimes.find((c) => c.id === btn.dataset.nearbyCrimeId);
      if (!crime) return;
      btn.addEventListener("mouseenter", () => highlightRouteToCrime(house, crime));
      btn.addEventListener("mouseleave", () => clearRouteHighlight());
      btn.addEventListener("click", () => {
        if (!state.showCrimes || !state.activeCrimeTypes.has(crime.tipo)) {
          state.showCrimes = true;
          state.activeCrimeTypes.add(crime.tipo);
          renderPoiCategoryDock();
          renderCrimeLayer();
        }
        if (!isDesktop()) {
          closeDrawer(false);
          switchMobileTab("mapa");
        }
        highlightRouteToCrime(house, crime);
        map.flyTo([crime.displayLat, crime.displayLng], Math.max(map.getZoom(), 15), { duration: 0.5 });
        const entry = crimeMarkers.get(crime.id);
        if (entry) setTimeout(() => entry.marker.openPopup(), 450);
      });
    });

    el.drawerBody.querySelectorAll("[data-status-val]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const val = btn.dataset.statusVal;
        if (val) state.prefs.status[house.id] = val;
        else delete state.prefs.status[house.id];
        savePrefs();
        el.drawerBody.querySelectorAll("[data-status-val]").forEach((b) => {
          b.classList.toggle("is-active", b.dataset.statusVal === val);
        });
        renderListings();
      });
    });

    const notesInput = document.getElementById("drawerNotesInput");
    if (notesInput) {
      notesInput.addEventListener("input", () => {
        const text = notesInput.value.trim();
        if (text) state.prefs.notes[house.id] = notesInput.value;
        else delete state.prefs.notes[house.id];
        savePrefs();
      });
    }
  }

  async function fetchLiveOsmPois(house, button) {
    button.disabled = true;
    button.textContent = "Consultando OpenStreetMap…";

    const r = Math.min(state.radiusMeters, 2000);
    const query = `
      [out:json][timeout:12];
      (
        node["amenity"~"pharmacy|hospital|clinic|doctors|cafe|veterinary"](around:${r},${house.lat},${house.lng});
        node["shop"~"supermarket|bakery|florist|garden_centre|pet"](around:${r},${house.lat},${house.lng});
        node["leisure"~"park|garden|dog_park"](around:${r},${house.lat},${house.lng});
      );
      out body 40;
    `;

    try {
      const resp = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: "data=" + encodeURIComponent(query),
      });
      if (!resp.ok) throw new Error("Indisponível");
      const data = await resp.json();

      const mapped = [];
      for (const elNode of data.elements || []) {
        const t = elNode.tags || {};
        if (!t.name) continue;
        let categoria = null;
        if (t.amenity === "pharmacy") categoria = "farmacia";
        else if (t.amenity === "hospital" || t.amenity === "clinic" || t.amenity === "doctors" || t.amenity === "veterinary") categoria = "saude";
        else if (t.shop === "florist" || t.shop === "garden_centre" || t.leisure === "garden") categoria = "plantas";
        else if (t.shop === "supermarket") categoria = "mercado";
        else if (t.amenity === "cafe" || t.shop === "bakery") categoria = "cafe";
        else if (t.leisure === "park") categoria = "parque";
        else if (t.leisure === "dog_park" || t.shop === "pet") categoria = "pet";
        if (!categoria) continue;

        mapped.push({
          id: `osm-${elNode.id}`,
          nome: t.name,
          categoria,
          lat: elNode.lat,
          lng: elNode.lon,
          detalhe: "Descoberto ao vivo via OpenStreetMap",
          source: "osm",
        });
      }

      state.liveOsmPoisByHouse[house.id] = mapped;
      computeHouseProximities(house);
      renderPoiLayers();
      renderSelectionOverlay(house);
      renderDetailDrawer(house);
      showToast(mapped.length ? `${mapped.length} lugares extras encontrados!` : "Nenhum lugar extra encontrado nesse raio.");
    } catch (_) {
      button.disabled = false;
      button.textContent = "Explorar mais lugares ao vivo (OpenStreetMap)";
      showToast("OpenStreetMap indisponível agora. O mapa local continua ativo.");
    }
  }

  // ==================== FAVORITES, COMPARE & TABS ====================

  function toggleFavorite(houseId) {
    if (state.prefs.favorites[houseId]) delete state.prefs.favorites[houseId];
    else state.prefs.favorites[houseId] = true;
    savePrefs();

    if (state.selectedHouseId === houseId) {
      el.drawerFavBtn.classList.toggle("is-active", Boolean(state.prefs.favorites[houseId]));
    }
    applyFiltersAndRender(false);
    showToast(state.prefs.favorites[houseId] ? "Salvo em Favoritos" : "Removido dos favoritos");
  }

  function toggleHidden(houseId) {
    const willHide = !state.prefs.hidden[houseId];
    if (willHide) {
      state.prefs.hidden[houseId] = true;
      const cmpIdx = state.compareIds.indexOf(houseId);
      if (cmpIdx >= 0) {
        state.compareIds.splice(cmpIdx, 1);
        const cnt = String(state.compareIds.length);
        el.compareCount.textContent = cnt;
        el.mobileCompareCount.textContent = cnt;
        el.compareOpenBtn.hidden = state.compareIds.length < 2;
        el.mobileCompareBtn.hidden = state.compareIds.length < 2;
      }
    } else {
      delete state.prefs.hidden[houseId];
    }

    const hiddenCount = getHiddenHousesCount();
    if (hiddenCount === 0) {
      state.filters.ocultos = false;
    }
    savePrefs();

    if (state.selectedHouseId === houseId) {
      const viewingHidden =
        state.filters.ocultos || (!isDesktop() && state.activeTab === "salvas" && state.savedFilter === "ocultos");
      if (willHide && !viewingHidden) {
        closeDrawer(true);
      } else {
        syncDrawerHideButton(Boolean(state.prefs.hidden[houseId]));
      }
    }

    applyFiltersAndRender(false);
    showToast(willHide ? "Imóvel ocultado · Veja no filtro Ocultos" : "Imóvel exibido novamente");
  }

  function toggleCompare(houseId) {
    const idx = state.compareIds.indexOf(houseId);
    if (idx >= 0) {
      state.compareIds.splice(idx, 1);
    } else {
      if (state.compareIds.length >= 3) {
        showToast("Compare até 3 imóveis por vez.");
        return;
      }
      state.compareIds.push(houseId);
      showToast(
        state.compareIds.length >= 2
          ? `${state.compareIds.length} imóveis selecionados para comparar!`
          : "Adicionado. Escolha mais 1 imóvel para comparar."
      );
    }

    const cnt = String(state.compareIds.length);
    el.compareCount.textContent = cnt;
    el.mobileCompareCount.textContent = cnt;
    el.compareOpenBtn.hidden = state.compareIds.length < 2;
    el.mobileCompareBtn.hidden = state.compareIds.length < 2;

    if (state.selectedHouseId === houseId) {
      el.drawerCompareBtn.classList.toggle("is-compare-active", state.compareIds.includes(houseId));
    }
    renderListings();
  }

  function openCompareModal() {
    const houses = state.compareIds
      .map((id) => state.houses.find((h) => h.id === id))
      .filter(Boolean);
    if (houses.length < 2) return;

    el.compareBody.innerHTML = `
      <div class="compare-grid">
        ${houses
          .map(
            (h) => `
          <div class="compare-col">
            <div class="compare-col__head">
              <h3>${escapeHtml(h.titulo)}</h3>
              <button type="button" class="icon-btn" data-remove-cmp="${escapeHtml(h.id)}" aria-label="Remover">×</button>
            </div>
            <div class="compare-col__price">
              ${formatCurrency(h.preco)}${h.finalidade === "aluguel" ? "<small style='font-size:12px;font-weight:500'>/mês</small>" : ""}
            </div>
            <div class="compare-rows">
              <div class="compare-row"><span>Bairro / Região</span><strong>${escapeHtml(h.bairro)}</strong></div>
              <div class="compare-row"><span>Chácara</span><strong>${h.chacara ? "Sim (Chácara)" : "Não"}</strong></div>
              <div class="compare-row"><span>Área útil</span><strong>${h.area_m2 ? `${h.area_m2} m²` : "—"}</strong></div>
              <div class="compare-row"><span>Terreno</span><strong>${h.terreno_m2 ? `${h.terreno_m2.toLocaleString("pt-BR")} m²` : "—"}</strong></div>
              <div class="compare-row"><span>Quartos / Vagas</span><strong>${h.quartos || "—"} qtos · ${h.vagas || "—"} vagas</strong></div>
              <div class="compare-row"><span>Pets / Quintal</span><strong>${h.aceita_pets ? "Sim" : "Não"} · ${h.quintal ? "Quintal" : "—"}</strong></div>
              <div class="compare-row"><span>Nota entorno</span><strong>${h.overallScore}/100</strong></div>
              <div class="compare-row"><span>Casa Tata</span><strong>~${formatDistance(h.casaTataDist)} (${driveMinutes(h.casaTataDist)} min 🚗)</strong></div>
              <div class="compare-row"><span>Farmácia</span><strong>${h.nearestByCat.farmacia ? `${driveMinutes(roadApproxMeters(h.nearestByCat.farmacia.distance))} min 🚗 (${formatDistance(h.nearestByCat.farmacia.distance)})` : "—"}</strong></div>
              <div class="compare-row"><span>Hospital / Saúde</span><strong>${h.nearestByCat.saude ? `${driveMinutes(roadApproxMeters(h.nearestByCat.saude.distance))} min 🚗 (${formatDistance(h.nearestByCat.saude.distance)})` : "—"}</strong></div>
              <div class="compare-row"><span>Mercado</span><strong>${h.nearestByCat.mercado ? `${driveMinutes(roadApproxMeters(h.nearestByCat.mercado.distance))} min 🚗 (${formatDistance(h.nearestByCat.mercado.distance)})` : "—"}</strong></div>
              <div class="compare-row"><span>Padaria</span><strong>${h.nearestByCat.cafe ? `${driveMinutes(roadApproxMeters(h.nearestByCat.cafe.distance))} min 🚗 (${formatDistance(h.nearestByCat.cafe.distance)})` : "—"}</strong></div>
              <div class="compare-row"><span>Plantas / Viveiro</span><strong>${h.nearestByCat.plantas ? `${driveMinutes(roadApproxMeters(h.nearestByCat.plantas.distance))} min 🚗 (${formatDistance(h.nearestByCat.plantas.distance)})` : "—"}</strong></div>
              ${
                state.crimes.length > 0
                  ? `<div class="compare-row"><span>Ocorrências (${formatDistance(state.radiusMeters)})</span><strong>${
                      getCrimesMatchingPeriod().filter((c) => haversine(h.lat, h.lng, c.lat, c.lng) <= state.radiusMeters).length
                    }</strong></div>`
                  : ""
              }
              ${
                state.traffic.length > 0
                  ? `<div class="compare-row"><span>Acidentes (${formatDistance(state.radiusMeters)})</span><strong>${
                      getTrafficMatchingPeriod().filter((t) => haversine(h.lat, h.lng, t.lat, t.lng) <= state.radiusMeters).length
                    }</strong></div>`
                  : ""
              }
            </div>
            <button type="button" class="btn-outline btn-sm" data-focus-house="${escapeHtml(h.id)}">Ver no mapa</button>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    el.compareBody.querySelectorAll("[data-remove-cmp]").forEach((btn) => {
      btn.addEventListener("click", () => {
        toggleCompare(btn.dataset.removeCmp);
        if (state.compareIds.length < 2) closeModal("compareModal");
        else openCompareModal();
      });
    });
    el.compareBody.querySelectorAll("[data-focus-house]").forEach((btn) => {
      btn.addEventListener("click", () => {
        closeModal("compareModal");
        switchMobileTab("mapa");
        openHouseDetails(btn.dataset.focusHouse, { fly: true });
      });
    });
    openModal("compareModal");
  }

  function switchMobileTab(tab) {
    state.activeTab = tab;
    document.body.dataset.tab = tab;
    document.querySelectorAll("[data-nav-tab]").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.navTab === tab);
    });
    if (tab === "mapa" && map) {
      setTimeout(() => map.invalidateSize(), 180);
    } else if (tab === "crimes") {
      renderCrimeReport();
    } else {
      renderListings();
    }
    syncCrimeBadges();
    renderPoiCategoryDock();
  }

  // ==================== MODALS & GROKBOT JSON ====================

  function openModal(id) {
    const m = document.getElementById(id);
    if (m) m.hidden = false;
  }

  function closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.hidden = true;
  }

  function resetAllFilters() {
    state.filters = {
      query: "",
      finalidade: "todas",
      chacara: "todas",
      minQuartos: 0,
      sort: "casa_tata",
      pets: false,
      quintal: false,
      novas: false,
      favoritas: false,
      ocultos: false,
      near: new Set(),
    };
    el.searchInput.value = "";
    el.clearSearchBtn.hidden = true;
    applyFiltersAndRender(true);
  }

  // ==================== EVENT WIRING ====================

  function bindEvents() {
    document.querySelectorAll("[data-ico]").forEach((span) => {
      const k = span.dataset.ico;
      if (CATEGORIES[k]) span.innerHTML = CATEGORIES[k].icon;
      else if (UI_ICONS[k]) span.innerHTML = UI_ICONS[k];
    });

    // Mobile bottom tabs
    document.querySelectorAll("[data-nav-tab]").forEach((btn) => {
      btn.addEventListener("click", () => switchMobileTab(btn.dataset.navTab));
    });

    // Desktop header Crime & Traffic Report buttons
    if (el.openCrimeReportBtn) {
      el.openCrimeReportBtn.addEventListener("click", () => {
        if (isCrimeReportOpen() && state.reportKind === "crimes") closeCrimeReport();
        else openCrimeReport("crimes");
      });
    }
    if (el.openTrafficReportBtn) {
      el.openTrafficReportBtn.addEventListener("click", () => {
        if (isCrimeReportOpen() && state.reportKind === "transito") closeCrimeReport();
        else openCrimeReport("transito");
      });
    }

    // Mobile saved sub-pills
    document.querySelectorAll("[data-saved-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.savedFilter = btn.dataset.savedFilter;
        document.querySelectorAll("[data-saved-filter]").forEach((b) => {
          b.classList.toggle("is-active", b === btn);
        });
        renderListings();
      });
    });

    // Search
    el.searchInput.addEventListener("input", () => {
      state.filters.query = el.searchInput.value;
      el.clearSearchBtn.hidden = !state.filters.query;
      applyFiltersAndRender(false);
    });
    el.clearSearchBtn.addEventListener("click", () => {
      el.searchInput.value = "";
      state.filters.query = "";
      el.clearSearchBtn.hidden = true;
      applyFiltersAndRender(false);
    });

    // Filters bottom sheet
    el.openFiltersBtn.addEventListener("click", () => openModal("filtersModal"));
    el.sheetApplyFiltersBtn.addEventListener("click", () => closeModal("filtersModal"));
    el.sheetClearFiltersBtn.addEventListener("click", () => {
      resetAllFilters();
      showToast("Filtros limpos.");
    });

    // Finalidade (synced between inline bar & filter sheet)
    document.querySelectorAll("[data-finalidade]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.filters.finalidade = btn.dataset.finalidade;
        applyFiltersAndRender(false);
      });
    });

    // Chácara filter (3-way segmented in sheet + quick toggle chip in inline bar)
    document.querySelectorAll("[data-chacara]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.filters.chacara = btn.dataset.chacara;
        applyFiltersAndRender(false);
      });
    });
    document.querySelectorAll("[data-chacara-quick]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const val = btn.dataset.chacaraQuick;
        state.filters.chacara = state.filters.chacara === val ? "todas" : val;
        applyFiltersAndRender(false);
      });
    });

    // Quartos pills in filter sheet
    document.querySelectorAll("[data-quartos]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.filters.minQuartos = Number(btn.dataset.quartos) || 0;
        applyFiltersAndRender(false);
      });
    });

    // Sort selects
    el.sortFilter.addEventListener("change", () => {
      state.filters.sort = el.sortFilter.value;
      applyFiltersAndRender(false);
    });
    el.sheetSortSelect.addEventListener("change", () => {
      state.filters.sort = el.sheetSortSelect.value;
      applyFiltersAndRender(false);
    });

    // Toggle chips (pets, quintal, favoritas)
    document.querySelectorAll("[data-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.toggle;
        state.filters[key] = !state.filters[key];
        applyFiltersAndRender(false);
      });
    });

    // Near chips
    document.querySelectorAll("[data-near]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const cat = btn.dataset.near;
        if (state.filters.near.has(cat)) state.filters.near.delete(cat);
        else state.filters.near.add(cat);
        applyFiltersAndRender(false);
      });
    });

    el.resetFiltersBtn.addEventListener("click", resetAllFilters);
    el.emptyResetBtn.addEventListener("click", () => {
      if (!isDesktop() && state.activeTab === "salvas") {
        switchMobileTab("mapa");
      } else if (el.emptyResetBtn.dataset.emptyAction === "show-hidden") {
        state.filters.ocultos = true;
        applyFiltersAndRender(true);
      } else {
        resetAllFilters();
      }
    });

    // Carousel swipe listener
    el.mapCarousel.addEventListener("scroll", handleCarouselScroll, { passive: true });

    // Mobile map FABs
    el.cycleRadiusBtn.addEventListener("click", () => {
      const idx = RADIUS_STEPS.indexOf(state.radiusMeters);
      const next = RADIUS_STEPS[(idx + 1) % RADIUS_STEPS.length];
      setRadius(next);
      showToast(`Raio de proximidade: ${formatDistance(next)}`);
    });
    el.cycleBasemapBtn.addEventListener("click", () => {
      const idx = BASEMAP_STEPS.findIndex((b) => b.id === state.basemap);
      const next = BASEMAP_STEPS[(idx + 1) % BASEMAP_STEPS.length];
      setBasemap(next.id);
      showToast(`Mapa: ${next.label}`);
    });
    el.fitBoundsMobileBtn.addEventListener("click", () => fitMapToHouses());
    el.fitBoundsBtn.addEventListener("click", () => fitMapToHouses());

    // Desktop radius & basemap controls
    document.querySelectorAll("[data-radius]").forEach((btn) => {
      btn.addEventListener("click", () => setRadius(Number(btn.dataset.radius) || 1000));
    });
    document.querySelectorAll("[data-basemap]").forEach((btn) => {
      btn.addEventListener("click", () => setBasemap(btn.dataset.basemap));
    });

    // Detail drawer controls + swipe down on grab handle to close
    el.closeDrawerBtn.addEventListener("click", () => closeDrawer(isDesktop()));
    el.drawerBackdrop.addEventListener("click", () => closeDrawer(false));
    el.drawerPeekMapBtn.addEventListener("click", () => {
      closeDrawer(false);
      switchMobileTab("mapa");
    });
    el.drawerFavBtn.addEventListener("click", () => {
      if (state.selectedHouseId) toggleFavorite(state.selectedHouseId);
    });
    el.drawerHideBtn.addEventListener("click", () => {
      if (state.selectedHouseId) toggleHidden(state.selectedHouseId);
    });
    el.drawerCompareBtn.addEventListener("click", () => {
      if (state.selectedHouseId) toggleCompare(state.selectedHouseId);
    });

    let touchStartY = 0;
    el.drawerGrab.addEventListener("touchstart", (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    el.drawerGrab.addEventListener("touchend", (e) => {
      const deltaY = e.changedTouches[0].clientY - touchStartY;
      if (deltaY > 40) closeDrawer(false);
    }, { passive: true });

    // Compare modals
    el.compareOpenBtn.addEventListener("click", openCompareModal);
    el.mobileCompareBtn.addEventListener("click", openCompareModal);

    document.querySelectorAll("[data-close-modal]").forEach((btn) => {
      btn.addEventListener("click", () => closeModal(btn.dataset.closeModal));
    });
    document.querySelectorAll(".modal-backdrop").forEach((bg) => {
      bg.addEventListener("click", (e) => {
        if (e.target === bg) bg.hidden = true;
      });
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeModal("compareModal");
        closeModal("filtersModal");
        if (state.crimeLegendOpen) {
          state.crimeLegendOpen = false;
          renderPoiCategoryDock();
          renderCrimeLegendPanel();
        }
        if (state.drawerOpen) closeDrawer(isDesktop());
      }
    });

    window.addEventListener("resize", () => {
      if (map) map.invalidateSize();
      if (state.drawerOpen) el.drawerBackdrop.hidden = isDesktop();
    });
  }

  // ==================== BOOTSTRAP ====================

  async function init() {
    bindEvents();
    renderPoiCategoryDock();

    try {
      const params = new URLSearchParams(window.location.search);
      const externalJsonUrl = params.get("json");
      const externalCrimesUrl = params.get("crimes");
      const externalTrafficUrl = params.get("transito");
      const casasUrl = externalJsonUrl || "./data/casas.json";
      const crimesUrl = externalCrimesUrl || "./data/crimes.json";
      const trafficUrl = externalTrafficUrl || "./data/transito.json";

      const [cityResp, casasResp, crimesResp, trafficResp] = await Promise.all([
        fetch("./data/botucatu-pois.json", { cache: "no-cache" }),
        fetch(casasUrl, { cache: "no-cache" }),
        fetch(crimesUrl, { cache: "no-cache" }).catch(() => null),
        fetch(trafficUrl, { cache: "no-cache" }).catch(() => null),
      ]);

      if (!cityResp.ok) throw new Error("Não foi possível carregar data/botucatu-pois.json");
      if (!casasResp.ok) throw new Error(`Não foi possível carregar ${casasUrl}`);

      state.cityData = await cityResp.json();
      state.publishedFeed = await casasResp.json();

      if (crimesResp && crimesResp.ok) {
        try {
          const crimesJson = await crimesResp.json();
          ingestCrimes(crimesJson);
        } catch (crimeErr) {
          console.warn("Aviso ao ler data/crimes.json:", crimeErr);
          ingestCrimes(null);
        }
      }

      if (trafficResp && trafficResp.ok) {
        try {
          const trafficJson = await trafficResp.json();
          ingestTraffic(trafficJson);
        } catch (trafficErr) {
          console.warn("Aviso ao ler data/transito.json:", trafficErr);
          ingestTraffic(null);
        }
      }

      initMap();
      syncCrimeBadges();
      renderPoiCategoryDock();
      ingestFeed(state.publishedFeed, false);
    } catch (err) {
      console.error(err);
      el.feedStatusText.textContent = "Erro ao carregar JSON";
      el.resultsCount.textContent = "Abra via servidor HTTP (python -m http.server)";
      el.listingsContainer.innerHTML = `
        <div class="empty-state">
          <h3>Não foi possível carregar data/casas.json</h3>
          <p>${escapeHtml(err.message)}. Para testar localmente, rode <code>python -m http.server</code> na pasta do site (ou publique no GitHub Pages).</p>
        </div>
      `;
    }
  }

  init();
})();
