//  CONFIGURAÇÃO DO SUPABASE o BANCO DE DADOS 

const supabaseUrl = 'https://ahlrngwqsrhjuyoeusbu.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFobHJuZ3dxc3JoanV5b2V1c2J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMTU0NTQsImV4cCI6MjA4NzY5MTQ1NH0.WoPIBs27rX_Yn4WNrBomsDodur63PzSfKtadOoYRIc0'; 

// Inicializa o cliente. 

const supabaseCliente = supabase.createClient(supabaseUrl, supabaseKey);

//  FUNÇÃO PARA BUSCAR E MOSTRAR OS AGENDAMENTOS
async function carregarAgendamentos() {
    const listaDiv = document.getElementById('lista-agendamentos');
    
    if (!listaDiv) return; // Segurança caso o elemento não exista no HTML

    // Busca os dados na tabela 'agendamentos'
    const { data, error } = await supabaseCliente
        .from('agendamentos')
        .select('*')
        .order('data_reserva', { ascending: true });

    if (error) {
        console.error('Erro ao buscar dados do Supabase:', error.message);
        listaDiv.innerHTML = '<p>Erro ao carregar a agenda. Verifique o console.</p>';
        return;
    }

    // Limpa a tela antes de mostrar
    listaDiv.innerHTML = '';

    if (data.length === 0) {
        listaDiv.innerHTML = '<p>Nenhum horário reservado ainda.</p>';
        return;
    }

    // Cria o HTML para cada agendamento
    data.forEach(agendamento => {
        // Formata a data para dd/mm/aaaa
        const dataFormatada = new Date(agendamento.data_reserva).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
        
        const divItem = document.createElement('div');
        divItem.className = 'agendamento-item';
        divItem.style.border = "1px solid #ddd"; // Estilo básico para visualização
        divItem.style.margin = "10px 0";
        divItem.style.padding = "10px";

        divItem.innerHTML = `
            <p><strong>📅 Data:</strong> ${dataFormatada} - <strong>⏰ ${agendamento.horario}</strong></p>
            <p><strong>👥 Grupo:</strong> ${agendamento.nome_grupo} (${agendamento.atividade})</p>
        `;
        listaDiv.appendChild(divItem);
    });
}

//  FUNÇÃO PARA SALVAR UM NOVO AGENDAMENTO
const form = document.getElementById('form-agendamento');
if (form) {
    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const botao = event.target.querySelector('button');
        const textoOriginal = botao.innerText;
        
        botao.innerText = 'Agendando...';
        botao.disabled = true;

        const novoAgendamento = {
            nome_grupo: document.getElementById('nome_grupo').value,
            atividade: document.getElementById('atividade').value,
            data_reserva: document.getElementById('data_reserva').value,
            horario: document.getElementById('horario').value
        };

        const { error } = await supabaseCliente
            .from('agendamentos')
            .insert([novoAgendamento]);

        if (error) {
            alert('Erro ao agendar: ' + error.message);
            console.error(error);
        } else {
            alert('Horário agendado com sucesso!');
            form.reset(); 
            carregarAgendamentos(); // Recarrega a lista automaticamente
        }

        botao.innerText = textoOriginal;
        botao.disabled = false;
    });
}

// 4. INICIA A PÁGINA
carregarAgendamentos();