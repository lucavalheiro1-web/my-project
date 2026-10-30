// ============================================================
// FAZENDA LV - Sistema de Gestão de Bois
// Desenvolvido com Supabase + JavaScript
// ============================================================

// 🔑 CONFIGURAÇÃO SUPABASE
// TODO: Substitua pelas suas credenciais do Supabase
const SUPABASE_URL = 'https://SEU_URL_AQUI.supabase.co';
const SUPABASE_ANON_KEY = 'SEU_ANON_KEY_AQUI';

// Inicializar cliente Supabase
const { createClient } = window.supabase;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================
// VARIÁVEIS GLOBAIS
// ============================================================
let boiList = [];
let saudeList = [];
let pesoList = [];
let compraList = [];
let vendaList = [];
let reproducaoList = [];
let nascimentoList = [];

// ============================================================
// NAVEGAÇÃO - TROCAR SEÇÕES
// ============================================================
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove classe active de todos os botões
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));

        // Adiciona classe active ao botão clicado
        btn.classList.add('active');
        const sectionId = btn.getAttribute('data-section');
        document.getElementById(sectionId).classList.add('active');

        // Carregar dados da seção
        if (sectionId === 'bois') loadBois();
        if (sectionId === 'cuidado') { loadBois(); loadSaude(); loadPesos(); }
        if (sectionId === 'compra') { loadBois(); loadCompras(); }
        if (sectionId === 'venda') { loadBois(); loadVendas(); }
        if (sectionId === 'criacao') { loadBois(); loadReproducao(); loadNascimentos(); }
        if (sectionId === 'dashboard') loadDashboard();
    });
});

// ============================================================
// FUNÇÃO: MOSTRAR NOTIFICAÇÃO (TOAST)
// ============================================================
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.getElementById('toast-container').appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================================
// SEÇÃO: BOIS - CRUD
// ============================================================

/**
 * Carrega lista de bois do Supabase
 */
async function loadBois() {
    try {
        const { data, error } = await supabase
            .from('bois')
            .select('*')
            .order('criado_em', { ascending: false });

        if (error) throw error;
        boiList = data || [];
        renderBoiList();
        updateSelectBois();
    } catch (error) {
        console.error('Erro ao carregar bois:', error);
        showToast('Erro ao carregar bois', 'error');
    }
}

/**
 * Renderiza lista de bois na tabela
 */
function renderBoiList() {
    const tbody = document.getElementById('lista-bois');
    
    if (boiList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty">Nenhum boi cadastrado</td></tr>';
        return;
    }

    tbody.innerHTML = boiList.map(boi => `
        <tr>
            <td>${boi.nome}</td>
            <td>${boi.identificacao}</td>
            <td>${boi.raca}</td>
            <td>${boi.peso}</td>
            <td>${new Date(boi.data_nascimento).toLocaleDateString('pt-BR')}</td>
            <td>
                <button class="btn btn-small btn-danger" onclick="deleteBoi('${boi.id}')">Deletar</button>
            </td>
        </tr>
    `).join('');
}

/**
 * Atualiza selects com lista de bois
 */
function updateSelectBois() {
    const selects = ['saude-boi', 'peso-boi', 'compra-boi', 'venda-boi', 'cobertura-macho', 'cobertura-femea', 'nasc-macho', 'nasc-femea'];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (!select) return;

        const currentValue = select.value;
        const options = boiList.map(boi => `<option value="${boi.id}">${boi.nome} (${boi.identificacao})</option>`).join('');
        select.innerHTML = '<option value="">-- Escolha um boi --</option>' + options;
        select.value = currentValue;
    });
}

/**
 * Adiciona novo boi
 */
function handleAddBoi() {
    const form = document.getElementById('form-boi');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const novoBoι = {
            nome: document.getElementById('boi-nome').value,
            identificacao: document.getElementById('boi-id').value,
            peso: parseFloat(document.getElementById('boi-peso').value),
            raca: document.getElementById('boi-raca').value,
            data_nascimento: document.getElementById('boi-nascimento').value
        };

        try {
            const { data, error } = await supabase
                .from('bois')
                .insert([novoBoi])
                .select();

            if (error) throw error;

            showToast('✅ Boi cadastrado com sucesso!', 'success');
            form.reset();
            await loadBois();
        } catch (error) {
            console.error('Erro ao cadastrar boi:', error);
            showToast('❌ Erro ao cadastrar boi', 'error');
        }
    });
}

/**
 * Deleta um boi
 */
