let page = /(\?|&)page=([^&]+)/.exec(document.location.search)[2];
if (page) {
    console.log("Loading", page, "...");
    import("./" + page);
}
setTimeout(() => {
    document.body.insertAdjacentHTML("beforeend", `
    <div style="
        position: fixed;
        left: 15px;
        top: 5px;
    ">
    <a href="?page=getting-started">Getting started</a>
    <a href="?page=color-material">Color material</a>
    <a href="?page=instancing">Instancing</a>
    <a href="?page=lighting">Lighting</a>
    <a href="?page=mesh-geometry">Mesh-geometry</a>
    <a href="?page=mesh-interact">Mesh-interact</a>
    <a href="?page=model-viewer">Model-viewer</a>
    <a href="?page=pbr">Pbr</a>
    <a href="?page=post-processing-sprite">Post-processing-sprite</a>
    <a href="?page=quick-guide">Quick-guide</a>
    <a href="?page=sprites">Sprites</a>
    <a href="?page=water-effect">Water-effect</a>
    </div>
    `);
})
