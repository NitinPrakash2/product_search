import { createApp } from "vue";
import "primeicons/primeicons.css";
import type { _p_TYP, _$p_TYP } from "../shared/types";
import Comp from "./ProductForm.vue";

const index = async (_p: _p_TYP) => {
    return {
        set: async (_$p: _$p_TYP) => {
            console.log(`--custom:form [${_$p[`data`][`curr`].type}]`);

            setTimeout(() => {
                const vueRoot = document.getElementById(_p.f.name("vue-root"));
                const anchor = vueRoot ?? document.getElementById("app") ?? document.body;

                const formDiv = document.createElement("div");
                formDiv.id = _p.f.name("custom-form-root");
                anchor.insertAdjacentElement("afterend", formDiv);

                createApp(Comp, { _p, _$p }).mount(formDiv);
            }, 350);

            return { r: ``, style: `` };
        },
    };
};

export { index, index as custom };