async function deleteBoi(id) {
    if (!confirm('Tem certeza que deseja deletar este boi?')) return;

    try {
        const { error } = await supabase
            .from('bois')
            .delete()
            .eq('id', id);

        if (error) throw error;
        showToast('🗑️ Boi deletado com sucesso!', 'success');
        await loadBois();
    } catch (error) {
        console.error('Erro ao deletar boi:', error);
        showToast('❌ Erro ao deletar boi', 'error');
    }
}

// ============================================================
// SEÇÃO: CUIDADO - SAÚDE DO BOI
// ============================================================

/**
 * Registra saúde do boi (vacina, vermífugo, observação)
 */
function handleAddSaude() {
    const form = document.getElementById('form-saude');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const novaSaude = {
            boi_id: document.getElementById('saude-boi').value,
            tipo: document.getElementById('saude-tipo').value,
            descricao: document.getElementById('saude-descricao').value,
            data: document.getElementById('saude-data').value
        };

        try {
            const { data, error } = await supabase
                .from('saude')
                .insert([novaSaude])
                .select();

            if (error) throw error;
            showToast('✅ Cuidado registrado com sucesso!', 'success');
            form.reset();
            await loadSaude();
        } catch (error) {
            console.error('Erro ao registrar cuidado:', error);
            showToast('❌ Erro ao registrar cuidado', 'error');
        }
    });
}

/**
 * Carrega histórico de saúde
 */
async function loadSaude() {
    try {
        const { data, error } = await supabase
            .from('saude')
            .select(`*, bois(nome)`)
            .order('data', { ascending: false });

        if (error) throw error;
        saudeList = data || [];
        renderSaudeList();
    } catch (error) {
        console.error('Erro ao carregar saúde:', error);
    }
}

/**
 * Renderiza histórico de saúde
 */
function renderSaudeList() {
    const tbody = document.getElementById('lista-saude');
    
    if (saudeList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="empty">Nenhum registro de cuidado</td></tr>';
        return;
    }

    tbody.innerHTML = saudeList.map(saude => `
        <tr>
            <td>${saude.bois?.nome || 'N/A'}</td>
            <td>${saude.tipo === 'vacina' ? '💉 Vacina' : saude.tipo === 'vermifugo' ? '🪱 Vermífugo' : '📝 Observação'}</td>
            <td>${saude.descricao}</td>
            <td>${new Date(saude.data).toLocaleDateString('pt-BR')}</td>
        </tr>
    `).join('');
}

/**
 * Registra peso do boi
 */
function handleAddPeso() {
    const form = document.getElementById('form-peso');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const novoPeso = {
            boi_id: document.getElementById('peso-boi').value,
            peso: parseFloat(document.getElementById('peso-valor').value),
            data: document.getElementById('peso-data').value
        };

        try {
            const { data, error } = await supabase
                .from('pesos')
                .insert([novoPeso])
                .select();

            if (error) throw error;
            showToast('✅ Peso registrado com sucesso!', 'success');
            form.reset();
            await loadPesos();
        } catch (error) {
            console.error('Erro ao registrar peso:', error);
            showToast('❌ Erro ao registrar peso', 'error');
        }
    });
}

/**
 * Carrega histórico de pesos
 */
async function loadPesos() {
    try {
        const { data, error } = await supabase
            .from('pesos')
            .select(`*, bois(nome)`)
            .order('data', { ascending: false });

        if (error) throw error;
        pesoList = data || [];
    } catch (error) {
        console.error('Erro ao carregar pesos:', error);
    }
}

// ============================================================
// SEÇÃO: COMPRA
// ============================================================

/**
 * Registra compra de boi
 */
function handleAddCompra() {
    const form = document.getElementById('form-compra');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const novaCompra = {
            boi_id: document.getElementById('compra-boi').value,
            fornecedor: document.getElementById('compra-fornecedor').value,
            preco: parseFloat(document.getElementById('compra-preco').value),
            data: document.getElementById('compra-data').value,
            observacoes: document.getElementById('compra-obs').value
        };

        try {
            const { data, error } = await supabase
                .from('compras')
                .insert([novaCompra])
                .select();

            if (error) throw error;
            showToast('✅ Compra registrada com sucesso!', 'success');
            form.reset();
            await loadCompras();
        } catch (error) {
            console.error('Erro ao registrar compra:', error);
            showToast('❌ Erro ao registrar compra', 'error');
        }
    });
}

/**
 * Carrega lista de compras
 */
