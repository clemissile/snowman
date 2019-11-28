import Case from "../../Case/Case.vue";

export default {
    name: "Plateau",
    components: {
        Case
    },
    props: {
        "grille": {
            type: Array,
            default: function () {
                return []
            }
        }
    }
}