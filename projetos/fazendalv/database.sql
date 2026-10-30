-- ============================================================
-- FAZENDA LV - SCHEMA DO BANCO DE DADOS
-- Sistema de Gestão de Bois
-- ============================================================

-- Tabela: BOIS
-- Armazena informações básicas dos animais
CREATE TABLE IF NOT EXISTS bois (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    identificacao TEXT NOT NULL UNIQUE,
    peso NUMERIC(10, 2) NOT NULL,
    raca TEXT NOT NULL,
    data_nascimento DATE NOT NULL,
    criado_em TIMESTAMP DEFAULT NOW(),
    atualizado_em TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_bois_identificacao ON bois(identificacao);
CREATE INDEX idx_bois_criado_em ON bois(criado_em);

-- Tabela: SAÚDE
-- Registra vacinas, vermífugos e observações de saúde
CREATE TABLE IF NOT EXISTS saude (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    boi_id UUID NOT NULL REFERENCES bois(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL CHECK (tipo IN ('vacina', 'vermifugo', 'observacao')),
    descricao TEXT NOT NULL,
    data DATE NOT NULL,
    criado_em TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_saude_boi_id ON saude(boi_id);
CREATE INDEX idx_saude_data ON saude(data);

-- Tabela: PESOS
-- Registra histórico de pesos dos animais
CREATE TABLE IF NOT EXISTS pesos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    boi_id UUID NOT NULL REFERENCES bois(id) ON DELETE CASCADE,
    peso NUMERIC(10, 2) NOT NULL,
    data DATE NOT NULL,
    criado_em TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_pesos_boi_id ON pesos(boi_id);
CREATE INDEX idx_pesos_data ON pesos(data);

-- Tabela: COMPRAS
-- Registra compras de animais
CREATE TABLE IF NOT EXISTS compras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    boi_id UUID NOT NULL REFERENCES bois(id) ON DELETE CASCADE,
    fornecedor TEXT NOT NULL,
    preco NUMERIC(12, 2) NOT NULL,
    data DATE NOT NULL,
    observacoes TEXT,
    criado_em TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_compras_boi_id ON compras(boi_id);
CREATE INDEX idx_compras_data ON compras(data);
CREATE INDEX idx_compras_fornecedor ON compras(fornecedor);

-- Tabela: VENDAS
-- Registra vendas de animais
CREATE TABLE IF NOT EXISTS vendas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    boi_id UUID NOT NULL REFERENCES bois(id) ON DELETE CASCADE,
    comprador TEXT NOT NULL,
    preco NUMERIC(12, 2) NOT NULL,
    data DATE NOT NULL,
    observacoes TEXT,
    criado_em TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_vendas_boi_id ON vendas(boi_id);
CREATE INDEX idx_vendas_data ON vendas(data);
CREATE INDEX idx_vendas_comprador ON vendas(comprador);

-- Tabela: REPRODUÇÃO
-- Registra coberturas (cruzamentos entre macho e fêmea)
CREATE TABLE IF NOT EXISTS reproducao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    macho_id UUID NOT NULL REFERENCES bois(id) ON DELETE CASCADE,
    femea_id UUID NOT NULL REFERENCES bois(id) ON DELETE CASCADE,
    data_cobertura DATE NOT NULL,
    criado_em TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reproducao_macho_id ON reproducao(macho_id);
CREATE INDEX idx_reproducao_femea_id ON reproducao(femea_id);
CREATE INDEX idx_reproducao_data ON reproducao(data_cobertura);

-- Tabela: NASCIMENTOS
-- Registra nascimentos com genealogia (pai + mãe)
CREATE TABLE IF NOT EXISTS nascimentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bezerro_id UUID NOT NULL REFERENCES bois(id) ON DELETE CASCADE,
    macho_id UUID NOT NULL REFERENCES bois(id) ON DELETE CASCADE,
    femea_id UUID NOT NULL REFERENCES bois(id) ON DELETE CASCADE,
    data_nascimento DATE NOT NULL,
    criado_em TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_nascimentos_bezerro_id ON nascimentos(bezerro_id);
CREATE INDEX idx_nascimentos_macho_id ON nascimentos(macho_id);
CREATE INDEX idx_nascimentos_femea_id ON nascimentos(femea_id);
CREATE INDEX idx_nascimentos_data ON nascimentos(data_nascimento);

-- ============================================================
-- DADOS DE EXEMPLO (comentados)
-- Descomente para adicionar dados de teste
-- ============================================================

/*
-- Inserir bois de exemplo
INSERT INTO bois (nome, identificacao, peso, raca, data_nascimento) VALUES
('Touro 01', 'T001', 850.50, 'Nelore', '2020-03-15'),
('Vaca 01', 'V001', 650.00, 'Nelore', '2019-06-20'),
('Bezerro 01', 'B001', 250.75, 'Nelore', '2023-08-10');

-- Inserir saúde
INSERT INTO saude (boi_id, tipo, descricao, data) VALUES
((SELECT id FROM bois WHERE identificacao = 'T001'), 'vacina', 'Vacinação contra febre aftosa', '2024-01-15'),
((SELECT id FROM bois WHERE identificacao = 'V001'), 'vermifugo', 'Vermífugo poderoso', '2024-02-20');

-- Inserir compra
INSERT INTO compras (boi_id, fornecedor, preco, data, observacoes) VALUES
((SELECT id FROM bois WHERE identificacao = 'T001'), 'Fazenda XYZ', 5000.00, '2023-12-01', 'Animal excelente');

-- Inserir reprodução
INSERT INTO reproducao (macho_id, femea_id, data_cobertura) VALUES
((SELECT id FROM bois WHERE identificacao = 'T001'),
 (SELECT id FROM bois WHERE identificacao = 'V001'),
 '2023-09-15');
*/

-- ============================================================
-- VIEWS ÚTEIS
-- ============================================================

-- View: Histórico completo de um boi
CREATE OR REPLACE VIEW vw_historico_boi AS
SELECT
    b.id,
    b.nome,
    b.identificacao,
    COALESCE(b.peso, 0) as peso_atual,
    b.raca,
    b.data_nascimento,
    COUNT(DISTINCT s.id) as total_cuidados,
    COUNT(DISTINCT p.id) as total_pesos,
    COUNT(DISTINCT c.id) as total_compras,
    COUNT(DISTINCT v.id) as total_vendas
FROM bois b
LEFT JOIN saude s ON b.id = s.boi_id
LEFT JOIN pesos p ON b.id = p.boi_id
LEFT JOIN compras c ON b.id = c.boi_id
LEFT JOIN vendas v ON b.id = v.boi_id
GROUP BY b.id, b.nome, b.identificacao, b.peso, b.raca, b.data_nascimento;

-- View: Genealogia de um animal
CREATE OR REPLACE VIEW vw_genealogia AS
SELECT
    n.bezerro_id,
    b.nome as bezerro_nome,
    m.nome as pai_nome,
    f.nome as mae_nome,
    n.data_nascimento
FROM nascimentos n
JOIN bois b ON n.bezerro_id = b.id
JOIN bois m ON n.macho_id = m.id
JOIN bois f ON n.femea_id = f.id;

-- ============================================================
-- TRIGGERS PARA AUDITORIA
-- ============================================================

-- Atualizar timestamp de bois
CREATE OR REPLACE FUNCTION update_boi_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_boi_timestamp
BEFORE UPDATE ON bois
FOR EACH ROW
EXECUTE FUNCTION update_boi_timestamp();

-- ============================================================
-- PERMISSÕES RLS (Row Level Security)
-- Descomente se usar autenticação
-- ============================================================

/*
ALTER TABLE bois ENABLE ROW LEVEL SECURITY;
ALTER TABLE saude ENABLE ROW LEVEL SECURITY;
ALTER TABLE pesos ENABLE ROW LEVEL SECURITY;
ALTER TABLE compras ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE reproducao ENABLE ROW LEVEL SECURITY;
ALTER TABLE nascimentos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (requer auth.uid())
CREATE POLICY "Acesso público bois" ON bois
    FOR ALL USING (true);

CREATE POLICY "Acesso público saude" ON saude
    FOR ALL USING (true);

-- ... etc para outras tabelas
*/