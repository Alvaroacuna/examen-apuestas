const Sequelize = require('sequelize');

// acá creamos la conexión a la Base de Datos
const sql = new Sequelize('examen-apuesta', 'root', 'LKMachine246', {
    host: 'localhost',
    dialect: 'mysql'
});


const User = sql.define('User', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Debe indicar un nombre'
            },
            len: {
                args: [2],
                msg: 'El nombre debe ser de largo al menos 2'
            }
        }
    },
    rol: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue:"NORMAL"
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: 'Debe indicar un email'
            },
            len: {
                args: [3],
                msg: 'El email debe ser de largo al menos 3'
            },
            isEmail: {
                msg: 'Debe ser un email válido'
            }
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Debe indicar una contraseña'
            },
            len: {
                args: [3],
                msg: 'La contraseña debe ser de largo al menos 3'
            },
        }
    }
});

const Puja = sql.define('Puja',{ 
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    product: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    bet: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
});

User.hasMany(Puja);
Puja.belongsTo(User);

//  después sincronizamos nuestro código con la base de datos
sql.sync()
    .then(() => {
        console.log('Tablas creadas (SI NO EXISTEN) ...');
});


// finalmente acá listamos todos los modelos que queremos exportar
module.exports = {
    User,
    Puja
};