async function loadCompras() {
    try {
        const { data, error } = await supabase
            .from('compras')
            .select(`*, bois(nome)`)
            .order('data', { ascending: false });

        if (error) throw error;
        compraList = data || [];
        renderCompraList();
    } catch (error) {
        console.error('Erro ao carregar compras:', error);
    }
}

/**
 * Renderiza lista de compras
 */
function renderCompraList() {
    const tbody = document.getElementById('lista-compras');
    
    if (compraList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty">Nenhuma compra registrada</td></tr>';
        return;
    }

    tbody.innerHTML = compraList.map(compra => `
        <tr>
            <td>${compra.bois?.nome || 'N/A'}</td>
            <td>${compra.fornecedor}</td>
            <td>R$ ${compra.preco.toFixed(2)}</td>
            <td>${new Date(compra.data).toLocaleDateString('pt-BR')}</td>
            <td>${compra.observacoes || '-'}</td>
        </tr>
    `).join('');
}

// ============================================================
// SEÇÃO: VENDA
// ============================================================

/**
 * Registra venda de boi
 */
function handleAddVenda() {
    const form = document.getElementById('form-venda');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const novaVenda = {
            boi_id: document.getElementById('venda-boi').value,
            comprador: document.getElementById('venda-comprador').value,
            preco: parseFloat(document.getElementById('venda-preco').value),
            data: document.getElementById('venda-data').value,
            observacoes: document.getElementById('venda-obs').value
        };

        try {
            const { data, error } = await supabase
                .from('vendas')
                .insert([novaVenda])
                .select();

            if (error) throw error;
            showToast('✅ Venda registrada com sucesso!', 'success');
            form.reset();
            await loadVendas();
        } catch (error) {
            console.error('Erro ao registrar venda:', error);
            showToast('❌ Erro ao registrar venda', 'error');
        }
    });
}

/**
 * Carrega lista de vendas
 */
async function loadVendas() {
    try {
        const { data, error } = await supabase
            .from('vendas')
            .select(`*, bois(nome)`)
            .order('data', { ascending: false });

        if (error) throw error;
        vendaList = data || [];
        renderVendaList();
    } catch (error) {
        console.error('Erro ao carregar vendas:', error);
    }
}

/**
 * Renderiza lista de vendas
 */
function renderVendaList() {
    const tbody = document.getElementById('lista-vendas');
    
    if (vendaList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty">Nenhuma venda registrada</td></tr>';
        return;
    }

    tbody.innerHTML = vendaList.map(venda => `
        <tr>
            <td>${venda.bois?.nome || 'N/A'}</td>
            <td>${venda.comprador}</td>
            <td>R$ ${venda.preco.toFixed(2)}</td>
            <td>${new Date(venda.data).toLocaleDateString('pt-BR')}</td>
            <td>${venda.observacoes || '-'}</td>
        </tr>
    `).join('');
}

// ============================================================
// SEÇÃO: CRIAÇÃO / REPRODUÇÃO
// ============================================================

/**
 * Registra cobertura (cruzamento)
 */
function handleAddCobertura() {
    const form = document.getElementById('form-cobertura');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const novaCobertura = {
            macho_id: document.getElementById('cobertura-macho').value,
            femea_id: document.getElementById('cobertura-femea').value,
            data_cobertura: document.getElementById('cobertura-data').value
        };

        try {
            const { data, error } = await supabase
                .from('reproducao')
                .insert([novaCobertura])
                .select();

            if (error) throw error;
            showToast('✅ Cobertura registrada com sucesso!', 'success');
            form.reset();
            await loadReproducao();
        } catch (error) {
            console.error('Erro ao registrar cobertura:', error);
            showToast('❌ Erro ao registrar cobertura', 'error');
        }
    });
}

/**
 * Registra nascimento de bezerro
 */
function handleAddNascimento() {
    const form = document.getElementById('form-nascimento');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Primeiro, cadastra o bezerro como novo boi
        const novoBezerro = {
            nome: document.getElementById('nasc-bezerro-nome').value,
            identificacao: document.getElementById('nasc-bezerro-id').value,
            peso: parseFloat(document.getElementById('nasc-peso').value),
            raca: 'Bezerro', // Pode ser ajustado
            data_nascimento: document.getElementById('nasc-data').value
        };

        try {
            // Insere bezerro na tabela bois
            const { data: boiData, error: boiError } = await supabase
                .from('bois')
                .insert([novoBezerro])
                .select();

            if (boiError) throw boiError;

            const bezerroId = boiData[0].id;

            // Registra nascimento com genealogia
            const novoNascimento = {
                bezerro_id: bezerroId,
                macho_id: document.getElementById('nasc-macho').value,
                femea_id: document.getElementById('nasc-femea').value,
                data_nascimento: document.getElementById('nasc-data').value
            };

            const { error: nascError } = await supabase
                .from('nascimentos')
                .insert([novoNascimento])
                .select();

            if (nascError) throw nascError;

            showToast('✅ Nascimento registrado com sucesso!', 'success');
            form.reset();
            await loadBois();
            await loadNascimentos();
        } catch (error) {
            console.error('Erro ao registrar nascimento:', error);
            showToast('❌ Erro ao registrar nascimento', 'error');
        }
    });
}

