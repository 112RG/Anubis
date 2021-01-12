'use strict'
const { Model } = require('sequelize')
const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }

    testInstanceMethod() {
      console.log('Test passed')
    }
  }

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        notNull: true,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        notNull: true,
        validate: {
          len: {
            args: [8, 255],
            msg: 'Password must be 8+ characters long'
          }
        }
      }
    },
    {
      sequelize,
      modelName: 'User'
    }
  )

  // Hash password before user is created
  User.addHook('beforeCreate', async (user, options, next) => {
    try {
      // generate a salt
      const salt = await bcrypt.genSalt(10)
      // hash the password using the salt we generated above
      const hashedPassword = await bcrypt.hash(user.password, salt)
      // set user's password to the hashed password
      user.password = hashedPassword
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  User.prototype.checkPassword = async function (password) {
    if (!this.password) {
      throw new Error('password not set for this team member')
    }
    const match = await bcrypt.compare(password, this.password)
    return match
  }

  return User
}
