import { createApp } from "vue";
import type { _p_TYP, _$p_TYP } from "../shared/types";
import Comp from "./index.vue";
import { custom } from "../custom";

const index = async (_p:_p_TYP) => {
    return {
        set: async (_$p:_$p_TYP,) => {
            console.log(`--hydrator [${String(_$p[`data`][`curr`].type).replace(/[\r\n\t]/g, '')}]`);

            //set..
            const props = { _p, _$p };
            const app = createApp(Comp, props);

            //set..
            const _$r = {
                r: ``,
                style: ``,
                evt: {
                    change: () => {
                        _p.f.call("msg", {
                            type: `change`,
                            _p,
                            _$p,
                            custom: {},
                        });
                    }
                }
            };

            const mountEl = document.getElementById(_p.f.name("vue-root"));
            app.mount(mountEl!);

            // mount custom form — pass exact same _p so event bus is shared
            const _custom = await custom(_p);
            await _custom.set(_$p);

            return _$r;
        },
    };
}

export { index, index as hydrator }
