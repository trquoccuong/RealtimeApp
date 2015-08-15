var bcrypt = require('bcrypt');

module.exports = function (sequelize,Datatypes) {
    var User = sequelize.define('user', {
        id : {
            type: Datatypes.INTEGER,
            primaryKey : true,
            autoIncrement : true
        },
        username: {
            type: Datatypes.STRING,
            unique: true
        },
        name : {
            type : Datatypes.STRING,
            allowNull : false
        },
        password : {
            type : Datatypes.STRING
        },
        email : {
            type : Datatypes.STRING,
            allowNull : false
        },
        profileImage : {
            type : Datatypes.STRING,
            allowNull : false
        }
    }, {
        freezeTableName : true,
        hooks : {
            beforeCreate: function (user, op, fn) {
                if(user.password) {
                    bcrypt.hash(user.password,10, function (err, hash) {
                        if(err) throw  err;
                        user.password = hash;
                        fn(null, user);
                    })
                } else {
                    user.password = ''
                    fn(null, user);
                }
            }
        }
    })

    User.sync();
    return User
}