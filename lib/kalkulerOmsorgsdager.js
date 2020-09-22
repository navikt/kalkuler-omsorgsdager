"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.beregnOmsorgsdager = exports.sumOverføringsdager = exports.effektiveOverføringsdager = exports.aleneomsorgsdager = exports.aleneomsorgKroniskSykeDager = exports.kroniskSyktDager = exports.grunnrettsdager = exports.erPositivtHeltall = exports.ALENEOMSORGDAGER_3_ELLER_FLERE_BARN = exports.ALENEOMSORGDAGER_1_2_BARN = exports.ALENEOMSORG_KRONISK_SYKT_BARN_DAGER = exports.KRONISK_SYKT_BARN_DAGER = exports.GRUNNRETTSDAGER_3_ELLER_FLER_BARN = exports.GRUNNRETTSDAGER_1_2_BARN = void 0;
const Barn_1 = require("./types/Barn");
exports.GRUNNRETTSDAGER_1_2_BARN = 10;
exports.GRUNNRETTSDAGER_3_ELLER_FLER_BARN = 15;
exports.KRONISK_SYKT_BARN_DAGER = 10;
exports.ALENEOMSORG_KRONISK_SYKT_BARN_DAGER = exports.KRONISK_SYKT_BARN_DAGER * 2;
exports.ALENEOMSORGDAGER_1_2_BARN = 10;
exports.ALENEOMSORGDAGER_3_ELLER_FLERE_BARN = 15;
exports.erPositivtHeltall = (value) => {
    if (!value) {
        return true;
    }
    if (value < 0) {
        return false;
    }
    if (value % 1 !== 0) {
        return false;
    }
    return true;
};
const harOmsorg = (barn) => !!(barn.alder === Barn_1.AlderType.UNDER12 || barn.kroniskSykt);
exports.grunnrettsdager = (barn, inkluderKoronadager) => {
    const antallTellendeBarn = barn.filter(harOmsorg).length;
    if (antallTellendeBarn === 0) {
        return { normaldager: 0, koronadager: 0 };
    }
    const koronafaktor = inkluderKoronadager ? 1 : 0;
    if (antallTellendeBarn < 3) {
        return {
            normaldager: exports.GRUNNRETTSDAGER_1_2_BARN,
            koronadager: exports.GRUNNRETTSDAGER_1_2_BARN * koronafaktor,
        };
    }
    return {
        normaldager: exports.GRUNNRETTSDAGER_3_ELLER_FLER_BARN,
        koronadager: exports.GRUNNRETTSDAGER_3_ELLER_FLER_BARN * koronafaktor,
    };
};
exports.kroniskSyktDager = (barn, inkluderKoronadager) => {
    const kroniskOgDeltOmsorg = barn.filter((b) => b.kroniskSykt && !b.søkerHarAleneomsorgFor);
    const dager = exports.KRONISK_SYKT_BARN_DAGER * kroniskOgDeltOmsorg.length;
    const koronafaktor = inkluderKoronadager ? 1 : 0;
    return { normaldager: dager, koronadager: dager * koronafaktor };
};
exports.aleneomsorgKroniskSykeDager = (barn, inkluderKoronadager) => {
    const kroniskOgAleneomsorg = barn.filter((b) => b.kroniskSykt && b.søkerHarAleneomsorgFor);
    const dager = exports.ALENEOMSORG_KRONISK_SYKT_BARN_DAGER * kroniskOgAleneomsorg.length;
    const koronafaktor = inkluderKoronadager ? 1 : 0;
    return { normaldager: dager, koronadager: dager * koronafaktor };
};
exports.aleneomsorgsdager = (barn, inkluderKoronadager) => {
    const antallTellendeBarn = barn
        .filter(harOmsorg)
        .filter((b) => b.søkerHarAleneomsorgFor).length;
    const koronafaktor = inkluderKoronadager ? 1 : 0;
    if (antallTellendeBarn === 0) {
        return { normaldager: 0, koronadager: 0 };
    }
    if (antallTellendeBarn < 3) {
        return {
            normaldager: exports.ALENEOMSORGDAGER_1_2_BARN,
            koronadager: exports.ALENEOMSORGDAGER_1_2_BARN * koronafaktor,
        };
    }
    return {
        normaldager: exports.ALENEOMSORGDAGER_3_ELLER_FLERE_BARN,
        koronadager: exports.ALENEOMSORGDAGER_3_ELLER_FLERE_BARN * koronafaktor,
    };
};
const bareGyldigeDager = (forelder) => {
    var _a, _b, _c, _d;
    return [
        (_a = forelder.normaldager) === null || _a === void 0 ? void 0 : _a.dagerTildelt,
        (_b = forelder.normaldager) === null || _b === void 0 ? void 0 : _b.dagerFått,
        (_c = forelder.koronadager) === null || _c === void 0 ? void 0 : _c.dagerFått,
        (_d = forelder.koronadager) === null || _d === void 0 ? void 0 : _d.dagerTildelt,
    ].every((dager) => exports.erPositivtHeltall(dager || 0));
};
exports.effektiveOverføringsdager = ({ overførteKoronadager, mottatteKoronadager, fordelteNormaldager, mottatteNormaldager, }, grunnrettsdager, inkluderKoronadager) => {
    const dagerMottattEtterGrunnretten = mottatteNormaldager > grunnrettsdager
        ? mottatteNormaldager - grunnrettsdager
        : 0;
    return {
        koronadager: inkluderKoronadager
            ? mottatteKoronadager - overførteKoronadager
            : 0,
        normaldager: dagerMottattEtterGrunnretten - fordelteNormaldager,
    };
};
exports.sumOverføringsdager = (foreldre, inkluderKoronadager) => foreldre.filter(bareGyldigeDager).reduce((tmpDager, forelder) => {
    var _a, _b, _c, _d;
    return ({
        overførteKoronadager: inkluderKoronadager
            ? tmpDager.overførteKoronadager +
                (((_a = forelder.koronadager) === null || _a === void 0 ? void 0 : _a.dagerTildelt) || 0)
            : 0,
        mottatteKoronadager: inkluderKoronadager
            ? tmpDager.mottatteKoronadager + (((_b = forelder.koronadager) === null || _b === void 0 ? void 0 : _b.dagerFått) || 0)
            : 0,
        mottatteNormaldager: tmpDager.mottatteNormaldager + (((_c = forelder.normaldager) === null || _c === void 0 ? void 0 : _c.dagerFått) || 0),
        fordelteNormaldager: tmpDager.fordelteNormaldager +
            (((_d = forelder.normaldager) === null || _d === void 0 ? void 0 : _d.dagerTildelt) || 0),
    });
}, {
    overførteKoronadager: 0,
    mottatteKoronadager: 0,
    mottatteNormaldager: 0,
    fordelteNormaldager: 0,
});
exports.beregnOmsorgsdager = (barn = [], inkluderKoronadager) => {
    const barnMinimumUtfylt = barn.filter((b) => b.alder);
    return {
        grunnrett: exports.grunnrettsdager(barnMinimumUtfylt, inkluderKoronadager),
        kroniskSykt: exports.kroniskSyktDager(barnMinimumUtfylt, inkluderKoronadager),
        aleneomsorg: exports.aleneomsorgsdager(barnMinimumUtfylt, inkluderKoronadager),
        aleneomsorgKroniskSyke: exports.aleneomsorgKroniskSykeDager(barnMinimumUtfylt, inkluderKoronadager),
    };
};
