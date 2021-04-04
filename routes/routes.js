const { Router } = require('express');
const router = Router();
const { Puja, User } = require('../db');

// aca configuramos las rutas.
function checkLogin(req, res, next) {

    
    if (req.session.user == null){
        req.flash('errors', "Tienes que estar logeado para entrar a esta parte del sistema.");
        return res.redirect('/login');
    }

    res.locals.user = req.session.user;

    next();
}

function checkAdmin(req, res, next){

    if (req.session.user.rol != "ADMIN"){
        req.flash('errors', "No tienes permisos de Administrador. No puedes entrar a esta parte del sistema.");
        return res.redirect('/');
    }

    next();

}


router.get("/", [checkLogin ] , async (req,res) => {


    const errors = req.flash("errors");
    const mensajes = req.flash("mensajes");
    const usuarios = await User.findAll(
        {include: [Puja]}
    );
    const puja = await Puja.findAll(
        {include: [User]}
    );

    res.render("usuario.ejs",{ errors, mensajes, puja:puja, usuarios})
});



router.get("/pujas", [checkLogin] , async (req,res) => {

    const Count1 = await Puja.findAndCountAll({
        where:{
          product: 1
        }
      })
      const Count2 = await Puja.findAndCountAll({
        where:{
          product: 2
        }
      })
      const Count3 = await Puja.findAndCountAll({
        where:{
          product: 3
        }
      })
      if (Count1.count == 0 || Count2.count == 0 || Count3.count == 0){
        req.flash('errors', 'Tiene que haber mínimo una puja por cada producto');
        return res.redirect('/');
      }

    const errors = req.flash("errors");
    const mensajes = req.flash("mensajes");
    const usuarios = await User.findAll(
        {include: [Puja]}
    );
    const puja_final = await Puja.findAll(
        {include: [User], order: [['bet', 'DESC']]}
    );


    res.render("pujas.ejs",{ errors, mensajes, puja_final, usuarios })
});

router.post('/', async (req, res) => {

    try {
        if (req.body.bet == '')
            throw new Error('La puja no puede ser vacía, tienes que enviar una');
        console.log(req.session);
        const new_bet = await Puja.create({
            bet: req.body.bet,
            product: req.body.product,
            UserId: req.session.user.id
        });
        req.flash('mensaje', `El bet con valor ${new_bet.bet} fue creado en la base de datos.`);
    } catch (err) {
        console.log(err.message);
        req.flash('error', err.message);
    }
});

router.get('/deletepujas', [checkLogin], (req, res) => {
    Puja.destroy({ truncate: true, })
    res.redirect('/');
});

router.post('/pujas', async (req, res) => {

    try {
        if (req.body.bet == '')
            throw new Error('La puja no puede ser vacía, tienes que enviar una');
        console.log(req.session);
        const puja_max = await Puja.findAll({where: {product: req.body.product}})
        if (req.body.bet < puja_max) {
            req.flash('errors', 'El valor pujado no puede ser menor a la puja actual del producto');
            return res.redirect('/');
        }
        const new_bet = await Puja.create({
            bet: req.body.bet,
            product: req.body.product,
            UserId: req.session.user.id
        });
        req.flash('mensaje', `El bet con valor ${new_bet.bet} fue creado en la base de datos.`);
    } catch (err) {
        console.log(err.message);
        req.flash('error', err.message);
    }
    res.redirect('/');
});


module.exports = router;
