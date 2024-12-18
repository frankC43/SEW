import xml.etree.ElementTree as ET

class Kml(object):
    """
    Genera archivo KML con puntos y líneas
    @version 1.0 17/Noviembre/2023
    @author: Juan Manuel Cueva Lovelle. Universidad de Oviedo
    """
    def __init__(self):
        """
        Crea el elemento raíz y el espacio de nombres
        """
        self.raiz = ET.Element('kml', xmlns="http://www.opengis.net/kml/2.2")
        self.doc = ET.SubElement(self.raiz,'Document')

    def addPlacemark(self,nombre,descripcion,long,lat,alt, modoAltitud):
        """
        Añade un elemento <Placemark> con puntos <Point>
        """
        pm = ET.SubElement(self.doc,'Placemark')
        ET.SubElement(pm,'name').text = '\n' + nombre + '\n'
        ET.SubElement(pm,'description').text = '\n' + descripcion + '\n'
        punto = ET.SubElement(pm,'Point')
        ET.SubElement(punto,'coordinates').text = '\n{},{},{}\n'.format(long,lat,alt)
        ET.SubElement(punto,'altitudeMode').text = '\n' + modoAltitud + '\n'

    def addLineString(self,nombre,extrude,tesela, listaCoordenadas, modoAltitud, color, ancho):
        """
        Añade un elemento <Placemark> con líneas <LineString>
        """
        ET.SubElement(self.doc,'name').text = '\n' + nombre + '\n'
        pm = ET.SubElement(self.doc,'Placemark')
        ls = ET.SubElement(pm, 'LineString')
        ET.SubElement(ls,'extrude').text = '\n' + extrude + '\n'
        ET.SubElement(ls,'tessellation').text = '\n' + tesela + '\n'
        ET.SubElement(ls,'coordinates').text = '\n' + listaCoordenadas + '\n'
        ET.SubElement(ls,'altitudeMode').text = '\n' + modoAltitud + '\n' 

        estilo = ET.SubElement(pm, 'Style')
        linea = ET.SubElement(estilo, 'LineStyle')
        ET.SubElement (linea, 'color').text = '\n' + color + '\n'
        ET.SubElement (linea, 'width').text = '\n' + ancho + '\n'

    def escribir(self,nombreArchivoKML):
        """
        Escribe el archivo KML con declaración y codificación
        """
        arbol = ET.ElementTree(self.raiz)
        arbol.write(nombreArchivoKML, encoding='utf-8', xml_declaration=True)
    
    def ver(self):
        """
        Muestra el archivo KML. Se utiliza para depurar
        """
        print("\nElemento raiz = ", self.raiz.tag)

        if self.raiz.text != None:
            print("Contenido = "    , self.raiz.text.strip('\n')) #strip() elimina los '\n' del string
        else:
            print("Contenido = "    , self.raiz.text)
        
        print("Atributos = "    , self.raiz.attrib)

        # Recorrido de los elementos del árbol
        for hijo in self.raiz.findall('.//'): # Expresión XPath
            print("\nElemento = " , hijo.tag)
            if hijo.text != None:
                print("Contenido = ", hijo.text.strip('\n')) 
            else:
                print("Contenido = ", hijo.text)    
            print("Atributos = ", hijo.attrib)

def xmlToKml(archivoXML, archivoKML):
    """Functión para convertir un archivo XML a KML
    
Version: 1.0 25/Octubre/2024
Author: Francisco Cimadevilla Cuanda
    """
    try:
        
        arbol = ET.parse(archivoXML)
    except IOError:
        print ('No se encuentra el archivo ', archivoXML)
        exit()
    except ET.ParseError:
        print("Error procesando en el archivo XML = ", archivoXML)
        exit()
       
    namespace = {'ns': 'http://www.uniovi.es'}   

    tree = ET.parse('circuitoEsquema.xml')
    root = tree.getroot() 

    tramos = root.findall('.//ns:tramo', namespaces=namespace)

    line = ""
    for tramo in tramos:
        tipo = tramo.get('tipo')
        longitud = tramo.find('ns:longitud', namespaces=namespace).text
        coordenada = tramo.find('ns:coordenada', namespaces=namespace)
        coo_longitud = coordenada.find('ns:cooLongitud', namespaces=namespace).text
        coo_latitud = coordenada.find('ns:cooLatitud', namespaces=namespace).text
        coo_altitud = coordenada.find('ns:cooAltitud', namespaces=namespace).text
        numero_tramo = tramo.find('ns:numeroTramo', namespaces=namespace).text
        line = line + str(coo_longitud)+','+str(coo_latitud)+','+str(coo_altitud)+'\n'

    
    lista_tramos = []
   
    newKml = Kml()

    pointLines = (line)
    newKml.addLineString("Circuito Bahreín", "1","1",pointLines,'absolute','ff0000ff',"5")
    return newKml


def main():
    """Inicia el proceso de conversion de XML a KML"""
    
    print(xmlToKml.__doc__)
    
    output_kml_File = input('Introduzca el nombre del fichero KML destino = ')
    
    kmlProcesado = xmlToKml("circuitoEsquema.xml", output_kml_File)


    kmlProcesado.ver()
    kmlProcesado.escribir(output_kml_File)
    
    print('Archivo ',output_kml_File, ' procesado')

    

if __name__ == "__main__":
    main()    