/**
 * Carrega histórico de reprodução
 */
async function loadReproducao() {
    try {
        const { data, error } = await supabase
            .from('reproducao')
            .select(`*, machos:macho_id(nome), femeas:femea_id(nome)`)
            .order('data_cobertura', { ascending: false });

        if (error) throw error;
        reproducaoList = data || [];
        renderReproducaoList();
    } catch (error) {
        console.error('Erro ao carregar reprodução:', error);
    }
}

/**
 * Carrega nascimentos com genealogia
 */
async function loadNascimentos() {
    try {
        const { data, error } = await supabase
            .from('nascimentos')
            .select(`*, bezerros:bezerro_id(nome), machos:macho_id(nome), femeas:femea_id(nome)`)
            .order('data_nascimento', { ascending: false });

        if (error) throw error;
        nascimentoList = data || [];
        renderNascimentoList();
    } catch (error) {
        console.error('Erro ao carregar nascimentos:', error);
    }
}

/**
 * Renderiza histórico de reprodução
 */
function renderReproducaoList() {
    const tbody = document.getElementById('lista-reproducao');
    
    if (reproducaoList.length === 0 && nascimentoList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty">Nenhum registro de reprodução</td></tr>';
        return;
    }

    let html = '';

    // Reproduções sem nascimento
    reproducaoList.forEach(repro => {
        html += `
            <tr>
                <td>${repro.machos?.nome || 'N/A'}</td>
                <td>${repro.femeas?.nome || 'N/A'}</td>
                <td>${new Date(repro.data_cobertura).toLocaleDateString('pt-BR')}</td>
                <td>-</td>
                <td>Aguardando</td>
            </tr>
        `;
    });

    // Nascimentos
    nascimentoList.forEach(nasc => {
        html += `
            <tr>
                <td>${nasc.machos?.nome || 'N/A'}</td>
                <td>${nasc.femeas?.nome || 'N/A'}</td>
                <td>-</td>
                <td>${nasc.bezerros?.nome || 'N/A'}</td>
                <td>${new Date(nasc.data_nascimento).toLocaleDateString('pt-BR')}</td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

/**
 * Renderiza lista de nascimentos
 */
function renderNascimentoList() {
    // Já renderizado em renderReproducaoList
}

// ============================================================
// DASHBOARD - ESTATÍSTICAS
// ============================================================

/**
 * Carrega e exibe estatísticas do dashboard
 */
async function loadDashboard() {
    try {
        // Total de bois
        const { count: totalBois } = await supabase
            .from('bois')
            .select('*', { count: 'exact', head: true });

        document.getElementById('total-bois').textContent = totalBois || 0;

        // Peso médio
        if (boiList.length > 0) {
            const pesoMedio = (boiList.reduce((sum, boi) => sum + boi.peso, 0) / boiList.length).toFixed(1);
            document.getElementById('peso-medio').textContent = pesoMedio + ' kg';
        }

        // Total de compras
        const { count: totalCompras } = await supabase
            .from('compras')
            .select('*', { count: 'exact', head: true });

        document.getElementById('total-compras').textContent = totalCompras || 0;

        // Total de vendas
        const { count: totalVendas } = await supabase
            .from('vendas')
            .select('*', { count: 'exact', head: true });

        document.getElementById('total-vendas').textContent = totalVendas || 0;
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
    }
}

// ============================================================
// INICIALIZAÇÃO DO APLICATIVO
// ============================================================

window.addEventListener('DOMContentLoaded', () => {
    // Registra event listeners dos formulários
    handleAddBoi();
    handleAddSaude();
    handleAddPeso();
    handleAddCompra();
    handleAddVenda();
    handleAddCobertura();
    handleAddNascimento();

    // Carrega dados iniciais
    loadBois();
    loadDashboard();
});