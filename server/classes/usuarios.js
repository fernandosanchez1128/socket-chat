

class Usuarios {

    constructor (){
        this.personas = []
    }

    getPersonas (){
        return this.personas
    }

    agregarPersona (id,nombre,sala){
        let persona = {id,nombre,sala}
        this.personas.push(persona);
        return this.personas
    }

    borrarPersona (id){
        let personaBorrada = this.getPersona(id)
        this.personas = this.personas.filter(persona => persona.id !== id)
        return personaBorrada
    }

    getPersona (id){
        let persona = this.personas.filter(persona => persona.id === id)[0]
        return persona
    }

    getPersonasPorSala (sala){
        return this.personas.filter(persona => persona.sala == sala)
    }
}

module.exports= {
    Usuarios
} 