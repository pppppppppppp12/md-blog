import Sequelize from 'sequelize'

const blog = new Sequelize('mysql://root:root@localhost/blog', {
  define: {
    timestamps: false
  }
})

export { blog }
