export default function(data) {
    return {
        layout: data["coming-soon"] ? "layouts/comingsoonlayout.njk" : "layouts/home.njk"
    }
}