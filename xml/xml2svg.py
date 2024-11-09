import xml.etree.ElementTree as ET

class Svg:
    """
    Genera un archivo SVG con líneas y puntos
    @version 1.0
    @Author Francisco Cimadevilla Cuanda
    """

    def __init__(self, width: int = 500, height: int = 210):
        """
        Generate an SVG
        """
        self.width = width
        self.height = height
        self.raiz = ET.Element('svg', {
            'xmlns': "http://www.w3.org/2000/svg",
            'width': str(self.width),
            'height': str(self.height)
        })

    def addPolyline(self, points: list, stroke_color: str = 'red', stroke_width: str = '3', fill_color: str = 'none'):
        
        polyline = ET.SubElement(self.raiz, 'polyline', {
            'points': points,
            'style': f"fill:{fill_color};stroke:{stroke_color};stroke-width:{stroke_width}"
        })

    def escribir(self, nombreArchivoSVG: str):
        arbol = ET.ElementTree(self.raiz)
        arbol.write(nombreArchivoSVG, encoding='utf-8', xml_declaration=True)

    def ver(self):
        print(ET.tostring(self.raiz, encoding="unicode"))


def xmlToSvg(archivoXML, archivoSvg, widthSvg=500, hightSvg=500, pointSeparationIndex=5):
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

    pointsStr = ""
    ratio = pointSeparationIndex
    for tramo in tramos:
        tipo = tramo.get('tipo')
        longitud = tramo.find('ns:longitud', namespaces=namespace).text
        coordenada = tramo.find('ns:coordenada', namespaces=namespace)
        coo_longitud = coordenada.find('ns:cooLongitud', namespaces=namespace).text
        coo_latitud = coordenada.find('ns:cooLatitud', namespaces=namespace).text
        coo_altitud = coordenada.find('ns:cooAltitud', namespaces=namespace).text
        numero_tramo = tramo.find('ns:numeroTramo', namespaces=namespace).text
        pointsStr = pointsStr + str(ratio)+','+str(coo_altitud)+' '
        ratio+=pointSeparationIndex
   
    newFile = Svg(hightSvg, widthSvg)
    points = (pointsStr)
    newFile.addPolyline(points=points, fill_color='lightblue', stroke_color='green')
    return newFile

def main():
    """Inicia el proceso de conversion de XML a KML"""
    
    print(xmlToSvg.__doc__)
    
    output_kml_File = input('Introduzca el nombre del fichero SVG destino = ')
    
    procesado = xmlToSvg("circuitoEsquema.xml", output_kml_File,170,100,5)


    procesado.ver()
    procesado.escribir(output_kml_File)
    
    print('Archivo ',output_kml_File, ' procesado')

    

if __name__ == "__main__":
    main()    
