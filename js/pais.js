
class Pais {

    "use strict:"
    constructor (nombrePais, nombreCapital, cantidadPoblacion){
        this.nombrePais = nombrePais
        this.nombreCapital = nombreCapital 
        this.cantidadPoblacion = cantidadPoblacion
        this.nombreCircuito
        this.coordenadaMeta
        this.religionMayoritaria
        this.formaGobierno
    }

    setNombreCircuito(nombreCircuito){
        this.nombreCircuito = nombreCircuito
    }

    setCoordenadaMeta(coordenadaMeta){
        this.coordenadaMeta = coordenadaMeta
    }

    setReligionMayoritaria(religionMayoritaria){
        this.religionMayoritaria = religionMayoritaria
    }

    setFormaGobierno(formaGobierno){
        this.formaGobierno = formaGobierno
    }

    getNombrePais(){
        return this.nombrePais.toString()
    }

    getNombreCapital(){
        return this.nombreCapital.toString()
    }

    getMoreInfo(){
        return [this.nombreCircuito, this.cantidadPoblacion, this.formaGobierno, this.religionMayoritaria]
    }

    writeCoordenadaMeta(){
        document.write("<p>Coordenada de meta: "+this.coordenadaMeta+"</p>")
    }
}

let showCountry = function () {
    const bahrein = new Pais("Bahreín", "Manama", "1,607,049")
    bahrein.setNombreCircuito("Bahrain International Circuit")
    bahrein.setCoordenadaMeta("50.51049998681525, 26.03246166671207")
    bahrein.setFormaGobierno("Monarquía constitucional")
    bahrein.setReligionMayoritaria("Islam")
    let info = bahrein.getMoreInfo()
    document.write("<p>Nombre: "+bahrein.getNombrePais()+"</p>")
    document.write("<p>Capital: "+bahrein.getNombreCapital()+"</p>")
    document.write("<p>Cantidad Poblacion: "+info[1]+"</p>")
    document.write("<p>Religión Mayoritaria: "+info[3]+"</p>")
    document.write("<p>Forma de gobierno: "+info[2]+"</p>")
    document.write("<p>Nombre Circuito: "+info[0]+"</p>")

    bahrein.writeCoordenadaMeta()
}
