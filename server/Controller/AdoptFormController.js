
const AdoptForm = require('../Model/AdoptFormModel')
const express = require('express')

const saveForm = async (req, res) => {
    try {
        const { email, livingSituation, phoneNo, previousExperience, familyComposition, petId } = req.body
        const form = await AdoptForm.create({ email, livingSituation, phoneNo, previousExperience, familyComposition, petId })

        res.status(200).json(form)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

const getAdoptForms = async (req, res) => {
    try {
        const forms = await AdoptForm.find().sort({ createdAt: -1 });
        res.status(200).json(forms)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

const deleteForm = async (req, res) => {
    try {
        const { id } = req.params
        const form = await AdoptForm.findByIdAndDelete(id)
        if (!form) {
            return res.status(404).json({ message: 'Nu sa gasit' })
        }
        res.status(200).json({ message: 'Sa sters cu succes' })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

const deleteAllRequests = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await AdoptForm.deleteMany({ petId: id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Nu sa gasit' });
        }
        res.status(200).json({ message: 'Sa sters cu succes' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    saveForm,
    getAdoptForms,
    deleteForm,
    deleteAllRequests
}
