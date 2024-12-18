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
        self.width = "100%"
        self.height = "auto"
        self.viewBox = "0 0 "+str(width)+" "+str(height)
        self.preserveAspectRatio = "xMidYMid meet"
        self.raiz = ET.Element('svg', {
            'xmlns': "http://www.w3.org/2000/svg",
            'viewBox': str(self.viewBox),
            'preserveAspectRatio':str(self.preserveAspectRatio)
        })

    def addPolyline(self, points: list):
        
        ET.SubElement(self.raiz, 'polyline', {
            'points': points,
            'vector-effect': "non-scaling-stroke"
        })

    def escribir(self, nombreArchivoSVG: str):
        arbol = ET.ElementTree(self.raiz)
        arbol.write(nombreArchivoSVG, encoding='utf-8', xml_declaration=True)

    def ver(self):
        print(ET.tostring(self.raiz, encoding="unicode"))


def xmlToSvg(archivoXML, widthSvg=500, hightSvg=500, pointSeparationIndex=5, f=5):
    """Functión para convertir un archivo XML a KML    
Version: 1.0 25/Octubre/2024
Author: Francisco Cimadevilla Cuanda
    """
    try:
        tree = ET.parse('./xml/circuitoEsquema.xml')
    except IOError:
        print ('No se encuentra el archivo ', archivoXML)
        exit()
    except ET.ParseError:
        print("Error procesando en el archivo XML = ", archivoXML)
        exit()
       
    namespace = {'ns': 'http://www.uniovi.es'}   

    root = tree.getroot() 

    tramos = root.findall('.//ns:tramo', namespaces=namespace)

    pointsStr = ""
    ratio = pointSeparationIndex
    for tramo in tramos:
        coordenada = tramo.find('ns:coordenada', namespaces=namespace)
        coo_altitud = coordenada.find('ns:cooAltitud', namespaces=namespace).text
        pointsStr = pointsStr + str(ratio*f)+','+str(float(coo_altitud)*f)+' '
        ratio+=pointSeparationIndex
   
    newFile = Svg(hightSvg, widthSvg)
    points = (pointsStr)
    newFile.addPolyline(points=points, fill_color='lightblue', stroke_color='green')
    return newFile

def main():
    """Inicia el proceso de conversion de XML a KML"""
    
    print(xmlToSvg.__doc__)
    
    output_kml_File = input('Introduzca el nombre del fichero SVG destino = ')
    
    procesado = xmlToSvg("circuitoEsquema.xml",150,1000,5)


    procesado.ver()
    procesado.escribir(output_kml_File)
    
    print('Archivo ',output_kml_File, ' procesado')

    

if __name__ == "__main__":
    main()    
