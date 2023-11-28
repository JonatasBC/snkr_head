const { DataTypes } = require('sequelize');
const db = require('../db/conn');

const Usuario = db.define(
  'usuario',
  {
    usuario: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    telefone: {
      type: DataTypes.STRING(20),
    },
    cpf: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    senha: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    tipo: {
      type: DataTypes.STRING(30),
    },
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

// Usuario.sync({ force: true });

module.exports = Usuario;
