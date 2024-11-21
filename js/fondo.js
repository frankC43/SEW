class Fondo{
    constructor(pais, capital, circuito){
        this.pais = pais
        this.capital = capital
        this.circuito = circuito

        this.searchBackground()
    }

    searchBackground(){
        let flickrAPI = "https://www.flickr.com/services/rest/?"
        $.getJSON(
            flickrAPI, {
                method: "flickr.photos.search",
                api_key:"35b9e8e93483312c8dd3f954a50bcbd8",
               // user_id: "201763060@N07",
                text: this.circuito+" F1",
                per_page:1,
                page:1,
                tags: this.pais,
                format: "json",
                nojsoncallback:1
            }
        ).done(function (data) {

            const imgs = data.photos.photo;
            let src = imgs[0];
            /*
                Formato de URL único para el tamaño de imagen grande
                https://live.staticflickr.com/{server-id}/{id}_{secret}_b.jpg
            */
            let url = "https://live.staticflickr.com/"+src.server+"/"+src.id+"_"+src.secret+"_b.jpg"
            $("html").css("height", "100%")
            $("body")
                .css("background-image", "url('"+url+"')")
                .css("background-position","center")
                .css("background-repeat","no-repeat")
                .css("background-size","cover")

            
        })
        
    }
}

const img = new Fondo("Shakir", "Bahrein", "Bahrain International Circuit")

