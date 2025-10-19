const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express()
const port = 3000
const { body, validationResult, check } = require('express-validator');
const session = require('express-session');
const cookeiParser = require('cookie-parser');
const flash = require('connect-flash');
const methodOveride = require('method-override');
const router = require('router')
const contactRoutes = require('./routes/api/contactApi')
require('./utils/db');
const Contact = require('./model/contact');

app.use(express.json());
app.use('/api', contactRoutes);

app.use(methodOveride('_method'));

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.urlencoded());

app.use(cookeiParser('secret'));
app.use(
    session({
        cookie: { maxAge: 6000 },
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
    })
);
app.use(flash());





app.get('/', (req, res) => {
    res.render('index', {
        layout: 'layouts/main-layout',
        title: "Home",
    })
})
app.get('/about', (req, res) => {
    res.render('about', {
        layout: 'layouts/main-layout',
        title: "Halaman About"
    })
});

app.get('/contact', async (req, res) => {
    const contact = await Contact.find();
    console.log(contact)
    res.render('contact', {
        layout: 'layouts/main-layout',
        title: "Halaman Contact",
        contact,
        msg: req.flash('msg')
    })
});
app.get('/contact/add', (req, res) => {

    res.render('add-contact', {
        layout: 'layouts/main-layout',
        title: "Form Tambah Kontakss",

    })
});

app.post('/contact',
    [
        body('email').custom(async (value) => {
            const duplikat = await Contact.findOne({ email: value });
            if (duplikat) {
                throw new Error('Email kontak sudah ada');
            }
            return true
        }),
        check('email', 'email tidak valid').isEmail(),
        check('nohp', 'no HP tidak valid').isMobilePhone('id-ID'),

    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('add-contact', {
                title: 'form tambah data kontak',
                layout: 'layouts/main-layout',
                errors: errors.array(),
            })
        } else {
            try {
                Contact.insertMany(req.body)
                req.flash('msg', "Kontak berhasil ditambahkan");
                res.redirect('/contact');
            }
            catch (err) {
                req.flash('msg', err)
            }
        }
    });



app.delete('/contact', (req, res) => {
    Contact.deleteOne({ _id: req.body._id }).then((result) => {
        req.flash('msg', "Kontak berhasil dihapus");
        res.redirect('/contact');
    });
});


app.get('/contact/edit/:nama', async (req, res) => {
    const contact = await Contact.findOne({ nama: req.params.nama });

    res.render('edit-contact', {
        layout: 'layouts/main-layout',
        title: "Form Ubah data kontak",
        contact

    });
});

app.put(
    '/contact',
    [
        body('email').custom(async (value, { req }) => {
            const duplikat = await Contact.findOne({ email: value });
            if (value !== req.body.oldEmail && duplikat) {
                throw new Error('Email kontak sudah ada, pakai yang lain');
            }
            return true
        }),
        check('email', 'email tidak valid').isEmail(),
        check('nohp', 'no HP tidak valid').isMobilePhone('id-ID'),

    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('edit-contact', {
                title: 'form ubah data kontak',
                layout: 'layouts/main-layout',
                errors: errors.array(),
                contact: req.body,
            })
        } else {
            Contact.updateOne(
                { _id: req.body._id },
                {
                    $set: {
                        nama: req.body.nama,
                        email: req.body.email,
                        nohp: req.body.nohp,
                    }
                }
            ).then((result) => {
                req.flash('msg', "Kontak berhasil diubah");
                res.redirect('/contact');
            });
        }
    });

// detail
app.get('/contact/:_id', async (req, res) => {
    const contactt = await Contact.findOne({ _id: req.params._id });
    res.render('detail', {
        layout: 'layouts/main-layout',
        title: "Halaman Detail Contact",
        contactt
    })
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});