const { DataTypes } = require('sequelize');
const db = require('../db/conn');

const Produto = db.define(
  'produto',
  {
    nome: {
      type: DataTypes.STRING(75),
    },
    marca: {
      type: DataTypes.STRING(50),
    },
    tamanho: {
      type: DataTypes.STRING(50),
    },
    quantidadeEstoque: {
      type: DataTypes.INTEGER,
    },
    preco: {
      type: DataTypes.FLOAT,
    },
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

// Produto.sync({ force: true });

module.exports = Produto;
