const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('snkrhead', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
});

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log('Conexão Realizada');
//   })
//   .catch((error) => {
//     console.error('Erro de Conexão');
//   });

module.exports = sequelize;
