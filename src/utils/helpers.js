// Funções auxiliares reutilizáveis

/**
 * Formata uma data para o padrão DD/MM/YYYY
 */
const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Formata uma data e hora para o padrão DD/MM/YYYY HH:mm
 */
const formatDateTime = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * Calcula a diferença em minutos entre duas datas
 */
const getMinutesDifference = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.floor((d2 - d1) / (1000 * 60));
};

/**
 * Verifica se uma data está no passado
 */
const isPastDate = (date) => {
  return new Date(date) < new Date();
};

/**
 * Gera uma resposta padronizada de sucesso
 */
const successResponse = (data, message = 'Sucesso', status = 200) => {
  return {
    success: true,
    status,
    message,
    data
  };
};

/**
 * Gera uma resposta padronizada de erro
 */
const errorResponse = (message = 'Erro', status = 500, details = null) => {
  return {
    success: false,
    status,
    message,
    ...(details && { details })
  };
};

module.exports = {
  formatDate,
  formatDateTime,
  getMinutesDifference,
  isPastDate,
  successResponse,
  errorResponse
};
