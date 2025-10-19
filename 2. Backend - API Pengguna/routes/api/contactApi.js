const express = require('express');
const { body, validationResult } = require('express-validator');
const Contact = require('.././../model/contact.js'); // pastikan modelnya benar
const router = express.Router();

// ✅ [GET] Semua kontak
router.get('/contact', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json({ success: true, data: contacts });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ✅ [GET] Detail kontak berdasarkan ID
router.get('/contact/:id', async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ success: false, message: 'Kontak tidak ditemukan' });
        }
        res.json({ success: true, data: contact });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ✅ [POST] Tambah kontak baru
router.post(
    '/contact',
    [
        body('email')
            .isEmail().withMessage('Email tidak valid')
            .custom(async (value) => {
                const duplikat = await Contact.findOne({ email: value });
                if (duplikat) throw new Error('Email sudah digunakan');
                return true;
            }),
        body('nohp').isMobilePhone('id-ID').withMessage('Nomor HP tidak valid'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        try {
            const newContact = await Contact.create(req.body);
            res.status(201).json({ success: true, data: newContact });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
);

// ✅ [PUT] Ubah data kontak
router.put(
    '/contact/:id',
    [
        body('email')
            .isEmail().withMessage('Email tidak valid')
            .custom(async (value, { req }) => {
                const duplikat = await Contact.findOne({ email: value });
                if (duplikat && duplikat._id.toString() !== req.params.id) {
                    throw new Error('Email sudah digunakan oleh kontak lain');
                }
                return true;
            }),
        body('nohp').isMobilePhone('id-ID').withMessage('Nomor HP tidak valid'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        try {
            const updated = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json({ success: true, data: updated });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
);

// ✅ [DELETE] Hapus kontak
router.delete('/contact/:id', async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Kontak berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
