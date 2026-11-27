// Dados do site. Os números vêm dos formulários (n=18 e n=15), do mapa comportamental
// e das medições do grupo em 23/11/2026.

export const MIN = 60000

export const Z = {
  corredor: { n: 'corredor central', s: 'Corredor central' },
  mezanino: { n: 'mezanino', s: 'Mezanino' },
  deck: { n: 'deck lateral', s: 'Deck lateral' },
  jardim: { n: 'jardim (zona de pausa)', s: 'Jardim · pausa' },
}
export const ZONES = Object.keys(Z)

export const H = Array.from({ length: 16 }, (_, i) => i + 7)
export const hourIdx = (h) => Math.min(15, Math.max(0, h - 7))
export const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']

// Estimativa inicial de barulho (0 calmo a 100 barulhento), das 7h às 22h
export const BASE = {
  corredor: [20, 30, 45, 60, 65, 80, 90, 70, 50, 45, 55, 70, 75, 60, 40, 25],
  mezanino: [15, 20, 35, 50, 55, 75, 85, 65, 40, 35, 40, 50, 55, 45, 30, 20],
  deck: [10, 10, 20, 25, 25, 35, 40, 30, 25, 20, 25, 30, 35, 30, 20, 10],
  jardim: [10, 10, 15, 20, 20, 30, 35, 25, 20, 15, 15, 20, 20, 15, 10, 10],
}

export const photo = (z, night) =>
  ({
    corredor: night ? 'corredor-noite' : 'corredor-dia',
    mezanino: night ? 'mezanino-noite' : 'mezanino-dia',
    deck: 'deck-noite',
    jardim: night ? 'jardim-noite' : 'jardim-dia',
  })[z]
export const img = (name) => `${import.meta.env.BASE_URL}img/${name}.jpg`

// Vila ao vivo
export const Q = [
  ['noise', 'Barulho', ['Calmo', 'Normal', 'Barulhento']],
  ['crowd', 'Movimento', ['Vazio', 'Movimentado', 'Cheio']],
  ['heat', 'Temperatura', ['Fresco', 'Ok', 'Quente']],
]
export const TAGS = ['Mesas livres', 'Fila grande', 'Música alta', 'Sujo', 'Evento rolando', 'Mesa quebrada']
export const SHAPES = {
  corredor: { d: 'M104 154 H560 V222 H104 Z', lx: 124, ly: 184 },
  mezanino: { d: 'M318 236 H560 V336 H318 Z', lx: 336, ly: 268 },
  deck: { d: 'M400 350 H590 V422 H400 Z', lx: 414, ly: 380 },
  jardim: {
    d: 'M40 248 C70 226 150 224 230 238 C292 250 300 300 290 340 C276 396 200 418 120 410 C60 404 26 370 30 318 C32 288 30 262 40 248 Z',
    lx: 70,
    ly: 290,
  },
}
export const CANTEIROS = [
  [96, 336, 1],
  [150, 372, 2],
  [206, 388, 3],
  [262, 350, 4],
  [70, 368, 5],
]

// Onde ficar
export const NEEDS = [
  ['descansar', 'Descansar'],
  ['calor', 'Fugir do calor'],
  ['comer', 'Comer rápido'],
  ['estudar', 'Estudar'],
  ['grupo', 'Conversar em grupo'],
]
export const PERS = [
  ['manha', 'Manhã'],
  ['tarde', 'Tarde'],
  ['noite', 'Noite'],
]
export const R = {
  descansar: {
    manha: ['jardim', 'Bancos à sombra da mangueira, na zona de pausa, longe das lanchonetes e do fluxo.', 'corredor', 'O corredor concentra filas e conversas.'],
    tarde: ['jardim', 'A sombra das árvores segura o calor da tarde e o movimento é baixo.', 'mezanino', 'Sob a telha, o mezanino tende a esquentar.'],
    noite: ['deck', 'Luz baixa, pouca gente e longe do corredor.', 'corredor', 'À noite o movimento se concentra no corredor.'],
  },
  calor: {
    manha: ['jardim', 'Sombra natural da mangueira. Medimos 30 °C às 10h14 na Vila.', 'mezanino', 'A telha metálica tende a acumular calor.'],
    tarde: ['jardim', 'É o único trecho com sombra de árvore e chão de grama.', 'mezanino', 'É a área mais exposta ao calor da cobertura.'],
    noite: ['mezanino', 'À noite a temperatura cai (27 °C às 20h48) e o mezanino fica ventilado.', 'corredor', 'O corredor segue cheio e abafado no pico da noite.'],
  },
  comer: {
    manha: ['corredor', 'É onde ficam as lanchonetes: pediu, sentou.', 'jardim', 'Melhor deixar o jardim para quem quer descansar.'],
    tarde: ['corredor', 'Perto das lanchonetes e com mesas de passagem.', 'jardim', 'Melhor deixar o jardim para quem quer descansar.'],
    noite: ['corredor', 'Lanchonetes abertas e boa iluminação.', 'deck', 'O deck à noite é lugar de calma.'],
  },
  estudar: {
    manha: ['mezanino', 'Antes do almoço o mezanino tem mesas livres e pouco barulho.', 'corredor', 'O vai e vem não deixa concentrar.'],
    tarde: ['jardim', 'Os bancos azuis no fim da tarde ficam tranquilos.', 'mezanino', 'Pico de barulho e calor no começo da tarde.'],
    noite: ['mezanino', 'Mesas e luz dos cordões, nas pontas longe do corredor.', 'jardim', 'À noite a luz do jardim não ajuda a leitura.'],
  },
  grupo: {
    manha: ['mezanino', 'Mesas para várias pessoas e espaço para juntar cadeiras.', 'jardim', 'Quem está no jardim procura silêncio.'],
    tarde: ['mezanino', 'Mesas maiores e de passagem para o corredor.', 'jardim', 'Quem está no jardim procura silêncio.'],
    noite: ['mezanino', 'Luz quente dos cordões e mesas livres depois do pico.', 'deck', 'O deck é o refúgio de quem quer ficar quieto.'],
  },
}

