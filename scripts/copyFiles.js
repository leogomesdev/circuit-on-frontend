import { remove, copy as _copy } from "fs-extra";

(async () => {
    const src = "./dist";
    const copy = "./netlify/functions/dist";

    await remove(copy);
    await _copy(src, copy);
})();