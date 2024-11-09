class Fondo{
    constructor(pais, capital, circuito){
        this.pais = pais
        this.capital = capital
        this.circuito = circuito

        this.searchBackground()
    }

    searchBackground(){
        let flickrAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?"
        $.getJSON(
            flickrAPI, {
                api_key:"35b9e8e93483312c8dd3f954a50bcbd8",
                user_id: "201763060@N07",
                tags: "F1, shakir",
                sort:"interestingness-desc",
                format: "json"
            }
        ).done(function (data) {

            const imgs = data.items;

            /**
             * Local function to just show images that are horizontal (i.e. width > height)
             * An image is taken randomly from the array of images searched
             * Note: the attr onload is async
             */
            function tryLoadImage() {
                let img = new Image();
                let randomIndex = Math.floor(Math.random() * imgs.length);
                img.src = imgs[randomIndex].media.m;

                img.onload = function() {
                    if (img.width > img.height) { 
                        $("<img />").attr("src", img.src).appendTo("body section");
                    } else {
                        tryLoadImage(); 
                    }
                };
            }
            tryLoadImage(); 
        })
        
    }
}