// Jardim
export const PL = [
  { n: 1, p: 'Capim-limão', c: 'Cymbopogon citratus', w: 'Sol pleno, rega a cada 2 dias no calor', y: 'Ex-alunos lembram do cheiro de capim-limão no Campus da Federação. Trouxemos a memória para Pituaçu.', dias: 2 },
  { n: 2, p: 'Alamanda', c: 'Allamanda cathartica', w: 'Sol pleno, rega 2 vezes por semana', y: 'Trepadeira de flor amarela que sobe nas colunas e faz sombra verde perto do mezanino.', dias: 3, warn: 'Tóxica se ingerida. Não mastigue folhas nem flores.' },
  { n: 3, p: 'Espada-de-são-jorge', c: 'Dracaena trifasciata', w: 'Sol ou meia-sombra, rega 1 vez por semana', y: 'Aguenta calor e pouca rega: ideal para vaso de pneu no gramado.', dias: 7, warn: 'Tóxica se ingerida, inclusive para animais.' },
  { n: 4, p: 'Grama-amendoim', c: 'Arachis repens', w: 'Sol pleno, rega a cada 2 dias até pegar', y: 'Forração que cobre a terra exposta e não precisa de corte.', dias: 2 },
  { n: 5, p: 'Manjericão', c: 'Ocimum basilicum', w: 'Sol pleno, rega todo dia no calor', y: 'Cheiro forte e calmante perto dos bancos. Quem rega pode levar um raminho.', dias: 1 },
]
export const DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex']
export const FEEL = ['Muito tenso', 'Tenso', 'Neutro', 'Calmo', 'Muito calmo']

// Relatar
export const CATS = {
  mesa: 'Mesa ou cadeira quebrada',
  passagem: 'Mesa atrapalhando a passagem',
  barreira: 'Barreira de acessibilidade',
  outro: 'Outro problema',
}
export const ST = {
  rec: ['Recebido', 'rec'],
  enc: ['Encaminhado à universidade', 'enc'],
  ok: ['Resolvido', 'ok'],
}
export const SEED = [
  { c: 'barreira', z: 'mezanino', d: 'Escada de acesso ao mezanino sem corrimão.', s: 'enc', img: 'escada', seed: 1 },
  { c: 'barreira', z: 'corredor', d: 'Chão irregular e desníveis na área de convivência.', s: 'enc', seed: 1 },
  { c: 'passagem', z: 'mezanino', d: 'Mesas e cadeiras espalhadas atrapalham a circulação.', s: 'rec', img: 'mezanino-noite', seed: 1 },
  { c: 'mesa', z: 'mezanino', d: 'Cadeiras dobráveis de madeira desconfortáveis para ficar muito tempo.', s: 'rec', img: 'mezanino-dia', seed: 1 },
]

// Semana Vila Viva
export const EV = [
  { d: 'Seg', t: 'Estudo na hora calma', where: 'Mezanino', when: '9h às 10h30', p: ['Barulho: ', '73,3%', ' dizem que é o que mais atrapalha'], x: 'Grupo de estudo no horário que o gráfico mostra como mais tranquilo, nas mesas da ponta.' },
  { d: 'Ter', t: 'Pausa no verde', where: 'Jardim', when: '10h às 10h15', p: ['Descanso: ', '66,7%', ' pediram espaços de descanso'], x: 'Quinze minutos de respiração e alongamento à sombra da mangueira, conduzidos pelo pessoal da Saúde.' },
  { d: 'Qua', t: 'Intervalo de quem trabalha', where: 'Deck lateral', when: '15h às 15h30', p: ['Só ', '8,3%', ' dos funcionários e professores têm lugar adequado no intervalo'], x: 'Um horário reservado e silencioso para quem trabalha na universidade.' },
  { d: 'Qui', t: 'Caminhada da acessibilidade', where: 'Saída da entrada principal', when: '16h', p: ['Acessibilidade: ', '46,7%', ' pedem melhorias'], x: 'Percorrer a Vila com carrinho ou mala de rodinhas, fotografar cada barreira e lançar no quadro de relatos.' },
  { d: 'Sex', t: 'Mutirão das mesas', where: 'Corredor e mezanino', when: '14h', p: ['Mobiliário: ', '66,7%', ' querem outra disposição das mesas'], x: 'Reorganizar as mesas para abrir passagem e separar as cadeiras quebradas relatadas no quadro.' },
  { d: 'Sáb', t: 'Mutirão de plantio do jardim', where: 'Jardim da mangueira', when: '8h às 12h', p: ['Participação: ', '20%', ' disseram sim e 60% talvez'], x: 'Montar os canteiros, plantar as mudas e fixar as placas QR. Quem plantar já sai com uma planta adotada.' },
]
