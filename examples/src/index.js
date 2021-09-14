let pageQuery = /(\?|&)page=([^&]+)/.exec(document.location.search);
let page = pageQuery ? pageQuery[2] : "getting-started";
console.log("Loading", page, "...");
import("./" + page);

setTimeout(() => {
    let html = []
    html.push(`<style>    
        div.menu {
            background-color: #5a9dd661;
            padding: 5px 270px 5px 10px;
        }
        div.menu > a {
            background-color: #69b9f9;
            padding: 6px;
            border-radius: 8px;
            display: inline-block;
            margin: 4px;
            text-decoration: none;
        } 
        div.menu > a.active {
            background-color: #8353c1;
            color: white;
            font-weight: bold;            
        }       
    </style>`);
    html.push(`<div class="menu">`);
    let pages = {
        "getting-started": "Getting started",
        "color-material": "Color material",
        "instancing": "Instancing",
        "lighting": "Lighting",
        "mesh-geometry": "Mesh-geometry",
        "mesh-interact": "Mesh-interact",
        "model-viewer": "Model-viewer",
        "pbr": "Pbr",
        "post-processing-sprite": "Post-processing-sprite",
        "quick-guide": "Quick-guide",
        "sprites": "Sprites",
        "water-effect": "Water-effect"
    };
    Object.keys(pages).forEach(url => {
        let klass = (url == page) ? 'active' : '';
        html.push(`<a href="?page=${encodeURI(url)}" class="${klass}">${pages[url]}</a>`);
    });
    html.push(`</div>`);
    document.body.insertAdjacentHTML("beforeend", html.join('\n'));
})
