const mongoose = require('mongoose');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    sobrenome: {
        type: String,
        required: false,
        default: ''
    },
    email: {
        type: String,
        required: false,
        default: ''
    },
    telefone: {
        type: String,
        required: false,
        default: ''
    },
    criadoEm: {
        type: Date,
        default: Date.now
    },
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

class Contato {
    constructor(body) {
        this.body = body;
        this.err = [];
        this.contato = null;
    }
    async register() {
        this.valida();
        if (this.err.length > 0)
            return;
        this.contato = await ContatoModel.create(this.body);
    }
    valida() {
        this.cleanUp();
        if (this.body.email && !validator.isEmail(this.body.email)) this.err.push('E-mail inválido');
        if (!this.body.nome)
            this.err.push('Nome é um campo obrigatório.');
        if (!this.body.email && !this.body.telefone) {
            this.err.push('Pelo menos um destes campos precisa ser enviado: Email ou Telefone.');
        }
    }
    cleanUp() {
        for (const key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            nome: this.body.nome,
            sobrenome: this.body.sobrenome,
            email: this.body.email,
            telefone: this.body.telefone,
        };
    }

    async edit(id) {
        if (typeof id !== 'string') return;
        this.valida();
        if (this.err.length > 0) return;
        this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, {
            new: true
        });
    }

    // Estáticos
    static async buscaId(id) {
        if (typeof id !== 'string') return;
        const contato = await ContatoModel.findById(id);
        return contato;
    }

    static async buscaContatos() {
        const contatos = await ContatoModel.find()
            .sort({
                criadoEm: -1
            });
        return contatos;
    }

    static async deletaContato(id) {
        if (typeof id !== 'string') return;
        const contato = await ContatoModel.findByIdAndDelete(id);
        return contato;
    }
}

module.exports = Contato;