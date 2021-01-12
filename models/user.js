module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Item', {
    username: DataTypes.STRING,
    password: DataTypes.INTEGER,
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  })
}
