export type MetricInfo = {
    title: string
    definition: string
    howMeasured?: string
    tip?: string
}

export const ga4Metrics: Record<string, MetricInfo> = {
    sessions: {
        title: "Sessões",
        definition: "Uma sessão começa quando um usuário abre seu app ou site. Uma sessão termina após 30 minutos de inatividade.",
        howMeasured: "Medido pelo evento session_start. O GA4 agrupa eventos subsequentes na mesma sessão.",
        tip: "Sessões ≠ Usuários. Um usuário pode iniciar várias sessões."
    },
    users: {
        title: "Usuários (Total)",
        definition: "Número total de usuários únicos que visitaram o site.",
        tip: "Inclui tanto novos usuários quanto recorrentes."
    },
    pageviews: {
        title: "Visualizações de Tela",
        definition: "Número total de telas ou páginas visualizadas.",
        tip: "Conta visualizações repetidas da mesma tela."
    },
    engagementRate: {
        title: "Taxa de Engajamento",
        definition: "Porcentagem de sessões que foram 'engajadas'.",
        howMeasured: "Uma sessão é engajada se durar >10s, tiver 1+ evento de conversão ou 2+ visualizações de tela.",
        tip: "Substitui a antiga 'Taxa de Rejeição' (Bounce Rate). Engajamento alto é bom."
    },
    avgSessionDuration: {
        title: "Duração Média da Sessão",
        definition: "Tempo médio que os usuários passam engajados no site.",
        howMeasured: "Soma do tempo de engajamento dividido pelo número de sessões ativas."
    },
    activeUsers: {
        title: "Usuários Ativos (30 min)",
        definition: "Número de usuários distintos que engajaram com o site nos últimos 30 minutos.",
        tip: "Útil para monitorar tráfego em tempo real."
    },
    channels: {
        title: "Canaiss de Aquisição",
        definition: "Grupo padrão de canais pelo qual os usuários chegaram ao site (ex: Organic Search, Direct).",
        tip: "Ajuda a entender qual estratégia de marketing traz mais tráfego."
    },
    sources: {
        title: "Origem / Mídia",
        definition: "A origem (ex: google, newsletter) e o meio (ex: organic, email) do tráfego.",
        tip: "Mais granular que os canais. Ex: 'google / cpc' vs 'google / organic'."
    },
    geo: {
        title: "Geografia",
        definition: "Localização aproximada dos usuários baseada no IP.",
        tip: "Pode variar devido a VPNs ou configurações de privacidade."
    },
    pages: {
        title: "Páginas Mais Visitadas",
        definition: "As URLs ou títulos de página com maior número de visualizações.",
        tip: "Indica o conteúdo mais popular."
    },
    landings: {
        title: "Páginas de Destino",
        definition: "A primeira página que um usuário visualiza ao iniciar uma sessão.",
        tip: "Crucial para avaliar a primeira impressão e eficácia de campanhas."
    },
    avgEngagementTime: {
        title: "Tempo Médio de Engajamento",
        definition: "Tempo médio que a página ficou em foco no navegador do usuário."
    }
}
